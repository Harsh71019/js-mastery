import { z } from 'zod'
import { Verdict } from '../../constants'

export const CreateSubmissionSchema = z.object({
  verdict:         z.enum([Verdict.Accepted, Verdict.WrongAnswer, Verdict.Error]),
  code:            z.string().min(1),
  executionTimeMs: z.number().min(0).optional(),
})

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>
