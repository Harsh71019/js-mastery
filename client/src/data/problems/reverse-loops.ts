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
    starterCode: `function reverseArray(arr) {\n  // your code here\n}`,
    traceTable: {
      inputLabel: 'arr = [1, 2, 3]',
      columns: ['i', 'arr[i]', 'result'],
      rows: [
        { i: 2, 'arr[i]': 3, result: '[3]' },
        { i: 1, 'arr[i]': 2, result: '[3, 2]' },
        { i: 0, 'arr[i]': 1, result: '[3, 2, 1]' },
      ],
    },
    skeletonHint: `function reverseArray(arr) {\n  const result = [];\n  for (let i = ____; i >= 0; i____) {\n    result.push(____);\n  }\n  return result;\n}`,
    solution: `function reverseArray(arr) {\n  // result will hold the reversed elements\n  const result = [];\n  // start at the last valid index\n  for (let i = arr.length - 1; i >= 0; i--) {\n    // push from the back of arr into the front of result\n    result.push(arr[i]);\n  }\n  // return the newly built reversed array\n  return result;\n}`,
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
    starterCode: `function isPalindrome(str) {\n  // your code here\n}`,
    traceTable: {
      inputLabel: 'str = "racecar"',
      columns: ['i', 'str[i]', 'str[6-i]', 'match'],
      rows: [
        { i: 0, 'str[i]': 'r', 'str[6-i]': 'r', match: 'yes' },
        { i: 1, 'str[i]': 'a', 'str[6-i]': 'a', match: 'yes' },
        { i: 2, 'str[i]': 'c', 'str[6-i]': 'c', match: 'yes' },
      ],
    },
    skeletonHint: `function isPalindrome(str) {\n  for (let i = 0; i < ____; i++) {\n    if (str[i] !== str[____]) {\n      return ____;\n    }\n  }\n  return ____;\n}`,
    solution: `function isPalindrome(str) {\n  // only need to check up to the midpoint — beyond that is a mirror\n  for (let i = 0; i < Math.floor(str.length / 2); i++) {\n    // compare char from the front with its mirror from the back\n    if (str[i] !== str[str.length - 1 - i]) {\n      // a single mismatch means it is not a palindrome\n      return false;\n    }\n  }\n  // all mirror pairs matched\n  return true;\n}`,
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
  {
    id: 'reverse-loops-3',
    title: 'Reverse a String',
    category: 'reverse-loops',
    difficulty: 'Beginner',
    functionName: 'reverseString',
    description:
      'Given a string, return a new string with the characters in reverse order. Do not use the built-in .reverse() or .split().reverse().join() chain.',
    whatShouldHappen: [
      'Start with an empty result string.',
      'Loop from the last character index down to 0.',
      'Concatenate each character onto the result string.',
      'Return the result.',
    ],
    starterCode: `function reverseString(str) {\n  // your code here\n}`,
    traceTable: {
      inputLabel: 'str = "abc"',
      columns: ['i', 'str[i]', 'result'],
      rows: [
        { i: 2, 'str[i]': 'c', result: '"c"' },
        { i: 1, 'str[i]': 'b', result: '"cb"' },
        { i: 0, 'str[i]': 'a', result: '"cba"' },
      ],
    },
    skeletonHint: `function reverseString(str) {\n  let result = '';\n  for (let i = ____; i >= 0; i--) {\n    result += ____;\n  }\n  return ____;\n}`,
    solution: `function reverseString(str) {\n  // accumulate characters from back to front\n  let result = '';\n  // start at the last index, stop when i goes below 0\n  for (let i = str.length - 1; i >= 0; i--) {\n    // append each character to the growing result\n    result += str[i];\n  }\n  return result;\n}`,
    tests: [
      { input: ['abc'], expected: 'cba', label: 'normal string' },
      { input: ['hello'], expected: 'olleh', label: 'hello reversed' },
      { input: ['a'], expected: 'a', label: 'single character' },
      { input: [''], expected: '', label: 'empty string' },
    ],
    patternTag: 'Reverse Iteration',
    patternExplanation:
      'Walking the string backwards and concatenating each character builds the reversed string in a single pass — same pattern as reversing an array.',
    estimatedMinutes: 5,
  },
  {
    id: 'reverse-loops-4',
    title: 'Count Down to Zero',
    category: 'reverse-loops',
    difficulty: 'Beginner',
    functionName: 'countDown',
    description:
      'Given a positive integer n, return an array containing [n, n-1, n-2, ..., 1, 0].',
    whatShouldHappen: [
      'Create an empty result array.',
      'Loop starting from n, while i >= 0, decrementing each step.',
      'Push i into the result array on each iteration.',
      'Return the result array.',
    ],
    starterCode: `function countDown(n) {\n  // your code here\n}`,
    traceTable: {
      inputLabel: 'n = 4',
      columns: ['i', 'result'],
      rows: [
        { i: 4, result: '[4]' },
        { i: 3, result: '[4, 3]' },
        { i: 2, result: '[4, 3, 2]' },
        { i: 1, result: '[4, 3, 2, 1]' },
        { i: 0, result: '[4, 3, 2, 1, 0]' },
      ],
    },
    skeletonHint: `function countDown(n) {\n  const result = [];\n  for (let i = ____; i >= ____; i--) {\n    result.push(____);\n  }\n  return result;\n}`,
    solution: `function countDown(n) {\n  const result = [];\n  // i starts at n and decrements until it reaches 0 (inclusive)\n  for (let i = n; i >= 0; i--) {\n    result.push(i);\n  }\n  return result;\n}`,
    tests: [
      { input: [4], expected: [4, 3, 2, 1, 0], label: 'n = 4' },
      { input: [0], expected: [0], label: 'n = 0' },
      { input: [1], expected: [1, 0], label: 'n = 1' },
      { input: [3], expected: [3, 2, 1, 0], label: 'n = 3' },
    ],
    patternTag: 'Reverse Iteration',
    patternExplanation:
      'Setting the start value to n and using i-- with a condition i >= 0 is the classic countdown loop — the loop variable itself becomes the data.',
    estimatedMinutes: 5,
  },
  {
    id: 'reverse-loops-5',
    title: 'Find Last Occurrence',
    category: 'reverse-loops',
    difficulty: 'Easy',
    functionName: 'lastIndexOf',
    description:
      'Given an array and a target value, return the index of the last occurrence of the target. Return -1 if it is not found. Do not use the built-in .lastIndexOf().',
    whatShouldHappen: [
      'Loop from the last index down to 0.',
      'On the first match (which is the last occurrence since we go right-to-left), return the index.',
      'If the loop completes without a match, return -1.',
    ],
    starterCode: `function lastIndexOf(arr, target) {\n  // your code here\n}`,
    traceTable: {
      inputLabel: 'arr = [1, 3, 2, 3, 4], target = 3',
      columns: ['i', 'arr[i]', 'match?', 'action'],
      rows: [
        { i: 4, 'arr[i]': 4, 'match?': 'no', action: 'continue' },
        { i: 3, 'arr[i]': 3, 'match?': 'yes', action: 'RETURN 3' },
      ],
    },
    skeletonHint: `function lastIndexOf(arr, target) {\n  for (let i = ____; i >= 0; ____) {\n    if (arr[i] === ____) {\n      return ____;\n    }\n  }\n  return ____;\n}`,
    solution: `function lastIndexOf(arr, target) {\n  // scan right-to-left so the first match we find is the last in the array\n  for (let i = arr.length - 1; i >= 0; i--) {\n    if (arr[i] === target) {\n      // this is the rightmost (last) occurrence\n      return i;\n    }\n  }\n  // target was never found\n  return -1;\n}`,
    tests: [
      { input: [[1, 3, 2, 3, 4], 3], expected: 3, label: 'target appears twice' },
      { input: [[1, 2, 3], 3], expected: 2, label: 'target at end' },
      { input: [[1, 2, 3], 9], expected: -1, label: 'target not present' },
      { input: [[5, 5, 5], 5], expected: 2, label: 'all same value' },
    ],
    patternTag: 'Reverse Search',
    patternExplanation:
      'Iterating from the right means the first match you find is the last occurrence — no need to scan the whole array or track candidates.',
    estimatedMinutes: 8,
  },
]
