import { useState, useEffect, useCallback } from 'react'
import type { Verdict } from '@/runner/executor'

export interface SubmissionSummary {
  readonly submissionId: string
  readonly verdict: Verdict | string
  readonly executionTimeMs?: number | null
  readonly cpuTimeMs?: number | null
  readonly memoryBytes?: number | null
  readonly memoryUsageMb?: number | null
  readonly beatsRuntime?: number | null
  readonly beatsMemory?: number | null
  readonly submittedAt: string
  readonly problemId: string
}

interface UseSubmissionsResult {
  readonly submissions: readonly SubmissionSummary[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly refetch: () => void
}

export const useSubmissions = (problemId: string): UseSubmissionsResult => {
  const [submissions, setSubmissions] = useState<readonly SubmissionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/submissions/${problemId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<{ success: boolean; data: { submissions: SubmissionSummary[] } }>
      })
      .then(({ data }) => {
        if (cancelled) return
        setSubmissions(data?.submissions ?? [])
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load submissions')
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [problemId, tick])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setTick((t) => t + 1)
  }, [])

  return { submissions, isLoading, error, refetch }
}
