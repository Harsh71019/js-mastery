import React, { useMemo } from 'react'
import type { ActivityDay } from '@/hooks/useActivityGraph'

interface ActivityGraphProps {
  readonly days: readonly ActivityDay[]
  readonly totalSolvedInWindow: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const CELL = 12
const GAP = 3
const STEP = CELL + GAP

const COLORS = ['rgba(255,255,255,0.03)', '#14532d', '#15803d', '#16a34a', '#22c55e'] as const

const getCellColor = (count: number): string => {
  if (count === 0) return COLORS[0]
  if (count <= 2) return COLORS[1]
  if (count <= 4) return COLORS[2]
  if (count <= 6) return COLORS[3]
  return COLORS[4]
}

interface GridData {
  readonly grid: readonly (ActivityDay | null)[][]
  readonly monthLabels: readonly { label: string; colIndex: number }[]
}

const buildGridData = (days: readonly ActivityDay[]): GridData => {
  if (days.length === 0) return { grid: [], monthLabels: [] }

  const firstDate = new Date(days[0].date + 'T00:00:00Z')
  const startOffset = firstDate.getUTCDay()

  const padded: (ActivityDay | null)[] = [...Array<null>(startOffset).fill(null), ...days]
  const totalCols = Math.ceil(padded.length / 7)

  const grid: (ActivityDay | null)[][] = Array.from({ length: totalCols }, (_, col) =>
    Array.from({ length: 7 }, (_, row) => padded[col * 7 + row] ?? null),
  )

  const seenMonths = new Set<number>()
  const monthLabels: { label: string; colIndex: number }[] = []

  days.forEach((day, dayIndex) => {
    const month = new Date(day.date + 'T00:00:00Z').getUTCMonth()
    if (!seenMonths.has(month)) {
      seenMonths.add(month)
      monthLabels.push({ label: MONTHS[month], colIndex: Math.floor((dayIndex + startOffset) / 7) })
    }
  })

  return { grid, monthLabels }
}

export const ActivityGraph = ({ days, totalSolvedInWindow }: ActivityGraphProps): React.JSX.Element => {
  const { grid, monthLabels } = useMemo(() => buildGridData(days), [days])

  if (grid.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist animate-pulse">
          Initialize activity stream to view matrix...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto scrollbar-none">
        <div className="inline-flex flex-col gap-2">
          <div className="relative h-4" style={{ marginLeft: 36 }}>
            {monthLabels.map(({ label, colIndex }) => (
              <span
                key={`${label}-${colIndex}`}
                className="absolute text-[9px] font-bold uppercase tracking-tighter text-text-tertiary font-geist"
                style={{ left: colIndex * STEP }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gap: `${GAP}px`,
                width: 28,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center justify-end text-[9px] font-bold uppercase tracking-tighter text-text-tertiary pr-2 font-geist">
                  {label}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gridAutoFlow: 'column',
                gridAutoColumns: `${CELL}px`,
                gap: `${GAP}px`,
              }}
            >
              {grid.flatMap((week, wi) =>
                week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className="rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-crosshair"
                    style={{ 
                      backgroundColor: day ? getCellColor(day.count) : 'transparent',
                      boxShadow: day && day.count > 4 ? `0 0 8px ${getCellColor(day.count)}44` : 'none'
                    }}
                    title={
                      day
                        ? `${day.count} nodes verified on ${day.date}`
                        : undefined
                    }
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/5 pt-4" style={{ marginLeft: 36 }}>
        <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase tracking-widest">
          Telemetry: {totalSolvedInWindow} cycles verified in last year
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase tracking-widest">Low</span>
          {COLORS.map((color, i) => (
            <span
              key={i}
              className="rounded-[2px] inline-block"
              style={{ width: 10, height: 10, backgroundColor: color }}
            />
          ))}
          <span className="text-[9px] font-bold text-text-tertiary font-geist uppercase tracking-widest">High</span>
        </div>
      </div>
    </div>
  )
}
