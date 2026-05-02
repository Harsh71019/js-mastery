import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import type { McqProblem } from '@/types/problem'
import { useProgressStore } from '@/store/useProgressStore'
import { useProgress } from '@/hooks/useProgress'
import { McqOptions } from './McqOptions'
import { DifficultyBadge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'

const selectMarkSolved = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.markSolved
const selectIncrementAttempts = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.incrementAttempts

interface McqProblemViewProps {
  readonly problem: McqProblem
  readonly nextId: string | null
  readonly prevId: string | null
}

export const McqProblemView = ({
  problem,
  nextId,
}: McqProblemViewProps): React.JSX.Element => {
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const confettiFired = useRef(false)

  const { isSolved } = useProgress()
  const markSolved = useProgressStore(selectMarkSolved)
  const incrementAttempts = useProgressStore(selectIncrementAttempts)

  useEffect(() => {
    setSelectedIndex(null)
    setIsSubmitted(false)
    confettiFired.current = false
  }, [problem.id])

  const isCorrect = selectedIndex === problem.correctIndex

  const handleSubmit = (): void => {
    if (selectedIndex === null || isSubmitted) return
    setIsSubmitted(true)
    if (isCorrect) {
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
  }

  return (
    <div className="flex justify-center px-4 py-8 overflow-y-auto h-[calc(100vh-3rem)]">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-text-primary text-lg font-medium">
            {problem.title}
            {isSolved(problem.id) && (
              <span className="ml-2 text-accent-green text-sm font-normal">✓ Solved</span>
            )}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        <p className="text-text-secondary text-sm leading-7">{problem.description}</p>

        <Divider />

        <McqOptions
          options={problem.options}
          selectedIndex={selectedIndex}
          correctIndex={isSubmitted ? problem.correctIndex : null}
          onSelect={setSelectedIndex}
          isSubmitted={isSubmitted}
        />

        {!isSubmitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className="w-full py-3 bg-bg-tertiary border border-border-default text-text-primary text-sm font-medium rounded hover:bg-border-default transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Answer
          </button>
        )}

        {isSubmitted && (
          <div className={`rounded border px-4 py-4 flex flex-col gap-2 ${
            isCorrect ? 'border-accent-green/30 bg-[#052e16]' : 'border-accent-red/30 bg-[#2d0a0a]'
          }`}>
            <p className={`text-sm font-medium ${isCorrect ? 'text-accent-green' : 'text-accent-red'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Wrong answer'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">{problem.explanation}</p>
          </div>
        )}

        {isSubmitted && (
          <>
            <Divider />
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary text-xs uppercase tracking-wide">Pattern</p>
              <Link
                to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
                className="text-accent-blue text-sm font-medium hover:underline"
              >
                {problem.patternTag}
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed">{problem.patternExplanation}</p>
            </div>
            {nextId && (
              <button
                type="button"
                onClick={() => navigate(`/problem/${nextId}`)}
                className="w-full py-3 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium rounded hover:bg-accent-blue/20 transition-colors duration-150 cursor-pointer"
              >
                Next Problem →
              </button>
            )}
          </>
        )}

      </div>
    </div>
  )
}
