import { useState, useEffect } from 'react'
import type { Article, ArticleDomain } from '@/types/article'

export interface UseArticlesFilters {
  company?: string
  region?: string
  tag?: string
  difficulty?: string
  domain?: ArticleDomain | ''
  search?: string
}

export const useArticles = (filters: UseArticlesFilters = {}) => {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.company) params.append('company', filters.company)
    if (filters.region) params.append('region', filters.region)
    if (filters.tag) params.append('tag', filters.tag)
    if (filters.difficulty) params.append('difficulty', filters.difficulty)
    if (filters.domain) params.append('domain', filters.domain)
    if (filters.search) params.append('search', filters.search)

    fetch(`/api/articles?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data)
        } else {
          setArticles([])
        }
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch articles:', err)
        setError('Failed to fetch articles')
        setIsLoading(false)
      })
  }, [filters.company, filters.region, filters.tag, filters.difficulty, filters.domain, filters.search])

  return { articles, isLoading, error }
}

export interface ArticleDetailData {
  article: Article
  isRead: boolean
  isBookmarked: boolean
  userNote: string
  userQuizScore: { score: number; total: number; completedAt: string } | null
}

export const useArticleDetail = (id: string | null) => {
  const [data, setData] = useState<ArticleDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setData(json.data)
        } else {
          setError(json.error || 'Failed to fetch article')
        }
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        console.error(`Failed to fetch article ${id}:`, err)
        setError('Failed to load article detail')
        setIsLoading(false)
      })
  }, [id])

  return { data, isLoading, error, refetch: () => id && useArticleDetail(id) }
}
