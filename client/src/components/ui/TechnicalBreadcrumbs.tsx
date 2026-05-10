import React from 'react'
import { useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  readonly label: string
  readonly path?: string
  readonly active?: boolean
}

interface TechnicalBreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[]
  readonly className?: string
}

export const TechnicalBreadcrumbs = ({ items, className = '' }: TechnicalBreadcrumbsProps): React.JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className={`flex items-center gap-2 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-text-tertiary text-[10px] font-bold font-geist">ROOT_DB</span>
        <span className="text-white/10 text-xs">/</span>
      </div>
      
      <div className="flex items-center gap-2 min-w-0">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.path && !item.active ? (
              <button
                onClick={() => navigate(item.path!)}
                className="text-text-secondary text-[11px] font-bold font-geist hover:text-accent-blue transition-colors duration-200 cursor-pointer uppercase tracking-tight whitespace-nowrap"
              >
                {item.label.replace(/-/g, '_')}
              </button>
            ) : (
              <span className={`text-[11px] font-bold font-geist uppercase tracking-tight whitespace-nowrap ${item.active ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {item.label.replace(/-/g, '_')}
              </span>
            )}
            {idx < items.length - 1 && (
              <span className="text-white/10 text-xs">/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
