const fs = require('fs');
const path = require('path');

// Helper to update a JSON file
function appendProblems(filePath, newProblems) {
  const fullPath = path.resolve(__dirname, filePath);
  const current = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const existingIds = new Set(current.map(x => x.id));

  let added = 0;
  for (const prob of newProblems) {
    if (!existingIds.has(prob.id)) {
      current.push(prob);
      existingIds.add(prob.id);
      added++;
    }
  }

  fs.writeFileSync(fullPath, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log(`[${path.basename(filePath)}] Added ${added} problems. Total: ${current.length}`);
}

// 1. Two-pointer problems
const twoPointerProblems = [
  {
    id: 'two-pointer-trapping-rain-water',
    title: 'Trapping Rain Water',
    category: 'two-pointer',
    difficulty: 'Hard',
    functionName: 'trapRainWater',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    whatShouldHappen: [
      'Initialize left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0.',
      'While left < right, compare height[left] with height[right].',
      'If height[left] < height[right], update leftMax. If height[left] < leftMax, add leftMax - height[left] to water; then advance left++.',
      'Otherwise, update rightMax. If height[right] < rightMax, add rightMax - height[right] to water; then decrement right--.',
      'Return total trapped water.'
    ],
    starterCode: `function trapRainWater(height) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
      columns: ['left', 'right', 'leftMax', 'rightMax', 'trappedWater'],
      rows: [
        { left: 0, right: 11, leftMax: 0, rightMax: 1, trappedWater: 0 },
        { left: 2, right: 10, leftMax: 1, rightMax: 2, trappedWater: 1 },
        { left: 5, right: 7, leftMax: 2, rightMax: 3, trappedWater: 5 },
        { left: 7, right: 7, leftMax: 3, rightMax: 3, trappedWater: 6 }
      ]
    },
    skeletonHint: `function trapRainWater(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
    solution: `function trapRainWater(height) {
  if (!height || height.length <= 2) return 0;
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}`,
    tests: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, label: 'Standard elevation map' },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, label: 'Deep valley' },
      { input: [[1, 2, 3, 4, 5]], expected: 0, label: 'Strictly ascending (no trapped water)' },
      { input: [[3, 0, 2, 0, 4]], expected: 7, label: 'Multiple internal basins' },
      { input: [[]], expected: 0, label: 'Empty array' }
    ],
    patternTag: 'Two Pointers (Inward Squeeze)',
    patternExplanation: 'Using two pointers moving inward from both ends allows computing water trapped based on the smaller bounded boundary in O(n) time and O(1) space.',
    estimatedMinutes: 20,
    status: 'published'
  },
  {
    id: 'two-pointer-sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    category: 'two-pointer',
    difficulty: 'Medium',
    functionName: 'sortColors',
    description: 'Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, in order 0, 1, and 2.',
    whatShouldHappen: [
      'Use three pointers: low = 0 (boundary for 0s), mid = 0 (current element), high = nums.length - 1 (boundary for 2s).',
      'While mid <= high, check nums[mid].',
      'If nums[mid] === 0, swap nums[low] and nums[mid], increment low++ and mid++.',
      'If nums[mid] === 1, just increment mid++.',
      'If nums[mid] === 2, swap nums[mid] and nums[high], decrement high-- (do not advance mid yet).',
      'Return the sorted array nums in-place.'
    ],
    starterCode: `function sortColors(nums) {
  // your in-place sort here
  return nums;
}`,
    traceTable: {
      inputLabel: 'nums = [2, 0, 2, 1, 1, 0]',
      columns: ['low', 'mid', 'high', 'nums', 'action'],
      rows: [
        { low: 0, mid: 0, high: 5, nums: '[2,0,2,1,1,0]', action: 'swap(mid, high), high--' },
        { low: 0, mid: 0, high: 4, nums: '[0,0,2,1,1,2]', action: 'swap(low, mid), low++, mid++' },
        { low: 1, mid: 1, high: 4, nums: '[0,0,2,1,1,2]', action: 'swap(low, mid), low++, mid++' },
        { low: 2, mid: 2, high: 4, nums: '[0,0,2,1,1,2]', action: 'swap(mid, high), high--' },
        { low: 2, mid: 2, high: 3, nums: '[0,0,1,1,2,2]', action: 'mid++' }
      ]
    },
    skeletonHint: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`,
    solution: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      const temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      const temp = nums[mid];
      nums[mid] = nums[high];
      nums[high] = temp;
      high--;
    }
  }
  return nums;
}`,
    tests: [
      { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], label: 'Mixed 0, 1, 2' },
      { input: [[2, 0, 1]], expected: [0, 1, 2], label: 'Simple three items' },
      { input: [[0]], expected: [0], label: 'Single element' },
      { input: [[1, 1, 1]], expected: [1, 1, 1], label: 'All identical elements' },
      { input: [[2, 2, 0, 0, 1]], expected: [0, 0, 1, 2, 2], label: 'Multiple zeros and twos' }
    ],
    patternTag: 'Three Pointers (Dutch National Flag)',
    patternExplanation: 'Dijkstra Dutch National Flag algorithm partitions an array into three segments in a single pass O(n) and O(1) space.',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'two-pointer-3sum-closest',
    title: '3Sum Closest',
    category: 'two-pointer',
    difficulty: 'Medium',
    functionName: 'threeSumClosest',
    description: 'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers.',
    whatShouldHappen: [
      'Sort nums in ascending order.',
      'Initialize closestSum to nums[0] + nums[1] + nums[2].',
      'Iterate i from 0 to nums.length - 3.',
      'For each i, set left = i + 1, right = nums.length - 1.',
      'Compute sum = nums[i] + nums[left] + nums[right].',
      'If Math.abs(target - sum) < Math.abs(target - closestSum), update closestSum = sum.',
      'If sum < target, advance left++; if sum > target, decrement right--; if sum === target, return sum directly.'
    ],
    starterCode: `function threeSumClosest(nums, target) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [-1, 2, 1, -4], target = 1',
      columns: ['i', 'left', 'right', 'currentSum', 'closestSum'],
      rows: [
        { i: 0, left: 1, right: 3, currentSum: -3, closestSum: -3 },
        { i: 0, left: 2, right: 3, currentSum: 2, closestSum: 2 },
        { i: 1, left: 2, right: 3, currentSum: -1, closestSum: 2 }
      ]
    },
    skeletonHint: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(target - sum) < Math.abs(target - closest)) closest = sum;
      if (sum < target) left++;
      else if (sum > target) right--;
      else return sum;
    }
  }
  return closest;
}`,
    solution: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closestSum = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const currentSum = nums[i] + nums[left] + nums[right];
      if (Math.abs(target - currentSum) < Math.abs(target - closestSum)) {
        closestSum = currentSum;
      }
      if (currentSum < target) {
        left++;
      } else if (currentSum > target) {
        right--;
      } else {
        return currentSum;
      }
    }
  }
  return closestSum;
}`,
    tests: [
      { input: [[-1, 2, 1, -4], 1], expected: 2, label: 'Closest sum is 2 (-1 + 2 + 1)' },
      { input: [[0, 0, 0], 1], expected: 0, label: 'All zeros target 1' },
      { input: [[1, 1, 1, 0], -100], expected: 2, label: 'Far negative target' },
      { input: [[1, 2, 4, 8, 16], 15], expected: 14, label: 'Target 15 (2+4+8 = 14)' }
    ],
    patternTag: 'Sorted Two Pointers',
    patternExplanation: 'Sorting the array enables directional two-pointer traversal inside an outer loop, reducing an O(n^3) search to O(n^2).',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'two-pointer-backspace-string-compare',
    title: 'Backspace String Compare',
    category: 'two-pointer',
    difficulty: 'Easy',
    functionName: 'backspaceCompare',
    description: 'Given two strings s and t, return true if they are equal when both are typed into empty text editors. "#" means a backspace character. Resolve in O(1) space.',
    whatShouldHappen: [
      'Iterate backwards through both strings using two pointers i = s.length - 1, j = t.length - 1.',
      'Maintain skip count for each string when "#" is encountered.',
      'Skip deleted characters until reaching valid characters to compare.',
      'If both valid characters match, decrement both pointers and continue.',
      'If one string has a valid character and the other does not, return false.',
      'Return true if both pointers successfully process all characters.'
    ],
    starterCode: `function backspaceCompare(s, t) {
  // your code here
}`,
    traceTable: {
      inputLabel: 's = "ab#c", t = "ad#c"',
      columns: ['i', 'j', 'charS', 'charT', 'match'],
      rows: [
        { i: 3, j: 3, charS: 'c', charT: 'c', match: 'true' },
        { i: 0, j: 0, charS: 'a', charT: 'a', match: 'true' }
      ]
    },
    skeletonHint: `function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  let skipS = 0, skipT = 0;
  while (i >= 0 || j >= 0) {
    while (i >= 0) {
      if (s[i] === '#') { skipS++; i--; }
      else if (skipS > 0) { skipS--; i--; }
      else break;
    }
    while (j >= 0) {
      if (t[j] === '#') { skipT++; j--; }
      else if (skipT > 0) { skipT--; j--; }
      else break;
    }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--; j--;
  }
  return true;
}`,
    solution: `function backspaceCompare(s, t) {
  let i = s.length - 1;
  let j = t.length - 1;
  let skipS = 0;
  let skipT = 0;

  while (i >= 0 || j >= 0) {
    while (i >= 0) {
      if (s[i] === '#') {
        skipS++;
        i--;
      } else if (skipS > 0) {
        skipS--;
        i--;
      } else {
        break;
      }
    }
    while (j >= 0) {
      if (t[j] === '#') {
        skipT++;
        j--;
      } else if (skipT > 0) {
        skipT--;
        j--;
      } else {
        break;
      }
    }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) {
      return false;
    }
    if ((i >= 0) !== (j >= 0)) {
      return false;
    }
    i--;
    j--;
  }
  return true;
}`,
    tests: [
      { input: ['ab#c', 'ad#c'], expected: true, label: 'Both resolve to "ac"' },
      { input: ['ab##', 'c#d#'], expected: true, label: 'Both resolve to empty string ""' },
      { input: ['a#c', 'b'], expected: false, label: '"c" vs "b"' },
      { input: ['bxj##tw', 'bxj###tw'], expected: false, label: 'Extra backspaces' },
      { input: ['xywrrmp', 'xywrrmu#p'], expected: true, label: 'Mid-string backspace equality' }
    ],
    patternTag: 'Reverse Two Pointers',
    patternExplanation: 'Iterating backward from string ends handles backspaces naturally in O(1) auxiliary space without building stack strings.',
    estimatedMinutes: 12,
    status: 'published'
  }
];

// 2. Sliding window problems
const slidingWindowProblems = [
  {
    id: 'sliding-window-min-window-substring',
    title: 'Minimum Window Substring',
    category: 'sliding-window',
    difficulty: 'Hard',
    functionName: 'minWindow',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such substring exists, return empty string "".',
    whatShouldHappen: [
      'Build a frequency map of characters in target t.',
      'Use right pointer to expand window until all characters of t are satisfied (formedCount === requiredCount).',
      'While valid, shrink window from left to minimize length, updating minimum window bounds.',
      'Return the minimum substring, or "" if no valid window was found.'
    ],
    starterCode: `function minWindow(s, t) {
  // your code here
}`,
    traceTable: {
      inputLabel: 's = "ADOBECODEBANC", t = "ABC"',
      columns: ['left', 'right', 'char', 'formed', 'minLen', 'minSub'],
      rows: [
        { left: 0, right: 5, char: 'C', formed: 3, minLen: 6, minSub: 'ADOBEC' },
        { left: 5, right: 10, char: 'A', formed: 3, minLen: 6, minSub: 'ADOBEC' },
        { left: 9, right: 12, char: 'C', formed: 3, minLen: 4, minSub: 'BANC' }
      ]
    },
    skeletonHint: `function minWindow(s, t) {
  if (!s || !t) return '';
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let required = Object.keys(need).length;
  let left = 0, formed = 0;
  const window = {};
  let minLen = Infinity, minStart = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    if (need[c] && window[c] === need[c]) formed++;
    while (left <= right && formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const leftChar = s[left];
      window[leftChar]--;
      if (need[leftChar] && window[leftChar] < need[leftChar]) formed--;
      left++;
    }
  }
  return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen);
}`,
    solution: `function minWindow(s, t) {
  if (!s || !t || s.length < t.length) return '';

  const need = {};
  for (let i = 0; i < t.length; i++) {
    const char = t[i];
    need[char] = (need[char] || 0) + 1;
  }

  const required = Object.keys(need).length;
  let left = 0;
  let formed = 0;
  const window = {};
  let minLen = Infinity;
  let minStart = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    window[char] = (window[char] || 0) + 1;

    if (need[char] && window[char] === need[char]) {
      formed++;
    }

    while (left <= right && formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }

      const leftChar = s[left];
      window[leftChar]--;
      if (need[leftChar] && window[leftChar] < need[leftChar]) {
        formed--;
      }
      left++;
    }
  }

  return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen);
}`,
    tests: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC', label: 'Classic minimum window' },
      { input: ['a', 'a'], expected: 'a', label: 'Single character match' },
      { input: ['a', 'aa'], expected: '', label: 'Not enough characters' },
      { input: ['ab', 'b'], expected: 'b', label: 'End of string match' },
      { input: ['cabwefgewcwaefgcf', 'cae'], expected: 'cwae', label: 'Multiple occurrences with duplicates' }
    ],
    patternTag: 'Variable Size Sliding Window (Expansion & Contraction)',
    patternExplanation: 'Expand right pointer until condition is met, then contract left pointer while preserving valid condition to find minimum window in O(m + n).',
    estimatedMinutes: 25,
    status: 'published'
  },
  {
    id: 'sliding-window-longest-k-distinct',
    title: 'Longest Substring with At Most K Distinct Characters',
    category: 'sliding-window',
    difficulty: 'Medium',
    functionName: 'lengthOfLongestSubstringKDistinct',
    description: 'Given a string s and an integer k, return the length of the longest substring of s that contains at most k distinct characters.',
    whatShouldHappen: [
      'Maintain a Map of character frequencies in the current sliding window.',
      'Expand right pointer through string, updating frequencies.',
      'When distinct character count (map.size) exceeds k, advance left pointer and decrement counts until map.size <= k.',
      'Track maximum window length right - left + 1 and return it.'
    ],
    starterCode: `function lengthOfLongestSubstringKDistinct(s, k) {
  // your code here
}`,
    traceTable: {
      inputLabel: 's = "eceba", k = 2',
      columns: ['left', 'right', 'char', 'distinct', 'maxLen'],
      rows: [
        { left: 0, right: 0, char: 'e', distinct: 1, maxLen: 1 },
        { left: 0, right: 1, char: 'c', distinct: 2, maxLen: 2 },
        { left: 0, right: 2, char: 'e', distinct: 2, maxLen: 3 },
        { left: 2, right: 3, char: 'b', distinct: 2, maxLen: 3 }
      ]
    },
    skeletonHint: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0 || !s) return 0;
  const map = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    map.set(c, (map.get(c) || 0) + 1);
    while (map.size > k) {
      const lc = s[left];
      map.set(lc, map.get(lc) - 1);
      if (map.get(lc) === 0) map.delete(lc);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solution: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0 || !s || s.length === 0) return 0;
  const counts = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    counts.set(char, (counts.get(char) || 0) + 1);

    while (counts.size > k) {
      const leftChar = s[left];
      const count = counts.get(leftChar) - 1;
      if (count === 0) {
        counts.delete(leftChar);
      } else {
        counts.set(leftChar, count);
      }
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
    tests: [
      { input: ['eceba', 2], expected: 3, label: '"ece" has length 3' },
      { input: ['aa', 1], expected: 2, label: 'All identical' },
      { input: ['a', 0], expected: 0, label: 'k = 0 returns 0' },
      { input: ['abaccc', 2], expected: 4, label: '"accc" has length 4' },
      { input: ['abcdef', 3], expected: 3, label: 'Distinct characters' }
    ],
    patternTag: 'Variable Size Sliding Window',
    patternExplanation: 'A sliding window with a frequency hash map tracks distinct keys in O(n) time, shrinking when distinct count exceeds k.',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'sliding-window-permutation-in-string',
    title: 'Permutation in String',
    category: 'sliding-window',
    difficulty: 'Medium',
    functionName: 'checkInclusion',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1 permutations is the substring of s2.',
    whatShouldHappen: [
      'If s1.length > s2.length, return false.',
      'Build character frequency array for s1 and initial window of length s1.length in s2.',
      'Slide the fixed-size window of length s1.length one character at a time across s2.',
      'Compare character frequencies; return true if they match at any window position.',
      'Return false if window reaches end of s2 without a match.'
    ],
    starterCode: `function checkInclusion(s1, s2) {
  // your code here
}`,
    traceTable: {
      inputLabel: 's1 = "ab", s2 = "eidbaooo"',
      columns: ['windowStart', 'windowEnd', 'subString', 'matches'],
      rows: [
        { windowStart: 0, windowEnd: 1, subString: 'ei', matches: 'false' },
        { windowStart: 1, windowEnd: 2, subString: 'id', matches: 'false' },
        { windowStart: 2, windowEnd: 3, subString: 'db', matches: 'false' },
        { windowStart: 3, windowEnd: 4, subString: 'ba', matches: 'true' }
      ]
    },
    skeletonHint: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const count1 = Array(26).fill(0);
  const count2 = Array(26).fill(0);
  const aCode = 'a'.charCodeAt(0);
  for (let i = 0; i < s1.length; i++) {
    count1[s1.charCodeAt(i) - aCode]++;
    count2[s2.charCodeAt(i) - aCode]++;
  }
  // slide window
  for (let i = 0; i < s2.length - s1.length; i++) {
    if (count1.every((val, idx) => val === count2[idx])) return true;
    count2[s2.charCodeAt(i + s1.length) - aCode]++;
    count2[s2.charCodeAt(i) - aCode]--;
  }
  return count1.every((val, idx) => val === count2[idx]);
}`,
    solution: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;

  const count1 = new Array(26).fill(0);
  const count2 = new Array(26).fill(0);
  const aCode = 97;

  for (let i = 0; i < s1.length; i++) {
    count1[s1.charCodeAt(i) - aCode]++;
    count2[s2.charCodeAt(i) - aCode]++;
  }

  const matches = (c1, c2) => {
    for (let i = 0; i < 26; i++) {
      if (c1[i] !== c2[i]) return false;
    }
    return true;
  };

  for (let i = 0; i < s2.length - s1.length; i++) {
    if (matches(count1, count2)) return true;
    count2[s2.charCodeAt(i + s1.length) - aCode]++;
    count2[s2.charCodeAt(i) - aCode]--;
  }

  return matches(count1, count2);
}`,
    tests: [
      { input: ['ab', 'eidbaooo'], expected: true, label: 'Contains "ba"' },
      { input: ['ab', 'eidboaoo'], expected: false, label: 'Characters separated' },
      { input: ['adc', 'dcda'], expected: true, label: 'Permutation "cda"' },
      { input: ['hello', 'ooolleoooleh'], expected: false, label: 'Scattered characters' },
      { input: ['a', 'a'], expected: true, label: 'Single character match' }
    ],
    patternTag: 'Fixed Size Sliding Window',
    patternExplanation: 'A fixed-size window of size s1.length moves across s2, updating character frequencies in O(1) per step.',
    estimatedMinutes: 15,
    status: 'published'
  }
];

// 3. Prefix-suffix problems
const prefixSuffixProblems = [
  {
    id: 'prefix-suffix-contiguous-array',
    title: 'Contiguous Array (Equal 0s and 1s)',
    category: 'prefix-suffix',
    difficulty: 'Medium',
    functionName: 'findMaxLength',
    description: 'Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.',
    whatShouldHappen: [
      'Transform the problem: treat 0 as -1 and 1 as +1.',
      'Now the problem becomes finding the longest subarray with sum equal to 0.',
      'Use a Map to store the earliest index where each running sum occurred, initialized with sum 0 at index -1.',
      'Iterate through nums, updating running sum.',
      'If running sum was seen before, compute current_index - previous_index and update maxLength.',
      'Otherwise, record the earliest index of this running sum in the map.'
    ],
    starterCode: `function findMaxLength(nums) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [0, 1, 0, 1]',
      columns: ['index', 'num', 'runningSum', 'earliestSeen', 'maxLen'],
      rows: [
        { index: 0, num: 0, runningSum: -1, earliestSeen: 'index 0', maxLen: 0 },
        { index: 1, num: 1, runningSum: 0, earliestSeen: 'index -1', maxLen: 2 },
        { index: 2, num: 0, runningSum: -1, earliestSeen: 'index 0', maxLen: 2 },
        { index: 3, num: 1, runningSum: 0, earliestSeen: 'index -1', maxLen: 4 }
      ]
    },
    skeletonHint: `function findMaxLength(nums) {
  const map = new Map();
  map.set(0, -1);
  let maxLen = 0, sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i] === 0 ? -1 : 1;
    if (map.has(sum)) {
      maxLen = Math.max(maxLen, i - map.get(sum));
    } else {
      map.set(sum, i);
    }
  }
  return maxLen;
}`,
    solution: `function findMaxLength(nums) {
  const map = new Map();
  map.set(0, -1);
  let maxLen = 0;
  let runningSum = 0;

  for (let i = 0; i < nums.length; i++) {
    runningSum += nums[i] === 0 ? -1 : 1;
    if (map.has(runningSum)) {
      maxLen = Math.max(maxLen, i - map.get(runningSum));
    } else {
      map.set(runningSum, i);
    }
  }

  return maxLen;
}`,
    tests: [
      { input: [[0, 1]], expected: 2, label: 'Simple pair' },
      { input: [[0, 1, 0]], expected: 2, label: 'Three elements' },
      { input: [[0, 0, 1, 0, 0, 0, 1, 1]], expected: 6, label: 'Longer mixed subarray' },
      { input: [[0, 0, 0]], expected: 0, label: 'No ones' },
      { input: [[1, 1, 1]], expected: 0, label: 'No zeros' }
    ],
    patternTag: 'Prefix Sum + Hash Map',
    patternExplanation: 'By treating 0 as -1, equal count of 0s and 1s becomes a sub-array sum of 0, solvable with prefix sum index tracking in O(n).',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'prefix-suffix-continuous-subarray-sum',
    title: 'Continuous Subarray Sum',
    category: 'prefix-suffix',
    difficulty: 'Medium',
    functionName: 'checkSubarraySum',
    description: 'Given an integer array nums and an integer k, return true if nums has a good subarray: a continuous subarray of length at least two whose elements sum up to a multiple of k.',
    whatShouldHappen: [
      'Maintain running sum modulo k: runningSum = (runningSum + nums[i]) % k.',
      'If two prefix sums have the same remainder when divided by k, the subarray between them is divisible by k.',
      'Use a Map to store remainder -> earliest index seen, initialized with remainder 0 at index -1.',
      'If remainder seen before and current_index - earliest_index >= 2, return true.',
      'If remainder not in map, store remainder -> current_index.'
    ],
    starterCode: `function checkSubarraySum(nums, k) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [23, 2, 4, 6, 7], k = 6',
      columns: ['i', 'num', 'prefixMod', 'earliestIndex', 'validSubarray'],
      rows: [
        { i: 0, num: 23, prefixMod: 5, earliestIndex: 0, validSubarray: 'false' },
        { i: 1, num: 2, prefixMod: 1, earliestIndex: 1, validSubarray: 'false' },
        { i: 2, num: 4, prefixMod: 5, earliestIndex: 0, validSubarray: 'true (2 - 0 >= 2)' }
      ]
    },
    skeletonHint: `function checkSubarraySum(nums, k) {
  const map = new Map();
  map.set(0, -1);
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;
    if (map.has(rem)) {
      if (i - map.get(rem) >= 2) return true;
    } else {
      map.set(rem, i);
    }
  }
  return false;
}`,
    solution: `function checkSubarraySum(nums, k) {
  const map = new Map();
  map.set(0, -1);
  let remainder = 0;

  for (let i = 0; i < nums.length; i++) {
    remainder = (remainder + nums[i]) % k;
    if (map.has(remainder)) {
      if (i - map.get(remainder) >= 2) {
        return true;
      }
    } else {
      map.set(remainder, i);
    }
  }

  return false;
}`,
    tests: [
      { input: [[23, 2, 4, 6, 7], 6], expected: true, label: '[2, 4] sums to 6' },
      { input: [[23, 2, 6, 4, 7], 6], expected: true, label: '[23, 2, 6, 4, 7] sums to 42' },
      { input: [[23, 2, 6, 4, 7], 13], expected: false, label: 'No subarray divisible by 13' },
      { input: [[0, 0], 1], expected: true, label: 'Zeros subarray length 2' },
      { input: [[5, 0, 0, 0], 3], expected: true, label: 'Multiple zeros' }
    ],
    patternTag: 'Prefix Sum Modulo Arithmetic',
    patternExplanation: 'If prefixSum[j] % k === prefixSum[i] % k, then sum(nums[i+1..j]) is a multiple of k.',
    estimatedMinutes: 15,
    status: 'published'
  }
];

// 4. Heaps problems
const heapProblems = [
  {
    id: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    category: 'heaps',
    difficulty: 'Medium',
    functionName: 'findKthLargest',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array without full sorting.',
    whatShouldHappen: [
      'Maintain a min-heap of size k, or use QuickSelect algorithm.',
      'With min-heap: push elements into heap; if heap.size > k, pop minimum.',
      'After processing all elements, the top of the min-heap is the kth largest element.',
      'Return the kth largest value.'
    ],
    starterCode: `function findKthLargest(nums, k) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
      columns: ['num', 'minHeapSize', 'minHeapTop'],
      rows: [
        { num: 3, minHeapSize: 1, minHeapTop: 3 },
        { num: 5, minHeapSize: 2, minHeapTop: 3 },
        { num: 6, minHeapSize: 2, minHeapTop: 5 },
        { num: 4, minHeapSize: 2, minHeapTop: 5 }
      ]
    },
    skeletonHint: `function findKthLargest(nums, k) {
  // Can implement quickselect or binary heap
  // Quickselect:
  const target = nums.length - k;
  function quickSelect(left, right) {
    const pivot = nums[right];
    let p = left;
    for (let i = left; i < right; i++) {
      if (nums[i] <= pivot) {
        [nums[p], nums[i]] = [nums[i], nums[p]];
        p++;
      }
    }
    [nums[p], nums[right]] = [nums[right], nums[p]];
    if (p === target) return nums[p];
    if (p < target) return quickSelect(p + 1, right);
    return quickSelect(left, p - 1);
  }
  return quickSelect(0, nums.length - 1);
}`,
    solution: `function findKthLargest(nums, k) {
  const target = nums.length - k;

  function quickSelect(left, right) {
    const pivot = nums[right];
    let p = left;

    for (let i = left; i < right; i++) {
      if (nums[i] <= pivot) {
        const temp = nums[p];
        nums[p] = nums[i];
        nums[i] = temp;
        p++;
      }
    }
    const temp = nums[p];
    nums[p] = nums[right];
    nums[right] = temp;

    if (p === target) return nums[p];
    if (p < target) return quickSelect(p + 1, right);
    return quickSelect(left, p - 1);
  }

  return quickSelect(0, nums.length - 1);
}`,
    tests: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5, label: '2nd largest is 5' },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, label: 'Duplicates handled' },
      { input: [[1], 1], expected: 1, label: 'Single element' },
      { input: [[7, 6, 5, 4, 3, 2, 1], 5], expected: 3, label: '5th largest is 3' },
      { input: [[-1, -1], 2], expected: -1, label: 'Negative duplicates' }
    ],
    patternTag: 'Min-Heap / QuickSelect',
    patternExplanation: 'Using QuickSelect finds the kth element in average O(n) time and O(1) space, avoiding a full O(n log n) sort.',
    estimatedMinutes: 20,
    status: 'published'
  },
  {
    id: 'top-k-frequent-words',
    title: 'Top K Frequent Words',
    category: 'heaps',
    difficulty: 'Medium',
    functionName: 'topKFrequentWords',
    description: 'Given an array of strings words and an integer k, return the k most frequent strings. Sort words with the same frequency by their lexicographical order.',
    whatShouldHappen: [
      'Build a frequency map of each word in the array.',
      'Sort unique words: primarily descending by frequency, and secondarily ascending by lexicographical order (localeCompare).',
      'Slice the first k words from the sorted array.',
      'Return the array of top k words.'
    ],
    starterCode: `function topKFrequentWords(words, k) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
      columns: ['word', 'frequency', 'lexicographicalRank'],
      rows: [
        { word: 'i', frequency: 2, lexicographicalRank: 1 },
        { word: 'love', frequency: 2, lexicographicalRank: 2 },
        { word: 'coding', frequency: 1, lexicographicalRank: 3 },
        { word: 'leetcode', frequency: 1, lexicographicalRank: 4 }
      ]
    },
    skeletonHint: `function topKFrequentWords(words, k) {
  const map = new Map();
  for (const w of words) map.set(w, (map.get(w) || 0) + 1);
  const unique = Array.from(map.keys());
  unique.sort((a, b) => {
    const diff = map.get(b) - map.get(a);
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
  return unique.slice(0, k);
}`,
    solution: `function topKFrequentWords(words, k) {
  const freq = new Map();
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  const uniqueWords = Array.from(freq.keys());
  uniqueWords.sort((a, b) => {
    const countA = freq.get(a);
    const countB = freq.get(b);
    if (countA !== countB) {
      return countB - countA;
    }
    return a.localeCompare(b);
  });

  return uniqueWords.slice(0, k);
}`,
    tests: [
      { input: [['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2], expected: ['i', 'love'], label: 'Frequency 2 tie broken lexicographically' },
      { input: [['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4], expected: ['the', 'is', 'sunny', 'day'], label: 'Top 4 words' },
      { input: [['a', 'aa', 'aaa'], 1], expected: ['a'], label: 'Equal frequency lowest alphabetical' },
      { input: [['single'], 1], expected: ['single'], label: 'Single item' }
    ],
    patternTag: 'Heap / Priority Queue Multi-key Sort',
    patternExplanation: 'Frequency counting followed by priority ordering by frequency descending and alphabetical ascending.',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'task-scheduler',
    title: 'Task Scheduler',
    category: 'heaps',
    difficulty: 'Medium',
    functionName: 'leastInterval',
    description: 'Given a characters array tasks representing CPU tasks and a non-negative integer n cooldown intervals, return the minimum number of intervals required to finish all tasks.',
    whatShouldHappen: [
      'Count frequency of each task.',
      'Find the maximum frequency maxFreq among all tasks.',
      'Count how many tasks share this maximum frequency (maxCount).',
      'The minimum intervals required based on the most frequent task is (maxFreq - 1) * (n + 1) + maxCount.',
      'Return Math.max(tasks.length, minimumIntervals).'
    ],
    starterCode: `function leastInterval(tasks, n) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'tasks = ["A","A","A","B","B","B"], n = 2',
      columns: ['maxFreq', 'maxCount', 'calculatedEmptySlots', 'result'],
      rows: [
        { maxFreq: 3, maxCount: 2, calculatedEmptySlots: 2, result: 8 }
      ]
    },
    skeletonHint: `function leastInterval(tasks, n) {
  const map = {};
  for (const t of tasks) map[t] = (map[t] || 0) + 1;
  let maxFreq = 0;
  for (const t in map) maxFreq = Math.max(maxFreq, map[t]);
  let maxCount = 0;
  for (const t in map) if (map[t] === maxFreq) maxCount++;
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}`,
    solution: `function leastInterval(tasks, n) {
  const counts = new Map();
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    counts.set(t, (counts.get(t) || 0) + 1);
  }

  let maxFreq = 0;
  for (const count of counts.values()) {
    if (count > maxFreq) maxFreq = count;
  }

  let maxCount = 0;
  for (const count of counts.values()) {
    if (count === maxFreq) maxCount++;
  }

  const idlePart = (maxFreq - 1) * (n + 1) + maxCount;
  return Math.max(tasks.length, idlePart);
}`,
    tests: [
      { input: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8, label: 'A -> B -> idle -> A -> B -> idle -> A -> B' },
      { input: [['A', 'A', 'A', 'B', 'B', 'B'], 0], expected: 6, label: 'Cooldown 0 runs back-to-back' },
      { input: [['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2], expected: 16, label: 'One dominant task' },
      { input: [['A', 'B', 'C'], 2], expected: 3, label: 'No duplicates' }
    ],
    patternTag: 'Greedy / Max-Heap Scheduling',
    patternExplanation: 'Arranging tasks around the most frequent element creates slots filled by other tasks or CPU idles.',
    estimatedMinutes: 20,
    status: 'published'
  }
];

// 5. Practical Object Problems (Flatten & Unflatten)
const practicalObjectProblems = [
  {
    id: 'practical-flatten-object',
    title: 'Flatten Nested Object with Dot Notation',
    category: 'objects-and-classes',
    difficulty: 'Medium',
    functionName: 'flattenObject',
    description: 'Implement a function that flattens a deeply nested object into a single-level object whose keys are dot-separated paths.',
    whatShouldHappen: [
      'Initialize result object.',
      'Recursively traverse properties of the input object with a prefix path.',
      'If a value is a plain object and non-null (and not an array), recurse into its keys.',
      'If a value is a primitive, array, or null, assign it to result[currentPath].',
      'Return the flattened object.'
    ],
    starterCode: `function flattenObject(obj) {
  // your code here
}`,
    traceTable: {
      inputLabel: 'obj = { a: 1, b: { c: 2, d: { e: 3 } } }',
      columns: ['path', 'value', 'action'],
      rows: [
        { path: 'a', value: '1', action: "result['a'] = 1" },
        { path: 'b.c', value: '2', action: "result['b.c'] = 2" },
        { path: 'b.d.e', value: '3', action: "result['b.d.e'] = 3" }
      ]
    },
    skeletonHint: `function flattenObject(obj) {
  const result = {};
  function recurse(curr, prefix) {
    for (const key of Object.keys(curr)) {
      const val = curr[key];
      const newKey = prefix ? prefix + '.' + key : key;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        recurse(val, newKey);
      } else {
        result[newKey] = val;
      }
    }
  }
  recurse(obj, '');
  return result;
}`,
    solution: `function flattenObject(obj) {
  const result = {};

  function recurse(current, prefix) {
    if (!current || typeof current !== 'object') return;

    for (const key of Object.keys(current)) {
      const val = current[key];
      const newPath = prefix ? prefix + '.' + key : key;

      if (val !== null && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0) {
        recurse(val, newPath);
      } else {
        result[newPath] = val;
      }
    }
  }

  recurse(obj, '');
  return result;
}`,
    tests: [
      { input: [{ a: 1, b: { c: 2, d: { e: 3 } } }], expected: { 'a': 1, 'b.c': 2, 'b.d.e': 3 }, label: 'Deeply nested object' },
      { input: [{ user: { name: 'Alice', active: true } }], expected: { 'user.name': 'Alice', 'user.active': true }, label: 'User metadata' },
      { input: [{ a: null, b: [1, 2] }], expected: { 'a': null, 'b': [1, 2] }, label: 'Preserves arrays and null' },
      { input: [{ x: 10, y: 20 }], expected: { 'x': 10, 'y': 20 }, label: 'Already flat object' }
    ],
    patternTag: 'Recursive Tree Traversal',
    patternExplanation: 'Recursively walks nested dictionary nodes building dot-separated property paths.',
    estimatedMinutes: 15,
    status: 'published'
  },
  {
    id: 'practical-unflatten-object',
    title: 'Unflatten Object from Dot Paths',
    category: 'objects-and-classes',
    difficulty: 'Medium',
    functionName: 'unflattenObject',
    description: 'Implement a function that reconstructs a deeply nested object from a flattened single-level object with dot-separated keys.',
    whatShouldHappen: [
      'Initialize an empty result object.',
      'For each key-value pair in the input object, split the key by "." to obtain path tokens.',
      'Traverse through the path tokens, creating nested objects if they do not exist.',
      'Assign the value at the final leaf token.',
      'Return the reconstructed nested object.'
    ],
    starterCode: `function unflattenObject(obj) {
  // your code here
}`,
    traceTable: {
      inputLabel: "obj = { 'a.b.c': 1, 'a.b.d': 2 }",
      columns: ['key', 'parts', 'treeAssignment'],
      rows: [
        { key: 'a.b.c', parts: "['a', 'b', 'c']", treeAssignment: 'result.a.b.c = 1' },
        { key: 'a.b.d', parts: "['a', 'b', 'd']", treeAssignment: 'result.a.b.d = 2' }
      ]
    },
    skeletonHint: `function unflattenObject(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    const parts = key.split('.');
    let curr = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!curr[part] || typeof curr[part] !== 'object') curr[part] = {};
      curr = curr[part];
    }
    curr[parts[parts.length - 1]] = obj[key];
  }
  return result;
}`,
    solution: `function unflattenObject(obj) {
  const result = {};

  for (const key of Object.keys(obj)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = obj[key];
  }

  return result;
}`,
    tests: [
      { input: [{ 'a.b.c': 1, 'a.b.d': 2 }], expected: { a: { b: { c: 1, d: 2 } } }, label: 'Reconstruct nested object' },
      { input: [{ 'name': 'John', 'address.city': 'NYC' }], expected: { name: 'John', address: { city: 'NYC' } }, label: 'Mixed depth paths' },
      { input: [{ 'a': 1, 'b': 2 }], expected: { a: 1, b: 2 }, label: 'Single level keys' },
      { input: [{ 'deep.nested.leaf': true }], expected: { deep: { nested: { leaf: true } } }, label: 'Deep single branch' }
    ],
    patternTag: 'Path Tokenization & Tree Construction',
    patternExplanation: 'Tokenizes string keys by delimiter and traverses pointers to construct the nested hierarchy.',
    estimatedMinutes: 15,
    status: 'published'
  }
];

// Execute insertions
appendProblems('../server/data/problems/two-pointer.json', twoPointerProblems);
appendProblems('../server/data/problems/sliding-window.json', slidingWindowProblems);
appendProblems('../server/data/problems/prefix-suffix.json', prefixSuffixProblems);
appendProblems('../server/data/problems/blind75/heaps.json', heapProblems);
appendProblems('../server/data/problems/js-pro/objects.json', practicalObjectProblems);

console.log('All practical problems successfully added!');
