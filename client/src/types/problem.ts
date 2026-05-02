export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard'

export type ProblemType = 'coding' | 'mcq' | 'trick'

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

export interface ProblemSummary {
  readonly id: string
  readonly title: string
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly patternTag: string
  readonly estimatedMinutes: number
  readonly type?: ProblemType
}

export interface Problem {
  readonly id: string
  readonly title: string
  readonly type?: 'coding'
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

export interface McqProblem {
  readonly id: string
  readonly title: string
  readonly type: 'mcq'
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly description: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
  readonly patternTag: string
  readonly patternExplanation: string
  readonly estimatedMinutes: number
}

export interface TrickProblem {
  readonly id: string
  readonly title: string
  readonly type: 'trick'
  readonly category: CategorySlug
  readonly difficulty: Difficulty
  readonly description?: string
  readonly codeSnippet: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly gotchaExplanation: string
  readonly patternTag: string
  readonly patternExplanation: string
  readonly estimatedMinutes: number
}

export type AnyProblem = Problem | McqProblem | TrickProblem

export const isMcqProblem = (p: AnyProblem): p is McqProblem => p.type === 'mcq'
export const isTrickProblem = (p: AnyProblem): p is TrickProblem => p.type === 'trick'

export interface Pagination {
  readonly page: number
  readonly limit: number
  readonly total: number
  readonly totalPages: number
}

export interface PatternSummary {
  readonly tag:   string
  readonly count: number
}
