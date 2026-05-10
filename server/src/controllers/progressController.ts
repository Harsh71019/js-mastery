import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as progressService from '../services/progressService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'
import { type SolveBodyInput, type AttemptBodyInput, type ImportBodyInput } from '../types/schemas/progressSchemas'

export const get = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await progressService.getProgress()))
})

export const solve = catchAsync(async (req: Request, res: Response) => {
  res.json(success(await progressService.solveProgress(param(req, 'problemId'), req.body as SolveBodyInput)))
})

export const attempt = catchAsync(async (req: Request, res: Response) => {
  const { executionTimeMs } = req.body as AttemptBodyInput
  res.json(success(await progressService.attemptProgress(param(req, 'problemId'), executionTimeMs)))
})

export const reset = catchAsync(async (_req: Request, res: Response) => {
  await progressService.resetProgress()
  res.status(204).send()
})

export const reviewQueue = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await progressService.getReviewQueue()))
})

export const activity = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await progressService.getActivity()))
})

export const executionTimes = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await progressService.getExecutionTimes()))
})

export const dismissBanner = catchAsync(async (req: Request, res: Response) => {
  const milestone = parseInt(param(req, 'milestone'))
  if (isNaN(milestone) || milestone < 0) {
    res.status(400).json({ error: 'milestone must be a non-negative integer' })
    return
  }
  res.json(success(await progressService.dismissBanner(milestone)))
})

export const importProg = catchAsync(async (req: Request, res: Response) => {
  res.json(success(await progressService.importProgress(req.body as ImportBodyInput)))
})

export const exportProg = catchAsync(async (_req: Request, res: Response) => {
  const { data, filename } = await progressService.exportProgress()
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data, null, 2))
})
