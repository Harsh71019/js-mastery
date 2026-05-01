import type { Problem } from '@/types/problem'

export const forInForOfProblems: readonly Problem[] = [
  {
    id: 'for-in-for-of-1',
    title: 'Sum with for...of',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'sumWithForOf',
    description:
      'Given an array of numbers, return the sum using a for...of loop instead of a traditional for loop.',
    whatShouldHappen: [
      'Initialize a total variable to 0.',
      'Use for...of to iterate directly over values (no index needed).',
      'Add each value to the total.',
      'Return the total.',
    ],
    starterCode: `function sumWithForOf(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [10, 20, 30]',
      columns: ['value', 'total'],
      rows: [
        { value: 10, total: 10 },
        { value: 20, total: 30 },
        { value: 30, total: 60 },
      ],
    },
    skeletonHint: `function sumWithForOf(nums) {
  let total = 0;
  for (const ____ of ____) {
    total += ____;
  }
  return total;
}`,
    solution: `function sumWithForOf(nums) {
  // start the accumulator at zero
  let total = 0;
  // for...of yields each value directly — no index variable needed
  for (const value of nums) {
    // accumulate each value
    total += value;
  }
  // return the final sum
  return total;
}`,
    tests: [
      { input: [[10, 20, 30]], expected: 60, label: 'normal input' },
      { input: [[7]], expected: 7, label: 'single element' },
      { input: [[]], expected: 0, label: 'empty array' },
      { input: [[-5, 5]], expected: 0, label: 'cancelling values' },
    ],
    patternTag: 'for...of Iteration',
    patternExplanation:
      'for...of iterates over the values of any iterable (arrays, strings, Sets, Maps) — cleaner than a for loop when you only need values, not indices.',
    estimatedMinutes: 5,
  },
  {
    id: 'for-in-for-of-2',
    title: 'Count Key Occurrences',
    category: 'for-in-for-of',
    difficulty: 'Easy',
    functionName: 'countKeys',
    description:
      'Given an object, return the total number of own enumerable keys using a for...in loop.',
    whatShouldHappen: [
      'Initialize a counter to 0.',
      'Use for...in to iterate over the object\'s keys.',
      'Increment the counter for each key.',
      'Return the counter.',
    ],
    starterCode: `function countKeys(obj) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'obj = { a: 1, b: 2, c: 3 }',
      columns: ['key', 'count'],
      rows: [
        { key: 'a', count: 1 },
        { key: 'b', count: 2 },
        { key: 'c', count: 3 },
      ],
    },
    skeletonHint: `function countKeys(obj) {
  let count = 0;
  for (const ____ in ____) {
    count++;
  }
  return count;
}`,
    solution: `function countKeys(obj) {
  // counter starts at zero
  let count = 0;
  // for...in iterates over all enumerable own (and inherited) keys
  for (const key in obj) {
    // only count own properties, not inherited ones from the prototype
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++;
    }
  }
  // return how many own keys the object has
  return count;
}`,
    tests: [
      { input: [{ a: 1, b: 2, c: 3 }], expected: 3, label: 'normal object' },
      { input: [{ x: 10 }], expected: 1, label: 'single key' },
      { input: [{}], expected: 0, label: 'empty object' },
      { input: [{ a: 1, b: 2, c: 3, d: 4 }], expected: 4, label: 'four keys' },
    ],
    patternTag: 'for...in Iteration',
    patternExplanation:
      'for...in iterates over enumerable string keys of an object — always pair it with hasOwnProperty to avoid counting inherited prototype keys.',
    estimatedMinutes: 8,
  },
]
