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
  solvedProblems:           Map<string, unknown> | Record<string, unknown>
  lastActiveDate?:          string
  currentStreak?:           number
  longestStreak?:           number
  dismissedBackupMilestone?: number
  dailyStreak?:             number
  longestDailyStreak?:      number
  completedDailies?:        string[]
  readArticles?:            string[]
  bookmarkedArticles?:      string[]
  readingStreak?:           number
  longestReadingStreak?:    number
  lastArticleReadAt?:       string | null
  readingHistory?:          { articleId?: string | null; date?: string | null }[]
  articleNotes?:            Map<string, string> | Record<string, string>
  articleQuizScores?:       Map<string, unknown> | Record<string, unknown>
}

export const serializeProgress = (doc: ProgressFields): object => {
  const entries: [string, unknown][] =
    doc.solvedProblems instanceof Map
      ? [...doc.solvedProblems.entries()]
      : Object.entries(doc.solvedProblems ?? {})

  const notes =
    doc.articleNotes instanceof Map
      ? Object.fromEntries(doc.articleNotes.entries())
      : (doc.articleNotes ?? {})

  const quizScores =
    doc.articleQuizScores instanceof Map
      ? Object.fromEntries(doc.articleQuizScores.entries())
      : (doc.articleQuizScores ?? {})

  return {
    solvedProblems:           Object.fromEntries(
      entries.map(([k, v]) => [k, normalizeSolvedEntry(v)])
    ),
    lastActiveDate:           doc.lastActiveDate ?? '',
    currentStreak:            doc.currentStreak ?? 0,
    longestStreak:            doc.longestStreak ?? 0,
    dismissedBackupMilestone: doc.dismissedBackupMilestone ?? 0,
    dailyStreak:              doc.dailyStreak ?? 0,
    longestDailyStreak:       doc.longestDailyStreak ?? 0,
    completedDailies:         doc.completedDailies ?? [],
    readArticles:             doc.readArticles ?? [],
    bookmarkedArticles:       doc.bookmarkedArticles ?? [],
    readingStreak:            doc.readingStreak ?? 0,
    longestReadingStreak:     doc.longestReadingStreak ?? 0,
    lastArticleReadAt:        doc.lastArticleReadAt ?? null,
    readingHistory:           doc.readingHistory ?? [],
    articleNotes:             notes,
    articleQuizScores:        quizScores,
  }
}
