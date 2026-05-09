import { useState, useEffect } from 'react'
import type { Verdict } from '@/runner/executor'

export interface SubmissionSummary {
  readonly submissionId:    string
  readonly verdict:         Verdict
  readonly executionTimeMs: number | null
  readonly submittedAt:     string
  readonly problemId:       string
}

interface UseSubmissionsResult {
  readonly submissions: readonly SubmissionSummary[]
  readonly isLoading:   boolean
  readonly error:       string | null
}

export const useSubmissions = (problemId: string): UseSubmissionsResult => {
  const [submissions, setSubmissions] = useState<readonly SubmissionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/submissions/${problemId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<{ submissions: SubmissionSummary[] }>
      })
      .then(({ submissions: data }) => {
        if (!cancelled) {
          setSubmissions(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load submissions')
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [problemId])

  return { submissions, isLoading, error }
}
