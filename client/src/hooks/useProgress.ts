import { useProgressStore } from '@/store/useProgressStore'
import { problems } from '@/data'
import type { CategorySlug } from '@/types/problem'

const selectSolvedProblems = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.solvedProblems

const selectCurrentStreak = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.currentStreak

const selectLongestStreak = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.longestStreak

const selectDismissedMilestone = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.dismissedBackupMilestone

const BACKUP_INTERVAL = 10

export const useProgress = () => {
  const solvedProblems = useProgressStore(selectSolvedProblems)
  const currentStreak = useProgressStore(selectCurrentStreak)
  const longestStreak = useProgressStore(selectLongestStreak)
  const dismissedBackupMilestone = useProgressStore(selectDismissedMilestone)

  const solvedCount = Object.keys(solvedProblems).length
  const totalCount = problems.length

  const isSolved = (id: string): boolean => id in solvedProblems

  const categoryProgress = (slug: CategorySlug): { solved: number; total: number } => {
    const categoryProblems = problems.filter((problem) => problem.category === slug)
    const solved = categoryProblems.filter((problem) => isSolved(problem.id)).length
    return { solved, total: categoryProblems.length }
  }

  const nextBackupMilestone = Math.floor(solvedCount / BACKUP_INTERVAL) * BACKUP_INTERVAL
  const shouldShowBackupBanner =
    solvedCount > 0 &&
    solvedCount % BACKUP_INTERVAL === 0 &&
    nextBackupMilestone > dismissedBackupMilestone

  return {
    solvedProblems,
    solvedCount,
    totalCount,
    currentStreak,
    longestStreak,
    isSolved,
    categoryProgress,
    shouldShowBackupBanner,
    nextBackupMilestone,
  }
}
