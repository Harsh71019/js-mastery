import React from 'react'

interface PageContainerProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export const PageContainer = ({ children, className = '' }: PageContainerProps): React.JSX.Element => (
  <div className={`max-w-[1200px] mx-auto px-6 py-6 ${className}`}>
    {children}
  </div>
)
