import { Router, type Request, type Response } from 'express'
import { format } from 'date-fns'
import { Progress } from '../models/Progress'
import { getUpdatedStreak } from '../utils/streak'

const router = Router()
const USER_ID = 'default'

const getOrCreateProgress = async () => {
  const doc = await Progress.findOne({ userId: USER_ID })
  if (doc) return doc
  return Progress.create({ userId: USER_ID })
}

const toClientShape = (doc: Awaited<ReturnType<typeof getOrCreateProgress>>) => ({
  solvedProblems: Object.fromEntries(doc.solvedProblems ?? new Map()),
  lastActiveDate: doc.lastActiveDate,
  currentStreak: doc.currentStreak,
  longestStreak: doc.longestStreak,
  dismissedBackupMilestone: doc.dismissedBackupMilestone,
})

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const doc = await getOrCreateProgress()
  res.json(toClientShape(doc))
})

router.post('/solve/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params
  const { title, category, difficulty } = req.body as {
    title?: string
    category?: string
    difficulty?: string
  }

  const doc = await getOrCreateProgress()
  const today = new Date().toISOString().split('T')[0]
  const existing = doc.solvedProblems.get(problemId)

  doc.solvedProblems.set(problemId, {
    solvedAt: existing?.solvedAt || new Date().toISOString(),
    attempts: (existing?.attempts ?? 0) + 1,
    title: title ?? existing?.title,
    category: category ?? existing?.category,
    difficulty: difficulty ?? existing?.difficulty,
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
  const doc = await getOrCreateProgress()
  const existing = doc.solvedProblems.get(problemId)

  doc.solvedProblems.set(problemId, {
    solvedAt: existing?.solvedAt ?? '',
    attempts: (existing?.attempts ?? 0) + 1,
    title: existing?.title,
    category: existing?.category,
    difficulty: existing?.difficulty,
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
