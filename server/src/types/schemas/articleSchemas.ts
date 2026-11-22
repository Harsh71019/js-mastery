import { z } from 'zod'

export const ArticleDomainSchema = z.enum([
  'javascript-v8',
  'distributed-systems',
  'frontend-performance',
  'architecture-design',
  'databases-caching',
  'reliability-security',
])

export const ArticleQuerySchema = z.object({
  company: z.string().optional(),
  region: z.enum(['Global', 'India']).optional(),
  tag: z.string().optional(),
  difficulty: z.enum(['Intro', 'Intermediate', 'Advanced']).optional(),
  domain: ArticleDomainSchema.optional(),
  search: z.string().optional(),
})

export const ArticleNoteSchema = z.object({
  note: z.string().max(20000, 'Note must not exceed 20,000 characters'),
})

export const ArticleQuizSubmissionSchema = z.object({
  answers: z.array(z.number().int().min(0)).min(1, 'At least one answer must be submitted'),
})

export type ArticleDomain = z.infer<typeof ArticleDomainSchema>
export type ArticleQueryInput = z.infer<typeof ArticleQuerySchema>
export type ArticleNoteInput = z.infer<typeof ArticleNoteSchema>
export type ArticleQuizSubmissionInput = z.infer<typeof ArticleQuizSubmissionSchema>
