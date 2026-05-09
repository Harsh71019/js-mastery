import React from 'react'

interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly accentColor: string
}

export const StatCard = ({ label, value, accentColor }: StatCardProps): React.JSX.Element => (
  <div
    className="glass-panel rounded-xl px-5 py-5 flex flex-col gap-2 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
  >
    <div 
      className="absolute left-0 top-0 bottom-0 w-[1px] opacity-60 transition-all duration-500 group-hover:w-1 group-hover:opacity-100"
      style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
    />
    <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-[0.2em] font-geist opacity-60">{label}</span>
    <span className="text-text-primary text-2xl font-bold tracking-tighter font-geist">{value}</span>
    <div 
      className="absolute top-0 right-0 w-20 h-20 blur-3xl rounded-full -mr-10 -mt-10 opacity-[0.03] group-hover:opacity-[0.12] transition-opacity duration-700"
      style={{ backgroundColor: accentColor }}
    />
  </div>
)
