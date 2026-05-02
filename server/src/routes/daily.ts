import { Router, type Request, type Response } from 'express'
import { format } from 'date-fns'
import { Problem } from '../models/Problem'
import { Progress } from '../models/Progress'
import { selectDailyIndex } from '../utils/daily'
import { updateDailyStreak } from '../utils/dailyStreak'
import { serializeProgress } from '../utils/serializeProgress'

const router = Router()
const USER_ID = 'default'

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const allIds = await Problem.find({ status: 'published' })
    .select('id -_id')
    .sort({ _id: 1 })
    .lean()

  if (allIds.length === 0) {
    res.status(404).json({ error: 'No problems available' })
    return
  }

  const index   = selectDailyIndex(allIds.length, new Date())
  const problem = await Problem.findOne(
    { id: allIds[index].id, status: 'published' },
    { _id: 0, __v: 0, status: 0, createdAt: 0, updatedAt: 0 },
  ).lean()

  if (!problem) {
    res.status(404).json({ error: 'Daily problem not found' })
    return
  }

  const progress          = await Progress.findOne({ userId: USER_ID }).lean()
  const completedDailies  = progress?.completedDailies ?? []
  const alreadyCompleted  = completedDailies.includes(today)

  res.json({ problem, date: today, alreadyCompleted })
})

router.post('/complete', async (_req: Request, res: Response): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd')

  let doc = await Progress.findOne({ userId: USER_ID })
  if (!doc) doc = new Progress({ userId: USER_ID })

  const updated = updateDailyStreak(
    {
      dailyStreak:        doc.dailyStreak        ?? 0,
      longestDailyStreak: doc.longestDailyStreak ?? 0,
      lastDailySolvedAt:  doc.lastDailySolvedAt  as string | undefined,
      completedDailies:   (doc.completedDailies  as string[]) ?? [],
    },
    today,
  )

  doc.dailyStreak        = updated.dailyStreak
  doc.longestDailyStreak = updated.longestDailyStreak
  doc.lastDailySolvedAt  = updated.lastDailySolvedAt
  doc.completedDailies   = updated.completedDailies
  await doc.save()

  res.json(serializeProgress(doc))
})

export default router
