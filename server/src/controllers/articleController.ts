import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as articleService from '../services/articleService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'

export const getArticles = catchAsync(async (req: Request, res: Response) => {
  const { company, region, tag, difficulty } = req.query
  const articles = await articleService.listArticles({
    company: company as string | undefined,
    region: region as string | undefined,
    tag: tag as string | undefined,
    difficulty: difficulty as string | undefined,
  })
  res.json(success(articles))
})

export const getDailyArticle = catchAsync(async (_req: Request, res: Response) => {
  const result = await articleService.getDailyArticle()
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
