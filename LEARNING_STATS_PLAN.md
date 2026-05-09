# Learning Stats — Implementation Plan

> **Rule**: Mark each phase `[x] Done` before writing code for the next.  
> **Priority**: Zero-backend phases first. Features within a phase are ordered by impact.

---

## Data Map — What Already Exists in the Client Store

Every `SolvedEntry` in `useProgressStore.solvedProblems` carries:

| Field | Type | Notes |
|---|---|---|
| `solvedAt` | `string` (ISO) | Timestamp of first accepted solve |
| `attempts` | `number` | All interactions: runs + submits combined |
| `category` | `CategorySlug` | Set at solve time |
| `difficulty` | `Difficulty` | `Beginner / Easy / Medium / Hard` |
| `reviewInterval` | `number` | 1–64; mastered when `>= 64` |
| `nextReviewDue` | `string` (date) | `yyyy-MM-dd` |
| `executionTimeMs` | `number` | Best accepted execution time |
| `runTimings` | `{ ms, accepted }[]` | Last 20 run/submit timings |

**Nothing new needs to be stored for Phases 1–3.** Phase 4 (Revisit Rate) is the only one requiring a new backend model.

---

## Phase 1 — Zero Backend, Immediate Insight

> These two use only the store, have the highest actionability, and match the recommendation.

---

### Feature 2 · Struggle vs Mastery Ratio

**What it shows**: Buckets every solved problem by how many attempts it took. Tells the user whether they truly understood a problem or brute-forced it.

**Buckets**
| Label | Attempts | Meaning |
|---|---|---|
| Clean | 1–2 | Understood it |
| Struggled | 3–5 | Needed a few tries |
| Grinded | 6+ | Had real difficulty |

> Note: `attempts` counts both Run and Submit interactions. This is still a good signal — a user who solves in 1-2 total interactions clearly understood it.

**Data source**: `solvedProblems[id].attempts` (client store, no fetch needed)

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useMasteryBreakdown.ts` | Derives `{ clean, struggled, grinded, total, byCategory }` from store |
| `client/src/components/stats/MasteryDonut.tsx` | SVG donut chart (3 segments, no library) |
| `client/src/components/stats/MasteryBreakdown.tsx` | Card: donut + counts + category breakdown list |

**Modified files**
- `client/src/pages/StatsPage.tsx` — add `<MasteryBreakdown />` section

**Component design**

```
┌─────────────────────────────────────────────────────────────┐
│  Struggle vs Mastery                                        │
│                                                             │
│    [SVG Donut]       Clean       12  ████████░░░░  60%      │
│   clean=green        Struggled    6  ████░░░░░░░░  30%      │
│   struggled=amber    Grinded      2  █░░░░░░░░░░░  10%      │
│   grinded=red                                               │
│                                                             │
│  By Category                                                │
│  Basic Loops    ●●●○○  3 clean · 1 grinded                  │
└─────────────────────────────────────────────────────────────┘
```

**Hook logic**
```
useMasteryBreakdown():
  entries = Object.values(solvedProblems)
  clean    = entries.filter(e => e.attempts <= 2)
  struggled = entries.filter(e => e.attempts >= 3 && e.attempts <= 5)
  grinded  = entries.filter(e => e.attempts >= 6)
  byCategory = group above by e.category
```

**Edge cases**
- `attempts = 0` — treat as clean (shouldn't happen but guard it)
- Category with no solved → skip in byCategory list
- Empty store → show empty state "Solve problems to see your mastery breakdown"

---

### Feature 4 · Spaced Repetition Health

**What it shows**: Of all solved problems, how many are due for review, on track, or fully mastered. Surfaces knowledge decay risk.

**Buckets**
| Label | Condition | Color |
|---|---|---|
| Due for Review | `nextReviewDue <= today` AND `reviewInterval < 64` | Red |
| On Track | `nextReviewDue > today` AND `reviewInterval < 64` | Blue |
| Mastered | `reviewInterval >= 64` | Green |

> Mastery threshold comes from the existing server constant: `MAX_REVIEW_INTERVAL = 64`.

**Data source**: `solvedProblems[id].nextReviewDue` + `reviewInterval` (client store, no fetch needed)

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useRepetitionHealth.ts` | Derives `{ due, onTrack, mastered, total }` from store |
| `client/src/components/stats/RepetitionHealth.tsx` | Three horizontal bars + count labels + action nudge |

**Modified files**
- `client/src/pages/StatsPage.tsx` — add `<RepetitionHealth />` section

**Component design**

```
┌─────────────────────────────────────────────────────────────┐
│  Knowledge Health                                           │
│                                                             │
│  Due for Review  ████░░░░░░░░░░░░░░  5 problems             │
│  On Track        ████████████░░░░░░  12 problems            │
│  Mastered        ██████░░░░░░░░░░░░  6 problems             │
│                                                             │
│  ⚠ 5 problems need review — visit the Review page          │
└─────────────────────────────────────────────────────────────┘
```

**Edge cases**
- `nextReviewDue` is undefined (old data) → treat as due immediately
- `reviewInterval` is undefined → treat as 1 (not mastered, likely due)
- All mastered → celebrate with a different visual state
- 0 solved → empty state

**Checklist**

- [x] `useMasteryBreakdown.ts` written
- [x] `MasteryDonut.tsx` written (pure SVG, no library)
- [x] `MasteryBreakdown.tsx` written
- [x] `useRepetitionHealth.ts` written
- [x] `RepetitionHealth.tsx` written
- [x] Both added to `StatsPage.tsx`

### Status: `[x] Done`

---

## Phase 2 — Zero Backend, Time-Based Analytics

---

### Feature 1 · Consistency Score

**What it shows**: Percentage of days in the last 30 where the user solved at least one problem. Rewards habit without punishing a single missed day (unlike streak).

**Data source**: `solvedProblems[id].solvedAt` — extract date portion, count unique dates in window

**Calculations**
```
activeDaysSet = unique dates from solvedAt timestamps in last 30 days
score         = activeDaysSet.size / 30 * 100
sparkline     = array of 28 entries (4 weeks), each = solve count that day
```

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useConsistency.ts` | Derives `{ score, activeDays, sparkline: number[] }` |
| `client/src/components/stats/ConsistencyScore.tsx` | Percentage ring + 28-bar sparkline |

**Modified files**
- `client/src/pages/StatsPage.tsx` — add `<ConsistencyScore />` section

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Consistency Score                        Last 4 weeks       │
│                                                              │
│   [Ring: 67%]    67% consistent           ▁▃▁▅▂▁▄▁          │
│   SOLID           20 / 30 days            ▁▃▁▅▂▁▄▁          │
│                                           Mon        Sun     │
└──────────────────────────────────────────────────────────────┘
```

Consistency tiers: `< 20%` Irregular · `20–49%` Building · `50–74%` Solid · `75–89%` Committed · `90%+` Elite

**Edge cases**
- No solves in last 30 days → score = 0, sparkline all zeros
- Multiple solves same day → count once for score, sum for sparkline bar height
- `solvedAt` might be full ISO — parse with `split('T')[0]`

---

### Feature 5 · Difficulty Progression

**What it shows**: Month-by-month stacked bar showing how many problems the user solved at each difficulty level. Reveals whether they're challenging themselves over time.

**Data source**: `solvedProblems[id].difficulty` + `solvedAt` (client store)

**Calculations**
```
group entries by month (yyyy-MM from solvedAt)
for each month: { label, beginner, easy, medium, hard }
show last 6 months
```

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useDifficultyProgression.ts` | Returns `{ months: MonthBucket[] }` for last 6 months |
| `client/src/components/stats/DifficultyProgression.tsx` | CSS stacked bar chart (no library) |

**Modified files**
- `client/src/pages/StatsPage.tsx` — add `<DifficultyProgression />` section

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Difficulty Progression                                      │
│                                                              │
│    ▓▓   ▓▓   ██   ██   ██   ██                              │
│    ▓▓   ▓▓   ▓▓   ██   ██   ██   ← Hard                    │
│    ░░   ░░   ▓▓   ▓▓   ▓▓   ██   ← Medium                  │
│    ░░   ░░   ░░   ░░   ▓▓   ▓▓   ← Easy                    │
│   Nov  Dec  Jan  Feb  Mar  Apr   ← Beginner                 │
└──────────────────────────────────────────────────────────────┘
```

Colors: Beginner=blue · Easy=green · Medium=amber · Hard=red

**Edge cases**
- Month with zero solves → still show month label with empty bar
- Only 1-2 months of data → show all months anyway (gaps are data)
- `difficulty` undefined on old entries → bucket into Easy

**Checklist**

- [x] `useConsistency.ts` written
- [x] `ConsistencyScore.tsx` written
- [x] `useDifficultyProgression.ts` written
- [x] `DifficultyProgression.tsx` written
- [x] Both added to `StatsPage.tsx`

### Status: `[x] Done`

---

## Phase 3 — Zero Backend, Deep Insights

---

### Feature 6 · Time to First Solve by Category

**What it shows**: For each category, how many days after the user's very first ever solve did they tackle this category. Short = grabbed it early. Long = avoided it or came to it late. Surfaces hidden friction areas.

**Data source**: `solvedProblems[id].solvedAt` + `category`

**Calculations**
```
firstEverSolve = min(all solvedAt dates)
for each category with at least 1 solve:
  firstCategorySolve = min(solvedAt for entries with that category)
  daysUntilStarted   = diff(firstCategorySolve, firstEverSolve) in days
sort categories by daysUntilStarted ascending
```

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useCategoryTimeline.ts` | Returns `{ categories: { slug, title, daysUntilStarted, firstSolvedAt }[] }` |
| `client/src/components/stats/CategoryTimeline.tsx` | Horizontal timeline list sorted by when category was first touched |

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Category Discovery Timeline                                 │
│                                                              │
│  Day 0    Basic Loops         ●──────────────────────        │
│  Day 3    Array Building      ●────────────────────          │
│  Day 8    Nested Loops        ●──────────────────            │
│  Day 21   Two Pointer         ●──────────                    │
│  Day 45   Sliding Window      ●───                           │
└──────────────────────────────────────────────────────────────┘
```

**Edge cases**
- Only 1 category solved → first category = day 0
- Categories with no solves → not shown (they're not started)

---

### Feature 3 · Speed Trend over Time

**What it shows**: Average execution time per month, across all solved problems. Shows whether the user is writing faster code over time.

**Data source**: `solvedProblems[id].executionTimeMs` + `solvedAt`

**Calculations**
```
group entries by month (from solvedAt)
for each month: avgMs = mean(executionTimeMs for entries that month)
skip months where no entries have executionTimeMs set
```

> `runTimings` (last 20 entries per problem, `{ ms, accepted }`) could give intra-problem speed history but `executionTimeMs` (one number per problem = best accepted time) is simpler and what we have reliably on all entries.

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/useSpeedTrend.ts` | Returns `{ months: { label, avgMs, count }[] }` for last 6 months |
| `client/src/components/stats/SpeedTrend.tsx` | Bar chart of monthly avg execution time (lower = better) |

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Execution Speed Trend                    ↓ faster = better  │
│                                                              │
│  120ms ████████████████░░░░  Nov — avg 112ms, 4 problems     │
│   98ms ████████████░░░░░░░░  Dec — avg  98ms, 7 problems     │
│   71ms ████████░░░░░░░░░░░░  Jan — avg  71ms, 9 problems     │
└──────────────────────────────────────────────────────────────┘
```

---

### Feature 7 · Peak Performance Window

**What it shows**: Which day of the week has the most first-attempt solves. Fun, memorable, and actually useful for scheduling study sessions.

**Data source**: `solvedProblems[id].solvedAt` timestamps

**Calculations**
```
for each solved entry:
  dayOfWeek = new Date(solvedAt).getDay()  (0=Sun … 6=Sat)
  hour      = new Date(solvedAt).getHours()
dayTotals  = count per day-of-week
bestDay    = day with highest count
hourBlocks = group hours into 4 blocks: Night(0-5), Morning(6-11), Afternoon(12-17), Evening(18-23)
bestBlock  = block with most solves
```

**New files**
| File | Purpose |
|---|---|
| `client/src/hooks/usePeakWindow.ts` | Returns `{ bestDay, bestHour, dayDistribution: number[7] }` |
| `client/src/components/stats/PeakWindow.tsx` | 7-bar day chart + best-day callout |

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Peak Performance Window                                     │
│                                                              │
│  You solve best on  TUESDAY                                  │
│  Most active block  MORNING (6am–12pm)                      │
│                                                              │
│  Mon  ███                                                    │
│  Tue  █████████  ← peak                                     │
│  Wed  ██████                                                 │
│  Thu  ████                                                   │
│  Fri  ██                                                     │
│  Sat  █                                                      │
│  Sun  ██                                                     │
└──────────────────────────────────────────────────────────────┘
```

**Edge cases**
- Fewer than 7 solves → not enough data, show placeholder "Solve at least 7 problems to reveal your peak window"
- All solves same day → show that day as peak, note limited sample size
- `solvedAt` is UTC — `getHours()` will reflect server time, not local time. Acceptable for now since this is a personal tool. Note in a comment.

**Checklist**

- [x] `useCategoryTimeline.ts` written
- [x] `CategoryTimeline.tsx` written
- [x] `useSpeedTrend.ts` written
- [x] `SpeedTrend.tsx` written
- [x] `usePeakWindow.ts` written
- [x] `PeakWindow.tsx` written
- [x] All three added to `StatsPage.tsx`

### Status: `[x] Done`

---

## Phase 4 — New Backend Required

---

### Feature 8 · Problem Revisit Rate

**What it shows**: How often the user returns to a problem they already solved. High revisit in a category = that knowledge doesn't stick. Requires tracking page visits — **this is the only feature with new backend work**.

---

#### 4a · Server — New `Visit` model

File: `server/src/models/Visit.ts`

```
Visit {
  userId:     String   (default: 'default')
  problemId:  String
  visitedAt:  String   (ISO timestamp)
}

Index: { userId: 1, problemId: 1 }
```

No dedup — log every visit. Volume is low (personal tool).

---

#### 4b · Server — New visits route

File: `server/src/routes/visits.ts`

```
POST /api/visits/:problemId
  Body: none
  Action: insert Visit record
  Returns: { ok: true }

GET /api/visits/stats
  Returns per-problem and per-category revisit counts
  Shape: {
    byProblem:  Record<problemId, { title, category, visitCount, isSolved }>
    byCategory: Record<slug, { totalVisits, solvedVisits, ratio }>
  }
```

Mount in `server/src/index.ts`: `app.use('/api/visits', visitsRouter)`

---

#### 4c · Server — Wire progress data into stats

The `/api/visits/stats` route needs to cross-reference `Progress` (to know which problems are solved and what their categories are). Use `Progress.findOne({ userId })` inside the route handler.

---

#### 4d · Client — Log visit in `ProblemPage`

In `client/src/pages/ProblemPage.tsx`, add a `useEffect` that fires when the problem loads:

```ts
useEffect(() => {
  if (!problem) return
  fetch(`/api/visits/${problem.id}`, { method: 'POST' }).catch(() => undefined)
}, [problem?.id])
```

Fire-and-forget, no error handling needed in UI.

---

#### 4e · Client — New hook and component

| File | Purpose |
|---|---|
| `client/src/hooks/useRevisitRate.ts` | Fetches `/api/visits/stats`, returns `{ byCategory }` |
| `client/src/components/stats/RevisitRate.tsx` | Per-category list showing visit-to-solve ratio |

**Component design**
```
┌──────────────────────────────────────────────────────────────┐
│  Problem Revisit Rate                                        │
│                                                              │
│  Basic Loops       12 visits · 4 solved · 3.0 revisits/solve │
│  Nested Loops       8 visits · 2 solved · 4.0 revisits/solve │
│  Two Pointer        3 visits · 3 solved · 1.0 revisits/solve │
│                                                              │
│  ★ Two Pointer — knowledge is sticking (low revisit rate)   │
│  ⚠ Nested Loops — you keep coming back here                  │
└──────────────────────────────────────────────────────────────┘
```

**Edge cases**
- Category visited but no solves there → ratio = ∞, label as "Exploring"
- Category solved but never revisited → ratio = 1.0 (one visit = the solve visit), label "Solid"
- First visit and solve in same session → still counts as 1 visit

**Checklist**

- [x] `server/src/models/Visit.ts` created
- [x] `server/src/routes/visits.ts` created (`POST`, `GET /stats`)
- [x] `server/src/index.ts` mounts `/api/visits`
- [x] `ProblemPage.tsx` logs visit on problem load
- [x] `client/src/hooks/useRevisitRate.ts` created
- [x] `client/src/components/stats/RevisitRate.tsx` created
- [x] Added to `StatsPage.tsx`

### Status: `[x] Done`

---

## All-File Summary

### New client files (by phase)

| Phase | Hook | Component |
|---|---|---|
| 1 | `useMasteryBreakdown.ts` | `MasteryDonut.tsx`, `MasteryBreakdown.tsx` |
| 1 | `useRepetitionHealth.ts` | `RepetitionHealth.tsx` |
| 2 | `useConsistency.ts` | `ConsistencyScore.tsx` |
| 2 | `useDifficultyProgression.ts` | `DifficultyProgression.tsx` |
| 3 | `useCategoryTimeline.ts` | `CategoryTimeline.tsx` |
| 3 | `useSpeedTrend.ts` | `SpeedTrend.tsx` |
| 3 | `usePeakWindow.ts` | `PeakWindow.tsx` |
| 4 | `useRevisitRate.ts` | `RevisitRate.tsx` |

### New server files (Phase 4 only)

| File | Purpose |
|---|---|
| `server/src/models/Visit.ts` | Visit model |
| `server/src/routes/visits.ts` | POST + GET stats |

### Modified files (all phases)

| File | Change |
|---|---|
| `client/src/pages/StatsPage.tsx` | Add 8 new sections progressively |
| `client/src/pages/ProblemPage.tsx` | Phase 4 only: log visit on mount |
| `server/src/index.ts` | Phase 4 only: mount visits router |

---

## Execution Order

```
Phase 1 (highest impact, zero risk)
  → useMasteryBreakdown + MasteryDonut + MasteryBreakdown
  → useRepetitionHealth + RepetitionHealth
  → StatsPage: add both

Phase 2 (time-based, client-only)
  → useConsistency + ConsistencyScore
  → useDifficultyProgression + DifficultyProgression
  → StatsPage: add both

Phase 3 (deep insights, client-only)
  → useCategoryTimeline + CategoryTimeline
  → useSpeedTrend + SpeedTrend
  → usePeakWindow + PeakWindow
  → StatsPage: add all three

Phase 4 (backend work last)
  → Visit model + route + index mount
  → ProblemPage visit logging
  → useRevisitRate + RevisitRate
  → StatsPage: add final section
```

---

## Shared Conventions for All Phases

- Every hook is a pure `useMemo` computation over store/API data. No `useEffect` unless fetching from the server.
- Every component receives its computed data as props — no store access inside components.
- All charts are pure SVG or CSS — no charting library.
- All hooks follow the `select*` pattern for store subscriptions (selectors defined outside the component).
- Empty states always shown when data is insufficient — never render broken/misleading charts.
- All files stay under 200 lines; split if approaching the limit.
