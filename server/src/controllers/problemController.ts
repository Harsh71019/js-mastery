import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import { NotFoundError } from '../middleware/AppError'
import * as problemService from '../services/problemService'
import { success, paginated } from '../utils/apiResponse'
import { param } from '../utils/param'

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.listProblems({
    query:        req.query,
    category:     req.query.category as string | undefined,
    difficulty:   req.query.difficulty as string | undefined,
    search:       req.query.search as string | undefined,
    type:         req.query.type as string | undefined,
    patternTag:   req.query.patternTag as string | undefined,
    collectionId: req.query.collectionId as string | undefined,
  })
  res.json(paginated(result.problems as never[], result.pagination))
})

export const patterns = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await problemService.getPatterns()))
})

export const categoryCounts = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await problemService.getCategoryCounts()))
})

export const collectionCounts = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await problemService.getCollectionCounts()))
})

export const quizStats = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await problemService.getQuizStats()))
})

export const submitTests = catchAsync(async (req: Request, res: Response) => {
  const tests = await problemService.getSubmitTests(param(req, 'id'))
  if (tests === null) {
    throw new NotFoundError('Problem not found')
  }
  res.json(success({ tests }))
})

export const getById = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.getProblemById(param(req, 'id'))
  if (!problem) {
    throw new NotFoundError('Problem not found')
  }
  res.json(success(problem))
})

export const createOne = catchAsync(async (req: Request, res: Response) => {
  const { id, created } = await problemService.createProblem(req.body as Record<string, unknown>)
  res.status(created ? 201 : 200).json(success({ id }))
})

export const bulkCreate = catchAsync(async (req: Request, res: Response) => {
  const result = await problemService.bulkCreateProblems(req.body as Record<string, unknown>[])
  res.status(201).json(success(result))
})
