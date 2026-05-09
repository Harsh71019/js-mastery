import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { ChevronLeft } from 'lucide-react'
import type { Problem, TestCase } from '@/types/problem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePanelResize } from '@/hooks/usePanelResize'
import { useVerticalResize } from '@/hooks/useVerticalResize'
import { runTests, type TestResult, type Verdict } from '@/runner/executor'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { ResultsPanel } from '@/components/editor/ResultsPanel'
import { Button } from '@/components/ui/Button'
import { Glow } from '@/components/ui/Glow'
import { RunTimingGraph } from '@/components/problems/RunTimingGraph'
import { TraceTable } from '@/components/problems/TraceTable'
import { SkeletonHint } from '@/components/problems/SkeletonHint'
import { SolutionPanel } from '@/components/problems/SolutionPanel'
import { Modal } from '@/components/ui/Modal'
import { Divider } from '@/components/ui/Divider'
import { MarkdownContent } from '@/components/ui/MarkdownContent'

const selectMarkSolved = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.markSolved
const selectIncrementAttempts = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.incrementAttempts
const selectSolvedProblems = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.solvedProblems

const formatInlineCode = (text: string): React.ReactNode => {
  if (!text) return null
  const parts = text.split(/(`[^`]*`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-accent-amber font-geist text-[11px] border border-white/5">
          {part.replace(/^`|`$/g, '')}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}

const fetchFullTests = async (problemId: string): Promise<readonly TestCase[]> => {
  const response = await fetch(`/api/problems/${problemId}/submit-tests`)
  if (!response.ok) throw new Error(`Failed to fetch submit tests: ${response.status}`)
  const data = (await response.json()) as { tests: TestCase[] }
  return data.tests
}

const MIN_LOADING_MS = 500

interface CodingProblemViewProps {
  readonly problem: Problem
  readonly nextId: string | null
  readonly prevId: string | null
}

export const CodingProblemView = ({
  problem,
  nextId,
}: CodingProblemViewProps): React.JSX.Element => {
  const navigate = useNavigate()
  const [code, setCode] = useState(
    () => useProgressStore.getState().solvedProblems[problem.id]?.acceptedCode ?? problem.starterCode,
  )
  const [results, setResults] = useState<readonly TestResult[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [lastAction, setLastAction] = useState<'run' | 'submit' | null>(null)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const confettiFired = useRef(false)

  const isAccepted = lastAction === 'submit' && verdict === 'Accepted'

  const { isSolved } = useProgress()
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)
  const solvedProblems = useProgressStore(selectSolvedProblems)
  const runTimings = solvedProblems[problem.id]?.runTimings ?? []
  const savedCode = solvedProblems[problem.id]?.acceptedCode
  const { leftRatio, containerRef, handleMouseDown, handleMouseMove, handleMouseUp } =
    usePanelResize()

  const { 
    height: terminalHeight, 
    handleMouseDown: handleTerminalMouseDown, 
    handleMouseMove: handleTerminalMouseMove, 
    handleMouseUp: handleTerminalMouseUp 
  } = useVerticalResize()

  useEffect(() => {
    window.addEventListener('mousemove', handleTerminalMouseMove)
    window.addEventListener('mouseup', handleTerminalMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleTerminalMouseMove)
      window.removeEventListener('mouseup', handleTerminalMouseUp)
    }
  }, [handleTerminalMouseMove, handleTerminalMouseUp])

  useEffect(() => {
    const saved = useProgressStore.getState().solvedProblems[problem.id]?.acceptedCode
    setCode(saved ?? problem.starterCode)
    setResults(null)
    setHasAttempted(false)
    setVerdict(null)
    setLastAction(null)
    confettiFired.current = false
  }, [problem.id])

  useEffect(() => {
    if (!savedCode) return
    setCode((current) => (current === problem.starterCode ? savedCode : current))
  }, [savedCode, problem.starterCode])

  const handleRun = useCallback(async (): Promise<void> => {
    if (isRunning || isSubmitting) return
    setIsRunning(true)
    setHasAttempted(true)
    setLastAction('run')

    const visibleTests = problem.tests.filter((t) => !t.hidden)
    const start = Date.now()
    const execution = await runTests(code, problem.functionName, visibleTests)
    const elapsed = Date.now() - start
    if (elapsed < MIN_LOADING_MS) await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed))

    setResults(execution.results)
    setVerdict(execution.verdict)
    setIsRunning(false)

    incrementAttempts(problem.id, execution.executionTimeMs)
  }, [problem, code, isRunning, isSubmitting, incrementAttempts])

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isRunning || isSubmitting) return
    setIsSubmitting(true)
    setHasAttempted(true)
    setLastAction('submit')

    try {
      const fullTests = await fetchFullTests(problem.id)
      const start = Date.now()
      const execution = await runTests(code, problem.functionName, fullTests)
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_MS) await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed))

      setResults(execution.results)
      setVerdict(execution.verdict)

      if (execution.verdict === 'Accepted') {
        markSolved(
          problem.id,
          { title: problem.title, category: problem.category, difficulty: problem.difficulty },
          execution.executionTimeMs,
          code,
        )
        if (!confettiFired.current) {
          confettiFired.current = true
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
        }
      } else {
        incrementAttempts(problem.id, execution.executionTimeMs)
      }

      fetch(`/api/submissions/${problem.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict: execution.verdict,
          code,
          executionTimeMs: execution.executionTimeMs,
        }),
      }).catch(() => undefined)
    } catch {
      setVerdict('Runtime Error')
    } finally {
      setIsSubmitting(false)
    }
  }, [problem, code, isRunning, isSubmitting, markSolved, incrementAttempts])

  useKeyboardShortcut('Enter', handleSubmit)

  const handleReset = useCallback((): void => {
    setCode(problem.starterCode)
    setIsResetModalOpen(false)
  }, [problem.starterCode])

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-bg-primary">
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {!isFocusMode && (
          <div
            className="flex flex-col overflow-y-auto border-r border-white/5 relative bg-bg-primary"
            style={{ width: `${leftRatio}%` }}
          >
            <div className="flex flex-col gap-8 p-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-accent-blue text-[10px] font-bold uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20 font-geist">Problem</span>
                  <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest font-geist">{problem.difficulty}</span>
                </div>
                <h1 className="text-text-primary text-2xl font-bold mb-4 flex items-center gap-3 tracking-tight">
                  {problem.title}
                  {isSolved(problem.id) && (
                    <span className="text-accent-green bg-accent-green/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-accent-green/20 font-geist">Verified</span>
                  )}
                </h1>
                <MarkdownContent content={problem.description} />

                <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-xl p-5 font-geist text-xs text-text-secondary leading-relaxed shadow-inner">
                  <p className="text-text-tertiary mb-3 font-bold uppercase tracking-widest text-[9px] opacity-50">Example Test Case</p>
                  {problem.tests[0] && (
                    <div className="flex flex-col gap-2">
                      <p><span className="text-text-tertiary uppercase text-[9px] font-bold">Input:</span> <span className="bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5 ml-2">{JSON.stringify((problem.tests[0].input as unknown[])?.join(', ') ?? problem.tests[0].input)}</span></p>
                      <p><span className="text-text-tertiary uppercase text-[9px] font-bold">Output:</span> <span className="bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5 ml-2 text-accent-green font-bold">{JSON.stringify(problem.tests[0].expected)}</span></p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] px-1 font-geist">Performance</h2>
                <RunTimingGraph timings={runTimings} />
              </div>

              <Divider className="opacity-20" />

              <div className="flex flex-col gap-4">
                <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] px-1 font-geist">Thinking Process</h2>
                <ol className="flex flex-col gap-3">
                  {problem.whatShouldHappen.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-4 text-sm text-text-secondary leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] hover:border-white/10 transition-colors duration-200">
                      <span className="text-accent-blue font-bold font-geist text-xs mt-0.5 opacity-50">{String(stepIndex + 1).padStart(2, '0')}</span>
                      <span className="flex-1">{formatInlineCode(step)}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Divider className="opacity-20" />

              <div className="flex flex-col gap-4">
                <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] px-1 font-geist">Simulation</h2>
                <TraceTable traceTable={problem.traceTable} />
              </div>

              <Divider className="opacity-20" />

              <div className="flex flex-col gap-4">
                <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] px-1 font-geist">Skeleton Logic</h2>
                <SkeletonHint hint={problem.skeletonHint} />
              </div>

              <Divider className="opacity-20" />

              <SolutionPanel
                solution={problem.solution}
                patternTag={problem.patternTag}
                patternExplanation={problem.patternExplanation}
                hasAttempted={hasAttempted}
              />
            </div>
          </div>
        )}

        <div
          onMouseDown={handleMouseDown}
          className={`w-1.5 bg-bg-secondary hover:bg-accent-blue/20 cursor-col-resize transition-all duration-300 shrink-0 active:bg-accent-blue/30 group relative flex items-center justify-center ${isFocusMode ? 'cursor-default w-0' : ''}`}
        >
          {!isFocusMode && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 group-hover:bg-accent-blue/40 transition-colors shadow-glow-sm" />
          )}

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`absolute z-20 w-6 h-10 bg-bg-secondary border border-white/10 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-white/20 transition-all duration-300 shadow-xl ${isFocusMode ? 'left-4 rotate-180' : '-translate-x-1/2'}`}
            title={isFocusMode ? 'Show Description' : 'Focus Mode'}
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden relative">
          {isFocusMode && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
              <Glow color="var(--color-accent-blue)" size="xl" className="-top-1/2 -left-1/4" />
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-white/[0.01] shrink-0 z-10">
            <div className="flex items-center gap-3">
              <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] font-geist">SCR_JS_ENGINE</span>
              {isFocusMode && (
                <span className="text-accent-blue text-[9px] font-bold uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20 animate-pulse font-geist">Focus Active</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest hover:text-text-secondary font-geist"
              >
                Reset
              </Button>
              <div className="w-px h-4 bg-white/10" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRun}
                isLoading={isRunning}
                disabled={isRunning || isSubmitting}
                className="text-text-secondary text-[10px] font-bold uppercase tracking-widest hover:text-text-primary font-geist border border-white/10 hover:border-white/20 px-3"
              >
                Run
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isRunning || isSubmitting}
                className="text-[10px] font-bold uppercase tracking-widest font-geist px-4 bg-accent-blue/90 hover:bg-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              >
                Submit
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          <div 
            onMouseDown={handleTerminalMouseDown}
            className="h-1 bg-bg-secondary hover:bg-accent-blue/40 cursor-row-resize transition-all duration-300 shrink-0 border-t border-white/5 group/vresizer relative z-20"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 group-hover/vresizer:bg-accent-blue/40 transition-colors shadow-glow-sm" />
          </div>

          <div className="border-t border-white/5 shrink-0 z-10" style={{ height: `${terminalHeight}px` }}>
            {isAccepted && (
              <div className="flex items-center justify-between px-6 py-2.5 bg-accent-green/5 border-b border-accent-green/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-accent-green/5 animate-pulse pointer-events-none" />
                <span className="text-accent-green text-[10px] font-bold uppercase tracking-[0.1em] font-geist relative z-10">
                  Submission Accepted — All test cases passed
                </span>
                {nextId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent-green hover:text-accent-green font-geist text-[10px] font-bold uppercase tracking-widest relative z-10 border-accent-green/20 hover:bg-accent-green/10"
                    onClick={() => navigate(`/problem/${nextId}`)}
                  >
                    Next Problem →
                  </Button>
                )}
              </div>
            )}
            <div style={{ height: isAccepted ? `calc(${terminalHeight}px - 45px)` : `${terminalHeight}px` }}>
              <ResultsPanel
                results={results}
                isRunning={isRunning || isSubmitting}
                verdict={verdict ?? undefined}
                action={lastAction}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isResetModalOpen}
        title="Reset Buffer?"
        message="This will restore the original starter code. Current progress in the buffer will be purged."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  )
}
