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
    <div className={`flex items-center p-1 bg-bg-tertiary border border-border-default rounded-xl w-fit ${className}`}>
      {options.map((option) => {
        const isActive = option.value === activeValue
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer
              ${isActive 
                ? 'bg-bg-primary text-text-primary shadow-sm border border-border-default' 
                : 'text-text-secondary hover:text-text-primary'
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
