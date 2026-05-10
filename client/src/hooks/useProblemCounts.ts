import { useState, useEffect } from 'react'

interface CategoryCount {
  readonly slug: string
  readonly count: number
}

interface ProblemCounts {
  readonly total: number
  readonly byCategory: Readonly<Record<string, number>>
}

export const useProblemCounts = (): ProblemCounts => {
  const [counts, setCounts] = useState<ProblemCounts>({ total: 0, byCategory: {} })

  useEffect(() => {
    fetch('/api/problems/categories/counts')
      .then((response) => response.json() as Promise<{ success: boolean; data: CategoryCount[] }>)
      .then(({ data }) => {
        const byCategory = Object.fromEntries(data.map((c) => [c.slug, c.count]))
        const total = data.reduce((sum, c) => sum + c.count, 0)
        setCounts({ total, byCategory })
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch problem counts:', error)
      })
  }, [])

  return counts
}
