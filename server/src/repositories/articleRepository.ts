import { Article } from '../models/Article'

export interface ArticleFilters {
  company?: string
  region?: string
  tags?: string
  difficulty?: string
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

export const upsertOne = (id: string, doc: Record<string, unknown>) =>
  Article.updateOne(
    { id },
    { $setOnInsert: { ...doc, status: doc.status ?? 'published' } },
    { upsert: true },
  )
