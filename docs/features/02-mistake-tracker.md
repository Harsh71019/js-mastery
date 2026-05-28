# Feature 02 — Mistake Pattern Tracker

## Goal

Track *failed* run attempts separately from successful ones. Identify which `patternTag` values a user consistently struggles with. Surface weak patterns on the dashboard, weight them higher in the review queue, and show a subtle warning on problem pages when a user is about to attempt a historically difficult pattern.

---

## How It Works (User Flow)

1. User runs code → tests fail → `failedAttempts` increments for that problem
2. User eventually solves it (or never does) — failure data is kept
3. Dashboard shows: *"You consistently struggle with: closures, two-pointer"*
4. Review queue automatically bumps those pattern problems to the top
5. On any problem page whose `patternTag` is a weak spot → small warning badge appears
6. Stats page shows a full failure-rate breakdown by pattern

---

## Backend

### Model Changes

**`SolvedEntry`** (in `server/src/models/Progress.ts`) — add:

```ts
failedAttempts: { type: Number, default: 0 }
```

This tracks failed runs *before* solving. Incremented separately from `attempts` (which counts all runs including the successful solve run).

---

**`Progress`** model — add a second map for *attempted but never solved* problems:

```ts
attemptedProblems: {
  type: Map,
  of: new Schema({
    failedAttempts:    { type: Number, default: 0 },
    lastAttemptedAt:   { type: String },
    patternTag:        { type: String },
    category:          { type: String },
    title:             { type: String },
  }, { _id: false }),
  default: {}
}
```

This captures problems a user is grinding on but hasn't solved yet — important for the weak-pattern calculation.

---

### Route Changes

**`POST /api/progress/attempt/:problemId`** — extend request body

Current body: `{ executionTimeMs?: number }`
New body: `{ executionTimeMs?: number, failed: boolean, patternTag?: string, category?: string, title?: string }`

Logic changes:
- If `failed: true` AND problem is already solved → increment `failedAttempts` on `SolvedEntry`
- If `failed: true` AND problem is NOT solved → upsert into `attemptedProblems` map, increment `failedAttempts` there
- If `failed: false` (successful run) → existing behaviour unchanged

---

**`GET /api/progress/weak-patterns`** — new route

Returns patterns ranked by failure rate.

Algorithm:
1. Collect all `failedAttempts` across `solvedProblems` + `attemptedProblems`
2. Group by `patternTag`
3. For each tag: `failureRate = totalFailed / (totalFailed + totalSolved)`
4. Return top results sorted by `failureRate` desc, minimum 3 failed attempts to qualify

Response shape:
```ts
{
  success: true,
  data: Array<{
    patternTag:    string
    failureRate:   number          // 0–1
    totalFailed:   number
    totalSolved:   number
    problemCount:  number          // distinct problems in this pattern
    isWeakSpot:    boolean         // failureRate > 0.4
  }>
}
```

File: `server/src/routes/progress.ts` + `server/src/controllers/progressController.ts`

---

**`GET /api/progress/review-queue`** — extend response

Each item now includes:
```ts
isWeakPattern: boolean   // patternTag appears in top weak spots
```

Sort order: weak-pattern items sorted before non-weak ones (within the due group).

---

### Utility Function

New file: `server/src/utils/weakPatterns.ts`

```ts
export function calculateWeakPatterns(
  solvedProblems: Map<string, SolvedEntry>,
  attemptedProblems: Map<string, AttemptedEntry>
): WeakPattern[]
```

Called by both `GET /api/progress/weak-patterns` and `GET /api/progress/review-queue`.

---

## Frontend

### Store Changes (`client/src/store/useProgressStore.ts`)

`incrementAttempts` signature change:
```ts
incrementAttempts: (
  id: string,
  executionTimeMs?: number,
  failed?: boolean,           // NEW
  meta?: { patternTag?: string; category?: string; title?: string }  // NEW
) => void
```

Add to store state:
```ts
weakPatterns: WeakPattern[]   // populated by loadProgress or separate fetch
```

---

### Hook — `useWeakPatterns` (new file: `client/src/hooks/useWeakPatterns.ts`)

```ts
interface WeakPattern {
  patternTag:   string
  failureRate:  number
  totalFailed:  number
  totalSolved:  number
  isWeakSpot:   boolean
}

export const useWeakPatterns = (): {
  patterns: WeakPattern[]
  isLoading: boolean
  topThree: WeakPattern[]
}
```

Fetches `GET /api/progress/weak-patterns`. Cached for the session.

---

### Component — `WeakSpotsWidget` (new: `client/src/components/progress/WeakSpotsWidget.tsx`)

Lives on the Dashboard, below the stats row.

Displays top 3 weak patterns:
```
┌─────────────────────────────────────────────┐
│  WEAK SPOTS DETECTED                         │
│                                              │
│  closures          ████████░░  78% fail rate │
│  two-pointer       ██████░░░░  61% fail rate │
│  nested-loops      █████░░░░░  54% fail rate │
│                                              │
│  → 3 review problems queued                  │
└─────────────────────────────────────────────┘
```

- Progress bar uses `accent-red` tones
- Clicking a pattern tag navigates to `/patterns/:tag`
- Only renders if at least one pattern has `isWeakSpot: true`

---

### Problem Page — Warning Badge

In `client/src/components/problems/CodingProblemView.tsx`:

- Read `topThree` from `useWeakPatterns()`
- If current problem's `patternTag` is in `topThree`:

```
⚠  You often struggle with this pattern (61% fail rate)
```

Small amber badge below the problem title. Not alarming — informational.

---

### Wire Up Failed Flag on Problem Page

In the run handler inside `CodingProblemView.tsx`:

```ts
// When tests fail:
incrementAttempts(problem.id, executionTimeMs, true /* failed */, {
  patternTag: problem.patternTag,
  category: problem.category,
  title: problem.title,
})

// When tests pass (before markSolved):
incrementAttempts(problem.id, executionTimeMs, false /* succeeded */)
```

---

### Stats Page Addition

New section in `StatsPage.tsx`: **Pattern Failure Analysis**

- Horizontal bar chart (same style as existing charts)
- Shows all patterns with at least 1 failed attempt
- Bars coloured: `accent-green` (low failure) → `accent-amber` → `accent-red` (high failure)
- Table below chart: patternTag / totalFailed / totalSolved / failureRate

---

## Implementation Phases

### Phase 1 — Model + route changes
- Add `failedAttempts` to `SolvedEntry`
- Add `attemptedProblems` map to `Progress`
- Update `POST /api/progress/attempt/:id` to accept `failed` flag

### Phase 2 — Weak patterns endpoint
- `server/src/utils/weakPatterns.ts` calculation
- `GET /api/progress/weak-patterns` route + controller

### Phase 3 — Review queue sorting
- Add `isWeakPattern` to review-queue response
- Sort weak-pattern items first within due group

### Phase 4 — Frontend: pass failed flag
- Update `incrementAttempts` signature in store
- Wire up in problem page run handler

### Phase 5 — Dashboard widget
- `useWeakPatterns` hook
- `WeakSpotsWidget` component on Dashboard

### Phase 6 — Problem page badge + Stats breakdown
- Warning badge in `CodingProblemView`
- Pattern failure chart on StatsPage
