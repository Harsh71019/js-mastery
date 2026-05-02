import React from 'react'

interface McqOptionsProps {
  readonly options: readonly string[]
  readonly selectedIndex: number | null
  readonly correctIndex: number | null
  readonly onSelect: (index: number) => void
  readonly isSubmitted: boolean
}

const getOptionClass = (
  index: number,
  selectedIndex: number | null,
  correctIndex: number | null,
  isSubmitted: boolean,
): string => {
  const base = 'w-full text-left px-4 py-3 rounded border text-sm transition-colors duration-150 '
  const isSelected = selectedIndex === index
  const isCorrect = correctIndex !== null && correctIndex === index
  const isWrongSelection = isSubmitted && isSelected && !isCorrect

  if (!isSubmitted) {
    return base + (isSelected
      ? 'border-accent-blue bg-accent-blue/10 text-text-primary cursor-pointer'
      : 'border-border-default bg-bg-tertiary text-text-secondary hover:border-text-tertiary hover:text-text-primary cursor-pointer')
  }
  if (isCorrect)        return base + 'border-accent-green bg-accent-green/10 text-accent-green'
  if (isWrongSelection) return base + 'border-accent-red bg-accent-red/10 text-accent-red'
  return base + 'border-border-default bg-bg-tertiary text-text-tertiary opacity-40'
}

const getOptionIcon = (
  index: number,
  selectedIndex: number | null,
  correctIndex: number | null,
  isSubmitted: boolean,
): string => {
  if (!isSubmitted) return String.fromCharCode(65 + index)
  if (correctIndex !== null && correctIndex === index) return '✓'
  if (selectedIndex === index) return '✗'
  return String.fromCharCode(65 + index)
}

export const McqOptions = ({
  options,
  selectedIndex,
  correctIndex,
  onSelect,
  isSubmitted,
}: McqOptionsProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    {options.map((option, index) => (
      <button
        key={index}
        type="button"
        disabled={isSubmitted}
        onClick={() => onSelect(index)}
        className={getOptionClass(index, selectedIndex, correctIndex, isSubmitted)}
      >
        <span className="flex items-center gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">
            {getOptionIcon(index, selectedIndex, correctIndex, isSubmitted)}
          </span>
          {option}
        </span>
      </button>
    ))}
  </div>
)
