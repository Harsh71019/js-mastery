import { type ParsedQs } from 'qs'

export interface PaginationParams {
  page:  number
  limit: number
  skip:  number
}

export const parsePagination = (query: ParsedQs): PaginationParams => {
  const rawPage  = parseInt(query.page  as string, 10)
  const rawLimit = parseInt(query.limit as string, 10)

  const page  = Math.max(1, Number.isNaN(rawPage)  ? 1  : rawPage)
  const limit = Math.min(100, Math.max(1, Number.isNaN(rawLimit) ? 20 : rawLimit))

  return { page, limit, skip: (page - 1) * limit }
}
