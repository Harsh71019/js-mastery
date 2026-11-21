import { Note } from '../models/Note'
import { USER_ID } from '../constants'

export const findByProblem = (problemId: string, userId = USER_ID) =>
  Note.findOne({ userId, problemId }, { _id: 0, __v: 0 }).lean()

export const upsertOne = (
  problemId: string,
  content: string,
  tags: string[] = [],
  userId = USER_ID,
) =>
  Note.findOneAndUpdate(
    { userId, problemId },
    { $set: { content, tags } },
    { new: true, upsert: true, projection: { _id: 0, __v: 0 } },
  ).lean()

export const deleteOne = (problemId: string, userId = USER_ID) =>
  Note.deleteOne({ userId, problemId })

export const listAll = (userId = USER_ID) =>
  Note.find({ userId }, { _id: 0, __v: 0 })
    .sort({ updatedAt: -1 })
    .lean()
