import React from 'react'

export type AccentColor = 'green' | 'blue' | 'amber' | 'purple' | 'red'

interface SectionHeaderProps {
  readonly icon:   React.ReactNode
  readonly title:  string
  readonly accent: AccentColor
  readonly meta?:  React.ReactNode
}

const ACCENT: Record<AccentColor, { bg: string; border: string; text: string }> = {
  green:  { bg: 'bg-accent-green/5',  border: 'border-accent-green/20',  text: 'text-accent-green'  },
  blue:   { bg: 'bg-accent-blue/5',   border: 'border-accent-blue/20',   text: 'text-accent-blue'   },
  amber:  { bg: 'bg-accent-amber/5',  border: 'border-accent-amber/20',  text: 'text-accent-amber'  },
  purple: { bg: 'bg-accent-purple/5', border: 'border-accent-purple/20', text: 'text-accent-purple' },
  red:    { bg: 'bg-accent-red/5',    border: 'border-accent-red/20',    text: 'text-accent-red'    },
}

export const SectionHeader = ({ icon, title, accent, meta }: SectionHeaderProps): React.JSX.Element => {
  const a = ACCENT[accent]
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${a.bg} ${a.border} ${a.text}`}>
          {icon}
        </div>
        <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">{title}</h2>
      </div>
      {typeof meta === 'string'
        ? <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist tracking-tighter">{meta}</span>
        : meta
      }
    </div>
  )
}
