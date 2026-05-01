import React from 'react'
import type { Difficulty } from '@/types/problem'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner: 'bg-accent-blue/15 text-accent-blue',
  Easy: 'bg-accent-green/15 text-accent-green',
  Medium: 'bg-accent-amber/15 text-accent-amber',
  Hard: 'bg-accent-red/15 text-accent-red',
}

interface DifficultyBadgeProps {
  readonly difficulty: Difficulty
}

interface CategoryBadgeProps {
  readonly label: string
  readonly color: string
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps): React.JSX.Element => (
  <span
    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[difficulty]}`}
  >
    {difficulty}
  </span>
)

export const CategoryBadge = ({ label, color }: CategoryBadgeProps): React.JSX.Element => (
  <span
    className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
    style={{ backgroundColor: `${color}26`, color }}
  >
    {label}
  </span>
)
