import { type Request, type Response, type NextFunction } from 'express'
import { env } from '../config/env'

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!env.ADMIN_TOKEN) {
    next()
    return
  }

  const auth  = req.headers.authorization ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

  if (token !== env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
