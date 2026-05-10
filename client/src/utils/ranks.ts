export interface MasteryRank {
  readonly level: string
  readonly label: string
  readonly color: string
  readonly minSolved: number
}

export const MASTERY_RANKS: readonly MasteryRank[] = [
  { level: 'L4', label: 'SYSTEM_OVERSEER', color: 'var(--color-accent-purple)', minSolved: 200 },
  { level: 'L3', label: 'DATA_ARCHITECT',  color: 'var(--color-accent-blue)',   minSolved: 100 },
  { level: 'L2', label: 'NODE_OPERATOR',   color: 'var(--color-accent-green)',  minSolved: 50 },
  { level: 'L1', label: 'CORE_INITIATE',   color: 'var(--color-accent-amber)',  minSolved: 10 },
  { level: 'L0', label: 'NEURAL_GUEST',    color: 'var(--color-text-tertiary)', minSolved: 0 },
]

export const getMasteryRank = (solvedCount: number): MasteryRank => {
  return MASTERY_RANKS.find(rank => solvedCount >= rank.minSolved) || MASTERY_RANKS[MASTERY_RANKS.length - 1]
}
