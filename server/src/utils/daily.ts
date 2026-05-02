import { getDayOfYear } from 'date-fns'

export const selectDailyIndex = (totalProblems: number, date: Date): number => {
  if (totalProblems === 0) return 0
  return getDayOfYear(date) % totalProblems
}
