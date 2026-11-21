export type ArticleDifficulty = 'Intro' | 'Intermediate' | 'Advanced'
export type ArticleRegion = 'Global' | 'India'

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
  createdAt: string
  updatedAt: string
}
