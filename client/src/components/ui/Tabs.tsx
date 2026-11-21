import React from 'react'

interface TabOption {
  readonly value: string
  readonly label: string
}

interface TabsProps {
  readonly options: readonly TabOption[]
  readonly activeValue: string
  readonly onChange: (value: string) => void
  readonly className?: string
}

export const Tabs = ({
  options,
  activeValue,
  onChange,
  className = '',
}: TabsProps): React.JSX.Element => {
  return (
    <div className={`flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-xl w-fit ${className}`}>
      {options.map((option) => {
        const isActive = option.value === activeValue
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-1.5 text-xs font-semibold font-geist uppercase tracking-wider transition-all duration-200 rounded-lg cursor-pointer
              ${isActive 
                ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(59,130,246,0.25)] border border-white/15' 
                : 'text-text-tertiary hover:text-text-secondary border border-transparent'
              }
            `}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
