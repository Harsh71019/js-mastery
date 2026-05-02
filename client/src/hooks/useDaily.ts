import { useState, useEffect, useCallback } from 'react'
import type { DailyChallenge } from '@/types/daily'

interface UseDailyResult {
  readonly daily:     DailyChallenge | null
  readonly isLoading: boolean
  readonly error:     string | null
  readonly refresh:   () => void
}

export const useDaily = (): UseDailyResult => {
  const [daily, setDaily]       = useState<DailyChallenge | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/daily')
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<DailyChallenge>
      })
      .then((data) => {
        if (cancelled) return
        setDaily(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load daily challenge')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  return { daily, isLoading, error, refresh }
}
