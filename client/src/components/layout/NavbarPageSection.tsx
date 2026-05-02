import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '@/data/categories'

interface NavbarPageSectionProps {
  readonly categorySlug: string | undefined
  readonly hasProblemsList: boolean
  readonly hasQuiz: boolean
  readonly hasProgress: boolean
  readonly total: number
}

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.title ?? slug

const TABS = [
  { label: 'Problems', path: '/problems' },
  { label: 'Quiz',     path: '/quiz' },
  { label: 'Progress', path: '/progress' },
] as const

export const NavbarPageSection = ({
  categorySlug,
  hasProblemsList,
  hasQuiz,
  hasProgress,
  total,
}: NavbarPageSectionProps): React.JSX.Element => {
  const navigate = useNavigate()

  if (categorySlug !== undefined) {
    return (
      <div className="flex items-center gap-1 text-sm">
        <button
          type="button"
          onClick={() => navigate('/problems')}
          className="text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer"
        >
          Problems
        </button>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary">{getCategoryTitle(categorySlug)}</span>
      </div>
    )
  }

  const activeMap: Record<string, boolean> = {
    '/problems': hasProblemsList,
    '/quiz':     hasQuiz,
    '/progress': hasProgress,
  }

  return (
    <div className="flex items-center gap-1">
      {TABS.map(({ label, path }) => {
        const isActive = activeMap[path] ?? false
        return (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className={`px-3 py-1 text-sm rounded transition-colors duration-150 cursor-pointer ${
              isActive
                ? 'text-text-primary font-medium bg-bg-tertiary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
            {isActive && path === '/problems' && total > 0 && (
              <span className="ml-2 text-text-tertiary text-xs font-normal">{total}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
