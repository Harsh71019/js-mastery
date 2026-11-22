import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { TrickProblem } from '@/types/problem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { McqOptions } from './McqOptions'
import { Divider } from '@/components/ui/Divider'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

const selectMarkSolved = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.markSolved
const selectIncrementAttempts = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.incrementAttempts

interface TrickQuestionViewProps {
  readonly problem: TrickProblem
  readonly nextId: string | null
  readonly prevId: string | null
}

export const TrickQuestionView = ({
  problem,
  nextId,
  prevId,
}: TrickQuestionViewProps): React.JSX.Element => {
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const confettiFired = useRef(false)

  const { isSolved } = useProgress()
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)

  const isAlreadySolved = isSolved(problem.id)

  const isCorrect = selectedIndex === problem.correctIndex

  const handleSubmit = useCallback((): void => {
    if (selectedIndex === null || isSubmitted) return
    setIsSubmitted(true)
    if (isCorrect) {
      markSolved(problem.id, {
        title: problem.title,
        category: problem.category,
        difficulty: problem.difficulty,
        type: problem.type,
      })
      if (!confettiFired.current) {
        confettiFired.current = true
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
    } else {
      incrementAttempts(problem.id)
    }
  }, [selectedIndex, isSubmitted, isCorrect, problem, markSolved, incrementAttempts])

  const handleRevealAnswer = (): void => {
    setSelectedIndex(problem.correctIndex)
    setIsSubmitted(true)
  }

  const handleReset = (): void => {
    setSelectedIndex(null)
    setIsSubmitted(false)
    confettiFired.current = false
  }

  // Keyboard shortcut support: 1-6 or A-F to select, Enter to submit, Alt+Left/Right to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return
      }

      if ((e.altKey || e.metaKey) && e.key === 'ArrowLeft' && prevId) {
        e.preventDefault()
        navigate(`/problem/${prevId}`)
        return
      }
      if ((e.altKey || e.metaKey) && e.key === 'ArrowRight' && nextId) {
        e.preventDefault()
        navigate(`/problem/${nextId}`)
        return
      }

      if (!isSubmitted) {
        const num = parseInt(e.key, 10)
        if (!isNaN(num) && num >= 1 && num <= problem.options.length) {
          e.preventDefault()
          setSelectedIndex(num - 1)
          return
        }

        const charCode = e.key.toUpperCase().charCodeAt(0)
        if (e.key.length === 1 && charCode >= 65 && charCode < 65 + problem.options.length) {
          e.preventDefault()
          setSelectedIndex(charCode - 65)
          return
        }

        if (e.key === 'Enter' && selectedIndex !== null) {
          e.preventDefault()
          handleSubmit()
        }
      } else if (e.key === 'Enter' && nextId) {
        e.preventDefault()
        navigate(`/problem/${nextId}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitted, selectedIndex, handleSubmit, nextId, prevId, navigate, problem.options.length])

  return (
    <PageContainer className="max-w-3xl">
      <div className="flex flex-col gap-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <Link
            to="/quiz"
            className="flex items-center gap-2 text-text-tertiary hover:text-text-primary text-xs font-geist uppercase tracking-widest transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            <span>Quiz Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => prevId && navigate(`/problem/${prevId}`)}
              disabled={!prevId}
              className="text-[11px] font-geist uppercase tracking-widest px-2.5 py-1 text-text-tertiary hover:text-text-primary disabled:opacity-30"
              title="Previous Question (Alt+Left)"
            >
              <ChevronLeft size={14} className="mr-1" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nextId && navigate(`/problem/${nextId}`)}
              disabled={!nextId}
              className="text-[11px] font-geist uppercase tracking-widest px-2.5 py-1 text-text-tertiary hover:text-text-primary disabled:opacity-30"
              title="Next Question (Alt+Right or Enter)"
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Problem Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-amber text-[10px] font-bold uppercase tracking-widest bg-accent-amber/10 px-2 py-0.5 rounded border border-accent-amber/20">
              Trick Question
            </span>
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
              {problem.difficulty}
            </span>
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest font-geist opacity-60 ml-auto">
              {problem.estimatedMinutes} min
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-text-primary text-2xl font-bold flex items-center gap-3">
              {problem.title}
              {isAlreadySolved && (
                <span className="text-accent-green bg-accent-green/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-accent-green/20">
                  Solved
                </span>
              )}
            </h1>
          </div>

          {problem.description && (
            <MarkdownContent content={problem.description} />
          )}
        </div>

        {/* Code Snippet Card */}
        <Card className="bg-bg-tertiary shadow-inner border border-border-default overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-default/50 bg-bg-secondary/50">
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
              Output prediction
            </span>
            <span className="text-[10px] font-bold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded border border-accent-amber/20 font-geist">
              JS
            </span>
          </div>
          <pre className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm font-jetbrains text-text-primary overflow-x-auto leading-relaxed whitespace-pre">
            {problem.codeSnippet}
          </pre>
        </Card>

        {/* Options */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest font-geist">
              Predict the output {selectedIndex !== null && !isSubmitted && <span className="hidden sm:inline">• Press Enter to Submit</span>}
            </span>
            {isAlreadySolved && !isSubmitted && (
              <button
                type="button"
                onClick={handleRevealAnswer}
                className="flex items-center gap-1.5 text-accent-amber hover:underline text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                <Eye size={12} />
                View Answer
              </button>
            )}
          </div>
          <McqOptions
            options={problem.options}
            selectedIndex={selectedIndex}
            correctIndex={isSubmitted ? problem.correctIndex : null}
            onSelect={setSelectedIndex}
            isSubmitted={isSubmitted}
          />
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            variant="primary"
            size="lg"
            className="w-full font-geist uppercase tracking-widest text-xs"
          >
            Submit Answer
          </Button>
        )}

        {/* Gotcha Explanation Card */}
        {isSubmitted && (
          <Card
            className={`p-6 border-l-4 ${
              isCorrect
                ? 'border-l-accent-green bg-accent-green/5'
                : 'border-l-accent-red bg-accent-red/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-base font-bold ${
                  isCorrect ? 'text-accent-green' : 'text-accent-red'
                }`}
              >
                {isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-text-tertiary hover:text-text-primary text-[10px] font-bold uppercase tracking-wider font-geist cursor-pointer"
              >
                <RotateCcw size={12} />
                Retry
              </button>
            </div>
            <div className="text-text-secondary text-sm leading-relaxed">
              <MarkdownContent content={problem.gotchaExplanation} />
            </div>
          </Card>
        )}

        {/* Concept Analysis & Next Steps */}
        {isSubmitted && (
          <div className="flex flex-col gap-6">
            <Divider className="opacity-50" />
            <div className="flex flex-col gap-3">
              <h2 className="text-text-primary text-sm font-bold uppercase tracking-wider">
                Concept Analysis
              </h2>
              <div className="bg-bg-secondary border border-border-default rounded-xl p-5 flex flex-col gap-2">
                <Link
                  to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
                  className="text-accent-amber text-sm font-bold hover:underline inline-block"
                >
                  {problem.patternTag}
                </Link>
                <MarkdownContent content={problem.patternExplanation} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {prevId && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(`/problem/${prevId}`)}
                  className="flex-1 font-geist text-xs uppercase tracking-widest"
                >
                  ← Previous
                </Button>
              )}
              {nextId ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/problem/${nextId}`)}
                  className="flex-1 font-geist text-xs uppercase tracking-widest"
                >
                  Next Problem →
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/quiz')}
                  className="flex-1 font-geist text-xs uppercase tracking-widest"
                >
                  Return to Quiz Hub
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
