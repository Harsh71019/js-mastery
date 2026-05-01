import type { Problem } from '@/types/problem'

export const nestedLoopsProblems: readonly Problem[] = [
  {
    id: 'nested-loops-1',
    title: 'All Pairs Sum',
    category: 'nested-loops',
    difficulty: 'Easy',
    functionName: 'allPairsSum',
    description:
      'Given an array of numbers and a target, return all unique index pairs [i, j] where i < j and nums[i] + nums[j] === target.',
    whatShouldHappen: [
      'Use an outer loop to pick the first element.',
      'Use an inner loop starting one position ahead to pick the second element.',
      'If the pair sums to the target, add [i, j] to the results.',
      'Return all matching pairs.',
    ],
    starterCode: `function allPairsSum(nums, target) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4], target = 5',
      columns: ['i', 'j', 'nums[i]+nums[j]', 'match'],
      rows: [
        { i: 0, j: 1, 'nums[i]+nums[j]': 3, match: 'no' },
        { i: 0, j: 2, 'nums[i]+nums[j]': 4, match: 'no' },
        { i: 0, j: 3, 'nums[i]+nums[j]': 5, match: 'yes' },
        { i: 1, j: 2, 'nums[i]+nums[j]': 5, match: 'yes' },
        { i: 1, j: 3, 'nums[i]+nums[j]': 6, match: 'no' },
        { i: 2, j: 3, 'nums[i]+nums[j]': 7, match: 'no' },
      ],
    },
    skeletonHint: `function allPairsSum(nums, target) {
  const pairs = [];
  for (let i = 0; i < ____; i++) {
    for (let j = ____; j < nums.length; j++) {
      if (____) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}`,
    solution: `function allPairsSum(nums, target) {
  // collect every matching pair of indices
  const pairs = [];
  // outer loop picks the first element of the pair
  for (let i = 0; i < nums.length - 1; i++) {
    // inner loop starts at i+1 to avoid duplicates and self-pairs
    for (let j = i + 1; j < nums.length; j++) {
      // check if this pair hits the target
      if (nums[i] + nums[j] === target) {
        pairs.push([i, j]);
      }
    }
  }
  // return all matching index pairs
  return pairs;
}`,
    tests: [
      { input: [[1, 2, 3, 4], 5], expected: [[0, 3], [1, 2]], label: 'two pairs' },
      { input: [[1, 1, 1], 2], expected: [[0, 1], [0, 2], [1, 2]], label: 'duplicate values' },
      { input: [[1, 2, 3], 10], expected: [], label: 'no matching pairs' },
      { input: [[5], 5], expected: [], label: 'single element' },
    ],
    patternTag: 'Nested Loop Pairing',
    patternExplanation:
      'The inner loop starts at i+1 to guarantee i < j — this ensures every pair is checked exactly once without revisiting or counting a pair twice.',
    estimatedMinutes: 10,
  },
  {
    id: 'nested-loops-2',
    title: 'Multiplication Table',
    category: 'nested-loops',
    difficulty: 'Beginner',
    functionName: 'multiplicationTable',
    description:
      'Given a number n, return a 2D array of size n×n where table[i][j] = (i+1) * (j+1).',
    whatShouldHappen: [
      'Create an empty outer array.',
      'Outer loop runs n times, creating one row per iteration.',
      'Inner loop runs n times, filling each column of the row.',
      'Push the completed row into the outer array and return it.',
    ],
    starterCode: `function multiplicationTable(n) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'n = 3',
      columns: ['i', 'j', 'value', 'row after inner loop'],
      rows: [
        { i: 0, j: 0, value: 1, 'row after inner loop': '[1, 2, 3]' },
        { i: 1, j: 0, value: 2, 'row after inner loop': '[2, 4, 6]' },
        { i: 2, j: 0, value: 3, 'row after inner loop': '[3, 6, 9]' },
      ],
    },
    skeletonHint: `function multiplicationTable(n) {
  const table = [];
  for (let i = 0; i < ____; i++) {
    const row = [];
    for (let j = 0; j < ____; j++) {
      row.push(____);
    }
    table.push(row);
  }
  return table;
}`,
    solution: `function multiplicationTable(n) {
  // outer array holds all n rows
  const table = [];
  // each iteration of the outer loop produces one row
  for (let i = 0; i < n; i++) {
    // fresh row for this iteration
    const row = [];
    // each iteration of the inner loop fills one column in this row
    for (let j = 0; j < n; j++) {
      // i and j are 0-indexed so add 1 before multiplying
      row.push((i + 1) * (j + 1));
    }
    // commit the completed row to the table
    table.push(row);
  }
  // return the fully filled 2D array
  return table;
}`,
    tests: [
      { input: [3], expected: [[1, 2, 3], [2, 4, 6], [3, 6, 9]], label: '3×3 table' },
      { input: [1], expected: [[1]], label: '1×1 table' },
      { input: [2], expected: [[1, 2], [2, 4]], label: '2×2 table' },
      { input: [4], expected: [[1, 2, 3, 4], [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16]], label: '4×4 table' },
    ],
    patternTag: '2D Array Construction',
    patternExplanation:
      'Nested loops where the outer index selects the row and the inner index selects the column — the standard pattern for building or traversing 2D grids.',
    estimatedMinutes: 8,
  },
]
