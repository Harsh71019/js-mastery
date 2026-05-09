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
  const base = 'w-full text-left px-5 py-4 rounded-xl border text-[13px] font-medium transition-all duration-300 '
  const isSelected = selectedIndex === index
  const isCorrect = correctIndex !== null && correctIndex === index
  const isWrongSelection = isSubmitted && isSelected && !isCorrect

  if (!isSubmitted) {
    return base + (isSelected
      ? 'border-accent-blue/40 bg-accent-blue/10 text-text-primary cursor-pointer shadow-glow-sm scale-[1.01]'
      : 'border-white/5 bg-white/[0.02] text-text-secondary hover:border-white/20 hover:bg-white/[0.04] cursor-pointer')
  }
  if (isCorrect)        return base + 'border-accent-green/40 bg-accent-green/10 text-accent-green shadow-[0_0_15px_rgba(34,197,94,0.15)]'
  if (isWrongSelection) return base + 'border-accent-red/40 bg-accent-red/10 text-accent-red shadow-[0_0_15px_rgba(239,68,68,0.15)]'
  return base + 'border-white/5 bg-white/[0.01] text-text-tertiary opacity-40 grayscale'
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

const formatOption = (text: string): React.ReactNode => {
  if (!text) return null
  const parts = text.split(/(`[^`]*`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-accent-amber font-geist text-[11px] border border-white/10">
          {part.replace(/^`|`$/g, '')}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export const McqOptions = ({
  options,
  selectedIndex,
  correctIndex,
  onSelect,
  isSubmitted,
}: McqOptionsProps): React.JSX.Element => (
  <div className="flex flex-col gap-3">
    {options.map((option, index) => (
      <button
        key={index}
        type="button"
        disabled={isSubmitted}
        onClick={() => onSelect(index)}
        className={getOptionClass(index, selectedIndex, correctIndex, isSubmitted)}
      >
        <span className="flex items-center gap-4">
          <span className={`shrink-0 w-7 h-7 rounded-lg border border-current/20 flex items-center justify-center text-[10px] font-bold font-geist transition-all duration-300 ${selectedIndex === index ? 'bg-current/10 border-current/40' : 'bg-white/5'}`}>
            {getOptionIcon(index, selectedIndex, correctIndex, isSubmitted)}
          </span>
          <span className="flex-1 leading-relaxed font-geist tracking-tight">
            {formatOption(option)}
          </span>
        </span>
      </button>
    ))}
  </div>
)
