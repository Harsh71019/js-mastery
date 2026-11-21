import { useState, useEffect } from 'react'
import type { Article } from '@/types/article'

interface UseArticlesFilters {
  company?: string
  region?: string
  tag?: string
  difficulty?: string
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

    setIsLoading(true)
    fetch(`/api/articles?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        setArticles(json.data)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch articles:', err)
        setError('Failed to fetch articles')
        setIsLoading(false)
      })
  }, [filters.company, filters.region, filters.tag, filters.difficulty])

  return { articles, isLoading, error }
}
