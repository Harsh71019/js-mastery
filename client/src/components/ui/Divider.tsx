import React from 'react'

interface DividerProps {
  readonly className?: string
}

export const Divider = ({ className = '' }: DividerProps): React.JSX.Element => (
  <hr className={`border-none border-t border-border-default h-px bg-border-default ${className}`} />
)
