import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '@/data/categories'

interface NavbarPageSectionProps {
  readonly categorySlug: string | undefined
  readonly hasProblemsList: boolean
  readonly hasProgress: boolean
  readonly total: number
}

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.title ?? slug

export const NavbarPageSection = ({
  categorySlug,
  hasProblemsList,
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

  if (hasProblemsList) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-primary font-medium">Problems</span>
        {total > 0 && (
          <span className="text-text-tertiary text-xs bg-bg-tertiary border border-border-default rounded px-2 py-0.5">
            {total} total
          </span>
        )}
      </div>
    )
  }

  if (hasProgress) {
    return <span className="text-text-primary text-sm font-medium">Progress</span>
  }

  return <span className="text-text-primary text-sm font-medium">Dashboard</span>
}
