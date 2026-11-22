import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import { NotFoundError } from '../middleware/AppError'
import * as dailyService from '../services/dailyService'
import { success } from '../utils/apiResponse'

export const getDaily = catchAsync(async (_req: Request, res: Response) => {
  const result = await dailyService.getDailyProblem()
  if (!result) {
    throw new NotFoundError('No problems available')
  }
  res.json(success(result))
})

export const complete = catchAsync(async (_req: Request, res: Response) => {
  res.json(success(await dailyService.completeDaily()))
})
