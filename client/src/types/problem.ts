export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard'

export type CategorySlug =
  | 'basic-loops'
  | 'reverse-loops'
  | 'for-in-for-of'
  | 'nested-loops'
  | 'array-building'
  | 'object-loops'
  | 'two-pointer'
  | 'prefix-suffix'
  | 'sliding-window'
  | 'polyfills'
  | 'tricky-patterns'

export interface TraceTable {
  readonly inputLabel: string
  readonly columns: readonly string[]
  readonly rows: readonly Record<string, string | number>[]
}

export interface TestCase {
  readonly input: unknown
  readonly expected: unknown
  readonly label?: string
}

export interface Problem {
  readonly id: string
  readonly title: string
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly functionName: string
  readonly description: string
  readonly whatShouldHappen: readonly string[]
  readonly starterCode: string
  readonly traceTable: TraceTable
  readonly skeletonHint: string
  readonly solution: string
  readonly tests: readonly TestCase[]
  readonly patternTag: string
  readonly patternExplanation: string
  readonly estimatedMinutes: number
}
