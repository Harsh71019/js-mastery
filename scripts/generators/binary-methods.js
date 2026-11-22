// scripts/generators/binary-methods.js
// 30 well-tested simple/easy problems covering JavaScript Bitwise and Binary methods

const binaryMethodsProblems = [
  // -------------------------------------------------------------------------
  // Sub-Set 1: Bitwise Logic (&, |, ^, ~) (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-is-even-bitwise',
    title: 'Bitwise AND: Check Even Number',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'isEvenBitwise',
    description: 'Given integer n, use the bitwise AND operator (n & 1) === 0 to determine if n is even. Even numbers have 0 as their least significant bit.',
    whatShouldHappen: [
      'Check (n & 1) === 0.',
      'Return boolean.'
    ],
    starterCode: 'function isEvenBitwise(n) {\n  // your code here\n}',
    solution: 'function isEvenBitwise(n) {\n  return (n & 1) === 0;\n}',
    skeletonHint: 'function isEvenBitwise(n) {\n  return (n & ____) === 0;\n}',
    traceTable: {
      inputLabel: 'n = 6',
      columns: ['n binary', '1 binary', 'n & 1', 'is even?'],
      rows: [
        { 'n binary': '0110', '1 binary': '0001', 'n & 1': '0000 (0)', 'is even?': 'true' }
      ]
    },
    patternTag: 'Parity Bitmasking',
    patternExplanation: '(n & 1) extracts the lowest bit, which is 0 for all even integers and 1 for odd integers.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [6], expected: true, label: '6 is even' },
      { input: [7], expected: false, label: '7 is odd' },
      { input: [0], expected: true, label: '0 is even' },
      { input: [-4], expected: true, label: 'negative even' }
    ]
  },
  {
    id: 'binary-single-number-xor',
    title: 'Bitwise XOR: Find Non-Duplicate Number',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'findSingleNumber',
    description: 'Given an array of integers nums where every number appears twice except one, use the bitwise XOR operator (^) in a reduce loop to find that unique single number.',
    whatShouldHappen: [
      'Call nums.reduce((acc, n) => acc ^ n, 0).',
      'Return the unique number.'
    ],
    starterCode: 'function findSingleNumber(nums) {\n  // your code here\n}',
    solution: 'function findSingleNumber(nums) {\n  return nums.reduce((acc, n) => acc ^ n, 0);\n}',
    skeletonHint: 'function findSingleNumber(nums) {\n  return nums.reduce((acc, n) => acc ^ ____, 0);\n}',
    traceTable: {
      inputLabel: 'nums = [4, 1, 2, 1, 2]',
      columns: ['n', 'acc before', 'acc ^ n'],
      rows: [
        { n: 4, 'acc before': 0, 'acc ^ n': 4 },
        { n: 1, 'acc before': 4, 'acc ^ n': 5 },
        { n: 2, 'acc before': 5, 'acc ^ n': 7 },
        { n: 1, 'acc before': 7, 'acc ^ n': 6 },
        { n: 2, 'acc before': 6, 'acc ^ n': 4 }
      ]
    },
    patternTag: 'XOR Cancellation',
    patternExplanation: 'XORing identical numbers cancels them out (x ^ x = 0), leaving only the unmatched element (x ^ 0 = x).',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[4, 1, 2, 1, 2]], expected: 4, label: 'single number is 4' },
      { input: [[2, 2, 1]], expected: 1, label: 'single number is 1' },
      { input: [[42]], expected: 42, label: 'single element' },
      { input: [[9, 3, 9]], expected: 3, label: 'single number is 3' }
    ]
  },
  {
    id: 'binary-bitwise-and-mask',
    title: 'Bitwise AND: Apply Bitmask',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'applyBitmask',
    description: 'Given integers val and mask, return the result of val & mask.',
    whatShouldHappen: [
      'Calculate val & mask.',
      'Return integer.'
    ],
    starterCode: 'function applyBitmask(val, mask) {\n  // your code here\n}',
    solution: 'function applyBitmask(val, mask) {\n  return val & mask;\n}',
    skeletonHint: 'function applyBitmask(val, mask) {\n  return val & ____;\n}',
    traceTable: {
      inputLabel: 'val = 12, mask = 10',
      columns: ['val (1100)', 'mask (1010)', 'val & mask'],
      rows: [
        { 'val (1100)': '1100', 'mask (1010)': '1010', 'val & mask': '1000 (8)' }
      ]
    },
    patternTag: 'Bitmask Filter',
    patternExplanation: 'Bitwise AND retains only the bits that are set to 1 in both operands.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [12, 10], expected: 8, label: '12 & 10 is 8' },
      { input: [15, 7], expected: 7, label: '15 & 7 is 7' },
      { input: [15, 0], expected: 0, label: 'mask with 0' },
      { input: [255, 15], expected: 15, label: 'lower nibble mask' }
    ]
  },
  {
    id: 'binary-bitwise-or-combine',
    title: 'Bitwise OR: Combine Bit Flags',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'combineFlags',
    description: 'Given two integer flags flagA and flagB, return their combined bitwise union using flagA | flagB.',
    whatShouldHappen: [
      'Call flagA | flagB.',
      'Return combined integer.'
    ],
    starterCode: 'function combineFlags(flagA, flagB) {\n  // your code here\n}',
    solution: 'function combineFlags(flagA, flagB) {\n  return flagA | flagB;\n}',
    skeletonHint: 'function combineFlags(flagA, flagB) {\n  return flagA | ____;\n}',
    traceTable: {
      inputLabel: 'flagA = 1, flagB = 2',
      columns: ['flagA (01)', 'flagB (10)', 'OR result'],
      rows: [
        { 'flagA (01)': '01', 'flagB (10)': '10', 'OR result': '11 (3)' }
      ]
    },
    patternTag: 'Flag Combination',
    patternExplanation: 'Bitwise OR merges active bit flags, turning on any bit that is set in either operand.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [1, 2], expected: 3, label: '1 | 2 is 3' },
      { input: [4, 8], expected: 12, label: '4 | 8 is 12' },
      { input: [5, 5], expected: 5, label: 'identical flags' },
      { input: [0, 7], expected: 7, label: '0 | 7 is 7' }
    ]
  },
  {
    id: 'binary-bitwise-not-inversion',
    title: 'Bitwise NOT: One\'s Complement Inversion',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'bitwiseNot',
    description: 'Given integer n, return ~n (the two\'s complement bitwise NOT, which equals -(n + 1)).',
    whatShouldHappen: [
      'Call ~n.',
      'Return inverted integer.'
    ],
    starterCode: 'function bitwiseNot(n) {\n  // your code here\n}',
    solution: 'function bitwiseNot(n) {\n  return ~n;\n}',
    skeletonHint: 'function bitwiseNot(n) {\n  return ~____;\n}',
    traceTable: {
      inputLabel: 'n = 5',
      columns: ['n', '~n', 'formula -(n + 1)'],
      rows: [
        { n: 5, '~n': -6, 'formula -(n + 1)': '-(5 + 1) = -6' }
      ]
    },
    patternTag: 'Bitwise Negation',
    patternExplanation: 'The bitwise NOT operator ~ flips all bits of a 32-bit integer, yielding -(n + 1).',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [5], expected: -6, label: '~5 is -6' },
      { input: [0], expected: -1, label: '~0 is -1' },
      { input: [-1], expected: 0, label: '~-1 is 0' },
      { input: [9], expected: -10, label: '~9 is -10' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 2: Bit Shifts (<<, >>, >>>) (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-shift-multiply-two',
    title: 'Bitwise Left Shift: Fast Multiply by 2^K',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'multiplyByPowerOfTwo',
    description: 'Given integers n and k (0 <= k < 30), return n multiplied by 2^k using the left shift operator (n << k).',
    whatShouldHappen: [
      'Call n << k.',
      'Return shifted integer.'
    ],
    starterCode: 'function multiplyByPowerOfTwo(n, k) {\n  // your code here\n}',
    solution: 'function multiplyByPowerOfTwo(n, k) {\n  return n << k;\n}',
    skeletonHint: 'function multiplyByPowerOfTwo(n, k) {\n  return n << ____;\n}',
    traceTable: {
      inputLabel: 'n = 5, k = 2',
      columns: ['n', 'k', 'n << 2', 'math equivalent'],
      rows: [
        { n: 5, k: 2, 'n << 2': 20, 'math equivalent': '5 * 2^2 = 20' }
      ]
    },
    patternTag: 'Left Shift Scaling',
    patternExplanation: 'Shifting bits left by k positions (n << k) multiplies an integer by 2^k.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [5, 2], expected: 20, label: '5 << 2 is 20' },
      { input: [3, 1], expected: 6, label: '3 << 1 is 6' },
      { input: [7, 0], expected: 7, label: 'shift by 0' },
      { input: [1, 4], expected: 16, label: '1 << 4 is 16' }
    ]
  },
  {
    id: 'binary-shift-divide-two',
    title: 'Bitwise Right Shift: Sign-Preserving Division',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'divideByPowerOfTwo',
    description: 'Given integer n and shift count k (0 <= k < 30), return the result of n >> k (sign-propagating right shift, equivalent to Math.floor(n / 2^k)).',
    whatShouldHappen: [
      'Call n >> k.',
      'Return shifted value.'
    ],
    starterCode: 'function divideByPowerOfTwo(n, k) {\n  // your code here\n}',
    solution: 'function divideByPowerOfTwo(n, k) {\n  return n >> k;\n}',
    skeletonHint: 'function divideByPowerOfTwo(n, k) {\n  return n >> ____;\n}',
    traceTable: {
      inputLabel: 'n = 20, k = 2',
      columns: ['n', 'k', 'n >> 2'],
      rows: [
        { n: 20, k: 2, 'n >> 2': 5 }
      ]
    },
    patternTag: 'Arithmetic Right Shift',
    patternExplanation: '>> shifts bits right while keeping the sign bit intact, performing integer division by powers of two.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [20, 2], expected: 5, label: '20 >> 2 is 5' },
      { input: [7, 1], expected: 3, label: '7 >> 1 is 3' },
      { input: [10, 0], expected: 10, label: 'shift by 0' },
      { input: [-8, 1], expected: -4, label: '-8 >> 1 is -4' }
    ]
  },
  {
    id: 'binary-zero-fill-right-shift',
    title: 'Bitwise Zero-Fill Right Shift (>>>)',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'zeroFillShift',
    description: 'Given integer n and k, return n >>> k (the zero-fill right shift that treats the binary operand as an unsigned 32-bit integer).',
    whatShouldHappen: [
      'Call n >>> k.',
      'Return unsigned integer.'
    ],
    starterCode: 'function zeroFillShift(n, k) {\n  // your code here\n}',
    solution: 'function zeroFillShift(n, k) {\n  return n >>> k;\n}',
    skeletonHint: 'function zeroFillShift(n, k) {\n  return n >>> ____;\n}',
    traceTable: {
      inputLabel: 'n = 16, k = 2',
      columns: ['n', 'k', 'n >>> 2'],
      rows: [
        { n: 16, k: 2, 'n >>> 2': 4 }
      ]
    },
    patternTag: 'Unsigned Shift',
    patternExplanation: '>>> inserts zeros from the left, converting numbers to unsigned 32-bit representations.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [16, 2], expected: 4, label: '16 >>> 2 is 4' },
      { input: [5, 1], expected: 2, label: '5 >>> 1 is 2' },
      { input: [0, 3], expected: 0, label: '0 >>> 3 is 0' },
      { input: [64, 4], expected: 4, label: '64 >>> 4 is 4' }
    ]
  },
  {
    id: 'binary-double-bitwise-not-floor',
    title: 'Bitwise Double NOT: Fast Integer Truncation',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'fastBitwiseTrunc',
    description: 'Given a floating-point number num within 32-bit integer limits, use ~~num (double bitwise NOT) to truncate its fractional component.',
    whatShouldHappen: [
      'Call ~~num.',
      'Return truncated 32-bit integer.'
    ],
    starterCode: 'function fastBitwiseTrunc(num) {\n  // your code here\n}',
    solution: 'function fastBitwiseTrunc(num) {\n  return ~~num;\n}',
    skeletonHint: 'function fastBitwiseTrunc(num) {\n  return ~~____;\n}',
    traceTable: {
      inputLabel: 'num = 7.9',
      columns: ['num', '~~num', 'comparison with Math.trunc'],
      rows: [
        { num: 7.9, '~~num': 7, 'comparison with Math.trunc': 'identical' }
      ]
    },
    patternTag: 'Bitwise Truncation',
    patternExplanation: '~~ coerces a number to a 32-bit integer by truncating towards zero.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [7.9], expected: 7, label: 'truncate positive' },
      { input: [-7.9], expected: -7, label: 'truncate negative' },
      { input: [0.99], expected: 0, label: 'fractional below 1' },
      { input: [42], expected: 42, label: 'whole integer unchanged' }
    ]
  },
  {
    id: 'binary-swap-without-temp',
    title: 'Bitwise XOR: Swap Numbers Without Temporary Variable',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'swapNumbersXor',
    description: 'Given integers a and b, simulate the 3-step XOR swap: a = a ^ b; b = a ^ b; a = a ^ b; and return [a, b].',
    whatShouldHappen: [
      'let x = a, y = b.',
      'x = x ^ y; y = x ^ y; x = x ^ y.',
      'Return [x, y].'
    ],
    starterCode: 'function swapNumbersXor(a, b) {\n  // your code here\n}',
    solution: 'function swapNumbersXor(a, b) {\n  let x = a;\n  let y = b;\n  x = x ^ y;\n  y = x ^ y;\n  x = x ^ y;\n  return [x, y];\n}',
    skeletonHint: 'function swapNumbersXor(a, b) {\n  let x = a, y = b;\n  x = x ^ y;\n  y = x ^ y;\n  x = x ^ ____;\n  return [x, y];\n}',
    traceTable: {
      inputLabel: 'a = 3, b = 5',
      columns: ['step', 'x', 'y'],
      rows: [
        { step: 'init', x: 3, y: 5 },
        { step: 'x = x ^ y', x: 6, y: 5 },
        { step: 'y = x ^ y', x: 6, y: 3 },
        { step: 'x = x ^ y', x: 5, y: 3 }
      ]
    },
    patternTag: 'XOR In-Place Swap',
    patternExplanation: 'XOR in-place swapping exchanges two numeric variables without allocating auxiliary temporary storage.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [3, 5], expected: [5, 3], label: 'swap 3 and 5' },
      { input: [10, 20], expected: [20, 10], label: 'swap 10 and 20' },
      { input: [0, 7], expected: [7, 0], label: 'swap with zero' },
      { input: [-4, 8], expected: [8, -4], label: 'negative number' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 3: Bit Testing & Manipulation (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-get-kth-bit',
    title: 'Bitwise: Get K-th Bit Value',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'getKthBit',
    description: 'Given non-negative integer n and 0-based bit index k, return the value of the k-th bit (either 0 or 1) using (n >> k) & 1.',
    whatShouldHappen: [
      'Call (n >> k) & 1.',
      'Return 0 or 1.'
    ],
    starterCode: 'function getKthBit(n, k) {\n  // your code here\n}',
    solution: 'function getKthBit(n, k) {\n  return (n >> k) & 1;\n}',
    skeletonHint: 'function getKthBit(n, k) {\n  return (n >> ____) & 1;\n}',
    traceTable: {
      inputLabel: 'n = 5 (0101 in binary), k = 2',
      columns: ['n binary', 'shifted by 2', 'masked & 1'],
      rows: [
        { 'n binary': '0101', 'shifted by 2': '0001', 'masked & 1': 1 }
      ]
    },
    patternTag: 'Bit Reading',
    patternExplanation: 'Right-shifting by k positions brings the k-th bit to index 0, where & 1 isolates its binary value.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [5, 2], expected: 1, label: 'bit 2 of 5 is 1' },
      { input: [5, 1], expected: 0, label: 'bit 1 of 5 is 0' },
      { input: [5, 0], expected: 1, label: 'bit 0 of 5 is 1' },
      { input: [8, 3], expected: 1, label: 'bit 3 of 8 is 1' }
    ]
  },
  {
    id: 'binary-set-kth-bit',
    title: 'Bitwise OR: Set K-th Bit to 1',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'setKthBit',
    description: 'Given integer n and 0-based bit index k, turn the k-th bit on (set to 1) using n | (1 << k).',
    whatShouldHappen: [
      'Call n | (1 << k).',
      'Return updated integer.'
    ],
    starterCode: 'function setKthBit(n, k) {\n  // your code here\n}',
    solution: 'function setKthBit(n, k) {\n  return n | (1 << k);\n}',
    skeletonHint: 'function setKthBit(n, k) {\n  return n | (1 << ____);\n}',
    traceTable: {
      inputLabel: 'n = 4 (0100), k = 1',
      columns: ['n binary', '1 << 1', 'OR result'],
      rows: [
        { 'n binary': '0100', '1 << 1': '0010', 'OR result': '0110 (6)' }
      ]
    },
    patternTag: 'Bit Setting',
    patternExplanation: 'Using (1 << k) creates a mask with only bit k set; ORing with n sets that bit without altering others.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [4, 1], expected: 6, label: 'set bit 1 of 4 yields 6' },
      { input: [0, 0], expected: 1, label: 'set bit 0 of 0 yields 1' },
      { input: [5, 0], expected: 5, label: 'bit already set' },
      { input: [0, 3], expected: 8, label: 'set bit 3 yields 8' }
    ]
  },
  {
    id: 'binary-clear-kth-bit',
    title: 'Bitwise AND-NOT: Clear K-th Bit to 0',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'clearKthBit',
    description: 'Given integer n and 0-based bit index k, turn the k-th bit off (clear to 0) using n & ~(1 << k).',
    whatShouldHappen: [
      'Call n & ~(1 << k).',
      'Return updated integer.'
    ],
    starterCode: 'function clearKthBit(n, k) {\n  // your code here\n}',
    solution: 'function clearKthBit(n, k) {\n  return n & ~(1 << k);\n}',
    skeletonHint: 'function clearKthBit(n, k) {\n  return n & ~(1 << ____);\n}',
    traceTable: {
      inputLabel: 'n = 7 (0111), k = 1',
      columns: ['n binary', 'mask ~(1 << 1)', 'AND result'],
      rows: [
        { 'n binary': '0111', 'mask ~(1 << 1)': '1101', 'AND result': '0101 (5)' }
      ]
    },
    patternTag: 'Bit Clearing',
    patternExplanation: 'Inverting (1 << k) produces a mask with a 0 only at bit k; ANDing with n forces that bit to 0.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [7, 1], expected: 5, label: 'clear bit 1 of 7 yields 5' },
      { input: [5, 0], expected: 4, label: 'clear bit 0 of 5 yields 4' },
      { input: [4, 0], expected: 4, label: 'bit already clear' },
      { input: [15, 3], expected: 7, label: 'clear bit 3 of 15 yields 7' }
    ]
  },
  {
    id: 'binary-toggle-kth-bit',
    title: 'Bitwise XOR: Toggle K-th Bit',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'toggleKthBit',
    description: 'Given integer n and 0-based bit index k, flip the k-th bit (0 becomes 1, 1 becomes 0) using n ^ (1 << k).',
    whatShouldHappen: [
      'Call n ^ (1 << k).',
      'Return toggled integer.'
    ],
    starterCode: 'function toggleKthBit(n, k) {\n  // your code here\n}',
    solution: 'function toggleKthBit(n, k) {\n  return n ^ (1 << k);\n}',
    skeletonHint: 'function toggleKthBit(n, k) {\n  return n ^ (1 << ____);\n}',
    traceTable: {
      inputLabel: 'n = 5 (0101), k = 1',
      columns: ['n binary', '1 << 1', 'XOR result'],
      rows: [
        { 'n binary': '0101', '1 << 1': '0010', 'XOR result': '0111 (7)' }
      ]
    },
    patternTag: 'Bit Inversion',
    patternExplanation: 'XORing with (1 << k) inverts the state of bit k while preserving all other bits.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [5, 1], expected: 7, label: 'toggle bit 1 of 5 (off->on)' },
      { input: [7, 1], expected: 5, label: 'toggle bit 1 of 7 (on->off)' },
      { input: [0, 2], expected: 4, label: 'toggle bit 2 of 0' },
      { input: [8, 3], expected: 0, label: 'toggle bit 3 of 8' }
    ]
  },
  {
    id: 'binary-is-kth-bit-set',
    title: 'Bitwise: Check if K-th Bit is Set',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'isKthBitSet',
    description: 'Given non-negative integer n and index k, return true if the k-th bit is 1, otherwise false.',
    whatShouldHappen: [
      'Check ((n >> k) & 1) === 1.',
      'Return boolean.'
    ],
    starterCode: 'function isKthBitSet(n, k) {\n  // your code here\n}',
    solution: 'function isKthBitSet(n, k) {\n  return ((n >> k) & 1) === 1;\n}',
    skeletonHint: 'function isKthBitSet(n, k) {\n  return ((n >> k) & ____) === 1;\n}',
    traceTable: {
      inputLabel: 'n = 8 (1000), k = 3',
      columns: ['n >> 3', 'AND 1', 'result'],
      rows: [
        { 'n >> 3': 1, 'AND 1': 1, result: 'true' }
      ]
    },
    patternTag: 'Bit Status Predicate',
    patternExplanation: 'Testing whether the masked bit equals 1 answers binary predicate queries.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [8, 3], expected: true, label: 'bit 3 of 8 is set' },
      { input: [8, 2], expected: false, label: 'bit 2 of 8 is not set' },
      { input: [1, 0], expected: true, label: 'bit 0 of 1 is set' },
      { input: [0, 0], expected: false, label: '0 has no bits set' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 4: Counting & Hamming Metrics (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-count-set-bits',
    title: 'Bitwise Loop: Brian Kernighan Bit Count',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'countSetBits',
    description: 'Given non-negative integer n, count how many bits are set to 1 in its binary representation using a while (num > 0) loop with num &= (num - 1).',
    whatShouldHappen: [
      'Initialize count = 0, let num = n.',
      'While (num > 0):',
      '  num &= (num - 1);',
      '  count++;',
      'Return count.'
    ],
    starterCode: 'function countSetBits(n) {\n  // your code here\n}',
    solution: 'function countSetBits(n) {\n  let count = 0;\n  let num = n;\n  while (num > 0) {\n    num &= (num - 1);\n    count++;\n  }\n  return count;\n}',
    skeletonHint: 'function countSetBits(n) {\n  let count = 0, num = n;\n  while (num > 0) {\n    num &= (num - ____);\n    count++;\n  }\n  return count;\n}',
    traceTable: {
      inputLabel: 'n = 11 (1011 in binary)',
      columns: ['num before', 'num & (num - 1)', 'count'],
      rows: [
        { 'num before': '1011 (11)', 'num & (num - 1)': '1010 (10)', count: 1 },
        { 'num before': '1010 (10)', 'num & (num - 1)': '1000 (8)', count: 2 },
        { 'num before': '1000 (8)', 'num & (num - 1)': '0000 (0)', count: 3 }
      ]
    },
    patternTag: 'Kernighan Bit Counting',
    patternExplanation: 'n & (n - 1) clears the lowest set bit in each step, counting 1s in iterations proportional to set bits.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [11], expected: 3, label: '11 has 3 set bits (1011)' },
      { input: [7], expected: 3, label: '7 has 3 set bits (111)' },
      { input: [0], expected: 0, label: '0 has 0 set bits' },
      { input: [128], expected: 1, label: '128 has 1 set bit' }
    ]
  },
  {
    id: 'binary-hamming-distance',
    title: 'Bitwise: Hamming Distance Between Integers',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'hammingDistance',
    description: 'Given two integers x and y, compute the Hamming distance (the number of bit positions where the corresponding bits are different) using x ^ y.',
    whatShouldHappen: [
      'let xor = x ^ y, count = 0.',
      'While (xor > 0): xor &= (xor - 1); count++;',
      'Return count.'
    ],
    starterCode: 'function hammingDistance(x, y) {\n  // your code here\n}',
    solution: 'function hammingDistance(x, y) {\n  let xor = x ^ y;\n  let count = 0;\n  while (xor > 0) {\n    xor &= (xor - 1);\n    count++;\n  }\n  return count;\n}',
    skeletonHint: 'function hammingDistance(x, y) {\n  let xor = x ^ ____, count = 0;\n  while (xor > 0) {\n    xor &= (xor - 1);\n    count++;\n  }\n  return count;\n}',
    traceTable: {
      inputLabel: 'x = 1 (0001), y = 4 (0100)',
      columns: ['x ^ y', 'bits different', 'count'],
      rows: [
        { 'x ^ y': '0101 (5)', 'bits different': 'bits 0 and 2', count: 2 }
      ]
    },
    patternTag: 'Hamming Metric',
    patternExplanation: 'XOR isolates differing bits as 1s, whose population count yields the Hamming distance.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [1, 4], expected: 2, label: 'distance between 1 and 4' },
      { input: [3, 1], expected: 1, label: 'distance between 3 and 1' },
      { input: [5, 5], expected: 0, label: 'identical numbers' },
      { input: [0, 15], expected: 4, label: '0 to 15 has 4 bits different' }
    ]
  },
  {
    id: 'binary-is-power-of-two-bitwise',
    title: 'Bitwise: Power of Two Constant Check',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'isPowerOfTwoBitwise',
    description: 'Given an integer n, use the constant-time bitwise expression n > 0 && (n & (n - 1)) === 0 to verify if n is a power of 2.',
    whatShouldHappen: [
      'Check n > 0 && (n & (n - 1)) === 0.',
      'Return boolean.'
    ],
    starterCode: 'function isPowerOfTwoBitwise(n) {\n  // your code here\n}',
    solution: 'function isPowerOfTwoBitwise(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}',
    skeletonHint: 'function isPowerOfTwoBitwise(n) {\n  return n > 0 && (n & (n - ____)) === 0;\n}',
    traceTable: {
      inputLabel: 'n = 8 (1000 in binary)',
      columns: ['n', 'n - 1', 'n & (n - 1)', 'result'],
      rows: [
        { n: '1000 (8)', 'n - 1': '0111 (7)', 'n & (n - 1)': '0000 (0)', result: 'true' }
      ]
    },
    patternTag: 'Constant-Time Power Check',
    patternExplanation: 'A positive integer is a power of 2 if and only if it has exactly one bit set, so n & (n - 1) yields 0.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [8], expected: true, label: '8 is 2^3' },
      { input: [6], expected: false, label: '6 is not power of 2' },
      { input: [1], expected: true, label: '1 is 2^0' },
      { input: [0], expected: false, label: '0 is not power of 2' }
    ]
  },
  {
    id: 'binary-count-trailing-zeros',
    title: 'Bitwise Loop: Count Trailing Zeros',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'countTrailingZeros',
    description: 'Given a positive integer n, return the number of trailing zero bits in its binary representation using a loop.',
    whatShouldHappen: [
      'If n <= 0 return 0.',
      'Initialize count = 0, let num = n.',
      'While ((num & 1) === 0): count++; num = num >> 1;',
      'Return count.'
    ],
    starterCode: 'function countTrailingZeros(n) {\n  // your code here\n}',
    solution: 'function countTrailingZeros(n) {\n  if (n <= 0) return 0;\n  let count = 0;\n  let num = n;\n  while ((num & 1) === 0) {\n    count++;\n    num = num >> 1;\n  }\n  return count;\n}',
    skeletonHint: 'function countTrailingZeros(n) {\n  if (n <= 0) return 0;\n  let count = 0, num = n;\n  while ((num & 1) === 0) {\n    count++;\n    num = num >> ____;\n  }\n  return count;\n}',
    traceTable: {
      inputLabel: 'n = 12 (1100 in binary)',
      columns: ['num', 'num & 1', 'count'],
      rows: [
        { num: '1100', 'num & 1': 0, count: 1 },
        { num: '0110', 'num & 1': 0, count: 2 },
        { num: '0011', 'num & 1': 1, count: 'loop terminates (2)' }
      ]
    },
    patternTag: 'Trailing Zero Count',
    patternExplanation: 'Inspecting (num & 1) and right-shifting measures the highest power of 2 dividing n.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [12], expected: 2, label: '12 has 2 trailing zeros (1100)' },
      { input: [8], expected: 3, label: '8 has 3 trailing zeros (1000)' },
      { input: [7], expected: 0, label: 'odd number has 0 trailing zeros' },
      { input: [0], expected: 0, label: 'zero returns 0' }
    ]
  },
  {
    id: 'binary-parity-check',
    title: 'Bitwise: Parity of Integer',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'computeParity',
    description: 'Given non-negative integer n, return 1 if the count of set bits is odd, or 0 if the count of set bits is even.',
    whatShouldHappen: [
      'Initialize parity = 0, let num = n.',
      'While (num > 0): parity ^= (num & 1); num = num >> 1;',
      'Return parity.'
    ],
    starterCode: 'function computeParity(n) {\n  // your code here\n}',
    solution: 'function computeParity(n) {\n  let parity = 0;\n  let num = n;\n  while (num > 0) {\n    parity ^= (num & 1);\n    num = num >> 1;\n  }\n  return parity;\n}',
    skeletonHint: 'function computeParity(n) {\n  let parity = 0, num = n;\n  while (num > 0) {\n    parity ^= (num & 1);\n    num = num >> ____;\n  }\n  return parity;\n}',
    traceTable: {
      inputLabel: 'n = 5 (101 in binary)',
      columns: ['bit', 'parity state'],
      rows: [
        { bit: 1, 'parity state': '0 ^ 1 = 1' },
        { bit: 0, 'parity state': '1 ^ 0 = 1' },
        { bit: 1, 'parity state': '1 ^ 1 = 0 (even 1s)' }
      ]
    },
    patternTag: 'Parity Calculation',
    patternExplanation: 'XORing every bit against an accumulator reduces the full bitvector to its 1-bit parity flag.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [5], expected: 0, label: '5 has two 1s (even parity)' },
      { input: [7], expected: 1, label: '7 has three 1s (odd parity)' },
      { input: [0], expected: 0, label: '0 has zero 1s (even parity)' },
      { input: [1], expected: 1, label: '1 has one 1 (odd parity)' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 5: Bitmask Flags & Permissions (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-has-flag',
    title: 'Bitmask: Verify Permission Flag',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'hasPermission',
    description: 'Given integer bitmask flags and permission flag perm, check if all bits of perm are enabled in flags using (flags & perm) === perm.',
    whatShouldHappen: [
      'Check (flags & perm) === perm.',
      'Return boolean.'
    ],
    starterCode: 'function hasPermission(flags, perm) {\n  // your code here\n}',
    solution: 'function hasPermission(flags, perm) {\n  return (flags & perm) === perm;\n}',
    skeletonHint: 'function hasPermission(flags, perm) {\n  return (flags & ____) === perm;\n}',
    traceTable: {
      inputLabel: 'flags = 7 (READ | WRITE | EXECUTE), perm = 2 (WRITE)',
      columns: ['flags & perm', 'perm', 'equal?'],
      rows: [
        { 'flags & perm': 2, perm: 2, 'equal?': 'true' }
      ]
    },
    patternTag: 'Permission Testing',
    patternExplanation: 'Testing (flags & perm) === perm verifies whether all bits required by the permission mask are active.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [7, 2], expected: true, label: '7 contains flag 2' },
      { input: [5, 2], expected: false, label: '5 does not contain flag 2' },
      { input: [0, 1], expected: false, label: 'empty flags' },
      { input: [4, 4], expected: true, label: 'exact flag match' }
    ]
  },
  {
    id: 'binary-add-flag',
    title: 'Bitmask: Grant Permission Flag',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'grantPermission',
    description: 'Given flags bitmask and permission flag perm, return updated flags with perm enabled using flags | perm.',
    whatShouldHappen: [
      'Call flags | perm.',
      'Return updated integer flags.'
    ],
    starterCode: 'function grantPermission(flags, perm) {\n  // your code here\n}',
    solution: 'function grantPermission(flags, perm) {\n  return flags | perm;\n}',
    skeletonHint: 'function grantPermission(flags, perm) {\n  return flags | ____;\n}',
    traceTable: {
      inputLabel: 'flags = 1 (READ), perm = 2 (WRITE)',
      columns: ['flags', 'perm', 'OR result'],
      rows: [
        { flags: 1, perm: 2, 'OR result': 3 }
      ]
    },
    patternTag: 'Permission Granting',
    patternExplanation: 'Bitwise OR activates permission bits without affecting existing permissions.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [1, 2], expected: 3, label: 'grant write to read' },
      { input: [4, 1], expected: 5, label: 'grant read to execute' },
      { input: [3, 2], expected: 3, label: 'grant already active flag' },
      { input: [0, 8], expected: 8, label: 'grant on empty flags' }
    ]
  },
  {
    id: 'binary-remove-flag',
    title: 'Bitmask: Revoke Permission Flag',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'revokePermission',
    description: 'Given flags bitmask and permission flag perm, return updated flags with perm disabled using flags & ~perm.',
    whatShouldHappen: [
      'Call flags & ~perm.',
      'Return updated flags.'
    ],
    starterCode: 'function revokePermission(flags, perm) {\n  // your code here\n}',
    solution: 'function revokePermission(flags, perm) {\n  return flags & ~perm;\n}',
    skeletonHint: 'function revokePermission(flags, perm) {\n  return flags & ~____;\n}',
    traceTable: {
      inputLabel: 'flags = 7, perm = 2',
      columns: ['flags', '~perm', 'AND result'],
      rows: [
        { flags: 7, '~perm': '~2', 'AND result': 5 }
      ]
    },
    patternTag: 'Permission Revocation',
    patternExplanation: 'flags & ~perm clears the targeted permission bits while keeping all other permissions untouched.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [7, 2], expected: 5, label: 'revoke 2 from 7 yields 5' },
      { input: [5, 4], expected: 1, label: 'revoke 4 from 5 yields 1' },
      { input: [1, 2], expected: 1, label: 'revoke absent flag' },
      { input: [0, 1], expected: 0, label: 'revoke on empty flags' }
    ]
  },
  {
    id: 'binary-toggle-flag',
    title: 'Bitmask: Toggle Permission Flag',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'togglePermission',
    description: 'Given flags and perm, return flags with perm toggled (enabled if disabled, disabled if enabled) using flags ^ perm.',
    whatShouldHappen: [
      'Call flags ^ perm.',
      'Return updated flags.'
    ],
    starterCode: 'function togglePermission(flags, perm) {\n  // your code here\n}',
    solution: 'function togglePermission(flags, perm) {\n  return flags ^ perm;\n}',
    skeletonHint: 'function togglePermission(flags, perm) {\n  return flags ^ ____;\n}',
    traceTable: {
      inputLabel: 'flags = 5, perm = 2',
      columns: ['flags', 'perm', 'XOR result'],
      rows: [
        { flags: 5, perm: 2, 'XOR result': 7 }
      ]
    },
    patternTag: 'Permission Toggling',
    patternExplanation: 'XORing a permission bit inverts its current authorization state.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [5, 2], expected: 7, label: 'toggle on flag 2' },
      { input: [7, 2], expected: 5, label: 'toggle off flag 2' },
      { input: [0, 4], expected: 4, label: 'toggle on from 0' },
      { input: [8, 8], expected: 0, label: 'toggle off to 0' }
    ]
  },
  {
    id: 'binary-has-any-flag',
    title: 'Bitmask: Has Any Matching Permission',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'hasAnyPermission',
    description: 'Given flags and mask, return true if flags shares at least one active bit with mask using (flags & mask) !== 0.',
    whatShouldHappen: [
      'Check (flags & mask) !== 0.',
      'Return boolean.'
    ],
    starterCode: 'function hasAnyPermission(flags, mask) {\n  // your code here\n}',
    solution: 'function hasAnyPermission(flags, mask) {\n  return (flags & mask) !== 0;\n}',
    skeletonHint: 'function hasAnyPermission(flags, mask) {\n  return (flags & mask) !== ____;\n}',
    traceTable: {
      inputLabel: 'flags = 6 (0110), mask = 2 (0010)',
      columns: ['flags & mask', 'shares any bit?'],
      rows: [
        { 'flags & mask': '2 !== 0', 'shares any bit?': 'true' }
      ]
    },
    patternTag: 'Partial Permission Match',
    patternExplanation: '(flags & mask) !== 0 evaluates true if any overlap exists between the two bitvectors.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [6, 2], expected: true, label: 'shares bit 1' },
      { input: [4, 3], expected: false, label: 'no common bits' },
      { input: [0, 5], expected: false, label: 'empty flags' },
      { input: [8, 8], expected: true, label: 'exact flag match' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 6: Binary Sequences & Bitwise Loops (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'binary-binary-string-to-integer',
    title: 'Bitwise Loop: Parse Binary String Manually',
    category: 'binary',
    difficulty: 'Beginner',
    functionName: 'binStringToIntegerManual',
    description: 'Given binary string binStr, use a for...of loop with bitwise shifts (res = (res << 1) | bit) to convert it to a decimal integer without using parseInt.',
    whatShouldHappen: [
      'Initialize res = 0.',
      'For (const char of binStr):',
      '  res = (res << 1) | (char === "1" ? 1 : 0);',
      'Return res.'
    ],
    starterCode: 'function binStringToIntegerManual(binStr) {\n  // your code here\n}',
    solution: 'function binStringToIntegerManual(binStr) {\n  let res = 0;\n  for (const c of binStr) {\n    res = (res << 1) | (c === "1" ? 1 : 0);\n  }\n  return res;\n}',
    skeletonHint: 'function binStringToIntegerManual(binStr) {\n  let res = 0;\n  for (const c of binStr) {\n    res = (res << 1) | (c === "1" ? ____ : ____);\n  }\n  return res;\n}',
    traceTable: {
      inputLabel: "binStr = '101'",
      columns: ['char', 'shifted', 'OR bit', 'res after'],
      rows: [
        { char: "'1'", shifted: 0, 'OR bit': 1, 'res after': 1 },
        { char: "'0'", shifted: 2, 'OR bit': 0, 'res after': 2 },
        { char: "'1'", shifted: 4, 'OR bit': 1, 'res after': 5 }
      ]
    },
    patternTag: 'Bit Shift Accumulator',
    patternExplanation: 'Shifting left by 1 and ORing each subsequent bit accumulates binary values in linear time.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: ['101'], expected: 5, label: '101 is 5' },
      { input: ['1111'], expected: 15, label: '1111 is 15' },
      { input: ['0'], expected: 0, label: '0 is 0' },
      { input: ['1000'], expected: 8, label: '1000 is 8' }
    ]
  },
  {
    id: 'binary-reverse-bits-byte',
    title: 'Bitwise Loop: Reverse 8-Bit Byte',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'reverseByteBits',
    description: 'Given an 8-bit integer byte (0 <= byte <= 255), return the integer whose 8 binary bits are reversed.',
    whatShouldHappen: [
      'Initialize result = 0.',
      'Loop i from 0 to 7:',
      '  result = (result << 1) | ((byte >> i) & 1);',
      'Return result.'
    ],
    starterCode: 'function reverseByteBits(byte) {\n  // your code here\n}',
    solution: 'function reverseByteBits(byte) {\n  let result = 0;\n  for (let i = 0; i < 8; i++) {\n    result = (result << 1) | ((byte >> i) & 1);\n  }\n  return result;\n}',
    skeletonHint: 'function reverseByteBits(byte) {\n  let result = 0;\n  for (let i = 0; i < 8; i++) {\n    result = (result << 1) | ((byte >> ____) & 1);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: 'byte = 1 (00000001)',
      columns: ['i', 'bit', 'result state'],
      rows: [
        { i: 0, bit: 1, 'result state': '1 (shifts 7 times to 10000000 = 128)' }
      ]
    },
    patternTag: 'Bit Reversal',
    patternExplanation: 'Extracting bits from LSB to MSB and shifting them into an accumulator reverses bit endianness.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [1], expected: 128, label: '00000001 reversed is 10000000 (128)' },
      { input: [128], expected: 1, label: '10000000 reversed is 00000001 (1)' },
      { input: [0], expected: 0, label: 'all zeros reversed is 0' },
      { input: [255], expected: 255, label: 'all ones reversed is 255' }
    ]
  },
  {
    id: 'binary-next-power-of-two',
    title: 'Bitwise: Next Power of Two',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'nextPowerOfTwo',
    description: 'Given positive integer n, return the smallest power of 2 that is greater than or equal to n.',
    whatShouldHappen: [
      'If n <= 1 return 1.',
      'let p = 1;',
      'While (p < n) p <<= 1;',
      'Return p.'
    ],
    starterCode: 'function nextPowerOfTwo(n) {\n  // your code here\n}',
    solution: 'function nextPowerOfTwo(n) {\n  if (n <= 1) return 1;\n  let p = 1;\n  while (p < n) {\n    p <<= 1;\n  }\n  return p;\n}',
    skeletonHint: 'function nextPowerOfTwo(n) {\n  if (n <= 1) return 1;\n  let p = 1;\n  while (p < n) {\n    p <<= ____;\n  }\n  return p;\n}',
    traceTable: {
      inputLabel: 'n = 5',
      columns: ['p', 'p < 5?', 'p <<= 1'],
      rows: [
        { p: 1, 'p < 5?': 'true', 'p <<= 1': 2 },
        { p: 2, 'p < 5?': 'true', 'p <<= 1': 4 },
        { p: 4, 'p < 5?': 'true', 'p <<= 1': 8 },
        { p: 8, 'p < 5?': 'false', 'p <<= 1': 'returns 8' }
      ]
    },
    patternTag: 'Bit Shift Ceiling',
    patternExplanation: 'Repeated left shifts p <<= 1 double the value until it encloses the target.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [5], expected: 8, label: 'next power above 5 is 8' },
      { input: [8], expected: 8, label: 'already power of 2' },
      { input: [1], expected: 1, label: '1 is 2^0' },
      { input: [17], expected: 32, label: 'next above 17 is 32' }
    ]
  },
  {
    id: 'binary-subsets-bitmask',
    title: 'Bitmask: Generate 2-Element Subsets',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'generateSubsetsOfPair',
    description: 'Given an array pair of 2 elements, use a bitmask loop from 0 to 3 (mask < 4) to generate all 4 subsets.',
    whatShouldHappen: [
      'Initialize subsets = [].',
      'Loop mask from 0 to 3:',
      '  const sub = [];',
      '  if (mask & 1) sub.push(pair[0]);',
      '  if (mask & 2) sub.push(pair[1]);',
      '  subsets.push(sub);',
      'Return subsets.'
    ],
    starterCode: 'function generateSubsetsOfPair(pair) {\n  // your code here\n}',
    solution: 'function generateSubsetsOfPair(pair) {\n  const subsets = [];\n  for (let mask = 0; mask < 4; mask++) {\n    const sub = [];\n    if (mask & 1) sub.push(pair[0]);\n    if (mask & 2) sub.push(pair[1]);\n    subsets.push(sub);\n  }\n  return subsets;\n}',
    skeletonHint: 'function generateSubsetsOfPair(pair) {\n  const subsets = [];\n  for (let mask = 0; mask < 4; mask++) {\n    const sub = [];\n    if (mask & 1) sub.push(pair[0]);\n    if (mask & ____) sub.push(pair[1]);\n    subsets.push(sub);\n  }\n  return subsets;\n}',
    traceTable: {
      inputLabel: "pair = ['a', 'b']",
      columns: ['mask', 'binary', 'subset'],
      rows: [
        { mask: 0, binary: '00', subset: '[]' },
        { mask: 1, binary: '01', subset: "['a']" },
        { mask: 2, binary: '10', subset: "['b']" },
        { mask: 3, binary: '11', subset: "['a', 'b']" }
      ]
    },
    patternTag: 'Bitmask Subset Enumeration',
    patternExplanation: 'Every binary integer from 0 to 2^N - 1 corresponds to a unique subset combination.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['a', 'b']], expected: [[], ['a'], ['b'], ['a', 'b']], label: 'four subsets of a and b' },
      { input: [[1, 2]], expected: [[], [1], [2], [1, 2]], label: 'numeric pair subsets' },
      { input: [['x', 'y']], expected: [[], ['x'], ['y'], ['x', 'y']], label: 'x and y subsets' },
      { input: [[0, 1]], expected: [[], [0], [1], [0, 1]], label: '0 and 1 subsets' }
    ]
  },
  {
    id: 'binary-check-alternating-bits',
    title: 'Bitwise: Check Alternating Bit Pattern',
    category: 'binary',
    difficulty: 'Easy',
    functionName: 'hasAlternatingBits',
    description: 'Given a positive integer n, return true if adjacent bits in its binary representation always have different values (e.g. 5 is 101, alternating; 7 is 111, not alternating).',
    whatShouldHappen: [
      'let xor = n ^ (n >> 1).',
      'Return (xor & (xor + 1)) === 0.'
    ],
    starterCode: 'function hasAlternatingBits(n) {\n  // your code here\n}',
    solution: 'function hasAlternatingBits(n) {\n  const xor = n ^ (n >> 1);\n  return (xor & (xor + 1)) === 0;\n}',
    skeletonHint: 'function hasAlternatingBits(n) {\n  const xor = n ^ (n >> 1);\n  return (xor & (xor + ____)) === 0;\n}',
    traceTable: {
      inputLabel: 'n = 5 (101)',
      columns: ['n', 'n >> 1', 'xor', 'all ones?'],
      rows: [
        { n: '101', 'n >> 1': '010', xor: '111', 'all ones?': 'true (7 & 8 === 0)' }
      ]
    },
    patternTag: 'Alternating Bit Identity',
    patternExplanation: 'If n has alternating bits, n ^ (n >> 1) generates an unbroken sequence of 1s (all ones mask), which satisfies (x & (x + 1)) === 0.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [5], expected: true, label: '5 is 101 (alternating)' },
      { input: [7], expected: false, label: '7 is 111 (not alternating)' },
      { input: [10], expected: true, label: '10 is 1010 (alternating)' },
      { input: [11], expected: false, label: '11 is 1011 (not alternating)' }
    ]
  }
];

module.exports = { binaryMethodsProblems };
