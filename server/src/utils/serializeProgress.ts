interface RunTiming {
  ms: number
  accepted: boolean
}

const normalizeRunTimings = (raw: unknown[]): RunTiming[] =>
  raw
    .map((entry) => {
      if (typeof entry === 'number') return { ms: entry, accepted: true }
      if (entry && typeof entry === 'object' && 'ms' in entry && typeof (entry as RunTiming).ms === 'number') {
        return { ms: (entry as RunTiming).ms, accepted: (entry as RunTiming).accepted ?? true }
      }
      return null
    })
    .filter((e): e is RunTiming => e !== null)

const toPlainObject = (entry: unknown): Record<string, unknown> => {
  if (!entry || typeof entry !== 'object') return {}
  const asDoc = entry as { toObject?: () => Record<string, unknown> }
  if (typeof asDoc.toObject === 'function') return asDoc.toObject()
  return { ...(entry as Record<string, unknown>) }
}

const normalizeSolvedEntry = (entry: unknown): unknown => {
  if (!entry || typeof entry !== 'object') return entry
  const plain = toPlainObject(entry)
  const runTimings = plain.runTimings
  if (!Array.isArray(runTimings) || runTimings.length === 0) return plain
  return { ...plain, runTimings: normalizeRunTimings(runTimings) }
}

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
  solvedProblems:           Object.fromEntries(
    [...(doc.solvedProblems ?? new Map()).entries()].map(([k, v]) => [k, normalizeSolvedEntry(v)])
  ),
  lastActiveDate:           doc.lastActiveDate,
  currentStreak:            doc.currentStreak,
  longestStreak:            doc.longestStreak,
  dismissedBackupMilestone: doc.dismissedBackupMilestone,
  dailyStreak:              doc.dailyStreak ?? 0,
  longestDailyStreak:       doc.longestDailyStreak ?? 0,
  completedDailies:         doc.completedDailies ?? [],
})
