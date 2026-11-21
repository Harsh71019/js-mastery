import React, { useState, useEffect } from 'react'
import { BookOpen, ArrowRight, CheckCircle2, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Article } from '@/types/article'
import { Card } from '@/components/ui/Card'
import { useProgressStore } from '@/store/useProgressStore'

export const DailyInsightWidget: React.FC = () => {
  const navigate = useNavigate()
  const [daily, setDaily] = useState<{ article: Article; isRead: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const readingStreak = useProgressStore(state => state.readingStreak)

  useEffect(() => {
    fetch('/api/articles/daily')
      .then(res => res.json())
      .then(json => {
        setDaily(json.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading || !daily) return null

  return (
    <Card 
      onClick={() => navigate('/insights')}
      className="p-4 bg-accent-purple/5 border-accent-purple/20 hover:border-accent-purple/40 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-accent-purple" />
          <span className="text-[10px] font-bold text-accent-purple uppercase tracking-widest font-geist">Daily Engineering Insight</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame size={12} className="text-accent-purple" />
          <span className="text-[10px] font-bold text-text-secondary font-geist">{readingStreak}D STREAK</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-purple transition-colors truncate">
            {daily.article.title}
          </h3>
          <p className="text-[11px] text-text-tertiary font-medium truncate">
            {daily.article.company} · {daily.article.estimatedReadingTime} min read
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {daily.isRead ? (
            <CheckCircle2 size={18} className="text-accent-green" />
          ) : (
            <div className="w-8 h-8 rounded-full border border-accent-purple/20 flex items-center justify-center text-accent-purple group-hover:bg-accent-purple group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
