import type { Problem } from '@/types/problem'

export const objectLoopsProblems: readonly Problem[] = [
  {
    id: 'object-loops-1',
    title: 'Sum Object Values',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'sumObjectValues',
    description:
      'Given an object where all values are numbers, return the sum of all values.',
    whatShouldHappen: [
      'Initialize a total to 0.',
      'Use Object.values() to get an array of the values.',
      'Loop through the values and add each to the total.',
      'Return the total.',
    ],
    starterCode: `function sumObjectValues(obj) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'obj = { a: 10, b: 20, c: 30 }',
      columns: ['value', 'total'],
      rows: [
        { value: 10, total: 10 },
        { value: 20, total: 30 },
        { value: 30, total: 60 },
      ],
    },
    skeletonHint: `function sumObjectValues(obj) {
  let total = 0;
  for (const value of Object.______(obj)) {
    total += ____;
  }
  return total;
}`,
    solution: `function sumObjectValues(obj) {
  // accumulator starts at zero
  let total = 0;
  // Object.values returns an array of the object's own enumerable values
  for (const value of Object.values(obj)) {
    // add each numeric value to the running total
    total += value;
  }
  // return the sum of all values
  return total;
}`,
    tests: [
      { input: [{ a: 10, b: 20, c: 30 }], expected: 60, label: 'normal object' },
      { input: [{ x: 5 }], expected: 5, label: 'single key' },
      { input: [{}], expected: 0, label: 'empty object' },
      { input: [{ a: -5, b: 5 }], expected: 0, label: 'cancelling values' },
    ],
    patternTag: 'Object.values Iteration',
    patternExplanation:
      'Object.values() converts an object\'s values into a plain array — you can then use any array loop pattern on them without needing for...in.',
    estimatedMinutes: 5,
  },
  {
    id: 'object-loops-2',
    title: 'Invert an Object',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'invertObject',
    description:
      'Given an object, return a new object where the keys and values are swapped. Assume all values are unique strings or numbers.',
    whatShouldHappen: [
      'Create an empty result object.',
      'Use Object.entries() to get [key, value] pairs.',
      'For each pair, assign result[value] = key.',
      'Return the result object.',
    ],
    starterCode: `function invertObject(obj) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'obj = { a: 1, b: 2, c: 3 }',
      columns: ['key', 'value', 'result so far'],
      rows: [
        { key: 'a', value: 1, 'result so far': '{ 1: "a" }' },
        { key: 'b', value: 2, 'result so far': '{ 1: "a", 2: "b" }' },
        { key: 'c', value: 3, 'result so far': '{ 1: "a", 2: "b", 3: "c" }' },
      ],
    },
    skeletonHint: `function invertObject(obj) {
  const result = {};
  for (const [____, ____] of Object.entries(obj)) {
    result[____] = ____;
  }
  return result;
}`,
    solution: `function invertObject(obj) {
  // result will hold the swapped key-value pairs
  const result: Record<string, string> = {};
  // Object.entries yields [key, value] tuples we can destructure directly
  for (const [key, value] of Object.entries(obj)) {
    // swap: the old value becomes the new key, old key becomes the new value
    result[String(value)] = key;
  }
  // return the inverted object
  return result;
}`,
    tests: [
      { input: [{ a: '1', b: '2', c: '3' }], expected: { '1': 'a', '2': 'b', '3': 'c' }, label: 'string values' },
      { input: [{ x: 'y' }], expected: { y: 'x' }, label: 'single pair' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ hello: 'world', foo: 'bar' }], expected: { world: 'hello', bar: 'foo' }, label: 'word pairs' },
    ],
    patternTag: 'Object.entries Iteration',
    patternExplanation:
      'Object.entries() yields [key, value] tuples — destructuring them in the loop header makes swapping or transforming key-value pairs clean and direct.',
    estimatedMinutes: 8,
  },
]
