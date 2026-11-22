import { z } from 'zod'

export const ArticleQuerySchema = z.object({
  company: z.string().optional(),
  region: z.enum(['Global', 'India']).optional(),
  tag: z.string().optional(),
  difficulty: z.enum(['Intro', 'Intermediate', 'Advanced']).optional(),
})

export type ArticleQueryInput = z.infer<typeof ArticleQuerySchema>
