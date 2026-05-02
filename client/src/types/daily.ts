import type { AnyProblem } from './problem'

export interface DailyChallenge {
  readonly problem:          AnyProblem
  readonly date:             string
  readonly alreadyCompleted: boolean
}
