import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as visitService from '../services/visitService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'

export const stats = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await visitService.getVisitStats()))
})

export const record = catchAsync(async (req: Request, res: Response) => {
  await visitService.recordVisit(param(req, 'problemId'))
  res.status(201).json(success({ ok: true }))
})
