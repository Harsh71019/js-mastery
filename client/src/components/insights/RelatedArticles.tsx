import React from 'react'
import { BookOpen, ExternalLink, Clock } from 'lucide-react'
import type { Article } from '@/types/article'

interface RelatedArticlesProps {
  articles: Article[]
  isLoading: boolean
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, isLoading }) => {
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
        {articles.map(article => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-accent-purple uppercase tracking-tighter">
                {article.company}
              </span>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">
                {article.title}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
               <div className="flex items-center gap-1 text-[10px] text-text-tertiary">
                  <Clock size={10} />
                  <span>{article.estimatedReadingTime}m</span>
               </div>
               <ExternalLink size={14} className="text-text-tertiary group-hover:text-white" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
