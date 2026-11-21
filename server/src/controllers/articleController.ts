import { type Request, type Response } from 'express'
import { Article } from '../models/Article'
import { Progress } from '../models/Progress'
import { catchAsync } from '../middleware/catchAsync'
import { NotFoundError, BadRequestError } from '../middleware/AppError'
import { getUpdatedReadingStreak } from '../utils/readingStreak'
import { serializeProgress } from '../utils/serializeProgress'
import { selectDailyIndex } from '../utils/daily'
import { format } from 'date-fns'
import { success } from '../utils/apiResponse'

export const getArticles = catchAsync(async (req: Request, res: Response) => {
  const { company, region, tag, difficulty } = req.query

  const query: any = { status: 'published' }
  if (company) query.company = company
  if (region) query.region = region
  if (tag) query.tags = tag
  if (difficulty) query.difficulty = difficulty

  const articles = await Article.find(query).sort({ createdAt: -1 })

  res.json(success(articles))
})

export const getDailyArticle = catchAsync(async (_req: Request, res: Response) => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const allArticles = await Article.find({ status: 'published' }).sort({ id: 1 })
  if (allArticles.length === 0) {
    throw new NotFoundError('No articles available')
  }

  const index = selectDailyIndex(allArticles.length, new Date())
  const article = allArticles[index]
  if (!article) {
    throw new NotFoundError('No articles available')
  }

  const progress = await Progress.findOne({ userId: 'default' })
  const isRead = progress?.readArticles.includes(article.id) || false

  res.json(success({
    article,
    date: today,
    isRead,
  }))
})

export const completeArticle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) {
    throw new BadRequestError('Article ID is required')
  }
  const today = format(new Date(), 'yyyy-MM-dd')

  const article = await Article.findOne({ id, status: 'published' })
  if (!article) {
    throw new NotFoundError('Article not found')
  }

  let progress = await Progress.findOne({ userId: 'default' })
  if (!progress) {
    progress = new Progress({ userId: 'default' })
  }

  // Avoid duplicates in readArticles
  if (!progress.readArticles.includes(id)) {
    progress.readArticles.push(id)
  }

  // Update reading history
  const alreadyReadToday = progress.readingHistory.some(h => h.date === today && h.articleId === id)
  if (!alreadyReadToday) {
    progress.readingHistory.push({ articleId: id, date: today })
  }

  // Update streak
  const streakUpdate = getUpdatedReadingStreak(
    {
      readingStreak: progress.readingStreak,
      longestReadingStreak: progress.longestReadingStreak,
      lastArticleReadAt: progress.lastArticleReadAt,
    },
    today
  )

  progress.readingStreak = streakUpdate.readingStreak
  progress.longestReadingStreak = streakUpdate.longestReadingStreak
  progress.lastArticleReadAt = streakUpdate.lastArticleReadAt

  await progress.save()

  res.json(success(serializeProgress(progress as any)))
})
