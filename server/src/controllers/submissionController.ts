import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as submissionService from '../services/submissionService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'
import { type CreateSubmissionInput } from '../types/schemas/submissionSchemas'

export const create = catchAsync(async (req: Request, res: Response) => {
  const { verdict, code, executionTimeMs } = req.body as CreateSubmissionInput
  const result = await submissionService.createSubmission({
    problemId: param(req, 'problemId'),
    verdict,
    code,
    executionTimeMs,
  })
  res.status(201).json(success(result))
})

export const list = catchAsync(async (req: Request, res: Response) => {
  res.json(success(await submissionService.listSubmissions(param(req, 'problemId'))))
})

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const submission = await submissionService.getSubmission(
    param(req, 'problemId'),
    param(req, 'submissionId'),
  )
  if (!submission) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }
  res.json(success(submission))
})
