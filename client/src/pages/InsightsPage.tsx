import React, { useState } from 'react'
import { Flame, Trophy, Info } from 'lucide-react'
import { useArticles } from '@/hooks/useArticles'
import { ArticleCard } from '@/components/insights/ArticleCard'
import { useProgressStore } from '@/store/useProgressStore'

export const InsightsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    company: '',
    region: '',
    difficulty: '',
  })

  const { articles, isLoading, error } = useArticles(filters)
  const readingStreak = useProgressStore(state => state.readingStreak)
  const longestReadingStreak = useProgressStore(state => state.longestReadingStreak)
  const readArticlesCount = useProgressStore(state => state.readArticles.length)

  const companies = ['Stripe', 'Swiggy', 'Zomato', 'Google', 'X', 'Netflix', 'Meta']
  const regions = ['Global', 'India']
  const difficulties = ['Intro', 'Intermediate', 'Advanced']

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Engineering Insights</h1>
          <p className="text-text-secondary">
            Curated articles from world-class engineering teams.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-bg-secondary border border-border rounded-lg p-3 px-5 flex items-center gap-3">
            <Flame className="text-accent-purple" size={20} />
            <div>
              <div className="text-[10px] text-text-tertiary uppercase font-medium">Reading Streak</div>
              <div className="text-xl font-bold text-white">{readingStreak} days</div>
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-lg p-3 px-5 flex items-center gap-3">
            <Trophy className="text-accent-amber" size={20} />
            <div>
              <div className="text-[10px] text-text-tertiary uppercase font-medium">Total Read</div>
              <div className="text-xl font-bold text-white">{readArticlesCount}</div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-bg-secondary border border-border rounded-lg p-4 flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-tertiary uppercase font-bold ml-1">Company</label>
          <select
            value={filters.company}
            onChange={e => setFilters(prev => ({ ...prev, company: e.target.value }))}
            className="bg-bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue"
          >
            <option value="">All Companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-tertiary uppercase font-bold ml-1">Region</label>
          <select
            value={filters.region}
            onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="bg-bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue"
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-tertiary uppercase font-bold ml-1">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={e => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="bg-bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {(filters.company || filters.region || filters.difficulty) && (
          <button
            onClick={() => setFilters({ company: '', region: '', difficulty: '' })}
            className="mt-4 text-xs text-text-tertiary hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        )}
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-bg-secondary border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-8 text-center">
          <Info className="text-accent-red mx-auto mb-3" size={32} />
          <p className="text-text-primary font-medium">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary">No articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {longestReadingStreak > 0 && (
        <footer className="text-center pt-8 border-t border-border/50">
          <p className="text-xs text-text-tertiary italic">
            Your all-time best reading streak is <span className="text-text-secondary font-medium">{longestReadingStreak} days</span>.
            Keep it up!
          </p>
        </footer>
      )}
    </div>
  )
}
