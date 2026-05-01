import type { Problem } from '@/types/problem'

export const polyfillsProblems: readonly Problem[] = [
  {
    id: 'polyfills-1',
    title: 'Implement forEach',
    category: 'polyfills',
    difficulty: 'Easy',
    functionName: 'myForEach',
    description:
      'Implement a function myForEach(arr, callback) that calls the callback with (element, index, array) for every element, just like Array.prototype.forEach. Return undefined.',
    whatShouldHappen: [
      'Loop through the array from index 0 to the last index.',
      'Call the callback with three arguments: the current element, the current index, and the original array.',
      'Do not collect or return any values — forEach always returns undefined.',
    ],
    starterCode: `function myForEach(arr, callback) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'arr = [10, 20, 30], callback = (el, i) => console.log(i, el)',
      columns: ['i', 'el', 'callback called with'],
      rows: [
        { i: 0, el: 10, 'callback called with': '(10, 0, arr)' },
        { i: 1, el: 20, 'callback called with': '(20, 1, arr)' },
        { i: 2, el: 30, 'callback called with': '(30, 2, arr)' },
      ],
    },
    skeletonHint: `function myForEach(arr, callback) {
  for (let i = 0; i < ____; i++) {
    callback(____, ____, ____);
  }
}`,
    solution: `function myForEach(arr, callback) {
  // iterate every index in the array
  for (let i = 0; i < arr.length; i++) {
    // call the callback with element, index, and the source array — matching the native forEach signature
    callback(arr[i], i, arr);
  }
  // forEach has no return value
}`,
    tests: [
      {
        input: [[1, 2, 3], '(el, i, a) => { a[i] = el * 2; }'],
        expected: [2, 4, 6],
        label: 'mutates via callback',
      },
      {
        input: [[], '() => {}'],
        expected: [],
        label: 'empty array',
      },
      {
        input: [[42], '(el, i, a) => { a[i] = el + 1; }'],
        expected: [43],
        label: 'single element',
      },
      {
        input: [['a', 'b'], '(el, i, a) => { a[i] = el + i; }'],
        expected: ['a0', 'b1'],
        label: 'receives index',
      },
    ],
    patternTag: 'Higher-Order Function',
    patternExplanation:
      'forEach is a loop in disguise — it delegates what to do per element to a callback, separating iteration from behavior. Re-implementing it reveals exactly what the native version does.',
    estimatedMinutes: 8,
  },
  {
    id: 'polyfills-2',
    title: 'Implement map',
    category: 'polyfills',
    difficulty: 'Easy',
    functionName: 'myMap',
    description:
      'Implement myMap(arr, callback) that returns a new array where each element is the result of calling callback(element, index, array), just like Array.prototype.map.',
    whatShouldHappen: [
      'Create an empty result array.',
      'Loop through each element.',
      'Push the return value of callback(element, index, array) into the result.',
      'Return the result array — never modify the original array.',
    ],
    starterCode: `function myMap(arr, callback) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'arr = [1, 2, 3], callback = el => el * 3',
      columns: ['i', 'el', 'callback(el)', 'result'],
      rows: [
        { i: 0, el: 1, 'callback(el)': 3, result: '[3]' },
        { i: 1, el: 2, 'callback(el)': 6, result: '[3, 6]' },
        { i: 2, el: 3, 'callback(el)': 9, result: '[3, 6, 9]' },
      ],
    },
    skeletonHint: `function myMap(arr, callback) {
  const result = [];
  for (let i = 0; i < ____; i++) {
    result.push(callback(____, ____, ____));
  }
  return result;
}`,
    solution: `function myMap(arr, callback) {
  // result holds the transformed values
  const result = [];
  // visit every element by index
  for (let i = 0; i < arr.length; i++) {
    // pass element, index, and the source array — matching native map's callback signature
    result.push(callback(arr[i], i, arr));
  }
  // return the new array — arr is not mutated
  return result;
}`,
    tests: [
      { input: [[1, 2, 3], 'el => el * 3'], expected: [3, 6, 9], label: 'triple values' },
      { input: [[], 'el => el'], expected: [], label: 'empty array' },
      { input: [[5], 'el => el + 1'], expected: [6], label: 'single element' },
      { input: [['a', 'b'], '(el, i) => el + i'], expected: ['a0', 'b1'], label: 'uses index' },
    ],
    patternTag: 'Higher-Order Function',
    patternExplanation:
      'map collects callback return values into a new array — it never modifies the original. Building it from scratch cements the difference between forEach (side effects) and map (new array).',
    estimatedMinutes: 8,
  },
]
