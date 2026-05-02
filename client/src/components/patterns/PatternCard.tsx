import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PatternSummary } from '@/types/problem'

interface PatternCardProps {
  readonly pattern: PatternSummary
}

export const PatternCard = ({ pattern }: PatternCardProps): React.JSX.Element => (
  <Link
    to={`/patterns/${encodeURIComponent(pattern.tag)}`}
    className="group flex items-center justify-between gap-3 rounded border border-border-default bg-bg-secondary px-4 py-4 hover:border-border-hover transition-colors duration-150"
  >
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-text-primary text-sm font-medium truncate">{pattern.tag}</p>
      <p className="text-text-tertiary text-xs">
        {pattern.count} {pattern.count === 1 ? 'problem' : 'problems'}
      </p>
    </div>
    <ArrowRight
      size={14}
      className="text-text-tertiary group-hover:text-text-primary shrink-0 transition-colors duration-150"
    />
  </Link>
)
