import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Table as TableIcon,
  Activity,
  Layers,
  ArrowDown,
  Sparkles,
} from 'lucide-react'
import type { TraceTable } from '@/types/problem'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface LoopVisualizerProps {
  readonly traceTable: TraceTable
  readonly onRowClick?: () => void
}

const POINTER_NAMES = new Set([
  'i',
  'j',
  'k',
  'left',
  'right',
  'start',
  'end',
  'slow',
  'fast',
  'ptr',
  'index',
  'low',
  'high',
  'mid',
])

const POINTER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  left: { bg: 'bg-accent-blue/20', text: 'text-accent-blue', border: 'border-accent-blue/40' },
  right: { bg: 'bg-accent-amber/20', text: 'text-accent-amber', border: 'border-accent-amber/40' },
  i: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
  j: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/40' },
  start: { bg: 'bg-accent-green/20', text: 'text-accent-green', border: 'border-accent-green/40' },
  end: { bg: 'bg-accent-amber/20', text: 'text-accent-amber', border: 'border-accent-amber/40' },
  slow: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40' },
  fast: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
}

const defaultPointerColor = {
  bg: 'bg-white/10',
  text: 'text-text-primary',
  border: 'border-white/20',
}

export const LoopVisualizer: React.FC<LoopVisualizerProps> = ({ traceTable, onRowClick }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1)
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual')

  const totalSteps = traceTable.rows.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Extract array elements from inputLabel (e.g. nums = [1, 2, 3, 4] or arr = ["a", "b"])
  const arrayData = useMemo(() => {
    if (!traceTable.inputLabel) return null
    const match = traceTable.inputLabel.match(/\[([\s\S]*?)\]/)
    if (!match) return null

    try {
      // Try parsing as valid JSON
      const parsed = JSON.parse(`[${match[1]}]`) as unknown[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // Fallback: split by commas
      const rawItems = match[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      if (rawItems.length > 0) return rawItems
    }
    return null
  }, [traceTable.inputLabel])

  // Identify pointer columns
  const pointerCols = useMemo(() => {
    return traceTable.columns.filter((col) => POINTER_NAMES.has(col.toLowerCase()))
  }, [traceTable.columns])

  const currentRow = traceTable.rows[currentStep] ?? {}
  const previousRow = currentStep > 0 ? traceTable.rows[currentStep - 1] : null

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const intervalMs = Math.round(1200 / playbackSpeed)
    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, totalSteps, playbackSpeed])

  const handleNext = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))
  }

  const handlePrev = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleFirst = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleLast = () => {
    setIsPlaying(false)
    setCurrentStep(totalSteps - 1)
  }

  const togglePlay = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0)
    }
    setIsPlaying((prev) => !prev)
  }

  return (
    <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden flex flex-col font-geist">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
            <Activity size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Loop Execution Stepper
              </h3>
              <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            {traceTable.inputLabel && (
              <p className="text-[11px] text-text-tertiary font-mono mt-0.5">
                {traceTable.inputLabel}
              </p>
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Layers size={11} />
            Visual Stepper
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <TableIcon size={11} />
            Data Grid
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="p-5 flex flex-col gap-5">
          {/* Array Memory Blocks & Pointers Display */}
          {arrayData && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-x-auto scrollbar-thin">
              <div className="flex items-center justify-between text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1">
                <span>Array Memory Coordinates</span>
                <span>Length: {arrayData.length}</span>
              </div>

              {/* Pointer Markers Row */}
              <div className="flex items-center gap-2 min-w-max pt-2">
                {arrayData.map((_, idx) => {
                  // Find all pointers matching this index in current step
                  const activePointers = pointerCols.filter((col) => {
                    const val = currentRow[col]
                    return typeof val === 'number' && val === idx
                  })

                  return (
                    <div key={idx} className="w-14 flex flex-col items-center justify-end h-7">
                      {activePointers.map((pCol) => {
                        const colKey = pCol.toLowerCase()
                        const style = POINTER_COLORS[colKey] ?? defaultPointerColor
                        return (
                          <div
                            key={pCol}
                            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border animate-bounce ${style.bg} ${style.text} ${style.border}`}
                          >
                            <span>{pCol}</span>
                            <ArrowDown size={8} />
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>

              {/* Array Elements Cells */}
              <div className="flex items-center gap-2 min-w-max pb-1">
                {arrayData.map((val, idx) => {
                  const hasPointer = pointerCols.some((col) => currentRow[col] === idx)
                  return (
                    <div
                      key={idx}
                      className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 relative ${
                        hasPointer
                          ? 'border-accent-blue bg-accent-blue/[0.12] shadow-[0_0_15px_-2px_rgba(59,130,246,0.35)] scale-105'
                          : 'border-white/10 bg-[#0d0d0d] hover:border-white/20'
                      }`}
                    >
                      <span className="text-[10px] text-text-tertiary font-mono absolute top-1 left-1.5">
                        [{idx}]
                      </span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          hasPointer ? 'text-accent-blue' : 'text-text-primary'
                        }`}
                      >
                        {String(val)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Variables State Cards */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
              <span>Variables in Current Scope</span>
              <span className="flex items-center gap-1 text-accent-green">
                <Sparkles size={10} /> Dynamic State Tracking
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {traceTable.columns.map((col) => {
                const val = currentRow[col]
                const prevVal = previousRow ? previousRow[col] : undefined
                const isChanged = prevVal !== undefined && prevVal !== val

                return (
                  <div
                    key={col}
                    className={`p-3 rounded-xl border transition-all ${
                      isChanged
                        ? 'border-accent-green/40 bg-accent-green/[0.04]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">
                        {col}
                      </span>
                      {isChanged && (
                        <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 px-1 py-0.2 rounded border border-accent-green/20">
                          changed
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold font-mono text-text-primary truncate">
                      {val !== undefined ? String(val) : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Narrative / Action Banner */}
          {('action' in currentRow || 'result' in currentRow || 'decision' in currentRow) && (
            <div className="p-3.5 rounded-xl bg-accent-blue/[0.05] border border-accent-blue/20 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue shrink-0 animate-ping" />
              <div className="flex-1 text-text-secondary leading-relaxed">
                <strong className="text-accent-blue uppercase text-[10px] mr-1.5 font-geist">
                  Step Evaluation:
                </strong>
                <span className="font-mono text-text-primary">
                  {String(currentRow.action ?? currentRow.result ?? currentRow.decision ?? '')}
                </span>
              </div>
            </div>
          )}

          {/* Stepper Controls & Scrubber */}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
            {/* Progress Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-text-tertiary">1</span>
              <input
                type="range"
                min={0}
                max={totalSteps - 1}
                value={currentStep}
                onChange={(e) => {
                  setIsPlaying(false)
                  setCurrentStep(Number(e.target.value))
                }}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <span className="text-[10px] font-mono text-text-tertiary">{totalSteps}</span>
            </div>

            {/* Stepper Buttons Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFirst}
                  disabled={currentStep === 0}
                  title="First Step"
                  className="h-8 px-2"
                >
                  <SkipBack size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  title="Previous Step"
                  className="h-8 px-2"
                >
                  <ChevronLeft size={15} />
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={togglePlay}
                  className="h-8 px-3 gap-1.5 text-xs font-semibold"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === totalSteps - 1}
                  title="Next Step"
                  className="h-8 px-2"
                >
                  <ChevronRight size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLast}
                  disabled={currentStep === totalSteps - 1}
                  title="Last Step"
                  className="h-8 px-2"
                >
                  <SkipForward size={13} />
                </Button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
                <span className="text-[10px] uppercase font-bold mr-1">Speed:</span>
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd as 1 | 1.5 | 2)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-accent-blue text-white'
                        : 'bg-white/5 text-text-tertiary hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Data Grid View */
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08]">
                <th className="px-4 py-3 text-left text-text-tertiary uppercase tracking-wider font-bold">
                  Step
                </th>
                {traceTable.columns.map((column) => (
                  <th
                    key={column}
                    className="text-left px-4 py-3 text-text-tertiary uppercase tracking-wider font-bold font-mono"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traceTable.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => {
                    setCurrentStep(rowIndex)
                    setViewMode('visual')
                    onRowClick?.()
                  }}
                  className={`border-b border-white/[0.04] transition-colors cursor-pointer ${
                    rowIndex === currentStep
                      ? 'bg-accent-blue/[0.08] text-white font-bold'
                      : 'hover:bg-white/[0.02] text-text-secondary'
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-text-tertiary">
                    #{rowIndex + 1}
                  </td>
                  {traceTable.columns.map((column) => (
                    <td key={column} className="px-4 py-3 font-mono tabular-nums">
                      {String(row[column] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
