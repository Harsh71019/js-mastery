import React from 'react'
import {
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Edit3,
  Sparkles,
} from 'lucide-react'
import type { Article } from '@/types/article'
import { useProgressStore } from '@/store/useProgressStore'
import { Card } from '@/components/ui/Card'

interface ArticleCardProps {
  article: Article
  onOpenReader?: (article: Article) => void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onOpenReader }) => {
  const isRead = useProgressStore(state => state.readArticles.includes(article.id))
  const isBookmarked = useProgressStore(state => (state.bookmarkedArticles || []).includes(article.id))
  const userNote = useProgressStore(state => state.articleNotes[article.id])
  const quizScore = useProgressStore(state => state.articleQuizScores[article.id])

  const completeArticle = useProgressStore(state => state.completeArticle)
  const toggleBookmarkArticle = useProgressStore(state => state.toggleBookmarkArticle)

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isRead) {
      completeArticle(article.id)
    }
  }

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmarkArticle(article.id)
  }

  const handleCardClick = () => {
    if (onOpenReader) {
      onOpenReader(article)
    }
  }

  const difficultyColors = {
    Intro: 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
    Intermediate: 'text-accent-amber border-accent-amber/30 bg-accent-amber/10',
    Advanced: 'text-accent-red border-accent-red/30 bg-accent-red/10',
  }

  return (
    <Card
      onClick={handleCardClick}
      className="p-5 flex flex-col h-full border-white/[0.08] hover:border-accent-purple/40 hover:bg-white/[0.02] transition-all duration-300 relative group/art cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider font-geist px-2 py-0.5 rounded bg-accent-purple/10 border border-accent-purple/20">
            {article.company}
          </span>
          {userNote && (
            <span
              className="text-[9px] font-bold font-geist px-1.5 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20 flex items-center gap-1"
              title="Personal notes saved"
            >
              <Edit3 size={10} />
              <span>Notes</span>
            </span>
          )}
          {quizScore && (
            <span
              className="text-[9px] font-bold font-geist px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 flex items-center gap-1"
              title="Knowledge Check Passed"
            >
              <Sparkles size={10} />
              <span>{quizScore.score}/{quizScore.total}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider font-geist ${difficultyColors[article.difficulty]}`}>
            {article.difficulty}
          </span>
          {isRead && (
            <span className="text-accent-green" title="Article Read">
              <CheckCircle2 size={16} />
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-bold text-white mb-2 group-hover/art:text-accent-purple transition-colors line-clamp-2 leading-snug tracking-tight">
        {article.title}
      </h3>

      <p className="text-xs text-text-tertiary line-clamp-3 mb-4 flex-grow leading-relaxed">
        {article.summary}
      </p>

      {/* Key Takeaways Preview if available */}
      {article.takeaways && article.takeaways.length > 0 && (
        <div className="mb-4 p-2.5 rounded-lg bg-accent-purple/[0.03] border border-accent-purple/15 text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
          <span className="text-[9px] font-bold text-accent-purple uppercase tracking-wider block font-geist mb-0.5">
            Key Architecture Takeaway:
          </span>
          {article.takeaways[0]}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] font-geist font-medium text-text-secondary px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-[11px] font-geist text-text-tertiary">
          <div className="flex items-center gap-1">
            <Clock size={12} className="opacity-70" />
            <span>{article.estimatedReadingTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            {article.region === 'Global' ? <Globe size={12} className="opacity-70" /> : <MapPin size={12} className="opacity-70" />}
            <span>{article.region}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isBookmarked
                ? 'text-accent-purple bg-accent-purple/15 border-accent-purple/30 shadow-sm'
                : 'text-text-tertiary border-transparent hover:text-white hover:bg-white/10'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <Bookmark size={15} className={isBookmarked ? 'fill-accent-purple' : ''} />
          </button>

          {!isRead ? (
            <button
              type="button"
              onClick={handleComplete}
              className="text-[10px] font-bold uppercase tracking-wider font-geist text-accent-green hover:underline cursor-pointer px-2.5 py-1 rounded-md bg-accent-green/10 border border-accent-green/20 transition-colors active:scale-95"
            >
              Mark Read
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenReader && onOpenReader(article)}
              className="text-[10px] font-bold uppercase tracking-wider font-geist text-accent-purple hover:underline cursor-pointer px-2 py-1 rounded-md bg-accent-purple/10 border border-accent-purple/20 transition-colors flex items-center gap-1"
            >
              <BookOpen size={11} />
              <span>Read</span>
            </button>
          )}

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            title="Open external original blog"
          >
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </Card>
  )
}
