import React, { memo } from 'react'
import type { TestResult, Verdict } from '@/runner/executor'

interface ResultsPanelProps {
  readonly results: readonly TestResult[] | null
  readonly isRunning: boolean
  readonly verdict?: Verdict
  readonly action: 'run' | 'submit' | null
}

const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  'Accepted':            { label: 'ACCEPTED',            className: 'text-accent-green border-accent-green/40 bg-accent-green/10 shadow-[0_0_12px_rgba(34,197,94,0.2)]' },
  'Wrong Answer':        { label: 'WRONG ANSWER',        className: 'text-accent-amber  border-accent-amber/40  bg-accent-amber/10'  },
  'Runtime Error':       { label: 'RUNTIME ERROR',       className: 'text-orange-400   border-orange-400/40   bg-orange-400/10'   },
  'Compile Error':       { label: 'COMPILE ERROR',       className: 'text-accent-red   border-accent-red/40   bg-accent-red/10'   },
  'Time Limit Exceeded': { label: 'TIME LIMIT EXCEEDED', className: 'text-purple-400   border-purple-400/40   bg-purple-400/10'   },
}

const ACTION_LABEL: Record<'run' | 'submit', string> = {
  run:    'RUN',
  submit: 'SUBMIT',
}

const ACTION_COLOR: Record<'run' | 'submit', string> = {
  run:    'text-accent-blue',
  submit: 'text-accent-green',
}

const stringify = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  return JSON.stringify(value)
}

interface TestCardProps {
  readonly result: TestResult
  readonly index: number
  readonly isHiddenResult: boolean
}

const TestCard = memo(({ result, index, isHiddenResult }: TestCardProps): React.JSX.Element => (
  <div className="rounded-lg border border-white/[0.04] px-4 py-4 bg-white/[0.02] text-xs shrink-0 min-w-[240px] transition-all duration-300 hover:border-white/[0.1] relative overflow-hidden group/test">
    <div
      className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${result.passed ? 'bg-accent-green shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-accent-red shadow-[0_0_12px_rgba(239,68,68,0.4)]'}`}
    />
    <div className="flex items-center justify-between mb-3">
      <p className="text-text-tertiary font-bold uppercase tracking-widest text-[9px] font-geist">
        Test Case {index + 1}
        {isHiddenResult && (
          <span className="ml-2 text-purple-400 opacity-70">HIDDEN</span>
        )}
      </p>
      {result.passed ? (
        <span className="text-accent-green text-[10px] font-bold font-geist">PASSED</span>
      ) : (
        <span className="text-accent-red text-[10px] font-bold font-geist">FAILED</span>
      )}
    </div>

    {result.error ? (
      <div className="bg-accent-red/5 p-2 rounded border border-accent-red/10">
        <p className="text-accent-red font-geist text-[11px] leading-relaxed break-all whitespace-pre-wrap">{result.error}</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3 font-geist text-[11px]">
        <div>
          <p className="text-[9px] text-text-tertiary uppercase font-bold mb-1 tracking-tighter opacity-50">Input</p>
          <p className="text-text-secondary truncate bg-white/[0.03] px-1.5 py-1 rounded border border-white/5">{stringify(result.input)}</p>
        </div>
        <div>
          <p className="text-[9px] text-text-tertiary uppercase font-bold mb-1 tracking-tighter opacity-50">Expected</p>
          <p className="text-text-secondary truncate bg-white/[0.03] px-1.5 py-1 rounded border border-white/5">
            {isHiddenResult && result.expected === null ? '—' : stringify(result.expected)}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-tertiary uppercase font-bold mb-1 tracking-tighter opacity-50">Actual</p>
          <p className={`${result.passed ? 'text-accent-green' : 'text-accent-red'} font-bold bg-white/[0.03] px-1.5 py-1 rounded border border-white/5 truncate`}>
            {stringify(result.actual)}
          </p>
        </div>
      </div>
    )}
  </div>
))

TestCard.displayName = 'TestCard'

const LoadingSpinner = ({ action }: { action: 'run' | 'submit' | null }): React.JSX.Element => {
  const isSubmit = action === 'submit'
  const spinColor = isSubmit ? 'border-t-accent-amber' : 'border-t-accent-blue'
  const glowColor = isSubmit ? 'border-accent-amber/20' : 'border-accent-blue/20'
  const textColor = isSubmit ? 'text-accent-amber' : 'text-accent-blue'
  const label = isSubmit ? 'Judging submission...' : 'Executing sample tests...'

  return (
    <div className="h-full flex flex-col items-center justify-center text-text-tertiary text-sm gap-4 bg-bg-primary/50">
      <div className="relative">
        <div className={`w-10 h-10 border-2 border-white/5 ${spinColor} rounded-full animate-spin`} />
        <div className={`absolute inset-0 w-10 h-10 border ${glowColor} rounded-full blur-sm animate-pulse`} />
      </div>
      <span className={`font-geist text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse ${textColor}`}>{label}</span>
    </div>
  )
}

export const ResultsPanel = ({ results, isRunning, verdict, action }: ResultsPanelProps): React.JSX.Element => {
  if (isRunning) {
    return <LoadingSpinner action={action} />
  }

  if (!results || action === null) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 font-geist">
        Environment Ready
      </div>
    )
  }

  const passCount = results.filter((result) => result.passed).length
  const allPassed = results.length > 0 && passCount === results.length
  const verdictInfo = verdict ? VERDICT_STYLE[verdict] : null
  const actionLabel = ACTION_LABEL[action]
  const actionColor = ACTION_COLOR[action]
  const headerGlow = allPassed && action === 'submit'
    ? 'bg-accent-green/5 border-b-accent-green/20'
    : 'bg-white/[0.01]'

  return (
    <div className="h-full flex flex-col bg-bg-primary/30">
      <div className={`flex items-center justify-between px-6 py-3 border-b border-white/5 ${headerGlow} transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          <span className={`text-[9px] font-bold uppercase tracking-widest font-geist ${actionColor} opacity-60`}>
            {actionLabel}
          </span>
          {verdictInfo && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${verdictInfo.className} font-geist`}>
              {verdictInfo.label}
            </span>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${allPassed ? 'bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]' : 'bg-accent-red shadow-[0_0_8px_var(--color-accent-red)]'}`} />
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest font-geist">
              <span className={allPassed ? 'text-accent-green' : 'text-accent-red'}>
                {passCount} / {results.length}
              </span>{' '}
              Subroutines verified
            </p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-text-tertiary font-geist uppercase tracking-tighter opacity-50">
          SYS_LOG: VERIFIED
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 font-geist">
            No sample tests — use Submit to judge your solution
          </div>
        ) : (
          <div className="flex gap-4 min-w-max">
            {results.map((result, index) => (
              <TestCard
                key={index}
                result={result}
                index={index}
                isHiddenResult={action === 'submit' && result.expected === null}
              />
            ))}
            <div className="w-1 px-1 opacity-0" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
