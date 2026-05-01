import React, { useState } from 'react'

interface SkeletonHintProps {
  readonly hint: string
}

export const SkeletonHint = ({ hint }: SkeletonHintProps): React.JSX.Element => {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsRevealed((prev) => !prev)}
        className="text-accent-blue text-xs hover:underline cursor-pointer"
      >
        {isRevealed ? 'Hide hint' : "I don't know where to start"}
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isRevealed ? '400px' : '0px', opacity: isRevealed ? 1 : 0 }}
      >
        <pre className="mt-3 bg-bg-tertiary border border-border-default rounded p-4 text-text-secondary text-xs font-jetbrains leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {hint}
        </pre>
      </div>
    </div>
  )
}
