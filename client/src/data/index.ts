import type { Problem, CategorySlug } from '@/types/problem'
import { CATEGORIES } from './categories'
import { basicLoopsProblems } from './problems/basic-loops'
import { reverseLoopsProblems } from './problems/reverse-loops'
import { forInForOfProblems } from './problems/for-in-for-of'
import { nestedLoopsProblems } from './problems/nested-loops'
import { arrayBuildingProblems } from './problems/array-building'
import { objectLoopsProblems } from './problems/object-loops'
import { twoPointerProblems } from './problems/two-pointer'
import { prefixSuffixProblems } from './problems/prefix-suffix'
import { slidingWindowProblems } from './problems/sliding-window'
import { polyfillsProblems } from './problems/polyfills'
import { trickyPatternsProblems } from './problems/tricky-patterns'

export const problems: readonly Problem[] = [
  ...basicLoopsProblems,
  ...reverseLoopsProblems,
  ...forInForOfProblems,
  ...nestedLoopsProblems,
  ...arrayBuildingProblems,
  ...objectLoopsProblems,
  ...twoPointerProblems,
  ...prefixSuffixProblems,
  ...slidingWindowProblems,
  ...polyfillsProblems,
  ...trickyPatternsProblems,
]

export const getProblemById = (id: string): Problem | undefined =>
  problems.find((problem) => problem.id === id)

export const getProblemsByCategory = (slug: CategorySlug): readonly Problem[] =>
  problems.filter((problem) => problem.category === slug)

export const getCategories = () => CATEGORIES

export { CATEGORIES } from './categories'
export type { Category } from './categories'
