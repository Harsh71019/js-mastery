import { type Request, type Response, type NextFunction } from 'express'

const TIMEOUT_MS = 30_000

export const requestTimeout = (req: Request, res: Response, next: NextFunction): void => {
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timeout' })
    }
  }, TIMEOUT_MS)

  res.on('finish', () => clearTimeout(timer))
  res.on('close', () => clearTimeout(timer))

  next()
}
