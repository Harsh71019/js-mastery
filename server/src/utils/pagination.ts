import { type ParsedQs } from 'qs'

export interface PaginationParams {
  page:  number
  limit: number
  skip:  number
}

export const parsePagination = (query: ParsedQs): PaginationParams => {
  const page  = Math.max(1, parseInt(query.page  as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
  return { page, limit, skip: (page - 1) * limit }
}
