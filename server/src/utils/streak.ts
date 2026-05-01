import { differenceInCalendarDays } from 'date-fns'

interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
}

export const getUpdatedStreak = (
  current: StreakState,
  today: string,
): StreakState => {
  if (current.lastActiveDate === today) return current

  const daysDiff =
    current.lastActiveDate === ''
      ? 1
      : differenceInCalendarDays(new Date(today), new Date(current.lastActiveDate))

  const nextStreak = daysDiff === 1 ? current.currentStreak + 1 : 1
  const nextLongest = Math.max(current.longestStreak, nextStreak)

  return { currentStreak: nextStreak, longestStreak: nextLongest, lastActiveDate: today }
}
