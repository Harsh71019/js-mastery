# Trick Questions Feature Plan

## What this adds

Trick questions show a JavaScript code snippet and ask the user to predict what it does — output, type, thrown error, etc. They target JS gotchas: type coercion, hoisting, closure-in-loops, `==` vs `===`, `typeof null`, prototype quirks, and so on. The user picks from 3–5 options. After answering, a detailed `gotchaExplanation` breaks down the JS behavior.

This feature **depends on the MCQ feature being implemented first** (phases 1–5 of `MCQ_FEATURE.md`), because it reuses the `McqOptions` component and the `type` field added to the Problem model.

---

## New fields on Problem (beyond MCQ additions)

```
type              'trick'    (extends the enum from MCQ plan)
codeSnippet       string     required when type = 'trick' — the JS code to analyze
options           string[]   required when type = 'trick', same as MCQ (2–6 options)
correctIndex      number     required when type = 'trick'
gotchaExplanation string     required when type = 'trick' — detailed breakdown of the JS behavior
```

Fields **unused** for trick problems (same as MCQ):
`starterCode`, `skeletonHint`, `solution`, `traceTable`, `functionName`, `whatShouldHappen`, `tests`

---

## Phase 1 — Server: Problem model

**File: `server/src/models/Problem.ts`**

The `type` enum from the MCQ plan already includes `'trick'`. One new field to add:

```typescript
codeSnippet:       { type: String, default: undefined },
gotchaExplanation: { type: String, default: undefined },
```

`options` and `correctIndex` are already added in the MCQ plan and are reused here.

No migration needed.

---

## Phase 2 — Server: Validation

**File: `server/src/utils/problem-validation.ts`**

Add `validateTrickFields` to the type-dispatch added in the MCQ plan:

```
validateProblem(doc)
  → type === 'trick'  → validateTrickFields(doc)
  → type === 'mcq'    → validateMcqFields(doc)
  → else              → validateCodingFields(doc)
```

`validateTrickFields` checks:
- Shared required fields: `id`, `title`, `category`, `difficulty`, `patternTag`, `patternExplanation`, `estimatedMinutes`
- `codeSnippet` — non-empty string
- `options` — array of 2–6 non-empty strings
- `correctIndex` — whole number, valid index into `options`
- `gotchaExplanation` — non-empty string (should be substantial — the educational payoff)

Intentionally does NOT require `description` — the codeSnippet is the question itself. But allow it if provided.

---

## Phase 3 — Server: Public API

**File: `server/src/routes/problems.ts`**

No route changes needed. `GET /:id` already returns all fields. `type` is already added to `LIST_FIELDS` in the MCQ plan.

`correctIndex` is returned in the response (same reasoning as MCQ — personal app, no auth).

No answer-checking endpoint needed.

---

## Phase 4 — Client: Types

**File: `client/src/types/problem.ts`**

Add:
```typescript
export interface TrickProblem {
  readonly id: string
  readonly title: string
  readonly type: 'trick'
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly description?: string          // optional — codeSnippet is the question
  readonly codeSnippet: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly gotchaExplanation: string
  readonly patternTag: string
  readonly patternExplanation: string
  readonly estimatedMinutes: number
}
```

Update `ProblemType` (already added in MCQ plan):
```typescript
export type ProblemType = 'coding' | 'mcq' | 'trick'
```

Add a type guard:
```typescript
export const isTrickProblem = (p: Problem | McqProblem | TrickProblem): p is TrickProblem =>
  p.type === 'trick'
```

Update `useProblem` return type to `Problem | McqProblem | TrickProblem`.

---

## Phase 5 — Client: TrickQuestionView component

**New file: `client/src/components/problems/TrickQuestionView.tsx`**

Props:
```typescript
interface TrickQuestionViewProps {
  readonly problem: TrickProblem
  readonly nextId: string | null
  readonly prevId: string | null
}
```

Local state: `selectedIndex: number | null`, `isSubmitted: boolean`

Layout (single column):
```
┌─────────────────────────────────────────┐
│ title + difficulty badge                │
│ optional description (if present)       │
│ ──────────────────────────────────────  │
│ Code snippet (read-only)                │
│  ┌──────────────────────────────────┐   │
│  │  const x = typeof null;          │   │
│  │  console.log(x);                 │   │
│  └──────────────────────────────────┘   │
│                                         │
│ What does this output?                  │
│ <McqOptions />                          │
│                                         │
│ [Submit] button                         │
│                                         │
│ After submission:                       │
│   ✓ Correct! / ✗ Wrong                  │
│   gotchaExplanation (full breakdown)    │
│   patternTag + patternExplanation       │
│   [Next Problem →]                      │
└─────────────────────────────────────────┘
```

**Code snippet rendering:**
Use a `<pre>` tag styled with `font-jetbrains`, dark background, horizontal scroll. Do NOT use Monaco — it's overkill for read-only display and adds ~200ms load time. Add a small language badge (`JS`) in the top-right corner of the code block.

**Reuses `McqOptions`** from MCQ Phase 5 — no new option component needed.

On submit:
- If correct → `markSolved(id, meta)` → confetti
- If wrong → `incrementAttempts(id)`
- `isSubmitted = true`

Resets on `problem.id` change.

---

## Phase 6 — Client: ProblemPage routing

**File: `client/src/pages/ProblemPage.tsx`**

The refactor from MCQ Phase 7 already extracted `CodingProblemView`. Add the trick branch:

```typescript
if (isTrickProblem(problem)) {
  return <TrickQuestionView problem={problem} nextId={nextId} prevId={prevId} />
}
if (isMcqProblem(problem)) {
  return <McqProblemView problem={problem} nextId={nextId} prevId={prevId} />
}
return <CodingProblemView problem={problem} nextId={nextId} prevId={prevId} />
```

No other routing or URL changes needed — trick problems live at `/problem/:id` like everything else.

---

## Phase 7 — Client: Problem list

**File: `client/src/components/problems/ProblemTable.tsx`**

Add a `Trick` badge (amber/orange, distinct from MCQ's purple) in the same type column introduced by the MCQ plan.

**File: `client/src/components/problems/FilterBar.tsx`**

Extend the type filter to three options: `All | Coding | MCQ | Trick`.

---

## Trick question schema for AI generation

When prompting AI for trick questions, use this structure:

```json
{
  "id": "tricky-patterns-typeof-null",
  "title": "typeof null",
  "type": "trick",
  "category": "tricky-patterns",
  "difficulty": "Easy",
  "codeSnippet": "console.log(typeof null);",
  "options": [
    "\"null\"",
    "\"object\"",
    "\"undefined\"",
    "null"
  ],
  "correctIndex": 1,
  "gotchaExplanation": "typeof null returns \"object\" — this is a well-known bug in JavaScript that has existed since the language's first version and cannot be fixed without breaking backwards compatibility. null is not actually an object; typeof is simply wrong here. Use === null to check for null explicitly.",
  "patternTag": "typeof Gotcha",
  "patternExplanation": "Never rely on typeof to detect null — it lies. Always use === null.",
  "estimatedMinutes": 2,
  "status": "draft"
}
```

Fields not needed for trick problems (omit them): `functionName`, `starterCode`, `skeletonHint`, `solution`, `traceTable`, `whatShouldHappen`, `tests`.

### Good trick question topics for AI prompts

Paste these as context when asking AI to generate trick questions:

```
JS gotchas to cover:
- typeof null, typeof undefined, typeof NaN
- == vs === coercion: 0 == false, "" == 0, null == undefined
- NaN !== NaN, isNaN vs Number.isNaN
- Hoisting: var vs let vs const, function declarations vs expressions
- Closure in for loops with var vs let
- Array holes: [,,,].length, sparse array behaviour
- + operator: number + string, [] + [], [] + {}
- parseInt edge cases: parseInt("08"), parseInt with radix
- this in arrow functions vs regular functions
- Object reference equality: {} === {} is false
- for...in iterating prototype chain
- typeof throws vs ReferenceError for undeclared variables
- Falsy values: 0, "", null, undefined, NaN, false — not [] or {}
```

---

## AI prompt addendum for trick questions

When telling AI to generate trick questions, add this to the base prompt from `ADDING_PROBLEMS.md`:

```
Additional rules for type: "trick":
- codeSnippet must be short (1–6 lines). The learner should be able to reason about it mentally.
- options must be plausible. At least two options should look reasonable to someone who hasn't memorized the gotcha.
- correctIndex is 0-based.
- gotchaExplanation must explain WHY the JS engine behaves this way, not just what the output is. Minimum 2 sentences.
- Do not repeat the same gotcha twice in a batch — check that each problem tests a distinct concept.
- Prefer "What does this output?" or "What is the value of x?" as the implicit question — keep the framing simple.
```

---

## Checklist

- [ ] MCQ plan phases 1–5 completed first (model, validation, types, McqOptions component)
- [ ] Phase 1: `codeSnippet` and `gotchaExplanation` added to model, server restarts
- [ ] Phase 2: `validateTrickFields` rejects missing `codeSnippet` or `gotchaExplanation`
- [ ] Phase 3: no API changes needed — verify `codeSnippet` appears in GET /:id response
- [ ] Phase 4: `isTrickProblem` type guard compiles, `useProblem` return type updated
- [ ] Phase 5: code snippet renders in `<pre>` with monospace font and scroll, `McqOptions` reused
- [ ] Phase 6: `ProblemPage` routes to `TrickQuestionView` for trick problems
- [ ] Phase 7: Trick badge visible in list, filter includes Trick option
