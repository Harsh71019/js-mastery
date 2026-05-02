import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import type { Problem } from '@/types/problem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePanelResize } from '@/hooks/usePanelResize'
import { runTests, type TestResult } from '@/runner/executor'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { ResultsPanel } from '@/components/editor/ResultsPanel'
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

const formatInlineCode = (text: string): React.ReactNode => {
  if (!text) return null
  const parts = text.split(/(`[^`]*`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent-amber font-jetbrains text-[12px] border border-border-default/50">
          {part.replace(/^`|`$/g, '')}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}

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
  const [code, setCode] = useState(problem.starterCode)
  const [results, setResults] = useState<readonly TestResult[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const confettiFired = useRef(false)

  const { isSolved } = useProgress()
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)
  const { leftRatio, containerRef, handleMouseDown, handleMouseMove, handleMouseUp } =
    usePanelResize()

  useEffect(() => {
    setCode(problem.starterCode)
    setResults(null)
    setHasAttempted(false)
    setAllPassed(false)
    confettiFired.current = false
  }, [problem.id])

  const handleRun = useCallback(async (): Promise<void> => {
    if (isRunning) return
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
      markSolved(problem.id, {
        title: problem.title,
        category: problem.category,
        difficulty: problem.difficulty,
      })
      if (!confettiFired.current) {
        confettiFired.current = true
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
    } else {
      incrementAttempts(problem.id)
    }
  }, [problem, code, isRunning, markSolved, incrementAttempts])

  useKeyboardShortcut('Enter', handleRun)

  const handleReset = useCallback((): void => {
    setCode(problem.starterCode)
    setIsResetModalOpen(false)
  }, [problem.starterCode])

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
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
              <MarkdownContent content={problem.description} />
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
                    <span>{formatInlineCode(step)}</span>
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
