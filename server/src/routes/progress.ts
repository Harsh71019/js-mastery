import { Router, type Request, type Response } from 'express'
import { format, differenceInCalendarDays } from 'date-fns'
import { Progress } from '../models/Progress'
import { getUpdatedStreak } from '../utils/streak'
import { computeNextReview, isMastered } from '../utils/review'
import { serializeProgress } from '../utils/serializeProgress'
import { getDailyActivity } from '../utils/activity'

const router = Router()
const USER_ID = 'default'

const getOrCreateProgress = async () => {
  const doc = await Progress.findOne({ userId: USER_ID })
  if (doc) return doc
  return Progress.create({ userId: USER_ID })
}

const toClientShape = (doc: Awaited<ReturnType<typeof getOrCreateProgress>>) =>
  serializeProgress(doc)

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const doc = await getOrCreateProgress()
  res.json(toClientShape(doc))
})

router.post('/solve/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params
  const { title, category, difficulty, executionTimeMs } = req.body as {
    title?: string
    category?: string
    difficulty?: string
    executionTimeMs?: number
  }

  const validExecutionTimeMs =
    typeof executionTimeMs === 'number' && Number.isFinite(executionTimeMs) && executionTimeMs > 0
      ? Math.round(executionTimeMs)
      : undefined

  const doc = await getOrCreateProgress()
  const today = new Date().toISOString().split('T')[0]
  const existing = doc.solvedProblems.get(problemId)
  const isFirstSolve = !existing?.solvedAt

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
    runTimings:      validExecutionTimeMs
      ? [...((existing?.runTimings as number[]) ?? []), validExecutionTimeMs].slice(-20)
      : ((existing?.runTimings as number[]) ?? []),
  })

  const streak = getUpdatedStreak(
    { currentStreak: doc.currentStreak, longestStreak: doc.longestStreak, lastActiveDate: doc.lastActiveDate },
    today,
  )
  doc.currentStreak = streak.currentStreak
  doc.longestStreak = streak.longestStreak
  doc.lastActiveDate = streak.lastActiveDate
  doc.markModified('solvedProblems')

  await doc.save()
  res.json(toClientShape(doc))
})

router.post('/attempt/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params
  const { executionTimeMs } = req.body as { executionTimeMs?: number }

  const validMs =
    typeof executionTimeMs === 'number' && Number.isFinite(executionTimeMs) && executionTimeMs > 0
      ? Math.round(executionTimeMs)
      : undefined

  const doc = await getOrCreateProgress()
  const existing = doc.solvedProblems.get(problemId)

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
    runTimings:      validMs
      ? [...((existing?.runTimings as number[]) ?? []), validMs].slice(-20)
      : ((existing?.runTimings as number[]) ?? []),
  })
  doc.markModified('solvedProblems')

  await doc.save()
  res.json(toClientShape(doc))
})

router.delete('/', async (_req: Request, res: Response): Promise<void> => {
  await Progress.findOneAndUpdate(
    { userId: USER_ID },
    {
      solvedProblems: {},
      lastActiveDate: '',
      currentStreak: 0,
      longestStreak: 0,
      dismissedBackupMilestone: 0,
    },
    { upsert: true },
  )
  res.json({ ok: true })
})

router.get('/review-queue', async (_req: Request, res: Response): Promise<void> => {
  const doc   = await getOrCreateProgress()
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
  res.json({ due, total: due.length })
})

router.get('/activity', async (_req: Request, res: Response): Promise<void> => {
  const doc = await getOrCreateProgress()
  const data = getDailyActivity(
    doc.solvedProblems as unknown as Map<string, { solvedAt?: string }>,
  )
  res.json(data)
})

router.get('/execution-times', async (_req: Request, res: Response): Promise<void> => {
  const doc = await getOrCreateProgress()

  const entries: {
    id:             string
    title:          string
    category:       string
    difficulty:     string
    executionTimeMs: number
    solvedAt:       string
  }[] = []

  for (const [id, entry] of doc.solvedProblems.entries()) {
    if (typeof entry.executionTimeMs !== 'number') continue
    entries.push({
      id,
      title:           entry.title ?? id,
      category:        entry.category ?? '',
      difficulty:      entry.difficulty ?? '',
      executionTimeMs: entry.executionTimeMs,
      solvedAt:        entry.solvedAt ? entry.solvedAt.split('T')[0] : '',
    })
  }

  entries.sort((a, b) => a.solvedAt.localeCompare(b.solvedAt))
  res.json({ entries })
})

router.put('/dismiss-banner/:milestone', async (req: Request, res: Response): Promise<void> => {
  const milestone = parseInt(req.params.milestone)
  const doc = await getOrCreateProgress()
  doc.dismissedBackupMilestone = milestone
  await doc.save()
  res.json(toClientShape(doc))
})

router.post('/import', async (req: Request, res: Response): Promise<void> => {
  const body = req.body as {
    solvedProblems?: Record<string, unknown>
    lastActiveDate?: string
    currentStreak?: number
    longestStreak?: number
    dismissedBackupMilestone?: number
  }

  if (!body.solvedProblems) {
    res.status(400).json({ error: 'Invalid progress data — solvedProblems field is required' })
    return
  }

  const doc = await Progress.findOneAndUpdate(
    { userId: USER_ID },
    {
      solvedProblems: body.solvedProblems,
      lastActiveDate: body.lastActiveDate ?? '',
      currentStreak: body.currentStreak ?? 0,
      longestStreak: body.longestStreak ?? 0,
      dismissedBackupMilestone: body.dismissedBackupMilestone ?? 0,
    },
    { upsert: true, new: true },
  )

  res.json(toClientShape(doc!))
})

router.get('/export', async (_req: Request, res: Response): Promise<void> => {
  const doc = await getOrCreateProgress()
  const data = toClientShape(doc)
  const filename = `js-trainer-progress-${format(new Date(), 'yyyy-MM-dd')}.json`
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data, null, 2))
})

export default router
