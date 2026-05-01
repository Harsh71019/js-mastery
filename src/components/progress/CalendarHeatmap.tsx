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

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getCellColor = (count: number): string => {
  if (count === 0) return '#1a1a1a'
  if (count === 1) return '#14532d'
  if (count === 2) return '#15803d'
  return '#22c55e'
}

const getAvailableMonths = (): Date[] => {
  const months: Date[] = []
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    months.push(startOfMonth(subMonths(today, i)))
  }
  return months
}

export const CalendarHeatmap = ({ dayData }: CalendarHeatmapProps): React.JSX.Element => {
  const availableMonths = getAvailableMonths()
  const [selectedMonth, setSelectedMonth] = useState<Date>(availableMonths[availableMonths.length - 1])
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const canGoPrev = selectedMonth > availableMonths[0]
  const canGoNext = !isFuture(addMonths(selectedMonth, 1))

  const handlePrev = (): void => {
    if (canGoPrev) setSelectedMonth((prev) => startOfMonth(subMonths(prev, 1)))
  }

  const handleNext = (): void => {
    if (canGoNext) setSelectedMonth((prev) => startOfMonth(addMonths(prev, 1)))
  }

  const days = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  })

  const firstDayOffset = getDay(days[0])
  const totalCells = firstDayOffset + days.length
  const totalRows = Math.ceil(totalCells / 7)

  const monthSolveCount = days.reduce((total, day) => {
    const key = format(day, 'yyyy-MM-dd')
    return total + (dayData.get(key)?.count ?? 0)
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
            {tooltip.count === 0
              ? 'No problems solved'
              : `${tooltip.count} problem${tooltip.count > 1 ? 's' : ''} solved`}
          </p>
          {tooltip.titles.slice(0, 3).map((title, index) => (
            <p key={index} className="text-text-tertiary truncate max-w-[200px] mt-0.5">
              • {title}
            </p>
          ))}
          {tooltip.titles.length > 3 && (
            <p className="text-text-tertiary mt-0.5">+{tooltip.titles.length - 3} more</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={(event) => {
              const found = availableMonths.find(
                (m) => format(m, 'yyyy-MM') === event.target.value,
              )
              if (found) setSelectedMonth(found)
            }}
            className="bg-bg-tertiary border border-border-default text-text-primary text-sm rounded px-2 py-1 focus:outline-none focus:border-accent-blue transition-colors duration-150 cursor-pointer"
          >
            {availableMonths.map((month) => (
              <option key={format(month, 'yyyy-MM')} value={format(month, 'yyyy-MM')}>
                {format(month, 'MMMM yyyy')}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <span className="text-text-tertiary text-xs">
          {monthSolveCount > 0
            ? `${monthSolveCount} problem${monthSolveCount > 1 ? 's' : ''} solved`
            : 'No problems solved'}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((day) => (
          <div key={day} className="text-center text-text-tertiary text-xs py-1">
            {day}
          </div>
        ))}
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${totalRows}, 1fr)` }}
      >
        {Array.from({ length: firstDayOffset }, (_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const data = dayData.get(dateStr)
          const count = data?.count ?? 0
          const titles = data?.titles ?? []
          const isFutureDay = isFuture(startOfDay(day))

          return (
            <div
              key={dateStr}
              className="aspect-square rounded-sm cursor-pointer transition-opacity duration-150 hover:opacity-80"
              style={{ backgroundColor: isFutureDay ? 'transparent' : getCellColor(count) }}
              onMouseEnter={(event) => {
                if (isFutureDay) return
                setTooltip({
                  x: event.clientX,
                  y: event.clientY,
                  date: format(day, 'MMM d, yyyy'),
                  count,
                  titles,
                })
              }}
              onMouseMove={(event) =>
                setTooltip((prev) =>
                  prev ? { ...prev, x: event.clientX, y: event.clientY } : null,
                )
              }
              onMouseLeave={() => setTooltip(null)}
            />
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-text-tertiary text-xs">Less</span>
        {['#1a1a1a', '#14532d', '#15803d', '#22c55e'].map((color) => (
          <span
            key={color}
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-text-tertiary text-xs">More</span>
      </div>
    </div>
  )
}
