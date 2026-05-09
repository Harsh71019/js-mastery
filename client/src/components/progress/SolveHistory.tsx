import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { CATEGORIES } from '@/data'
import { DifficultyBadge, CategoryBadge } from '@/components/ui/Badge'
import type { SolvedEntry } from '@/store/useProgressStore'

interface SolveHistoryProps {
  readonly solvedProblems: Record<string, SolvedEntry>
}

interface GroupedEntry {
  readonly problemId: string
  readonly solvedAt: string
  readonly title: string
  readonly category: string
  readonly difficulty: SolvedEntry['difficulty']
}

const getCategoryColor = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.accentColor ?? '#a1a1aa'

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.title ?? slug

export const SolveHistory = ({ solvedProblems = {} }: SolveHistoryProps): React.JSX.Element => {
  const navigate = useNavigate()

  const entries = Object.entries(solvedProblems || {})
    .filter(([, entry]) => entry.solvedAt)
    .sort((a, b) => new Date(b[1].solvedAt).getTime() - new Date(a[1].solvedAt).getTime())
    .map(([id, entry]): GroupedEntry => ({
      problemId: id,
      solvedAt: entry.solvedAt,
      title: entry.title ?? id,
      category: entry.category ?? id.replace(/-\d+$/, ''),
      difficulty: entry.difficulty,
    }))

  const grouped = entries.reduce<Record<string, GroupedEntry[]>>((accumulator, entry) => {
    const dateKey = format(new Date(entry.solvedAt), 'yyyy-MM-dd')
    if (!accumulator[dateKey]) accumulator[dateKey] = []
    accumulator[dateKey].push(entry)
    return accumulator
  }, {})

  if (entries.length === 0) {
    return (
      <p className="text-text-tertiary text-sm py-8 text-center">
        No problems solved yet. Start with a problem from the Dashboard!
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      {Object.entries(grouped).map(([dateKey, dayEntries]) => (
        <div key={dateKey}>
          <div className="flex items-center gap-3 py-3">
            <span className="text-text-secondary text-xs">
              {format(new Date(dateKey), 'MMM d, yyyy')}
            </span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          {dayEntries.map((entry) => (
            <div
              key={entry.problemId}
              onClick={() => navigate(`/problem/${entry.problemId}`)}
              className="flex items-center gap-3 py-2.5 px-2 rounded hover:bg-bg-tertiary transition-colors duration-150 cursor-pointer"
            >
              <span className="text-text-primary text-sm flex-1 truncate">{entry.title}</span>
              <div className="flex items-center gap-2 shrink-0">
                <CategoryBadge
                  label={getCategoryTitle(entry.category)}
                  color={getCategoryColor(entry.category)}
                />
                {entry.difficulty && <DifficultyBadge difficulty={entry.difficulty} />}
              </div>
              <span className="text-text-tertiary text-xs shrink-0 w-14 text-right">
                {format(new Date(entry.solvedAt), 'h:mm a')}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
