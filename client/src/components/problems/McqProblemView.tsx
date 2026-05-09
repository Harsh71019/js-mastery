import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import type { McqProblem } from '@/types/problem'
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
    <PageContainer className="max-w-3xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-purple text-[10px] font-bold uppercase tracking-widest bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">Quiz</span>
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest">{problem.difficulty}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-text-primary text-2xl font-bold flex items-center gap-3">
              {problem.title}
              {isSolved(problem.id) && (
                <span className="text-accent-green bg-accent-green/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-accent-green/20">Solved</span>
              )}
            </h1>
          </div>
          <MarkdownContent content={problem.description} />
        </div>

        <McqOptions
          options={problem.options}
          selectedIndex={selectedIndex}
          correctIndex={isSubmitted ? problem.correctIndex : null}
          onSelect={setSelectedIndex}
          isSubmitted={isSubmitted}
        />

        {!isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {isSubmitted && (
          <Card className={`p-6 border-l-4 ${
            isCorrect ? 'border-l-accent-green bg-accent-green/5' : 'border-l-accent-red bg-accent-red/5'
          }`}>
            <p className={`text-base font-bold mb-2 ${isCorrect ? 'text-accent-green' : 'text-accent-red'}`}>
              {isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">{problem.explanation}</p>
          </Card>
        )}

        {isSubmitted && (
          <div className="flex flex-col gap-6">
            <Divider className="opacity-50" />
            <div className="flex flex-col gap-3">
              <h2 className="text-text-primary text-sm font-bold uppercase tracking-wider">Concept Analysis</h2>
              <div className="bg-bg-secondary border border-border-default rounded-xl p-5">
                <Link
                  to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
                  className="text-accent-blue text-sm font-bold hover:underline mb-2 inline-block"
                >
                  {problem.patternTag}
                </Link>
                <p className="text-text-secondary text-sm leading-relaxed">{problem.patternExplanation}</p>
              </div>
            </div>
            
            {nextId && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(`/problem/${nextId}`)}
                className="w-full"
              >
                Next Problem →
              </Button>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
