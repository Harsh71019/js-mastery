import { differenceInCalendarDays } from 'date-fns'

interface DailyStreakInput {
  dailyStreak:        number
  longestDailyStreak: number
  lastDailySolvedAt?: string
  completedDailies:   string[]
}

interface DailyStreakOutput {
  dailyStreak:        number
  longestDailyStreak: number
  lastDailySolvedAt:  string
  completedDailies:   string[]
}

export const updateDailyStreak = (
  state: DailyStreakInput,
  today: string,
): DailyStreakOutput => {
  const updatedDailies = state.completedDailies.includes(today)
    ? state.completedDailies
    : [...state.completedDailies, today]

  if (state.completedDailies.includes(today)) {
    return {
      dailyStreak:        state.dailyStreak,
      longestDailyStreak: state.longestDailyStreak,
      lastDailySolvedAt:  today,
      completedDailies:   updatedDailies,
    }
  }

  const last = state.lastDailySolvedAt
  const diff = last ? differenceInCalendarDays(new Date(today), new Date(last)) : null
  const newStreak = diff === 1 ? state.dailyStreak + 1 : 1

  return {
    dailyStreak:        newStreak,
    longestDailyStreak: Math.max(newStreak, state.longestDailyStreak),
    lastDailySolvedAt:  today,
    completedDailies:   updatedDailies,
  }
}
