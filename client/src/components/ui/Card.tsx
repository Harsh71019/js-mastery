import React from 'react'

interface CardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly hoverable?: boolean
  readonly onClick?: () => void
  readonly style?: React.CSSProperties
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  style,
}: CardProps): React.JSX.Element => {
  const Tag = onClick ? 'button' : 'div'
  
  return (
    <Tag
      onClick={onClick}
      style={style}
      className={`
        glass-panel rounded-xl overflow-hidden relative group/card
        ${onClick ? 'text-left cursor-pointer w-full' : ''}
        ${hoverable || onClick ? 'glass-card-interactive hover:border-white/20' : 'transition-all duration-300'}
        ${className}
      `}
    >
      {(hoverable || onClick) && (
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
      )}
      {children}
    </Tag>
  )
}
