import { type Request, type Response, type NextFunction } from 'express'
import { AppError } from './AppError'
import { logger } from '../config/logger'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  logger.error({ err, reqId: (req as Request & { id?: string }).id }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
}
