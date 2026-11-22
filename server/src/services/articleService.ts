import { format } from 'date-fns'
import * as articleRepo from '../repositories/articleRepository'
import * as progressRepo from '../repositories/progressRepository'
import { NotFoundError, BadRequestError } from '../middleware/AppError'
import { selectDailyIndex } from '../utils/daily'
import { getUpdatedReadingStreak } from '../utils/readingStreak'
import { serializeProgress } from '../utils/serializeProgress'

export interface ListArticlesOptions {
  company?: string
  region?: string
  tag?: string
  difficulty?: string
  domain?: string
  search?: string
}

export const listArticles = async (options: ListArticlesOptions) => {
  const { company, region, tag, difficulty, domain, search } = options
  const filter: Record<string, unknown> = {}
  if (company) filter.company = company
  if (region) filter.region = region
  if (tag) filter.tags = tag
  if (difficulty) filter.difficulty = difficulty
  if (domain) filter.domain = domain

  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')
    filter.$or = [
      { title: regex },
      { summary: regex },
      { company: regex },
      { tags: regex },
    ]
  }

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

export const getArticleById = async (id: string) => {
  const article = await articleRepo.findByIdPublished(id)
  if (!article) {
    throw new NotFoundError(`Article '${id}' not found`)
  }

  const progress = await progressRepo.findOneLean()
  const readArticles = (progress?.readArticles as string[]) ?? []
  const bookmarkedArticles = (progress?.bookmarkedArticles as string[]) ?? []

  let userNote = ''
  if (progress?.articleNotes) {
    if (progress.articleNotes instanceof Map) {
      userNote = (progress.articleNotes.get(id) as string) ?? ''
    } else {
      userNote = ((progress.articleNotes as Record<string, string>)[id]) ?? ''
    }
  }

  let userQuizScore: { score: number; total: number; completedAt: string } | null = null
  if (progress?.articleQuizScores) {
    if (progress.articleQuizScores instanceof Map) {
      userQuizScore = (progress.articleQuizScores.get(id) as { score: number; total: number; completedAt: string }) ?? null
    } else {
      userQuizScore = ((progress.articleQuizScores as Record<string, { score: number; total: number; completedAt: string }>)[id]) ?? null
    }
  }

  return {
    article,
    isRead: readArticles.includes(article.id),
    isBookmarked: bookmarkedArticles.includes(article.id),
    userNote,
    userQuizScore,
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

export const saveArticleNote = async (id: string, note: string) => {
  const article = await articleRepo.findByIdPublished(id)
  if (!article) {
    throw new NotFoundError('Article not found')
  }

  const progress = await progressRepo.findOrCreate()

  if (!progress.articleNotes) {
    progress.articleNotes = new Map()
  }

  if (progress.articleNotes instanceof Map) {
    progress.articleNotes.set(id, note.trim())
  } else {
    (progress.articleNotes as Record<string, string>)[id] = note.trim()
  }

  progress.markModified('articleNotes')
  await progress.save()

  return {
    articleId: id,
    note: note.trim(),
    savedAt: new Date().toISOString(),
  }
}

export const submitArticleQuiz = async (id: string, answers: number[]) => {
  const article = await articleRepo.findByIdPublished(id)
  if (!article) {
    throw new NotFoundError('Article not found')
  }

  const questions = article.knowledgeCheck || []
  if (questions.length === 0) {
    throw new BadRequestError('This article does not have a knowledge check quiz yet')
  }

  if (answers.length !== questions.length) {
    throw new BadRequestError(`Expected ${questions.length} answers, received ${answers.length}`)
  }

  let score = 0
  const results = questions.map((q, idx) => {
    const userAnswer = answers[idx]
    const isCorrect = userAnswer === q.correctIndex
    if (isCorrect) score++
    return {
      questionIndex: idx,
      question: q.question,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    }
  })

  const total = questions.length
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 50
  const completedAt = new Date().toISOString()
  const today = format(new Date(), 'yyyy-MM-dd')

  const progress = await progressRepo.findOrCreate()

  if (!progress.articleQuizScores) {
    progress.articleQuizScores = new Map()
  }

  if (progress.articleQuizScores instanceof Map) {
    progress.articleQuizScores.set(id, { score, total, completedAt })
  } else {
    (progress.articleQuizScores as Record<string, { score: number; total: number; completedAt: string }>)[id] = {
      score,
      total,
      completedAt,
    }
  }
  progress.markModified('articleQuizScores')

  // Auto-mark article as read and update reading streak if passed!
  if (passed) {
    if (!progress.readArticles.includes(id)) {
      progress.readArticles.push(id)
    }

    const alreadyReadToday = progress.readingHistory.some((h) => h.date === today && h.articleId === id)
    if (!alreadyReadToday) {
      progress.readingHistory.push({ articleId: id, date: today })
    }

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
  }

  await progress.save()

  return {
    articleId: id,
    score,
    total,
    percentage,
    passed,
    completedAt,
    results,
    progress: serializeProgress(progress),
  }
}

export const getArticleStats = async () => {
  const [allArticles, progress] = await Promise.all([
    articleRepo.findAllPublishedSortedById(),
    progressRepo.findOneLean(),
  ])

  const totalArticles = allArticles.length
  const readArticles = (progress?.readArticles as string[]) ?? []
  const bookmarkedArticles = (progress?.bookmarkedArticles as string[]) ?? []

  let notesCount = 0
  if (progress?.articleNotes) {
    if (progress.articleNotes instanceof Map) {
      notesCount = progress.articleNotes.size
    } else {
      notesCount = Object.keys(progress.articleNotes).length
    }
  }

  let quizzesTaken = 0
  let totalScoreSum = 0
  let totalMaxScoreSum = 0

  if (progress?.articleQuizScores) {
    const scores =
      progress.articleQuizScores instanceof Map
        ? Array.from(progress.articleQuizScores.values())
        : Object.values(progress.articleQuizScores)

    quizzesTaken = scores.length
    for (const s of scores as Array<{ score: number; total: number }>) {
      if (s && typeof s.score === 'number' && typeof s.total === 'number' && s.total > 0) {
        totalScoreSum += s.score
        totalMaxScoreSum += s.total
      }
    }
  }

  const averageQuizScore = totalMaxScoreSum > 0 ? Math.round((totalScoreSum / totalMaxScoreSum) * 100) : 0

  const byDomain: Record<string, { total: number; read: number }> = {
    'javascript-v8': { total: 0, read: 0 },
    'distributed-systems': { total: 0, read: 0 },
    'frontend-performance': { total: 0, read: 0 },
    'architecture-design': { total: 0, read: 0 },
    'databases-caching': { total: 0, read: 0 },
    'reliability-security': { total: 0, read: 0 },
  }

  for (const a of allArticles) {
    const d = (a.domain as string) || 'architecture-design'
    if (!byDomain[d]) {
      byDomain[d] = { total: 0, read: 0 }
    }
    byDomain[d].total++
    if (readArticles.includes(a.id)) {
      byDomain[d].read++
    }
  }

  return {
    totalArticles,
    readCount: readArticles.length,
    bookmarkedCount: bookmarkedArticles.length,
    notesCount,
    quizzesTaken,
    averageQuizScore,
    readingStreak: progress?.readingStreak ?? 0,
    longestReadingStreak: progress?.longestReadingStreak ?? 0,
    byDomain,
  }
}
