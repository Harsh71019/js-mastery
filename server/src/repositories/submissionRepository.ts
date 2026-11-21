import { Submission } from '../models/Submission'
import { USER_ID, Verdict } from '../constants'

const MAX_LIST = 20

export interface SubmissionData {
  problemId: string
  submissionId: string
  verdict: string
  code: string
  executionTimeMs?: number
  cpuTimeMs?: number
  memoryBytes?: number
  memoryUsageMb?: number
  beatsRuntime?: number
  beatsMemory?: number
  submittedAt: string
}

export const createOne = (data: SubmissionData) =>
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

export const findAcceptedByProblem = (problemId: string) =>
  Submission.find(
    { problemId, verdict: Verdict.Accepted },
    { _id: 0, executionTimeMs: 1, memoryUsageMb: 1, submittedAt: 1 },
  )
    .sort({ submittedAt: -1 })
    .limit(500)
    .lean()

export const countAccepted = (problemId: string) =>
  Submission.countDocuments({ problemId, verdict: Verdict.Accepted })

export const countSlower = (problemId: string, executionTimeMs: number) =>
  Submission.countDocuments({
    problemId,
    verdict: Verdict.Accepted,
    executionTimeMs: { $gt: executionTimeMs },
  })

export const countHigherMemory = (problemId: string, memoryUsageMb: number) =>
  Submission.countDocuments({
    problemId,
    verdict: Verdict.Accepted,
    memoryUsageMb: { $gt: memoryUsageMb },
  })
