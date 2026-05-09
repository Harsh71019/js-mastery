import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: readonly { value: string; label: string }[]
}

export const Select = ({ options, className = '', ...props }: SelectProps): React.JSX.Element => {
  return (
    <select
      className={`
        bg-bg-tertiary border border-border-default text-text-primary text-sm rounded-lg 
        px-3 py-1.5 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
        transition-all duration-200 cursor-pointer appearance-none pr-8 bg-no-repeat bg-[right_0.5rem_center]
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2352525b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
