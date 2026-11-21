import React from 'react'
import { BookOpen, ExternalLink, Clock, Bookmark } from 'lucide-react'
import type { Article } from '@/types/article'
import { useProgressStore } from '@/store/useProgressStore'

interface RelatedArticlesProps {
  articles: Article[]
  isLoading: boolean
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, isLoading }) => {
  const bookmarkedArticles = useProgressStore(state => state.bookmarkedArticles || [])
  const toggleBookmarkArticle = useProgressStore(state => state.toggleBookmarkArticle)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-bg-tertiary rounded animate-pulse" />
        <div className="h-12 bg-bg-tertiary rounded animate-pulse" />
      </div>
    )
  }

  if (articles.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] px-1 font-geist flex items-center gap-2">
        <BookOpen size={14} className="text-accent-purple" />
        Engineering Context
      </h2>
      <div className="flex flex-col gap-2">
        {articles.map(article => {
          const isBookmarked = bookmarkedArticles.includes(article.id)
          return (
            <div
              key={article.id}
              className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors group"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 flex-1 min-w-0 mr-3"
              >
                <span className="text-[10px] font-bold text-accent-purple uppercase tracking-tighter">
                  {article.company}
                </span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">
                  {article.title}
                </span>
              </a>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1 text-[10px] text-text-tertiary">
                  <Clock size={10} />
                  <span>{article.estimatedReadingTime}m</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBookmarkArticle(article.id)}
                  className={`p-1 rounded-md border transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'text-accent-purple bg-accent-purple/10 border-accent-purple/30'
                      : 'text-text-tertiary border-transparent hover:text-white hover:bg-white/10'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark size={13} className={isBookmarked ? 'fill-current' : ''} />
                </button>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-text-tertiary hover:text-white"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
