import { useState, useEffect, useCallback } from 'react'

export interface ReviewQueueItem {
  readonly id:             string
  readonly title:          string
  readonly category:       string
  readonly difficulty:     string
  readonly nextReviewDue:  string
  readonly reviewInterval: number
  readonly daysOverdue:    number
}

export interface ReviewQueue {
  readonly due:   readonly ReviewQueueItem[]
  readonly total: number
}

interface UseReviewQueueResult {
  readonly queue:     ReviewQueue | null
  readonly isLoading: boolean
  readonly error:     string | null
  readonly refresh:   () => void
}

export const useReviewQueue = (): UseReviewQueueResult => {
  const [queue, setQueue]       = useState<ReviewQueue | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/progress/review-queue')
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<ReviewQueue>
      })
      .then((data) => {
        if (cancelled) return
        setQueue(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load review queue')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  return { queue, isLoading, error, refresh }
}
