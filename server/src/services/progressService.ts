import { format, differenceInCalendarDays } from 'date-fns'
import * as progressRepo from '../repositories/progressRepository'
import { getUpdatedStreak } from '../utils/streak'
import { computeNextReview, isMastered } from '../utils/review'
import { serializeProgress } from '../utils/serializeProgress'
import { getDailyActivity } from '../utils/activity'

export type RunTiming = { ms: number; accepted: boolean }

export type SolveBody = {
  title?: string
  category?: string
  difficulty?: string
  executionTimeMs?: number
  acceptedCode?: string
}

export const getProgress = async () => {
  const doc = await progressRepo.findOrCreate()
  return serializeProgress(doc)
}

export const solveProgress = async (problemId: string, body: SolveBody) => {
  const { title, category, difficulty, executionTimeMs, acceptedCode } = body

  const validExecutionTimeMs =
    typeof executionTimeMs === 'number' && Number.isFinite(executionTimeMs) && executionTimeMs > 0
      ? Math.round(executionTimeMs)
      : undefined

  const doc      = await progressRepo.findOrCreate()
  const today    = new Date().toISOString().split('T')[0] ?? ''
  const existing = doc.solvedProblems.get(problemId)
  const isFirstSolve = !existing?.solvedAt

  const prevTimings  = (existing?.runTimings ?? []) as RunTiming[]
  const nextTimings: RunTiming[] = validExecutionTimeMs
    ? [...prevTimings, { ms: validExecutionTimeMs, accepted: true }].slice(-20)
    : prevTimings

  const review = computeNextReview(
    isFirstSolve ? 1 : (existing?.reviewInterval ?? 1),
    true,
    today,
  )

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing?.solvedAt || new Date().toISOString(),
    attempts:        (existing?.attempts ?? 0) + 1,
    title:           title ?? existing?.title,
    category:        category ?? existing?.category,
    difficulty:      difficulty ?? existing?.difficulty,
    reviewInterval:  review.reviewInterval,
    lastReviewedAt:  review.lastReviewedAt,
    nextReviewDue:   review.nextReviewDue,
    executionTimeMs: validExecutionTimeMs ?? existing?.executionTimeMs,
    runCount:        (existing?.runCount ?? 0) + 1,
    runTimings:      nextTimings,
    acceptedCode:    existing?.acceptedCode ?? acceptedCode,
  })

  const streak = getUpdatedStreak(
    { currentStreak: doc.currentStreak, longestStreak: doc.longestStreak, lastActiveDate: doc.lastActiveDate },
    today,
  )
  doc.currentStreak  = streak.currentStreak
  doc.longestStreak  = streak.longestStreak
  doc.lastActiveDate = streak.lastActiveDate
  doc.markModified('solvedProblems')

  await doc.save()
  return serializeProgress(doc)
}

export const attemptProgress = async (problemId: string, executionTimeMs?: number) => {
  const validMs =
    typeof executionTimeMs === 'number' && Number.isFinite(executionTimeMs) && executionTimeMs > 0
      ? Math.round(executionTimeMs)
      : undefined

  const doc      = await progressRepo.findOrCreate()
  const existing = doc.solvedProblems.get(problemId)

  const prevTimings = (existing?.runTimings ?? []) as RunTiming[]
  const nextTimings: RunTiming[] = validMs
    ? [...prevTimings, { ms: validMs, accepted: false }].slice(-20)
    : prevTimings

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing?.solvedAt ?? '',
    attempts:        (existing?.attempts ?? 0) + 1,
    title:           existing?.title,
    category:        existing?.category,
    difficulty:      existing?.difficulty,
    reviewInterval:  existing?.reviewInterval ?? 1,
    lastReviewedAt:  existing?.lastReviewedAt,
    nextReviewDue:   existing?.nextReviewDue,
    executionTimeMs: existing?.executionTimeMs,
    runCount:        (existing?.runCount ?? 0) + 1,
    runTimings:      nextTimings,
  })
  doc.markModified('solvedProblems')

  await doc.save()
  return serializeProgress(doc)
}

export const resetProgress = () => progressRepo.resetOne()

export const getReviewQueue = async () => {
  const doc   = await progressRepo.findOrCreate()
  const today = format(new Date(), 'yyyy-MM-dd')

  const due: {
    id:             string
    title:          string
    category:       string
    difficulty:     string
    nextReviewDue:  string
    reviewInterval: number
    daysOverdue:    number
  }[] = []

  for (const [id, entry] of doc.solvedProblems.entries()) {
    const interval = entry.reviewInterval ?? 1
    const nextDue  = entry.nextReviewDue ?? today
    if (nextDue <= today && !isMastered(interval)) {
      due.push({
        id,
        title:          entry.title ?? id,
        category:       entry.category ?? '',
        difficulty:     entry.difficulty ?? 'Easy',
        nextReviewDue:  nextDue,
        reviewInterval: interval,
        daysOverdue:    differenceInCalendarDays(new Date(today), new Date(nextDue)),
      })
    }
  }

  due.sort((a, b) => b.daysOverdue - a.daysOverdue)
  return { due, total: due.length }
}

export const getActivity = async () => {
  const doc = await progressRepo.findOrCreate()
  return getDailyActivity(
    doc.solvedProblems as unknown as Map<string, { solvedAt?: string }>,
  )
}

export const getExecutionTimes = async () => {
  const doc = await progressRepo.findOrCreate()

  const entries: {
    id:              string
    title:           string
    category:        string
    difficulty:      string
    executionTimeMs: number
    solvedAt:        string
  }[] = []

  for (const [id, entry] of doc.solvedProblems.entries()) {
    if (typeof entry.executionTimeMs !== 'number') continue
    entries.push({
      id,
      title:           entry.title ?? id,
      category:        entry.category ?? '',
      difficulty:      entry.difficulty ?? '',
      executionTimeMs: entry.executionTimeMs,
      solvedAt:        entry.solvedAt ? (entry.solvedAt.split('T')[0] ?? '') : '',
    })
  }

  entries.sort((a, b) => a.solvedAt.localeCompare(b.solvedAt))
  return { entries }
}

export const dismissBanner = async (milestone: number) => {
  const doc = await progressRepo.findOrCreate()
  doc.dismissedBackupMilestone = milestone
  await doc.save()
  return serializeProgress(doc)
}

export type ImportBody = {
  solvedProblems:           Record<string, unknown>
  lastActiveDate?:          string
  currentStreak?:           number
  longestStreak?:           number
  dismissedBackupMilestone?: number
}

export const importProgress = async (body: ImportBody) => {
  const doc = await progressRepo.replaceProgress({
    solvedProblems:           body.solvedProblems,
    lastActiveDate:           body.lastActiveDate ?? '',
    currentStreak:            body.currentStreak ?? 0,
    longestStreak:            body.longestStreak ?? 0,
    dismissedBackupMilestone: body.dismissedBackupMilestone ?? 0,
  })
  return serializeProgress(doc!)
}

export const exportProgress = async () => {
  const doc      = await progressRepo.findOrCreate()
  const data     = serializeProgress(doc)
  const filename = `js-trainer-progress-${format(new Date(), 'yyyy-MM-dd')}.json`
  return { data, filename }
}
