import { Router, type Request, type Response } from 'express'
import { randomUUID } from 'crypto'
import { Submission } from '../models/Submission'

const router = Router()
const USER_ID = 'default'
const MAX_LIST = 20

router.post('/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params
  const { verdict, code, executionTimeMs } = req.body as {
    verdict?: string
    code?: string
    executionTimeMs?: number
  }

  if (!verdict || !code) {
    res.status(400).json({ error: 'verdict and code are required' })
    return
  }

  const submissionId = randomUUID()
  const submittedAt = new Date().toISOString()

  await Submission.create({
    userId: USER_ID,
    problemId,
    submissionId,
    verdict,
    code,
    executionTimeMs: typeof executionTimeMs === 'number' ? Math.round(executionTimeMs) : undefined,
    submittedAt,
  })

  res.status(201).json({ submissionId, submittedAt })
})

router.get('/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params

  const submissions = await Submission.find(
    { userId: USER_ID, problemId },
    { _id: 0, code: 0, __v: 0 },
  )
    .sort({ submittedAt: -1 })
    .limit(MAX_LIST)
    .lean()

  res.json({ submissions })
})

router.get('/:problemId/:submissionId', async (req: Request, res: Response): Promise<void> => {
  const { problemId, submissionId } = req.params

  const submission = await Submission.findOne(
    { userId: USER_ID, problemId, submissionId },
    { _id: 0, __v: 0 },
  ).lean()

  if (!submission) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }

  res.json(submission)
})

export default router
