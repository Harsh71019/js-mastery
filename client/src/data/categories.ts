import type { CategorySlug } from '@/types/problem'

export interface Category {
  readonly slug: CategorySlug
  readonly title: string
  readonly description: string
  readonly accentColor: string
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'basic-loops',
    title: 'Basic Loops',
    description: 'Foundation of iteration — for loops, while loops, and counters.',
    accentColor: '#3b82f6',
  },
  {
    slug: 'reverse-loops',
    title: 'Reverse Loops',
    description: 'Iterate backwards through arrays and strings.',
    accentColor: '#8b5cf6',
  },
  {
    slug: 'for-in-for-of',
    title: 'for...in / for...of',
    description: 'Modern iteration over iterables and object keys.',
    accentColor: '#06b6d4',
  },
  {
    slug: 'nested-loops',
    title: 'Nested Loops',
    description: 'Multi-dimensional iteration and pair-finding patterns.',
    accentColor: '#f59e0b',
  },
  {
    slug: 'array-building',
    title: 'Array Building',
    description: 'Construct new arrays from existing data using loops.',
    accentColor: '#22c55e',
  },
  {
    slug: 'object-loops',
    title: 'Object Loops',
    description: 'Iterate over object keys, values, and entries.',
    accentColor: '#f97316',
  },
  {
    slug: 'array-methods',
    title: 'Array Methods',
    description: 'Master slice, splice, map, filter, and other essential array transformations.',
    accentColor: '#fbbf24',
  },
  {
    slug: 'two-pointer',
    title: 'Two Pointer',
    description: 'Solve problems by moving two indices toward each other.',
    accentColor: '#ec4899',
  },
  {
    slug: 'prefix-suffix',
    title: 'Prefix & Suffix',
    description: 'Build running totals and suffix products in one or two passes.',
    accentColor: '#a855f7',
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    description: 'Maintain a fixed or variable-size window across an array.',
    accentColor: '#14b8a6',
  },
  {
    slug: 'polyfills',
    title: 'Polyfills',
    description: 'Re-implement built-in array methods from scratch.',
    accentColor: '#6366f1',
  },
  {
    slug: 'tricky-patterns',
    title: 'Tricky Patterns',
    description: 'Classic interview puzzles that require careful loop logic.',
    accentColor: '#ef4444',
  },
]
