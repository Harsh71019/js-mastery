import { Router, type Request, type Response } from 'express'
import { Problem } from '../models/Problem'
import { validateProblem, escapeRegex, type ValidationError } from '../utils/problem-validation'

const router = Router()

const findDuplicate = (id: string, title: string, functionName: string) =>
  Problem.findOne({
    $or: [
      { id },
      { title: { $regex: `^${escapeRegex(title)}$`, $options: 'i' } },
      { functionName },
    ],
  })
    .select('id title functionName -_id')
    .lean()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const { status, category, difficulty, search } = req.query

    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    if (search) filter.title = { $regex: search, $options: 'i' }

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select('id title category difficulty status patternTag estimatedMinutes createdAt -_id')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Problem.countDocuments(filter),
    ])

    res.json({ problems, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to list problems' })
  }
})

router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [byStatus, byCategory] = await Promise.all([
      Problem.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Problem.aggregate([
        { $group: { _id: { category: '$category', status: '$status' }, count: { $sum: 1 } } },
        { $project: { _id: 0, category: '$_id.category', status: '$_id.status', count: 1 } },
        { $sort: { category: 1 } },
      ]),
    ])
    res.json({ byStatus, byCategory })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = req.body as Record<string, unknown>

    const errors = validateProblem(doc)
    if (errors.length > 0) {
      res.status(422).json({ error: 'Validation failed', errors })
      return
    }

    const duplicate = await findDuplicate(doc.id as string, doc.title as string, doc.functionName as string)
    if (duplicate) {
      res.status(409).json({ error: 'Duplicate problem', duplicate })
      return
    }

    const problem = await Problem.create({ ...doc, status: doc.status ?? 'draft' })
    res.status(201).json({ id: problem.id })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create problem' })
  }
})

router.post('/bulk', async (req: Request, res: Response): Promise<void> => {
  try {
    const items: unknown[] = req.body
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Body must be a non-empty array' })
      return
    }

    const inserted: string[] = []
    const duplicates: Array<{ index: number; id: string; matchedId: string }> = []
    const invalid: Array<{ index: number; id?: string; errors: ValidationError[] }> = []

    for (let i = 0; i < items.length; i++) {
      const doc = items[i] as Record<string, unknown>

      const errors = validateProblem(doc)
      if (errors.length > 0) {
        invalid.push({ index: i, id: doc.id as string | undefined, errors })
        continue
      }

      const duplicate = await findDuplicate(doc.id as string, doc.title as string, doc.functionName as string)
      if (duplicate) {
        duplicates.push({ index: i, id: doc.id as string, matchedId: duplicate.id })
        continue
      }

      await Problem.create({ ...doc, status: doc.status ?? 'draft' })
      inserted.push(doc.id as string)
    }

    res.status(201).json({
      summary: { inserted: inserted.length, duplicates: duplicates.length, invalid: invalid.length },
      inserted,
      duplicates,
      invalid,
    })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to bulk import problems' })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findOne({ id: req.params.id }, { _id: 0, __v: 0 }).lean()
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' })
      return
    }
    res.json(problem)
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch problem' })
  }
})

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body as Record<string, unknown>
    delete updates.id

    const problem = await Problem.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true, projection: { _id: 0, __v: 0 } },
    ).lean()

    if (!problem) {
      res.status(404).json({ error: 'Problem not found' })
      return
    }
    res.json(problem)
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update problem' })
  }
})

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Problem.deleteOne({ id: req.params.id })
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Problem not found' })
      return
    }
    res.json({ deleted: req.params.id })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete problem' })
  }
})

router.post('/:id/publish', async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: 'published' } },
      { new: true, projection: { id: 1, title: 1, status: 1, _id: 0 } },
    ).lean()

    if (!problem) {
      res.status(404).json({ error: 'Problem not found' })
      return
    }
    res.json(problem)
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to publish problem' })
  }
})

router.post('/:id/unpublish', async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: 'draft' } },
      { new: true, projection: { id: 1, title: 1, status: 1, _id: 0 } },
    ).lean()

    if (!problem) {
      res.status(404).json({ error: 'Problem not found' })
      return
    }
    res.json(problem)
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: 'Failed to unpublish problem' })
  }
})

export default router
