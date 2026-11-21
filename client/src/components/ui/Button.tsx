import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  readonly size?: 'sm' | 'md' | 'lg'
  readonly isLoading?: boolean
}

export const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps): React.JSX.Element => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40 active:scale-[0.98] select-none'
  
  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/90 border border-blue-400/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.35)] hover:shadow-[0_0_22px_-2px_rgba(59,130,246,0.55)]',
    secondary: 'bg-white/[0.04] text-text-primary hover:bg-white/[0.08] hover:text-white border border-white/10 hover:border-white/20 shadow-sm',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent',
    danger: 'bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white border border-accent-red/20 shadow-[0_0_12px_-3px_rgba(239,68,68,0.3)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-geist',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  }

  return (
    <button
      type="button"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
