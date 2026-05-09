import React from 'react'
import type { Difficulty, ProblemType } from '@/types/problem'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner: 'text-accent-blue border-accent-blue/30 bg-accent-blue/5',
  Easy:     'text-accent-green border-accent-green/30 bg-accent-green/5',
  Medium:   'text-accent-amber border-accent-amber/30 bg-accent-amber/5',
  Hard:     'text-accent-red border-accent-red/30 bg-accent-red/5',
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
  <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-geist ${DIFFICULTY_STYLES[difficulty]} ${className}`}>
    {difficulty}
  </span>
)

export const CategoryBadge = ({ label, color, className = '' }: CategoryBadgeProps): React.JSX.Element => (
  <span
    className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-geist ${className}`}
    style={{ borderColor: `${color}44`, backgroundColor: `${color}11`, color }}
  >
    {label}
  </span>
)

export const TypeBadge = ({ type, className = '' }: TypeBadgeProps): React.JSX.Element | null => {
  if (type === 'coding') return null
  if (type === 'trick') {
    return (
      <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-geist border-accent-amber/30 bg-accent-amber/5 text-accent-amber ${className}`}>
        TRICK
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-geist border-accent-purple/30 bg-accent-purple/5 text-accent-purple ${className}`}>
      MCQ
    </span>
  )
}
