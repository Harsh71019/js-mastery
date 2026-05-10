import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as problemService from '../services/problemService'
import { success, paginated } from '../utils/apiResponse'
import { param } from '../utils/param'
import { type CreateProblemInput, type PatchProblemInput } from '../types/schemas/problemSchemas'

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.adminListProblems({
    query:      req.query,
    status:     req.query.status as string | undefined,
    category:   req.query.category as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    search:     req.query.search as string | undefined,
  })
  res.json(paginated(result.problems as never[], result.pagination))
})

export const stats = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await problemService.adminGetStats()))
})

export const create = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.adminCreateProblem(req.body as CreateProblemInput)
  if ('errors' in result) {
    res.status(422).json({ error: 'Validation failed', errors: result.errors })
    return
  }
  if ('duplicate' in result) {
    res.status(409).json({ error: 'Duplicate problem', duplicate: result.duplicate })
    return
  }
  res.status(201).json(success({ id: result.id }))
})

export const bulkCreate = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.adminBulkCreate(req.body as CreateProblemInput[])
  res.status(201).json(success(result))
})

export const getById = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.adminGetProblemById(param(req, 'id'))
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }
  res.json(success(problem))
})

export const patch = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.adminPatchProblem(param(req, 'id'), req.body as PatchProblemInput)
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }
  res.json(success(problem))
})

export const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.adminDeleteProblem(param(req, 'id'))
  if (result.deletedCount === 0) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }
  res.status(204).send()
})

export const publish = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.adminSetStatus(param(req, 'id'), 'published')
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }
  res.json(success(problem))
})

export const unpublish = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.adminSetStatus(param(req, 'id'), 'draft')
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }
  res.json(success(problem))
})
