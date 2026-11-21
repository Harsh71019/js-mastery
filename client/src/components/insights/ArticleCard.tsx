import React from 'react'
import { ExternalLink, CheckCircle2, Clock, Globe, MapPin } from 'lucide-react'
import type { Article } from '@/types/article'
import { useProgressStore } from '@/store/useProgressStore'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const isRead = useProgressStore(state => state.readArticles.includes(article.id))
  const completeArticle = useProgressStore(state => state.completeArticle)

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isRead) {
      completeArticle(article.id)
    }
  }

  const difficultyColors = {
    Intro: 'text-accent-blue bg-accent-blue/10',
    Intermediate: 'text-accent-amber bg-accent-amber/10',
    Advanced: 'text-accent-red bg-accent-red/10',
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-5 hover:border-border-hover transition-colors group relative flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {article.company}
        </span>
        <div className="flex gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyColors[article.difficulty]}`}>
            {article.difficulty}
          </span>
          {isRead && (
            <CheckCircle2 size={16} className="text-accent-green" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-medium text-text-primary mb-2 group-hover:text-accent-blue transition-colors">
        {article.title}
      </h3>

      <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-grow">
        {article.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded border border-border">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{article.estimatedReadingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            {article.region === 'Global' ? <Globe size={12} /> : <MapPin size={12} />}
            <span>{article.region}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {!isRead && (
            <button
              onClick={handleComplete}
              className="text-xs text-accent-green hover:underline flex items-center gap-1"
            >
              Done
            </button>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
