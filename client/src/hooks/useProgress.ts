import { useProgressStore } from '@/store/useProgressStore'

const selectSolvedProblems = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.solvedProblems

const selectCurrentStreak = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.currentStreak

const selectLongestStreak = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.longestStreak

const selectDismissedMilestone = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.dismissedBackupMilestone

const selectDailyStreak = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.dailyStreak

const selectCompletedDailies = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.completedDailies

const BACKUP_INTERVAL = 10

export const useProgress = () => {
  const solvedProblems           = useProgressStore(selectSolvedProblems)
  const currentStreak            = useProgressStore(selectCurrentStreak)
  const longestStreak            = useProgressStore(selectLongestStreak)
  const dismissedBackupMilestone = useProgressStore(selectDismissedMilestone)
  const dailyStreak              = useProgressStore(selectDailyStreak)
  const completedDailies         = useProgressStore(selectCompletedDailies)

  const solvedCount = Object.keys(solvedProblems).length

  const isSolved = (id: string): boolean => id in solvedProblems

  const nextBackupMilestone = Math.floor(solvedCount / BACKUP_INTERVAL) * BACKUP_INTERVAL
  const shouldShowBackupBanner =
    solvedCount > 0 &&
    solvedCount % BACKUP_INTERVAL === 0 &&
    nextBackupMilestone > dismissedBackupMilestone

  const isDailyCompleted = (date: string): boolean => completedDailies.includes(date)

  return {
    solvedProblems,
    solvedCount,
    currentStreak,
    longestStreak,
    dailyStreak,
    isSolved,
    isDailyCompleted,
    shouldShowBackupBanner,
    nextBackupMilestone,
  }
}
