export interface RunTiming {
  ms:       number
  accepted: boolean
}

export interface SolvedEntry {
  solvedAt:         string
  attempts:         number
  title?:           string
  category?:        string
  difficulty?:      string
  reviewInterval:   number
  lastReviewedAt?:  string
  nextReviewDue?:   string
  executionTimeMs?: number
  runCount:         number
  runTimings:       RunTiming[]
  acceptedCode?:    string
}

export interface ProgressState {
  solvedProblems:            Record<string, SolvedEntry>
  lastActiveDate:            string
  currentStreak:             number
  longestStreak:             number
  dismissedBackupMilestone:  number
  dailyStreak:               number
  longestDailyStreak:        number
  completedDailies:          string[]
}

export interface PaginationMeta {
  page:       number
  limit:      number
  total:      number
  totalPages: number
}

export interface ApiSuccess<T> {
  success: true
  data:    T
}

export interface ApiPaginated<T> {
  success:    true
  data:       T[]
  pagination: PaginationMeta
}
