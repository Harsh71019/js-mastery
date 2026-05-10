export interface PaginationMeta {
  page:       number
  limit:      number
  total:      number
  totalPages: number
}

export interface ApiSuccess<T> {
  success: true
  data:    T
}

export interface ApiPaginated<T> {
  success:    true
  data:       T[]
  pagination: PaginationMeta
}

export const success = <T>(data: T): ApiSuccess<T> => ({ success: true, data })

export const paginated = <T>(items: T[], pagination: PaginationMeta): ApiPaginated<T> => ({
  success: true,
  data:    items,
  pagination,
})
