const fs = require('fs');
const path = require('path');
const { validateProblem } = require('../server/dist/utils/problem-validation.js');

function deepEqual(a, b) {
  if (a === b) return true;
  if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object') {
    const ak = Object.keys(a).sort(), bk = Object.keys(b).sort();
    if (ak.length !== bk.length) return false;
    for (let i = 0; i < ak.length; i++) {
      if (ak[i] !== bk[i]) return false;
      if (!deepEqual(a[ak[i]], b[bk[i]])) return false;
    }
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Group 1: While & Do-While Loops with Operators (basic-loops)
// -------------------------------------------------------------
const basicLoopsNew = [
  {
    id: 'basic-loops-9',
    title: 'Sum Digits with While Loop',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'sumDigits',
    description: 'Given a non-negative integer num, return the sum of its individual digits. Use a while loop with modulo (%) and division (Math.floor) to extract digits from right to left.',
    whatShouldHappen: [
      'Initialize a running sum to 0.',
      'Handle edge case: if num is 0, return 0.',
      'While num > 0, extract the last digit with num % 10 and add it to sum.',
      'Remove the last digit by updating num = Math.floor(num / 10).',
      'Return sum once num reaches 0.'
    ],
    starterCode: 'function sumDigits(num) {\n  // your code here\n}',
    solution: 'function sumDigits(num) {\n  if (num === 0) return 0;\n  let sum = 0;\n  let n = num;\n  while (n > 0) {\n    sum += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return sum;\n}',
    skeletonHint: 'function sumDigits(num) {\n  let sum = 0;\n  let n = num;\n  while (n > ____) {\n    sum += n % ____;\n    n = Math.floor(n / ____);\n  }\n  return sum;\n}',
    traceTable: {
      inputLabel: 'num = 1234',
      columns: ['n', 'n % 10', 'sum', 'next n'],
      rows: [
        { n: 1234, 'n % 10': 4, sum: 4, 'next n': 123 },
        { n: 123, 'n % 10': 3, sum: 7, 'next n': 12 },
        { n: 12, 'n % 10': 2, sum: 9, 'next n': 1 },
        { n: 1, 'n % 10': 1, sum: 10, 'next n': 0 }
      ]
    },
    patternTag: 'Digit Extraction Loop',
    patternExplanation: 'Using while (n > 0) paired with n % 10 and Math.floor(n / 10) is the standard pattern for extracting and processing integer digits without converting to strings.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [1234], expected: 10, label: 'standard 4-digit number' },
      { input: [0], expected: 0, label: 'zero' },
      { input: [905], expected: 14, label: 'number with zero digit' },
      { input: [7], expected: 7, label: 'single digit' }
    ]
  },
  {
    id: 'basic-loops-10',
    title: 'Count Collatz Steps',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'countCollatzSteps',
    description: 'Given a positive integer n, return the number of steps required to reach 1 following the Collatz sequence: if n is even, divide it by 2 (n / 2); if n is odd, multiply by 3 and add 1 (3 * n + 1). If n is already 1, return 0.',
    whatShouldHappen: [
      'Initialize step counter to 0.',
      'While n is not equal to 1, check if n is even or odd using n % 2 === 0.',
      'If even, divide n by 2; if odd, update n to 3 * n + 1.',
      'Increment steps on each cycle.',
      'Return total steps when n becomes 1.'
    ],
    starterCode: 'function countCollatzSteps(n) {\n  // your code here\n}',
    solution: 'function countCollatzSteps(n) {\n  let steps = 0;\n  let current = n;\n  while (current !== 1) {\n    if (current % 2 === 0) {\n      current = current / 2;\n    } else {\n      current = 3 * current + 1;\n    }\n    steps++;\n  }\n  return steps;\n}',
    skeletonHint: 'function countCollatzSteps(n) {\n  let steps = 0;\n  let current = n;\n  while (current !== ____) {\n    current = current % 2 === 0 ? current / ____ : 3 * current + ____;\n    steps++;\n  }\n  return steps;\n}',
    traceTable: {
      inputLabel: 'n = 6',
      columns: ['step', 'current', 'even/odd', 'next current'],
      rows: [
        { step: 1, current: 6, 'even/odd': 'even', 'next current': 3 },
        { step: 2, current: 3, 'even/odd': 'odd', 'next current': 10 },
        { step: 3, current: 10, 'even/odd': 'even', 'next current': 5 },
        { step: 4, current: 5, 'even/odd': 'odd', 'next current': 16 },
        { step: 5, current: 16, 'even/odd': 'even', 'next current': 8 },
        { step: 6, current: 8, 'even/odd': 'even', 'next current': 4 },
        { step: 7, current: 4, 'even/odd': 'even', 'next current': 2 },
        { step: 8, current: 2, 'even/odd': 'even', 'next current': 1 }
      ]
    },
    patternTag: 'Conditional While Loop',
    patternExplanation: 'While loops with condition-dependent updates model state-transition algorithms where the number of iterations cannot be known upfront.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [1], expected: 0, label: 'already one' },
      { input: [6], expected: 8, label: 'even start' },
      { input: [11], expected: 14, label: 'odd start' },
      { input: [16], expected: 4, label: 'power of two' }
    ]
  },
  {
    id: 'basic-loops-11',
    title: 'Count Halvings with Do-While',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'countHalvings',
    description: 'Given a positive integer n, use a do...while loop to repeatedly divide n by 2 (using Math.floor(n / 2)) until n is 1 or less. Return the total count of halvings performed. Because do...while always executes at least once, n = 1 will be halved once (resulting in 0) and return 1.',
    whatShouldHappen: [
      'Initialize count to 0 and current to n.',
      'Execute do block: update current = Math.floor(current / 2) and increment count.',
      'Continue loop while current > 1.',
      'Return count.'
    ],
    starterCode: 'function countHalvings(n) {\n  // your code here\n}',
    solution: 'function countHalvings(n) {\n  let count = 0;\n  let current = n;\n  do {\n    current = Math.floor(current / 2);\n    count++;\n  } while (current > 1);\n  return count;\n}',
    skeletonHint: 'function countHalvings(n) {\n  let count = 0;\n  let current = n;\n  do {\n    current = Math.floor(current / ____);\n    count++;\n  } while (current > ____);\n  return count;\n}',
    traceTable: {
      inputLabel: 'n = 16',
      columns: ['iteration', 'before', 'after halving', 'continue?'],
      rows: [
        { iteration: 1, before: 16, 'after halving': 8, 'continue?': 'true (8 > 1)' },
        { iteration: 2, before: 8, 'after halving': 4, 'continue?': 'true (4 > 1)' },
        { iteration: 3, before: 4, 'after halving': 2, 'continue?': 'true (2 > 1)' },
        { iteration: 4, before: 2, 'after halving': 1, 'continue?': 'false (1 not > 1)' }
      ]
    },
    patternTag: 'Do-While Post-Condition',
    patternExplanation: 'A do...while loop guarantees the loop body runs at least once before testing its exit condition, making it ideal for processes requiring at least one initial reduction.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [16], expected: 4, label: 'even power of 2' },
      { input: [1], expected: 1, label: 'single execution edge case' },
      { input: [7], expected: 2, label: 'odd number' },
      { input: [100], expected: 6, label: 'larger number' }
    ]
  },
  {
    id: 'basic-loops-12',
    title: 'Compute Integer Power with While Loop',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'powerWhile',
    description: 'Given non-negative integers base and exp, compute base raised to the power exp using a while loop and compound multiplication (*=). Do not use Math.pow or the ** operator.',
    whatShouldHappen: [
      'Initialize result to 1 (since any number to power 0 is 1).',
      'Initialize remainingExp to exp.',
      'While remainingExp > 0, multiply result by base and decrement remainingExp by 1.',
      'Return result.'
    ],
    starterCode: 'function powerWhile(base, exp) {\n  // your code here\n}',
    solution: 'function powerWhile(base, exp) {\n  let result = 1;\n  let remainingExp = exp;\n  while (remainingExp > 0) {\n    result *= base;\n    remainingExp--;\n  }\n  return result;\n}',
    skeletonHint: 'function powerWhile(base, exp) {\n  let result = ____;\n  let remaining = exp;\n  while (remaining > 0) {\n    result *= ____;\n    remaining--;\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'base = 2, exp = 3',
      columns: ['remaining', 'result before', 'result after'],
      rows: [
        { remaining: 3, 'result before': 1, 'result after': 2 },
        { remaining: 2, 'result before': 2, 'result after': 4 },
        { remaining: 1, 'result before': 4, 'result after': 8 }
      ]
    },
    patternTag: 'Multiplicative Accumulator',
    patternExplanation: 'Starting an accumulator at 1 and multiplying by a factor across iterations is the foundation of powers, factorials, and compound scaling.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [2, 3], expected: 8, label: 'cube 2' },
      { input: [5, 0], expected: 1, label: 'zero power' },
      { input: [3, 4], expected: 81, label: 'fourth power 3' },
      { input: [10, 1], expected: 10, label: 'power 1' }
    ]
  },
  {
    id: 'basic-loops-13',
    title: 'Sum Until Sentinel with Break',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'sumUntilStop',
    description: 'Given an array of numbers nums and a sentinel value stopVal, iterate from left to right and sum all numbers until encountering stopVal. Once stopVal is encountered, immediately terminate the loop using the break keyword without adding stopVal to the total.',
    whatShouldHappen: [
      'Initialize total to 0.',
      'Iterate through nums from index 0 to nums.length - 1.',
      'If the current number strictly equals stopVal, break out of the loop.',
      'Otherwise, add current number to total.',
      'Return total after loop exits.'
    ],
    starterCode: 'function sumUntilStop(nums, stopVal) {\n  // your code here\n}',
    solution: 'function sumUntilStop(nums, stopVal) {\n  let total = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] === stopVal) {\n      break;\n    }\n    total += nums[i];\n  }\n  return total;\n}',
    skeletonHint: 'function sumUntilStop(nums, stopVal) {\n  let total = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] === ____) {\n      ____;\n    }\n    total += nums[i];\n  }\n  return total;\n}',
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, -1, 4], stopVal = -1',
      columns: ['i', 'nums[i]', 'is stopVal?', 'total'],
      rows: [
        { i: 0, 'nums[i]': 1, 'is stopVal?': 'false', total: 1 },
        { i: 1, 'nums[i]': 2, 'is stopVal?': 'false', total: 3 },
        { i: 2, 'nums[i]': 3, 'is stopVal?': 'false', total: 6 },
        { i: 3, 'nums[i]': -1, 'is stopVal?': 'true (break)', total: 6 }
      ]
    },
    patternTag: 'Early Exit Sentinel',
    patternExplanation: 'The break statement allows early termination of loops as soon as a stop condition or sentinel value is detected, preventing unnecessary iterations.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, -1, 4], -1], expected: 6, label: 'stop mid-array' },
      { input: [[10, 20, 30], 99], expected: 60, label: 'stopVal never appears' },
      { input: [[5, 5, 5], 5], expected: 0, label: 'stopVal at index 0' },
      { input: [[], 0], expected: 0, label: 'empty array' }
    ]
  }
];

// -------------------------------------------------------------
// Group 2: Array Loops & Building (array-building)
// -------------------------------------------------------------
const arrayBuildingNew = [
  {
    id: 'array-building-7',
    title: 'Create Range with Step',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'rangeWithStep',
    description: 'Given integers start, end, and positive step, return an array of numbers starting at start and advancing by step while the value is strictly less than end. Use a for loop with compound addition (i += step).',
    whatShouldHappen: [
      'Initialize an empty result array.',
      'Loop starting at i = start, continuing while i < end, incrementing by i += step.',
      'Push each i into the result array.',
      'Return result.'
    ],
    starterCode: 'function rangeWithStep(start, end, step) {\n  // your code here\n}',
    solution: 'function rangeWithStep(start, end, step) {\n  const result = [];\n  for (let i = start; i < end; i += step) {\n    result.push(i);\n  }\n  return result;\n}',
    skeletonHint: 'function rangeWithStep(start, end, step) {\n  const result = [];\n  for (let i = start; i < ____; i += ____) {\n    result.push(____);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'start = 0, end = 10, step = 2',
      columns: ['i', 'result.push', 'result array'],
      rows: [
        { i: 0, 'result.push': 0, 'result array': '[0]' },
        { i: 2, 'result.push': 2, 'result array': '[0, 2]' },
        { i: 4, 'result.push': 4, 'result array': '[0, 2, 4]' },
        { i: 6, 'result.push': 6, 'result array': '[0, 2, 4, 6]' },
        { i: 8, 'result.push': 8, 'result array': '[0, 2, 4, 6, 8]' }
      ]
    },
    patternTag: 'Stepped Loop Generation',
    patternExplanation: 'Custom step increments in for loop headers (i += step) avoid unnecessary iterations and generate indexed sequences directly.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [0, 10, 2], expected: [0, 2, 4, 6, 8], label: 'even step from 0' },
      { input: [1, 10, 3], expected: [1, 4, 7], label: 'step 3' },
      { input: [5, 5, 1], expected: [], label: 'start equals end' },
      { input: [3, 8, 1], expected: [3, 4, 5, 6, 7], label: 'unit step' }
    ]
  },
  {
    id: 'array-building-8',
    title: 'Running Product Array',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'runningProduct',
    description: 'Given an array of numbers nums, return a new array where the element at index i is the product of all elements from index 0 through i. For an empty array, return [].',
    whatShouldHappen: [
      'If nums is empty, return [].',
      'Initialize result array and a running product accumulator to 1.',
      'Iterate through nums, multiplying running product by nums[i].',
      'Push running product into result.',
      'Return result.'
    ],
    starterCode: 'function runningProduct(nums) {\n  // your code here\n}',
    solution: 'function runningProduct(nums) {\n  if (nums.length === 0) return [];\n  const result = [];\n  let product = 1;\n  for (let i = 0; i < nums.length; i++) {\n    product *= nums[i];\n    result.push(product);\n  }\n  return result;\n}',
    skeletonHint: 'function runningProduct(nums) {\n  const result = [];\n  let product = 1;\n  for (let i = 0; i < nums.length; i++) {\n    product *= ____;\n    result.push(____);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4]',
      columns: ['i', 'nums[i]', 'product', 'result array'],
      rows: [
        { i: 0, 'nums[i]': 1, product: 1, 'result array': '[1]' },
        { i: 1, 'nums[i]': 2, product: 2, 'result array': '[1, 2]' },
        { i: 2, 'nums[i]': 3, product: 6, 'result array': '[1, 2, 6]' },
        { i: 3, 'nums[i]': 4, product: 24, 'result array': '[1, 2, 6, 24]' }
      ]
    },
    patternTag: 'Prefix Accumulation',
    patternExplanation: 'Tracking a running prefix total/product and pushing intermediate values transforms a collection in O(n) single-pass time.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, 4]], expected: [1, 2, 6, 24], label: 'standard numbers' },
      { input: [[2, 5, 10]], expected: [2, 10, 100], label: 'growing factors' },
      { input: [[]], expected: [], label: 'empty array' },
      { input: [[3, -1, 2]], expected: [3, -3, -6], label: 'negative number' }
    ]
  },
  {
    id: 'array-building-9',
    title: 'Alternate Interleave Arrays',
    category: 'array-building',
    difficulty: 'Easy',
    functionName: 'interleaveArrays',
    description: 'Given two arrays arr1 and arr2, construct and return a new array alternating elements: take one from arr1, then one from arr2, until all elements from both arrays are included. If one array is longer, append its remaining elements at the end.',
    whatShouldHappen: [
      'Find max length between arr1 and arr2 using Math.max.',
      'Loop index i from 0 up to max length.',
      'If i < arr1.length, push arr1[i] to result.',
      'If i < arr2.length, push arr2[i] to result.',
      'Return result.'
    ],
    starterCode: 'function interleaveArrays(arr1, arr2) {\n  // your code here\n}',
    solution: 'function interleaveArrays(arr1, arr2) {\n  const result = [];\n  const maxLen = Math.max(arr1.length, arr2.length);\n  for (let i = 0; i < maxLen; i++) {\n    if (i < arr1.length) result.push(arr1[i]);\n    if (i < arr2.length) result.push(arr2[i]);\n  }\n  return result;\n}',
    skeletonHint: 'function interleaveArrays(arr1, arr2) {\n  const result = [];\n  const maxLen = Math.max(arr1.length, arr2.length);\n  for (let i = 0; i < maxLen; i++) {\n    if (i < arr1.length) result.push(____);\n    if (i < arr2.length) result.push(____);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'arr1 = [1, 3], arr2 = [2, 4, 6]',
      columns: ['i', 'arr1[i]', 'arr2[i]', 'result array'],
      rows: [
        { i: 0, 'arr1[i]': 1, 'arr2[i]': 2, 'result array': '[1, 2]' },
        { i: 1, 'arr1[i]': 3, 'arr2[i]': 4, 'result array': '[1, 2, 3, 4]' },
        { i: 2, 'arr1[i]': 'undefined', 'arr2[i]': 6, 'result array': '[1, 2, 3, 4, 6]' }
      ]
    },
    patternTag: 'Dual Array Traversal',
    patternExplanation: 'Looping over the maximum length and guarding boundary checks for each array safely interleaves collections of unequal lengths.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], label: 'equal length arrays' },
      { input: [['a', 'b'], [1, 2, 3, 4]], expected: ['a', 1, 'b', 2, 3, 4], label: 'second array longer' },
      { input: [[], [1, 2]], expected: [1, 2], label: 'first array empty' },
      { input: [[10, 20], []], expected: [10, 20], label: 'second array empty' }
    ]
  },
  {
    id: 'array-building-10',
    title: 'Filter and Square Evens in Loop',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'filterAndSquareEvens',
    description: 'Given an array of integers nums, build and return a new array containing the squares (num ** 2) of only the even numbers, maintaining their relative order. Do not use built-in .filter() or .map().',
    whatShouldHappen: [
      'Initialize an empty result array.',
      'Iterate through nums with a loop.',
      'Check if current element is even using num % 2 === 0.',
      'If even, calculate square with num ** 2 and push to result.',
      'Return result.'
    ],
    starterCode: 'function filterAndSquareEvens(nums) {\n  // your code here\n}',
    solution: 'function filterAndSquareEvens(nums) {\n  const result = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] % 2 === 0) {\n      result.push(nums[i] ** 2);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function filterAndSquareEvens(nums) {\n  const result = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] % 2 === ____) {\n      result.push(nums[i] ** ____);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4]',
      columns: ['i', 'nums[i]', 'is even?', 'square', 'result array'],
      rows: [
        { i: 0, 'nums[i]': 1, 'is even?': 'false', square: '-', 'result array': '[]' },
        { i: 1, 'nums[i]': 2, 'is even?': 'true', square: '4', 'result array': '[4]' },
        { i: 2, 'nums[i]': 3, 'is even?': 'false', square: '-', 'result array': '[4]' },
        { i: 3, 'nums[i]': 4, 'is even?': 'true', square: '16', 'result array': '[4, 16]' }
      ]
    },
    patternTag: 'Conditional Transformation',
    patternExplanation: 'Combining condition filtering (if num % 2 === 0) with mathematical transformation (num ** 2) within a single loop prevents multiple allocations.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, 4, 5]], expected: [4, 16], label: 'mixed odd and even' },
      { input: [[1, 3, 5]], expected: [], label: 'all odd' },
      { input: [[0, -2, 6]], expected: [0, 4, 36], label: 'zero and negatives' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'array-building-11',
    title: 'Repeat Array Elements',
    category: 'array-building',
    difficulty: 'Beginner',
    functionName: 'repeatElements',
    description: 'Given an array arr and a non-negative integer times, construct and return a new array where every element of arr is repeated consecutive times times.',
    whatShouldHappen: [
      'Initialize an empty result array.',
      'If times <= 0 or arr is empty, return [].',
      'Loop through each item in arr.',
      'For each item, run an inner loop from 0 to times, pushing item into result.',
      'Return result.'
    ],
    starterCode: 'function repeatElements(arr, times) {\n  // your code here\n}',
    solution: 'function repeatElements(arr, times) {\n  const result = [];\n  if (times <= 0) return result;\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < times; j++) {\n      result.push(arr[i]);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function repeatElements(arr, times) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < ____; j++) {\n      result.push(arr[i]);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'arr = [1, 2], times = 3',
      columns: ['i', 'arr[i]', 'j (repeats)', 'result array'],
      rows: [
        { i: 0, 'arr[i]': 1, 'j (repeats)': '0, 1, 2', 'result array': '[1, 1, 1]' },
        { i: 1, 'arr[i]': 2, 'j (repeats)': '0, 1, 2', 'result array': '[1, 1, 1, 2, 2, 2]' }
      ]
    },
    patternTag: 'Nested Building Loop',
    patternExplanation: 'An outer loop over source items and an inner loop over repetition count constructs expanded sequence structures.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2], 3], expected: [1, 1, 1, 2, 2, 2], label: 'repeat twice 3 times' },
      { input: [['a', 'b'], 1], expected: ['a', 'b'], label: 'repeat once' },
      { input: [[5], 0], expected: [], label: 'zero repeats' },
      { input: [[], 4], expected: [], label: 'empty source array' }
    ]
  }
];

// -------------------------------------------------------------
// Group 3: Modern Iteration with for...of & for...in (for-in-for-of)
// -------------------------------------------------------------
const forInForOfNew = [
  {
    id: 'for-in-for-of-9',
    title: 'Find First Index with array.entries()',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'findFirstIndexForOf',
    description: 'Given an array items and a target value, use a for...of loop with array.entries() to find and return the 0-based index of the first occurrence where item === target. If target is not present, return -1.',
    whatShouldHappen: [
      'Use for (const [index, item] of items.entries()) to iterate over index-item pairs.',
      'If item strictly equals target, return index immediately.',
      'If loop finishes without finding target, return -1.'
    ],
    starterCode: 'function findFirstIndexForOf(items, target) {\n  // your code here\n}',
    solution: 'function findFirstIndexForOf(items, target) {\n  for (const [index, item] of items.entries()) {\n    if (item === target) {\n      return index;\n    }\n  }\n  return -1;\n}',
    skeletonHint: 'function findFirstIndexForOf(items, target) {\n  for (const [index, item] of items.____()) {\n    if (item === ____) {\n      return index;\n    }\n  }\n  return -1;\n}',
    traceTable: {
      inputLabel: "items = ['apple', 'banana', 'cherry'], target = 'banana'",
      columns: ['index', 'item', 'item === target', 'action'],
      rows: [
        { index: 0, item: 'apple', 'item === target': 'false', action: 'continue' },
        { index: 1, item: 'banana', 'item === target': 'true', action: 'return 1' }
      ]
    },
    patternTag: 'Indexed Iterable Loop',
    patternExplanation: 'array.entries() yields [index, value] pairs, combining the clean readability of for...of with direct access to element indices.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['apple', 'banana', 'cherry'], 'banana'], expected: 1, label: 'found in middle' },
      { input: [[10, 20, 30], 40], expected: -1, label: 'not found' },
      { input: [['x', 'x', 'y'], 'x'], expected: 0, label: 'first occurrence at 0' },
      { input: [[], 'any'], expected: -1, label: 'empty array' }
    ]
  },
  {
    id: 'for-in-for-of-10',
    title: 'Count Capital Letters with for...of',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'countCapitalsForOf',
    description: "Given a string str, iterate over each character using for...of and return the total count of uppercase ASCII letters ('A' through 'Z').",
    whatShouldHappen: [
      'Initialize count to 0.',
      'Iterate through str with for (const char of str).',
      "Check if char >= 'A' && char <= 'Z'.",
      'If true, increment count.',
      'Return count.'
    ],
    starterCode: 'function countCapitalsForOf(str) {\n  // your code here\n}',
    solution: "function countCapitalsForOf(str) {\n  let count = 0;\n  for (const char of str) {\n    if (char >= 'A' && char <= 'Z') {\n      count++;\n    }\n  }\n  return count;\n}",
    skeletonHint: "function countCapitalsForOf(str) {\n  let count = 0;\n  for (const char of str) {\n    if (char >= '____' && char <= '____') {\n      count++;\n    }\n  }\n  return count;\n}",
    traceTable: {
      inputLabel: "str = 'JsCode'",
      columns: ['char', 'is uppercase?', 'count'],
      rows: [
        { char: 'J', 'is uppercase?': 'true', count: 1 },
        { char: 's', 'is uppercase?': 'false', count: 1 },
        { char: 'C', 'is uppercase?': 'true', count: 2 },
        { char: 'o', 'is uppercase?': 'false', count: 2 },
        { char: 'd', 'is uppercase?': 'false', count: 2 },
        { char: 'e', 'is uppercase?': 'false', count: 2 }
      ]
    },
    patternTag: 'String Character Iteration',
    patternExplanation: 'Strings are iterable in JavaScript; for...of iterates over individual Unicode code points cleanly without indexing.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: ['JavaScript Mastery'], expected: 3, label: 'mixed title string' },
      { input: ['hello world'], expected: 0, label: 'all lowercase' },
      { input: ['ALL_CAPS'], expected: 7, label: 'all uppercase letters' },
      { input: [''], expected: 0, label: 'empty string' }
    ]
  },
  {
    id: 'for-in-for-of-11',
    title: 'Sum Positive Numbers with continue',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'sumPositivesWithContinue',
    description: 'Given an array of integers nums, use a for...of loop and the continue statement to skip all non-positive numbers (numbers <= 0). Return the sum of all strictly positive numbers.',
    whatShouldHappen: [
      'Initialize total to 0.',
      'Iterate through nums with for (const num of nums).',
      'If num <= 0, continue to the next iteration.',
      'Otherwise, add num to total.',
      'Return total.'
    ],
    starterCode: 'function sumPositivesWithContinue(nums) {\n  // your code here\n}',
    solution: 'function sumPositivesWithContinue(nums) {\n  let total = 0;\n  for (const num of nums) {\n    if (num <= 0) {\n      continue;\n    }\n    total += num;\n  }\n  return total;\n}',
    skeletonHint: 'function sumPositivesWithContinue(nums) {\n  let total = 0;\n  for (const num of nums) {\n    if (num <= ____) {\n      ____;\n    }\n    total += num;\n  }\n  return total;\n}',
    traceTable: {
      inputLabel: 'nums = [3, -2, 5, 0]',
      columns: ['num', 'num <= 0?', 'action', 'total'],
      rows: [
        { num: 3, 'num <= 0?': 'false', action: 'total += 3', total: 3 },
        { num: -2, 'num <= 0?': 'true', action: 'continue', total: 3 },
        { num: 5, 'num <= 0?': 'false', action: 'total += 5', total: 8 },
        { num: 0, 'num <= 0?': 'true', action: 'continue', total: 8 }
      ]
    },
    patternTag: 'Loop Guard Continue',
    patternExplanation: 'Using continue skips the remainder of the current iteration body, flattening nested if-else blocks into clean guard clauses.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[3, -2, 5, 0, -1, 4]], expected: 12, label: 'mixed positives and negatives' },
      { input: [[-5, -10, 0]], expected: 0, label: 'no positives' },
      { input: [[1, 2, 3]], expected: 6, label: 'all positives' },
      { input: [[]], expected: 0, label: 'empty array' }
    ]
  },
  {
    id: 'for-in-for-of-12',
    title: 'Join Words with Custom Delimiter using for...of',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'joinWordsForOf',
    description: 'Given an array of strings words and a delimiter string delimiter, use a for...of loop to concatenate them into a single string separated by delimiter. Avoid adding delimiter before the first word or after the last word. Do not use Array.prototype.join.',
    whatShouldHappen: [
      'If words is empty, return empty string.',
      'Initialize result to empty string.',
      'Iterate through words with for (const word of words).',
      'If result is not empty, append delimiter before word; otherwise just append word.',
      'Return result.'
    ],
    starterCode: 'function joinWordsForOf(words, delimiter) {\n  // your code here\n}',
    solution: 'function joinWordsForOf(words, delimiter) {\n  let result = "";\n  for (const word of words) {\n    if (result.length > 0) {\n      result += delimiter;\n    }\n    result += word;\n  }\n  return result;\n}',
    skeletonHint: 'function joinWordsForOf(words, delimiter) {\n  let result = "";\n  for (const word of words) {\n    if (result.length > 0) {\n      result += ____;\n    }\n    result += word;\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "words = ['a', 'b', 'c'], delimiter = '-'",
      columns: ['word', 'result before', 'delimiter added?', 'result after'],
      rows: [
        { word: 'a', 'result before': "''", 'delimiter added?': 'no', 'result after': "'a'" },
        { word: 'b', 'result before': "'a'", 'delimiter added?': 'yes (-)', 'result after': "'a-b'" },
        { word: 'c', 'result before': "'a-b'", 'delimiter added?': 'yes (-)', 'result after': "'a-b-c'" }
      ]
    },
    patternTag: 'Delimiter Concatenation',
    patternExplanation: 'Checking if the string accumulator is non-empty before prepending a separator avoids trailing delimiters and fencepost errors.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['red', 'green', 'blue'], ', '], expected: 'red, green, blue', label: 'comma separated' },
      { input: [['a', 'b', 'c'], '-'], expected: 'a-b-c', label: 'hyphen separated' },
      { input: [['lone'], '/'], expected: 'lone', label: 'single word' },
      { input: [[], ','], expected: '', label: 'empty array' }
    ]
  },
  {
    id: 'for-in-for-of-13',
    title: 'Extract Defined Values with Nullish Coalescing',
    category: 'for-in-for-of',
    difficulty: 'Beginner',
    functionName: 'coalesceDefaults',
    description: 'Given an array items containing any values and a defaultValue, use a for...of loop and the nullish coalescing operator (??) to return a new array where only null or undefined elements are replaced by defaultValue. Falsy values like 0, false, and "" must NOT be replaced.',
    whatShouldHappen: [
      'Initialize an empty result array.',
      'Iterate through items with for (const item of items).',
      'Apply item ?? defaultValue and push to result.',
      'Return result.'
    ],
    starterCode: 'function coalesceDefaults(items, defaultValue) {\n  // your code here\n}',
    solution: 'function coalesceDefaults(items, defaultValue) {\n  const result = [];\n  for (const item of items) {\n    result.push(item ?? defaultValue);\n  }\n  return result;\n}',
    skeletonHint: 'function coalesceDefaults(items, defaultValue) {\n  const result = [];\n  for (const item of items) {\n    result.push(item ?? ____);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "items = [1, null, 0, undefined], defaultValue = 'default'",
      columns: ['item', 'item ?? defaultValue', 'pushed value'],
      rows: [
        { item: 1, 'item ?? defaultValue': 1, 'pushed value': 1 },
        { item: 'null', 'item ?? defaultValue': "'default'", 'pushed value': "'default'" },
        { item: 0, 'item ?? defaultValue': 0, 'pushed value': 0 },
        { item: 'undefined', 'item ?? defaultValue': "'default'", 'pushed value': "'default'" }
      ]
    },
    patternTag: 'Nullish Coalescing Iteration',
    patternExplanation: 'The nullish coalescing operator (??) specifically differentiates null and undefined from falsy values like 0 or "", essential in data normalization.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, null, 3, undefined, 5], 0], expected: [1, 0, 3, 0, 5], label: 'replaces null and undefined with 0' },
      { input: [[false, '', 0, null], 'fallback'], expected: [false, '', 0, 'fallback'], label: 'preserves false 0 and empty string' },
      { input: [[], 'test'], expected: [], label: 'empty array' },
      { input: [[null, undefined], 'default'], expected: ['default', 'default'], label: 'only nullish values' }
    ]
  }
];

// -------------------------------------------------------------
// Group 4: Object Loops (object-loops)
// -------------------------------------------------------------
const objectLoopsNew = [
  {
    id: 'object-loops-7',
    title: 'Scale Object Numeric Values',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'scaleObjectValues',
    description: 'Given an object obj whose values are numbers and a numeric factor, return a new object where each property value is multiplied by factor using Object.entries().',
    whatShouldHappen: [
      'Initialize a new result object.',
      'Iterate through [key, value] pairs of Object.entries(obj).',
      'Multiply value by factor and assign to result[key].',
      'Return result.'
    ],
    starterCode: 'function scaleObjectValues(obj, factor) {\n  // your code here\n}',
    solution: 'function scaleObjectValues(obj, factor) {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    result[key] = value * factor;\n  }\n  return result;\n}',
    skeletonHint: 'function scaleObjectValues(obj, factor) {\n  const result = {};\n  for (const [key, value] of Object.____(obj)) {\n    result[key] = value * ____;\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'obj = { a: 2, b: 5 }, factor = 3',
      columns: ['key', 'value', 'value * factor', 'result'],
      rows: [
        { key: 'a', value: 2, 'value * factor': 6, result: '{ a: 6 }' },
        { key: 'b', value: 5, 'value * factor': 15, result: '{ a: 6, b: 15 }' }
      ]
    },
    patternTag: 'Object Entry Transformation',
    patternExplanation: 'Object.entries() produces an array of [key, value] tuples, enabling clean destructuring in for...of loops for transforming object properties.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 2, b: 5, c: 10 }, 3], expected: { a: 6, b: 15, c: 30 }, label: 'scale by 3' },
      { input: [{ x: -4, y: 0 }, 2], expected: { x: -8, y: 0 }, label: 'negative and zero' },
      { input: [{}, 5], expected: {}, label: 'empty object' },
      { input: [{ count: 1 }, 0], expected: { count: 0 }, label: 'scale by zero' }
    ]
  },
  {
    id: 'object-loops-8',
    title: 'Filter Object by Property Value Threshold',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'filterObjectByThreshold',
    description: 'Given an object obj whose values are numbers, and a number minThreshold, return a new object containing only properties whose values are greater than or equal to minThreshold.',
    whatShouldHappen: [
      'Initialize a new empty result object.',
      'Iterate through entries of obj with Object.entries(obj).',
      'If value >= minThreshold, assign result[key] = value.',
      'Return result.'
    ],
    starterCode: 'function filterObjectByThreshold(obj, minThreshold) {\n  // your code here\n}',
    solution: 'function filterObjectByThreshold(obj, minThreshold) {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    if (value >= minThreshold) {\n      result[key] = value;\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function filterObjectByThreshold(obj, minThreshold) {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    if (value >= ____) {\n      result[key] = ____;\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'obj = { apples: 5, bananas: 2 }, minThreshold = 5',
      columns: ['key', 'value', 'value >= 5', 'kept in result?'],
      rows: [
        { key: 'apples', value: 5, 'value >= 5': 'true', 'kept in result?': 'yes' },
        { key: 'bananas', value: 2, 'value >= 5': 'false', 'kept in result?': 'no' }
      ]
    },
    patternTag: 'Object Property Filtering',
    patternExplanation: 'Iterating entries and conditionally setting properties on a fresh object creates an immutable filtered copy.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ apples: 5, bananas: 2, oranges: 8 }, 5], expected: { apples: 5, oranges: 8 }, label: 'filter above 5' },
      { input: [{ a: 1, b: 2, c: 3 }, 10], expected: {}, label: 'no values pass threshold' },
      { input: [{ p: 100 }, 50], expected: { p: 100 }, label: 'single pass' },
      { input: [{}, 0], expected: {}, label: 'empty object' }
    ]
  },
  {
    id: 'object-loops-9',
    title: 'Count Property Types in Object',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'countPropertyTypes',
    description: "Given an object obj, iterate over its values using Object.values(obj) and return an object counting occurrences of each typeof primitive (e.g. 'string', 'number', 'boolean').",
    whatShouldHappen: [
      'Initialize a counts object.',
      'Iterate through Object.values(obj) using for...of.',
      'Determine type with typeof val.',
      'Increment counts[type] = (counts[type] || 0) + 1.',
      'Return counts.'
    ],
    starterCode: 'function countPropertyTypes(obj) {\n  // your code here\n}',
    solution: 'function countPropertyTypes(obj) {\n  const counts = {};\n  for (const val of Object.values(obj)) {\n    const type = typeof val;\n    counts[type] = (counts[type] || 0) + 1;\n  }\n  return counts;\n}',
    skeletonHint: 'function countPropertyTypes(obj) {\n  const counts = {};\n  for (const val of Object.____(obj)) {\n    const type = typeof ____;\n    counts[type] = (counts[type] || 0) + 1;\n  }\n  return counts;\n}',
    traceTable: {
      inputLabel: "obj = { name: 'Alice', age: 30, active: true }",
      columns: ['val', 'typeof val', 'counts object'],
      rows: [
        { val: 'Alice', 'typeof val': 'string', 'counts object': '{ string: 1 }' },
        { val: 30, 'typeof val': 'number', 'counts object': '{ string: 1, number: 1 }' },
        { val: 'true', 'typeof val': 'boolean', 'counts object': '{ string: 1, number: 1, boolean: 1 }' }
      ]
    },
    patternTag: 'Type Tally Frequency',
    patternExplanation: 'Object.values() extracts property values directly, simplifying tallying and histogram creation when keys are not needed.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ name: 'Alice', age: 30, active: true, city: 'Paris' }], expected: { string: 2, number: 1, boolean: 1 }, label: 'mixed types' },
      { input: [{ a: 1, b: 2, c: 3 }], expected: { number: 3 }, label: 'all numbers' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ flag: false, count: 0 }], expected: { boolean: 1, number: 1 }, label: 'falsy primitive types' }
    ]
  },
  {
    id: 'object-loops-10',
    title: 'Format Object to Query String Pairs',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'objectToQueryPairs',
    description: "Given an object params representing query parameters, iterate over Object.entries(params) and return an array of strings in 'key=value' format. If params is empty, return [].",
    whatShouldHappen: [
      'Initialize an empty array pairs.',
      'Iterate through [key, value] of Object.entries(params).',
      'Format string using template literal `${key}=${value}` and push to pairs.',
      'Return pairs.'
    ],
    starterCode: 'function objectToQueryPairs(params) {\n  // your code here\n}',
    solution: 'function objectToQueryPairs(params) {\n  const pairs = [];\n  for (const [key, value] of Object.entries(params)) {\n    pairs.push(`${key}=${value}`);\n  }\n  return pairs;\n}',
    skeletonHint: 'function objectToQueryPairs(params) {\n  const pairs = [];\n  for (const [key, value] of Object.entries(params)) {\n    pairs.push(`${____}=${____}`);\n  }\n  return pairs;\n}',
    traceTable: {
      inputLabel: "params = { page: 1, sort: 'desc' }",
      columns: ['key', 'value', 'formatted string', 'pairs array'],
      rows: [
        { key: 'page', value: 1, 'formatted string': "'page=1'", 'pairs array': "['page=1']" },
        { key: 'sort', value: 'desc', 'formatted string': "'sort=desc'", 'pairs array': "['page=1', 'sort=desc']" }
      ]
    },
    patternTag: 'Key-Value String Formatting',
    patternExplanation: 'Transforming entries into formatted strings using template literals is the fundamental step for URL query strings, HTTP headers, and configuration files.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ page: 1, sort: 'desc', filter: 'active' }], expected: ['page=1', 'sort=desc', 'filter=active'], label: 'multiple params' },
      { input: [{ id: 42 }], expected: ['id=42'], label: 'single param' },
      { input: [{}], expected: [], label: 'empty object' },
      { input: [{ a: 'foo', b: 'bar' }], expected: ['a=foo', 'b=bar'], label: 'string values' }
    ]
  },
  {
    id: 'object-loops-11',
    title: 'Merge and Sum Object Counts',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'mergeAndSumCounts',
    description: 'Given two objects objA and objB whose values are numeric quantities, return a merged object where each key value is the sum of its counts from both objects. Use for...in or Object.keys() to visit all keys.',
    whatShouldHappen: [
      'Initialize a result object with a shallow clone of objA.',
      'Loop through keys of objB using Object.keys(objB).',
      'Add objB[key] to result[key] (using (result[key] || 0) + objB[key]).',
      'Return result.'
    ],
    starterCode: 'function mergeAndSumCounts(objA, objB) {\n  // your code here\n}',
    solution: 'function mergeAndSumCounts(objA, objB) {\n  const result = { ...objA };\n  for (const key of Object.keys(objB)) {\n    result[key] = (result[key] || 0) + objB[key];\n  }\n  return result;\n}',
    skeletonHint: 'function mergeAndSumCounts(objA, objB) {\n  const result = { ...objA };\n  for (const key of Object.keys(objB)) {\n    result[key] = (result[key] || 0) + ____;\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'objA = { apples: 3 }, objB = { apples: 2, bananas: 5 }',
      columns: ['key in objB', 'existing in result', 'added value', 'result after'],
      rows: [
        { 'key in objB': 'apples', 'existing in result': 3, 'added value': 2, 'result after': '{ apples: 5 }' },
        { 'key in objB': 'bananas', 'existing in result': 'undefined (0)', 'added value': 5, 'result after': '{ apples: 5, bananas: 5 }' }
      ]
    },
    patternTag: 'Object Aggregation Merge',
    patternExplanation: 'Cloning the initial object and aggregating secondary entries using logical OR fallback (result[key] || 0) cleanly sums inventory counts.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [{ apples: 3, oranges: 2 }, { apples: 2, bananas: 5 }], expected: { apples: 5, oranges: 2, bananas: 5 }, label: 'overlapping keys' },
      { input: [{}, { widgets: 10 }], expected: { widgets: 10 }, label: 'first object empty' },
      { input: [{ x: 1 }, {}], expected: { x: 1 }, label: 'second object empty' },
      { input: [{}, {}], expected: {}, label: 'both empty' }
    ]
  }
];

// -------------------------------------------------------------
// Group 5: Set & Map Loops (maps-and-sets)
// -------------------------------------------------------------
const mapsAndSetsNew = [
  {
    id: 'maps-and-sets-1',
    title: 'Filter Array by Set Membership',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'filterBySetMembership',
    description: 'Given an array items and an array allowedList, construct a Set from allowedList for O(1) lookups. Iterate through items using for...of and return an array containing only elements present in the set.',
    whatShouldHappen: [
      'Construct a Set from allowedList: const allowedSet = new Set(allowedList).',
      'Initialize an empty result array.',
      'Iterate through items with for (const item of items).',
      'If allowedSet.has(item), push item to result.',
      'Return result.'
    ],
    starterCode: 'function filterBySetMembership(items, allowedList) {\n  // your code here\n}',
    solution: 'function filterBySetMembership(items, allowedList) {\n  const allowedSet = new Set(allowedList);\n  const result = [];\n  for (const item of items) {\n    if (allowedSet.has(item)) {\n      result.push(item);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function filterBySetMembership(items, allowedList) {\n  const allowedSet = new Set(____);\n  const result = [];\n  for (const item of items) {\n    if (allowedSet.____(item)) {\n      result.push(item);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'items = [1, 2, 3], allowedList = [2, 4]',
      columns: ['item', 'allowedSet.has(item)', 'action', 'result array'],
      rows: [
        { item: 1, 'allowedSet.has(item)': 'false', action: 'skip', 'result array': '[]' },
        { item: 2, 'allowedSet.has(item)': 'true', action: 'push', 'result array': '[2]' },
        { item: 3, 'allowedSet.has(item)': 'false', action: 'skip', 'result array': '[2]' }
      ]
    },
    patternTag: 'Set Fast Lookup',
    patternExplanation: 'Set.prototype.has() provides O(1) constant-time membership checking, drastically optimizing filter operations over large arrays.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, 4, 5], [2, 4, 6]], expected: [2, 4], label: 'filter numbers' },
      { input: [['cat', 'dog', 'bird'], ['fish', 'lizard']], expected: [], label: 'no matches' },
      { input: [[10, 20], [10, 20, 30]], expected: [10, 20], label: 'all match' },
      { input: [[], [1, 2]], expected: [], label: 'empty items' }
    ]
  },
  {
    id: 'maps-and-sets-2',
    title: 'Find Common Unique Elements with Set Loop',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'findCommonUnique',
    description: 'Given two arrays arr1 and arr2, return an array of unique values that appear in both arrays. Convert both arrays to Sets and iterate over the first set with for...of.',
    whatShouldHappen: [
      'Create set1 = new Set(arr1) and set2 = new Set(arr2).',
      'Initialize result array.',
      'Iterate through set1 with for (const val of set1).',
      'If set2.has(val), push val to result.',
      'Return result.'
    ],
    starterCode: 'function findCommonUnique(arr1, arr2) {\n  // your code here\n}',
    solution: 'function findCommonUnique(arr1, arr2) {\n  const set1 = new Set(arr1);\n  const set2 = new Set(arr2);\n  const result = [];\n  for (const val of set1) {\n    if (set2.has(val)) {\n      result.push(val);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function findCommonUnique(arr1, arr2) {\n  const set1 = new Set(____);\n  const set2 = new Set(____);\n  const result = [];\n  for (const val of set1) {\n    if (set2.____(val)) {\n      result.push(val);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'arr1 = [1, 2, 2, 3], arr2 = [2, 3, 4]',
      columns: ['val in set1', 'set2.has(val)', 'result array'],
      rows: [
        { 'val in set1': 1, 'set2.has(val)': 'false', 'result array': '[]' },
        { 'val in set1': 2, 'set2.has(val)': 'true', 'result array': '[2]' },
        { 'val in set1': 3, 'set2.has(val)': 'true', 'result array': '[2, 3]' }
      ]
    },
    patternTag: 'Set Intersection Iteration',
    patternExplanation: 'Iterating over a deduplicated Set and checking membership in a second Set computes mathematical set intersection cleanly.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 2, 3], [2, 3, 3, 4]], expected: [2, 3], label: 'deduplicated common elements' },
      { input: [['a', 'b'], ['c', 'd']], expected: [], label: 'disjoint arrays' },
      { input: [[5, 5, 5], [5]], expected: [5], label: 'single common element with duplicates' },
      { input: [[], [1, 2]], expected: [], label: 'empty first array' }
    ]
  },
  {
    id: 'maps-and-sets-3',
    title: 'Build Frequency Map Entries',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'buildFrequencyMapEntries',
    description: 'Given an array items, use a for...of loop to count the occurrences of each element in a Map. Return the result as an array of [key, count] pairs using Array.from(map.entries()).',
    whatShouldHappen: [
      'Create const map = new Map().',
      'Iterate through items with for (const item of items).',
      'Update map: map.set(item, (map.get(item) || 0) + 1).',
      'Return Array.from(map.entries()).'
    ],
    starterCode: 'function buildFrequencyMapEntries(items) {\n  // your code here\n}',
    solution: 'function buildFrequencyMapEntries(items) {\n  const map = new Map();\n  for (const item of items) {\n    map.set(item, (map.get(item) || 0) + 1);\n  }\n  return Array.from(map.entries());\n}',
    skeletonHint: 'function buildFrequencyMapEntries(items) {\n  const map = new Map();\n  for (const item of items) {\n    map.set(item, (map.get(item) || 0) + ____);\n  }\n  return Array.from(map.____());\n}',
    traceTable: {
      inputLabel: "items = ['a', 'b', 'a']",
      columns: ['item', 'map.get(item)', 'new count', 'map state'],
      rows: [
        { item: 'a', 'map.get(item)': 'undefined (0)', 'new count': 1, 'map state': "{'a' => 1}" },
        { item: 'b', 'map.get(item)': 'undefined (0)', 'new count': 1, 'map state': "{'a' => 1, 'b' => 1}" },
        { item: 'a', 'map.get(item)': '1', 'new count': 2, 'map state': "{'a' => 2, 'b' => 1}" }
      ]
    },
    patternTag: 'Map Frequency Counter',
    patternExplanation: 'Map maintains insertion order and supports any key type, making map.set(key, (map.get(key) || 0) + 1) the idiomatic frequency counting pattern.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['a', 'b', 'a', 'c', 'b', 'a']], expected: [['a', 3], ['b', 2], ['c', 1]], label: 'string frequencies' },
      { input: [[1, 2, 3]], expected: [[1, 1], [2, 1], [3, 1]], label: 'distinct numbers' },
      { input: [[]], expected: [], label: 'empty array' },
      { input: [['x', 'x', 'x']], expected: [['x', 3]], label: 'identical elements' }
    ]
  },
  {
    id: 'maps-and-sets-4',
    title: 'Find Key with Highest Frequency from Map',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'findMostFrequentFromMap',
    description: 'Given an array of [key, count] pairs, initialize a Map and iterate through its entries using for (const [key, count] of map) to find and return the key with the highest count. If the map is empty, return null.',
    whatShouldHappen: [
      'If pairs is empty, return null.',
      'Initialize const map = new Map(pairs).',
      'Track maxKey = null and maxCount = -Infinity.',
      'Iterate through entries with for (const [key, count] of map).',
      'If count > maxCount, update maxCount = count and maxKey = key.',
      'Return maxKey.'
    ],
    starterCode: 'function findMostFrequentFromMap(pairs) {\n  // your code here\n}',
    solution: 'function findMostFrequentFromMap(pairs) {\n  if (pairs.length === 0) return null;\n  const map = new Map(pairs);\n  let maxKey = null;\n  let maxCount = -Infinity;\n  for (const [key, count] of map) {\n    if (count > maxCount) {\n      maxCount = count;\n      maxKey = key;\n    }\n  }\n  return maxKey;\n}',
    skeletonHint: 'function findMostFrequentFromMap(pairs) {\n  if (pairs.length === 0) return null;\n  const map = new Map(pairs);\n  let maxKey = null;\n  let maxCount = -Infinity;\n  for (const [key, count] of map) {\n    if (count > ____) {\n      maxCount = count;\n      maxKey = ____;\n    }\n  }\n  return maxKey;\n}',
    traceTable: {
      inputLabel: "pairs = [['apple', 5], ['banana', 12]]",
      columns: ['key', 'count', 'count > maxCount', 'maxKey', 'maxCount'],
      rows: [
        { key: 'apple', count: 5, 'count > maxCount': 'true', maxKey: 'apple', maxCount: 5 },
        { key: 'banana', count: 12, 'count > maxCount': 'true', maxKey: 'banana', maxCount: 12 }
      ]
    },
    patternTag: 'Map Entry Traversal',
    patternExplanation: 'Maps are directly iterable with for...of, yielding [key, value] pairs without requiring extra Object.entries conversions.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [[['apple', 5], ['banana', 12], ['cherry', 3]]], expected: 'banana', label: 'find max frequency' },
      { input: [[['x', 1]]], expected: 'x', label: 'single entry' },
      { input: [[]], expected: null, label: 'empty map' },
      { input: [[['a', 10], ['b', 2]]], expected: 'a', label: 'first key largest' }
    ]
  },
  {
    id: 'maps-and-sets-5',
    title: 'Filter Map Keys by Value Threshold',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'filterMapKeysByMin',
    description: 'Given an array of [key, numericValue] pairs and a minThreshold, construct a Map and iterate over its entries. Return an array containing only the keys whose associated value is greater than or equal to minThreshold.',
    whatShouldHappen: [
      'Construct const map = new Map(pairs).',
      'Initialize an empty result array.',
      'Iterate through map entries with for (const [key, val] of map).',
      'If val >= minThreshold, push key into result.',
      'Return result.'
    ],
    starterCode: 'function filterMapKeysByMin(pairs, minThreshold) {\n  // your code here\n}',
    solution: 'function filterMapKeysByMin(pairs, minThreshold) {\n  const map = new Map(pairs);\n  const result = [];\n  for (const [key, val] of map) {\n    if (val >= minThreshold) {\n      result.push(key);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function filterMapKeysByMin(pairs, minThreshold) {\n  const map = new Map(pairs);\n  const result = [];\n  for (const [key, val] of map) {\n    if (val >= ____) {\n      result.push(____);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "pairs = [['gold', 100], ['bronze', 20]], minThreshold = 50",
      columns: ['key', 'val', 'val >= 50', 'pushed to result?'],
      rows: [
        { key: 'gold', val: 100, 'val >= 50': 'true', 'pushed to result?': 'yes' },
        { key: 'bronze', val: 20, 'val >= 50': 'false', 'pushed to result?': 'no' }
      ]
    },
    patternTag: 'Map Value Filtering',
    patternExplanation: 'Iterating over a Map while filtering on values extracts key subsets based on quantitative criteria.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[['gold', 100], ['silver', 50], ['bronze', 20]], 50], expected: ['gold', 'silver'], label: 'filter values >= 50' },
      { input: [[['a', 5], ['b', 10]], 20], expected: [], label: 'no values meet threshold' },
      { input: [[], 10], expected: [], label: 'empty pairs' },
      { input: [[['alpha', 1], ['beta', 2]], 1], expected: ['alpha', 'beta'], label: 'all values meet threshold' }
    ]
  }
];

// -------------------------------------------------------------
// Group 6: Functional Array Loops: Map, Filter, Reduce (array-methods)
// -------------------------------------------------------------
const arrayMethodsNew = [
  {
    id: 'array-methods-format-full-names',
    title: 'Map: Format User Full Names',
    category: 'array-methods',
    difficulty: 'Beginner',
    functionName: 'formatFullNames',
    description: "Given an array of user objects users, where each object has firstName and lastName string properties, use Array.prototype.map to return an array of full name strings formatted as 'firstName lastName'.",
    whatShouldHappen: [
      'Use .map() on the users array.',
      'For each user, construct a string `${user.firstName} ${user.lastName}`.',
      'Return the transformed array.'
    ],
    starterCode: 'function formatFullNames(users) {\n  // your code here\n}',
    solution: 'function formatFullNames(users) {\n  return users.map((u) => `${u.firstName} ${u.lastName}`);\n}',
    skeletonHint: 'function formatFullNames(users) {\n  return users.map(u => `${u.____} ${u.____}`);\n}',
    traceTable: {
      inputLabel: "users = [{ firstName: 'John', lastName: 'Doe' }]",
      columns: ['firstName', 'lastName', 'formatted full name'],
      rows: [
        { firstName: 'John', lastName: 'Doe', 'formatted full name': "'John Doe'" }
      ]
    },
    patternTag: 'Array Map Projection',
    patternExplanation: '.map() transforms each element of an array into a new value, preserving array length and order.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }]], expected: ['John Doe', 'Jane Smith'], label: 'two users' },
      { input: [[{ firstName: 'Ada', lastName: 'Lovelace' }]], expected: ['Ada Lovelace'], label: 'single user' },
      { input: [[]], expected: [], label: 'empty array' },
      { input: [[{ firstName: 'Alan', lastName: 'Turing' }, { firstName: 'Grace', lastName: 'Hopper' }]], expected: ['Alan Turing', 'Grace Hopper'], label: 'pioneers' }
    ]
  },
  {
    id: 'array-methods-filter-even-indices',
    title: 'Filter: Elements at Even Indices',
    category: 'array-methods',
    difficulty: 'Beginner',
    functionName: 'filterEvenIndices',
    description: 'Given an array arr, use Array.prototype.filter with its index argument to return a new array containing only elements located at even indices (index 0, 2, 4, ...).',
    whatShouldHappen: [
      'Call arr.filter((_, index) => ...).',
      'Check if index % 2 === 0.',
      'Return the filtered array.'
    ],
    starterCode: 'function filterEvenIndices(arr) {\n  // your code here\n}',
    solution: 'function filterEvenIndices(arr) {\n  return arr.filter((_, index) => index % 2 === 0);\n}',
    skeletonHint: 'function filterEvenIndices(arr) {\n  return arr.filter((_, index) => index % 2 === ____);\n}',
    traceTable: {
      inputLabel: "arr = ['a', 'b', 'c', 'd']",
      columns: ['index', 'element', 'index % 2 === 0', 'kept?'],
      rows: [
        { index: 0, element: 'a', 'index % 2 === 0': 'true', 'kept?': 'yes' },
        { index: 1, element: 'b', 'index % 2 === 0': 'false', 'kept?': 'no' },
        { index: 2, element: 'c', 'index % 2 === 0': 'true', 'kept?': 'yes' },
        { index: 3, element: 'd', 'index % 2 === 0': 'false', 'kept?': 'no' }
      ]
    },
    patternTag: 'Index-Aware Filtering',
    patternExplanation: 'The secondary index parameter in Array callbacks provides clean access to position within the array without external index counters.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [['a', 'b', 'c', 'd', 'e']], expected: ['a', 'c', 'e'], label: 'letters at 0 2 4' },
      { input: [[10, 20, 30, 40]], expected: [10, 30], label: 'numbers at 0 2' },
      { input: [[100]], expected: [100], label: 'single element' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'array-methods-tally-occurrences',
    title: 'Reduce: Tally Occurrences into Object',
    category: 'array-methods',
    difficulty: 'Beginner',
    functionName: 'tallyOccurrences',
    description: 'Given an array of strings or numbers items, use Array.prototype.reduce with an initial empty object {} to return an object counting how many times each item appears.',
    whatShouldHappen: [
      'Call items.reduce((acc, item) => ..., {}).',
      'For each item, update acc[item] = (acc[item] || 0) + 1.',
      'Return accumulator acc on each step.',
      'Return final object.'
    ],
    starterCode: 'function tallyOccurrences(items) {\n  // your code here\n}',
    solution: 'function tallyOccurrences(items) {\n  return items.reduce((acc, item) => {\n    acc[item] = (acc[item] || 0) + 1;\n    return acc;\n  }, {});\n}',
    skeletonHint: 'function tallyOccurrences(items) {\n  return items.reduce((acc, item) => {\n    acc[item] = (acc[item] || 0) + ____;\n    return acc;\n  }, {});\n}',
    traceTable: {
      inputLabel: "items = ['apple', 'banana', 'apple']",
      columns: ['item', 'acc before', 'acc after'],
      rows: [
        { item: 'apple', 'acc before': '{}', 'acc after': '{ apple: 1 }' },
        { item: 'banana', 'acc before': '{ apple: 1 }', 'acc after': '{ apple: 1, banana: 1 }' },
        { item: 'apple', 'acc before': '{ apple: 1, banana: 1 }', 'acc after': '{ apple: 2, banana: 1 }' }
      ]
    },
    patternTag: 'Reduce Frequency Tally',
    patternExplanation: '.reduce() with an object accumulator aggregates a flat array into an indexed histogram in a single pass.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['apple', 'orange', 'apple', 'banana', 'orange', 'apple']], expected: { apple: 3, orange: 2, banana: 1 }, label: 'fruit frequencies' },
      { input: [[1, 2, 2, 3]], expected: { 1: 1, 2: 2, 3: 1 }, label: 'number frequencies' },
      { input: [[]], expected: {}, label: 'empty array' },
      { input: [['solo']], expected: { solo: 1 }, label: 'single element' }
    ]
  },
  {
    id: 'array-methods-group-by-category',
    title: 'Reduce: Group Items by Category',
    category: 'array-methods',
    difficulty: 'Easy',
    functionName: 'groupByCategory',
    description: 'Given an array of objects items, each having name and category string properties, use Array.prototype.reduce to group item names by category into an object where keys are categories and values are arrays of names.',
    whatShouldHappen: [
      'Call items.reduce((acc, item) => ..., {}).',
      'If acc[item.category] does not exist, initialize it to [].',
      'Push item.name to acc[item.category].',
      'Return acc.',
      'Return final grouped object.'
    ],
    starterCode: 'function groupByCategory(items) {\n  // your code here\n}',
    solution: 'function groupByCategory(items) {\n  return items.reduce((acc, item) => {\n    if (!acc[item.category]) {\n      acc[item.category] = [];\n    }\n    acc[item.category].push(item.name);\n    return acc;\n  }, {});\n}',
    skeletonHint: 'function groupByCategory(items) {\n  return items.reduce((acc, item) => {\n    if (!acc[item.category]) {\n      acc[item.category] = ____;\n    }\n    acc[item.category].push(item.____);\n    return acc;\n  }, {});\n}',
    traceTable: {
      inputLabel: "items = [{name: 'apple', category: 'fruit'}, {name: 'carrot', category: 'veg'}]",
      columns: ['item.name', 'item.category', 'grouped object state'],
      rows: [
        { 'item.name': 'apple', 'item.category': 'fruit', 'grouped object state': "{ fruit: ['apple'] }" },
        { 'item.name': 'carrot', 'item.category': 'veg', 'grouped object state': "{ fruit: ['apple'], veg: ['carrot'] }" }
      ]
    },
    patternTag: 'Reduce Group By',
    patternExplanation: 'Grouping arrays into keyed buckets is one of the most common data modeling tasks, implemented seamlessly with .reduce().',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [[{ name: 'apple', category: 'fruit' }, { name: 'carrot', category: 'veg' }, { name: 'banana', category: 'fruit' }]], expected: { fruit: ['apple', 'banana'], veg: ['carrot'] }, label: 'multiple categories' },
      { input: [[{ name: 'desk', category: 'furniture' }]], expected: { furniture: ['desk'] }, label: 'single category' },
      { input: [[]], expected: {}, label: 'empty items' },
      { input: [[{ name: 'rose', category: 'flower' }, { name: 'tulip', category: 'flower' }]], expected: { flower: ['rose', 'tulip'] }, label: 'same category' }
    ]
  },
  {
    id: 'array-methods-check-thresholds',
    title: 'Every & Some: Check Score Thresholds',
    category: 'array-methods',
    difficulty: 'Beginner',
    functionName: 'checkScoreThresholds',
    description: 'Given an array of numbers scores and a passThreshold, return an object { allPassed: boolean, anyPassed: boolean } using Array.prototype.every and Array.prototype.some. For an empty scores array, return { allPassed: true, anyPassed: false }.',
    whatShouldHappen: [
      'Calculate allPassed using scores.every(s => s >= passThreshold).',
      'Calculate anyPassed using scores.some(s => s >= passThreshold).',
      'Return { allPassed, anyPassed }.'
    ],
    starterCode: 'function checkScoreThresholds(scores, passThreshold) {\n  // your code here\n}',
    solution: 'function checkScoreThresholds(scores, passThreshold) {\n  return {\n    allPassed: scores.every((s) => s >= passThreshold),\n    anyPassed: scores.some((s) => s >= passThreshold),\n  };\n}',
    skeletonHint: 'function checkScoreThresholds(scores, passThreshold) {\n  return {\n    allPassed: scores.every(s => s >= ____),\n    anyPassed: scores.some(s => s >= ____),\n  };\n}',
    traceTable: {
      inputLabel: 'scores = [85, 90, 78], passThreshold = 70',
      columns: ['scores', 'every >= 70', 'some >= 70', 'result object'],
      rows: [
        { scores: '[85, 90, 78]', 'every >= 70': 'true', 'some >= 70': 'true', 'result object': '{ allPassed: true, anyPassed: true }' }
      ]
    },
    patternTag: 'Predicate Quantification',
    patternExplanation: '.every() checks for universal quantification (all elements satisfy predicate) and .some() checks for existential quantification (at least one satisfies).',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[85, 90, 78, 92], 70], expected: { allPassed: true, anyPassed: true }, label: 'all scores passed' },
      { input: [[45, 60, 55], 70], expected: { allPassed: false, anyPassed: false }, label: 'none passed' },
      { input: [[50, 75, 60], 70], expected: { allPassed: false, anyPassed: true }, label: 'some passed' },
      { input: [[], 70], expected: { allPassed: true, anyPassed: false }, label: 'empty array' }
    ]
  }
];

const allNewGroups = [
  { name: 'basic-loops', file: 'server/data/problems/basic-loops.json', problems: basicLoopsNew, append: true },
  { name: 'array-building', file: 'server/data/problems/array-building.json', problems: arrayBuildingNew, append: true },
  { name: 'for-in-for-of', file: 'server/data/problems/for-in-for-of.json', problems: forInForOfNew, append: true },
  { name: 'object-loops', file: 'server/data/problems/object-loops.json', problems: objectLoopsNew, append: true },
  { name: 'maps-and-sets', file: 'server/data/problems/maps-and-sets.json', problems: mapsAndSetsNew, append: false },
  { name: 'array-methods', file: 'server/data/problems/array-methods/iteration.json', problems: arrayMethodsNew, append: true }
];

async function run() {
  console.log('=== VALIDATING & RUNNING ALL 30 NEW PROBLEMS ===\n');

  let totalProblems = 0;
  for (const group of allNewGroups) {
    console.log(`Checking group: ${group.name} (${group.problems.length} problems)...`);
    for (const p of group.problems) {
      totalProblems++;
      const valErrors = validateProblem(p);
      if (valErrors.length > 0) {
        console.error(`Validation error in ${p.id} (${p.title}):`, valErrors);
        process.exit(1);
      }

      // Test execution
      const fn = new Function('return (' + p.solution + ')')();
      for (let tIdx = 0; tIdx < p.tests.length; tIdx++) {
        const testCase = p.tests[tIdx];
        const rawArgs = Array.isArray(testCase.input) ? testCase.input : [testCase.input];
        const actual = fn.apply(null, JSON.parse(JSON.stringify(rawArgs)));
        if (!deepEqual(actual, testCase.expected)) {
          console.error(`Test FAILED for ${p.id} test #${tIdx} (${testCase.label})`);
          console.error(`Input:`, JSON.stringify(testCase.input));
          console.error(`Expected:`, JSON.stringify(testCase.expected));
          console.error(`Actual:`, JSON.stringify(actual));
          process.exit(1);
        }
      }
    }
    console.log(`  ✓ All ${group.problems.length} problems in ${group.name} passed schema validation & test execution!`);
  }

  console.log(`\nAll ${totalProblems} problems validated and passed! Now updating JSON files...\n`);

  for (const group of allNewGroups) {
    const fullPath = path.resolve(__dirname, '..', group.file);
    let existing = [];
    if (fs.existsSync(fullPath)) {
      existing = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    }

    let updated = [];
    if (group.append) {
      // Remove any previously added with the same id just in case
      const newIds = new Set(group.problems.map((p) => p.id));
      const filtered = existing.filter((p) => !newIds.has(p.id));
      updated = [...filtered, ...group.problems];
    } else {
      updated = group.problems;
    }

    fs.writeFileSync(fullPath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
    console.log(`Updated ${group.file} (Total problems now: ${updated.length})`);
  }

  console.log('\nSUCCESS! All problems written successfully.');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
