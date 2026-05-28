# Feature 01 — Recall Mode

## Goal

Transform the existing spaced repetition review queue from passive recognition into active retrieval. When a problem comes up for review and enough time has passed since solving, the editor loads **blank**. The user must reconstruct the solution from memory. After submitting, their stored accepted solution appears for comparison.

This implements the **generation effect** — reconstructing code is 3–5x stickier than re-reading it.

---

## How It Works (User Flow)

1. User solves a problem → `acceptedCode` is stored in `SolvedEntry`
2. 24–48h later the problem appears in the review queue
3. Review card shows a "Recall Mode" badge — editor is blank, no starter code, no hints
4. User writes the solution from memory and runs tests
5. After passing (or giving up) → side-by-side diff: their attempt vs stored `acceptedCode`
6. User clicks "Mark as Recalled" → interval increases (reward for successful recall)

---

## Backend

### Model Changes

**`SolvedEntry`** (in `server/src/models/Progress.ts`) — add two fields:

```ts
recallCount:       { type: Number, default: 0 }   // successful recalls
lastRecalledAt:    { type: String }               // ISO date string
```

No other model changes. `acceptedCode`, `reviewInterval`, `nextReviewDue`, `lastReviewedAt` already exist.

---

### Route Changes

**`GET /api/progress/review-queue`** — add `isRecallDue` flag per item.

Logic:
- `isRecallDue = true` when `reviewInterval >= 2` AND `daysSinceSolved >= 1`
- `reviewInterval >= 2` means user has already done at least one standard review pass

Response shape change (add field to each item):
```ts
{
  id:             string
  title:          string
  category:       string
  difficulty:     string
  nextReviewDue:  string
  reviewInterval: number
  daysOverdue:    number
  isRecallDue:    boolean   // NEW
  recallCount:    number    // NEW — shows history in UI
}
```

---

**`POST /api/progress/recall/:problemId`** — new route

- Marks recall as completed
- Increments `recallCount`
- Sets `lastRecalledAt` to today
- Extends `reviewInterval` by a larger multiplier than a standard review (reward successful recall)
  - Standard review: `interval * 1.5`
  - Successful recall: `interval * 2.5`
- Recalculates `nextReviewDue`
- Returns full updated progress state (same shape as all other progress routes)

File location: `server/src/routes/progress.ts` (add alongside existing routes)
Controller logic: `server/src/controllers/progressController.ts`

---

### Interval Multiplier Constants

Add to `server/src/constants/review.ts` (new file):

```ts
export const REVIEW_INTERVAL_MULTIPLIER  = 1.5
export const RECALL_INTERVAL_MULTIPLIER  = 2.5
export const RECALL_ELIGIBLE_INTERVAL    = 2    // min reviewInterval before recall kicks in
export const RECALL_MIN_HOURS_SINCE_SOLVE = 24
```

---

## Frontend

### Store Changes (`client/src/store/useProgressStore.ts`)

Add action:
```ts
completeRecall: (id: string) => void
```

Optimistic update: increment `recallCount`, set `lastRecalledAt`.
Then POST `/api/progress/recall/:id` and sync server state back.

Add `recallCount` and `lastRecalledAt` to `SolvedEntry` type in `useProgressStore.ts`.

---

### Hook Changes (`client/src/hooks/useReviewQueue.ts`)

`ReviewQueueItem` interface — add fields:
```ts
readonly isRecallDue:  boolean
readonly recallCount:  number
```

No other hook changes.

---

### Component Changes

**`client/src/components/review/ReviewCard.tsx`**

Two render modes based on `isRecallDue`:

| Mode | Editor content | Hints | Skeleton |
|---|---|---|---|
| Standard review | pre-filled with `acceptedCode` | shown | shown |
| Recall mode | blank `""` | hidden | hidden |

When `isRecallDue`:
- Show badge: `RECALL_MODE` in accent-amber
- Editor loads with empty string (not starter code, not `acceptedCode`)
- "Give up" button → reveals `acceptedCode` inline and marks as skipped (no interval increase)
- After tests pass → show `RecallDiffPanel`

---

**`client/src/components/review/RecallDiffPanel.tsx`** — new component

Side-by-side read-only Monaco panels:
- Left: user's submitted code
- Right: stored `acceptedCode`
- Diff highlights using Monaco's built-in diff editor (`@monaco-editor/react` supports this)
- "Mark as Recalled" button → calls `completeRecall(id)` from store

---

**`client/src/pages/ReviewPage.tsx`**

No structural changes — `ReviewCard` handles the mode internally.

Minor addition: show recall stats in the queue header.
- *"3 due for review — 2 in recall mode"*

---

### Stats Page Addition

Add to `client/src/pages/StatsPage.tsx`:
- Total recall completions
- Recall success rate (recalled vs gave up) — needs tracking a `recallSkipped` count too
- Highest `recallCount` problem (the one you've recalled the most times)

---

## Implementation Phases

### Phase 1 — Backend foundation
- Add `recallCount`, `lastRecalledAt` to `SolvedEntry` model
- Add `POST /api/progress/recall/:id` route + controller
- Add `isRecallDue`, `recallCount` to review-queue response

### Phase 2 — Blank editor in ReviewCard
- Read `isRecallDue` from queue item
- Pass empty string to Monaco when true
- Show RECALL_MODE badge
- Hide hints and skeleton

### Phase 3 — Post-recall diff panel
- `RecallDiffPanel` component using Monaco diff editor
- "Mark as Recalled" + "Give up" actions wired to store

### Phase 4 — Store + progress sync
- `completeRecall` action in `useProgressStore`
- Optimistic update + server sync

### Phase 5 — Stats integration
- Recall metrics on StatsPage
- Recall count visible on problem cards in the queue
