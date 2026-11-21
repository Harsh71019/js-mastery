import React, { memo, useState } from 'react'
import {
  Cpu,
  HardDrive,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Terminal,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Copy,
  Check,
  Code2,
} from 'lucide-react'
import type { TestResult, Verdict } from '@/runner/executor'
import type { TestCase } from '@/types/problem'
import { Button } from '@/components/ui/Button'

export interface ResultsPanelProps {
  readonly results: readonly TestResult[] | null
  readonly isRunning: boolean
  readonly verdict?: Verdict
  readonly action: 'run' | 'submit' | null
  readonly executionTimeMs?: number
  readonly memoryUsageMb?: number
  readonly beatsRuntime?: number
  readonly beatsMemory?: number
  readonly testcases: readonly TestCase[]
  readonly activeCaseIndex: number
  readonly onSelectCase: (index: number) => void
  readonly onUpdateCaseInput?: (index: number, newInput: unknown) => void
  readonly onAddCustomCase?: () => void
  readonly onDeleteCase?: (index: number) => void
  readonly onResetTestcases?: () => void
  readonly activeBottomTab: 'testcase' | 'result'
  readonly onTabChange: (tab: 'testcase' | 'result') => void
  readonly onRun?: () => void
}

const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  Accepted: {
    label: 'ACCEPTED',
    className:
      'text-accent-green border-accent-green/40 bg-accent-green/10 shadow-[0_0_12px_rgba(34,197,94,0.2)]',
  },
  'Wrong Answer': {
    label: 'WRONG ANSWER',
    className: 'text-accent-amber border-accent-amber/40 bg-accent-amber/10',
  },
  'Runtime Error': {
    label: 'RUNTIME ERROR',
    className: 'text-orange-400 border-orange-400/40 bg-orange-400/10',
  },
  'Compile Error': {
    label: 'COMPILE ERROR',
    className: 'text-accent-red border-accent-red/40 bg-accent-red/10',
  },
  'Time Limit Exceeded': {
    label: 'TIME LIMIT EXCEEDED',
    className: 'text-purple-400 border-purple-400/40 bg-purple-400/10',
  },
  'Memory Limit Exceeded': {
    label: 'MEMORY LIMIT EXCEEDED',
    className:
      'text-pink-400 border-pink-400/40 bg-pink-400/10 shadow-[0_0_12px_rgba(244,114,182,0.2)]',
  },
}

const ACTION_LABEL: Record<'run' | 'submit', string> = {
  run: 'RUN',
  submit: 'SUBMIT',
}

const ACTION_COLOR: Record<'run' | 'submit', string> = {
  run: 'text-accent-blue',
  submit: 'text-accent-green',
}

const stringifyPretty = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}


const LoadingSpinner = ({ action }: { action: 'run' | 'submit' | null }): React.JSX.Element => {
  const isSubmit = action === 'submit'
  const spinColor = isSubmit ? 'border-t-accent-amber' : 'border-t-accent-blue'
  const glowColor = isSubmit ? 'border-accent-amber/20' : 'border-accent-blue/20'
  const textColor = isSubmit ? 'text-accent-amber' : 'text-accent-blue'
  const label = isSubmit
    ? 'Profiling Subroutines & Submitting...'
    : 'Executing Code & Profiling Telemetry...'

  return (
    <div className="h-full flex flex-col items-center justify-center text-text-tertiary text-sm gap-4 bg-[#0a0a0a]">
      <div className="relative">
        <div className={`w-9 h-9 border-2 border-white/5 ${spinColor} rounded-full animate-spin`} />
        <div
          className={`absolute inset-0 w-9 h-9 border ${glowColor} rounded-full blur-sm animate-pulse`}
        />
      </div>
      <span
        className={`font-geist text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse ${textColor}`}
      >
        {label}
      </span>
    </div>
  )
}

const StdoutViewer: React.FC<{ logs?: readonly string[] }> = memo(({ logs }) => {
  const [copied, setCopied] = useState(false)

  if (!logs || logs.length === 0) {
    return (
      <div className="mt-2.5 p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-text-tertiary font-geist italic">
        No stdout output recorded for this test case. Use console.log() to print debug values.
      </div>
    )
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(logs.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2.5 rounded-lg border border-white/10 bg-[#060606] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/5 text-[10px] font-geist font-bold text-text-tertiary">
        <div className="flex items-center gap-1.5 text-accent-blue">
          <Terminal size={12} />
          <span className="uppercase tracking-wider">Console Logs ({logs.length})</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-white transition-colors cursor-pointer"
          title="Copy console output"
        >
          {copied ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-3 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed text-text-secondary flex flex-col gap-1 select-text">
        {logs.map((line, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="text-accent-blue/40 select-none text-[10px] mt-0.5">&gt;</span>
            <span className="whitespace-pre-wrap break-all text-white/90">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

StdoutViewer.displayName = 'StdoutViewer'

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  isRunning,
  verdict,
  action,
  executionTimeMs,
  memoryUsageMb,
  beatsRuntime,
  beatsMemory,
  testcases,
  activeCaseIndex,
  onSelectCase,
  onUpdateCaseInput,
  onAddCustomCase,
  onDeleteCase,
  onResetTestcases,
  activeBottomTab,
  onTabChange,
  onRun,
}) => {
  const [editingInputText, setEditingInputText] = useState<string | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)

  if (isRunning) {
    return <LoadingSpinner action={action} />
  }

  const currentTest = testcases[activeCaseIndex] ?? testcases[0]
  const currentResult = results ? results[activeCaseIndex] : null

  const passCount = results ? results.filter((r) => r.passed).length : 0
  const allPassed = Boolean(results && results.length > 0 && passCount === results.length)
  const verdictInfo = verdict ? VERDICT_STYLE[verdict] : null
  const actionLabel = action ? ACTION_LABEL[action] : 'RUN'
  const actionColor = action ? ACTION_COLOR[action] : 'text-accent-blue'

  const displayTimeMs =
    typeof executionTimeMs === 'number' && executionTimeMs >= 0 ? executionTimeMs : 0
  const displayMemoryMb =
    typeof memoryUsageMb === 'number' && memoryUsageMb > 0 ? memoryUsageMb : 45.2

  // Start editing active testcase input
  const handleStartEditing = () => {
    if (!currentTest) return
    setEditingInputText(stringifyPretty(currentTest.input))
    setInputError(null)
  }

  const handleApplyInput = () => {
    if (!onUpdateCaseInput || editingInputText === null) return
    try {
      const parsed = JSON.parse(editingInputText)
      onUpdateCaseInput(activeCaseIndex, parsed)
      setEditingInputText(null)
      setInputError(null)
    } catch {
      setInputError('Invalid JSON format. Please check syntax.')
    }
  }

  const handleCancelEditing = () => {
    setEditingInputText(null)
    setInputError(null)
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] overflow-hidden text-xs">
      {/* Top Header & Tab Switcher */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-1.5 border-b border-white/[0.08] bg-[#0c0c0c] shrink-0 gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onTabChange('testcase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeBottomTab === 'testcase'
                ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'text-text-tertiary hover:text-text-secondary border border-transparent hover:bg-white/[0.03]'
            }`}
          >
            <Code2 size={13} />
            <span>Testcase</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('result')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activeBottomTab === 'result'
                ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'text-text-tertiary hover:text-text-secondary border border-transparent hover:bg-white/[0.03]'
            }`}
          >
            <Zap size={13} />
            <span>Test Result</span>
            {results && results.length > 0 && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${allPassed ? 'bg-accent-green shadow-[0_0_6px_var(--color-accent-green)]' : 'bg-accent-red shadow-[0_0_6px_var(--color-accent-red)]'}`}
              />
            )}
          </button>
        </div>

        {/* Telemetry pill on desktop when results exist */}
        {results && results.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-1 text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
              <Cpu size={11} />
              <span>{displayTimeMs.toFixed(1)} ms</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              <HardDrive size={11} />
              <span>{displayMemoryMb.toFixed(1)} MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* ========================================================== */}
        {/* TAB 1: TESTCASE (Configure and inspect inputs)              */}
        {/* ========================================================== */}
        {activeBottomTab === 'testcase' && (
          <div className="p-4 sm:p-5 flex flex-col gap-4">
            {/* Case Selector Pills */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {testcases.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCase(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      activeCaseIndex === idx
                        ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                        : 'bg-white/[0.03] text-text-tertiary hover:text-text-secondary border border-white/5'
                    }`}
                  >
                    <span>Case {idx + 1}</span>
                    {t.custom && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-accent-blue/20 text-accent-blue">
                        Custom
                      </span>
                    )}
                  </button>
                ))}

                {onAddCustomCase && (
                  <button
                    type="button"
                    onClick={onAddCustomCase}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium font-geist text-text-tertiary hover:text-white bg-white/[0.02] hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 flex items-center gap-1 transition-all cursor-pointer"
                    title="Add custom test case"
                  >
                    <Plus size={13} />
                    <span>Add Case</span>
                  </button>
                )}
              </div>

              {onResetTestcases && (
                <button
                  type="button"
                  onClick={onResetTestcases}
                  className="text-[11px] font-geist text-text-tertiary hover:text-text-secondary flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to problem default test cases"
                >
                  <RotateCcw size={11} />
                  <span>Reset Cases</span>
                </button>
              )}
            </div>

            {/* Selected Test Case Details */}
            {currentTest ? (
              <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0c0c0c] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-geist text-text-primary uppercase tracking-wider">
                      Input Configuration (Case {activeCaseIndex + 1})
                    </span>
                    {currentTest.custom && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent-blue/15 text-accent-blue border border-accent-blue/30">
                        Custom Testcase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentTest.custom && onDeleteCase && (
                      <button
                        type="button"
                        onClick={() => onDeleteCase(activeCaseIndex)}
                        className="text-text-tertiary hover:text-accent-red transition-colors flex items-center gap-1 text-[11px] font-geist cursor-pointer"
                        title="Delete this custom test case"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Editor / Display */}
                {editingInputText !== null ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editingInputText}
                      onChange={(e) => setEditingInputText(e.target.value)}
                      rows={5}
                      className="w-full bg-[#050505] border border-accent-blue/40 rounded-lg p-3 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      placeholder="Enter JSON input..."
                    />
                    {inputError && <span className="text-[11px] text-accent-red font-geist">{inputError}</span>}
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={handleCancelEditing}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleApplyInput}>
                        Save Input
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="relative group">
                      <pre className="p-3 rounded-lg bg-[#050505] border border-white/5 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto">
                        <code>{stringifyPretty(currentTest.input)}</code>
                      </pre>
                      {onUpdateCaseInput && (
                        <button
                          type="button"
                          onClick={handleStartEditing}
                          className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-geist text-text-secondary hover:text-white transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                        >
                          Edit Input
                        </button>
                      )}
                    </div>

                    {currentTest.expected !== undefined && (
                      <div className="mt-1">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist mb-1 block">
                          Expected Output
                        </span>
                        <pre className="p-2.5 rounded-lg bg-[#050505] border border-white/5 font-mono text-xs text-accent-green leading-relaxed overflow-x-auto">
                          <code>{stringifyPretty(currentTest.expected)}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Run Action */}
                {onRun && (
                  <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary font-geist">
                      Run your code with these input arguments to inspect outputs & logs.
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onRun}
                      className="text-xs font-geist font-bold flex items-center gap-1.5"
                    >
                      <Play size={12} className="text-accent-blue" />
                      <span>Run Code</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: TEST RESULT (Run outputs, verdicts, stdout)        */}
        {/* ========================================================== */}
        {activeBottomTab === 'result' && (
          <div className="flex-1 flex flex-col">
            {!results || results.length === 0 ? (
              <div className="h-full py-12 flex flex-col items-center justify-center text-center gap-3 text-text-tertiary px-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary">
                  <Play size={18} className="text-accent-blue ml-0.5" />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-bold font-geist mb-1">
                    Execution Sandbox Ready
                  </p>
                  <p className="text-xs text-text-tertiary max-w-sm font-geist">
                    Click &quot;Run&quot; to test visible cases or &quot;Submit&quot; to run the full hidden test suite.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Status & Verdict Header */}
                <div
                  className={`px-4 sm:px-6 py-2.5 border-b border-white/5 flex items-center justify-between gap-3 flex-wrap ${
                    allPassed && action === 'submit' ? 'bg-accent-green/5' : 'bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest font-geist ${actionColor}`}
                    >
                      {actionLabel}
                    </span>
                    {verdictInfo && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${verdictInfo.className} font-geist`}
                      >
                        {verdictInfo.label}
                      </span>
                    )}
                    <span className="text-text-secondary text-[11px] font-bold font-geist">
                      <span className={allPassed ? 'text-accent-green' : 'text-accent-red'}>
                        {passCount} / {results.length}
                      </span>{' '}
                      Cases passed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-accent-blue">
                      <Cpu size={12} />
                      <span>{displayTimeMs.toFixed(1)} ms</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-400">
                      <HardDrive size={12} />
                      <span>{displayMemoryMb.toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>

                {/* LeetCode Benchmark Banner */}
                {(beatsRuntime !== undefined || beatsMemory !== undefined) && (
                  <div className="px-4 sm:px-6 py-2 bg-black/40 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-wrap text-xs">
                    <div className="flex items-center gap-6">
                      {beatsRuntime !== undefined && (
                        <div className="flex items-center gap-2">
                          <Activity size={13} className="text-accent-green" />
                          <span className="text-text-secondary font-geist">
                            Runtime: Beats{' '}
                            <strong className="text-accent-green font-mono">
                              {beatsRuntime.toFixed(1)}%
                            </strong>{' '}
                            of users
                          </span>
                        </div>
                      )}
                      {beatsMemory !== undefined && (
                        <div className="flex items-center gap-2">
                          <HardDrive size={13} className="text-purple-400" />
                          <span className="text-text-secondary font-geist">
                            Memory: Beats{' '}
                            <strong className="text-purple-400 font-mono">
                              {beatsMemory.toFixed(1)}%
                            </strong>{' '}
                            of users
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Case Selection Tabs */}
                <div className="px-4 sm:px-6 py-2 border-b border-white/5 bg-[#0c0c0c] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                  {results.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectCase(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        activeCaseIndex === idx
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-white/[0.02] text-text-tertiary hover:text-text-secondary border border-white/5'
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle2 size={12} className="text-accent-green shrink-0" />
                      ) : (
                        <AlertTriangle size={12} className="text-accent-red shrink-0" />
                      )}
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Case Inspection */}
                {currentResult && (
                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    {/* Error Box if Runtime/Compile Error */}
                    {currentResult.error && (
                      <div className="p-3.5 rounded-xl border border-accent-red/30 bg-accent-red/10 text-accent-red font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
                        <div className="flex items-center gap-1.5 font-bold font-geist mb-1 uppercase tracking-wider text-[10px]">
                          <AlertTriangle size={12} /> Execution Error
                        </div>
                        {currentResult.error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Input */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">
                          Input
                        </span>
                        <pre className="p-3 rounded-xl bg-[#0e0e0e] border border-white/5 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto min-h-[50px]">
                          <code>{stringifyPretty(currentResult.input)}</code>
                        </pre>
                      </div>

                      {/* Actual Output */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">
                          Your Output
                        </span>
                        <pre
                          className={`p-3 rounded-xl bg-[#0e0e0e] border font-mono text-xs leading-relaxed overflow-x-auto min-h-[50px] ${
                            currentResult.passed
                              ? 'text-accent-green border-accent-green/20'
                              : 'text-accent-red border-accent-red/20'
                          }`}
                        >
                          <code>{stringifyPretty(currentResult.actual)}</code>
                        </pre>
                      </div>

                      {/* Expected Output */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">
                          Expected Output
                        </span>
                        <pre className="p-3 rounded-xl bg-[#0e0e0e] border border-white/5 font-mono text-xs text-accent-green/80 leading-relaxed overflow-x-auto min-h-[50px]">
                          <code>
                            {currentResult.expected === null || currentResult.expected === undefined
                              ? '—'
                              : stringifyPretty(currentResult.expected)}
                          </code>
                        </pre>
                      </div>
                    </div>

                    {/* Stdout / Console Output Section */}
                    <div className="mt-1">
                      <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">
                        Stdout / Standard Output
                      </span>
                      <StdoutViewer logs={currentResult.logs} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
