import { format } from 'date-fns'
import * as articleRepo from '../repositories/articleRepository'
import * as progressRepo from '../repositories/progressRepository'
import { NotFoundError } from '../middleware/AppError'
import { selectDailyIndex } from '../utils/daily'
import { getUpdatedReadingStreak } from '../utils/readingStreak'
import { serializeProgress } from '../utils/serializeProgress'

export interface ListArticlesOptions {
  company?: string
  region?: string
  tag?: string
  difficulty?: string
}

export const listArticles = async (options: ListArticlesOptions) => {
  const { company, region, tag, difficulty } = options
  const filter: Record<string, unknown> = {}
  if (company) filter.company = company
  if (region) filter.region = region
  if (tag) filter.tags = tag
  if (difficulty) filter.difficulty = difficulty

  return articleRepo.findPublished(filter)
}

export const getDailyArticle = async () => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const allArticles = await articleRepo.findAllPublishedSortedById()

  if (allArticles.length === 0) {
    throw new NotFoundError('No articles available')
  }

  const index = selectDailyIndex(allArticles.length, new Date())
  const article = allArticles[index]
  if (!article) {
    throw new NotFoundError('No articles available')
  }

  const progress = await progressRepo.findOneLean()
  const readArticles = (progress?.readArticles as string[]) ?? []
  const isRead = readArticles.includes(article.id)

  return {
    article,
    date: today,
    isRead,
  }
}

export const completeArticle = async (id: string) => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const article = await articleRepo.findByIdPublished(id)
  if (!article) {
    throw new NotFoundError('Article not found')
  }

  const progress = await progressRepo.findOrCreate()

  // Avoid duplicates in readArticles
  if (!progress.readArticles.includes(id)) {
    progress.readArticles.push(id)
  }

  // Update reading history
  const alreadyReadToday = progress.readingHistory.some((h) => h.date === today && h.articleId === id)
  if (!alreadyReadToday) {
    progress.readingHistory.push({ articleId: id, date: today })
  }

  // Update streak
  const streakUpdate = getUpdatedReadingStreak(
    {
      readingStreak: progress.readingStreak ?? 0,
      longestReadingStreak: progress.longestReadingStreak ?? 0,
      lastArticleReadAt: progress.lastArticleReadAt,
    },
    today,
  )

  progress.readingStreak = streakUpdate.readingStreak
  progress.longestReadingStreak = streakUpdate.longestReadingStreak
  progress.lastArticleReadAt = streakUpdate.lastArticleReadAt

  await progress.save()
  return serializeProgress(progress)
}

export const toggleBookmarkArticle = async (id: string) => {
  const article = await articleRepo.findByIdPublished(id)
  if (!article) {
    throw new NotFoundError('Article not found')
  }

  const progress = await progressRepo.findOrCreate()
  const bookmarked: string[] = (progress.bookmarkedArticles as string[]) ?? []
  const idx = bookmarked.indexOf(id)

  if (idx > -1) {
    bookmarked.splice(idx, 1)
  } else {
    bookmarked.push(id)
  }

  progress.bookmarkedArticles = bookmarked
  progress.markModified('bookmarkedArticles')

  await progress.save()
  return serializeProgress(progress)
}
