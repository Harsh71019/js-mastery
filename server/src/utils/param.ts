import { type Request } from 'express'

export const param = (req: Request, key: string): string => {
  const value = req.params[key]
  if (value === undefined) throw new Error(`Missing route param: ${key}`)
  return value
}
