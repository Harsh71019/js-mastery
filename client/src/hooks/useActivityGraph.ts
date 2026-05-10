import { useState, useEffect } from 'react'

export interface ActivityDay {
  readonly date: string
  readonly count: number
}

interface ActivityData {
  readonly days: readonly ActivityDay[]
  readonly maxCount: number
  readonly totalSolvedInWindow: number
  readonly isLoading: boolean
  readonly error: string | null
}

const INITIAL: ActivityData = {
  days: [],
  maxCount: 0,
  totalSolvedInWindow: 0,
  isLoading: true,
  error: null,
}

export const useActivityGraph = (): ActivityData => {
  const [state, setState] = useState<ActivityData>(INITIAL)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/progress/activity', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<{ success: boolean; data: { days: ActivityDay[]; maxCount: number; totalSolvedInWindow: number } }>
      })
      .then(({ data: { days, maxCount, totalSolvedInWindow } }) =>
        setState({ days, maxCount, totalSolvedInWindow, isLoading: false, error: null }),
      )
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load activity',
        }))
      })

    return () => controller.abort()
  }, [])

  return state
}
