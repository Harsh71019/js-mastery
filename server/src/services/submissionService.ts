import { randomUUID } from 'crypto'
import * as submissionRepo from '../repositories/submissionRepository'

export interface CreateSubmissionInput {
  problemId:       string
  verdict:         string
  code:            string
  executionTimeMs?: number
}

export const createSubmission = async (input: CreateSubmissionInput) => {
  const { problemId, verdict, code, executionTimeMs } = input
  const submissionId = randomUUID()
  const submittedAt  = new Date().toISOString()

  await submissionRepo.createOne({
    problemId,
    submissionId,
    verdict,
    code,
    executionTimeMs: typeof executionTimeMs === 'number' ? Math.round(executionTimeMs) : undefined,
    submittedAt,
  })

  return { submissionId, submittedAt }
}

export const listSubmissions = (problemId: string) =>
  submissionRepo.findByProblem(problemId).then((submissions) => ({ submissions }))

export const getSubmission = (problemId: string, submissionId: string) =>
  submissionRepo.findOne(problemId, submissionId)
