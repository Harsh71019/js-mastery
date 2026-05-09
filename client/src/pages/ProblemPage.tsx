import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useProblem } from '@/hooks/useProblem'
import { isMcqProblem, isTrickProblem } from '@/types/problem'
import { McqProblemView } from '@/components/problems/McqProblemView'
import { TrickQuestionView } from '@/components/problems/TrickQuestionView'
import { CodingProblemView } from '@/components/problems/CodingProblemView'

const logVisit = (problemId: string): void => {
  fetch(`/api/visits/${problemId}`, { method: 'POST' }).catch(() => undefined)
}

export const ProblemPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const { problem, nextId, prevId, isLoading, error } = useProblem(id ?? '')

  useEffect(() => {
    if (problem?.id) logVisit(problem.id)
  }, [problem?.id])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
        <div className="w-2/5 border-r border-border-default p-5 flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-bg-tertiary rounded animate-pulse" />
          ))}
        </div>
        <div className="flex-1 bg-bg-primary" />
      </div>
    )
  }

  if (error === 'not_found' || !problem) return <Navigate to="/problems" replace />

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)] text-text-tertiary text-sm">
        Failed to load problem — is the server running?
      </div>
    )
  }

  if (isTrickProblem(problem)) {
    return <TrickQuestionView problem={problem} nextId={nextId} prevId={prevId} />
  }
  if (isMcqProblem(problem)) {
    return <McqProblemView problem={problem} nextId={nextId} prevId={prevId} />
  }
  return <CodingProblemView problem={problem} nextId={nextId} prevId={prevId} />
}
