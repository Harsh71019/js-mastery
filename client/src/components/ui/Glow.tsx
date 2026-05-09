import React from 'react'

interface GlowProps {
  readonly color?: string
  readonly size?: 'sm' | 'md' | 'lg' | 'xl'
  readonly opacity?: number
  readonly className?: string
}

export const Glow = ({
  color = 'var(--color-accent-blue)',
  size = 'md',
  opacity = 0.15,
  className = '',
}: GlowProps): React.JSX.Element => {
  const sizes = {
    sm: 'w-32 h-32 blur-2xl',
    md: 'w-64 h-64 blur-3xl',
    lg: 'w-96 h-96 blur-[100px]',
    xl: 'w-[500px] h-[500px] blur-[150px]',
  }

  return (
    <div
      className={`absolute pointer-events-none rounded-full ${sizes[size]} ${className}`}
      style={{
        backgroundColor: color,
        opacity: opacity,
      }}
    />
  )
}
