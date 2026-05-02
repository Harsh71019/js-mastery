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
    let cancelled = false
    setLoading(true)

    fetch('/api/problems/patterns')
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<PatternSummary[]>
      })
      .then((data) => {
        if (cancelled) return
        setPatterns(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load patterns')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { patterns, isLoading, error }
}
