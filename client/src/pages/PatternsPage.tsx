import React from 'react'
import { usePatterns } from '@/hooks/usePatterns'
import { PatternCard } from '@/components/patterns/PatternCard'

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="h-16 bg-bg-secondary rounded border border-border-default animate-pulse" />
    ))}
  </div>
)

export const PatternsPage = (): React.JSX.Element => {
  const { patterns, isLoading, error } = usePatterns()

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        Failed to load patterns — is the server running?
      </div>
    )
  }

  return (
    <div className="px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-text-primary font-medium">
          {isLoading ? 'Patterns' : `${patterns.length} Patterns`}
        </h1>
        <p className="text-text-tertiary text-sm mt-1">
          Browse problems grouped by the JavaScript concept they test
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.tag} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  )
}
