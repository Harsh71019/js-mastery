import { useState, useEffect } from 'react'
import type { Problem } from '@/types/problem'

interface UseProblemResult {
  readonly problem: Problem | null
  readonly prevId: string | null
  readonly nextId: string | null
  readonly isLoading: boolean
  readonly error: string | null
}

export const useProblem = (id: string): UseProblemResult => {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [prevId, setPrevId] = useState<string | null>(null)
  const [nextId, setNextId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setProblem(null)

    fetch(`/api/problems/${id}`)
      .then((response) => {
        if (response.status === 404) throw new Error('not_found')
        if (!response.ok) throw new Error(`Server error: ${response.status}`)
        return response.json() as Promise<Problem & { prevId: string | null; nextId: string | null }>
      })
      .then((data) => {
        if (cancelled) return
        const { prevId: prev, nextId: next, ...rest } = data
        setProblem(rest as Problem)
        setPrevId(prev)
        setNextId(next)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load problem')
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { problem, prevId, nextId, isLoading, error }
}
