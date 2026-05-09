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
    strokeWidth="8"
    strokeDasharray={`${length} ${CIRC}`}
    strokeLinecap="butt"
    style={{ transform: `rotate(${rotate}deg)`, transformOrigin: '50px 50px' }}
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
      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-xl font-bold font-geist text-text-tertiary">—</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-geist">no data</span>
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
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        {clean > 0 && <DonutArc length={cleanLen} color="#22c55e" rotate={-90} />}
        {struggled > 0 && <DonutArc length={struggledLen} color="#f59e0b" rotate={-90 + cleanAngle} />}
        {grinded > 0 && <DonutArc length={grindedLen} color="#ef4444" rotate={-90 + cleanAngle + struggledAngle} />}
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-2xl font-bold font-geist text-accent-green">{cleanPct}%</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-geist">clean</span>
      </div>
    </div>
  )
})
MasteryDonut.displayName = 'MasteryDonut'
