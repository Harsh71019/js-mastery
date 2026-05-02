# Adding Problems

## How it works

Problems live in MongoDB with a `draft` / `published` status. The recommended workflow is:

1. **Generate** a JSON array of problems (manually or with AI)
2. **Import** via the admin script — duplicates and invalid fields are reported per item
3. **Review** drafts in the browser or via the API
4. **Publish** when satisfied

No seed script, no JSON files to maintain.

---

## Step 1 — Generate problems with AI

Copy the prompt below, fill in the bracketed values, and paste it to any AI (Claude, ChatGPT, etc.).

```
Generate [NUMBER] JavaScript coding problems for a loop/iteration mastery trainer app.

Target category: "[CATEGORY_SLUG]"   ← pick one from the table below
Target difficulty: "[DIFFICULTY]"    ← Beginner | Easy | Medium | Hard

Return ONLY a valid JSON array with no explanation. Each item must have every field below — no field may be omitted.

{
  "id": "<category-slug>-<descriptive-kebab-name>",
  "title": "...",
  "category": "<category-slug>",
  "difficulty": "Beginner" | "Easy" | "Medium" | "Hard",
  "functionName": "...",
  "description": "...",
  "whatShouldHappen": ["step 1", "step 2", "step 3", "step 4"],
  "starterCode": "function functionName(param) {\n  // your code here\n}",
  "skeletonHint": "function functionName(param) {\n  ...____..\n}",
  "solution": "function functionName(param) {\n  // every single line has a comment\n  ...\n}",
  "traceTable": {
    "inputLabel": "param = <example>",
    "columns": ["i", "variable", "..."],
    "rows": [{ "i": 0, "variable": ... }]
  },
  "tests": [
    { "input": [<arg1>], "expected": ..., "label": "normal input" },
    { "input": [...],    "expected": ..., "label": "edge case" },
    { "input": [...],    "expected": ..., "label": "single element" },
    { "input": [...],    "expected": ..., "label": "empty array" }
  ],
  "patternTag": "2–4 word tag",
  "patternExplanation": "One sentence connecting this to the general pattern.",
  "estimatedMinutes": 5,
  "status": "draft"
}

RULES — follow these exactly or the import will fail:

1. tests[].input is always an array of the function's arguments.
   - filterEvens(nums)        → "input": [[1, 2, 3]]       (one array arg wrapped in outer array)
   - twoSum(nums, target)     → "input": [[2, 7, 11], 9]   (two args in the outer array)
   - sum(a, b)                → "input": [3, 4]            (two scalar args)

2. traceTable.rows must be accurate for the exact inputLabel given. Do not approximate.

3. solution must have a // comment on every single line without exception.

4. Each problem needs at least 4 tests covering: normal input, edge case, single element, empty/zero.

5. functionName must be unique — do NOT use any of these already-taken names:
   [PASTE THE OUTPUT OF: curl http://localhost:3001/api/admin/problems/stats]

6. id must be unique and descriptive — use "basic-loops-count-positives" not "basic-loops-6".

7. No two problems in the batch should test the same core concept.
```

### Category slugs

| Category | Slug to use in prompt |
|---|---|
| Basic Loops | `basic-loops` |
| Reverse Loops | `reverse-loops` |
| for...in / for...of | `for-in-for-of` |
| Nested Loops | `nested-loops` |
| Array Building | `array-building` |
| Object Loops | `object-loops` |
| Two Pointer | `two-pointer` |
| Prefix & Suffix | `prefix-suffix` |
| Sliding Window | `sliding-window` |
| Polyfills | `polyfills` |
| Tricky Patterns | `tricky-patterns` |

---

## Step 2 — Save the AI output

Save the JSON array to a file anywhere, e.g.:

```
scripts/problems-basic-loops.json
scripts/batch-2025-05-01.json
```

The filename doesn't matter. Multiple batches can be imported independently.

---

## Step 3 — Import via the script

The server must be running (`npm run dev`).

```bash
# Add as drafts (review before publishing)
node scripts/add-problems.js scripts/your-file.json

# Add and publish immediately (you trust the AI output)
node scripts/add-problems.js scripts/your-file.json --publish
```

The script prints a summary:

```
Summary: 4 inserted  1 duplicates  0 invalid

Inserted:
  + basic-loops-count-positives (draft)
  + basic-loops-product-array (draft)
  + basic-loops-first-even (draft)
  + basic-loops-all-positive (draft)

Skipped (duplicates):
  ~ [2] basic-loops-find-max  →  matched: basic-loops-2
```

Duplicates are detected on **three fields** — if any match, the problem is skipped:
- `id` (exact)
- `title` (case-insensitive)
- `functionName` (exact)

---

## Step 4 — Review drafts

```bash
# List all drafts
curl http://localhost:3001/api/admin/problems?status=draft

# Read one full problem
curl http://localhost:3001/api/admin/problems/<id>
```

---

## Step 5 — Publish

```bash
# Publish one
curl -X POST http://localhost:3001/api/admin/problems/<id>/publish

# Unpublish (send back to draft)
curl -X POST http://localhost:3001/api/admin/problems/<id>/unpublish

# Edit a field before publishing
curl -X PATCH http://localhost:3001/api/admin/problems/<id> \
  -H "Content-Type: application/json" \
  -d '{ "difficulty": "Easy" }'

# Delete a bad problem
curl -X DELETE http://localhost:3001/api/admin/problems/<id>
```

---

## Admin API reference

All routes are under `/api/admin/problems`.

| Method | Path | What it does |
|---|---|---|
| `GET` | `/` | List all problems (any status). Query: `status`, `category`, `difficulty`, `search`, `page`, `limit` |
| `GET` | `/stats` | Counts by status and category |
| `POST` | `/` | Create one. Validates + deduplicates. Defaults to `draft`. |
| `POST` | `/bulk` | Create many. Returns `{ summary, inserted[], duplicates[], invalid[] }` per item. |
| `GET` | `/:id` | Full problem (any status) |
| `PATCH` | `/:id` | Partial update. Cannot change `id`. |
| `DELETE` | `/:id` | Delete permanently |
| `POST` | `/:id/publish` | Set status → `published` |
| `POST` | `/:id/unpublish` | Set status → `draft` |

---

## Adding a new category

If your category slug is not in the table above, three more things must change before seeding:

### 1 — Register the slug in TypeScript

Open `client/src/types/problem.ts` and add to the `CategorySlug` union:

```typescript
export type CategorySlug =
  | 'basic-loops'
  // ... existing ...
  | 'your-new-slug'   // ← add here
```

### 2 — Add category metadata

Open `client/src/data/categories.ts` and add an entry:

```typescript
{
  slug: 'your-new-slug',
  title: 'Your Category Title',
  description: 'One sentence describing what the learner will practice.',
  accentColor: '#f43f5e',  // pick a unique hex not used by another category
}
```

Existing accent colors (don't reuse):
`#3b82f6` `#8b5cf6` `#06b6d4` `#f59e0b` `#22c55e` `#f97316` `#ec4899` `#a855f7` `#14b8a6` `#6366f1` `#ef4444`

### 3 — Then import problems as normal

Use the script above with `"category": "your-new-slug"` in every problem object.

---

## Field reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | `<category-slug>-<descriptive-name>`. Unique across all problems. |
| `title` | string | Unique across all problems. Title case. |
| `category` | string | Must exactly match the category slug. |
| `difficulty` | string | One of: `Beginner` `Easy` `Medium` `Hard` |
| `functionName` | string | camelCase JS function name, no parentheses. Unique. |
| `description` | string | One clear paragraph. |
| `whatShouldHappen` | string[] | 3–5 imperative steps. No code. |
| `starterCode` | string | Use `\n` for newlines. Ends with `// your code here` inside body. |
| `skeletonHint` | string | Same as starterCode but with `____` blanks at key decision points. |
| `solution` | string | Every line must have a `// comment` explaining what it does. |
| `traceTable.inputLabel` | string | e.g. `"nums = [1, 2, 3]"` |
| `traceTable.columns` | string[] | Column headers — must exactly match keys used in rows. |
| `traceTable.rows` | object[] | One row per iteration. Accurate for the inputLabel given. |
| `tests` | object[] | Minimum 4: normal, edge, single-element, empty/zero. |
| `tests[].input` | array | Array of arguments spread into the function: `fn(...input)`. |
| `tests[].expected` | any | Exact return value. |
| `tests[].label` | string | What this test is checking. |
| `patternTag` | string | 2–4 words e.g. `"Counter Variable"`, `"Early Exit Search"`. |
| `patternExplanation` | string | One sentence connecting this to the general pattern. |
| `estimatedMinutes` | number | Beginner: 5–8, Easy: 8–15, Medium: 15–25, Hard: 25+ |
| `status` | string | `"draft"` or `"published"` |

### The tests input format — common mistake

`tests[].input` is always **an array of the function's arguments** because the runner calls `fn(...input)`.

```
function filterEvens(nums)          →  "input": [[1, 2, 3]]       outer array wraps the one arg
function twoSum(nums, target)       →  "input": [[2, 7, 11], 9]   two args side-by-side
function sum(a, b)                  →  "input": [3, 4]            two scalar args
```

---

## Legacy — seed from JSON files

The old workflow (editing JSON files in `server/data/problems/` then running `npm run seed`) still works and is safe to re-run. Use it if you need to bulk-restore problems from a backup export or migrate from another environment.

```bash
# Export everything currently in Mongo to a file
curl http://localhost:3001/api/progress/export > backup.json

# Re-seed from the JSON files on disk
npm run seed
```
