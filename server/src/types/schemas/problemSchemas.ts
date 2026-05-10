import { z } from 'zod'
import { Difficulty, ProblemType, ProblemStatus } from '../../constants'

const TestCaseSchema = z.object({
  input:            z.unknown(),
  expected:         z.unknown().optional(),
  label:            z.string().optional(),
  hidden:           z.boolean().optional(),
  isEval:           z.boolean().optional(),
  isGenerator:      z.boolean().optional(),
  isIterable:       z.boolean().optional(),
  isAsyncGenerator: z.boolean().optional(),
  isAsyncIterable:  z.boolean().optional(),
  take:             z.number().optional(),
})

const TraceTableSchema = z.object({
  inputLabel: z.string(),
  columns:    z.array(z.string()),
  rows:       z.array(z.unknown()),
})

const BaseProblemSchema = z.object({
  id:                 z.string().min(1),
  title:              z.string().min(1),
  type:               z.enum([ProblemType.Coding, ProblemType.Mcq, ProblemType.Trick]).optional(),
  category:           z.string().min(1),
  difficulty:         z.enum([Difficulty.Beginner, Difficulty.Easy, Difficulty.Medium, Difficulty.Hard]),
  description:        z.string().optional(),
  patternTag:         z.string().min(1),
  patternExplanation: z.string().min(1),
  estimatedMinutes:   z.number().positive(),
  status:             z.enum([ProblemStatus.Draft, ProblemStatus.Published]).optional(),
  collectionId:       z.string().optional(),
})

export const CreateProblemSchema = BaseProblemSchema.extend({
  functionName:       z.string().optional(),
  whatShouldHappen:   z.array(z.string()).optional(),
  starterCode:        z.string().optional(),
  solution:           z.string().optional(),
  traceTable:         TraceTableSchema.optional(),
  skeletonHint:       z.string().optional(),
  testRunnerWrapper:  z.string().optional(),
  tests:              z.array(TestCaseSchema).optional(),
  options:            z.array(z.string()).optional(),
  correctIndex:       z.number().int().min(0).optional(),
  explanation:        z.string().optional(),
  codeSnippet:        z.string().optional(),
  gotchaExplanation:  z.string().optional(),
})

export const BulkCreateProblemSchema = z.array(CreateProblemSchema).min(1)

export const PatchProblemSchema = BaseProblemSchema.partial().omit({ id: true }).extend({
  functionName:       z.string().optional(),
  whatShouldHappen:   z.array(z.string()).optional(),
  starterCode:        z.string().optional(),
  solution:           z.string().optional(),
  traceTable:         TraceTableSchema.optional(),
  skeletonHint:       z.string().optional(),
  testRunnerWrapper:  z.string().optional(),
  tests:              z.array(TestCaseSchema).optional(),
  options:            z.array(z.string()).optional(),
  correctIndex:       z.number().int().min(0).optional(),
  explanation:        z.string().optional(),
  codeSnippet:        z.string().optional(),
  gotchaExplanation:  z.string().optional(),
})

export type CreateProblemInput = z.infer<typeof CreateProblemSchema>
export type PatchProblemInput  = z.infer<typeof PatchProblemSchema>
