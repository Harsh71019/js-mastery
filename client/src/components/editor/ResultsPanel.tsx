import React from 'react'
import type { TestResult } from '@/runner/executor'

interface ResultsPanelProps {
  readonly results: readonly TestResult[] | null
  readonly isRunning: boolean
}

const stringify = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  return JSON.stringify(value)
}

const TestCard = ({ result, index }: { result: TestResult; index: number }): React.JSX.Element => (
  <div
    className={`rounded border-l-[3px] px-3 py-2.5 bg-bg-tertiary text-xs shrink-0 min-w-[180px] ${
      result.passed ? 'border-accent-green' : 'border-accent-red'
    }`}
  >
    <p className="text-text-tertiary mb-2 font-medium">Test {index + 1}</p>
    {result.error ? (
      <p className="text-accent-red font-jetbrains break-all">{result.error}</p>
    ) : (
      <div className="flex flex-col gap-1 font-jetbrains">
        <p>
          <span className="text-text-tertiary">Input: </span>
          <span className="text-text-secondary">{stringify(result.input)}</span>
        </p>
        <p>
          <span className="text-text-tertiary">Expected: </span>
          <span className="text-text-secondary">{stringify(result.expected)}</span>
        </p>
        <p>
          <span className="text-text-tertiary">Got: </span>
          <span className={result.passed ? 'text-accent-green' : 'text-accent-red'}>
            {stringify(result.actual)}
          </span>
        </p>
      </div>
    )}
  </div>
)

export const ResultsPanel = ({ results, isRunning }: ResultsPanelProps): React.JSX.Element => {
  if (isRunning) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary text-sm">
        Running…
      </div>
    )
  }

  if (!results) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary text-sm">
        Run your code to see results
      </div>
    )
  }

  const passCount = results.filter((result) => result.passed).length

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-y-auto">
      <p className="text-text-secondary text-xs shrink-0">
        <span className={passCount === results.length ? 'text-accent-green' : 'text-accent-red'}>
          {passCount} / {results.length}
        </span>{' '}
        tests passed
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {results.map((result, index) => (
          <TestCard key={index} result={result} index={index} />
        ))}
      </div>
    </div>
  )
}
