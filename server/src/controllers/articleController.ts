import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as articleService from '../services/articleService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'
import {
  ArticleQuerySchema,
  ArticleNoteSchema,
  ArticleQuizSubmissionSchema,
} from '../types/schemas/articleSchemas'

export const getArticles = catchAsync(async (req: Request, res: Response) => {
  const parsed = ArticleQuerySchema.parse(req.query)
  const articles = await articleService.listArticles({
    company: parsed.company,
    region: parsed.region,
    tag: parsed.tag,
    difficulty: parsed.difficulty,
    domain: parsed.domain,
    search: parsed.search,
  })
  res.json(success(articles))
})

export const getArticleStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await articleService.getArticleStats()
  res.json(success(stats))
})

export const getDailyArticle = catchAsync(async (_req: Request, res: Response) => {
  const result = await articleService.getDailyArticle()
  res.json(success(result))
})

export const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const id = param(req, 'id')
  const result = await articleService.getArticleById(id)
  res.json(success(result))
})

export const completeArticle = catchAsync(async (req: Request, res: Response) => {
  const id = param(req, 'id')
  const result = await articleService.completeArticle(id)
  res.json(success(result))
})

export const toggleBookmarkArticle = catchAsync(async (req: Request, res: Response) => {
  const id = param(req, 'id')
  const result = await articleService.toggleBookmarkArticle(id)
  res.json(success(result))
})

export const saveArticleNote = catchAsync(async (req: Request, res: Response) => {
  const id = param(req, 'id')
  const { note } = ArticleNoteSchema.parse(req.body)
  const result = await articleService.saveArticleNote(id, note)
  res.json(success(result))
})

export const submitArticleQuiz = catchAsync(async (req: Request, res: Response) => {
  const id = param(req, 'id')
  const { answers } = ArticleQuizSubmissionSchema.parse(req.body)
  const result = await articleService.submitArticleQuiz(id, answers)
  res.json(success(result))
})
