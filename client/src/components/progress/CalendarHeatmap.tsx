import React, { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
  isFuture,
  startOfDay,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DayData {
  readonly date: string
  readonly count: number
  readonly titles: readonly string[]
}

interface CalendarHeatmapProps {
  readonly dayData: ReadonlyMap<string, DayData>
}

interface TooltipState {
  readonly x: number
  readonly y: number
  readonly date: string
  readonly count: number
  readonly titles: readonly string[]
}

const CELL = 12
const GAP = 3
const STEP = CELL + GAP
const DAY_LABEL_W = 24
const HEADER_H = 14
const COL_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const getCellColor = (count: number): string => {
  if (count === 0) return '#1a1a1a'
  if (count === 1) return '#14532d'
  if (count === 2) return '#15803d'
  return '#22c55e'
}

const getAvailableMonths = (): Date[] => {
  const months: Date[] = []
  const today = new Date()
  for (let i = 11; i >= 0; i--) months.push(startOfMonth(subMonths(today, i)))
  return months
}

export const CalendarHeatmap = ({ dayData }: CalendarHeatmapProps): React.JSX.Element => {
  const availableMonths = getAvailableMonths()
  const [selectedMonth, setSelectedMonth] = useState<Date>(availableMonths[availableMonths.length - 1])
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const canGoPrev = selectedMonth > availableMonths[0]
  const canGoNext = !isFuture(startOfDay(addMonths(selectedMonth, 1)))

  const days = eachDayOfInterval({ start: startOfMonth(selectedMonth), end: endOfMonth(selectedMonth) })
  const firstOffset = getDay(days[0])
  const totalRows = Math.ceil((firstOffset + days.length) / 7)

  const svgW = DAY_LABEL_W + 7 * STEP - GAP
  const svgH = HEADER_H + totalRows * STEP - GAP

  const monthSolveCount = days.reduce((sum, day) => {
    return sum + (dayData?.get(format(day, 'yyyy-MM-dd'))?.count ?? 0)
  }, 0)

  return (
    <div className="relative">
      {tooltip && (
        <div
          className="fixed z-50 bg-bg-secondary border border-border-default rounded px-2.5 py-1.5 text-xs text-text-primary pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="font-medium mb-0.5">{tooltip.date}</p>
          <p className="text-text-secondary">
            {tooltip.count === 0 ? 'No problems solved' : `${tooltip.count} problem${tooltip.count > 1 ? 's' : ''} solved`}
          </p>
          {tooltip.titles.slice(0, 3).map((title, i) => (
            <p key={i} className="text-text-tertiary truncate max-w-[200px] mt-0.5">• {title}</p>
          ))}
          {tooltip.titles.length > 3 && (
            <p className="text-text-tertiary mt-0.5">+{tooltip.titles.length - 3} more</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => canGoPrev && setSelectedMonth(startOfMonth(subMonths(selectedMonth, 1)))}
            disabled={!canGoPrev}
            className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <select
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={(e) => {
              const found = availableMonths.find((m) => format(m, 'yyyy-MM') === e.target.value)
              if (found) setSelectedMonth(found)
            }}
            className="bg-transparent text-text-primary text-xs focus:outline-none cursor-pointer"
          >
            {availableMonths.map((m) => (
              <option key={format(m, 'yyyy-MM')} value={format(m, 'yyyy-MM')} className="bg-bg-secondary">
                {format(m, 'MMMM yyyy')}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => canGoNext && setSelectedMonth(startOfMonth(addMonths(selectedMonth, 1)))}
            disabled={!canGoNext}
            className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <span className="text-text-tertiary text-xs">
          {monthSolveCount > 0 ? `${monthSolveCount} solved` : 'None solved'}
        </span>
      </div>

      <svg width={svgW} height={svgH} className="block">
        {COL_HEADERS.map((label, col) => (
          <text
            key={col}
            x={DAY_LABEL_W + col * STEP + CELL / 2}
            y={10}
            textAnchor="middle"
            style={{ fill: '#52525b', fontSize: 9 }}
          >
            {label}
          </text>
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const col = getDay(day)
          const row = Math.floor((firstOffset + day.getDate() - 1) / 7)
          const data = dayData?.get(dateStr)
          const count = data?.count ?? 0
          const titles = data?.titles ?? []

          return (
            <rect
              key={dateStr}
              x={DAY_LABEL_W + col * STEP}
              y={HEADER_H + row * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              fill={getCellColor(count)}
              className="cursor-pointer"
              onMouseEnter={(e) =>
                setTooltip({ x: e.clientX, y: e.clientY, date: format(day, 'MMM d, yyyy'), count, titles })
              }
              onMouseMove={(e) =>
                setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
              }
              onMouseLeave={() => setTooltip(null)}
            />
          )
        })}
      </svg>

      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-text-tertiary text-xs">Less</span>
        {['#1a1a1a', '#14532d', '#15803d', '#22c55e'].map((color) => (
          <span key={color} className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: color }} />
        ))}
        <span className="text-text-tertiary text-xs">More</span>
      </div>
    </div>
  )
}
