import React from 'react'
import type { Difficulty, ProblemType } from '@/types/problem'

const DIFFICULTY_STYLES: Record<Difficulty, { badge: string; dot: string }> = {
  Beginner: { badge: 'text-accent-blue border-accent-blue/30 bg-accent-blue/[0.08] shadow-[0_0_8px_-2px_rgba(59,130,246,0.3)]', dot: 'bg-accent-blue shadow-[0_0_6px_var(--color-accent-blue)]' },
  Easy:     { badge: 'text-accent-green border-accent-green/30 bg-accent-green/[0.08] shadow-[0_0_8px_-2px_rgba(34,197,94,0.3)]', dot: 'bg-accent-green shadow-[0_0_6px_var(--color-accent-green)]' },
  Medium:   { badge: 'text-accent-amber border-accent-amber/30 bg-accent-amber/[0.08] shadow-[0_0_8px_-2px_rgba(245,158,11,0.3)]', dot: 'bg-accent-amber shadow-[0_0_6px_var(--color-accent-amber)]' },
  Hard:     { badge: 'text-accent-red border-accent-red/30 bg-accent-red/[0.08] shadow-[0_0_8px_-2px_rgba(239,68,68,0.3)]', dot: 'bg-accent-red shadow-[0_0_6px_var(--color-accent-red)]' },
}

interface DifficultyBadgeProps {
  readonly difficulty: Difficulty
  readonly className?: string
}

interface CategoryBadgeProps {
  readonly label: string
  readonly color: string
  readonly className?: string
}

interface TypeBadgeProps {
  readonly type: ProblemType
  readonly className?: string
}

export const DifficultyBadge = ({ difficulty, className = '' }: DifficultyBadgeProps): React.JSX.Element => (
  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-geist ${DIFFICULTY_STYLES[difficulty].badge} ${className}`}>
    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${DIFFICULTY_STYLES[difficulty].dot}`} />
    {difficulty}
  </span>
)

export const CategoryBadge = ({ label, color, className = '' }: CategoryBadgeProps): React.JSX.Element => (
  <span
    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-geist ${className}`}
    style={{ borderColor: `${color}40`, backgroundColor: `${color}14`, color }}
  >
    <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
    {label}
  </span>
)

export const TypeBadge = ({ type, className = '' }: TypeBadgeProps): React.JSX.Element | null => {
  if (type === 'coding') return null
  if (type === 'trick') {
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-geist border-accent-amber/30 bg-accent-amber/10 text-accent-amber ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-accent-amber shadow-[0_0_6px_var(--color-accent-amber)]" />
        TRICK
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-geist border-accent-purple/30 bg-accent-purple/10 text-accent-purple ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-accent-purple shadow-[0_0_6px_var(--color-accent-purple)]" />
      MCQ
    </span>
  )
}
