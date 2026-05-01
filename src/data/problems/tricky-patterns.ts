import type { Problem } from '@/types/problem'

export const trickyPatternsProblems: readonly Problem[] = [
  {
    id: 'tricky-patterns-1',
    title: 'FizzBuzz',
    category: 'tricky-patterns',
    difficulty: 'Beginner',
    functionName: 'fizzBuzz',
    description:
      'Given a number n, return an array of strings for numbers 1 through n: "FizzBuzz" if divisible by both 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or the number as a string otherwise.',
    whatShouldHappen: [
      'Loop from 1 to n inclusive.',
      'Check divisibility by 15 first (both 3 and 5), then 3, then 5.',
      'Push the appropriate string into the result array.',
      'Return the result array.',
    ],
    starterCode: `function fizzBuzz(n) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'n = 15',
      columns: ['i', 'div 15?', 'div 3?', 'div 5?', 'output'],
      rows: [
        { i: 1, 'div 15?': 'no', 'div 3?': 'no', 'div 5?': 'no', output: '"1"' },
        { i: 3, 'div 15?': 'no', 'div 3?': 'yes', 'div 5?': 'no', output: '"Fizz"' },
        { i: 5, 'div 15?': 'no', 'div 3?': 'no', 'div 5?': 'yes', output: '"Buzz"' },
        { i: 15, 'div 15?': 'yes', 'div 3?': 'yes', 'div 5?': 'yes', output: '"FizzBuzz"' },
      ],
    },
    skeletonHint: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= ____; i++) {
    if (i % ____ === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push(____);
    else if (i % ____ === 0) result.push('Buzz');
    else result.push(____);
  }
  return result;
}`,
    solution: `function fizzBuzz(n) {
  // result collects one string per number from 1 to n
  const result = [];
  for (let i = 1; i <= n; i++) {
    // check 15 first — if we checked 3 first, we'd never reach the FizzBuzz branch
    if (i % 15 === 0) result.push('FizzBuzz');
    // divisible by 3 only
    else if (i % 3 === 0) result.push('Fizz');
    // divisible by 5 only
    else if (i % 5 === 0) result.push('Buzz');
    // not divisible by 3 or 5 — just the number as a string
    else result.push(String(i));
  }
  // return the full sequence
  return result;
}`,
    tests: [
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'], label: 'n = 5' },
      { input: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'], label: 'n = 15 (FizzBuzz at end)' },
      { input: [1], expected: ['1'], label: 'n = 1' },
      { input: [3], expected: ['1', '2', 'Fizz'], label: 'n = 3' },
    ],
    patternTag: 'Multi-Condition Branch',
    patternExplanation:
      'Order matters: check the most specific condition (divisible by 15) before the general ones (divisible by 3 or 5) — otherwise the specific case is silently absorbed by an earlier branch.',
    estimatedMinutes: 8,
  },
  {
    id: 'tricky-patterns-2',
    title: 'Move Zeros to End',
    category: 'tricky-patterns',
    difficulty: 'Easy',
    functionName: 'moveZeros',
    description:
      'Given an array of integers, move all zeros to the end while preserving the relative order of non-zero elements. Modify the array in-place.',
    whatShouldHappen: [
      'Use a write pointer starting at 0.',
      'Loop through the array with a read pointer.',
      'When the read pointer finds a non-zero, write it at the write pointer and advance both.',
      'After the loop, fill the remaining positions from the write pointer to the end with zeros.',
    ],
    starterCode: `function moveZeros(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [0, 1, 0, 3, 12]',
      columns: ['read', 'nums[read]', 'write', 'action'],
      rows: [
        { read: 0, 'nums[read]': 0, write: 0, action: 'skip zero' },
        { read: 1, 'nums[read]': 1, write: 0, action: 'write 1, write→1' },
        { read: 2, 'nums[read]': 0, write: 1, action: 'skip zero' },
        { read: 3, 'nums[read]': 3, write: 1, action: 'write 3, write→2' },
        { read: 4, 'nums[read]': 12, write: 2, action: 'write 12, write→3' },
      ],
    },
    skeletonHint: `function moveZeros(nums) {
  let write = 0;
  for (let read = 0; read < ____; read++) {
    if (nums[read] !== 0) {
      nums[____] = nums[read];
      write++;
    }
  }
  while (write < ____) {
    nums[write++] = 0;
  }
}`,
    solution: `function moveZeros(nums) {
  // write tracks where the next non-zero value should go
  let write = 0;
  // read scans every element
  for (let read = 0; read < nums.length; read++) {
    // only copy non-zero values forward
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  // everything from write onward should now be zeros
  while (write < nums.length) {
    nums[write++] = 0;
  }
}`,
    tests: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], label: 'normal input' },
      { input: [[0, 0, 1]], expected: [1, 0, 0], label: 'zeros at start' },
      { input: [[1, 2, 3]], expected: [1, 2, 3], label: 'no zeros' },
      { input: [[0]], expected: [0], label: 'single zero' },
    ],
    patternTag: 'Write Pointer',
    patternExplanation:
      'A write pointer only advances when a valid element is found — this compacts all valid elements to the front in one pass, then fills the tail separately.',
    estimatedMinutes: 10,
  },
]
