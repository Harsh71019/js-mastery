import { Router, type Request, type Response } from 'express'
import { Problem } from '../models/Problem'

const router = Router()

const LIST_FIELDS = 'id title category difficulty patternTag estimatedMinutes -_id'

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
  const { category, difficulty, search } = req.query

  const filter: Record<string, unknown> = { status: 'published' }
  if (category) filter.category = category
  if (difficulty) filter.difficulty = difficulty
  if (search) filter.title = { $regex: search, $options: 'i' }

  const [problems, total] = await Promise.all([
    Problem.find(filter)
      .select(LIST_FIELDS)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Problem.countDocuments(filter),
  ])

  res.json({
    problems,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

// Must be defined before /:id to avoid 'categories' matching as an id
router.get('/categories/counts', async (_req: Request, res: Response): Promise<void> => {
  const counts = await Problem.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, slug: '$_id', count: 1 } },
    { $sort: { slug: 1 } },
  ])

  res.json(counts)
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const problem = await Problem.findOne(
    { id: req.params.id, status: 'published' },
    { _id: 0, __v: 0, status: 0, createdAt: 0, updatedAt: 0 },
  ).lean()

  if (!problem) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }

  const allIds = await Problem.find({ status: 'published' })
    .select('id -_id')
    .sort({ _id: 1 })
    .lean()

  const currentIndex = allIds.findIndex((p) => p.id === req.params.id)
  const prevId = currentIndex > 0 ? allIds[currentIndex - 1].id : null
  const nextId = currentIndex < allIds.length - 1 ? allIds[currentIndex + 1].id : null

  res.json({ ...problem, prevId, nextId })
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const doc = req.body as Record<string, unknown>
  const result = await Problem.updateOne(
    { id: doc.id },
    { $setOnInsert: { ...doc, status: doc.status ?? 'draft' } },
    { upsert: true },
  )

  res.status(result.upsertedCount > 0 ? 201 : 200).json({ id: doc.id })
})

router.post('/bulk', async (req: Request, res: Response): Promise<void> => {
  const problems: unknown[] = req.body
  if (!Array.isArray(problems) || problems.length === 0) {
    res.status(400).json({ error: 'Request body must be a non-empty array' })
    return
  }

  let inserted = 0
  let skipped = 0

  for (const problem of problems) {
    const doc = problem as Record<string, unknown>
    const result = await Problem.updateOne(
      { id: doc.id },
      { $setOnInsert: { ...doc, status: doc.status ?? 'draft' } },
      { upsert: true },
    )
    if (result.upsertedCount > 0) {
      inserted++
    } else {
      skipped++
    }
  }

  res.status(201).json({ inserted, skipped })
})

export default router
