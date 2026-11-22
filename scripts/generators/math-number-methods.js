// scripts/generators/math-number-methods.js
// 30 well-tested simple/easy problems covering JavaScript Math and Number methods

const mathNumberMethodsProblems = [
  // -------------------------------------------------------------------------
  // Sub-Set 1: Math Rounding & Truncation (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'math-floor-division',
    title: 'Math.floor: Integer Division',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'integerDivision',
    description: 'Given numbers a and b (b !== 0), return the integer floor quotient using Math.floor(a / b).',
    whatShouldHappen: [
      'Call Math.floor(a / b).',
      'Return integer.'
    ],
    starterCode: 'function integerDivision(a, b) {\n  // your code here\n}',
    solution: 'function integerDivision(a, b) {\n  return Math.floor(a / b);\n}',
    skeletonHint: 'function integerDivision(a, b) {\n  return Math.floor(a / ____);\n}',
    traceTable: {
      inputLabel: 'a = 7, b = 2',
      columns: ['a / b', 'Math.floor result'],
      rows: [
        { 'a / b': 3.5, 'Math.floor result': 3 }
      ]
    },
    patternTag: 'Floor Division',
    patternExplanation: 'Math.floor() rounds a floating-point number downward to the nearest integer.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [7, 2], expected: 3, label: '7 divided by 2 is 3' },
      { input: [10, 3], expected: 3, label: '10 divided by 3 is 3' },
      { input: [4, 2], expected: 2, label: 'exact division' },
      { input: [0, 5], expected: 0, label: 'zero numerator' }
    ]
  },
  {
    id: 'math-ceil-pages',
    title: 'Math.ceil: Calculate Pagination Total Pages',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'calculateTotalPages',
    description: 'Given totalItems count and items perPage (perPage > 0), return total pages needed using Math.ceil(totalItems / perPage). If totalItems is 0, return 0.',
    whatShouldHappen: [
      'If totalItems === 0 return 0.',
      'Return Math.ceil(totalItems / perPage).'
    ],
    starterCode: 'function calculateTotalPages(totalItems, perPage) {\n  // your code here\n}',
    solution: 'function calculateTotalPages(totalItems, perPage) {\n  if (totalItems <= 0) return 0;\n  return Math.ceil(totalItems / perPage);\n}',
    skeletonHint: 'function calculateTotalPages(totalItems, perPage) {\n  if (totalItems <= 0) return 0;\n  return Math.ceil(totalItems / ____);\n}',
    traceTable: {
      inputLabel: 'totalItems = 25, perPage = 10',
      columns: ['quotient', 'Math.ceil(2.5)'],
      rows: [
        { quotient: 2.5, 'Math.ceil(2.5)': 3 }
      ]
    },
    patternTag: 'Ceiling Pagination',
    patternExplanation: 'Math.ceil() rounds upwards, guaranteeing any fractional remaining items receive a dedicated page.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [25, 10], expected: 3, label: '25 items with 10 per page requires 3 pages' },
      { input: [20, 10], expected: 2, label: 'exact fit requires 2 pages' },
      { input: [5, 10], expected: 1, label: 'less than one full page' },
      { input: [0, 10], expected: 0, label: 'zero items' }
    ]
  },
  {
    id: 'math-round-decimal',
    title: 'Math.round: Round to Two Decimals',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'roundToTwoDecimals',
    description: 'Given floating-point number num, round it to 2 decimal places using Math.round(num * 100) / 100.',
    whatShouldHappen: [
      'Call Math.round(num * 100) / 100.',
      'Return rounded number.'
    ],
    starterCode: 'function roundToTwoDecimals(num) {\n  // your code here\n}',
    solution: 'function roundToTwoDecimals(num) {\n  return Math.round(num * 100) / 100;\n}',
    skeletonHint: 'function roundToTwoDecimals(num) {\n  return Math.round(num * 100) / ____;\n}',
    traceTable: {
      inputLabel: 'num = 3.14159',
      columns: ['num * 100', 'Math.round', 'divided by 100'],
      rows: [
        { 'num * 100': 314.159, 'Math.round': 314, 'divided by 100': 3.14 }
      ]
    },
    patternTag: 'Fixed Decimal Rounding',
    patternExplanation: 'Multiplying by 10^k, applying Math.round, and dividing back by 10^k rounds to k decimal places.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [3.14159], expected: 3.14, label: 'round pi' },
      { input: [10.555], expected: 10.56, label: 'round up' },
      { input: [7], expected: 7, label: 'integer unchanged' },
      { input: [0.004], expected: 0, label: 'rounds down to zero' }
    ]
  },
  {
    id: 'math-trunc-fraction',
    title: 'Math.trunc: Truncate Fractional Part',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'truncateFraction',
    description: 'Given number num, use Math.trunc(num) to return the integer part by removing all fractional digits without rounding.',
    whatShouldHappen: [
      'Call Math.trunc(num).',
      'Return integer.'
    ],
    starterCode: 'function truncateFraction(num) {\n  // your code here\n}',
    solution: 'function truncateFraction(num) {\n  return Math.trunc(num);\n}',
    skeletonHint: 'function truncateFraction(num) {\n  return Math.____(num);\n}',
    traceTable: {
      inputLabel: 'num = -4.9',
      columns: ['num', 'Math.trunc', 'note'],
      rows: [
        { num: -4.9, 'Math.trunc': -4, note: 'simply drops .9' }
      ]
    },
    patternTag: 'Fraction Truncation',
    patternExplanation: 'Math.trunc() discards fractional digits, truncating towards zero unlike Math.floor().',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [4.9], expected: 4, label: 'trunc positive' },
      { input: [-4.9], expected: -4, label: 'trunc negative' },
      { input: [0.123], expected: 0, label: 'trunc fraction' },
      { input: [-0.9], expected: -0, label: 'negative fraction truncs to -0' }
    ]
  },
  {
    id: 'math-round-half-even',
    title: 'Math.round: Round to Nearest Multiple of Five',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'roundToNearestFive',
    description: 'Given integer num, round it to the nearest multiple of 5 using Math.round(num / 5) * 5.',
    whatShouldHappen: [
      'Call Math.round(num / 5) * 5.',
      'Return multiple of 5.'
    ],
    starterCode: 'function roundToNearestFive(num) {\n  // your code here\n}',
    solution: 'function roundToNearestFive(num) {\n  return Math.round(num / 5) * 5;\n}',
    skeletonHint: 'function roundToNearestFive(num) {\n  return Math.round(num / 5) * ____;\n}',
    traceTable: {
      inputLabel: 'num = 12',
      columns: ['12 / 5', 'Math.round(2.4)', 'times 5'],
      rows: [
        { '12 / 5': 2.4, 'Math.round(2.4)': 2, 'times 5': 10 }
      ]
    },
    patternTag: 'Grid Step Rounding',
    patternExplanation: 'Dividing by step size, rounding, and multiplying by step snaps values to numeric intervals.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [12], expected: 10, label: '12 rounds to 10' },
      { input: [13], expected: 15, label: '13 rounds to 15' },
      { input: [25], expected: 25, label: 'exact multiple' },
      { input: [0], expected: 0, label: 'zero' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 2: Signs, Bounds & Distance (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'math-abs-difference',
    title: 'Math.abs: Absolute Difference',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'absoluteDifference',
    description: 'Given numbers a and b, return their non-negative distance using Math.abs(a - b).',
    whatShouldHappen: [
      'Call Math.abs(a - b).',
      'Return positive difference.'
    ],
    starterCode: 'function absoluteDifference(a, b) {\n  // your code here\n}',
    solution: 'function absoluteDifference(a, b) {\n  return Math.abs(a - b);\n}',
    skeletonHint: 'function absoluteDifference(a, b) {\n  return Math.abs(a - ____);\n}',
    traceTable: {
      inputLabel: 'a = 3, b = 10',
      columns: ['a - b', 'Math.abs(3 - 10)'],
      rows: [
        { 'a - b': -7, 'Math.abs(3 - 10)': 7 }
      ]
    },
    patternTag: 'Scalar Distance',
    patternExplanation: 'Math.abs() returns the positive magnitude of a number, computing distance regardless of order.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [3, 10], expected: 7, label: 'abs difference 7' },
      { input: [10, 3], expected: 7, label: 'inverted order' },
      { input: [-5, 5], expected: 10, label: 'across zero' },
      { input: [4, 4], expected: 0, label: 'identical numbers' }
    ]
  },
  {
    id: 'math-sign-indicator',
    title: 'Math.sign: Determine Number Sign',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'getNumberSign',
    description: 'Given number n, use Math.sign(n) to return 1 if positive, -1 if negative, 0 if 0, or -0 if -0.',
    whatShouldHappen: [
      'Call Math.sign(n).',
      'Return sign indicator.'
    ],
    starterCode: 'function getNumberSign(n) {\n  // your code here\n}',
    solution: 'function getNumberSign(n) {\n  return Math.sign(n);\n}',
    skeletonHint: 'function getNumberSign(n) {\n  return Math.____(n);\n}',
    traceTable: {
      inputLabel: 'n = -42',
      columns: ['n', 'Math.sign'],
      rows: [
        { n: -42, 'Math.sign': -1 }
      ]
    },
    patternTag: 'Signum Function',
    patternExplanation: 'Math.sign() evaluates the sign of a number directly without conditional branching.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [42], expected: 1, label: 'positive sign is 1' },
      { input: [-42], expected: -1, label: 'negative sign is -1' },
      { input: [0], expected: 0, label: 'zero is 0' },
      { input: [-0], expected: -0, label: 'negative zero' }
    ]
  },
  {
    id: 'math-clamp-value',
    title: 'Math.min & Math.max: Clamp Number in Range',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'clampNumber',
    description: 'Given val, lower bound min, and upper bound max (min <= max), return val clamped so it never drops below min or exceeds max using Math.min and Math.max.',
    whatShouldHappen: [
      'Call Math.min(Math.max(val, min), max).',
      'Return clamped value.'
    ],
    starterCode: 'function clampNumber(val, min, max) {\n  // your code here\n}',
    solution: 'function clampNumber(val, min, max) {\n  return Math.min(Math.max(val, min), max);\n}',
    skeletonHint: 'function clampNumber(val, min, max) {\n  return Math.min(Math.max(val, ____), ____);\n}',
    traceTable: {
      inputLabel: 'val = 15, min = 0, max = 10',
      columns: ['Math.max(15, 0)', 'Math.min(15, 10)', 'clamped result'],
      rows: [
        { 'Math.max(15, 0)': 15, 'Math.min(15, 10)': 10, 'clamped result': 10 }
      ]
    },
    patternTag: 'Value Clamping',
    patternExplanation: 'Nesting Math.max and Math.min restricts inputs to boundaries [min, max].',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [15, 0, 10], expected: 10, label: 'exceeds upper bound' },
      { input: [-5, 0, 10], expected: 0, label: 'below lower bound' },
      { input: [5, 0, 10], expected: 5, label: 'within bounds' },
      { input: [0, 0, 10], expected: 0, label: 'exact boundary' }
    ]
  },
  {
    id: 'math-hypot-distance',
    title: 'Math.hypot: Euclidean Distance from Origin',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'euclideanDistance',
    description: 'Given 2D coordinates x and y, use Math.hypot(x, y) to return the distance from the origin (0, 0) without intermediate squaring overflow.',
    whatShouldHappen: [
      'Call Math.hypot(x, y).',
      'Return Euclidean distance.'
    ],
    starterCode: 'function euclideanDistance(x, y) {\n  // your code here\n}',
    solution: 'function euclideanDistance(x, y) {\n  return Math.hypot(x, y);\n}',
    skeletonHint: 'function euclideanDistance(x, y) {\n  return Math.____(x, y);\n}',
    traceTable: {
      inputLabel: 'x = 3, y = 4',
      columns: ['x^2 + y^2', 'Math.hypot(3, 4)'],
      rows: [
        { 'x^2 + y^2': '9 + 16 = 25', 'Math.hypot(3, 4)': 5 }
      ]
    },
    patternTag: 'Hypotenuse Calculation',
    patternExplanation: 'Math.hypot() computes sqrt(x^2 + y^2) avoiding intermediate magnitude overflow.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [3, 4], expected: 5, label: '3-4-5 right triangle' },
      { input: [0, 0], expected: 0, label: 'origin' },
      { input: [5, 12], expected: 13, label: '5-12-13 triangle' },
      { input: [-3, 4], expected: 5, label: 'negative coordinate' }
    ]
  },
  {
    id: 'math-manhattan-distance',
    title: 'Math.abs: Manhattan Grid Distance',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'manhattanDistance',
    description: 'Given two points (x1, y1) and (x2, y2), return their Manhattan (taxicab) distance: Math.abs(x1 - x2) + Math.abs(y1 - y2).',
    whatShouldHappen: [
      'Calculate Math.abs(x1 - x2) + Math.abs(y1 - y2).',
      'Return sum.'
    ],
    starterCode: 'function manhattanDistance(x1, y1, x2, y2) {\n  // your code here\n}',
    solution: 'function manhattanDistance(x1, y1, x2, y2) {\n  return Math.abs(x1 - x2) + Math.abs(y1 - y2);\n}',
    skeletonHint: 'function manhattanDistance(x1, y1, x2, y2) {\n  return Math.abs(x1 - ____) + Math.abs(y1 - ____);\n}',
    traceTable: {
      inputLabel: 'p1 = (1, 2), p2 = (4, 6)',
      columns: ['dx', 'dy', 'dx + dy'],
      rows: [
        { dx: 'Math.abs(1 - 4) = 3', dy: 'Math.abs(2 - 6) = 4', 'dx + dy': 7 }
      ]
    },
    patternTag: 'Manhattan Metric',
    patternExplanation: 'Summing absolute orthogonal coordinate differences measures grid-based distance.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [1, 2, 4, 6], expected: 7, label: '3 + 4 is 7' },
      { input: [0, 0, 0, 0], expected: 0, label: 'same point' },
      { input: [-1, -1, 1, 1], expected: 4, label: 'across quadrants' },
      { input: [2, 5, 2, 10], expected: 5, label: 'vertical alignment' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 3: Powers, Roots & Exponentials (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'math-sqrt-integer',
    title: 'Math.sqrt: Verify Perfect Square',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isPerfectSquare',
    description: 'Given non-negative integer n, return true if n is a perfect square (i.e. Math.floor(Math.sqrt(n)) ** 2 === n).',
    whatShouldHappen: [
      'If n < 0 return false.',
      'Calculate root = Math.floor(Math.sqrt(n)).',
      'Return root * root === n.'
    ],
    starterCode: 'function isPerfectSquare(n) {\n  // your code here\n}',
    solution: 'function isPerfectSquare(n) {\n  if (n < 0) return false;\n  const root = Math.floor(Math.sqrt(n));\n  return root * root === n;\n}',
    skeletonHint: 'function isPerfectSquare(n) {\n  if (n < 0) return false;\n  const root = Math.floor(Math.sqrt(____));\n  return root * root === ____;\n}',
    traceTable: {
      inputLabel: 'n = 16',
      columns: ['n', 'Math.sqrt', 'root * root === n'],
      rows: [
        { n: 16, 'Math.sqrt': 4, 'root * root === n': 'true (16 === 16)' }
      ]
    },
    patternTag: 'Square Root Inversion',
    patternExplanation: 'Comparing the floored square root squared against the input checks integer squareness.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [16], expected: true, label: '16 is 4^2' },
      { input: [14], expected: false, label: '14 is not square' },
      { input: [0], expected: true, label: '0 is 0^2' },
      { input: [1], expected: true, label: '1 is 1^2' }
    ]
  },
  {
    id: 'math-cbrt-cube',
    title: 'Math.cbrt: Cube Root Extraction',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'cubeRootInteger',
    description: 'Given number n, use Math.round(Math.cbrt(n)) to return the rounded cube root.',
    whatShouldHappen: [
      'Call Math.round(Math.cbrt(n)).',
      'Return rounded cube root.'
    ],
    starterCode: 'function cubeRootInteger(n) {\n  // your code here\n}',
    solution: 'function cubeRootInteger(n) {\n  return Math.round(Math.cbrt(n));\n}',
    skeletonHint: 'function cubeRootInteger(n) {\n  return Math.round(Math.____(n));\n}',
    traceTable: {
      inputLabel: 'n = 27',
      columns: ['n', 'Math.cbrt(27)'],
      rows: [
        { n: 27, 'Math.cbrt(27)': 3 }
      ]
    },
    patternTag: 'Cube Root Extraction',
    patternExplanation: 'Math.cbrt() accurately computes cube roots, properly preserving negative signs.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [27], expected: 3, label: 'cbrt of 27 is 3' },
      { input: [-8], expected: -2, label: 'cbrt of -8 is -2' },
      { input: [1], expected: 1, label: 'cbrt of 1 is 1' },
      { input: [0], expected: 0, label: 'cbrt of 0 is 0' }
    ]
  },
  {
    id: 'math-pow-modulo',
    title: 'Math.pow: Compute Base to Power',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'computePower',
    description: 'Given base and exponent exp, return Math.pow(base, exp).',
    whatShouldHappen: [
      'Call Math.pow(base, exp).',
      'Return result.'
    ],
    starterCode: 'function computePower(base, exp) {\n  // your code here\n}',
    solution: 'function computePower(base, exp) {\n  return Math.pow(base, exp);\n}',
    skeletonHint: 'function computePower(base, exp) {\n  return Math.pow(____, ____);\n}',
    traceTable: {
      inputLabel: 'base = 2, exp = 3',
      columns: ['base', 'exp', 'Math.pow'],
      rows: [
        { base: 2, exp: 3, 'Math.pow': 8 }
      ]
    },
    patternTag: 'Exponentiation Primitive',
    patternExplanation: 'Math.pow(base, exponent) raises numbers to positive or fractional powers.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [2, 3], expected: 8, label: '2 to the 3 is 8' },
      { input: [5, 0], expected: 1, label: 'power 0 is 1' },
      { input: [4, 0.5], expected: 2, label: 'square root power' },
      { input: [10, 1], expected: 10, label: 'power 1' }
    ]
  },
  {
    id: 'math-log2-power',
    title: 'Math.log2: Check Power of Two',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isPowerOfTwoMath',
    description: 'Given positive integer n, return true if Math.log2(n) is an integer (i.e. Number.isInteger(Math.log2(n))), otherwise false.',
    whatShouldHappen: [
      'If n <= 0 return false.',
      'Return Number.isInteger(Math.log2(n)).'
    ],
    starterCode: 'function isPowerOfTwoMath(n) {\n  // your code here\n}',
    solution: 'function isPowerOfTwoMath(n) {\n  if (n <= 0) return false;\n  return Number.isInteger(Math.log2(n));\n}',
    skeletonHint: 'function isPowerOfTwoMath(n) {\n  if (n <= 0) return false;\n  return Number.isInteger(Math.____(n));\n}',
    traceTable: {
      inputLabel: 'n = 16',
      columns: ['n', 'Math.log2(16)', 'isInteger?'],
      rows: [
        { n: 16, 'Math.log2(16)': 4, 'isInteger?': 'true' }
      ]
    },
    patternTag: 'Logarithmic Power Verification',
    patternExplanation: 'Math.log2() computes base-2 logarithms, returning integers for exact powers of two.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [16], expected: true, label: '16 is 2^4' },
      { input: [18], expected: false, label: '18 is not power of 2' },
      { input: [1], expected: true, label: '1 is 2^0' },
      { input: [0], expected: false, label: '0 is not power of 2' }
    ]
  },
  {
    id: 'math-hypot-triangle',
    title: 'Math.hypot: Validate Right Triangle Sides',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isRightTriangle',
    description: 'Given legs a, b, and hypotenuse c, return true if Math.hypot(a, b) === c.',
    whatShouldHappen: [
      'Check Math.hypot(a, b) === c.',
      'Return boolean.'
    ],
    starterCode: 'function isRightTriangle(a, b, c) {\n  // your code here\n}',
    solution: 'function isRightTriangle(a, b, c) {\n  return Math.hypot(a, b) === c;\n}',
    skeletonHint: 'function isRightTriangle(a, b, c) {\n  return Math.hypot(____, ____) === c;\n}',
    traceTable: {
      inputLabel: 'a = 3, b = 4, c = 5',
      columns: ['Math.hypot(3, 4)', 'c', 'equal?'],
      rows: [
        { 'Math.hypot(3, 4)': 5, c: 5, 'equal?': 'true' }
      ]
    },
    patternTag: 'Pythagorean Check',
    patternExplanation: 'Math.hypot() directly evaluates the Pythagorean theorem a^2 + b^2 = c^2.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [3, 4, 5], expected: true, label: '3-4-5 right triangle' },
      { input: [5, 12, 13], expected: true, label: '5-12-13 right triangle' },
      { input: [2, 3, 4], expected: false, label: 'invalid right triangle' },
      { input: [6, 8, 10], expected: true, label: '6-8-10 right triangle' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 4: Extremums in Collections (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'math-min-max-spread',
    title: 'Math.min & Math.max: Spread Array Bounds',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'findMinMaxSpread',
    description: 'Given a non-empty array nums, return an object { min: Math.min(...nums), max: Math.max(...nums) }.',
    whatShouldHappen: [
      'Call Math.min(...nums) and Math.max(...nums).',
      'Return { min, max }.'
    ],
    starterCode: 'function findMinMaxSpread(nums) {\n  // your code here\n}',
    solution: 'function findMinMaxSpread(nums) {\n  return { min: Math.min(...nums), max: Math.max(...nums) };\n}',
    skeletonHint: 'function findMinMaxSpread(nums) {\n  return { min: Math.min(...____), max: Math.max(...____) };\n}',
    traceTable: {
      inputLabel: 'nums = [5, 1, 9, 3]',
      columns: ['Math.min', 'Math.max', 'result'],
      rows: [
        { 'Math.min': 1, 'Math.max': 9, result: '{ min: 1, max: 9 }' }
      ]
    },
    patternTag: 'Spread Extremums',
    patternExplanation: 'Spreading array arguments into Math.min and Math.max retrieves bounding values in one expression.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[5, 1, 9, 3]], expected: { min: 1, max: 9 }, label: 'four numbers' },
      { input: [[-10, 0, 10]], expected: { min: -10, max: 10 }, label: 'with negatives' },
      { input: [[42]], expected: { min: 42, max: 42 }, label: 'single element' },
      { input: [[2, 2, 2]], expected: { min: 2, max: 2 }, label: 'identical elements' }
    ]
  },
  {
    id: 'math-diff-min-max',
    title: 'Math: Array Dynamic Range Span',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'getRangeSpan',
    description: 'Given an array nums of at least 2 numbers, return the difference between the maximum and minimum values using Math.max and Math.min.',
    whatShouldHappen: [
      'Calculate Math.max(...nums) - Math.min(...nums).',
      'Return difference.'
    ],
    starterCode: 'function getRangeSpan(nums) {\n  // your code here\n}',
    solution: 'function getRangeSpan(nums) {\n  return Math.max(...nums) - Math.min(...nums);\n}',
    skeletonHint: 'function getRangeSpan(nums) {\n  return Math.max(...nums) - Math.____(...nums);\n}',
    traceTable: {
      inputLabel: 'nums = [10, 2, 8, 15]',
      columns: ['max', 'min', 'span'],
      rows: [
        { max: 15, min: 2, span: 13 }
      ]
    },
    patternTag: 'Range Span',
    patternExplanation: 'Subtracting Math.min from Math.max measures the dynamic dispersion span of an array.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[10, 2, 8, 15]], expected: 13, label: '15 - 2 is 13' },
      { input: [[5, 5]], expected: 0, label: 'span 0 for equal numbers' },
      { input: [[-10, 10]], expected: 20, label: 'span across zero' },
      { input: [[1, 100]], expected: 99, label: 'two elements' }
    ]
  },
  {
    id: 'math-second-largest',
    title: 'Math.max: Find Second Largest Number',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'secondLargest',
    description: 'Given an array nums with at least 2 distinct numbers, return the second largest value.',
    whatShouldHappen: [
      'Find first max = Math.max(...nums).',
      'Filter out elements strictly equal to max.',
      'Return Math.max of remaining elements.'
    ],
    starterCode: 'function secondLargest(nums) {\n  // your code here\n}',
    solution: 'function secondLargest(nums) {\n  const max = Math.max(...nums);\n  const filtered = nums.filter(n => n !== max);\n  return Math.max(...filtered);\n}',
    skeletonHint: 'function secondLargest(nums) {\n  const max = Math.max(...nums);\n  const filtered = nums.filter(n => n !== ____);\n  return Math.max(...filtered);\n}',
    traceTable: {
      inputLabel: 'nums = [3, 5, 2, 5, 4]',
      columns: ['max', 'filtered without 5', 'second max'],
      rows: [
        { max: 5, 'filtered without 5': '[3, 2, 4]', 'second max': 4 }
      ]
    },
    patternTag: 'Second Extremum',
    patternExplanation: 'Filtering out the global maximum and taking the maximum of remaining elements finds the second largest value.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[3, 5, 2, 5, 4]], expected: 4, label: 'second largest is 4' },
      { input: [[10, 20]], expected: 10, label: 'two elements' },
      { input: [[-1, -5, -2]], expected: -2, label: 'negatives second largest' },
      { input: [[100, 50, 75]], expected: 75, label: 'three distinct numbers' }
    ]
  },
  {
    id: 'math-clamp-array',
    title: 'Math.min & max: Clamp All Array Values',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'clampArrayValues',
    description: 'Given an array nums, minBound, and maxBound, return a new array where every element is clamped within [minBound, maxBound].',
    whatShouldHappen: [
      'Map nums: n => Math.min(Math.max(n, minBound), maxBound).',
      'Return clamped array.'
    ],
    starterCode: 'function clampArrayValues(nums, minBound, maxBound) {\n  // your code here\n}',
    solution: 'function clampArrayValues(nums, minBound, maxBound) {\n  return nums.map(n => Math.min(Math.max(n, minBound), maxBound));\n}',
    skeletonHint: 'function clampArrayValues(nums, minBound, maxBound) {\n  return nums.map(n => Math.min(Math.max(n, ____), ____));\n}',
    traceTable: {
      inputLabel: 'nums = [-5, 5, 15], minBound = 0, maxBound = 10',
      columns: ['n', 'clamped'],
      rows: [
        { n: -5, clamped: 0 },
        { n: 5, clamped: 5 },
        { n: 15, clamped: 10 }
      ]
    },
    patternTag: 'Vector Clamping',
    patternExplanation: 'Mapping vector coordinates through clamp boundaries confines signals within operating limits.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[-5, 5, 15], 0, 10], expected: [0, 5, 10], label: 'clamp below, inside, above' },
      { input: [[1, 2, 3], 0, 5], expected: [1, 2, 3], label: 'all within bounds' },
      { input: [[100, 200], 0, 50], expected: [50, 50], label: 'all clamped to upper' },
      { input: [[], 0, 10], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'math-nearest-to-target',
    title: 'Math.abs: Find Number Closest to Target',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'findClosestNumber',
    description: 'Given array nums and target, return the number in nums that minimizes Math.abs(n - target). If tied, return the first one encountered.',
    whatShouldHappen: [
      'Initialize closest = nums[0], minDiff = Math.abs(nums[0] - target).',
      'Loop n of nums: diff = Math.abs(n - target).',
      'If diff < minDiff: update minDiff = diff, closest = n.',
      'Return closest.'
    ],
    starterCode: 'function findClosestNumber(nums, target) {\n  // your code here\n}',
    solution: 'function findClosestNumber(nums, target) {\n  let closest = nums[0];\n  let minDiff = Math.abs(nums[0] - target);\n  for (let i = 1; i < nums.length; i++) {\n    const diff = Math.abs(nums[i] - target);\n    if (diff < minDiff) {\n      minDiff = diff;\n      closest = nums[i];\n    }\n  }\n  return closest;\n}',
    skeletonHint: 'function findClosestNumber(nums, target) {\n  let closest = nums[0], minDiff = Math.abs(nums[0] - target);\n  for (let i = 1; i < nums.length; i++) {\n    const diff = Math.abs(nums[i] - ____);\n    if (diff < minDiff) {\n      minDiff = diff;\n      closest = nums[i];\n    }\n  }\n  return closest;\n}',
    traceTable: {
      inputLabel: 'nums = [10, 2, 14], target = 8',
      columns: ['n', 'Math.abs(n - 8)', 'new closest?'],
      rows: [
        { n: 10, 'Math.abs(n - 8)': 2, 'new closest?': 'init 10' },
        { n: 2, 'Math.abs(n - 8)': 6, 'new closest?': 'keep 10' },
        { n: 14, 'Math.abs(n - 8)': 6, 'new closest?': 'keep 10' }
      ]
    },
    patternTag: 'Nearest Neighbor 1D',
    patternExplanation: 'Tracking minimum absolute deviation identifies the closest scalar value.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[10, 2, 14], 8], expected: 10, label: '10 is closest to 8' },
      { input: [[5, 20, 30], 19], expected: 20, label: '20 is closest to 19' },
      { input: [[42], 100], expected: 42, label: 'single element' },
      { input: [[-10, 10], 0], expected: -10, label: 'tie takes first' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 5: Number Parsing & Radix Conversions (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'numbers-parse-int-radix',
    title: 'Number.parseInt: Binary String to Decimal',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'parseBinaryString',
    description: 'Given binary string binStr (e.g. "1011"), use Number.parseInt(binStr, 2) to convert it to a decimal integer.',
    whatShouldHappen: [
      'Call Number.parseInt(binStr, 2).',
      'Return decimal number.'
    ],
    starterCode: 'function parseBinaryString(binStr) {\n  // your code here\n}',
    solution: 'function parseBinaryString(binStr) {\n  return Number.parseInt(binStr, 2);\n}',
    skeletonHint: 'function parseBinaryString(binStr) {\n  return Number.parseInt(binStr, ____);\n}',
    traceTable: {
      inputLabel: "binStr = '1011'",
      columns: ['binary', 'radix', 'decimal value'],
      rows: [
        { binary: "'1011'", radix: 2, 'decimal value': 11 }
      ]
    },
    patternTag: 'Radix Conversion',
    patternExplanation: 'Number.parseInt(str, radix) specifies base-2 decoding for binary strings.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: ['1011'], expected: 11, label: '1011 is 11' },
      { input: ['1111'], expected: 15, label: '1111 is 15' },
      { input: ['0'], expected: 0, label: '0 is 0' },
      { input: ['10000000'], expected: 128, label: '128' }
    ]
  },
  {
    id: 'numbers-parse-hex-radix',
    title: 'Number.parseInt: Hexadecimal String to Decimal',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'parseHexString',
    description: 'Given hexadecimal string hexStr (e.g. "ff" or "1A"), use Number.parseInt(hexStr, 16) to convert it to decimal.',
    whatShouldHappen: [
      'Call Number.parseInt(hexStr, 16).',
      'Return decimal number.'
    ],
    starterCode: 'function parseHexString(hexStr) {\n  // your code here\n}',
    solution: 'function parseHexString(hexStr) {\n  return Number.parseInt(hexStr, 16);\n}',
    skeletonHint: 'function parseHexString(hexStr) {\n  return Number.parseInt(hexStr, ____);\n}',
    traceTable: {
      inputLabel: "hexStr = 'ff'",
      columns: ['hex', 'radix', 'decimal'],
      rows: [
        { hex: "'ff'", radix: 16, decimal: 255 }
      ]
    },
    patternTag: 'Hexadecimal Decoding',
    patternExplanation: 'Number.parseInt with radix 16 parses base-16 hexadecimal representations.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: ['ff'], expected: 255, label: 'ff is 255' },
      { input: ['1A'], expected: 26, label: '1A is 26' },
      { input: ['10'], expected: 16, label: '10 in hex is 16' },
      { input: ['0'], expected: 0, label: 'hex 0' }
    ]
  },
  {
    id: 'numbers-to-string-radix',
    title: 'Number.prototype.toString: Decimal to Binary',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'numberToBinary',
    description: 'Given non-negative integer num, convert it to a binary string representation using num.toString(2).',
    whatShouldHappen: [
      'Call num.toString(2).',
      'Return binary string.'
    ],
    starterCode: 'function numberToBinary(num) {\n  // your code here\n}',
    solution: 'function numberToBinary(num) {\n  return num.toString(2);\n}',
    skeletonHint: 'function numberToBinary(num) {\n  return num.toString(____);\n}',
    traceTable: {
      inputLabel: 'num = 11',
      columns: ['decimal', 'radix', 'binary string'],
      rows: [
        { decimal: 11, radix: 2, 'binary string': "'1011'" }
      ]
    },
    patternTag: 'Radix Encoding',
    patternExplanation: 'num.toString(radix) converts integer numbers into string representations in base 2 through 36.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [11], expected: '1011', label: '11 to binary' },
      { input: [15], expected: '1111', label: '15 to binary' },
      { input: [0], expected: '0', label: 'zero to binary' },
      { input: [8], expected: '1000', label: '8 to binary' }
    ]
  },
  {
    id: 'numbers-parse-float-currency',
    title: 'Number.parseFloat: Parse Currency Price',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'parsePriceString',
    description: 'Given a price string like "$19.99" or "49.50 USD", strip non-numeric prefix characters and parse it into a floating-point number using Number.parseFloat.',
    whatShouldHappen: [
      "Remove non-digits and non-dots from start using priceStr.replace(/^[^0-9.]+/, '').",
      'Return Number.parseFloat(cleaned).',
      'If isNaN, return 0.'
    ],
    starterCode: 'function parsePriceString(priceStr) {\n  // your code here\n}',
    solution: "function parsePriceString(priceStr) {\n  const cleaned = priceStr.replace(/^[^0-9.]+/, '');\n  const val = Number.parseFloat(cleaned);\n  return Number.isNaN(val) ? 0 : val;\n}",
    skeletonHint: "function parsePriceString(priceStr) {\n  const cleaned = priceStr.replace(/^[^0-9.]+/, '');\n  return Number.____(cleaned);\n}",
    traceTable: {
      inputLabel: "priceStr = '$19.99'",
      columns: ['cleaned', 'Number.parseFloat'],
      rows: [
        { cleaned: "'19.99'", 'Number.parseFloat': 19.99 }
      ]
    },
    patternTag: 'Float Deserialization',
    patternExplanation: 'Number.parseFloat parses decimal numbers up to the first invalid non-numeric character.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: ['$19.99'], expected: 19.99, label: 'parse $19.99' },
      { input: ['€49.50'], expected: 49.5, label: 'parse €49.50' },
      { input: ['100'], expected: 100, label: 'plain integer' },
      { input: ['invalid'], expected: 0, label: 'invalid returns 0' }
    ]
  },
  {
    id: 'numbers-integer-to-hex',
    title: 'Number.prototype.toString: Decimal to Hexadecimal',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'numberToHex',
    description: 'Given a non-negative integer num, return its lowercase hexadecimal string representation using num.toString(16).',
    whatShouldHappen: [
      'Call num.toString(16).',
      'Return hex string.'
    ],
    starterCode: 'function numberToHex(num) {\n  // your code here\n}',
    solution: 'function numberToHex(num) {\n  return num.toString(16);\n}',
    skeletonHint: 'function numberToHex(num) {\n  return num.toString(____);\n}',
    traceTable: {
      inputLabel: 'num = 255',
      columns: ['num', 'toString(16)'],
      rows: [
        { num: 255, 'toString(16)': "'ff'" }
      ]
    },
    patternTag: 'Hexadecimal Encoding',
    patternExplanation: 'num.toString(16) produces lowercase hexadecimal representations (0-9, a-f).',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [255], expected: 'ff', label: '255 is ff' },
      { input: [26], expected: '1a', label: '26 is 1a' },
      { input: [16], expected: '10', label: '16 is 10' },
      { input: [0], expected: '0', label: 'zero' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 6: Validation & Precision (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'numbers-is-integer',
    title: 'Number.isInteger: Filter Integer Elements',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'filterIntegers',
    description: 'Given an array mixedList containing numbers and floats, use mixedList.filter(Number.isInteger) to return only the whole integers.',
    whatShouldHappen: [
      'Call mixedList.filter(Number.isInteger).',
      'Return array of integers.'
    ],
    starterCode: 'function filterIntegers(mixedList) {\n  // your code here\n}',
    solution: 'function filterIntegers(mixedList) {\n  return mixedList.filter(Number.isInteger);\n}',
    skeletonHint: 'function filterIntegers(mixedList) {\n  return mixedList.filter(Number.____);\n}',
    traceTable: {
      inputLabel: 'mixedList = [1, 2.5, 3, 4.0]',
      columns: ['item', 'Number.isInteger', 'kept?'],
      rows: [
        { item: 1, 'Number.isInteger': 'true', 'kept?': 'yes' },
        { item: 2.5, 'Number.isInteger': 'false', 'kept?': 'no' },
        { item: 3, 'Number.isInteger': 'true', 'kept?': 'yes' },
        { item: 4.0, 'Number.isInteger': 'true', 'kept?': 'yes' }
      ]
    },
    patternTag: 'Integer Discrimination',
    patternExplanation: 'Number.isInteger() verifies that a value is of type number and has zero fractional component.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2.5, 3, 4.0]], expected: [1, 3, 4], label: 'filter out 2.5' },
      { input: [[0.1, 0.2]], expected: [], label: 'all floats' },
      { input: [[-5, -10]], expected: [-5, -10], label: 'negative integers' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'numbers-is-nan-check',
    title: 'Number.isNaN: Filter Valid Parsed Numbers',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'parseValidNumbers',
    description: 'Given an array of strings strArr, convert each item to a number using Number(s), and return an array containing only the valid numbers using .filter(n => !Number.isNaN(n)).',
    whatShouldHappen: [
      'Map strings to numbers: strArr.map(s => Number(s)).',
      'Filter out NaN: .filter(n => !Number.isNaN(n)).',
      'Return sanitized number array.'
    ],
    starterCode: 'function parseValidNumbers(strArr) {\n  // your code here\n}',
    solution: 'function parseValidNumbers(strArr) {\n  return strArr.map(s => Number(s)).filter(n => !Number.isNaN(n));\n}',
    skeletonHint: 'function parseValidNumbers(strArr) {\n  return strArr.map(s => Number(s)).filter(n => !Number.____(n));\n}',
    traceTable: {
      inputLabel: "strArr = ['10', 'abc', '25']",
      columns: ['s', 'Number(s)', 'isNaN?', 'kept?'],
      rows: [
        { s: "'10'", 'Number(s)': 10, 'isNaN?': 'false', 'kept?': 'yes' },
        { s: "'abc'", 'Number(s)': 'NaN', 'isNaN?': 'true', 'kept?': 'no' },
        { s: "'25'", 'Number(s)': 25, 'isNaN?': 'false', 'kept?': 'yes' }
      ]
    },
    patternTag: 'NaN Sanitization',
    patternExplanation: 'Number.isNaN() strictly verifies NaN without the faulty coercion of the global isNaN function.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [['10', 'abc', '25', 'xyz']], expected: [10, 25], label: 'removes unparseable strings' },
      { input: [['hello', 'world']], expected: [], label: 'all unparseable' },
      { input: [['42', '100']], expected: [42, 100], label: 'all valid' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'numbers-is-finite',
    title: 'Number.isFinite: Verify Safe Division',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isDivisionFinite',
    description: 'Given a numerator and denominator, divide numerator by denominator and return whether the result is a finite number using Number.isFinite(numerator / denominator).',
    whatShouldHappen: [
      'Call Number.isFinite(numerator / denominator).',
      'Return boolean.'
    ],
    starterCode: 'function isDivisionFinite(numerator, denominator) {\n  // your code here\n}',
    solution: 'function isDivisionFinite(numerator, denominator) {\n  return Number.isFinite(numerator / denominator);\n}',
    skeletonHint: 'function isDivisionFinite(numerator, denominator) {\n  return Number.____(numerator / denominator);\n}',
    traceTable: {
      inputLabel: 'numerator = 10, denominator = 2',
      columns: ['numerator / denominator', 'Number.isFinite'],
      rows: [
        { 'numerator / denominator': 5, 'Number.isFinite': 'true' }
      ]
    },
    patternTag: 'Finite Verification',
    patternExplanation: 'Number.isFinite() rejects Infinity, -Infinity, and NaN without coercing non-numbers.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [10, 2], expected: true, label: 'safe division is finite' },
      { input: [10, 0], expected: false, label: 'division by zero yields Infinity' },
      { input: [-5, 0], expected: false, label: 'negative division by zero yields -Infinity' },
      { input: [0, 0], expected: false, label: 'zero divided by zero yields NaN' }
    ]
  },
  {
    id: 'numbers-safe-integer',
    title: 'Number.isSafeInteger: Precision Boundary Check',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isWithinSafeRange',
    description: 'Given number num, use Number.isSafeInteger(num) to check if it falls within the IEEE-754 double precision exact integer range [-(2^53 - 1), 2^53 - 1].',
    whatShouldHappen: [
      'Call Number.isSafeInteger(num).',
      'Return boolean.'
    ],
    starterCode: 'function isWithinSafeRange(num) {\n  // your code here\n}',
    solution: 'function isWithinSafeRange(num) {\n  return Number.isSafeInteger(num);\n}',
    skeletonHint: 'function isWithinSafeRange(num) {\n  return Number.____(num);\n}',
    traceTable: {
      inputLabel: 'num = 9007199254740991',
      columns: ['num', 'Number.isSafeInteger'],
      rows: [
        { num: 'Number.MAX_SAFE_INTEGER', 'Number.isSafeInteger': 'true' }
      ]
    },
    patternTag: 'Safe Integer Bounds',
    patternExplanation: 'Number.isSafeInteger() guards against 64-bit floating-point precision truncation for large integers.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [9007199254740991], expected: true, label: 'MAX_SAFE_INTEGER is safe' },
      { input: [9007199254740992], expected: false, label: 'exceeds MAX_SAFE_INTEGER' },
      { input: [42], expected: true, label: 'small integer is safe' },
      { input: [3.14], expected: false, label: 'float is not safe integer' }
    ]
  },
  {
    id: 'numbers-safe-divide',
    title: 'Arithmetic Operator: Safe Division Guard',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'safeDivision',
    description: 'Given numbers a and b, return a / b if b !== 0. If b === 0, return null to prevent Infinity/division by zero.',
    whatShouldHappen: [
      'If b === 0 return null.',
      'Return a / b.'
    ],
    starterCode: 'function safeDivision(a, b) {\n  // your code here\n}',
    solution: 'function safeDivision(a, b) {\n  if (b === 0) return null;\n  return a / b;\n}',
    skeletonHint: 'function safeDivision(a, b) {\n  if (b === ____) return null;\n  return a / b;\n}',
    traceTable: {
      inputLabel: 'a = 10, b = 2',
      columns: ['b === 0?', 'division quotient'],
      rows: [
        { 'b === 0?': 'false', 'division quotient': 5 }
      ]
    },
    patternTag: 'Division By Zero Guard',
    patternExplanation: 'Guarding divisor b === 0 prevents unhandled Infinity or NaN propagation in calculations.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [10, 2], expected: 5, label: '10 / 2 is 5' },
      { input: [10, 0], expected: null, label: 'division by zero returns null' },
      { input: [0, 5], expected: 0, label: 'zero divided by 5' },
      { input: [-6, 3], expected: -2, label: 'negative numerator' }
    ]
  }
];

module.exports = { mathNumberMethodsProblems };
