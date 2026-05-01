import type { Problem } from '@/types/problem'

export const reverseLoopsProblems: readonly Problem[] = [
  {
    id: 'reverse-loops-1',
    title: 'Reverse an Array',
    category: 'reverse-loops',
    difficulty: 'Beginner',
    functionName: 'reverseArray',
    description:
      'Given an array, return a new array with the elements in reverse order. Do not mutate the original array.',
    whatShouldHappen: [
      'Create an empty result array.',
      'Loop from the last index down to 0.',
      'Push each element into the result array.',
      'Return the result array.',
    ],
    starterCode: `function reverseArray(arr) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'arr = [1, 2, 3]',
      columns: ['i', 'arr[i]', 'result'],
      rows: [
        { i: 2, 'arr[i]': 3, result: '[3]' },
        { i: 1, 'arr[i]': 2, result: '[3, 2]' },
        { i: 0, 'arr[i]': 1, result: '[3, 2, 1]' },
      ],
    },
    skeletonHint: `function reverseArray(arr) {
  const result = [];
  for (let i = ____; i >= 0; i____) {
    result.push(____);
  }
  return result;
}`,
    solution: `function reverseArray(arr) {
  // result will hold the reversed elements
  const result = [];
  // start at the last valid index
  for (let i = arr.length - 1; i >= 0; i--) {
    // push from the back of arr into the front of result
    result.push(arr[i]);
  }
  // return the newly built reversed array
  return result;
}`,
    tests: [
      { input: [[1, 2, 3]], expected: [3, 2, 1], label: 'normal input' },
      { input: [[5]], expected: [5], label: 'single element' },
      { input: [[]], expected: [], label: 'empty array' },
      { input: [[1, 2]], expected: [2, 1], label: 'two elements' },
    ],
    patternTag: 'Reverse Iteration',
    patternExplanation:
      'Start the loop counter at the last index and decrement it each step — the simplest way to walk a collection from right to left.',
    estimatedMinutes: 5,
  },
  {
    id: 'reverse-loops-2',
    title: 'Check Palindrome',
    category: 'reverse-loops',
    difficulty: 'Easy',
    functionName: 'isPalindrome',
    description:
      'Given a string, return true if it reads the same forwards and backwards, false otherwise.',
    whatShouldHappen: [
      'Loop from the last character down to the midpoint.',
      'Compare each character with its mirror from the start.',
      'Return false immediately if any pair does not match.',
      'Return true after the loop completes without a mismatch.',
    ],
    starterCode: `function isPalindrome(str) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'str = "racecar"',
      columns: ['i', 'str[i]', 'str[6-i]', 'match'],
      rows: [
        { i: 0, 'str[i]': 'r', 'str[6-i]': 'r', match: 'yes' },
        { i: 1, 'str[i]': 'a', 'str[6-i]': 'a', match: 'yes' },
        { i: 2, 'str[i]': 'c', 'str[6-i]': 'c', match: 'yes' },
      ],
    },
    skeletonHint: `function isPalindrome(str) {
  for (let i = 0; i < ____; i++) {
    if (str[i] !== str[____]) {
      return ____;
    }
  }
  return ____;
}`,
    solution: `function isPalindrome(str) {
  // only need to check up to the midpoint — beyond that is a mirror
  for (let i = 0; i < Math.floor(str.length / 2); i++) {
    // compare char from the front with its mirror from the back
    if (str[i] !== str[str.length - 1 - i]) {
      // a single mismatch means it is not a palindrome
      return false;
    }
  }
  // all mirror pairs matched
  return true;
}`,
    tests: [
      { input: ['racecar'], expected: true, label: 'odd-length palindrome' },
      { input: ['abba'], expected: true, label: 'even-length palindrome' },
      { input: ['hello'], expected: false, label: 'not a palindrome' },
      { input: ['a'], expected: true, label: 'single character' },
    ],
    patternTag: 'Mirror Check',
    patternExplanation:
      'Compare index i from the start with index (length - 1 - i) from the end, looping only to the midpoint — this is the in-place palindrome check.',
    estimatedMinutes: 8,
  },
]
