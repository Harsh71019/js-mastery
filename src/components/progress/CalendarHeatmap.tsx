import React, { useState } from 'react'
import { format, startOfWeek, addDays, subWeeks, eachWeekOfInterval } from 'date-fns'

interface DayData {
  readonly date: string
  readonly count: number
  readonly titles: readonly string[]
}

interface CalendarHeatmapProps {
  readonly dayData: ReadonlyMap<string, DayData>
}

const CELL_SIZE = 12
const CELL_GAP = 3
const STEP = CELL_SIZE + CELL_GAP
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const WEEKS = 52

const getCellColor = (count: number): string => {
  if (count === 0) return '#1a1a1a'
  if (count === 1) return '#14532d'
  if (count === 2) return '#15803d'
  return '#22c55e'
}

interface TooltipState {
  readonly x: number
  readonly y: number
  readonly date: string
  readonly count: number
  readonly titles: readonly string[]
}

export const CalendarHeatmap = ({ dayData }: CalendarHeatmapProps): React.JSX.Element => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const today = new Date()
  const start = startOfWeek(subWeeks(today, WEEKS - 1), { weekStartsOn: 0 })

  const weeks = eachWeekOfInterval({ start, end: today }, { weekStartsOn: 0 })

  const monthLabels: { label: string; x: number }[] = []
  weeks.forEach((weekStart, weekIndex) => {
    const firstDayOfMonth = addDays(weekStart, 0)
    if (firstDayOfMonth.getDate() <= 7) {
      monthLabels.push({
        label: format(firstDayOfMonth, 'MMM'),
        x: weekIndex * STEP,
      })
    }
  })

  const svgWidth = weeks.length * STEP
  const svgHeight = 7 * STEP
  const MONTH_LABEL_HEIGHT = 16
  const DAY_LABEL_WIDTH = 28

  return (
    <div className="relative overflow-x-auto">
      {tooltip && (
        <div
          className="fixed z-50 bg-bg-secondary border border-border-default rounded px-2.5 py-1.5 text-xs text-text-primary pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="font-medium">{tooltip.date}</p>
          <p className="text-text-secondary">
            {tooltip.count === 0 ? 'No problems' : `${tooltip.count} problem${tooltip.count > 1 ? 's' : ''} solved`}
          </p>
          {tooltip.titles.slice(0, 3).map((title, index) => (
            <p key={index} className="text-text-tertiary truncate max-w-[180px]">• {title}</p>
          ))}
          {tooltip.titles.length > 3 && (
            <p className="text-text-tertiary">+{tooltip.titles.length - 3} more</p>
          )}
        </div>
      )}

      <svg
        width={DAY_LABEL_WIDTH + svgWidth}
        height={MONTH_LABEL_HEIGHT + svgHeight}
        className="block"
      >
        {monthLabels.map(({ label, x }, index) => (
          <text
            key={index}
            x={DAY_LABEL_WIDTH + x}
            y={10}
            className="fill-text-secondary"
            style={{ fill: '#a1a1aa', fontSize: 10 }}
          >
            {label}
          </text>
        ))}

        {DAY_LABELS.map((label, dayIndex) =>
          label ? (
            <text
              key={dayIndex}
              x={0}
              y={MONTH_LABEL_HEIGHT + dayIndex * STEP + CELL_SIZE - 1}
              style={{ fill: '#52525b', fontSize: 9 }}
            >
              {label}
            </text>
          ) : null,
        )}

        {weeks.map((weekStart, weekIndex) =>
          Array.from({ length: 7 }, (_, dayIndex) => {
            const date = addDays(weekStart, dayIndex)
            if (date > today) return null
            const dateStr = format(date, 'yyyy-MM-dd')
            const data = dayData.get(dateStr)
            const count = data?.count ?? 0
            const titles = data?.titles ?? []

            return (
              <rect
                key={dateStr}
                x={DAY_LABEL_WIDTH + weekIndex * STEP}
                y={MONTH_LABEL_HEIGHT + dayIndex * STEP}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                fill={getCellColor(count)}
                className="cursor-pointer"
                onMouseEnter={(event) =>
                  setTooltip({
                    x: event.clientX,
                    y: event.clientY,
                    date: format(date, 'MMM d, yyyy'),
                    count,
                    titles,
                  })
                }
                onMouseMove={(event) =>
                  setTooltip((prev) =>
                    prev ? { ...prev, x: event.clientX, y: event.clientY } : null,
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}
