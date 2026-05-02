# Spaced Repetition / Review Queue Feature

## Goal

Surface problems the user has already attempted but needs to re-visit to achieve true mastery. Uses a simple interval-doubling algorithm: solve correctly → interval doubles; solve wrong → interval resets to 1 day. Every problem solved for the first time enters the review queue automatically.

---

## Architecture Overview

### Data shape added to Progress

Each entry in `solvedProblems` map gets three new fields:

```
solvedProblems[id] = {
  solvedAt:       string     // existing — ISO date of first solve
  title:          string     // existing
  category:       string     // existing
  difficulty:     string     // existing
  attempts:       number     // existing
  reviewInterval: number     // NEW — days until next review (starts at 1)
  lastReviewedAt: string     // NEW — ISO date of most recent review
  nextReviewDue:  string     // NEW — ISO date when review is due
}
```

### Algorithm (server-side only)

- First solve: `nextReviewDue = today + 1 day`, `reviewInterval = 1`
- Review correct: `reviewInterval = reviewInterval * 2`, `nextReviewDue = today + newInterval`
- Review wrong: `reviewInterval = 1`, `nextReviewDue = today + 1 day`
- Cap: `reviewInterval` max 64 days (after 6 correct reviews the problem is considered mastered and exits the queue)

### New API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/progress/review-queue` | Returns problems due today (nextReviewDue ≤ today), sorted by most overdue first |
| POST | `/api/progress/review/:problemId` | Submit review result (`{ correct: boolean }`), update interval, return updated queue stats |

---

## Phases

---

### Phase 1 — Update Progress Model

**File:** `server/src/models/Progress.ts`

Add `reviewInterval`, `lastReviewedAt`, `nextReviewDue` to the `SolvedEntry` sub-schema.

```typescript
const SolvedEntrySchema = new Schema(
  {
    solvedAt:       { type: String, required: true },
    title:          { type: String, required: true },
    category:       { type: String, required: true },
    difficulty:     { type: String, required: true },
    attempts:       { type: Number, default: 0 },
    reviewInterval: { type: Number, default: 1 },
    lastReviewedAt: { type: String },
    nextReviewDue:  { type: String },
  },
  { _id: false },
)
```

**File:** `server/src/routes/progress.ts` — `POST /solve/:problemId`

After marking solved, initialize review fields on the new entry:

```typescript
const today = format(new Date(), 'yyyy-MM-dd')
entry.reviewInterval = 1
entry.lastReviewedAt = today
entry.nextReviewDue  = format(addDays(new Date(), 1), 'yyyy-MM-dd')
```

No client changes in this phase.

---

### Phase 2 — Spaced Repetition Utility

**New file:** `server/src/utils/review.ts`

```typescript
import { format, addDays } from 'date-fns'

const MAX_INTERVAL = 64

export interface ReviewResult {
  reviewInterval: number
  lastReviewedAt: string
  nextReviewDue:  string
}

export const computeNextReview = (
  currentInterval: number,
  correct: boolean,
  today: string,
): ReviewResult => {
  const nextInterval = correct
    ? Math.min(currentInterval * 2, MAX_INTERVAL)
    : 1

  return {
    reviewInterval: nextInterval,
    lastReviewedAt: today,
    nextReviewDue:  format(addDays(new Date(today), nextInterval), 'yyyy-MM-dd'),
  }
}

export const isMastered = (reviewInterval: number): boolean =>
  reviewInterval >= MAX_INTERVAL
```

No client changes in this phase.

---

### Phase 3 — Review Queue API Endpoints

**File:** `server/src/routes/progress.ts`

Add two new routes (before the wildcard `/:milestone` route):

**GET `/api/progress/review-queue`**

```typescript
router.get('/review-queue', async (req, res) => {
  const progress = await getOrCreate()
  const today = format(new Date(), 'yyyy-MM-dd')

  const due = []
  for (const [id, entry] of progress.solvedProblems.entries()) {
    if (!entry.nextReviewDue || entry.nextReviewDue <= today) {
      if (!isMastered(entry.reviewInterval ?? 1)) {
        due.push({
          id,
          title:         entry.title,
          category:      entry.category,
          difficulty:    entry.difficulty,
          nextReviewDue: entry.nextReviewDue ?? today,
          reviewInterval: entry.reviewInterval ?? 1,
          daysOverdue: Math.max(0, differenceInDays(new Date(today), new Date(entry.nextReviewDue ?? today))),
        })
      }
    }
  }

  due.sort((a, b) => b.daysOverdue - a.daysOverdue)
  res.json({ due, total: due.length })
})
```

**POST `/api/progress/review/:problemId`**

```typescript
router.post('/review/:problemId', async (req, res) => {
  const { correct } = req.body as { correct: boolean }
  const progress = await getOrCreate()
  const today = format(new Date(), 'yyyy-MM-dd')

  const entry = progress.solvedProblems.get(req.params.problemId)
  if (!entry) {
    res.status(404).json({ error: 'Problem not in solved list' })
    return
  }

  const next = computeNextReview(entry.reviewInterval ?? 1, correct, today)
  entry.reviewInterval = next.reviewInterval
  entry.lastReviewedAt = next.lastReviewedAt
  entry.nextReviewDue  = next.nextReviewDue
  progress.markModified('solvedProblems')
  await progress.save()

  res.json({ ...serializeProgress(progress) })
})
```

---

### Phase 4 — Client Types & Store

**File:** `client/src/types/progress.ts` (or wherever `SolvedEntry` is defined)

Add new fields to `SolvedEntry`:

```typescript
export interface SolvedEntry {
  readonly solvedAt:        string
  readonly title:           string
  readonly category:        CategorySlug
  readonly difficulty:      Difficulty
  readonly attempts:        number
  readonly reviewInterval?: number
  readonly lastReviewedAt?: string
  readonly nextReviewDue?:  string
}
```

**New file:** `client/src/types/review.ts`

```typescript
export interface ReviewQueueItem {
  readonly id:             string
  readonly title:          string
  readonly category:       string
  readonly difficulty:     string
  readonly nextReviewDue:  string
  readonly reviewInterval: number
  readonly daysOverdue:    number
}

export interface ReviewQueue {
  readonly due:   readonly ReviewQueueItem[]
  readonly total: number
}
```

**File:** `client/src/store/useProgressStore.ts`

Add `submitReview` action:

```typescript
submitReview: async (problemId: string, correct: boolean) => {
  // optimistic: remove from any local "due" list immediately
  const response = await fetch(`/api/progress/review/${problemId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correct }),
  })
  const data = await response.json()
  get().loadProgressFromData(data)
}
```

---

### Phase 5 — useReviewQueue Hook

**New file:** `client/src/hooks/useReviewQueue.ts`

```typescript
import { useState, useEffect } from 'react'
import type { ReviewQueue } from '@/types/review'

interface UseReviewQueueResult {
  readonly queue:     ReviewQueue | null
  readonly isLoading: boolean
  readonly error:     string | null
  readonly refresh:   () => void
}

export const useReviewQueue = (): UseReviewQueueResult => {
  const [queue, setQueue]       = useState<ReviewQueue | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    setLoading(true)
    fetch('/api/progress/review-queue')
      .then((r) => r.json() as Promise<ReviewQueue>)
      .then((data) => { setQueue(data); setLoading(false) })
      .catch(() => { setError('Failed to load review queue'); setLoading(false) })
  }, [tick])

  return { queue, isLoading, error, refresh: () => setTick((t) => t + 1) }
}
```

---

### Phase 6 — Review Queue Page

**New file:** `client/src/pages/ReviewPage.tsx`

Layout:
- Header row: "Review Queue · X due today" + completion badge when empty
- Each item in the queue links to `/problem/:id` — the existing problem views already handle MCQ/trick/coding, so no new view needed
- After the user submits in a problem view, they return to `/review` and the queue refreshes

```typescript
export const ReviewPage = (): React.JSX.Element => {
  const { queue, isLoading } = useReviewQueue()

  if (isLoading) return <LoadingSkeleton />

  if (!queue || queue.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3rem)] gap-3">
        <CheckCircle2 size={32} className="text-accent-green" />
        <p className="text-text-primary font-medium">All caught up!</p>
        <p className="text-text-tertiary text-sm">No reviews due today.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-text-primary font-medium">{queue.total} due for review</h1>
      </div>
      {queue.due.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}
    </div>
  )
}
```

**New file:** `client/src/components/review/ReviewCard.tsx`

Shows title, category badge, difficulty badge, days overdue indicator, and a "Review Now →" link to `/problem/:id`.

---

### Phase 7 — Wire Up Navigation & Dashboard Widget

**File:** `client/src/components/layout/Sidebar.tsx`

Add nav item:
```typescript
{ to: '/review', label: 'Review', icon: <RefreshCw size={16} /> }
```
Show a count badge if `queue.total > 0`.

**File:** `client/src/App.tsx`

```typescript
<Route path="review" element={<ReviewPage />} />
```

**File:** `client/src/pages/DashboardPage.tsx` (or wherever the dashboard lives)

Add a "Due for Review" card showing `queue.total` with a link to `/review`.

---

## File Change Summary

| File | Change |
|---|---|
| `server/src/models/Progress.ts` | Add `reviewInterval`, `lastReviewedAt`, `nextReviewDue` to SolvedEntry |
| `server/src/utils/review.ts` | New — `computeNextReview`, `isMastered` |
| `server/src/routes/progress.ts` | Add `GET /review-queue`, `POST /review/:id`; init review on first solve |
| `client/src/types/review.ts` | New — `ReviewQueueItem`, `ReviewQueue` |
| `client/src/types/progress.ts` | Extend `SolvedEntry` with review fields |
| `client/src/store/useProgressStore.ts` | Add `submitReview` action |
| `client/src/hooks/useReviewQueue.ts` | New — fetches and returns the queue |
| `client/src/pages/ReviewPage.tsx` | New — queue list page |
| `client/src/components/review/ReviewCard.tsx` | New — single queue item card |
| `client/src/components/layout/Sidebar.tsx` | Add Review nav item with count badge |
| `client/src/App.tsx` | Add `/review` route |
