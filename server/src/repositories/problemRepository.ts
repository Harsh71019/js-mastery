import { type FilterQuery, type Types } from 'mongoose'
import { Problem } from '../models/Problem'
import { type PaginationParams } from '../utils/pagination'

export const findPublished = (filter: FilterQuery<unknown>, pagination: PaginationParams) =>
  Promise.all([
    Problem.find({ ...filter, status: 'published' })
      .select('id title category difficulty patternTag estimatedMinutes type -_id')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Problem.countDocuments({ ...filter, status: 'published' }),
  ])

export const findByIdPublished = (id: string) =>
  Problem.findOne(
    { id, status: 'published' },
    { _id: 0, __v: 0, status: 0, createdAt: 0, updatedAt: 0 },
  ).lean()

export const findMongoIdByProblemId = (id: string) =>
  Problem.findOne({ id, status: 'published' }, { _id: 1 }).lean()

export const findPrevNext = async (mongoId: Types.ObjectId) => {
  const [prev, next] = await Promise.all([
    Problem.findOne(
      { _id: { $lt: mongoId }, status: 'published' },
      { id: 1, _id: 0 },
    ).sort({ _id: -1 }).lean(),
    Problem.findOne(
      { _id: { $gt: mongoId }, status: 'published' },
      { id: 1, _id: 0 },
    ).sort({ _id: 1 }).lean(),
  ])
  return { prevId: prev?.id ?? null, nextId: next?.id ?? null }
}

export const findTestsById = (id: string) =>
  Problem.findOne({ id, status: 'published' }, { _id: 0, tests: 1 }).lean()

export const findAllPublishedIds = () =>
  Problem.find({ status: 'published' }).select('id -_id').sort({ _id: 1 }).lean()

export const aggregatePatterns = () =>
  Problem.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$patternTag', count: { $sum: 1 } } },
    { $project: { _id: 0, tag: '$_id', count: 1 } },
    { $sort: { count: -1, tag: 1 } },
  ])

export const aggregateCategoryCounts = () =>
  Problem.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, slug: '$_id', count: 1 } },
    { $sort: { slug: 1 } },
  ])

export const aggregateCollectionCounts = () =>
  Problem.aggregate([
    { $match: { status: 'published', collectionId: { $exists: true, $ne: 'general' } } },
    { $group: { _id: '$collectionId', count: { $sum: 1 } } },
    { $project: { _id: 0, id: '$_id', count: 1 } },
    { $sort: { id: 1 } },
  ])

export const upsertOne = (id: string, doc: Record<string, unknown>) =>
  Problem.updateOne(
    { id },
    { $setOnInsert: { ...doc, status: doc.status ?? 'draft' } },
    { upsert: true },
  )

// Admin
export const findAdmin = (filter: FilterQuery<unknown>, pagination: PaginationParams) =>
  Promise.all([
    Problem.find(filter)
      .select('id title category difficulty status patternTag estimatedMinutes createdAt -_id')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean(),
    Problem.countDocuments(filter),
  ])

export const aggregateAdminStats = () =>
  Promise.all([
    Problem.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Problem.aggregate([
      { $group: { _id: { category: '$category', status: '$status' }, count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id.category', status: '$_id.status', count: 1 } },
      { $sort: { category: 1 } },
    ]),
  ])

export const findAdminById = (id: string) =>
  Problem.findOne({ id }, { _id: 0, __v: 0 }).lean()

export const findDuplicate = (id: string, title: string, functionName: string) =>
  Problem.findOne({
    $or: [
      { id },
      { title: { $regex: `^${title}$`, $options: 'i' } },
      { functionName },
    ],
  })
    .select('id title functionName -_id')
    .lean()

export const createOne = (doc: Record<string, unknown>) =>
  Problem.create({ ...doc, status: doc.status ?? 'draft' })

export const patchOne = (id: string, updates: Record<string, unknown>) =>
  Problem.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, runValidators: true, projection: { _id: 0, __v: 0 } },
  ).lean()

export const deleteOne = (id: string) =>
  Problem.deleteOne({ id })

export const setStatus = (id: string, status: 'published' | 'draft') =>
  Problem.findOneAndUpdate(
    { id },
    { $set: { status } },
    { new: true, projection: { id: 1, title: 1, status: 1, _id: 0 } },
  ).lean()
