import React, { useState, useMemo } from 'react'
import { Flame, Trophy, Info, BookOpen, RotateCcw, Bookmark, Search } from 'lucide-react'
import { useArticles } from '@/hooks/useArticles'
import { ArticleCard } from '@/components/insights/ArticleCard'
import { useProgressStore } from '@/store/useProgressStore'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'
import { Select } from '@/components/ui/Select'

export const InsightsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    company: '',
    region: '',
    difficulty: '',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'all' | 'saved' | 'unread'>('all')

  const { articles, isLoading, error } = useArticles(filters)
  const readingStreak = useProgressStore(state => state.readingStreak)
  const longestReadingStreak = useProgressStore(state => state.longestReadingStreak)
  const readArticles = useProgressStore(state => state.readArticles || [])
  const bookmarkedArticles = useProgressStore(state => state.bookmarkedArticles || [])
  const readArticlesCount = readArticles.length
  const bookmarkedCount = bookmarkedArticles.length

  const dynamicCompanies = useMemo(() => {
    const set = new Set<string>()
    articles.forEach(a => {
      if (a.company) set.add(a.company)
    })
    return Array.from(set).sort()
  }, [articles])

  const regions = ['Global', 'India']
  const difficulties = ['Intro', 'Intermediate', 'Advanced']

  const companyOptions = [
    { value: '', label: 'All Companies' },
    ...dynamicCompanies.map(c => ({ value: c, label: c }))
  ]

  const regionOptions = [
    { value: '', label: 'All Regions' },
    ...regions.map(r => ({ value: r, label: r }))
  ]

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    ...difficulties.map(d => ({ value: d, label: d }))
  ]

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (viewMode === 'saved' && !bookmarkedArticles.includes(article.id)) {
        return false
      }
      if (viewMode === 'unread' && readArticles.includes(article.id)) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = article.title.toLowerCase().includes(q)
        const matchCompany = article.company.toLowerCase().includes(q)
        const matchSummary = article.summary.toLowerCase().includes(q)
        const matchTag = article.tags.some(t => t.toLowerCase().includes(q))
        if (!matchTitle && !matchCompany && !matchSummary && !matchTag) {
          return false
        }
      }
      return true
    })
  }, [articles, viewMode, bookmarkedArticles, readArticles, searchQuery])

  const isFiltered = Boolean(filters.company || filters.region || filters.difficulty || searchQuery || viewMode !== 'all')

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-24">
      <Glow color="var(--color-accent-purple)" size="xl" className="-top-40 -right-20 opacity-[0.06]" />
      <Glow color="var(--color-accent-blue)" size="lg" className="top-1/2 -left-20 opacity-[0.04]" />

      {/* Header Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-geist text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">
              Knowledge Repository
            </span>
          </div>
          <h1 className="text-3xl font-bold font-geist tracking-tight text-white uppercase">
            Engineering Insights & Web Bookmarks
          </h1>
          <p className="text-text-tertiary text-sm max-w-xl leading-relaxed font-medium">
            Curated architectural postmortems, performance breakdowns, JavaScript internals, and system design patterns from world-class engineering teams. Bookmark to read and learn anytime.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
          <div className="glass-panel rounded-xl p-3 px-3.5 sm:px-5 flex items-center gap-2.5 sm:gap-3.5 border-white/10 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple shrink-0">
              <Flame size={17} className="fill-accent-purple/30 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist">Streak</div>
              <div className="text-base sm:text-lg font-bold font-geist text-white">{readingStreak}D</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 px-3.5 sm:px-5 flex items-center gap-2.5 sm:gap-3.5 border-white/10 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center text-accent-amber shrink-0">
              <Trophy size={17} />
            </div>
            <div>
              <div className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist">Read</div>
              <div className="text-base sm:text-lg font-bold font-geist text-white">{readArticlesCount}</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 px-3.5 sm:px-5 flex items-center gap-2.5 sm:gap-3.5 border-white/10 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
              <Bookmark size={17} className={bookmarkedCount > 0 ? "fill-accent-blue/40" : ""} />
            </div>
            <div>
              <div className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist">Saved</div>
              <div className="text-base sm:text-lg font-bold font-geist text-white">{bookmarkedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs & Search Bar */}
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 glass-panel rounded-xl border-white/[0.08] bg-white/[0.02] w-fit">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-accent-purple/20 text-white font-bold border border-accent-purple/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              All Articles ({articles.length})
            </button>
            <button
              onClick={() => setViewMode('saved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'saved'
                  ? 'bg-accent-blue/20 text-white font-bold border border-accent-blue/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              <Bookmark size={13} className={bookmarkedCount > 0 ? "fill-current" : ""} />
              <span>Bookmarked ({bookmarkedCount})</span>
            </button>
            <button
              onClick={() => setViewMode('unread')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer ${
                viewMode === 'unread'
                  ? 'bg-accent-green/20 text-white font-bold border border-accent-green/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              Unread
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, companies..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-geist rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-text-tertiary focus:outline-none focus:border-accent-purple/40"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="glass-panel rounded-xl p-3.5 sm:p-4 flex flex-wrap gap-3 sm:gap-4 items-end border-white/[0.08]">
          <div className="flex flex-col gap-1 flex-1 min-w-[130px] sm:flex-initial">
            <label className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist ml-0.5">Company</label>
            <Select
              value={filters.company}
              onChange={e => setFilters(prev => ({ ...prev, company: e.target.value }))}
              options={companyOptions}
              className="text-xs font-geist bg-white/[0.03] border-white/10 w-full sm:w-40"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[130px] sm:flex-initial">
            <label className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist ml-0.5">Region</label>
            <Select
              value={filters.region}
              onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
              options={regionOptions}
              className="text-xs font-geist bg-white/[0.03] border-white/10 w-full sm:w-36"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[130px] sm:flex-initial">
            <label className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest font-geist ml-0.5">Difficulty</label>
            <Select
              value={filters.difficulty}
              onChange={e => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              options={difficultyOptions}
              className="text-xs font-geist bg-white/[0.03] border-white/10 w-full sm:w-40"
            />
          </div>

          {isFiltered && (
            <button
              onClick={() => {
                setFilters({ company: '', region: '', difficulty: '' })
                setSearchQuery('')
                setViewMode('all')
              }}
              className="mt-5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-geist text-text-tertiary hover:text-white hover:bg-white/5 border border-dashed border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <div className="ml-auto mt-5 text-[11px] font-bold font-geist text-text-tertiary">
            <span className="text-white">{filteredArticles.length}</span> / {articles.length} Showing
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-60 glass-panel rounded-xl border border-dashed border-white/10 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl p-10 text-center backdrop-blur-md">
            <Info className="text-accent-red mx-auto mb-3" size={28} />
            <p className="text-accent-red font-bold font-geist text-sm mb-1">{error}</p>
            <p className="text-text-tertiary text-xs">Failed to load articles from the knowledge repository.</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="glass-panel rounded-xl p-16 text-center flex flex-col items-center gap-3">
            <BookOpen size={32} className="text-text-tertiary opacity-40" />
            <p className="text-text-secondary font-bold font-geist uppercase text-xs tracking-wider">
              {viewMode === 'saved' ? 'No Bookmarked Articles' : 'No matching articles'}
            </p>
            <p className="text-text-tertiary text-xs">
              {viewMode === 'saved'
                ? 'Click the bookmark icon on any article card to save it here for later reading.'
                : 'Try selecting different filter options or adjusting your search'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {longestReadingStreak > 0 && (
        <footer className="text-center pt-8 border-t border-white/5 relative z-10">
          <p className="text-xs text-text-tertiary font-geist">
            Personal Record Reading Streak: <span className="text-accent-purple font-bold">{longestReadingStreak} consecutive days</span>
          </p>
        </footer>
      )}
    </PageContainer>
  )
}
