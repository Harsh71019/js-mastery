import { z } from 'zod'
import { Verdict } from '../../constants'

export const CreateSubmissionSchema = z.object({
  verdict: z.enum([
    Verdict.Accepted,
    Verdict.WrongAnswer,
    Verdict.Error,
    Verdict.TimeLimitExceeded,
    Verdict.MemoryLimitExceeded,
  ]),
  code: z.string().min(1),
  executionTimeMs: z.number().min(0).optional(),
  cpuTimeMs: z.number().min(0).optional(),
  memoryBytes: z.number().min(0).optional(),
  memoryUsageMb: z.number().min(0).optional(),
})

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>
