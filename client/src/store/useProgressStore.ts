import { create } from 'zustand'
import type { CategorySlug, Difficulty } from '@/types/problem'

export interface RunTiming {
  readonly ms: number
  readonly memoryMb?: number
  readonly accepted: boolean
}

export interface SolvedEntry {
  readonly solvedAt:         string
  readonly attempts:         number
  readonly title?:           string
  readonly category?:        CategorySlug
  readonly difficulty?:      Difficulty
  readonly reviewInterval?:  number
  readonly lastReviewedAt?:  string
  readonly nextReviewDue?:   string
  readonly executionTimeMs?: number
  readonly memoryUsageMb?:   number
  readonly memoryBytes?:     number
  readonly runCount?:        number
  readonly runTimings?:      readonly RunTiming[]
  readonly acceptedCode?:    string
  readonly recallCount?:     number
  readonly recallSkipped?:   number
  readonly lastRecalledAt?:  string
}

export interface ProblemMeta {
  readonly title: string
  readonly category: CategorySlug
  readonly difficulty: Difficulty
}

interface ProgressState {
  solvedProblems:           Record<string, SolvedEntry>
  lastActiveDate:           string
  currentStreak:            number
  longestStreak:            number
  dismissedBackupMilestone: number
  dailyStreak:              number
  longestDailyStreak:       number
  completedDailies:         string[]
  readArticles:             string[]
  bookmarkedArticles:       string[]
  readingStreak:            number
  longestReadingStreak:     number
  lastArticleReadAt:        string
  readingHistory:           { articleId: string; date: string }[]
  isLoaded:                 boolean
}

interface ProgressActions {
  loadProgress:           () => Promise<void>
  markSolved:             (id: string, meta?: ProblemMeta, executionTimeMs?: number, code?: string, memoryUsageMb?: number, memoryBytes?: number) => void
  incrementAttempts:      (id: string, executionTimeMs?: number, memoryUsageMb?: number, memoryBytes?: number) => void
  completeRecall:         (id: string) => Promise<void>
  skipRecall:             (id: string) => Promise<void>
  resetProgress:          () => void
  dismissBackupBanner:    (milestone: number) => void
  completeDailyChallenge: () => Promise<void>
  completeArticle:        (id: string) => Promise<void>
  toggleBookmarkArticle:  (id: string) => Promise<void>
}

type ProgressStore = ProgressState & ProgressActions

const INITIAL_STATE: ProgressState = {
  solvedProblems:           {},
  lastActiveDate:           '',
  currentStreak:            0,
  longestStreak:            0,
  dismissedBackupMilestone: 0,
  dailyStreak:              0,
  longestDailyStreak:       0,
  completedDailies:         [],
  readArticles:             [],
  bookmarkedArticles:       [],
  readingStreak:            0,
  longestReadingStreak:     0,
  lastArticleReadAt:        '',
  readingHistory:           [],
  isLoaded:                 false,
}

const applyServerState = (
  data: Omit<ProgressState, 'isLoaded'>,
): Omit<ProgressState, 'isLoaded'> => data

export const useProgressStore = create<ProgressStore>()((set, get) => ({
  ...INITIAL_STATE,

  loadProgress: async () => {
    try {
      const response = await fetch('/api/progress')
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to load progress:', error)
      set({ isLoaded: true })
    }
  },

  markSolved: (id, meta, executionTimeMs, code, memoryUsageMb, memoryBytes) => {
    const state = get()
    const existing = state.solvedProblems[id]

    const newTimings: RunTiming[] =
      executionTimeMs && executionTimeMs > 0
        ? [...(existing?.runTimings ?? []), { ms: executionTimeMs, memoryMb: memoryUsageMb, accepted: true }].slice(-20)
        : [...(existing?.runTimings ?? [])]

    const optimistic: SolvedEntry = {
      solvedAt:        existing?.solvedAt || new Date().toISOString(),
      attempts:        (existing?.attempts ?? 0) + 1,
      title:           meta?.title ?? existing?.title,
      category:        meta?.category ?? existing?.category,
      difficulty:      meta?.difficulty ?? existing?.difficulty,
      executionTimeMs: executionTimeMs ?? existing?.executionTimeMs,
      memoryUsageMb:   memoryUsageMb ?? existing?.memoryUsageMb,
      memoryBytes:     memoryBytes ?? existing?.memoryBytes,
      runCount:        (existing?.runCount ?? 0) + 1,
      runTimings:      newTimings,
      acceptedCode:    existing?.acceptedCode ?? code,
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    fetch(`/api/progress/solve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(meta ?? {}), executionTimeMs, memoryUsageMb, memoryBytes, acceptedCode: code }),
    })
      .then((r) => r.json() as Promise<{ success: boolean; data: Omit<ProgressState, 'isLoaded'> }>)
      .then(({ data: serverData }) => {
        const localSolved = get().solvedProblems
        const mergedSolved = Object.fromEntries(
          Object.entries(serverData.solvedProblems as Record<string, SolvedEntry>).map(([k, v]) => [
            k,
            { ...v, acceptedCode: v.acceptedCode ?? localSolved[k]?.acceptedCode },
          ]),
        )
        set({ ...applyServerState(serverData), solvedProblems: mergedSolved, isLoaded: true })
      })
      .catch((error: unknown) => console.error('Failed to sync solve:', error))
  },

  incrementAttempts: (id, executionTimeMs, memoryUsageMb, memoryBytes) => {
    const state = get()
    const existing = state.solvedProblems[id]

    const newTimings: RunTiming[] =
      executionTimeMs && executionTimeMs > 0
        ? [...(existing?.runTimings ?? []), { ms: executionTimeMs, memoryMb: memoryUsageMb, accepted: false }].slice(-20)
        : [...(existing?.runTimings ?? [])]

    const optimistic: SolvedEntry = {
      solvedAt:        existing?.solvedAt ?? '',
      attempts:        (existing?.attempts ?? 0) + 1,
      title:           existing?.title,
      category:        existing?.category,
      difficulty:      existing?.difficulty,
      executionTimeMs: existing?.executionTimeMs,
      memoryUsageMb:   memoryUsageMb ?? existing?.memoryUsageMb,
      memoryBytes:     memoryBytes ?? existing?.memoryBytes,
      runTimings:      newTimings,
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    fetch(`/api/progress/attempt/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ executionTimeMs, memoryUsageMb, memoryBytes }),
    })
      .then((r) => r.json() as Promise<{ success: boolean; data: Omit<ProgressState, 'isLoaded'> }>)
      .then(({ data }) => set({ ...applyServerState(data), isLoaded: true }))
      .catch((error: unknown) => console.error('Failed to sync attempt:', error))
  },

  completeRecall: async (id) => {
    const state = get()
    const existing = state.solvedProblems[id]
    if (!existing) return

    const optimistic: SolvedEntry = {
      ...existing,
      recallCount:    (existing.recallCount ?? 0) + 1,
      lastRecalledAt: new Date().toISOString(),
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    try {
      const response = await fetch(`/api/progress/recall/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to sync recall:', error)
    }
  },

  skipRecall: async (id) => {
    const state = get()
    const existing = state.solvedProblems[id]
    if (!existing) return

    const optimistic: SolvedEntry = {
      ...existing,
      recallSkipped: (existing.recallSkipped ?? 0) + 1,
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    try {
      const response = await fetch(`/api/progress/recall-skip/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to sync skip recall:', error)
    }
  },

  resetProgress: () => {
    set({ ...INITIAL_STATE, isLoaded: true })
    fetch('/api/progress', { method: 'DELETE' }).catch((error: unknown) =>
      console.error('Failed to reset progress:', error),
    )
  },

  dismissBackupBanner: (milestone) => {
    set({ dismissedBackupMilestone: milestone })
    fetch(`/api/progress/dismiss-banner/${milestone}`, { method: 'PUT' }).catch(
      (error: unknown) => console.error('Failed to dismiss banner:', error),
    )
  },

  completeDailyChallenge: async () => {
    try {
      const response = await fetch('/api/daily/complete', { method: 'POST' })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to complete daily challenge:', error)
    }
  },

  completeArticle: async (id) => {
    try {
      const response = await fetch(`/api/articles/complete/${id}`, { method: 'POST' })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to complete article:', error)
    }
  },

  toggleBookmarkArticle: async (id) => {
    const current = get().bookmarkedArticles || []
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    set({ bookmarkedArticles: next })

    try {
      const response = await fetch(`/api/articles/bookmark/${id}`, { method: 'POST' })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const { data } = (await response.json()) as { success: boolean; data: Omit<ProgressState, 'isLoaded'> }
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to toggle bookmark:', error)
    }
  },
}))
