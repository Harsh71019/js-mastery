import type { Problem } from '@/types/problem'

export const twoPointerProblems: readonly Problem[] = [
  {
    id: 'two-pointer-1',
    title: 'Two Sum (Sorted)',
    category: 'two-pointer',
    difficulty: 'Easy',
    functionName: 'twoSumSorted',
    description:
      'Given a sorted array of numbers and a target, return the indices [i, j] of the two numbers that add up to the target. Exactly one solution exists.',
    whatShouldHappen: [
      'Place a left pointer at index 0 and a right pointer at the last index.',
      'While left < right, check the sum of the two pointed elements.',
      'If the sum equals the target, return [left, right].',
      'If the sum is too small, move the left pointer right. If too large, move the right pointer left.',
    ],
    starterCode: `function twoSumSorted(nums, target) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 3, 5, 7, 9], target = 10',
      columns: ['left', 'right', 'sum', 'action'],
      rows: [
        { left: 0, right: 4, sum: 10, action: 'return [0, 4]' },
      ],
    },
    skeletonHint: `function twoSumSorted(nums, target) {
  let left = 0;
  let right = ____;
  while (left < right) {
    const sum = nums[____] + nums[____];
    if (sum === target) return [left, right];
    if (sum < target) ____++;
    else ____--;
  }
  return [];
}`,
    solution: `function twoSumSorted(nums, target) {
  // left starts at the smallest value
  let left = 0;
  // right starts at the largest value
  let right = nums.length - 1;
  // converge the pointers until they meet
  while (left < right) {
    // compute the sum of the two pointed values
    const sum = nums[left] + nums[right];
    // exact match — return the indices
    if (sum === target) return [left, right];
    // sum too small: moving left pointer right increases the sum
    if (sum < target) left++;
    // sum too large: moving right pointer left decreases the sum
    else right--;
  }
  // guaranteed one solution exists so this line is never reached
  return [];
}`,
    tests: [
      { input: [[1, 3, 5, 7, 9], 10], expected: [0, 4], label: 'ends pair' },
      { input: [[2, 4, 6, 8], 10], expected: [1, 3], label: 'middle pair' },
      { input: [[1, 2], 3], expected: [0, 1], label: 'two-element array' },
      { input: [[1, 2, 3, 4, 5], 9], expected: [3, 4], label: 'last two elements' },
    ],
    patternTag: 'Two Pointer (Converging)',
    patternExplanation:
      'Start pointers at opposite ends and move them toward each other based on whether the current sum is too small or too large — exploits sorted order to avoid O(n²) brute force.',
    estimatedMinutes: 10,
  },
  {
    id: 'two-pointer-2',
    title: 'Remove Duplicates In-Place',
    category: 'two-pointer',
    difficulty: 'Easy',
    functionName: 'removeDuplicates',
    description:
      'Given a sorted array, remove duplicates in-place so each value appears only once. Return the count of unique elements. The first k elements of the array should hold the unique values.',
    whatShouldHappen: [
      'Use a slow pointer to track where the next unique value should go.',
      'Use a fast pointer to scan every element.',
      'When the fast pointer finds a value different from the slow pointer\'s value, advance the slow pointer and write the new value there.',
      'Return the slow pointer + 1 as the count of unique elements.',
    ],
    starterCode: `function removeDuplicates(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [1, 1, 2, 3, 3]',
      columns: ['slow', 'fast', 'nums[fast]', 'action'],
      rows: [
        { slow: 0, fast: 1, 'nums[fast]': 1, action: 'duplicate, skip' },
        { slow: 0, fast: 2, 'nums[fast]': 2, action: 'unique: slow→1, write 2' },
        { slow: 1, fast: 3, 'nums[fast]': 3, action: 'unique: slow→2, write 3' },
        { slow: 2, fast: 4, 'nums[fast]': 3, action: 'duplicate, skip' },
      ],
    },
    skeletonHint: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = ____; fast < nums.length; fast++) {
    if (nums[fast] !== nums[____]) {
      slow++;
      nums[slow] = ____;
    }
  }
  return slow + 1;
}`,
    solution: `function removeDuplicates(nums) {
  // edge case: nothing to process
  if (nums.length === 0) return 0;
  // slow marks the last confirmed unique position
  let slow = 0;
  // fast scans every element starting from the second
  for (let fast = 1; fast < nums.length; fast++) {
    // a value different from nums[slow] is a new unique element
    if (nums[fast] !== nums[slow]) {
      // advance slow to the next write position
      slow++;
      // overwrite with the newly found unique value
      nums[slow] = nums[fast];
    }
  }
  // slow is 0-indexed, so add 1 for the count
  return slow + 1;
}`,
    tests: [
      { input: [[1, 1, 2, 3, 3]], expected: 3, label: 'normal input' },
      { input: [[1, 1, 1]], expected: 1, label: 'all duplicates' },
      { input: [[1, 2, 3]], expected: 3, label: 'no duplicates' },
      { input: [[]], expected: 0, label: 'empty array' },
    ],
    patternTag: 'Two Pointer (Slow-Fast)',
    patternExplanation:
      'A slow pointer marks where to write; a fast pointer reads ahead. When fast finds something new, slow advances and the value is written there — modifies the array in O(1) extra space.',
    estimatedMinutes: 12,
  },
]
