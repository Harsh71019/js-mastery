# Pattern-Based Study Mode Feature

## Goal

Let users study by pattern tag (closures, coercion, hoisting, two-pointer, etc.) rather than only by category. Every problem already has a `patternTag` field — this feature surfaces it as a first-class navigation axis. Users can browse all patterns, see how many problems belong to each, and work through a focused pattern session end-to-end.

---

## Architecture Overview

### No new models needed

`patternTag` is already stored on every `Problem` document. All reads are aggregations and filtered queries on the existing collection.

### New API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/problems/patterns` | Returns all unique pattern tags with problem counts, sorted by count desc |
| GET | `/api/problems?patternTag=X` | Existing list endpoint — add `patternTag` as a new query filter |

### URL structure

```
/patterns                  → PatternsPage (grid of all pattern cards)
/patterns/:tag             → PatternPage  (problem list for one tag)
```

---

## Phases

---

### Phase 1 — Server: Patterns Aggregation Endpoint

**File:** `server/src/routes/problems.ts`

Add a new route **before** `/:id` (same rule as `/categories/counts`):

```typescript
router.get('/patterns', async (_req: Request, res: Response): Promise<void> => {
  const patterns = await Problem.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$patternTag', count: { $sum: 1 } } },
    { $project: { _id: 0, tag: '$_id', count: 1 } },
    { $sort: { count: -1, tag: 1 } },
  ])

  res.json(patterns)
})
```

**File:** `server/src/routes/problems.ts` — extend the list `GET /` handler

Add `patternTag` to the destructured query params and filter:

```typescript
const { category, difficulty, search, type, patternTag } = req.query

// existing filters ...
if (patternTag) filter.patternTag = patternTag
```

No client changes in this phase.

---

### Phase 2 — Client Types & Hooks

**File:** `client/src/types/problem.ts`

Add `PatternSummary` interface:

```typescript
export interface PatternSummary {
  readonly tag:   string
  readonly count: number
}
```

**File:** `client/src/hooks/useProblems.ts` — extend `ProblemFilters`

```typescript
export interface ProblemFilters {
  readonly search:     string
  readonly difficulty: Difficulty | 'all'
  readonly category:   CategorySlug | 'all'
  readonly type:       ProblemType | 'all' | 'quiz'
  readonly patternTag?: string   // NEW — optional, undefined means no filter
}
```

Update `buildQuery` to include `patternTag`:

```typescript
if (filters.patternTag) params.set('patternTag', filters.patternTag)
```

**New file:** `client/src/hooks/usePatterns.ts`

```typescript
import { useState, useEffect } from 'react'
import type { PatternSummary } from '@/types/problem'

interface UsePatternsResult {
  readonly patterns:  readonly PatternSummary[]
  readonly isLoading: boolean
  readonly error:     string | null
}

export const usePatterns = (): UsePatternsResult => {
  const [patterns, setPatterns]  = useState<readonly PatternSummary[]>([])
  const [isLoading, setLoading]  = useState(true)
  const [error, setError]        = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/problems/patterns')
      .then((r) => r.json() as Promise<PatternSummary[]>)
      .then((data) => { setPatterns(data); setLoading(false) })
      .catch(() => { setError('Failed to load patterns'); setLoading(false) })
  }, [])

  return { patterns, isLoading, error }
}
```

---

### Phase 3 — Patterns Overview Page

**New file:** `client/src/pages/PatternsPage.tsx`

Grid of pattern cards. Each card shows: tag name, problem count, solved count (derived from `solvedProblems`), and a mini progress bar.

```typescript
export const PatternsPage = (): React.JSX.Element => {
  const { patterns, isLoading } = usePatterns()
  const { solvedProblems }      = useProgress()

  if (isLoading) return <PatternGridSkeleton />

  return (
    <div className="px-6 py-8">
      <h1 className="text-text-primary font-medium mb-6">
        {patterns.length} Patterns
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {patterns.map((pattern) => (
          <PatternCard
            key={pattern.tag}
            pattern={pattern}
            solvedProblems={solvedProblems}
          />
        ))}
      </div>
    </div>
  )
}
```

**New file:** `client/src/components/patterns/PatternCard.tsx`

Props: `pattern: PatternSummary`, `solvedProblems: Record<string, SolvedEntry>`

Layout:
- Pattern tag name (title-case or as-is)
- `N problems` count in `text-text-tertiary`
- Mini horizontal progress bar: solved / total
- Whole card is a `Link` to `/patterns/:encodedTag`

```typescript
export const PatternCard = ({ pattern, solvedProblems }: PatternCardProps): React.JSX.Element => {
  const solvedCount = Object.values(solvedProblems).filter(
    (e) => e.category === pattern.tag  // NOTE: join on patternTag stored in SolvedEntry
  ).length
  const pct = Math.round((solvedCount / pattern.count) * 100)

  return (
    <Link
      to={`/patterns/${encodeURIComponent(pattern.tag)}`}
      className="block rounded border border-border-default bg-bg-secondary p-4 hover:border-border-hover transition-colors duration-150"
    >
      <p className="text-text-primary text-sm font-medium mb-1">{pattern.tag}</p>
      <p className="text-text-tertiary text-xs mb-3">{pattern.count} problems</p>
      <div className="h-1 bg-bg-tertiary rounded overflow-hidden">
        <div className="h-1 bg-accent-green rounded" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-text-tertiary text-xs mt-1.5">{solvedCount} / {pattern.count} solved</p>
    </Link>
  )
}
```

> **Note on progress bar width:** This is one of the rare cases where an inline style is justified — the width is a runtime-calculated percentage, not a design-scale value.

---

### Phase 4 — Pattern Detail Page

**New file:** `client/src/pages/PatternPage.tsx`

Shows all problems for a single pattern tag. Reuses `ProblemTable` and pagination — same pattern as `CategoryPage`.

```typescript
export const PatternPage = (): React.JSX.Element => {
  const { tag }    = useParams<{ tag: string }>()
  const decodedTag = tag ? decodeURIComponent(tag) : ''

  const [page, setPage]       = useState(1)
  const { solvedProblems }    = useProgress()

  const apiFilters: ProblemFilters = useMemo(
    () => ({
      search:     '',
      difficulty: 'all',
      category:   'all',
      type:       'all',
      patternTag: decodedTag,
    }),
    [decodedTag],
  )

  const { problems, pagination, isLoading, error } = useProblems(apiFilters, page)

  if (error) return <ErrorState />

  return (
    <div className="flex flex-col">
      <div className="px-6 py-4 border-b border-border-default">
        <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">Pattern</p>
        <h1 className="text-text-primary font-medium">{decodedTag}</h1>
      </div>
      <ProblemTable problems={problems} solvedProblems={solvedProblems} isLoading={isLoading} />
      {pagination.totalPages > 1 && (
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
```

> **Refactor opportunity:** The `Pagination` block is duplicated across ProblemsPage, QuizPage, CategoryPage, and now PatternPage. Extract it to `client/src/components/ui/Pagination.tsx` before or during this phase.

---

### Phase 5 — Clickable Pattern Tags + Navigation

**File:** `client/src/components/problems/ProblemTable.tsx`

Make the `patternTag` cell in the table a link to `/patterns/:encodedTag` instead of plain text.

```typescript
<Link
  to={`/patterns/${encodeURIComponent(row.patternTag)}`}
  className="text-text-tertiary hover:text-accent-blue text-xs transition-colors duration-150"
  onClick={(e) => e.stopPropagation()}
>
  {row.patternTag}
</Link>
```

**File:** `client/src/components/problems/McqProblemView.tsx` and `TrickQuestionView.tsx` and `CodingProblemView.tsx`

After submission/solve, the "The Gotcha" / "Pattern" section's tag label becomes a link to `/patterns/:encodedTag`. Low friction — the user finishes a problem and can immediately explore more problems with the same pattern.

**File:** `client/src/components/layout/Sidebar.tsx`

Add nav item:

```typescript
{ to: '/patterns', label: 'Patterns', icon: <Tag size={16} /> }
```

**File:** `client/src/App.tsx`

```typescript
<Route path="patterns"      element={<PatternsPage />} />
<Route path="patterns/:tag" element={<PatternPage />} />
```

---

### Phase 6 — Pattern Filter in FilterBar (Optional Enhancement)

If the user wants to filter by pattern tag from within the main Problems or Quiz pages, add a pattern tag search/select to `FilterBar`.

**File:** `client/src/components/problems/FilterBar.tsx`

Add an optional `patternTags` prop (list of available tags to populate a `<select>`). When `hidePatternsFilter` is not set and `patternTags` is provided, show a pattern dropdown alongside the existing filters.

```typescript
interface FilterBarProps {
  // existing props ...
  readonly patternTags?:       readonly string[]
  readonly hidePatternFilter?: boolean
}
```

This phase is optional — the pattern detail page already provides focused browsing without needing to modify the filter bar.

---

## File Change Summary

| File | Change |
|---|---|
| `server/src/routes/problems.ts` | Add `GET /patterns` aggregation route; add `patternTag` query filter to list route |
| `client/src/types/problem.ts` | Add `PatternSummary` interface |
| `client/src/hooks/useProblems.ts` | Add optional `patternTag` to `ProblemFilters`; pass to query params |
| `client/src/hooks/usePatterns.ts` | New — fetches all pattern summaries |
| `client/src/pages/PatternsPage.tsx` | New — grid of all pattern cards |
| `client/src/pages/PatternPage.tsx` | New — problem list for a single pattern |
| `client/src/components/patterns/PatternCard.tsx` | New — card with name, count, and progress bar |
| `client/src/components/problems/ProblemTable.tsx` | Make patternTag cells link to pattern page |
| `client/src/components/problems/McqProblemView.tsx` | Pattern tag becomes a link post-submit |
| `client/src/components/problems/TrickQuestionView.tsx` | Pattern tag becomes a link post-submit |
| `client/src/components/problems/CodingProblemView.tsx` | Pattern tag becomes a link post-solve |
| `client/src/components/ui/Pagination.tsx` | New (refactor) — extracted pagination controls |
| `client/src/components/layout/Sidebar.tsx` | Add Patterns nav item |
| `client/src/App.tsx` | Add `/patterns` and `/patterns/:tag` routes |
