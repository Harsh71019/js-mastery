import { useState, useEffect } from 'react'
import type { CategorySlug, Difficulty } from '@/types/problem'

export interface ExecutionTimeEntry {
  readonly id: string
  readonly title: string
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly executionTimeMs: number
  readonly solvedAt: string
}

interface ExecutionTimesData {
  readonly entries: readonly ExecutionTimeEntry[]
  readonly isLoading: boolean
  readonly error: string | null
}

const INITIAL: ExecutionTimesData = { entries: [], isLoading: true, error: null }

export const useExecutionTimes = (): ExecutionTimesData => {
  const [state, setState] = useState<ExecutionTimesData>(INITIAL)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/progress/execution-times', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<{ success: boolean; data: { entries: ExecutionTimeEntry[] } }>
      })
      .then(({ data: { entries } }) => setState({ entries, isLoading: false, error: null }))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load execution times',
        }))
      })

    return () => controller.abort()
  }, [])

  return state
}
