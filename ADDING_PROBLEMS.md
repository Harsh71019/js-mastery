# Adding Problems Guide

Two scenarios: adding a problem to an **existing category**, or creating an **entirely new category**. Read the relevant section below.

---

## Scenario A — Add a problem to an existing category

**One file changes. That's it.**

1. Open the matching file in `server/data/problems/`. The filename is the category slug:

   | Category | File |
   |---|---|
   | Basic Loops | `server/data/problems/basic-loops.json` |
   | Reverse Loops | `server/data/problems/reverse-loops.json` |
   | for...in / for...of | `server/data/problems/for-in-for-of.json` |
   | Nested Loops | `server/data/problems/nested-loops.json` |
   | Array Building | `server/data/problems/array-building.json` |
   | Object Loops | `server/data/problems/object-loops.json` |
   | Two Pointer | `server/data/problems/two-pointer.json` |
   | Prefix & Suffix | `server/data/problems/prefix-suffix.json` |
   | Sliding Window | `server/data/problems/sliding-window.json` |
   | Polyfills | `server/data/problems/polyfills.json` |
   | Tricky Patterns | `server/data/problems/tricky-patterns.json` |

2. Append a new object to the JSON array. Full annotated example:

```json
{
  "id": "array-building-5",
  "title": "Double Each Element",
  "category": "array-building",
  "difficulty": "Beginner",
  "functionName": "doubleEach",
  "description": "Given an array of numbers, return a new array where every element is multiplied by 2.",
  "whatShouldHappen": [
    "Create an empty result array.",
    "Loop through each element.",
    "Multiply each element by 2 and push it into result.",
    "Return result."
  ],
  "starterCode": "function doubleEach(nums) {\n  // your code here\n}",
  "skeletonHint": "function doubleEach(nums) {\n  const result = [];\n  for (let i = 0; i < ____; i++) {\n    result.push(nums[i] * ____);\n  }\n  return result;\n}",
  "solution": "function doubleEach(nums) {\n  // result holds the transformed elements\n  const result = [];\n  // visit every index\n  for (let i = 0; i < nums.length; i++) {\n    // multiply current element by 2\n    result.push(nums[i] * 2);\n  }\n  // return the new array\n  return result;\n}",
  "traceTable": {
    "inputLabel": "nums = [1, 2, 3]",
    "columns": ["i", "nums[i]", "nums[i] * 2", "result"],
    "rows": [
      { "i": 0, "nums[i]": 1, "nums[i] * 2": 2,  "result": "[2]" },
      { "i": 1, "nums[i]": 2, "nums[i] * 2": 4,  "result": "[2, 4]" },
      { "i": 2, "nums[i]": 3, "nums[i] * 2": 6,  "result": "[2, 4, 6]" }
    ]
  },
  "tests": [
    { "input": [[1, 2, 3]],   "expected": [2, 4, 6],  "label": "normal case" },
    { "input": [[0, -1, 5]],  "expected": [0, -2, 10], "label": "zero and negative" },
    { "input": [[7]],         "expected": [14],         "label": "single element" },
    { "input": [[]],          "expected": [],           "label": "empty array" }
  ],
  "patternTag": "Transform Accumulator",
  "patternExplanation": "Map each element to a new value and collect results — the pattern behind Array.prototype.map.",
  "estimatedMinutes": 5,
  "status": "published"
}
```

3. Run the seed:

```bash
npm run seed
```

That's it. The problem is live immediately — no server restart needed.

---

## Field reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | `<category-slug>-<N>`. Must be unique across all problems. |
| `title` | string | Must be unique across all problems. |
| `category` | string | Must exactly match the category slug. |
| `difficulty` | string | One of: `Beginner` `Easy` `Medium` `Hard` |
| `functionName` | string | The JS function name the user implements (no parentheses). |
| `description` | string | One clear paragraph. |
| `whatShouldHappen` | string[] | 3–5 steps. Imperative sentences. No code. |
| `starterCode` | string | Use `\n` for newlines. End with `// your code here` inside the function body. |
| `skeletonHint` | string | Same structure as starter code but with `____` blanks at key spots. |
| `solution` | string | Every line must have a `// comment` explaining what it does. |
| `traceTable.inputLabel` | string | e.g. `"nums = [1, 2, 3]"` |
| `traceTable.columns` | string[] | Column headers — match variable names used in the loop. |
| `traceTable.rows` | object[] | One row per iteration. Keys match the columns exactly. |
| `tests` | object[] | Minimum 4. Cover: normal input, edge case, single element, empty/zero. |
| `tests[].input` | array | **Always an array of arguments.** One-arg function: `[[1,2,3]]`. Two-arg: `[[1,2], 5]`. |
| `tests[].expected` | any | The exact return value of the function. |
| `tests[].label` | string | Short description of what the test checks. |
| `patternTag` | string | 2–4 word label e.g. `"Sliding Window"`, `"Two Pointer"`. |
| `patternExplanation` | string | One sentence connecting this problem to the general pattern. |
| `estimatedMinutes` | number | Realistic solve time. Beginner: 5–8, Easy: 8–15, Medium: 15–25, Hard: 25+. |
| `status` | string | `"published"` to show in app, `"draft"` to hide. |

### Common mistake — tests input format

The `input` field is always **an array of the function's arguments**, not the arguments themselves.

```json
// function sum(a, b)  →  two arguments
{ "input": [3, 4], "expected": 7 }          // WRONG
{ "input": [[3, 4]], "expected": 7 }         // WRONG — that passes one array arg

// correct:
{ "input": [3, 4], "expected": 7 }          // only correct if sum takes two numbers
```

Actually the executor spreads `input` as `fn(...input)`. So:
- `sum(a, b)` with args `3, 4` → `"input": [3, 4]`
- `filterEvens(nums)` with arg `[1,2,3]` → `"input": [[1, 2, 3]]`
- `twoSum(nums, target)` with args `[2,7,11]` and `9` → `"input": [[2, 7, 11], 9]`

---

## Scenario B — Add a new category

**Four things change.** Do them in this order.

### Step 1 — Create the problem file

Create `server/data/problems/<your-slug>.json` with an array of problem objects. Use the format from Scenario A. The slug must be all lowercase, words separated by hyphens: `string-manipulation`, `recursion`, `sorting-algorithms`.

```bash
# Example
touch server/data/problems/string-manipulation.json
# Then add [ { ...problem }, { ...problem } ] inside it
```

### Step 2 — Register the slug in TypeScript types

Open `client/src/types/problem.ts` and add your slug to the `CategorySlug` union:

```typescript
export type CategorySlug =
  | 'basic-loops'
  | 'reverse-loops'
  // ... existing slugs ...
  | 'string-manipulation'   // ← add here
```

### Step 3 — Add the category metadata

Open `client/src/data/categories.ts` and add an entry to the `CATEGORIES` array:

```typescript
{
  slug: 'string-manipulation',
  title: 'String Manipulation',
  description: 'Loop over characters, build substrings, and transform string data.',
  accentColor: '#f43f5e',
},
```

Pick a unique `accentColor` hex that isn't already used by another category. Existing ones: `#3b82f6` `#8b5cf6` `#06b6d4` `#f59e0b` `#22c55e` `#f97316` `#ec4899` `#a855f7` `#14b8a6` `#6366f1` `#ef4444`.

### Step 4 — Seed

```bash
npm run seed
```

The new category and its problems appear immediately in the app's sidebar, problem list, and category page.

---

## Checklist before seeding

- [ ] `id` is unique (check other files in `server/data/problems/` — no two problems share an id)
- [ ] `title` is unique across all files
- [ ] `category` matches the slug exactly
- [ ] `tests` has at least 4 entries covering normal, edge, single-element, and empty cases
- [ ] `status` is `"published"`
- [ ] For a new category: slug added to `CategorySlug` union **and** entry added to `CATEGORIES`
- [ ] Run `npm run seed` — watch the output for any `skipped` or `error` lines
