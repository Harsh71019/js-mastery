import { useArticles } from './useArticles'

export const usePatternArticles = (patternTag: string) => {
  const { articles, isLoading, error } = useArticles({ tag: patternTag })
  return { articles: articles.slice(0, 3), isLoading, error }
}
