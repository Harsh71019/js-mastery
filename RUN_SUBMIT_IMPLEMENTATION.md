# Run / Submit Split — Implementation Plan

> **Status tracking**: Mark each phase `[x]` when fully coded, tested, and confirmed working before moving to the next.

---

## Overview

Three bugs to fix:

1. **Incorrect solutions get accepted** — there is no hidden-test layer; a single "Execute Script" button runs all tests and calls `markSolved` immediately on any `Accepted` verdict.
2. **No accepted-code persistence** — the user's code is never stored when they solve a problem.
3. **No Run vs Submit UX** — one button does everything; no submission history.

---

## Phase 1 — Add `hidden` flag to `TestCase` types

**Goal**: Give problems a way to mark judge-only test cases that are not shown to the user during a Run.

### 1a · `client/src/types/problem.ts`

Add `hidden?: boolean` to `TestCase`:

```ts
export interface TestCase {
  readonly input: unknown
  readonly expected: unknown
  readonly label?: string
  readonly hidden?: boolean          // ← NEW: judge-only, not shown on Run
  readonly isEval?: boolean
  readonly isGenerator?: boolean
  readonly isIterable?: boolean
  readonly isAsyncGenerator?: boolean
  readonly isAsyncIterable?: boolean
  readonly take?: number
}
```

### 1b · `server/src/models/Problem.ts`

Add `hidden` to `TestCaseSchema`:

```ts
const TestCaseSchema = new Schema(
  {
    input:            { type: Schema.Types.Mixed, required: true },
    expected:         { type: Schema.Types.Mixed },
    label:            { type: String },
    hidden:           { type: Boolean },          // ← NEW
    isEval:           { type: Boolean },
    isGenerator:      { type: Boolean },
    isIterable:       { type: Boolean },
    isAsyncGenerator: { type: Boolean },
    isAsyncIterable:  { type: Boolean },
    take:             { type: Number },
  },
  { _id: false },
)
```

### 1c · `server/src/routes/problems.ts`

When `GET /api/problems/:id` returns a problem, strip `expected` from hidden tests so the client cannot fish for answers by inspecting the network response:

```ts
const sanitizeTests = (tests: TestCase[]) =>
  tests.map(t => t.hidden ? { ...t, expected: null } : t)
```

Apply `sanitizeTests` before sending the response. The sandbox still receives `input` and will run it; the correct `expected` is never sent to the browser for hidden tests.

> **Note**: Verdict for hidden tests is derived solely from `deepEqual(actual, null)` in the sandbox, which will always fail — that is intentional. Hidden tests will always show as failed on Run. On Submit the server re-runs nothing; the client sends its own results. Full server-side judge is a future phase.

> **Simpler correct approach for now**: Strip `expected` → hidden tests always fail locally on Run (correct behaviour — they are not meant to be run on Run). On Submit, the client runs ALL tests including hidden ones with the full `expected` intact (server sends the real expected only on Submit). Implement a separate endpoint `GET /api/problems/:id/submit-tests` that returns the full test suite including hidden expected values.

### Checklist

- [x] `TestCase.hidden?: boolean` added to client types
- [x] `hidden: Boolean` added to server `TestCaseSchema`
- [x] `GET /api/problems/:id` strips `expected` from hidden tests
- [x] New `GET /api/problems/:id/submit-tests` returns full test suite (hidden included)

### Status: `[x] Done`

---

## Phase 2 — Accepted code persistence (schema + API)

**Goal**: Store the user's accepted code in MongoDB when a Submit verdict is `Accepted`.

### 2a · `server/src/models/Progress.ts`

Add `acceptedCode` to `SolvedEntrySchema`:

```ts
const SolvedEntrySchema = new Schema(
  {
    solvedAt:        { type: String, default: '' },
    attempts:        { type: Number, default: 0 },
    title:           String,
    category:        String,
    difficulty:      String,
    reviewInterval:  { type: Number, default: 1 },
    lastReviewedAt:  { type: String },
    nextReviewDue:   { type: String },
    executionTimeMs: { type: Number },
    runCount:        { type: Number, default: 1 },
    runTimings:      { type: [Schema.Types.Mixed], default: [] },
    acceptedCode:    { type: String },             // ← NEW: stored on first ACCEPTED submit
  },
  { _id: false },
)
```

### 2b · `server/src/routes/progress.ts` — `POST /solve/:id`

Extract `acceptedCode` from request body. Apply first-write-wins: only set it when the problem has no existing `acceptedCode`.

```ts
router.post('/solve/:problemId', async (req, res) => {
  const { problemId } = req.params
  const { title, category, difficulty, executionTimeMs, acceptedCode } = req.body

  // ... existing validation ...

  const existing = doc.solvedProblems.get(problemId)

  doc.solvedProblems.set(problemId, {
    // ... existing fields ...
    acceptedCode: existing?.acceptedCode ?? acceptedCode,  // first-write-wins
  })
  // ... rest of handler unchanged ...
})
```

### 2c · `server/src/utils/serializeProgress.ts`

`acceptedCode` is a plain string on the Mongoose entry — it passes through `normalizeSolvedEntry` without changes since the function already spreads unknown keys. Verify no explicit key filtering strips it; if so, add it explicitly:

```ts
const normalizeSolvedEntry = (entry: unknown): unknown => {
  if (!entry || typeof entry !== 'object') return entry
  const e = entry as SolvedEntry
  const base = { ...e }                          // acceptedCode included via spread
  if (!Array.isArray(e.runTimings) || e.runTimings.length === 0) return base
  return { ...base, runTimings: normalizeRunTimings(e.runTimings) }
}
```

### 2d · `client/src/store/useProgressStore.ts`

Add `acceptedCode` to `SolvedEntry` and update `markSolved` signature:

```ts
export interface SolvedEntry {
  // ... existing fields ...
  readonly acceptedCode?: string      // ← NEW
}

interface ProgressActions {
  markSolved: (id: string, meta?: ProblemMeta, executionTimeMs?: number, code?: string) => void
  // ... rest unchanged ...
}
```

Inside `markSolved`:
- Add `code` to the optimistic `SolvedEntry`:
  ```ts
  acceptedCode: existing?.acceptedCode ?? code,   // first-write-wins client-side too
  ```
- Include `acceptedCode: code` in the POST body to `/api/progress/solve/${id}`.

### Checklist

- [x] `acceptedCode: String` added to `SolvedEntrySchema` (server model)
- [x] `POST /solve/:id` reads and persists `acceptedCode` (first-write-wins)
- [x] `serializeProgress` passes `acceptedCode` through to client
- [x] `SolvedEntry.acceptedCode?: string` added to client store interface
- [x] `markSolved(id, meta, ms, code)` — `code` param added and wired up

### Status: `[x] Done`

---

## Phase 3 — Run / Submit split in `CodingProblemView`

**Goal**: Two distinct actions with different test sets, persistence rules, and UX feedback.

### Logic

```
handleRun():
  visibleTests = problem.tests.filter(t => !t.hidden)
  result = await runTests(code, fnName, visibleTests)
  setResults(result.results)
  setVerdict(result.verdict)
  setLastAction('run')
  incrementAttempts(id, ms)     // always track attempt
  // NO markSolved

handleSubmit():
  // fetch full test suite including hidden expected values
  fullTests = await fetch(`/api/problems/${id}/submit-tests`).then(r => r.json())
  result = await runTests(code, fnName, fullTests)
  setResults(result.results)
  setVerdict(result.verdict)
  setLastAction('submit')
  if result.verdict === 'Accepted':
    markSolved(id, meta, ms, code)
    confetti(...)
  else:
    incrementAttempts(id, ms)
  // write to /api/submissions (fire-and-forget)
```

### State additions

```ts
const [lastAction, setLastAction] = useState<'run' | 'submit' | null>(null)
const [isSubmitting, setIsSubmitting] = useState(false)
```

Use `isSubmitting` separately from `isRunning` so both buttons have independent disabled/loading states.

### Button layout — top editor navbar

Remove the full-width footer "Execute Script" button.

Add to the right side of the existing editor header `div.flex.items-center.justify-between`:

```tsx
<div className="flex items-center gap-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={handleRun}
    isLoading={isRunning}
    disabled={isRunning || isSubmitting}
  >
    Run
  </Button>
  <Button
    variant="primary"
    size="sm"
    onClick={handleSubmit}
    isLoading={isSubmitting}
    disabled={isRunning || isSubmitting}
  >
    Submit
  </Button>
</div>
```

Keep `Ctrl+Enter` bound to `handleSubmit` (LeetCode convention).

### Accepted banner

Show the green "Verification Complete" bar only when `lastAction === 'submit' && verdict === 'Accepted'`.

### Checklist

- [x] `handleRun` only runs non-hidden tests, never calls `markSolved`
- [x] `handleSubmit` fetches full test suite, calls `markSolved` only on ACCEPTED
- [x] `isSubmitting` state prevents double-submit
- [x] `lastAction` state (`'run' | 'submit' | null`) tracked
- [x] Footer "Execute Script" button removed
- [x] Run + Submit buttons added to top editor navbar
- [x] `Ctrl+Enter` → `handleSubmit`
- [x] Accepted banner only shows on Submit + ACCEPTED

### Status: `[x] Done`

---

## Phase 4 — `ResultsPanel` improvements

**Goal**: Display context-aware results based on action mode.

### Props change

```ts
interface ResultsPanelProps {
  readonly results: readonly TestResult[] | null
  readonly isRunning: boolean
  readonly verdict?: Verdict
  readonly action: 'run' | 'submit' | null    // ← NEW
}
```

### Behaviour per mode

| State | Display |
|---|---|
| `action = null` | "Environment Ready" empty state (unchanged) |
| `isRunning, action = 'run'` | Spinner + "Running sample tests…" |
| `isRunning, action = 'submit'` | Spinner + "Judging submission…" (different colour — amber) |
| `action = 'run'`, results shown | Header label `RUN` in blue; shows only visible test cards |
| `action = 'submit'`, results shown | Header label `SUBMIT` in green/red depending on verdict; shows all test cards; hidden test cards show no expected value |
| `verdict = Accepted` on submit | Full green glow on header |

### Loading state copy

```tsx
// run mode
"Executing sample tests..."

// submit mode (amber spinner)
"Judging submission..."
```

### Checklist

- [x] `action` prop added to `ResultsPanelProps`
- [x] Loading state copy and colour differ between run and submit
- [x] Header shows `RUN` vs `SUBMIT` label
- [x] Hidden test result cards shown on Submit but `expected` displays as `—` when null
- [x] Accepted verdict triggers full green header glow on Submit only

### Status: `[x] Done`

---

## Phase 5 — Submission history

**Goal**: Store every Submit call (pass or fail) and surface history on the problem page.

### 5a · `server/src/models/Submission.ts` (new file)

```ts
import { Schema, model } from 'mongoose'

const SubmissionSchema = new Schema(
  {
    userId:          { type: String, required: true, default: 'default' },
    problemId:       { type: String, required: true },
    submissionId:    { type: String, required: true, unique: true },
    verdict:         { type: String, required: true },
    code:            { type: String, required: true },
    executionTimeMs: { type: Number },
    submittedAt:     { type: String, required: true },
  },
  { timestamps: false },
)

SubmissionSchema.index({ userId: 1, problemId: 1 })

export const Submission = model('Submission', SubmissionSchema)
```

### 5b · `server/src/routes/submissions.ts` (new file)

```
POST /api/submissions/:problemId
  Body: { verdict, code, executionTimeMs }
  Action: writes new Submission doc with crypto.randomUUID() as submissionId
  Returns: { submissionId, submittedAt }

GET /api/submissions/:problemId
  Query: ?limit=20 (default 20)
  Returns: [{ submissionId, verdict, executionTimeMs, submittedAt }]
  Note: code field is intentionally excluded from list response

GET /api/submissions/:problemId/:submissionId
  Returns: { submissionId, verdict, code, executionTimeMs, submittedAt }
```

### 5c · `server/src/index.ts`

Mount the new router:

```ts
import submissionsRouter from './routes/submissions'
app.use('/api/submissions', submissionsRouter)
```

### 5d · `client/src/hooks/useSubmissions.ts` (new file)

```ts
export interface SubmissionSummary {
  readonly submissionId:    string
  readonly verdict:         Verdict
  readonly executionTimeMs: number | null
  readonly submittedAt:     string
}

export const useSubmissions = (problemId: string) => {
  // fetch GET /api/submissions/:problemId
  // return { submissions, isLoading, error }
}
```

### 5e · Wire into `CodingProblemView`

After `handleSubmit` resolves, fire-and-forget:

```ts
fetch(`/api/submissions/${problem.id}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ verdict: result.verdict, code, executionTimeMs: result.executionTimeMs }),
})
```

Optionally render a submission history tab in the results panel (lower priority).

### Checklist

- [x] `server/src/models/Submission.ts` created
- [x] `server/src/routes/submissions.ts` created (`POST`, `GET list`, `GET single`)
- [x] `server/src/index.ts` mounts `/api/submissions`
- [x] `client/src/hooks/useSubmissions.ts` created
- [x] `handleSubmit` fires POST to `/api/submissions` after execution

### Status: `[x] Done`

---

## Phase 6 — Performance & perceived speed

**Goal**: Reduce re-renders and improve editor responsiveness.

### Items

- Wrap `handleRun` and `handleSubmit` in `useCallback` with correct deps (already partially done — verify)
- Add `React.memo` to `TestCard` in `ResultsPanel` — it re-renders on every keystroke if results are shown
- Confirm `CodeEditor` (Monaco) is lazy-loaded via `React.lazy` — check `CodeEditor.tsx`; wrap with `Suspense` if not already
- Move `selectMarkSolved`, `selectIncrementAttempts`, `selectSolvedProblems` selectors outside component (already done in current code — keep)
- Debounce `onChange` to Monaco if it is re-rendering on every keystroke (only if profiling shows it as a bottleneck)

### Checklist

- [x] `TestCard` wrapped with `React.memo` (done in Phase 4)
- [x] `CodeEditor` already lazy-loaded via `React.lazy` + `Suspense` — no change needed
- [x] `handleRun` / `handleSubmit` `useCallback` deps verified correct (Phase 3)
- [x] Store selectors defined outside component — no unnecessary re-renders

### Status: `[x] Done`

---

## Execution Order

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4  →  Phase 5  →  Phase 6
Types       Schema       UI Logic     Results      History      Perf
```

Each phase must be marked `[x] Done` before coding begins on the next.

---

## Edge Cases & Risks

| Risk | Mitigation |
|---|---|
| Double-submit race | `isSubmitting` flag; button disabled while in-flight |
| Problem with 0 visible tests | Run shows placeholder "No sample tests — use Submit to judge your solution" |
| `acceptedCode` overwritten on re-solve | First-write-wins on both client and server |
| Hidden expected leaking to client | Strip `expected` in `GET /api/problems/:id`; send full suite via `GET /api/problems/:id/submit-tests` |
| Submission collection unbounded | Cap `GET /api/submissions` to 20; add cleanup cron later |
| `testRunnerWrapper` on hidden tests | `executor.ts` already handles it; no change needed |
| Optimistic `markSolved` then server error | `.catch` in store calls `loadProgress()` to revert optimistic state |
| Phase 5 before Phase 3 | Submission route depends on client sending `verdict` — must build Phase 3 first |
