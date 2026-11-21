export const selectDailyIndex = (totalProblems: number, date: Date): number => {
  if (totalProblems === 0) return 0
  const utcDays = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
  return Math.abs(utcDays) % totalProblems
}
