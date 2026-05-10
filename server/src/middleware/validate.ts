import { type RequestHandler } from 'express'
import { type ZodSchema } from 'zod'
import { AppError } from './AppError'

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${String(e.path.join('.'))}: ${e.message}`)
        .join('; ')
      return next(new AppError(400, message))
    }
    req.body = result.data
    next()
  }
