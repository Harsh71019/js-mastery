# Execution Time Tracking + GitHub-Style Activity Graph

## Overview

Track the wall-clock execution time of every problem run, store it on solve, and surface it
as two visualizations: a GitHub-style calendar heatmap (problems solved per day over 52 weeks)
and an execution-time trend chart (per-problem timing, filterable by category/difficulty).

---

## What We're Measuring

"Execution time" here is **wall-clock time from when the iframe is created to when the sandbox
posts its `results` message back**. This is the metric the user can understand and act on
(slow code → longer bar). We do **not** measure V8 CPU time — that requires a trusted context
and adds complexity without meaningful UX gain for this app.

The measurement lives entirely in `runTests()` in `client/src/runner/executor.ts`. One
`Date.now()` call before the iframe is appended, one in the `onMessage` handler. Δ = execution
time in milliseconds. This value travels up to the solve handler and is sent to the server only
when all tests pass.

---

## Data Model Changes

### Server — `SolvedEntry` (Progress model)

```typescript
// server/src/models/Progress.ts  — SolvedEntrySchema additions
executionTimeMs: { type: Number }        // wall-clock ms, undefined if not yet timed
runCount:        { type: Number, default: 1 }   // how many times the user ran the problem total
```

`runCount` is incremented on every `POST /api/progress/attempt/:id` (already exists) AND on
solve. This lets the execution-time trend chart show "first-pass speed vs. re-attempt speed"
later, but costs nothing now.

### Server — new `ActivityDay` virtual (no new collection needed)

Daily activity is **derived** from `solvedProblems` entries by grouping `solvedAt` dates.
No separate collection. The aggregation runs in a utility function and is cached per-request.

---

## New API Endpoints

### `GET /api/progress/activity`

Returns a 371-day (53-week) window of daily solve counts suitable for the calendar heatmap.

**Response shape:**
```json
{
  "days": [
    { "date": "2025-05-08", "count": 3 },
    { "date": "2025-05-09", "count": 0 },
    ...
  ],
  "maxCount": 7,
  "totalSolvedInWindow": 142
}
```

`maxCount` is provided so the client can scale heat intensity without a second pass.
`date` is always `YYYY-MM-DD` (ISO local date, no timezone offset).

**Route rule:** Register before `/:id` at the `progress` router level — already safe since this
lives on a separate `/progress` router, not `/problems`.

### `GET /api/progress/execution-times`

Returns per-problem execution time for all solved problems that have a timing.

**Response shape:**
```json
{
  "entries": [
    {
      "id": "two-sum",
      "title": "Two Sum",
      "category": "arrays",
      "difficulty": "Easy",
      "executionTimeMs": 42,
      "solvedAt": "2025-05-08"
    }
  ]
}
```

Sorted by `solvedAt` ascending so the client can render a chronological trend line without
re-sorting.

### `POST /api/progress/solve/:problemId` — updated body

```typescript
{
  title: string
  category: string
  difficulty: string
  executionTimeMs?: number   // NEW — optional, only present when all tests pass
}
```

The server stores `executionTimeMs` in the matching `SolvedEntry`. If the problem was already
solved before (re-solve), it **updates** the stored time with the latest run — the user improved.

---

## Backend Implementation — Phase 1

### Step 1 — Update `SolvedEntrySchema`

File: `server/src/models/Progress.ts`

Add `executionTimeMs: { type: Number }` and `runCount: { type: Number, default: 1 }` to
`SolvedEntrySchema`. No migration needed — Mongoose treats missing fields as `undefined`,
which is falsy-filtered on the client.

### Step 2 — Update solve route handler

File: `server/src/routes/progress.ts`

In `POST /api/progress/solve/:problemId`:
1. Destructure `executionTimeMs` from `req.body` (validate: must be a positive integer if present).
2. Pass it into the `SolvedEntry` map update.
3. Also increment `runCount` here (alongside the existing `attempts` logic).

No streak utility changes needed — `getUpdatedStreak` is unaffected.

### Step 3 — Add activity utility

File: `server/src/utils/activity.ts` (new)

```typescript
// Derives daily solve counts from a Progress document's solvedProblems Map.
// Returns ActivityDay[] sorted ascending over the last `windowDays` days.
export function getDailyActivity(
  solvedProblems: Map<string, { solvedAt: string }>,
  windowDays: number,
): ActivityDay[]
```

Logic:
- Build a `Set<string>` of every `YYYY-MM-DD` in the window (today − windowDays … today).
- Walk `solvedProblems` entries, parse `solvedAt`, bucket into a `Map<date, count>`.
- Return the full window with 0-filled gaps (required so the calendar grid renders correctly).

### Step 4 — Add activity + execution-time route handlers

File: `server/src/routes/progress.ts`

Register both new GETs **above** the `DELETE /api/progress` handler to avoid any route-order
issues. Both are read-only and require no body parsing.

---

## Frontend Implementation — Phase 2

### Step 1 — Instrument `runTests`

File: `client/src/runner/executor.ts`

```typescript
// Updated return type
export interface ExecutionResult {
  readonly results: readonly TestResult[]
  readonly timedOut: boolean
  readonly executionTimeMs: number   // NEW — 0 on timeout
}
```

In `runTests`:
```typescript
const startTime = Date.now()

// ... existing iframe setup ...

const onMessage = (event: MessageEvent): void => {
  if (event.source !== (iframe.contentWindow as unknown)) return
  if (event.data?.type !== 'results') return
  settle({
    results: event.data.results as TestResult[],
    timedOut: false,
    executionTimeMs: Date.now() - startTime,   // NEW
  })
}

// In timeout handler:
settle({ results: [...], timedOut: true, executionTimeMs: 0 })
```

No other file breaks — `executionTimeMs` is an additive field.

### Step 2 — Thread `executionTimeMs` through the solve flow

The call chain is:
```
ProblemPage (or wherever runTests is called)
  → executionResult.executionTimeMs
    → markSolved(id, meta, executionTimeMs)    ← store action
      → POST /api/progress/solve/:id  { ...meta, executionTimeMs }
```

**Store change** (`client/src/store/useProgressStore.ts`):

```typescript
// SolvedEntry client type — add field
executionTimeMs?: number

// markSolved signature update
markSolved: (id: string, meta: SolveMeta, executionTimeMs?: number) => void
```

Pass `executionTimeMs` in the POST body. The store's optimistic update stores it locally
immediately; the server echoes it back in the full-state response and the store hydrates.

### Step 3 — New hooks

**`client/src/hooks/useActivityGraph.ts`**

```typescript
// Fetches /api/progress/activity and returns:
// { days: ActivityDay[], maxCount: number, isLoading: boolean, error: string | null }
```

Uses a standard fetch with `AbortController` on unmount. No caching needed — the data is
cheap to compute and changes only when the user solves a problem.

**`client/src/hooks/useExecutionTimes.ts`**

```typescript
// Fetches /api/progress/execution-times and returns:
// { entries: ExecutionTimeEntry[], isLoading: boolean, error: string | null }
```

---

## Frontend Components — Phase 3

### `ActivityGraph` component

File: `client/src/components/ActivityGraph.tsx`

**Layout:**
- 53 columns × 7 rows grid (Sunday → Saturday).
- Each cell is a `12 × 12` square with `2px` gap — matching GitHub's proportions.
- Color scale: 5 intensity levels (0, 1–2, 3–4, 5–6, 7+) mapped to Tailwind bg colors.
  - `bg-surface-muted` (0 solves)
  - `bg-emerald-900` (1–2)
  - `bg-emerald-700` (3–4)
  - `bg-emerald-500` (5–6)
  - `bg-emerald-300` (7+)
- Month labels above columns (Jan, Feb … Dec).
- Day labels left of rows (Mon, Wed, Fri — matching GitHub's sparse labeling).
- Tooltip on hover: `"{count} problems solved on {date}"`, positioned with CSS `title` attr
  (no library needed for MVP; replace with a portal tooltip in Phase 4 if needed).
- Total activity count rendered below: `"142 problems solved in the last year"`.

**Props:**
```typescript
interface ActivityGraphProps {
  readonly days: readonly ActivityDay[]
  readonly maxCount: number
  readonly totalSolvedInWindow: number
}
```

**Grid construction** (inside a `useMemo`):
1. Find the Sunday on or before 371 days ago → `startSunday`.
2. Build a 53-element array of weeks; each week is 7 days.
3. Map each day to its `ActivityDay` data (or `count: 0` if missing).
4. Render as CSS Grid with `grid-template-columns: repeat(53, 1fr)`.

The grid is `column-first` — CSS Grid renders left-to-right by default, so we need
`grid-auto-flow: column` and `grid-template-rows: repeat(7, 1fr)`.

### `ExecutionTimeChart` component

File: `client/src/components/ExecutionTimeChart.tsx`

**Layout:**
- Horizontal bar chart (no library — pure SVG or divs).
- Each row: `[problem title] ████████ 42ms`.
- Bars are sized proportionally to `max(executionTimeMs)` in the visible set.
- Color-coded by difficulty: Beginner=emerald, Easy=sky, Medium=amber, Hard=rose.
- Sort toggle: by date (chronological) | by time (fastest → slowest) | by difficulty.
- Filter row: category chips (all | arrays | strings | …).
- Shows last 20 entries by default with a "Show all" toggle.

**Props:**
```typescript
interface ExecutionTimeChartProps {
  readonly entries: readonly ExecutionTimeEntry[]
}
```

**No external charting library** — the bars are just `div` widths computed as a percentage.

---

## Stats/Dashboard Integration — Phase 4

### Where to surface these components

**Option A — Dedicated `/stats` route** (recommended for Phase 4)
- Add `<Route path="/stats" element={<StatsPage />} />` to the router.
- `StatsPage` composes `ActivityGraph` + `ExecutionTimeChart` + existing streak/count stats.
- Navigation link in the sidebar/nav bar.

**Option B — Dashboard section below the problem list**
- Cheaper to wire up but clutters the main view.

Go with Option A. `StatsPage` is a pure composition page — no business logic, just hooks
and component arrangement.

**`client/src/pages/StatsPage.tsx`** structure:
```
StatsPage
├── StatsHeader          — "Your Progress" heading + streak badges
├── ActivityGraph        — 52-week heatmap
├── ExecutionTimeChart   — timing trend
└── CategoryBreakdown    — pie/donut of solved by category (future, Phase 5)
```

---

## File Change Inventory

### Server

| File | Change |
|---|---|
| `server/src/models/Progress.ts` | Add `executionTimeMs`, `runCount` to `SolvedEntrySchema` |
| `server/src/routes/progress.ts` | Accept `executionTimeMs` in solve handler; add activity + execution-times GET routes |
| `server/src/utils/activity.ts` | **New** — `getDailyActivity()` utility |
| `server/src/utils/serializeProgress.ts` | Include `executionTimeMs`, `runCount` in serialized output |

### Client

| File | Change |
|---|---|
| `client/src/runner/executor.ts` | Add `executionTimeMs` to `ExecutionResult`; measure in `runTests` |
| `client/src/types/problem.ts` | Add `executionTimeMs?: number` to `SolvedEntry` type |
| `client/src/store/useProgressStore.ts` | Add `executionTimeMs` to `markSolved` signature + POST body |
| `client/src/hooks/useActivityGraph.ts` | **New** — fetch `/api/progress/activity` |
| `client/src/hooks/useExecutionTimes.ts` | **New** — fetch `/api/progress/execution-times` |
| `client/src/components/ActivityGraph.tsx` | **New** — GitHub-style calendar heatmap |
| `client/src/components/ExecutionTimeChart.tsx` | **New** — horizontal bar chart |
| `client/src/pages/StatsPage.tsx` | **New** — composes both components |
| `client/src/App.tsx` (or router file) | Add `/stats` route |
| `client/src/components/Sidebar.tsx` (or nav) | Add "Stats" nav link |

---

## Phase Summary

| Phase | Scope | Outcome |
|---|---|---|
| **1** | Backend model + solve route update | `executionTimeMs` stored in MongoDB on solve |
| **2** | Backend activity + execution-times endpoints | Two new GET routes returning analytics data |
| **3** | Frontend executor instrumentation | `runTests` returns `executionTimeMs` |
| **4** | Frontend store + solve call update | `executionTimeMs` sent to server on solve |
| **5** | `ActivityGraph` component | GitHub-style heatmap renders with real data |
| **6** | `ExecutionTimeChart` component | Bar chart of timing per problem |
| **7** | `StatsPage` + routing + nav link | Everything wired together and navigable |

Phases 1–2 are pure backend and can be done in one PR.
Phases 3–4 are a small, focused frontend change touching only the executor and store.
Phases 5–7 are additive UI with no risk to existing features.

---

## Edge Cases and Constraints

| Scenario | Handling |
|---|---|
| Problem solved before timing was added | `executionTimeMs` is `undefined` — chart skips it, no bar rendered |
| Re-solve after improving speed | Server overwrites `executionTimeMs` with the latest run |
| Timeout (5000ms) | `executionTimeMs: 0` is sent; server should treat `0` as "no data" (don't store) |
| User has never solved anything | `ActivityGraph` renders all-grey 371 days; `ExecutionTimeChart` shows empty state message |
| `solvedAt` missing/malformed in old entries | `getDailyActivity` skips entries where `Date.parse(solvedAt)` returns `NaN` |
| Very fast execution (<1ms) | `Date.now()` resolution is 1ms; store as `1` minimum to avoid `0` being treated as timeout |
| 53rd partial week at end of grid | Render cells as empty (transparent) — grid still has 7 slots, unused ones are blank |

---

## Non-Goals for This Feature

- Real CPU profiling (requires SharedArrayBuffer / `performance.now()` in the iframe — blocked by sandbox flags).
- Per-test-case timing breakdown.
- Comparing timing against other users (no multi-user support yet).
- Persisting raw timing history (only latest run is stored per problem).
- External charting libraries — everything is custom CSS/SVG to stay within the approved stack.
