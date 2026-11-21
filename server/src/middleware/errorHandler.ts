import { type Request, type Response, type NextFunction } from 'express'
import { AppError } from './AppError'
import { logger } from '../config/logger'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  // Handle Mongoose CastError (e.g. invalid ObjectID or param casting)
  if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'CastError') {
    res.status(400).json({ error: 'Invalid identifier or resource format' })
    return
  }

  // Handle Mongoose / MongoDB Duplicate Key Error (E11000)
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    res.status(409).json({ error: 'Resource conflict or duplicate entry' })
    return
  }

  // Handle Mongoose Validation Error
  if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'ValidationError') {
    res.status(422).json({ error: (err as Error).message || 'Database validation failed' })
    return
  }

  logger.error({ err, reqId: (req as Request & { id?: string }).id }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
}
