import type { Problem } from '@/types/problem'

export const prefixSuffixProblems: readonly Problem[] = [
  {
    id: 'prefix-suffix-1',
    title: 'Running Total (Prefix Sum)',
    category: 'prefix-suffix',
    difficulty: 'Easy',
    functionName: 'prefixSum',
    description:
      'Given an array of numbers, return a new array where each element is the sum of all elements up to and including that index.',
    whatShouldHappen: [
      'Create a result array with the same length.',
      'Set result[0] to nums[0].',
      'For every subsequent index, set result[i] = result[i-1] + nums[i].',
      'Return the result array.',
    ],
    starterCode: `function prefixSum(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4]',
      columns: ['i', 'nums[i]', 'prefix[i]'],
      rows: [
        { i: 0, 'nums[i]': 1, 'prefix[i]': 1 },
        { i: 1, 'nums[i]': 2, 'prefix[i]': 3 },
        { i: 2, 'nums[i]': 3, 'prefix[i]': 6 },
        { i: 3, 'nums[i]': 4, 'prefix[i]': 10 },
      ],
    },
    skeletonHint: `function prefixSum(nums) {
  const prefix = new Array(nums.length);
  prefix[0] = ____;
  for (let i = 1; i < ____; i++) {
    prefix[i] = prefix[____] + nums[____];
  }
  return prefix;
}`,
    solution: `function prefixSum(nums) {
  // allocate result array of the same length
  const prefix = new Array(nums.length);
  // first element has no previous element to add
  prefix[0] = nums[0];
  // each subsequent element adds the current value to the running total
  for (let i = 1; i < nums.length; i++) {
    // previous prefix plus current element
    prefix[i] = prefix[i - 1] + nums[i];
  }
  // return the array of running totals
  return prefix;
}`,
    tests: [
      { input: [[1, 2, 3, 4]], expected: [1, 3, 6, 10], label: 'normal input' },
      { input: [[5]], expected: [5], label: 'single element' },
      { input: [[1, 1, 1, 1]], expected: [1, 2, 3, 4], label: 'all ones' },
      { input: [[-1, 2, -3, 4]], expected: [-1, 1, -2, 2], label: 'mixed signs' },
    ],
    patternTag: 'Prefix Sum',
    patternExplanation:
      'A prefix sum array stores cumulative totals so any range sum query [i..j] can be answered in O(1) as prefix[j] - prefix[i-1] — trading one O(n) build pass for fast queries.',
    estimatedMinutes: 8,
  },
  {
    id: 'prefix-suffix-2',
    title: 'Product Except Self',
    category: 'prefix-suffix',
    difficulty: 'Medium',
    functionName: 'productExceptSelf',
    description:
      'Given an array of numbers, return an array where each element is the product of all elements except the one at that index. Do not use division.',
    whatShouldHappen: [
      'Build a prefix products array where prefix[i] = product of all elements before index i.',
      'Build a suffix products array where suffix[i] = product of all elements after index i.',
      'For each index i, the answer is prefix[i] * suffix[i].',
      'Return the result array.',
    ],
    starterCode: `function productExceptSelf(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 2, 3, 4]',
      columns: ['i', 'prefix[i]', 'suffix[i]', 'result[i]'],
      rows: [
        { i: 0, 'prefix[i]': 1, 'suffix[i]': 24, 'result[i]': 24 },
        { i: 1, 'prefix[i]': 1, 'suffix[i]': 12, 'result[i]': 12 },
        { i: 2, 'prefix[i]': 2, 'suffix[i]': 4, 'result[i]': 8 },
        { i: 3, 'prefix[i]': 6, 'suffix[i]': 1, 'result[i]': 6 },
      ],
    },
    skeletonHint: `function productExceptSelf(nums) {
  const n = nums.length;
  const prefix = new Array(n).fill(1);
  const suffix = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[____];
  }
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[____];
  }
  return nums.map((_, i) => prefix[i] * suffix[i]);
}`,
    solution: `function productExceptSelf(nums) {
  const n = nums.length;
  // prefix[i] = product of all elements strictly to the left of i
  const prefix = new Array(n).fill(1);
  // suffix[i] = product of all elements strictly to the right of i
  const suffix = new Array(n).fill(1);
  // forward pass: accumulate products from the left
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
  }
  // backward pass: accumulate products from the right
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
  }
  // combine: left product * right product = product of all except self
  return nums.map((_, i) => prefix[i] * suffix[i]);
}`,
    tests: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], label: 'normal input' },
      { input: [[1, 1, 1, 1]], expected: [1, 1, 1, 1], label: 'all ones' },
      { input: [[0, 1, 2]], expected: [2, 0, 0], label: 'contains zero' },
      { input: [[2, 3]], expected: [3, 2], label: 'two elements' },
    ],
    patternTag: 'Prefix × Suffix Product',
    patternExplanation:
      'Two passes — one left-to-right, one right-to-left — build prefix and suffix product arrays. Their product at each index gives the answer without division, in O(n) time.',
    estimatedMinutes: 15,
  },
]
