import React from 'react'

interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly accentColor: string
}

export const StatCard = ({ label, value, accentColor }: StatCardProps): React.JSX.Element => (
  <div
    className="bg-bg-secondary border border-border-default rounded-lg px-5 py-4 flex flex-col gap-1"
    style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
  >
    <span className="text-text-secondary text-xs uppercase tracking-wide">{label}</span>
    <span className="text-text-primary text-2xl font-medium">{value}</span>
  </div>
)
