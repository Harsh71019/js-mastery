# Daily Challenge Feature

## Goal

Present one problem per day (rotating across coding, MCQ, and trick types) to build a daily practice habit. Tracks a separate daily-challenge streak independent of the general solve streak. The same problem is shown to every user on a given day (deterministic selection from the published problem pool).

---

## Architecture Overview

### How the daily problem is selected

No extra collection needed. The server derives today's problem deterministically:

1. Fetch all published problem IDs sorted by `_id` (stable insertion order).
2. Use `dayOfYear(today)` as a seed: `index = dayOfYear % totalProblems`.
3. Return that problem's full data.

This means the daily problem rotates predictably, requires no cron job, and is stateless on the server.

### Progress tracking

Add to the `Progress` document:

```
dailyStreak:        number    // current daily-challenge streak
longestDailyStreak: number    // all-time best
lastDailySolvedAt:  string    // ISO date of last daily challenge completion
completedDailies:   string[]  // array of 'yyyy-MM-dd' dates completed
```

A daily counts as completed when the user solves that day's problem (regardless of whether they had solved it before from the main problems list).

### New API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/daily` | Returns today's problem + `{ date, alreadyCompleted }` |
| POST | `/api/daily/complete` | Mark today's daily as done, update daily streak, return full progress |

---

## Phases

---

### Phase 1 — Daily Selection Utility

**New file:** `server/src/utils/daily.ts`

```typescript
import { getDayOfYear } from 'date-fns'

export const selectDailyIndex = (totalProblems: number, date: Date): number => {
  if (totalProblems === 0) return 0
  return getDayOfYear(date) % totalProblems
}
```

No model or route changes yet — just the pure utility.

---

### Phase 2 — Update Progress Model

**File:** `server/src/models/Progress.ts`

Add daily challenge fields to the main `ProgressSchema`:

```typescript
dailyStreak:        { type: Number, default: 0 },
longestDailyStreak: { type: Number, default: 0 },
lastDailySolvedAt:  { type: String },
completedDailies:   { type: [String], default: [] },
```

No route changes yet.

---

### Phase 3 — Daily Streak Utility

**New file:** `server/src/utils/dailyStreak.ts`

Mirrors the existing `streak.ts` pattern but operates on `lastDailySolvedAt` and `dailyStreak`.

```typescript
import { differenceInCalendarDays, format } from 'date-fns'

interface DailyStreakState {
  dailyStreak:        number
  longestDailyStreak: number
  lastDailySolvedAt:  string | undefined
  completedDailies:   string[]
}

interface DailyStreakResult {
  dailyStreak:        number
  longestDailyStreak: number
  lastDailySolvedAt:  string
  completedDailies:   string[]
}

export const updateDailyStreak = (
  state: DailyStreakState,
  today: string,
): DailyStreakResult => {
  const updatedDailies = state.completedDailies.includes(today)
    ? state.completedDailies
    : [...state.completedDailies, today]

  if (state.completedDailies.includes(today)) {
    return {
      dailyStreak:        state.dailyStreak,
      longestDailyStreak: state.longestDailyStreak,
      lastDailySolvedAt:  today,
      completedDailies:   updatedDailies,
    }
  }

  const last = state.lastDailySolvedAt
  const diff = last ? differenceInCalendarDays(new Date(today), new Date(last)) : null
  const newStreak = diff === 1 ? state.dailyStreak + 1 : 1

  return {
    dailyStreak:        newStreak,
    longestDailyStreak: Math.max(newStreak, state.longestDailyStreak),
    lastDailySolvedAt:  today,
    completedDailies:   updatedDailies,
  }
}
```

---

### Phase 4 — API Routes

**File:** `server/src/routes/daily.ts` (new file)

```typescript
import { Router, type Request, type Response } from 'express'
import { format } from 'date-fns'
import { Problem } from '../models/Problem'
import { Progress } from '../models/Progress'
import { selectDailyIndex } from '../utils/daily'
import { updateDailyStreak } from '../utils/dailyStreak'
import { serializeProgress } from '../utils/serializeProgress'

const router = Router()

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const allIds = await Problem.find({ status: 'published' })
    .select('id -_id')
    .sort({ _id: 1 })
    .lean()

  if (allIds.length === 0) {
    res.status(404).json({ error: 'No problems available' })
    return
  }

  const index = selectDailyIndex(allIds.length, new Date())
  const problem = await Problem.findOne(
    { id: allIds[index].id, status: 'published' },
    { _id: 0, __v: 0, status: 0, createdAt: 0, updatedAt: 0 },
  ).lean()

  if (!problem) {
    res.status(404).json({ error: 'Daily problem not found' })
    return
  }

  const progress = await Progress.findOne({ userId: 'default' }).lean()
  const alreadyCompleted = progress?.completedDailies?.includes(today) ?? false

  res.json({ problem, date: today, alreadyCompleted })
})

router.post('/complete', async (_req: Request, res: Response): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd')

  let progress = await Progress.findOne({ userId: 'default' })
  if (!progress) {
    progress = new Progress({ userId: 'default' })
  }

  const updated = updateDailyStreak(
    {
      dailyStreak:        progress.dailyStreak ?? 0,
      longestDailyStreak: progress.longestDailyStreak ?? 0,
      lastDailySolvedAt:  progress.lastDailySolvedAt,
      completedDailies:   progress.completedDailies ?? [],
    },
    today,
  )

  progress.dailyStreak        = updated.dailyStreak
  progress.longestDailyStreak = updated.longestDailyStreak
  progress.lastDailySolvedAt  = updated.lastDailySolvedAt
  progress.completedDailies   = updated.completedDailies
  await progress.save()

  res.json(serializeProgress(progress))
})

export default router
```

**File:** `server/src/index.ts`

```typescript
import dailyRouter from './routes/daily'
app.use('/api/daily', dailyRouter)
```

---

### Phase 5 — Client Types & Hook

**New file:** `client/src/types/daily.ts`

```typescript
import type { AnyProblem } from './problem'

export interface DailyChallenge {
  readonly problem:           AnyProblem
  readonly date:              string
  readonly alreadyCompleted:  boolean
}
```

**File:** `client/src/store/useProgressStore.ts`

Add daily fields to the state shape and a `completeDailyChallenge` action:

```typescript
// State
dailyStreak:        number
longestDailyStreak: number
completedDailies:   string[]

// Action
completeDailyChallenge: () => Promise<void>
```

```typescript
completeDailyChallenge: async () => {
  const response = await fetch('/api/daily/complete', { method: 'POST' })
  const data = await response.json()
  get().loadProgressFromData(data)
},
```

**New file:** `client/src/hooks/useDaily.ts`

```typescript
import { useState, useEffect } from 'react'
import type { DailyChallenge } from '@/types/daily'

interface UseDailyResult {
  readonly daily:     DailyChallenge | null
  readonly isLoading: boolean
  readonly error:     string | null
}

export const useDaily = (): UseDailyResult => {
  const [daily, setDaily]       = useState<DailyChallenge | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/daily')
      .then((r) => r.json() as Promise<DailyChallenge>)
      .then((data) => { setDaily(data); setLoading(false) })
      .catch(() => { setError('Failed to load daily challenge'); setLoading(false) })
  }, [])

  return { daily, isLoading, error }
}
```

---

### Phase 6 — Daily Challenge Page

**New file:** `client/src/pages/DailyChallengePage.tsx`

Layout:
- Sticky header bar: "Daily Challenge · {formatted date}" + daily streak badge (🔥 N days)
- Renders the appropriate problem view inline based on type (`isTrickProblem` / `isMcqProblem` / coding)
- On solve (detect via `isSolved(daily.problem.id)` or `alreadyCompleted`), calls `completeDailyChallenge()` and shows a completion banner
- "Come back tomorrow" message with countdown to midnight when completed

```typescript
export const DailyChallengePage = (): React.JSX.Element => {
  const { daily, isLoading, error } = useDaily()
  const completeDailyChallenge = useProgressStore(selectCompleteDailyChallenge)
  const { dailyStreak } = useProgress()

  // call completeDailyChallenge when problem is solved
  // detect solve via useProgress().isSolved(daily.problem.id)

  if (isLoading) return <LoadingSkeleton />
  if (error || !daily) return <ErrorState />

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <DailyHeader date={daily.date} streak={dailyStreak} completed={daily.alreadyCompleted} />
      {renderProblemView(daily.problem)}
    </div>
  )
}
```

**New file:** `client/src/components/daily/DailyHeader.tsx`

Slim bar with: date label, flame streak badge, and (when completed) a green "✓ Completed today" pill.

**New file:** `client/src/components/daily/DailyCompleteCard.tsx`

Full-width card shown after completing: streak count, motivational message, countdown to next challenge.

---

### Phase 7 — Navigation & Dashboard Widget

**File:** `client/src/components/layout/Sidebar.tsx`

Add nav item with a pulsing dot when today's challenge is not yet completed:

```typescript
{ to: '/daily', label: 'Daily', icon: <CalendarDays size={16} /> }
```

**File:** `client/src/App.tsx`

```typescript
<Route path="daily" element={<DailyChallengePage />} />
```

**File:** `client/src/pages/DashboardPage.tsx`

Add a `DailyChallengeWidget` at the top of the dashboard — shows today's problem title, type badge, estimated minutes, and a "Start →" CTA or "✓ Done" state.

---

## File Change Summary

| File | Change |
|---|---|
| `server/src/utils/daily.ts` | New — deterministic daily index selection |
| `server/src/utils/dailyStreak.ts` | New — daily streak calculation |
| `server/src/models/Progress.ts` | Add `dailyStreak`, `longestDailyStreak`, `lastDailySolvedAt`, `completedDailies` |
| `server/src/routes/daily.ts` | New — `GET /api/daily`, `POST /api/daily/complete` |
| `server/src/index.ts` | Mount daily router |
| `client/src/types/daily.ts` | New — `DailyChallenge` interface |
| `client/src/store/useProgressStore.ts` | Add daily fields + `completeDailyChallenge` action |
| `client/src/hooks/useDaily.ts` | New — fetches today's daily challenge |
| `client/src/pages/DailyChallengePage.tsx` | New — daily challenge page |
| `client/src/components/daily/DailyHeader.tsx` | New — header bar with date + streak |
| `client/src/components/daily/DailyCompleteCard.tsx` | New — post-completion card |
| `client/src/components/layout/Sidebar.tsx` | Add Daily nav item |
| `client/src/App.tsx` | Add `/daily` route |
| `client/src/pages/DashboardPage.tsx` | Add daily challenge widget |
