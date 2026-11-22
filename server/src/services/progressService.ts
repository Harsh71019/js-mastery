import { format, differenceInCalendarDays, differenceInHours } from 'date-fns'
import * as progressRepo from '../repositories/progressRepository'
import * as problemRepo from '../repositories/problemRepository'
import { NotFoundError } from '../middleware/AppError'
import { getUpdatedStreak } from '../utils/streak'
import { computeNextReview, isMastered } from '../utils/review'
import { serializeProgress } from '../utils/serializeProgress'
import { getDailyActivity } from '../utils/activity'
import { selectDailyIndex } from '../utils/daily'
import { updateDailyStreak } from '../utils/dailyStreak'
import { 
  REVIEW_INTERVAL_MULTIPLIER, 
  RECALL_INTERVAL_MULTIPLIER, 
  RECALL_ELIGIBLE_INTERVAL,
  RECALL_MIN_HOURS_SINCE_SOLVE
} from '../constants/review'
import type { ImportBodyInput } from '../types/schemas/progressSchemas'

export type RunTiming = { ms: number; memoryMb?: number; accepted: boolean }

export type SolveBody = {
  title?: string
  category?: string
  difficulty?: string
  type?: 'coding' | 'mcq' | 'trick'
  executionTimeMs?: number
  memoryBytes?: number
  memoryUsageMb?: number
  acceptedCode?: string
}

export const getProgress = async () => {
  const doc = await progressRepo.findOrCreate()
  return serializeProgress(doc)
}

export const solveProgress = async (problemId: string, body: SolveBody) => {
  const { title, category, difficulty, executionTimeMs, memoryBytes, memoryUsageMb, acceptedCode } = body

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
    ? [...prevTimings, { ms: validExecutionTimeMs, memoryMb: memoryUsageMb, accepted: true }].slice(-20)
    : prevTimings

  const review = computeNextReview(
    isFirstSolve ? 1 : (existing?.reviewInterval ?? 1),
    true,
    today,
    REVIEW_INTERVAL_MULTIPLIER
  )

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing?.solvedAt || new Date().toISOString(),
    attempts:        (existing?.attempts ?? 0) + 1,
    title:           title ?? existing?.title,
    category:        category ?? existing?.category,
    difficulty:      difficulty ?? existing?.difficulty,
    type:            (body.type ?? (existing as { type?: 'coding' | 'mcq' | 'trick' })?.type ?? 'coding') as 'coding' | 'mcq' | 'trick',
    reviewInterval:  review.reviewInterval,
    lastReviewedAt:  review.lastReviewedAt,
    nextReviewDue:   review.nextReviewDue,
    executionTimeMs: validExecutionTimeMs ?? existing?.executionTimeMs,
    memoryBytes:     memoryBytes ?? existing?.memoryBytes,
    memoryUsageMb:   memoryUsageMb ?? existing?.memoryUsageMb,
    runCount:        (existing?.runCount ?? 0) + 1,
    runTimings:      nextTimings,
    acceptedCode:    acceptedCode ?? existing?.acceptedCode,
    recallCount:     existing?.recallCount ?? 0,
    recallSkipped:   existing?.recallSkipped ?? 0,
    lastRecalledAt:  existing?.lastRecalledAt,
  })

  const streak = getUpdatedStreak(
    { currentStreak: doc.currentStreak, longestStreak: doc.longestStreak, lastActiveDate: doc.lastActiveDate },
    today,
  )
  doc.currentStreak  = streak.currentStreak
  doc.longestStreak  = streak.longestStreak
  doc.lastActiveDate = streak.lastActiveDate

  // Check if this problem is today's daily challenge
  try {
    const allIds = await problemRepo.findAllPublishedIds()
    if (allIds.length > 0) {
      const dailyIndex = selectDailyIndex(allIds.length, new Date())
      if (allIds[dailyIndex]?.id === problemId) {
        const dailyUpdate = updateDailyStreak(
          {
            dailyStreak:        doc.dailyStreak        ?? 0,
            longestDailyStreak: doc.longestDailyStreak ?? 0,
            lastDailySolvedAt:  doc.lastDailySolvedAt  as string | undefined,
            completedDailies:   (doc.completedDailies  as string[]) ?? [],
          },
          today,
        )
        doc.dailyStreak        = dailyUpdate.dailyStreak
        doc.longestDailyStreak = dailyUpdate.longestDailyStreak
        doc.lastDailySolvedAt  = dailyUpdate.lastDailySolvedAt
        doc.completedDailies   = dailyUpdate.completedDailies
      }
    }
  } catch {
    // Non-critical check, continue
  }

  doc.markModified('solvedProblems')

  await doc.save()
  return serializeProgress(doc)
}

export const attemptProgress = async (
  problemId: string,
  executionTimeMs?: number,
  memoryUsageMb?: number,
  memoryBytes?: number,
) => {
  const validMs =
    typeof executionTimeMs === 'number' && Number.isFinite(executionTimeMs) && executionTimeMs > 0
      ? Math.round(executionTimeMs)
      : undefined

  const doc      = await progressRepo.findOrCreate()
  const existing = doc.solvedProblems.get(problemId)

  const prevTimings = (existing?.runTimings ?? []) as RunTiming[]
  const nextTimings: RunTiming[] = validMs
    ? [...prevTimings, { ms: validMs, memoryMb: memoryUsageMb, accepted: false }].slice(-20)
    : prevTimings

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing?.solvedAt ?? '',
    attempts:        (existing?.attempts ?? 0) + 1,
    title:           existing?.title,
    category:        existing?.category,
    difficulty:      existing?.difficulty,
    type:            ((existing as { type?: 'coding' | 'mcq' | 'trick' })?.type ?? 'coding') as 'coding' | 'mcq' | 'trick',
    reviewInterval:  existing?.reviewInterval ?? 1,
    lastReviewedAt:  existing?.lastReviewedAt,
    nextReviewDue:   existing?.nextReviewDue,
    executionTimeMs: existing?.executionTimeMs,
    memoryBytes:     memoryBytes ?? existing?.memoryBytes,
    memoryUsageMb:   memoryUsageMb ?? existing?.memoryUsageMb,
    runCount:        (existing?.runCount ?? 0) + 1,
    runTimings:      nextTimings,
    acceptedCode:    existing?.acceptedCode,
    recallCount:     existing?.recallCount ?? 0,
    recallSkipped:   existing?.recallSkipped ?? 0,
    lastRecalledAt:  existing?.lastRecalledAt,
  })
  doc.markModified('solvedProblems')

  await doc.save()
  return serializeProgress(doc)
}

export const recallProgress = async (problemId: string) => {
  const doc      = await progressRepo.findOrCreate()
  const today    = new Date().toISOString().split('T')[0] ?? ''
  const existing = doc.solvedProblems.get(problemId)

  if (!existing) {
    throw new NotFoundError('Problem progress not found')
  }

  const review = computeNextReview(
    existing.reviewInterval ?? 1,
    true,
    today,
    RECALL_INTERVAL_MULTIPLIER
  )

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing.solvedAt,
    attempts:        existing.attempts,
    title:           existing.title,
    category:        existing.category,
    difficulty:      existing.difficulty,
    type:            ((existing as { type?: 'coding' | 'mcq' | 'trick' })?.type ?? 'coding') as 'coding' | 'mcq' | 'trick',
    executionTimeMs: existing.executionTimeMs,
    runCount:        existing.runCount,
    runTimings:      existing.runTimings,
    acceptedCode:    existing.acceptedCode,
    recallCount:     (existing.recallCount ?? 0) + 1,
    recallSkipped:   existing.recallSkipped ?? 0,
    lastRecalledAt:  new Date().toISOString(),
    reviewInterval:  review.reviewInterval,
    lastReviewedAt:  review.lastReviewedAt,
    nextReviewDue:   review.nextReviewDue,
  })
  doc.markModified('solvedProblems')

  await doc.save()
  return serializeProgress(doc)
}

export const skipRecallProgress = async (problemId: string) => {
  const doc      = await progressRepo.findOrCreate()
  const existing = doc.solvedProblems.get(problemId)

  if (!existing) {
    throw new NotFoundError('Problem progress not found')
  }

  doc.solvedProblems.set(problemId, {
    solvedAt:        existing.solvedAt,
    attempts:        existing.attempts,
    title:           existing.title,
    category:        existing.category,
    difficulty:      existing.difficulty,
    type:            ((existing as { type?: 'coding' | 'mcq' | 'trick' })?.type ?? 'coding') as 'coding' | 'mcq' | 'trick',
    executionTimeMs: existing.executionTimeMs,
    runCount:        existing.runCount,
    runTimings:      existing.runTimings,
    acceptedCode:    existing.acceptedCode,
    recallCount:     existing.recallCount ?? 0,
    reviewInterval:  existing.reviewInterval ?? 1,
    lastReviewedAt:  existing.lastReviewedAt,
    nextReviewDue:   existing.nextReviewDue,
    lastRecalledAt:  existing.lastRecalledAt,
    recallSkipped:   (existing.recallSkipped ?? 0) + 1,
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
    isRecallDue:    boolean
    recallCount:    number
  }[] = []

  for (const [id, entry] of doc.solvedProblems.entries()) {
    const interval = entry.reviewInterval ?? 1
    const nextDue  = entry.nextReviewDue ?? today
    if (nextDue <= today && !isMastered(interval)) {
      const hoursSinceSolved = entry.solvedAt ? differenceInHours(new Date(), new Date(entry.solvedAt)) : 0
      const isRecallDue = interval >= RECALL_ELIGIBLE_INTERVAL && hoursSinceSolved >= RECALL_MIN_HOURS_SINCE_SOLVE

      due.push({
        id,
        title:          entry.title ?? id,
        category:       entry.category ?? '',
        difficulty:     entry.difficulty ?? 'Easy',
        nextReviewDue:  nextDue,
        reviewInterval: interval,
        daysOverdue:    differenceInCalendarDays(new Date(today), new Date(nextDue)),
        isRecallDue,
        recallCount:    entry.recallCount ?? 0,
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
    doc.readingHistory as unknown as { articleId?: string; date?: string }[]
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

export const importProgress = async (body: ImportBodyInput) => {
  const updatePayload: Record<string, unknown> = {
    solvedProblems:           body.solvedProblems,
    lastActiveDate:           body.lastActiveDate ?? '',
    currentStreak:            body.currentStreak ?? 0,
    longestStreak:            body.longestStreak ?? 0,
    dismissedBackupMilestone: body.dismissedBackupMilestone ?? 0,
  }

  if (body.dailyStreak !== undefined) updatePayload.dailyStreak = body.dailyStreak
  if (body.longestDailyStreak !== undefined) updatePayload.longestDailyStreak = body.longestDailyStreak
  if (body.lastDailySolvedAt !== undefined) updatePayload.lastDailySolvedAt = body.lastDailySolvedAt
  if (body.completedDailies !== undefined) updatePayload.completedDailies = body.completedDailies
  if (body.readArticles !== undefined) updatePayload.readArticles = body.readArticles
  if (body.bookmarkedArticles !== undefined) updatePayload.bookmarkedArticles = body.bookmarkedArticles
  if (body.readingStreak !== undefined) updatePayload.readingStreak = body.readingStreak
  if (body.longestReadingStreak !== undefined) updatePayload.longestReadingStreak = body.longestReadingStreak
  if (body.lastArticleReadAt !== undefined) updatePayload.lastArticleReadAt = body.lastArticleReadAt
  if (body.readingHistory !== undefined) updatePayload.readingHistory = body.readingHistory

  const doc = await progressRepo.replaceProgress(updatePayload)
  return serializeProgress(doc!)
}

export const exportProgress = async () => {
  const doc      = await progressRepo.findOrCreate()
  const data     = serializeProgress(doc)
  const filename = `js-trainer-progress-${format(new Date(), 'yyyy-MM-dd')}.json`
  return { data, filename }
}
