import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import {
  ChevronLeft,
  Zap,
  FileText,
  Lightbulb,
  Table2,
  Code2,
  BookOpen,
  RotateCcw,
  Play,
  CheckCircle2,
  History,
  Copy,
  Check,
  AlignLeft,
  StickyNote,
} from 'lucide-react'
import type { Problem, TestCase, LogicStep } from '@/types/problem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePanelResize } from '@/hooks/usePanelResize'
import { useVerticalResize } from '@/hooks/useVerticalResize'
import { usePatternArticles } from '@/hooks/usePatternArticles'
import { runTests, type TestResult, type Verdict } from '@/runner/executor'
import { CodeEditor, type CodeEditorHandle } from '@/components/editor/CodeEditor'
import { ResultsPanel } from '@/components/editor/ResultsPanel'
import { SubmissionsPanel } from '@/components/problems/SubmissionsPanel'
import { NotesPanel } from '@/components/problems/NotesPanel'
import { useProblemNote } from '@/hooks/useProblemNote'
import { Button } from '@/components/ui/Button'
import { Glow } from '@/components/ui/Glow'
import { RunTimingGraph } from '@/components/problems/RunTimingGraph'
import { TraceTable } from '@/components/problems/TraceTable'
import { SkeletonHint } from '@/components/problems/SkeletonHint'
import { SolutionPanel } from '@/components/problems/SolutionPanel'
import { RelatedArticles } from '@/components/insights/RelatedArticles'
import { RecallDiffPanel } from '@/components/review/RecallDiffPanel'
import { Modal } from '@/components/ui/Modal'
import { Divider } from '@/components/ui/Divider'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
import { DifficultyBadge } from '@/components/ui/Badge'

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
  const { data } = (await response.json()) as { success: boolean; data: { tests: TestCase[] } }
  return data.tests
}

const toServerVerdict = (verdict: Verdict): string => {
  if (verdict === 'Accepted') return 'accepted'
  if (verdict === 'Wrong Answer') return 'wrong-answer'
  if (verdict === 'Time Limit Exceeded') return 'time-limit-exceeded'
  if (verdict === 'Memory Limit Exceeded') return 'memory-limit-exceeded'
  return 'error'
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
  const [searchParams] = useSearchParams()
  const isRecallMode = searchParams.get('mode') === 'recall'
  const editorRef = useRef<CodeEditorHandle>(null)
  const [code, setCode] = useState(() => {
    if (isRecallMode) return ''
    return useProgressStore.getState().solvedProblems[problem.id]?.acceptedCode ?? problem.starterCode
  })
  const [results, setResults] = useState<readonly TestResult[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [lastAction, setLastAction] = useState<'run' | 'submit' | null>(null)
  const [executionTimeMs, setExecutionTimeMs] = useState<number | undefined>(undefined)
  const [memoryUsageMb, setMemoryUsageMb] = useState<number | undefined>(undefined)
  const [beatsRuntime, setBeatsRuntime] = useState<number | undefined>(undefined)
  const [beatsMemory, setBeatsMemory] = useState<number | undefined>(undefined)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'thinking' | 'simulation' | 'solution' | 'articles' | 'submissions' | 'notes'>('description')
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [isRecallSuccess, setIsRecallSuccess] = useState(false)
  const [isGaveUp, setIsGaveUp] = useState(false)
  const [hasCopiedCode, setHasCopiedCode] = useState(false)
  const [testcases, setTestcases] = useState<readonly TestCase[]>(() =>
    problem.tests.filter((t) => !t.hidden),
  )
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [activeBottomTab, setActiveBottomTab] = useState<'testcase' | 'result'>('testcase')
  const confettiFired = useRef(false)

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [mobileTab, setMobileTab] = useState<'problem' | 'code' | 'results'>('problem')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAccepted = lastAction === 'submit' && verdict === 'Accepted'

  const { isSolved } = useProgress()
  const { hasNote } = useProblemNote(problem.id)
  const { articles: relatedArticles, isLoading: isLoadingArticles } = usePatternArticles(problem.patternTag)
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)
  const completeRecall = useProgressStore((state) => state.completeRecall)
  const skipRecall = useProgressStore((state) => state.skipRecall)
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
    if (!savedCode || isRecallMode) return
    // Synchronize starter code with asynchronously loaded accepted code from progress store
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode((current) => (current === problem.starterCode ? savedCode : current))
  }, [savedCode, problem.starterCode, isRecallMode])

  const handleCopyCode = useCallback(() => {
    void navigator.clipboard.writeText(code)
    setHasCopiedCode(true)
    setTimeout(() => setHasCopiedCode(false), 2000)
  }, [code])

  const handleUpdateCaseInput = useCallback((index: number, newInput: unknown) => {
    setTestcases((prev) => {
      const next = [...prev]
      if (next[index]) {
        next[index] = { ...next[index], input: newInput, custom: true }
      }
      return next
    })
  }, [])

  const handleAddCustomCase = useCallback(() => {
    const newCase: TestCase = {
      input: [],
      expected: undefined,
      custom: true,
    }
    setTestcases((prev) => {
      const updated = [...prev, newCase]
      setActiveCaseIndex(updated.length - 1)
      return updated
    })
  }, [setActiveCaseIndex])

  const handleDeleteCase = useCallback((index: number) => {
    setTestcases((prev) => prev.filter((_, i) => i !== index))
    setActiveCaseIndex((prev) => Math.max(0, prev - 1))
  }, [setActiveCaseIndex])

  const handleResetTestcases = useCallback(() => {
    setTestcases(problem.tests.filter((t) => !t.hidden))
    setActiveCaseIndex(0)
  }, [problem.tests, setActiveCaseIndex])

  const handleRun = useCallback(async (): Promise<void> => {
    if (isRunning || isSubmitting) return
    setIsRunning(true)
    setHasAttempted(true)
    setLastAction('run')
    setActiveBottomTab('result')
    if (isMobile) {
      setMobileTab('results')
    }

    const start = Date.now()
    const execution = await runTests(code, problem.functionName, testcases)
    const elapsed = Date.now() - start
    if (elapsed < MIN_LOADING_MS) await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed))

    setResults(execution.results)
    setVerdict(execution.verdict)
    setExecutionTimeMs(execution.executionTimeMs)
    setMemoryUsageMb(execution.memoryUsageMb)
    setBeatsRuntime(undefined)
    setBeatsMemory(undefined)
    setIsRunning(false)

    incrementAttempts(problem.id, execution.executionTimeMs, execution.memoryUsageMb, execution.memoryBytes)
  }, [problem.id, problem.functionName, code, testcases, isRunning, isSubmitting, isMobile, incrementAttempts, setActiveBottomTab, setMobileTab])

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isRunning || isSubmitting) return
    setIsSubmitting(true)
    setHasAttempted(true)
    setLastAction('submit')
    setActiveBottomTab('result')
    if (isMobile) {
      setMobileTab('results')
    }

    try {
      const fullTests = await fetchFullTests(problem.id)
      const start = Date.now()
      const execution = await runTests(code, problem.functionName, fullTests)
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_MS) await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed))

      setResults(execution.results)
      setVerdict(execution.verdict)
      setExecutionTimeMs(execution.executionTimeMs)
      setMemoryUsageMb(execution.memoryUsageMb)

      if (execution.verdict === 'Accepted') {
        if (isRecallMode) {
          setIsRecallSuccess(true)
        } else {
          markSolved(
            problem.id,
            { title: problem.title, category: problem.category, difficulty: problem.difficulty },
            execution.executionTimeMs,
            code,
            execution.memoryUsageMb,
            execution.memoryBytes,
          )
        }
        if (!confettiFired.current) {
          confettiFired.current = true
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
        }
      } else {
        incrementAttempts(problem.id, execution.executionTimeMs, execution.memoryUsageMb, execution.memoryBytes)
      }

      fetch(`/api/submissions/${problem.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict: toServerVerdict(execution.verdict),
          code,
          executionTimeMs: execution.executionTimeMs,
          cpuTimeMs: execution.cpuTimeMs,
          memoryUsageMb: execution.memoryUsageMb,
          memoryBytes: execution.memoryBytes,
        }),
      })
        .then((res) => {
          if (!res.ok) return null
          return res.json() as Promise<{ success: boolean; data: { beatsRuntime?: number; beatsMemory?: number } }>
        })
        .then((payload) => {
          if (payload?.data) {
            if (typeof payload.data.beatsRuntime === 'number') setBeatsRuntime(payload.data.beatsRuntime)
            if (typeof payload.data.beatsMemory === 'number') setBeatsMemory(payload.data.beatsMemory)
          }
        })
        .catch(() => undefined)
    } catch {
      setVerdict('Runtime Error')
    } finally {
      setIsSubmitting(false)
    }
  }, [problem, code, isRunning, isSubmitting, isMobile, markSolved, incrementAttempts, isRecallMode, setActiveBottomTab, setMobileTab])

  useKeyboardShortcut('Enter', handleSubmit)

  const handleReset = useCallback((): void => {
    setCode(isRecallMode ? '' : problem.starterCode)
    setIsResetModalOpen(false)
  }, [problem.starterCode, isRecallMode, setCode, setIsResetModalOpen])

  const handleRecallComplete = useCallback(async () => {
    if (isGaveUp) {
      await skipRecall(problem.id)
    } else {
      await completeRecall(problem.id)
    }
    navigate('/review')
  }, [completeRecall, skipRecall, problem.id, navigate, isGaveUp])

  const handleStepClick = (step: string | LogicStep, index: number) => {
    const pattern = typeof step === 'object' ? step.pattern : undefined
    if (pattern) {
      setActiveStepIndex(index)
      editorRef.current?.highlightPattern(pattern)
    } else {
      setActiveStepIndex(null)
      editorRef.current?.clearHighlights()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-bg-primary">
      {/* Mobile Workspace Switcher */}
      <div className="flex md:hidden items-center border-b border-white/[0.08] bg-[#0c0c0c] shrink-0 px-2 py-1.5 gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setMobileTab('problem')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'problem'
              ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'text-text-tertiary hover:text-text-secondary border border-transparent'
          }`}
        >
          <FileText size={13} />
          <span>Problem</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'code'
              ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'text-text-tertiary hover:text-text-secondary border border-transparent'
          }`}
        >
          <Code2 size={13} />
          <span>Code</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('results')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
            mobileTab === 'results'
              ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'text-text-tertiary hover:text-text-secondary border border-transparent'
          }`}
        >
          <Zap size={13} />
          <span>Results</span>
          {isRunning || isSubmitting ? (
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-ping" />
          ) : isAccepted ? (
            <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_6px_var(--color-accent-green)]" />
          ) : verdict ? (
            <span className="w-2 h-2 rounded-full bg-accent-red shadow-[0_0_6px_var(--color-accent-red)]" />
          ) : null}
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row flex-1 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {!isFocusMode && (
          <div
            className={`flex-col border-r border-white/[0.08] relative bg-[#0a0a0a] ${
              mobileTab === 'problem' ? 'flex flex-1 w-full' : 'hidden'
            } md:flex`}
            style={isMobile ? { width: '100%' } : { width: `${leftRatio}%` }}
          >
            {/* Left Panel Tabs Header */}
            <div className="flex items-center px-4 border-b border-white/[0.08] bg-[#0c0c0c] shrink-0 gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'Problem', icon: <FileText size={13} /> },
                ...(!isRecallMode && problem.whatShouldHappen?.length ? [{ id: 'thinking', label: 'Thinking', icon: <Lightbulb size={13} />, count: problem.whatShouldHappen.length }] : []),
                ...(!isRecallMode && problem.traceTable ? [{ id: 'simulation', label: 'Simulation', icon: <Table2 size={13} /> }] : []),
                ...(!isRecallMode ? [{ id: 'solution', label: 'Solution', icon: <Code2 size={13} /> }] : []),
                ...(!isRecallMode ? [{ id: 'submissions', label: 'Submissions', icon: <History size={13} /> }] : []),
                ...(!isRecallMode ? [{ id: 'notes', label: 'Notes', icon: <StickyNote size={13} />, hasIndicator: hasNote }] : []),
                ...(relatedArticles.length > 0 ? [{ id: 'articles', label: 'Articles', icon: <BookOpen size={13} />, count: relatedArticles.length }] : []),
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLeftTab(tab.id as typeof activeLeftTab)}
                  className={`px-3 py-2.5 text-xs font-semibold font-geist uppercase tracking-wider transition-all border-b-2 -mb-px flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeLeftTab === tab.id
                      ? 'text-accent-blue border-accent-blue bg-white/[0.04]'
                      : 'text-text-tertiary border-transparent hover:text-text-secondary hover:bg-white/[0.02]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {'hasIndicator' in tab && tab.hasIndicator && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_6px_var(--color-accent-blue)]" />
                  )}
                  {'count' in tab && tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 border border-white/10 text-text-tertiary">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Left Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {activeLeftTab === 'description' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DifficultyBadge difficulty={problem.difficulty} />
                      <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/10 font-geist">
                        {problem.patternTag}
                      </span>
                      {isSolved(problem.id) && (
                        <span className="text-accent-green bg-accent-green/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-accent-green/20 font-geist flex items-center gap-1">
                          <CheckCircle2 size={12} /> Solved
                        </span>
                      )}
                    </div>
                    <h1 className="text-text-primary text-2xl font-bold mb-4 tracking-tight">
                      {problem.title}
                    </h1>
                    <MarkdownContent content={problem.description} />

                    <div className="mt-6 bg-white/[0.02] border border-white/10 rounded-xl p-5 font-geist text-xs text-text-secondary leading-relaxed shadow-inner">
                      <p className="text-text-tertiary mb-3 font-bold uppercase tracking-wider text-[10px]">Example Test Case</p>
                      {problem.tests[0] && (
                        <div className="flex flex-col gap-2.5">
                          <div>
                            <span className="text-text-tertiary uppercase text-[9px] font-bold mr-2">Input:</span> 
                            <span className="bg-white/[0.04] px-2 py-1 rounded border border-white/10 font-geist text-text-primary">
                              {JSON.stringify((problem.tests[0].input as unknown[])?.join(', ') ?? problem.tests[0].input)}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary uppercase text-[9px] font-bold mr-2">Output:</span> 
                            <span className="bg-white/[0.04] px-2 py-1 rounded border border-white/10 text-accent-green font-bold font-geist">
                              {JSON.stringify(problem.tests[0].expected)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h2 className="text-text-primary text-xs font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary">Performance Metrics</h2>
                    <RunTimingGraph timings={runTimings} />
                  </div>

                  {!isRecallMode && (
                    <div className="flex flex-col gap-3">
                      <h2 className="text-text-primary text-xs font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary">Quick Skeleton Logic</h2>
                      <SkeletonHint hint={problem.skeletonHint} />
                    </div>
                  )}
                </div>
              )}

              {activeLeftTab === 'thinking' && !isRecallMode && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] font-geist">Logic Steps</h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-blue uppercase tracking-wider">
                      <Zap size={11} className="animate-pulse" /> Click step to inspect in code
                    </div>
                  </div>
                  <ol className="flex flex-col gap-3">
                    {problem.whatShouldHappen.map((step, stepIndex) => {
                      const isObject = typeof step === 'object'
                      const text = isObject ? step.text : step
                      const pattern = isObject ? step.pattern : undefined
                      const isActive = activeStepIndex === stepIndex

                      return (
                        <li 
                          key={stepIndex} 
                          onClick={() => handleStepClick(step, stepIndex)}
                          className={`
                            flex gap-3.5 text-sm text-text-secondary leading-relaxed bg-white/[0.02] p-4 rounded-xl border transition-all duration-200 group/step
                            ${pattern ? 'cursor-pointer hover:bg-accent-blue/[0.04]' : ''}
                            ${isActive ? 'border-accent-blue/40 bg-accent-blue/[0.06] shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] translate-x-1' : 'border-white/[0.05]'}
                          `}
                        >
                          <span className={`font-bold font-geist text-xs mt-0.5 transition-colors ${isActive ? 'text-accent-blue' : 'text-accent-blue opacity-50 group-hover/step:opacity-100'}`}>
                            {String(stepIndex + 1).padStart(2, '0')}
                          </span>
                          <span className={`flex-1 transition-colors ${isActive ? 'text-white font-medium' : ''}`}>
                            {formatInlineCode(text)}
                          </span>
                          {pattern && !isActive && (
                            <Zap size={13} className="text-text-tertiary opacity-0 group-hover/step:opacity-60 transition-opacity shrink-0 mt-0.5" />
                          )}
                        </li>
                      )
                    })}
                  </ol>

                  <Divider className="opacity-20" />
                  <div className="flex flex-col gap-3">
                    <h2 className="text-text-primary text-xs font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary">Skeleton Logic</h2>
                    <SkeletonHint hint={problem.skeletonHint} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'simulation' && !isRecallMode && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-text-primary text-sm font-bold uppercase tracking-[0.2em] font-geist">State Simulation</h2>
                    <span className="text-text-tertiary text-[10px] font-geist uppercase">Trace execution loops</span>
                  </div>
                  <TraceTable 
                    traceTable={problem.traceTable} 
                    onRowClick={() => editorRef.current?.highlightPattern('for \\(|while \\(|if \\(')}
                  />
                </div>
              )}

              {activeLeftTab === 'solution' && !isRecallMode && (
                <div className="flex flex-col gap-4">
                  <SolutionPanel
                    solution={problem.solution}
                    patternTag={problem.patternTag}
                    patternExplanation={problem.patternExplanation}
                    hasAttempted={hasAttempted}
                  />
                </div>
              )}

              {activeLeftTab === 'submissions' && !isRecallMode && (
                <div className="flex flex-col gap-4">
                  <SubmissionsPanel
                    problemId={problem.id}
                    onLoadCode={(savedCode) => setCode(savedCode)}
                  />
                </div>
              )}

              {activeLeftTab === 'notes' && !isRecallMode && (
                <div className="flex flex-col gap-4 flex-1 h-full min-h-[420px]">
                  <NotesPanel
                    problemId={problem.id}
                    problemTitle={problem.title}
                  />
                </div>
              )}

              {activeLeftTab === 'articles' && relatedArticles.length > 0 && (
                <div className="flex flex-col gap-4">
                  <RelatedArticles articles={relatedArticles} isLoading={isLoadingArticles} />
                </div>
              )}

              {isMobile && (
                <div className="sticky bottom-0 left-0 right-0 p-3 -mx-6 -mb-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-6 z-10">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setMobileTab('code')}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider font-geist flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Code2 size={15} />
                    <span>Open Code Editor</span>
                    <span>→</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panel Resizer (Desktop Only) */}
        <div
          onMouseDown={handleMouseDown}
          className={`hidden md:flex w-1.5 bg-[#0a0a0a] hover:bg-accent-blue/30 cursor-col-resize transition-all duration-200 shrink-0 active:bg-accent-blue/40 group relative items-center justify-center ${isFocusMode ? 'cursor-default w-0' : ''}`}
        >
          {!isFocusMode && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 group-hover:bg-accent-blue/50 transition-colors" />
          )}

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`absolute z-20 w-6 h-9 bg-[#111111] border border-white/10 rounded-full flex items-center justify-center text-text-tertiary hover:text-white hover:border-white/30 transition-all duration-200 shadow-xl ${isFocusMode ? 'left-4 rotate-180' : '-translate-x-1/2'}`}
            title={isFocusMode ? 'Show Description' : 'Focus Mode'}
          >
            <ChevronLeft size={13} />
          </button>
        </div>

        {/* Right Panel: Editor & Results */}
        <div
          className={`flex-col flex-1 overflow-hidden relative bg-[#050505] ${
            mobileTab !== 'problem' ? 'flex w-full' : 'hidden'
          } md:flex`}
          style={isMobile ? { width: '100%' } : { width: `${100 - leftRatio}%` }}
        >
          {isFocusMode && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
              <Glow color="var(--color-accent-blue)" size="xl" className="-top-1/2 -left-1/4" />
            </div>
          )}

          {/* Top Bar for Code */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2 border-b border-white/[0.08] bg-[#0c0c0c] shrink-0 z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-text-secondary text-xs font-semibold font-geist flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]" />
                <span className="hidden sm:inline">JavaScript (ES2024)</span>
                <span className="sm:hidden">JS (ES2024)</span>
              </span>
              {isFocusMode && (
                <span className="text-accent-blue text-[9px] font-bold uppercase tracking-wider bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20 animate-pulse font-geist">Focus Active</span>
              )}
              {isRecallMode && (
                <span className="text-accent-amber text-[9px] font-bold uppercase tracking-wider bg-accent-amber/10 px-2 py-0.5 rounded border border-accent-amber/20 animate-pulse font-geist shadow-glow-sm">Recall Mode</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editorRef.current?.format()}
                className="text-text-tertiary text-xs font-bold uppercase tracking-wider hover:text-text-primary font-geist flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5"
                title="Format code"
              >
                <AlignLeft size={12} />
                <span className="hidden lg:inline">Format</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="text-text-tertiary text-xs font-bold uppercase tracking-wider hover:text-text-primary font-geist flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5"
                title="Copy code to clipboard"
              >
                {hasCopiedCode ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
                <span className="hidden lg:inline">{hasCopiedCode ? 'Copied' : 'Copy'}</span>
              </Button>
              {isRecallMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsGaveUp(true)}
                  disabled={isRecallSuccess || isGaveUp}
                  className="text-accent-red text-xs font-bold uppercase tracking-wider hover:text-accent-red hover:bg-accent-red/10 font-geist border border-accent-red/20 px-2 sm:px-3"
                >
                  Give Up
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                className="text-text-tertiary text-xs font-bold uppercase tracking-wider hover:text-text-primary font-geist flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3"
                title="Reset starter code"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRun}
                isLoading={isRunning}
                disabled={isRunning || isSubmitting}
                className="hidden sm:flex text-text-primary text-xs font-bold uppercase tracking-wider font-geist px-3.5 items-center gap-1.5"
              >
                <Play size={12} className="text-accent-blue" />
                <span>Run</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isRunning || isSubmitting}
                className="hidden sm:flex text-xs font-bold uppercase tracking-wider font-geist px-4 items-center gap-1.5"
              >
                <span>Submit</span>
                <span className="text-[10px] opacity-70">↵</span>
              </Button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div
            className={`flex-1 overflow-hidden ${
              isMobile && mobileTab === 'results' ? 'hidden' : 'flex flex-col'
            }`}
            style={{ minHeight: 0 }}
          >
            <CodeEditor ref={editorRef} value={code} onChange={setCode} />
          </div>

          {/* Mobile Bottom Action Bar when editing code */}
          {isMobile && mobileTab === 'code' && (
            <div className="flex items-center gap-2 p-2.5 border-t border-white/[0.08] bg-[#0a0a0a] shrink-0 z-10 pb-safe">
              <Button
                variant="secondary"
                size="md"
                onClick={handleRun}
                isLoading={isRunning}
                disabled={isRunning || isSubmitting}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider font-geist flex items-center justify-center gap-1.5"
              >
                <Play size={13} className="text-accent-blue" />
                <span>Run Tests</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isRunning || isSubmitting}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider font-geist flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              >
                <span>Submit</span>
                <span className="text-[10px]">↵</span>
              </Button>
            </div>
          )}

          {/* Desktop Vertical Resizer */}
          <div 
            onMouseDown={handleTerminalMouseDown}
            className="hidden md:block h-1 bg-bg-secondary hover:bg-accent-blue/40 cursor-row-resize transition-all duration-300 shrink-0 border-t border-white/5 group/vresizer relative z-20"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 group-hover/vresizer:bg-accent-blue/40 transition-colors shadow-glow-sm" />
          </div>

          {/* Results Panel Container */}
          <div
            className={`border-t border-white/5 shrink-0 z-10 ${
              isMobile ? (mobileTab === 'results' ? 'flex-1 flex flex-col overflow-hidden' : 'hidden') : ''
            }`}
            style={isMobile ? undefined : { height: `${terminalHeight}px` }}
          >
            {isAccepted && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-accent-green/5 border-b border-accent-green/20 relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-full bg-accent-green/5 animate-pulse pointer-events-none" />
                <span className="text-accent-green text-[10px] font-bold uppercase tracking-[0.1em] font-geist relative z-10 truncate mr-2">
                  Accepted — All passed
                </span>
                {nextId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent-green hover:text-accent-green font-geist text-[10px] font-bold uppercase tracking-widest relative z-10 border-accent-green/20 hover:bg-accent-green/10 shrink-0"
                    onClick={() => navigate(`/problem/${nextId}`)}
                  >
                    Next Problem →
                  </Button>
                )}
              </div>
            )}
            <div
              className="flex-1 overflow-hidden"
              style={isMobile ? undefined : { height: isAccepted ? `calc(${terminalHeight}px - 45px)` : `${terminalHeight}px` }}
            >
              <ResultsPanel
                results={results}
                isRunning={isRunning || isSubmitting}
                verdict={verdict ?? undefined}
                action={lastAction}
                executionTimeMs={executionTimeMs}
                memoryUsageMb={memoryUsageMb}
                beatsRuntime={beatsRuntime}
                beatsMemory={beatsMemory}
                testcases={testcases}
                activeCaseIndex={activeCaseIndex}
                onSelectCase={setActiveCaseIndex}
                onUpdateCaseInput={handleUpdateCaseInput}
                onAddCustomCase={handleAddCustomCase}
                onDeleteCase={handleDeleteCase}
                onResetTestcases={handleResetTestcases}
                activeBottomTab={activeBottomTab}
                onTabChange={setActiveBottomTab}
                onRun={handleRun}
              />
            </div>

            {/* Mobile Back to Code Button in Results */}
            {isMobile && mobileTab === 'results' && (
              <div className="p-2.5 border-t border-white/[0.08] bg-[#0a0a0a] shrink-0 pb-safe">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setMobileTab('code')}
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-wider font-geist flex items-center justify-center gap-1.5"
                >
                  <Code2 size={13} />
                  <span>Return to Code Editor</span>
                </Button>
              </div>
            )}
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

      {(isRecallSuccess || isGaveUp) && (
        <RecallDiffPanel
          originalCode={problem.solution}
          modifiedCode={code}
          isGaveUp={isGaveUp}
          onComplete={handleRecallComplete}
        />
      )}
    </div>
  )
}
