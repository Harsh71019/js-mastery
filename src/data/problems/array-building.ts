import type { Problem } from '@/types/problem'

export const arrayBuildingProblems: readonly Problem[] = [
  {
    id: 'array-building-1',
    title: 'Filter Even Numbers',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'filterEvens',
    description:
      'Given an array of integers, return a new array containing only the even numbers, preserving order.',
    whatShouldHappen: [
      'Create an empty result array.',
      'Loop through each element.',
      'If the element is even (divisible by 2 with no remainder), push it into the result.',
      'Return the result array.',
    ],
    starterCode: `function filterEvens(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4, 5, 6]',
      columns: ['i', 'nums[i]', 'even?', 'result'],
      rows: [
        { i: 0, 'nums[i]': 1, 'even?': 'no', result: '[]' },
        { i: 1, 'nums[i]': 2, 'even?': 'yes', result: '[2]' },
        { i: 2, 'nums[i]': 3, 'even?': 'no', result: '[2]' },
        { i: 3, 'nums[i]': 4, 'even?': 'yes', result: '[2, 4]' },
        { i: 4, 'nums[i]': 5, 'even?': 'no', result: '[2, 4]' },
        { i: 5, 'nums[i]': 6, 'even?': 'yes', result: '[2, 4, 6]' },
      ],
    },
    skeletonHint: `function filterEvens(nums) {
  const result = [];
  for (let i = 0; i < ____; i++) {
    if (nums[i] % 2 === ____) {
      result.push(____);
    }
  }
  return result;
}`,
    solution: `function filterEvens(nums) {
  // result will hold only the even numbers
  const result = [];
  // examine every element
  for (let i = 0; i < nums.length; i++) {
    // the modulo operator returns 0 for even numbers
    if (nums[i] % 2 === 0) {
      // only include even elements
      result.push(nums[i]);
    }
  }
  // return the filtered array
  return result;
}`,
    tests: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6], label: 'mixed odds and evens' },
      { input: [[1, 3, 5]], expected: [], label: 'all odd' },
      { input: [[2, 4, 6]], expected: [2, 4, 6], label: 'all even' },
      { input: [[]], expected: [], label: 'empty array' },
    ],
    patternTag: 'Conditional Accumulator',
    patternExplanation:
      'Build a new array by pushing only elements that satisfy a condition — the foundational pattern behind Array.prototype.filter.',
    estimatedMinutes: 5,
  },
  {
    id: 'array-building-2',
    title: 'Double Every Element',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'doubleAll',
    description:
      'Given an array of numbers, return a new array where every element has been multiplied by 2.',
    whatShouldHappen: [
      'Create an empty result array.',
      'Loop through each element.',
      'Push the element multiplied by 2 into the result.',
      'Return the result array.',
    ],
    starterCode: `function doubleAll(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3]',
      columns: ['i', 'nums[i]', 'doubled', 'result'],
      rows: [
        { i: 0, 'nums[i]': 1, doubled: 2, result: '[2]' },
        { i: 1, 'nums[i]': 2, doubled: 4, result: '[2, 4]' },
        { i: 2, 'nums[i]': 3, doubled: 6, result: '[2, 4, 6]' },
      ],
    },
    skeletonHint: `function doubleAll(nums) {
  const result = [];
  for (let i = 0; i < ____; i++) {
    result.push(____ * 2);
  }
  return result;
}`,
    solution: `function doubleAll(nums) {
  // result holds the transformed values
  const result = [];
  // process every element in order
  for (let i = 0; i < nums.length; i++) {
    // multiply by 2 and store in the new array
    result.push(nums[i] * 2);
  }
  // return the mapped array
  return result;
}`,
    tests: [
      { input: [[1, 2, 3]], expected: [2, 4, 6], label: 'normal input' },
      { input: [[0]], expected: [0], label: 'zero element' },
      { input: [[]], expected: [], label: 'empty array' },
      { input: [[-1, 5]], expected: [-2, 10], label: 'negative values' },
    ],
    patternTag: 'Transform (Map)',
    patternExplanation:
      'Apply a transformation to every element and collect the results — the foundational pattern behind Array.prototype.map.',
    estimatedMinutes: 5,
  },
]
