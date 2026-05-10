export const USER_ID = 'default'

export const Difficulty = {
  Beginner: 'Beginner',
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard',
} as const
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]

export const ProblemType = {
  Coding: 'coding',
  Mcq: 'mcq',
  Trick: 'trick',
} as const
export type ProblemType = (typeof ProblemType)[keyof typeof ProblemType]

export const ProblemStatus = {
  Draft: 'draft',
  Published: 'published',
} as const
export type ProblemStatus = (typeof ProblemStatus)[keyof typeof ProblemStatus]

export const Verdict = {
  Accepted: 'accepted',
  WrongAnswer: 'wrong-answer',
  Error: 'error',
} as const
export type Verdict = (typeof Verdict)[keyof typeof Verdict]
