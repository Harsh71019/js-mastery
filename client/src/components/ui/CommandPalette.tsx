import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Command, Code2, HelpCircle, RefreshCw, BarChart2, Tag, CalendarDays, LineChart, LayoutDashboard } from 'lucide-react'
import { useProblems } from '@/hooks/useProblems'

interface CommandPaletteProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps): React.JSX.Element | null => {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  
  const { problems } = useProblems({ search: search }, 1)
  
  const staticActions = useMemo(() => [
    { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={14} />, path: '/' },
    { id: 'daily', label: 'Daily Challenge', icon: <CalendarDays size={14} />, path: '/daily' },
    { id: 'prob', label: 'Browse Problems', icon: <Code2 size={14} />, path: '/problems' },
    { id: 'quiz', label: 'Quiz Hub', icon: <HelpCircle size={14} />, path: '/quiz' },
    { id: 'rev', label: 'Review Queue', icon: <RefreshCw size={14} />, path: '/review' },
    { id: 'pat', label: 'Patterns', icon: <Tag size={14} />, path: '/patterns' },
    { id: 'prog', label: 'Progress Metrics', icon: <BarChart2 size={14} />, path: '/progress' },
    { id: 'stats', label: 'System Analytics', icon: <LineChart size={14} />, path: '/stats' },
  ], [])

  const results = useMemo(() => {
    const filteredStatic = staticActions.filter(a => 
      a.label.toLowerCase().includes(search.toLowerCase())
    )
    const problemResults = (problems ?? []).slice(0, 5).map(p => ({
      id: p.id,
      label: p.title,
      icon: <Code2 size={14} className="text-accent-blue" />,
      path: `/problem/${p.id}`,
      subtitle: p.category.replace(/-/g, '_').toUpperCase()
    }))
    return [...filteredStatic, ...problemResults]
  }, [search, problems, staticActions])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleAction = useCallback((path: string) => {
    navigate(path)
    onClose()
    setSearch('')
  }, [navigate, onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) handleAction(results[selectedIndex].path)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, handleAction, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 bg-bg-primary/40 backdrop-blur-[2px]" onClick={onClose}>
      <div 
        className="w-full max-w-xl glass-panel rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4 border-b border-white/5 bg-white/[0.01]">
          <Search size={18} className="text-text-tertiary mr-4 opacity-50" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-geist placeholder:text-text-tertiary"
            placeholder="Search problems, sequences, sectors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 ml-4">
            <Command size={10} className="text-text-tertiary" />
            <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase">K</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
          {results.length === 0 ? (
             <div className="py-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist">No registries found matching search</p>
             </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {results.map((item, idx) => {
                const isActive = idx === selectedIndex
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(item.path)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer
                      ${isActive ? 'bg-white/[0.05] border border-white/10 shadow-inner' : 'border border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-accent-blue/10 text-accent-blue shadow-glow-sm' : 'bg-white/5 text-text-tertiary'}`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-[11px] font-bold font-geist tracking-tight transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                           {item.label.toUpperCase()}
                        </span>
                        {(item as any).subtitle && (
                           <span className="text-[9px] font-bold text-text-tertiary font-geist opacity-60">{(item as any).subtitle}</span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-bold text-accent-blue font-geist uppercase tracking-widest bg-accent-blue/5 px-2 py-0.5 rounded border border-accent-blue/10">Execute</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase border border-white/10 rounded px-1 px-0.5">↑↓</span>
                 <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase tracking-tighter">Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase border border-white/10 rounded px-1 py-0.5">Enter</span>
                 <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase tracking-tighter">Select</span>
              </div>
           </div>
           <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase opacity-40 tracking-widest">Sys_Palette_V2.0</span>
        </div>
      </div>
    </div>
  )
}
