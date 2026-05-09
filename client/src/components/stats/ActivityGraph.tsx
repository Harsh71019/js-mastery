import React, { useMemo } from 'react'
import type { ActivityDay } from '@/hooks/useActivityGraph'

interface ActivityGraphProps {
  readonly days: readonly ActivityDay[]
  readonly totalSolvedInWindow: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const CELL = 12
const GAP = 2
const STEP = CELL + GAP

const COLORS = ['#1a1a1a', '#14532d', '#15803d', '#16a34a', '#22c55e'] as const

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
      <p className="text-sm text-text-tertiary py-4">
        No activity yet — solve a problem to see your graph.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="relative h-4" style={{ marginLeft: 32 }}>
            {monthLabels.map(({ label, colIndex }) => (
              <span
                key={`${label}-${colIndex}`}
                className="absolute text-[10px] text-text-tertiary"
                style={{ left: colIndex * STEP }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            <div
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gap: `${GAP}px`,
                width: 28,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center justify-end text-[10px] text-text-tertiary pr-1">
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
                    className="rounded-sm"
                    style={{ backgroundColor: day ? getCellColor(day.count) : 'transparent' }}
                    title={
                      day
                        ? `${day.count} problem${day.count !== 1 ? 's' : ''} solved on ${day.date}`
                        : undefined
                    }
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3" style={{ marginLeft: 32 }}>
        <span className="text-[10px] text-text-tertiary">
          {totalSolvedInWindow} problem{totalSolvedInWindow !== 1 ? 's' : ''} solved in the last year
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] text-text-tertiary">Less</span>
          {COLORS.map((color) => (
            <span
              key={color}
              className="rounded-sm inline-block"
              style={{ width: CELL, height: CELL, backgroundColor: color }}
            />
          ))}
          <span className="text-[10px] text-text-tertiary">More</span>
        </div>
      </div>
    </div>
  )
}
