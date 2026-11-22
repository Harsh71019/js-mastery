import { z } from 'zod'

export const SolveBodySchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  executionTimeMs: z.number().min(0).optional(),
  memoryBytes: z.number().min(0).optional(),
  memoryUsageMb: z.number().min(0).optional(),
  acceptedCode: z.string().optional(),
})

export const AttemptBodySchema = z.object({
  executionTimeMs: z.number().min(0).optional(),
  memoryBytes: z.number().min(0).optional(),
  memoryUsageMb: z.number().min(0).optional(),
})

export const ImportBodySchema = z.object({
  solvedProblems: z.record(z.string(), z.unknown()),
  lastActiveDate: z.string().optional(),
  currentStreak: z.number().int().min(0).optional(),
  longestStreak: z.number().int().min(0).optional(),
  dismissedBackupMilestone: z.number().int().min(0).optional(),
  dailyStreak: z.number().int().min(0).optional(),
  longestDailyStreak: z.number().int().min(0).optional(),
  lastDailySolvedAt: z.string().nullable().optional(),
  completedDailies: z.array(z.string()).optional(),
  readArticles: z.array(z.string()).optional(),
  bookmarkedArticles: z.array(z.string()).optional(),
  readingStreak: z.number().int().min(0).optional(),
  longestReadingStreak: z.number().int().min(0).optional(),
  lastArticleReadAt: z.string().nullable().optional(),
  readingHistory: z
    .array(
      z.object({
        articleId: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .optional(),
})

export type SolveBodyInput = z.infer<typeof SolveBodySchema>
export type AttemptBodyInput = z.infer<typeof AttemptBodySchema>
export type ImportBodyInput = z.infer<typeof ImportBodySchema>
