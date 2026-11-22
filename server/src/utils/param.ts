import { type Request } from 'express'
import { BadRequestError } from '../middleware/AppError'

export const param = (req: Request, key: string): string => {
  const value = req.params[key]
  if (value === undefined || value.trim() === '') {
    throw new BadRequestError(`Missing route param: ${key}`)
  }
  if (value.length > 128) {
    throw new BadRequestError(`Route param ${key} exceeds maximum length`)
  }
  return value
}
