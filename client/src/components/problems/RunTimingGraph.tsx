import React from 'react'

interface RunTimingGraphProps {
  readonly timings: readonly number[]
}

const GRAPH_H = 40
const BAR_W = 7
const BAR_GAP = 3

const getBarHeight = (ms: number, maxMs: number, minMs: number): number => {
  if (maxMs === minMs) return GRAPH_H * 0.55
  return ((ms - minMs) / (maxMs - minMs)) * GRAPH_H * 0.8 + GRAPH_H * 0.15
}

const getBarColor = (ms: number, minMs: number, index: number, total: number): string => {
  const isLatest = index === total - 1
  const isBest = ms === minMs
  if (isBest && isLatest) return '#22c55e'
  if (isLatest) return '#3b82f6'
  if (isBest) return '#16a34a'
  return '#2d2d2d'
}

export const RunTimingGraph = ({ timings }: RunTimingGraphProps): React.JSX.Element | null => {
  if (timings.length === 0) return null

  const maxMs = Math.max(...timings)
  const minMs = Math.min(...timings)
  const latest = timings[timings.length - 1]
  const isPersonalBest = latest === minMs && timings.length > 1

  return (
    <div className="flex flex-col gap-2 py-3 px-4 bg-bg-tertiary rounded-md border border-border-default">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-text-tertiary">Run history</span>
        <div className="flex items-center gap-3 text-[10px]">
          {timings.length > 1 && (
            <span className="text-accent-green">best {minMs}ms</span>
          )}
          <span className={isPersonalBest ? 'text-accent-green font-medium' : 'text-text-secondary'}>
            {isPersonalBest ? '🏆 ' : ''}latest {latest}ms
          </span>
        </div>
      </div>

      <div className="flex items-end overflow-x-auto" style={{ height: GRAPH_H, gap: BAR_GAP }}>
        {timings.map((ms, i) => (
          <div
            key={i}
            className="rounded-t-sm shrink-0 transition-all duration-300"
            style={{
              width: BAR_W,
              height: getBarHeight(ms, maxMs, minMs),
              backgroundColor: getBarColor(ms, minMs, i, timings.length),
            }}
            title={`Run ${i + 1}: ${ms}ms`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] text-text-tertiary">
        <span>oldest</span>
        <span>{timings.length} run{timings.length !== 1 ? 's' : ''}</span>
        <span>latest</span>
      </div>
    </div>
  )
}
