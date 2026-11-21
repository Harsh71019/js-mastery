import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  BarChart2,
  Flame,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Tag,
  CalendarDays,
  LineChart,
  BookOpen,
  Shield,
  X,
  Search,
} from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { getMasteryRank, MASTERY_RANKS } from '@/utils/ranks'

interface MobileDrawerProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

interface NavItem {
  readonly to: string
  readonly label: string
  readonly description: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         label: 'Dashboard',   description: 'Overview & system clusters',   icon: <LayoutDashboard size={18} /> },
  { to: '/daily',    label: 'Daily',       description: 'Daily challenge objective',     icon: <CalendarDays size={18} /> },
  { to: '/problems', label: 'Problems',    description: 'All 75+ coding algorithms',     icon: <Code2 size={18} /> },
  { to: '/quiz',     label: 'Quiz Hub',    description: 'MCQs & JavaScript trivia',      icon: <HelpCircle size={18} /> },
  { to: '/review',   label: 'Review Queue', description: 'Active recall spaced repetition', icon: <RefreshCw size={18} /> },
  { to: '/patterns', label: 'Patterns',    description: 'Algorithmic loop patterns',     icon: <Tag size={18} /> },
  { to: '/insights', label: 'Insights',    description: 'Real-world tech postmortems',   icon: <BookOpen size={18} /> },
  { to: '/progress', label: 'Progress',    description: 'Heatmaps & solve logs',         icon: <BarChart2 size={18} /> },
  { to: '/stats',    label: 'Analytics',   description: 'Performance telemetry',         icon: <LineChart size={18} /> },
]

export const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps): React.JSX.Element | null => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()
  const rank = getMasteryRank(solvedCount)

  // Rank progress calculation
  const currentRankIndex = MASTERY_RANKS.findIndex((r) => r.level === rank.level)
  const nextRank = currentRankIndex > 0 ? MASTERY_RANKS[currentRankIndex - 1] : null
  const prevThreshold = rank.minSolved
  const nextThreshold = nextRank ? nextRank.minSolved : (rank.minSolved || 1)
  const rankProgress = nextRank
    ? Math.min(100, Math.max(0, Math.round(((solvedCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100)))
    : 100

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const openSearch = () => {
    onClose()
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 md:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative w-[85%] max-w-sm h-full bg-[#070707] border-r border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]" />
            <span className="text-xs font-bold uppercase tracking-wider font-geist text-white">
              Navigation Menu
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary hover:text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
          {/* Clearance Rank Card */}
          <div className="glass-panel rounded-xl p-3.5 flex flex-col gap-2.5 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-15 rounded-full -mr-12 -mt-12 pointer-events-none"
              style={{ backgroundColor: rank.color }}
            />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <Shield size={13} style={{ color: rank.color }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary font-geist">
                  Clearance
                </span>
              </div>
              <span
                className="text-[10px] font-bold font-geist px-1.5 py-0.5 rounded border bg-white/5"
                style={{ color: rank.color, borderColor: `${rank.color}40` }}
              >
                {rank.level}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 relative z-10">
              <span className="text-xs font-bold font-geist tracking-tight text-white uppercase truncate">
                {rank.label.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_currentColor]"
                    style={{ width: `${rankProgress}%`, backgroundColor: rank.color, color: rank.color }}
                  />
                </div>
                <span className="text-[9px] font-bold font-geist text-text-tertiary shrink-0">
                  {nextRank ? `${solvedCount}/${nextRank.minSolved}` : 'MAX'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={openSearch}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-text-secondary hover:text-white transition-all cursor-pointer font-geist text-xs"
          >
            <div className="flex items-center gap-2.5">
              <Search size={14} className="text-accent-blue" />
              <span>Search commands & problems</span>
            </div>
            <kbd className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-text-tertiary uppercase font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 pt-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-geist group select-none ${
                    isActive
                      ? 'bg-accent-blue/10 text-white border border-accent-blue/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-accent-blue' : 'text-text-tertiary group-hover:text-text-secondary'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold tracking-tight uppercase">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-text-tertiary truncate font-normal">
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_6px_var(--color-accent-blue)] shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Telemetry */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-accent-amber/[0.06] border border-accent-amber/20 flex-1">
            <Flame size={14} className="text-accent-amber fill-accent-amber/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-wider text-text-tertiary uppercase font-geist">Streak</span>
              <span className="text-accent-amber text-xs font-bold font-geist">{currentStreak}D</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-accent-green/[0.06] border border-accent-green/20 flex-1">
            <CheckCircle2 size={14} className="text-accent-green" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-wider text-text-tertiary uppercase font-geist">Verified</span>
              <span className="text-accent-green text-xs font-bold font-geist">
                {solvedCount}{total > 0 && <span className="text-text-tertiary">/{total}</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
