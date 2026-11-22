import { Article } from '../models/Article'

export interface ArticleFilters {
  company?: string
  region?: string
  tags?: string
  difficulty?: string
  domain?: string
  search?: string
}

export const findPublished = (filter: Record<string, unknown>) =>
  Article.find({ ...filter, status: 'published' })
    .sort({ createdAt: -1 })
    .lean()

export const findAllPublishedSortedById = () =>
  Article.find({ status: 'published' })
    .sort({ id: 1 })
    .lean()

export const findByIdPublished = (id: string) =>
  Article.findOne({ id, status: 'published' }, { _id: 0, __v: 0 }).lean()

export const countPublished = (filter: Record<string, unknown> = {}) =>
  Article.countDocuments({ ...filter, status: 'published' })

export const aggregateDomainCounts = async (): Promise<Array<{ _id: string; count: number }>> => {
  return Article.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$domain', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
}

export const upsertOne = (id: string, doc: Record<string, unknown>) =>
  Article.updateOne(
    { id },
    { $set: { ...doc, status: doc.status ?? 'published' } },
    { upsert: true },
  )
