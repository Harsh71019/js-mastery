import React from 'react'

interface CardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly hoverable?: boolean
  readonly onClick?: () => void
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps): React.JSX.Element => {
  const Tag = onClick ? 'button' : 'div'
  
  return (
    <Tag
      onClick={onClick}
      className={`
        glass-panel rounded-xl overflow-hidden relative group/card
        ${onClick ? 'text-left cursor-pointer' : ''}
        ${hoverable || onClick ? 'hover:bg-white/[0.04] hover:shadow-glow transition-all duration-500' : 'transition-all duration-300'}
        ${className}
      `}
    >
      {(hoverable || onClick) && (
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-accent-blue/20 to-transparent" />
      )}
      {children}
    </Tag>
  )
}
