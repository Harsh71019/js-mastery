import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: readonly { value: string; label: string }[]
}

export const Select = ({ options, className = '', ...props }: SelectProps): React.JSX.Element => {
  return (
    <select
      className={`
        bg-white/[0.04] border border-white/10 text-text-primary text-base sm:text-xs font-geist rounded-lg 
        px-3 py-2 hover:border-white/20 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
        transition-all duration-200 cursor-pointer appearance-none pr-8 bg-no-repeat bg-[right_0.5rem_center]
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#111111] text-white">
          {option.label}
        </option>
      ))}
    </select>
  )
}
