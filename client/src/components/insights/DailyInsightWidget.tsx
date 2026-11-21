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
      className="p-4 sm:p-6 bg-accent-purple/[0.03] border-white/10 hover:border-accent-purple/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/10 blur-[50px] rounded-full -mr-20 -mt-20 pointer-events-none" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent-purple/10 flex items-center justify-center text-accent-purple">
            <BookOpen size={14} />
          </div>
          <span className="text-[10px] font-bold text-accent-purple uppercase tracking-widest font-geist">Daily Engineering Insight</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-purple/[0.08] border border-accent-purple/20">
          <Flame size={12} className="text-accent-purple fill-accent-purple/30" />
          <span className="text-[10px] font-bold text-accent-purple font-geist">{readingStreak}D STREAK</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider font-geist px-1.5 py-0.5 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
              {daily.article.company}
            </span>
            <span className="text-text-tertiary text-[10px] font-bold font-geist">
              {daily.article.estimatedReadingTime} min read
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight font-geist truncate group-hover:text-accent-purple transition-colors">
            {daily.article.title}
          </h3>
        </div>

        <div className="shrink-0 flex items-center">
          {daily.isRead ? (
            <div className="flex items-center gap-2 text-accent-green bg-accent-green/[0.08] px-3.5 py-1.5 rounded-lg border border-accent-green/20 font-geist">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Read</span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg border border-accent-purple/30 bg-accent-purple/10 flex items-center justify-center text-accent-purple group-hover:bg-accent-purple group-hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <ArrowRight size={15} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
