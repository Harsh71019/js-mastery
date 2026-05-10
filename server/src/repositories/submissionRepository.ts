import { Submission } from '../models/Submission'
import { USER_ID } from '../constants'

const MAX_LIST = 20

export const createOne = (data: {
  problemId:       string
  submissionId:    string
  verdict:         string
  code:            string
  executionTimeMs?: number
  submittedAt:     string
}) =>
  Submission.create({ userId: USER_ID, ...data })

export const findByProblem = (problemId: string) =>
  Submission.find(
    { userId: USER_ID, problemId },
    { _id: 0, code: 0, __v: 0 },
  )
    .sort({ submittedAt: -1 })
    .limit(MAX_LIST)
    .lean()

export const findOne = (problemId: string, submissionId: string) =>
  Submission.findOne(
    { userId: USER_ID, problemId, submissionId },
    { _id: 0, __v: 0 },
  ).lean()
