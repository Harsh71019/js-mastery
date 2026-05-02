# MCQ Feature Plan

## What this adds

Multiple-choice questions as a second problem type. Instead of writing code, the user reads a question and picks one of 2–6 options. The answer and an explanation are revealed on submission. Progress tracking (solve/attempt, streak) works identically to coding problems.

---

## New fields on Problem

```
type           'coding' | 'mcq' | 'trick'   default: 'coding'
options        string[]                      required when type = 'mcq', min 2, max 6
correctIndex   number                        required when type = 'mcq', valid index into options
explanation    string                        required when type = 'mcq', shown after answering
```

Fields that become **optional / unused** for MCQ problems:
`starterCode`, `skeletonHint`, `solution`, `traceTable`, `functionName`, `whatShouldHappen`, `tests`

The server model keeps them optional. Existing coding problems are unaffected.

---

## Phase 1 — Server: Problem model

**File: `server/src/models/Problem.ts`**

Add to `ProblemSchema`:
```typescript
type: {
  type: String,
  enum: ['coding', 'mcq', 'trick'],
  default: 'coding',
},
options:      { type: [String], default: undefined },
correctIndex: { type: Number, default: undefined },
explanation:  { type: String, default: undefined },
```

Make coding-only fields optional (add `required: false` or remove `required: true`):
`functionName`, `starterCode`, `skeletonHint`, `solution`, `traceTable`, `whatShouldHappen`, `tests`

No migration needed — existing documents get `type: 'coding'` via the default.

---

## Phase 2 — Server: Validation

**File: `server/src/utils/problem-validation.ts`**

Replace the single `validateProblem` with a type-aware dispatch:

```
validateProblem(doc)
  → if doc.type === 'mcq'   → validateMcqFields(doc)
  → if doc.type === 'trick' → validateTrickFields(doc)   (added in Trick plan)
  → else                    → validateCodingFields(doc)  (existing logic)
```

`validateMcqFields` checks:
- `id`, `title`, `category`, `difficulty`, `patternTag`, `patternExplanation`, `estimatedMinutes` — required on all types
- `options` is an array of 2–6 non-empty strings
- `correctIndex` is a whole number and a valid index into `options`
- `explanation` is a non-empty string

`validateCodingFields` = existing checks (unchanged).

The `REQUIRED_STRINGS` constant should be split into `SHARED_REQUIRED` (fields required on all types) and `CODING_REQUIRED` (coding-only fields).

---

## Phase 3 — Server: Public API

**File: `server/src/routes/problems.ts`**

Two small changes:

1. `GET /` list — add `type` to `LIST_FIELDS` so the problem list can show an MCQ badge:
   ```typescript
   const LIST_FIELDS = 'id title category difficulty patternTag estimatedMinutes type -_id'
   ```

2. `GET /:id` — `correctIndex` is returned in the response (acceptable for a personal app with no auth — the UI just hides it until the user submits). No server-side answer checking needed.

No new routes. The existing `POST /api/progress/solve/:id` and `POST /api/progress/attempt/:id` work as-is.

---

## Phase 4 — Client: Types

**File: `client/src/types/problem.ts`**

Add:
```typescript
export type ProblemType = 'coding' | 'mcq' | 'trick'

export interface McqProblem {
  readonly id: string
  readonly title: string
  readonly type: 'mcq'
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly description: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
  readonly patternTag: string
  readonly patternExplanation: string
  readonly estimatedMinutes: number
}
```

Update `Problem` (coding):
```typescript
export interface Problem {
  // ... existing fields ...
  readonly type?: 'coding'   // optional for backwards compat
}
```

Update `ProblemSummary`:
```typescript
export interface ProblemSummary {
  // ... existing ...
  readonly type?: ProblemType
}
```

Add a type guard used by `useProblem` and `ProblemPage`:
```typescript
export const isMcqProblem = (p: Problem | McqProblem): p is McqProblem =>
  p.type === 'mcq'
```

---

## Phase 5 — Client: McqOptions component

**New file: `client/src/components/problems/McqOptions.tsx`**

Props:
```typescript
interface McqOptionsProps {
  readonly options: readonly string[]
  readonly selectedIndex: number | null
  readonly correctIndex: number | null   // null = not yet revealed
  readonly onSelect: (index: number) => void
  readonly isSubmitted: boolean
}
```

Each option is a `<button>`. Visual states:
- **Default** — neutral border, hover highlight
- **Selected, not submitted** — blue ring
- **Submitted, correct** — green background + checkmark
- **Submitted, selected + wrong** — red background + X
- **Submitted, unselected + wrong** — dimmed, no indicator
- **Submitted, unselected + correct** — green border (shows the right answer even if user was wrong)

Disabled after submission. No external dependencies — pure Tailwind.

This component is **shared by both MCQ and Trick Question** (Phase 5 of the Trick plan reuses it).

---

## Phase 6 — Client: McqProblemView component

**New file: `client/src/components/problems/McqProblemView.tsx`**

Props:
```typescript
interface McqProblemViewProps {
  readonly problem: McqProblem
  readonly nextId: string | null
  readonly prevId: string | null
}
```

Local state: `selectedIndex: number | null`, `isSubmitted: boolean`

Layout (single column, no code pane):
```
┌─────────────────────────────────────┐
│ title + difficulty badge            │
│ description                         │
│ ─────────────────────────────────── │
│ <McqOptions />                      │
│ ─────────────────────────────────── │
│ [Submit] button  (disabled if null) │
│                                     │
│ After submission:                   │
│   ✓ Correct! / ✗ Wrong              │
│   explanation text                  │
│   [Next Problem →]                  │
└─────────────────────────────────────┘
```

On submit:
- If `selectedIndex === correctIndex` → `markSolved(id, meta)` → confetti
- Else → `incrementAttempts(id)`
- Set `isSubmitted = true`

Resets when `problem.id` changes (same `useEffect` pattern as `ProblemPage`).

---

## Phase 7 — Client: ProblemPage refactor + routing

**File: `client/src/pages/ProblemPage.tsx`**

Extract the current coding-problem JSX into a new component:

**New file: `client/src/components/problems/CodingProblemView.tsx`**

Props: everything `ProblemPage` currently holds (`problem`, `nextId`, `prevId`). Move all state (`code`, `results`, `isRunning`, panel ratio, dragging logic) into this component.

`ProblemPage` becomes a thin router:
```typescript
export const ProblemPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const { problem, nextId, prevId, isLoading, error } = useProblem(id ?? '')

  if (isLoading) return <ProblemSkeleton />
  if (error === 'not_found' || !problem) return <Navigate to="/problems" replace />
  if (error) return <ProblemLoadError />

  if (isMcqProblem(problem)) {
    return <McqProblemView problem={problem} nextId={nextId} prevId={prevId} />
  }
  return <CodingProblemView problem={problem} nextId={nextId} prevId={prevId} />
}
```

`useProblem` needs to return `Problem | McqProblem` — update its return type.

---

## Phase 8 — Client: Problem list

**File: `client/src/components/problems/ProblemTable.tsx`**

Add a type indicator to each row. Options:
- A `type` column with a small badge: `MCQ` in purple, `CODE` dimmed/hidden
- Or just an icon — a pencil for coding, a list for MCQ

Also add `type` to the `FilterBar` so users can filter to MCQ-only or coding-only.

**File: `client/src/components/problems/FilterBar.tsx`**

Add a type filter: `All | Coding | MCQ`. Maps to `?type=mcq` query param on the problems API (needs a matching filter on `GET /api/problems` in `problems.ts`).

---

## MCQ problem schema for AI generation

When prompting AI for MCQ problems, use this structure:

```json
{
  "id": "basic-loops-mcq-what-does-this-output",
  "title": "What does this loop output?",
  "type": "mcq",
  "category": "basic-loops",
  "difficulty": "Easy",
  "description": "What is logged to the console when this code runs?\n\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
  "options": ["0 1 2", "1 2 3", "0 1 2 3", "undefined"],
  "correctIndex": 0,
  "explanation": "let i starts at 0. The loop runs while i < 3, so it prints 0, 1, 2 then stops. i = 3 fails the condition and the loop exits.",
  "patternTag": "Loop Bounds",
  "patternExplanation": "Understanding the < vs <= boundary is the most common source of off-by-one errors in for loops.",
  "estimatedMinutes": 2,
  "status": "draft"
}
```

Fields not needed for MCQ (omit them): `functionName`, `starterCode`, `skeletonHint`, `solution`, `traceTable`, `whatShouldHappen`, `tests`.

---

## Checklist

- [ ] Phase 1: `Problem.ts` model updated, server restarts cleanly
- [ ] Phase 2: `problem-validation.ts` type-dispatches correctly, bulk import rejects bad MCQ
- [ ] Phase 3: `type` field appears in list API response
- [ ] Phase 4: `isMcqProblem` type guard compiles and narrows correctly
- [ ] Phase 5: `McqOptions` renders all 4 visual states (default, selected, correct, wrong)
- [ ] Phase 6: `McqProblemView` marks solved/attempted correctly, resets on problem change
- [ ] Phase 7: `ProblemPage` routes to correct view, `CodingProblemView` behaviour unchanged
- [ ] Phase 8: MCQ badge visible in list, type filter works
