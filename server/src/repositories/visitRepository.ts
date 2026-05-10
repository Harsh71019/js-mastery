import { Visit } from '../models/Visit'
import { USER_ID } from '../constants'

export const createOne = (problemId: string, visitedAt: string) =>
  Visit.create({ userId: USER_ID, problemId, visitedAt })

export const aggregateVisitCounts = () =>
  Visit.aggregate([
    { $match: { userId: USER_ID } },
    { $group: { _id: '$problemId', visitCount: { $sum: 1 } } },
    { $project: { _id: 0, problemId: '$_id', visitCount: 1 } },
  ])
