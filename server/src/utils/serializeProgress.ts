interface ProgressFields {
  solvedProblems:           Map<string, unknown>
  lastActiveDate:           string
  currentStreak:            number
  longestStreak:            number
  dismissedBackupMilestone: number
  dailyStreak?:             number
  longestDailyStreak?:      number
  completedDailies?:        string[]
}

export const serializeProgress = (doc: ProgressFields): object => ({
  solvedProblems:           Object.fromEntries(doc.solvedProblems ?? new Map()),
  lastActiveDate:           doc.lastActiveDate,
  currentStreak:            doc.currentStreak,
  longestStreak:            doc.longestStreak,
  dismissedBackupMilestone: doc.dismissedBackupMilestone,
  dailyStreak:              doc.dailyStreak ?? 0,
  longestDailyStreak:       doc.longestDailyStreak ?? 0,
  completedDailies:         doc.completedDailies ?? [],
})
