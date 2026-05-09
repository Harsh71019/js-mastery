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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none focus:ring-2 focus:ring-accent-blue/40'
  
  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/90 border border-transparent',
    secondary: 'bg-bg-tertiary text-text-primary hover:bg-border-default border border-border-default',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent',
    danger: 'bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white border border-accent-red/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
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
