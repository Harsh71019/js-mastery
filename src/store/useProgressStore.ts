import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { differenceInCalendarDays } from 'date-fns'

interface SolvedEntry {
  readonly solvedAt: string
  readonly attempts: number
}

interface ProgressState {
  solvedProblems: Record<string, SolvedEntry>
  lastActiveDate: string
  currentStreak: number
  longestStreak: number
  dismissedBackupMilestone: number
}

interface ProgressActions {
  markSolved: (id: string) => void
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
}

const getUpdatedStreak = (
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string,
  today: string,
): Pick<ProgressState, 'currentStreak' | 'longestStreak' | 'lastActiveDate'> => {
  if (lastActiveDate === today) {
    return { currentStreak, longestStreak, lastActiveDate }
  }

  const daysDiff =
    lastActiveDate === ''
      ? 1
      : differenceInCalendarDays(new Date(today), new Date(lastActiveDate))

  const nextStreak = daysDiff === 1 ? currentStreak + 1 : 1
  const nextLongest = Math.max(longestStreak, nextStreak)

  return {
    currentStreak: nextStreak,
    longestStreak: nextLongest,
    lastActiveDate: today,
  }
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      markSolved: (id) => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const existing = state.solvedProblems[id]

        const updatedEntry: SolvedEntry = {
          solvedAt: existing?.solvedAt ?? new Date().toISOString(),
          attempts: (existing?.attempts ?? 0) + 1,
        }

        const streakUpdate = getUpdatedStreak(
          state.currentStreak,
          state.longestStreak,
          state.lastActiveDate,
          today,
        )

        set({
          solvedProblems: { ...state.solvedProblems, [id]: updatedEntry },
          ...streakUpdate,
        })
      },

      incrementAttempts: (id) => {
        const state = get()
        const existing = state.solvedProblems[id]
        const updated: SolvedEntry = {
          solvedAt: existing?.solvedAt ?? '',
          attempts: (existing?.attempts ?? 0) + 1,
        }
        set({
          solvedProblems: { ...state.solvedProblems, [id]: updated },
        })
      },

      resetProgress: () => set(INITIAL_STATE),

      dismissBackupBanner: (milestone) =>
        set({ dismissedBackupMilestone: milestone }),
    }),
    { name: 'js-trainer-progress' },
  ),
)
