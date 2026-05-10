export interface ActivityDay {
  date: string
  count: number
}

export interface ActivityData {
  days: ActivityDay[]
  maxCount: number
  totalSolvedInWindow: number
}

export const getDailyActivity = (
  solvedProblems: Map<string, { solvedAt?: string }>,
  windowDays = 371,
): ActivityData => {
  const countByDate = new Map<string, number>()

  for (const [, entry] of solvedProblems) {
    if (!entry.solvedAt) continue
    const parsed = Date.parse(entry.solvedAt)
    if (isNaN(parsed)) continue
    const dateStr = new Date(parsed).toISOString().split('T')[0] ?? ''
    countByDate.set(dateStr, (countByDate.get(dateStr) ?? 0) + 1)
  }

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const days: ActivityDay[] = []
  let maxCount = 0
  let totalSolvedInWindow = 0

  for (let offset = windowDays - 1; offset >= 0; offset--) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - offset)
    const dateStr = d.toISOString().split('T')[0] ?? ''
    const count = countByDate.get(dateStr) ?? 0
    days.push({ date: dateStr, count })
    if (count > maxCount) maxCount = count
    totalSolvedInWindow += count
  }

  return { days, maxCount, totalSolvedInWindow }
}
