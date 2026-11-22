export type ArticleDifficulty = 'Intro' | 'Intermediate' | 'Advanced'
export type ArticleRegion = 'Global' | 'India'
export type ArticleDomain =
  | 'javascript-v8'
  | 'distributed-systems'
  | 'frontend-performance'
  | 'architecture-design'
  | 'databases-caching'
  | 'reliability-security'

export interface CodeSnippet {
  language: string
  title: string
  code: string
  explanation: string
}

export interface KnowledgeCheckQuestion {
  id?: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface InterviewQuestion {
  question: string
  sampleAnswer: string
}

export interface Article {
  id: string
  title: string
  url: string
  company: string
  region: ArticleRegion
  tags: string[]
  summary: string
  difficulty: ArticleDifficulty
  estimatedReadingTime: number
  status: 'draft' | 'published'
  domain?: ArticleDomain
  content?: string
  takeaways?: string[]
  codeSnippets?: CodeSnippet[]
  knowledgeCheck?: KnowledgeCheckQuestion[]
  interviewQuestions?: InterviewQuestion[]
  createdAt?: string
  updatedAt?: string
}

export interface ArticleQuizQuestionResult {
  questionIndex: number
  question: string
  userAnswer: number
  correctIndex: number
  isCorrect: boolean
  explanation: string
}

export interface ArticleQuizSubmissionResult {
  articleId: string
  score: number
  total: number
  percentage: number
  passed: boolean
  completedAt: string
  results: ArticleQuizQuestionResult[]
}

export interface ArticleStats {
  totalArticles: number
  readCount: number
  bookmarkedCount: number
  notesCount: number
  quizzesTaken: number
  averageQuizScore: number
  readingStreak: number
  longestReadingStreak: number
  byDomain: Record<string, { total: number; read: number }>
}
