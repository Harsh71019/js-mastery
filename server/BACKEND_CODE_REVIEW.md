# Backend Code Review

**Date:** 2026-05-09  
**Scope:** `server/src/` — all routes, models, utils, and the seed script  
**Reviewer:** Claude Code

---

## Summary

The backend is well-structured for a single-user learning app. Route organization is clean, the Mongoose models are appropriate for the domain, and the utility functions (streak, review, activity) are small, pure, and easy to test. The main concerns are: missing controller/service layer (all business logic lives inside route handlers), non-standard Express request/response patterns (no `NextFunction`, no error middleware, no response typing), uneven error handling, several security gaps that matter most if the server is ever exposed publicly, and a few performance traps that will surface as the problem set grows.

---

## Architecture: Missing Controller Layer

### No separation between routing and business logic

**Files:** all `routes/*.ts`

Every route file is doing three jobs simultaneously: parsing the request, executing business logic, and building the response. There is no `controllers/` or `services/` layer. This makes each handler hard to test in isolation (you need an HTTP request to exercise the logic) and means business rules are scattered across six different files.

Standard Express architecture separates these concerns:

```
routes/      → define URL + method, delegate to controller
controllers/ → parse req, call service, send res
services/    → business logic, DB access, no req/res knowledge
```

**Example — `POST /api/progress/solve/:problemId`** (`routes/progress.ts:26–84`) does all of the following inside a single handler:

1. Parses and validates request body fields
2. Loads the Progress document
3. Computes timing history
4. Calls `computeNextReview` (spaced-repetition logic)
5. Merges the new `SolvedEntry` into the Mongoose Map
6. Calls `getUpdatedStreak`
7. Writes three streak fields back to the document
8. Saves to MongoDB
9. Serializes and sends the response

Steps 2–8 are business logic. They belong in a `ProgressService` or `progressController`, not inside the router. The same pattern repeats across every route file.

**What a split would look like:**

```ts
// routes/progress.ts
router.post('/solve/:problemId', progressController.solve)

// controllers/progressController.ts
export const solve: RequestHandler = async (req, res, next) => {
  try {
    const result = await progressService.solve(req.params.problemId, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// services/progressService.ts
export const solve = async (problemId: string, body: SolveBody) => {
  // all DB + business logic here, no req/res
}
```

This also makes the service trivially unit-testable without HTTP.

---

## Architecture: Non-Standard Express Request/Response Patterns

### `NextFunction` is never used — no error propagation chain

**Files:** all `routes/*.ts`, `index.ts`

Express's built-in error pipeline works via `next(err)`: a handler calls `next(err)`, Express skips to the first 4-argument error middleware `(err, req, res, next)`, which formats and sends the error response. This is the standard Express pattern.

None of the route handlers import or use `NextFunction`. The result:

- `admin.ts` catches errors and returns 500 manually — but each handler duplicates the same `console.error + res.status(500).json` block.
- All other route files have no `try/catch` at all — errors propagate as unhandled rejections.
- There is no central error-handling middleware in `index.ts`.

**Standard pattern:**

```ts
// index.ts — add after all routes
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  const status = err instanceof AppError ? err.status : 500
  res.status(status).json({ error: err instanceof Error ? err.message : 'Internal server error' })
})

// any route handler
router.get('/:id', async (req, res, next) => {
  try {
    const problem = await Problem.findOne(...)
    if (!problem) return res.status(404).json({ error: 'Not found' })
    res.json(problem)
  } catch (err) {
    next(err)  // ← error middleware handles it
  }
})
```

With a controller layer this reduces further — controllers always call `next(err)`, route files stay clean, and error formatting is defined exactly once.

---

### Response type is untyped — TypeScript cannot catch wrong response shapes

**Files:** all `routes/*.ts`

All handlers are typed as `async (req: Request, res: Response): Promise<void>`. `Response` without a generic parameter means `res.json(anything)` compiles regardless of what is sent.

Express supports `Response<T>` where `T` is the JSON body type:

```ts
// Before
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ problems, pagination })  // no type check on the shape
})

// After
interface ProblemListResponse {
  problems: ProblemListItem[]
  pagination: PaginationMeta
}

router.get('/', async (req: Request, res: Response<ProblemListResponse>): Promise<void> => {
  res.json({ problems, pagination })  // TypeScript validates the shape
})
```

Without typed responses, refactoring a response shape silently breaks API contracts — the compiler can't help.

---

### Request body is cast with `as { ... }` instead of validated

**Files:** `routes/progress.ts:28–34`, `routes/submissions.ts:11–14`, `routes/admin.ts:66`, etc.

```ts
const { title, category, difficulty, executionTimeMs, acceptedCode } = req.body as {
  title?: string
  category?: string
  difficulty?: string
  executionTimeMs?: number
  acceptedCode?: string
}
```

`as { ... }` is a TypeScript type assertion, not a runtime check. At runtime `req.body` is `any` — the cast does nothing. If the client sends `executionTimeMs: "fast"`, the code receives a string, the `typeof executionTimeMs === 'number'` guard saves that specific field, but other fields (like `title`, `category`) are used without any runtime type check.

A validation middleware (e.g. with `zod`) or at minimum an explicit runtime check for each field would make this safe:

```ts
// With zod (one schema, compile-time + runtime safety)
const SolveBodySchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  executionTimeMs: z.number().positive().optional(),
  acceptedCode: z.string().optional(),
})

const body = SolveBodySchema.safeParse(req.body)
if (!body.success) return res.status(400).json({ error: body.error.flatten() })
```

---

### `req.params.id` / `req.params.problemId` used without format validation

**Files:** `routes/problems.ts:108`, `routes/progress.ts:26`, `routes/submissions.ts:9,52`, `routes/visits.ts:88`

URL parameters are passed directly to Mongoose queries with no length or format check. While MongoDB query safety is not a concern (Mongoose parameterizes queries), an arbitrarily long string in the URL will still hit the database. A one-line guard (`if (!id || id.length > 100)`) would be more explicit about the contract.

---

## Critical

### 1. No error handling in public routes — unhandled rejections will surface as 500 crashes

**Files:** `routes/problems.ts`, `routes/progress.ts`, `routes/daily.ts`, `routes/submissions.ts`, `routes/visits.ts`

Every handler in `admin.ts` is wrapped in `try/catch`, but none of the handlers in the other route files are. Any rejected Mongoose promise (network blip, schema error, document too large) will propagate to Express's default error handler as an unhandled rejection.

The CLAUDE.md rule states: *"Every route handler must be `async` and wrapped in `try/catch`."* Only `admin.ts` follows this.

```ts
// problems.ts — no try/catch anywhere
router.get('/:id', async (req, res) => {
  const problem = await Problem.findOne(...)  // throws → unhandled
  ...
})
```

---

### 2. Admin routes have no authentication

**File:** `routes/admin.ts`, `index.ts:24`

`/api/admin/problems` is mounted with no middleware guard. Any client that can reach the server can create, update, publish, unpublish, and delete problems. This is the highest-privilege surface in the API.

```ts
app.use('/api/admin/problems', adminRouter)  // no auth middleware
```

Even a simple static API key checked in a middleware would prevent casual abuse.

---

### 3. Public `POST /api/problems` and `POST /api/problems/bulk` are unauthenticated write endpoints

**File:** `routes/problems.ts:133–169`

These two routes write directly to the `Problem` collection with zero authentication and zero validation. The admin router at least runs `validateProblem`; these routes use `$setOnInsert` with the raw request body.

A malicious client can inject arbitrary fields into every problem document, or stuff the collection with garbage, without needing any credentials.

---

### 4. `search` query parameter is passed unsanitized as a MongoDB regex

**File:** `routes/problems.ts:16`, `routes/admin.ts:28`

```ts
if (search) filter.title = { $regex: search, $options: 'i' }
```

An attacker can send a catastrophically backtracking regex (e.g., `(a+)+$`) as the `search` value, causing the MongoDB query thread to spin indefinitely — a ReDoS attack. The `findDuplicate` helper in `admin.ts` correctly uses `escapeRegex`, but the list endpoints do not.

---

## High

### 5. `DELETE /api/progress` does not reset daily-streak fields

**File:** `routes/progress.ts:123–136`

The delete handler resets `currentStreak`, `longestStreak`, and `solvedProblems`, but leaves `dailyStreak`, `longestDailyStreak`, `lastDailySolvedAt`, and `completedDailies` untouched. After a reset, the UI will show zeroed solve counts but retain the full daily-challenge history — an inconsistent state.

```ts
await Progress.findOneAndUpdate(
  { userId: USER_ID },
  {
    solvedProblems: {},
    lastActiveDate: '',
    currentStreak: 0,
    longestStreak: 0,
    dismissedBackupMilestone: 0,
    // dailyStreak, longestDailyStreak, lastDailySolvedAt, completedDailies NOT cleared
  },
  { upsert: true },
)
```

---

### 6. `getNavIds` fetches every published problem ID on each single-problem request

**File:** `routes/problems.ts:82–92`

```ts
const getNavIds = async (currentId: string) => {
  const allIds = await Problem.find({ status: 'published' })
    .select('id -_id')
    .sort({ _id: 1 })
    .lean()
  const index = allIds.findIndex((p) => p.id === currentId)
  ...
}
```

Every call to `GET /api/problems/:id` fires this second query that pulls **all** problem IDs into Node's heap, sorts them, and does a linear scan. At 500+ problems this is 500 reads per page view. MongoDB has no way to express "give me the document before/after X on an index" without a two-query approach, but the current approach is O(n) in both DB IO and memory.

---

### 7. `completedDailies` is an unbounded growing array stored inside a single document

**File:** `models/Progress.ts:32`, `utils/dailyStreak.ts`

Every day a user completes the daily challenge, a new date string is appended to `completedDailies`. After a year this is ~365 entries; after three years, ~1095. MongoDB documents have a 16 MB limit, but more practically, every read of the Progress document transfers this entire array even when the caller only needs the streak fields. The `dailyStreak.ts` util also does an `includes()` scan on it at call time.

---

### 8. `selectDailyIndex` resets each new year and is not stable across year boundaries

**File:** `utils/daily.ts`

```ts
export const selectDailyIndex = (totalProblems: number, date: Date): number =>
  getDayOfYear(date) % totalProblems
```

`getDayOfYear` returns 1–366. On January 1st, it resets to 1. If the current daily on December 31st was problem index 200, January 1st will serve problem index `1 % totalProblems`, likely a completely different problem, and the sequence repeats from the start. This also means the "daily" is not unique per calendar date — two dates in different years with the same day-of-year will show the same problem.

---

### 9. No indexes on frequently-filtered Problem fields

**File:** `models/Problem.ts`

The `Problem` schema only defines `unique` indexes on `id` and `title`. Every query using `status`, `category`, `difficulty`, `collectionId`, or `patternTag` does a full collection scan. These fields appear in every `GET /api/problems` call, all aggregations in `/categories/counts` and `/collections/counts`, and the daily route.

---

## Medium

### 10. `USER_ID = 'default'` is duplicated across four route files

**Files:** `routes/progress.ts:10`, `routes/daily.ts:11`, `routes/submissions.ts:7`, `routes/visits.ts:7`

This constant is copied verbatim into four files. If the auth strategy changes (even just to a different default value for testing), all four files need updating independently.

---

### 11. Inline `RT` type defined twice in the same file

**File:** `routes/progress.ts:46`, `routes/progress.ts:98`

```ts
// line 46
type RT = { ms: number; accepted: boolean }

// line 98 (identical)
type RT = { ms: number; accepted: boolean }
```

This is a duplicate type declaration inside different handler scopes. It should be a single named type at module level (or imported from `utils/serializeProgress.ts` which already defines the same shape).

---

### 12. `visits.ts` stats endpoint loads all visit records into JS memory

**File:** `routes/visits.ts:23`

```ts
const visits = await Visit.find({ userId: USER_ID }, { problemId: 1, _id: 0 }).lean()
```

All visit documents for the user are fetched and aggregated in application code. The same result is achievable with a single MongoDB `$group` aggregation. As visit counts grow (hundreds of problem views per day), this becomes a large memory allocation on every stats page load.

---

### 13. `POST /api/progress/import` writes raw user-supplied data with no structural validation

**File:** `routes/progress.ts:216–243`

Only `solvedProblems` field presence is checked. The contents of `solvedProblems`, `currentStreak`, `longestStreak`, and `lastActiveDate` are written directly to MongoDB without type-checking or sanitization. A malformed import can corrupt the Progress document in ways that cause downstream crashes (e.g., `solvedProblems` containing non-object values breaks the serializer).

---

### 14. `seed.ts` path relies on a fragile relative `__dirname` chain

**File:** `seed.ts:7`

```ts
const PROBLEMS_DIR = path.resolve(__dirname, '../../server/data/problems')
```

When ts-node-dev runs `seed.ts` from `server/src/`, `__dirname` is `<root>/server/src`. Going up two levels reaches the project root, then appending `server/data/problems` works — but only if the seed is always run from that specific context. If the compiled output lands in `server/dist/src/`, the path breaks. Using `path.resolve(__dirname, '../data/problems')` relative to `server/src/` would be more robust and accurately reflects the actual directory relationship.

---

### 15. `submission.verdict` accepts any string — no enum constraint

**File:** `routes/submissions.ts:11`, `models/Submission.ts`

The `verdict` field is stored as a free-form string with no validation against an allowed set (e.g. `'accepted' | 'wrong-answer' | 'error'`). Junk values can be stored and later displayed in the UI without any sanitization path.

---

### 16. CORS is fully open

**File:** `index.ts:15`

```ts
app.use(cors())
```

`cors()` with no options allows any origin. In development this is fine, but if the server is ever deployed, this permits cross-origin requests from any website — a risk if cookie-based auth is added later.

---

## Low

### 17. `solvedAt` defaults to an empty string instead of being optional

**File:** `models/Progress.ts:5`

```ts
solvedAt: { type: String, default: '' }
```

An empty string is a sentinel value that is checked throughout the codebase (`existing?.solvedAt`, `entry.solvedAt ? ...`). A Mongoose field that is sometimes empty and sometimes an ISO string is harder to reason about than a field that is `undefined | string`. This also means the `isFirstSolve` logic in `progress.ts:44` silently handles both "never set" and "set to empty string by the attempt endpoint."

---

### 18. `daily.ts` makes two sequential DB queries when one would do

**File:** `routes/daily.ts:15–29`

The route first fetches all published IDs to pick an index, then immediately fetches the full problem document by that ID. Because the index math produces the `id` string, the second query could use the same list — or the first query could select all required fields at once.

---

### 19. `POST /api/daily/complete` has no idempotency guard at the route level

**File:** `routes/daily.ts:43`

`updateDailyStreak` is idempotent (it checks `completedDailies.includes(today)`), but the route still performs a full DB read-modify-write cycle on every call regardless. There is no early response for a duplicate completion, so the client gets a full progress payload on every tap of a "complete" button.

---

### 20. `dismiss-banner/:milestone` does not validate that `milestone` is a non-negative integer

**File:** `routes/progress.ts:208–214`

```ts
const milestone = parseInt(req.params.milestone)
```

`parseInt('abc')` returns `NaN`, which Mongoose will coerce to `null` and store without error. There is no `isNaN` guard.

---

## Positive Observations

- **Pure utility functions** — `streak.ts`, `review.ts`, `dailyStreak.ts`, and `activity.ts` have no side effects, take typed inputs, and return typed outputs. Easy to unit test.
- **`serializeProgress` normalizes legacy data** — the `normalizeRunTimings` function handles the old `number` format gracefully alongside the new `{ ms, accepted }` shape.
- **Seed script is upsert-safe** — re-running never duplicates records; duplicate key errors are caught and counted.
- **Route ordering is correct** — specific paths (`/patterns`, `/categories/counts`, `/collections/counts`) are correctly defined before `/:id` in `problems.ts`.
- **`stripHiddenExpected` protects test answers** — hidden test `expected` values are nulled before the problem is sent to the client.
- **`admin.ts` has consistent try/catch** — all admin handlers follow the CLAUDE.md rule that the public routes do not.
- **`runTimings` is capped at 20 entries** — prevents unbounded growth of per-problem timing history.
