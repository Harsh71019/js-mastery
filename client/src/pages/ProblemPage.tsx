import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useProblem } from '@/hooks/useProblem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { runTests, type TestResult } from '@/runner/executor'
import { TopBar } from '@/components/layout/TopBar'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { ResultsPanel } from '@/components/editor/ResultsPanel'
import { TraceTable } from '@/components/problems/TraceTable'
import { SkeletonHint } from '@/components/problems/SkeletonHint'
import { SolutionPanel } from '@/components/problems/SolutionPanel'
import { Modal } from '@/components/ui/Modal'
import { Divider } from '@/components/ui/Divider'

const PANEL_RATIO_KEY = 'js-trainer-panel-ratio'
const DEFAULT_LEFT_RATIO = 40

const selectMarkSolved = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.markSolved
const selectIncrementAttempts = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.incrementAttempts

const getSavedRatio = (): number => {
  const saved = localStorage.getItem(PANEL_RATIO_KEY)
  const parsed = saved ? parseFloat(saved) : NaN
  return isNaN(parsed) ? DEFAULT_LEFT_RATIO : Math.min(75, Math.max(25, parsed))
}

export const ProblemPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { problem, prevId, nextId, isLoading, error } = useProblem(id ?? '')

  const [code, setCode] = useState('')
  const [results, setResults] = useState<readonly TestResult[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [leftRatio, setLeftRatio] = useState(getSavedRatio)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const confettiFired = useRef(false)

  const { isSolved } = useProgress()
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)

  useEffect(() => {
    if (!problem) return
    setCode(problem.starterCode)
    setResults(null)
    setHasAttempted(false)
    setAllPassed(false)
    confettiFired.current = false
  }, [problem?.id])

  const handleRun = useCallback(async (): Promise<void> => {
    if (!problem || isRunning) return
    setIsRunning(true)
    setHasAttempted(true)

    const start = Date.now()
    const execution = await runTests(code, problem.functionName, problem.tests)
    const elapsed = Date.now() - start
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed))

    setResults(execution.results)
    setIsRunning(false)

    const passed = execution.results.every((r) => r.passed)
    setAllPassed(passed)

    if (passed) {
      markSolved(problem.id)
      if (!confettiFired.current) {
        confettiFired.current = true
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
    } else {
      incrementAttempts(problem.id)
    }
  }, [problem, code, isRunning, markSolved, incrementAttempts])

  useKeyboardShortcut('Enter', handleRun)

  const handleMouseDown = useCallback((): void => {
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent): void => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = ((event.clientX - rect.left) / rect.width) * 100
    const clamped = Math.min(75, Math.max(25, ratio))
    setLeftRatio(clamped)
    localStorage.setItem(PANEL_RATIO_KEY, String(clamped))
  }, [])

  const handleMouseUp = useCallback((): void => {
    isDragging.current = false
  }, [])

  const handleReset = useCallback((): void => {
    if (!problem) return
    setCode(problem.starterCode)
    setIsResetModalOpen(false)
  }, [problem])

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="h-12 border-b border-border-default bg-bg-primary shrink-0 animate-pulse" />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-2/5 border-r border-border-default p-5 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-bg-tertiary rounded animate-pulse" />
            ))}
          </div>
          <div className="flex-1 bg-bg-primary" />
        </div>
      </div>
    )
  }

  if (error === 'not_found' || !problem) return <Navigate to="/problems" replace />

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-text-tertiary text-sm">
        Failed to load problem — is the server running?
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        problem={problem}
        onPrev={() => prevId && navigate(`/problem/${prevId}`)}
        onNext={() => nextId && navigate(`/problem/${nextId}`)}
        canGoPrev={prevId !== null}
        canGoNext={nextId !== null}
      />

      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="flex flex-col overflow-y-auto border-r border-border-default"
          style={{ width: `${leftRatio}%` }}
        >
          <div className="flex flex-col gap-6 p-5">
            <div>
              <h1 className="text-text-primary text-lg font-medium mb-3">
                {problem.title}
                {isSolved(problem.id) && (
                  <span className="ml-2 text-accent-green text-sm font-normal">✓ Solved</span>
                )}
              </h1>
              <p className="text-text-secondary text-sm leading-7">{problem.description}</p>
              <div className="mt-4 bg-bg-tertiary border-l-[3px] border-accent-blue rounded-r px-4 py-3 font-jetbrains text-xs text-text-secondary leading-relaxed">
                {problem.tests[0] && (
                  <>
                    <p>Input: {JSON.stringify((problem.tests[0].input as unknown[])?.join(', ') ?? problem.tests[0].input)}</p>
                    <p>Output: {JSON.stringify(problem.tests[0].expected)}</p>
                  </>
                )}
              </div>
            </div>

            <Divider />

            <div>
              <p className="text-text-tertiary text-xs uppercase tracking-wide mb-3">
                How to think about it
              </p>
              <ol className="flex flex-col gap-2">
                {problem.whatShouldHappen.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="text-text-tertiary shrink-0 w-4">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Divider />
            <TraceTable traceTable={problem.traceTable} />
            <Divider />
            <SkeletonHint hint={problem.skeletonHint} />
            <Divider />
            <SolutionPanel
              solution={problem.solution}
              patternTag={problem.patternTag}
              patternExplanation={problem.patternExplanation}
              hasAttempted={hasAttempted}
            />
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-border-default hover:bg-accent-blue/50 cursor-col-resize transition-colors duration-150 shrink-0 active:bg-accent-blue"
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-default shrink-0">
            <span className="text-text-tertiary text-xs">JavaScript</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-text-tertiary text-xs hover:text-text-secondary transition-colors duration-150 cursor-pointer"
              >
                Reset code
              </button>
              <span className="text-text-tertiary text-xs">Ctrl + Enter to run</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          <div className="border-t border-border-default shrink-0" style={{ height: '220px' }}>
            {allPassed && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#052e16] border-b border-accent-green/30">
                <span className="text-accent-green text-sm font-medium">
                  All {results?.length} tests passed 🎉
                </span>
                {nextId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/problem/${nextId}`)}
                    className="text-accent-green text-xs hover:underline cursor-pointer"
                  >
                    Next Problem →
                  </button>
                )}
              </div>
            )}
            <div style={{ height: allPassed ? 'calc(220px - 41px)' : '220px' }}>
              <ResultsPanel results={results} isRunning={isRunning} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-3 bg-bg-tertiary border-t border-border-default text-text-primary text-sm font-medium hover:bg-border-default transition-colors duration-150 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-text-tertiary border-t-text-primary rounded-full animate-spin" />
                Running…
              </span>
            ) : (
              'Run Code'
            )}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isResetModalOpen}
        title="Reset code?"
        message="This will restore the original starter code. Your current solution will be lost."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  )
}
