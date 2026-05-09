import React from 'react'
import type { RunTiming } from '@/store/useProgressStore'

interface RunTimingGraphProps {
  readonly timings: readonly RunTiming[]
}

const GRAPH_H = 40
const BAR_W = 7
const BAR_GAP = 3

const getBarHeight = (ms: number, maxMs: number, minMs: number): number => {
  if (maxMs === minMs) return GRAPH_H * 0.55
  return ((ms - minMs) / (maxMs - minMs)) * GRAPH_H * 0.8 + GRAPH_H * 0.15
}

const getBarColor = (t: RunTiming, minMs: number, index: number, total: number): string => {
  const isLatest = index === total - 1
  const isBest = t.ms === minMs && total > 1
  if (!t.accepted) return isLatest ? '#ef4444' : '#3f1111'
  if (isBest && isLatest) return '#22c55e'
  if (isLatest) return '#3b82f6'
  if (isBest) return '#16a34a'
  return '#2d2d2d'
}

export const RunTimingGraph = ({ timings }: RunTimingGraphProps): React.JSX.Element | null => {
  if (timings.length === 0) return null

  const accepted = timings.filter((t) => t.accepted)
  const maxMs = Math.max(...timings.map((t) => t.ms))
  const minAcceptedMs = accepted.length > 0 ? Math.min(...accepted.map((t) => t.ms)) : null
  const latest = timings[timings.length - 1]
  const isPersonalBest = latest.accepted && minAcceptedMs !== null && latest.ms === minAcceptedMs && accepted.length > 1

  return (
    <div className="flex flex-col gap-2 py-3 px-4 bg-bg-tertiary rounded-md border border-border-default">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-text-tertiary">Run history</span>
        <div className="flex items-center gap-3 text-[10px]">
          {minAcceptedMs !== null && accepted.length > 1 && (
            <span className="text-accent-green">best {minAcceptedMs}ms</span>
          )}
          {latest.accepted ? (
            <span className={isPersonalBest ? 'text-accent-green font-medium' : 'text-text-secondary'}>
              {isPersonalBest ? '🏆 ' : ''}latest {latest.ms}ms
            </span>
          ) : (
            <span className="text-accent-red">latest failed</span>
          )}
        </div>
      </div>

      <div className="flex items-end overflow-x-auto" style={{ height: GRAPH_H, gap: BAR_GAP }}>
        {timings.map((t, i) => (
          <div
            key={i}
            className="rounded-t-sm shrink-0 transition-all duration-300"
            style={{
              width: BAR_W,
              height: getBarHeight(t.ms, maxMs, Math.min(...timings.map((x) => x.ms))),
              backgroundColor: getBarColor(t, Math.min(...timings.map((x) => x.ms)), i, timings.length),
            }}
            title={`Run ${i + 1}: ${t.ms}ms ${t.accepted ? '✓' : '✗'}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] text-text-tertiary">
        <span>oldest</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block bg-[#22c55e]" />accepted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block bg-[#3f1111]" />failed
          </span>
        </div>
        <span>latest</span>
      </div>
    </div>
  )
}
