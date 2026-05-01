import { create } from 'zustand'
import type { CategorySlug, Difficulty } from '@/types/problem'

export interface SolvedEntry {
  readonly solvedAt: string
  readonly attempts: number
  readonly title?: string
  readonly category?: CategorySlug
  readonly difficulty?: Difficulty
}

export interface ProblemMeta {
  readonly title: string
  readonly category: CategorySlug
  readonly difficulty: Difficulty
}

interface ProgressState {
  solvedProblems: Record<string, SolvedEntry>
  lastActiveDate: string
  currentStreak: number
  longestStreak: number
  dismissedBackupMilestone: number
  isLoaded: boolean
}

interface ProgressActions {
  loadProgress: () => Promise<void>
  markSolved: (id: string, meta?: ProblemMeta) => void
  incrementAttempts: (id: string) => void
  resetProgress: () => void
  dismissBackupBanner: (milestone: number) => void
}

type ProgressStore = ProgressState & ProgressActions

const INITIAL_STATE: ProgressState = {
  solvedProblems: {},
  lastActiveDate: '',
  currentStreak: 0,
  longestStreak: 0,
  dismissedBackupMilestone: 0,
  isLoaded: false,
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
      const data = (await response.json()) as Omit<ProgressState, 'isLoaded'>
      set({ ...applyServerState(data), isLoaded: true })
    } catch (error: unknown) {
      console.error('Failed to load progress:', error)
      set({ isLoaded: true })
    }
  },

  markSolved: (id, meta) => {
    const state = get()
    const existing = state.solvedProblems[id]

    const optimistic: SolvedEntry = {
      solvedAt: existing?.solvedAt || new Date().toISOString(),
      attempts: (existing?.attempts ?? 0) + 1,
      title: meta?.title ?? existing?.title,
      category: meta?.category ?? existing?.category,
      difficulty: meta?.difficulty ?? existing?.difficulty,
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    fetch(`/api/progress/solve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta ?? {}),
    })
      .then((r) => r.json() as Promise<Omit<ProgressState, 'isLoaded'>>)
      .then((data) => set({ ...applyServerState(data), isLoaded: true }))
      .catch((error: unknown) => console.error('Failed to sync solve:', error))
  },

  incrementAttempts: (id) => {
    const state = get()
    const existing = state.solvedProblems[id]

    const optimistic: SolvedEntry = {
      solvedAt: existing?.solvedAt ?? '',
      attempts: (existing?.attempts ?? 0) + 1,
      title: existing?.title,
      category: existing?.category,
      difficulty: existing?.difficulty,
    }
    set({ solvedProblems: { ...state.solvedProblems, [id]: optimistic } })

    fetch(`/api/progress/attempt/${id}`, { method: 'POST' })
      .then((r) => r.json() as Promise<Omit<ProgressState, 'isLoaded'>>)
      .then((data) => set({ ...applyServerState(data), isLoaded: true }))
      .catch((error: unknown) => console.error('Failed to sync attempt:', error))
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
}))
