import type { Problem } from '@/types/problem'

export const basicLoopsProblems: readonly Problem[] = [
  {
    id: 'basic-loops-1',
    title: 'Sum an Array',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'sumArray',
    description:
      'Given an array of numbers, return the sum of all elements. If the array is empty, return 0.',
    whatShouldHappen: [
      'Start with a running total of 0.',
      'Visit every element in the array from left to right.',
      'Add each element to the running total.',
      'Return the total after the loop ends.',
    ],
    starterCode: `function sumArray(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4]',
      columns: ['i', 'nums[i]', 'total'],
      rows: [
        { i: 0, 'nums[i]': 1, total: 1 },
        { i: 1, 'nums[i]': 2, total: 3 },
        { i: 2, 'nums[i]': 3, total: 6 },
        { i: 3, 'nums[i]': 4, total: 10 },
      ],
    },
    skeletonHint: `function sumArray(nums) {
  let total = ____;
  for (let i = 0; i < ____; i++) {
    total += ____;
  }
  return ____;
}`,
    solution: `function sumArray(nums) {
  // start the running total at zero
  let total = 0;
  // visit each index from 0 up to (but not including) the length
  for (let i = 0; i < nums.length; i++) {
    // add the current element to the running total
    total += nums[i];
  }
  // return the accumulated sum
  return total;
}`,
    tests: [
      { input: [[1, 2, 3, 4]], expected: 10, label: 'normal input' },
      { input: [[5]], expected: 5, label: 'single element' },
      { input: [[]], expected: 0, label: 'empty array' },
      { input: [[-1, -2, 3]], expected: 0, label: 'negative numbers' },
    ],
    patternTag: 'Accumulator',
    patternExplanation:
      'The accumulator pattern initializes a variable before the loop and updates it on every iteration, producing a single result from a collection.',
    estimatedMinutes: 5,
  },
  {
    id: 'basic-loops-2',
    title: 'Find the Max',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'findMax',
    description:
      'Given a non-empty array of numbers, return the largest value. Do not use Math.max.',
    whatShouldHappen: [
      'Assume the first element is the current maximum.',
      'Loop through the remaining elements.',
      'If an element is larger than the current maximum, update the maximum.',
      'Return the maximum after the loop.',
    ],
    starterCode: `function findMax(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [3, 1, 7, 2, 5]',
      columns: ['i', 'nums[i]', 'max'],
      rows: [
        { i: 0, 'nums[i]': 3, max: 3 },
        { i: 1, 'nums[i]': 1, max: 3 },
        { i: 2, 'nums[i]': 7, max: 7 },
        { i: 3, 'nums[i]': 2, max: 7 },
        { i: 4, 'nums[i]': 5, max: 7 },
      ],
    },
    skeletonHint: `function findMax(nums) {
  let max = ____;
  for (let i = ____; i < nums.length; i++) {
    if (nums[i] > ____) {
      max = ____;
    }
  }
  return ____;
}`,
    solution: `function findMax(nums) {
  // seed the max with the first element so we have a valid baseline
  let max = nums[0];
  // start at index 1 since index 0 is already the baseline
  for (let i = 1; i < nums.length; i++) {
    // if the current element beats the current max, update it
    if (nums[i] > max) {
      max = nums[i];
    }
  }
  // max now holds the largest value in the array
  return max;
}`,
    tests: [
      { input: [[3, 1, 7, 2, 5]], expected: 7, label: 'normal input' },
      { input: [[42]], expected: 42, label: 'single element' },
      { input: [[-5, -1, -3]], expected: -1, label: 'all negatives' },
      { input: [[1, 1, 1]], expected: 1, label: 'all equal' },
    ],
    patternTag: 'Running Maximum',
    patternExplanation:
      'Seed a variable with the first element, then scan the rest — update whenever a larger value is found. Works in a single pass without sorting.',
    estimatedMinutes: 5,
  },
]
