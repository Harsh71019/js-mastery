import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getProblemById, problems } from '@/data'
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
  const problem = getProblemById(id ?? '')

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

  const currentIndex = problems.findIndex((p) => p.id === id)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < problems.length - 1

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

    incrementAttempts(problem.id)

    const passed = execution.results.every((r) => r.passed)
    setAllPassed(passed)

    if (passed) {
      markSolved(problem.id)
      if (!confettiFired.current) {
        confettiFired.current = true
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
    }
  }, [problem, code, isRunning, markSolved, incrementAttempts])

  useKeyboardShortcut('Enter', handleRun)

  const handleMouseDown = useCallback((): void => {
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent): void => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const ratio = ((event.clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(75, Math.max(25, ratio))
      setLeftRatio(clamped)
      localStorage.setItem(PANEL_RATIO_KEY, String(clamped))
    },
    [],
  )

  const handleMouseUp = useCallback((): void => {
    isDragging.current = false
  }, [])

  const handleReset = useCallback((): void => {
    if (!problem) return
    setCode(problem.starterCode)
    setIsResetModalOpen(false)
  }, [problem])

  if (!problem) return <Navigate to="/problems" replace />

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        problem={problem}
        problemIndex={currentIndex}
        totalProblems={problems.length}
        onPrev={() => navigate(`/problem/${problems[currentIndex - 1].id}`)}
        onNext={() => navigate(`/problem/${problems[currentIndex + 1].id}`)}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />

      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left panel */}
        <div
          className="flex flex-col overflow-y-auto border-r border-border-default"
          style={{ width: `${leftRatio}%` }}
        >
          <div className="flex flex-col gap-6 p-5">
            {/* Section 1 — Problem */}
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

            {/* Section 2 — How to think about it */}
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

            {/* Section 3 — Trace table */}
            <TraceTable traceTable={problem.traceTable} />

            <Divider />

            {/* Section 4 — Skeleton hint */}
            <SkeletonHint hint={problem.skeletonHint} />

            <Divider />

            {/* Section 5 — Solution */}
            <SolutionPanel
              solution={problem.solution}
              patternTag={problem.patternTag}
              patternExplanation={problem.patternExplanation}
              hasAttempted={hasAttempted}
            />
          </div>
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-border-default hover:bg-accent-blue/50 cursor-col-resize transition-colors duration-150 shrink-0 active:bg-accent-blue"
        />

        {/* Right panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Sub-bar */}
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

          {/* Editor */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          {/* Results panel */}
          <div className="border-t border-border-default shrink-0" style={{ height: '220px' }}>
            {allPassed && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#052e16] border-b border-accent-green/30">
                <span className="text-accent-green text-sm font-medium">
                  All {results?.length} tests passed 🎉
                </span>
                {canGoNext && (
                  <button
                    type="button"
                    onClick={() => navigate(`/problem/${problems[currentIndex + 1].id}`)}
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

          {/* Run button */}
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
