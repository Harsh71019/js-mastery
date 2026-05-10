import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '@/data/categories'
import { TechnicalBreadcrumbs } from '@/components/ui/TechnicalBreadcrumbs'

interface NavbarPageSectionProps {
  readonly categorySlug: string | undefined
  readonly hasProblemsList: boolean
  readonly hasQuiz: boolean
  readonly hasProgress: boolean
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
}: NavbarPageSectionProps): React.JSX.Element => {
  const navigate = useNavigate()

  if (categorySlug !== undefined) {
    return (
      <TechnicalBreadcrumbs
        items={[
          { label: 'SECTORS', path: '/problems' },
          { label: getCategoryTitle(categorySlug), active: true },
        ]}
      />
    )
  }

  const breadcrumbItems = []
  if (hasProblemsList) breadcrumbItems.push({ label: 'SECTORS', active: true })
  if (hasQuiz) breadcrumbItems.push({ label: 'INTELLIGENCE_HUB', active: true })
  if (hasProgress) breadcrumbItems.push({ label: 'TELEMETRY_DASH', active: true })
  if (breadcrumbItems.length === 0) breadcrumbItems.push({ label: 'SYSTEM_MAIN', active: true })

  return (
    <div className="flex items-center gap-6">
      <TechnicalBreadcrumbs items={breadcrumbItems} />
      
      {!hasProblemsList && !hasQuiz && !hasProgress && (
        <div className="flex items-center gap-1">
          {TABS.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-secondary transition-colors duration-150 cursor-pointer font-geist"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
