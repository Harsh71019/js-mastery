import { randomUUID } from 'crypto'
import { type Request, type Response, type NextFunction } from 'express'

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  // Express's ParamsDictionary allows string indexing; req.id is set here for downstream use
  ;(req as Request & { id: string }).id = randomUUID()
  res.setHeader('X-Request-Id', (req as Request & { id: string }).id)
  next()
}
