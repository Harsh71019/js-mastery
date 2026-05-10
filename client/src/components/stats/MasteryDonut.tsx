import React, { memo } from 'react'

const RADIUS = 38
const CIRC = 2 * Math.PI * RADIUS

interface ArcProps {
  readonly length: number
  readonly color:  string
  readonly rotate: number
}

const DonutArc = memo(({ length, color, rotate }: ArcProps): React.JSX.Element => (
  <circle
    cx="50" cy="50" r={RADIUS}
    fill="none"
    stroke={color}
    strokeWidth="6"
    strokeDasharray={`${length} ${CIRC}`}
    strokeLinecap="butt"
    style={{ 
      transform: `rotate(${rotate}deg)`, 
      transformOrigin: '50px 50px',
      transition: 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  />
))
DonutArc.displayName = 'DonutArc'

interface Props {
  readonly clean:     number
  readonly struggled: number
  readonly grinded:   number
  readonly total:     number
}

export const MasteryDonut = memo(({ clean, struggled, grinded, total }: Props): React.JSX.Element => {
  if (total === 0) {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-xl font-bold font-geist text-text-tertiary opacity-30">—</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60 text-center px-4 leading-tight">BUFFER_EMPTY</span>
        </div>
      </div>
    )
  }

  const cleanPct       = Math.round((clean / total) * 100)
  const cleanAngle     = (clean / total) * 360
  const struggledAngle = (struggled / total) * 360
  const cleanLen       = (clean / total) * CIRC
  const struggledLen   = (struggled / total) * CIRC
  const grindedLen     = (grinded / total) * CIRC

  return (
    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
        {clean > 0 && <DonutArc length={cleanLen} color="var(--color-accent-green)" rotate={-90} />}
        {struggled > 0 && <DonutArc length={struggledLen} color="var(--color-accent-amber)" rotate={-90 + cleanAngle} />}
        {grinded > 0 && <DonutArc length={grindedLen} color="var(--color-accent-red)" rotate={-90 + cleanAngle + struggledAngle} />}
      </svg>
      <div className="flex flex-col items-center z-10 relative">
        <div className="absolute inset-0 blur-xl opacity-20 rounded-full" style={{ backgroundColor: 'var(--color-accent-green)' }} />
        <span className="text-3xl font-bold font-geist text-text-primary tracking-tighter relative z-10">{cleanPct}%</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary font-geist opacity-60 relative z-10">CLEAN</span>
      </div>
    </div>
  )
})
MasteryDonut.displayName = 'MasteryDonut'
