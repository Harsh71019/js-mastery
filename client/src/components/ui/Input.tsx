import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly icon?: React.ReactNode
}

export const Input = ({ icon, className = '', ...props }: InputProps): React.JSX.Element => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          {icon}
        </div>
      )}
      <input
        className={`
          bg-white/[0.04] border border-white/10 text-text-primary text-xs font-geist rounded-lg 
          ${icon ? 'pl-9' : 'px-3'} py-2 
          hover:border-white/20 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
          transition-all duration-200 placeholder:text-text-tertiary
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
