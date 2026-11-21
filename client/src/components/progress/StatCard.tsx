import React from 'react'

interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly accentColor: string
}

export const StatCard = ({ label, value, accentColor }: StatCardProps): React.JSX.Element => (
  <div
    className="glass-panel glass-card-interactive rounded-xl px-5 py-5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
  >
    <div 
      className="absolute left-0 top-0 bottom-0 w-0.5 opacity-70 transition-all duration-300 group-hover:w-1 group-hover:opacity-100"
      style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
    />
    <div className="flex items-center justify-between">
      <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] font-geist opacity-80">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
    </div>
    <span className="text-text-primary text-2xl sm:text-3xl font-bold tracking-tight font-geist">{value}</span>
    <div 
      className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-10 -mt-10 opacity-[0.05] group-hover:opacity-[0.16] transition-opacity duration-500 pointer-events-none"
      style={{ backgroundColor: accentColor }}
    />
  </div>
)
