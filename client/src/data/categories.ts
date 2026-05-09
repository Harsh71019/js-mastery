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
  {
    slug: 'arrays',
    title: 'Arrays & Hashing',
    description: 'Core array manipulations and hashing techniques from Blind 75.',
    accentColor: '#3b82f6',
  },
  {
    slug: 'strings',
    title: 'Strings',
    description: 'Advanced string manipulation and pattern matching.',
    accentColor: '#ec4899',
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    description: 'Master pointer manipulation in linear data structures.',
    accentColor: '#8b5cf6',
  },
  {
    slug: 'trees',
    title: 'Trees',
    description: 'Hierarchical data structures, DFS, and BFS traversals.',
    accentColor: '#10b981',
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    description: 'Network traversals, topological sorts, and connectivity.',
    accentColor: '#f59e0b',
  },
  {
    slug: 'dp',
    title: 'Dynamic Programming',
    description: 'Optimization problems using memoization and tabulation.',
    accentColor: '#ef4444',
  },
  {
    slug: 'intervals',
    title: 'Intervals',
    description: 'Overlap detection and interval merging algorithms.',
    accentColor: '#f97316',
  },
  {
    slug: 'matrix',
    title: 'Matrix',
    description: '2D grid traversals and transformations.',
    accentColor: '#06b6d4',
  },
  {
    slug: 'binary',
    title: 'Binary & Bitwise',
    description: 'Bit manipulation and low-level logic.',
    accentColor: '#6366f1',
  },
  {
    slug: 'heaps',
    title: 'Heaps & Priority Queues',
    description: 'Efficient tracking of min/max elements.',
    accentColor: '#a855f7',
  },
  {
    slug: 'objects-and-classes',
    title: 'Objects & Classes',
    description: 'Deep dive into JS prototypes, inheritance, and property descriptors.',
    accentColor: '#fbbf24',
  },
  {
    slug: 'maps-and-sets',
    title: 'Maps & Sets',
    description: 'Advanced collection types, WeakMaps, and Iterators.',
    accentColor: '#22c55e',
  },
  {
    slug: 'functions-and-closures',
    title: 'Functions & Closures',
    description: 'Execution context, this binding, and lexical scope mastery.',
    accentColor: '#14b8a6',
  },
]
