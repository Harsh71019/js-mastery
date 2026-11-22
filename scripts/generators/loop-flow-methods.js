// -------------------------------------------------------------
// Loop & Flow Methods (10 problems)
// Sub-Set 1: While / Do-While State Algorithms (5 problems)
// Sub-Set 2: Complex Operators & Control Flow in Loops (5 problems)
// -------------------------------------------------------------

const loopFlowMethodsProblems = [
  // -------------------------------------------------------------
  // Sub-Set 1: While / Do-While State Algorithms (5 problems)
  // -------------------------------------------------------------
  {
    id: 'basic-loops-gcd',
    title: 'Greatest Common Divisor (Euclidean)',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'findGCD',
    description: 'Calculate the greatest common divisor (GCD) of two non-zero positive integers `a` and `b` using the Euclidean algorithm and a while loop with the remainder operator `%`.',
    whatShouldHappen: [
      'While remainder b is not 0, store b in a temp variable',
      'Set b = a % b',
      'Set a = temp',
      'Return a when loop completes'
    ],
    starterCode: `function findGCD(a, b) {
  // Return the greatest common divisor of a and b using while loop and %
}
`,
    solution: `function findGCD(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
`,
    skeletonHint: `function findGCD(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
    traceTable: {
      inputLabel: 'a = 12, b = 8',
      columns: ['Step', 'a', 'b', 'a % b'],
      rows: [
        ['1', '12', '8', '4'],
        ['2', '8', '4', '0'],
        ['3', '4', '0', '-']
      ]
    },
    patternTag: 'while-loop',
    patternExplanation: 'The Euclidean algorithm repeatedly computes remainders until b is 0, leaving the GCD in a.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [12, 8], expected: 4, label: 'gcd of 12 and 8' },
      { input: [54, 24], expected: 6, label: 'gcd of 54 and 24' },
      { input: [17, 13], expected: 1, label: 'coprime numbers' },
      { input: [100, 25], expected: 25, label: 'factor multiple' }
    ]
  },
  {
    id: 'basic-loops-dec-to-bin',
    title: 'Convert Decimal to Binary with Loop',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'toBinaryString',
    description: 'Convert a non-negative integer `n` into its binary string representation using a while loop with `% 2` and `Math.floor(n / 2)`. For 0, return `"0"`.',
    whatShouldHappen: [
      'If n is 0, return "0"',
      'Loop while num > 0: prepend (num % 2) to binary string',
      'Divide num by 2 using Math.floor',
      'Return the binary string'
    ],
    starterCode: `function toBinaryString(n) {
  // Convert non-negative integer n to binary string using a while loop
}
`,
    solution: `function toBinaryString(n) {
  if (n === 0) return '0';
  let bin = '';
  let num = n;
  while (num > 0) {
    bin = (num % 2) + bin;
    num = Math.floor(num / 2);
  }
  return bin;
}
`,
    skeletonHint: `function toBinaryString(n) {
  if (n === 0) return '0';
  let bin = '';
  let num = n;
  while (num > 0) {
    bin = (num % 2) + bin;
    num = Math.floor(num / 2);
  }
  return bin;
}`,
    traceTable: {
      inputLabel: 'n = 5',
      columns: ['num', 'num % 2', 'bin', 'new num'],
      rows: [
        ['5', '1', '"1"', '2'],
        ['2', '0', '"01"', '1'],
        ['1', '1', '"101"', '0']
      ]
    },
    patternTag: 'while-loop',
    patternExplanation: 'Repeatedly extracting the least significant bit with % 2 and shifting right by dividing by 2 generates the binary representation.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [0], expected: '0', label: 'zero' },
      { input: [5], expected: '101', label: 'five' },
      { input: [10], expected: '1010', label: 'ten' },
      { input: [1], expected: '1', label: 'one' },
      { input: [16], expected: '10000', label: 'sixteen' }
    ]
  },
  {
    id: 'basic-loops-prime-factor-count',
    title: 'Count Prime Factors',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'countPrimeFactors',
    description: 'Count the total number of prime factors (with multiplicity) of an integer `n` (`n >= 2`) using nested while/for loops and `%`.',
    whatShouldHappen: [
      'Initialize count = 0, divisor d = 2',
      'While d * d <= num: while num % d === 0, increment count and num = Math.floor(num / d)',
      'Increment d',
      'If num > 1, increment count for the remaining prime factor',
      'Return count'
    ],
    starterCode: `function countPrimeFactors(n) {
  // Count prime factors with multiplicity using loops
}
`,
    solution: `function countPrimeFactors(n) {
  let count = 0;
  let d = 2;
  let num = n;
  while (d * d <= num) {
    while (num % d === 0) {
      count++;
      num = Math.floor(num / d);
    }
    d++;
  }
  if (num > 1) count++;
  return count;
}
`,
    skeletonHint: `function countPrimeFactors(n) {
  let count = 0;
  let d = 2;
  let num = n;
  while (d * d <= num) {
    while (num % d === 0) {
      count++;
      num = Math.floor(num / d);
    }
    d++;
  }
  if (num > 1) count++;
  return count;
}`,
    traceTable: {
      inputLabel: 'n = 12',
      columns: ['d', 'num', 'num % d', 'count'],
      rows: [
        ['2', '12', '0', '1 (num->6)'],
        ['2', '6', '0', '2 (num->3)'],
        ['3', '3 (d*d>num)', '-', '2'],
        ['End', '3 > 1', '-', '3']
      ]
    },
    patternTag: 'while-loop',
    patternExplanation: 'Factoring out each divisor as long as it divides evenly factors the number in O(sqrt(n)) time.',
    estimatedMinutes: 6,
    status: 'published',
    tests: [
      { input: [12], expected: 3, label: '12 has 2, 2, 3' },
      { input: [7], expected: 1, label: '7 is prime' },
      { input: [36], expected: 4, label: '36 has 2, 2, 3, 3' },
      { input: [2], expected: 1, label: '2 is prime' }
    ]
  },
  {
    id: 'basic-loops-reverse-digits',
    title: 'Reverse Integer Digits',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'reverseDigits',
    description: 'Reverse the digits of a non-negative integer `n` purely mathematically using a while loop, `% 10`, and `Math.floor(n / 10)`. Do not convert to string.',
    whatShouldHappen: [
      'Initialize rev = 0, num = n',
      'While num > 0: rev = rev * 10 + (num % 10)',
      'num = Math.floor(num / 10)',
      'Return rev'
    ],
    starterCode: `function reverseDigits(n) {
  // Mathematically reverse digits of non-negative integer n
}
`,
    solution: `function reverseDigits(n) {
  let rev = 0;
  let num = n;
  while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return rev;
}
`,
    skeletonHint: `function reverseDigits(n) {
  let rev = 0;
  let num = n;
  while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return rev;
}`,
    traceTable: {
      inputLabel: 'n = 1234',
      columns: ['num', 'num % 10', 'rev', 'new num'],
      rows: [
        ['1234', '4', '4', '123'],
        ['123', '3', '43', '12'],
        ['12', '2', '432', '1'],
        ['1', '1', '4321', '0']
      ]
    },
    patternTag: 'while-loop',
    patternExplanation: 'Peeling off the last digit with % 10 and pushing it into rev by multiplying by 10 reverses any integer mathematically.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [1234], expected: 4321, label: 'four digits' },
      { input: [50], expected: 5, label: 'trailing zero drops' },
      { input: [7], expected: 7, label: 'single digit' },
      { input: [1200], expected: 21, label: 'multiple trailing zeros' }
    ]
  },
  {
    id: 'basic-loops-is-number-palindrome',
    title: 'Numeric Palindrome Check',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'isNumericPalindrome',
    description: 'Check whether a non-negative integer `n` is a palindrome (reads the same backwards as forwards) using arithmetic loop operations.',
    whatShouldHappen: [
      'If n < 0, return false',
      'If n < 10, return true',
      'Compute the reversed number using a while loop and arithmetic',
      'Return whether rev === n'
    ],
    starterCode: `function isNumericPalindrome(n) {
  // Check if non-negative integer n is a palindrome without string conversion
}
`,
    solution: `function isNumericPalindrome(n) {
  if (n < 0) return false;
  if (n >= 0 && n < 10) return true;
  let rev = 0;
  let num = n;
  while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return rev === n;
}
`,
    skeletonHint: `function isNumericPalindrome(n) {
  if (n < 0) return false;
  if (n < 10) return true;
  let rev = 0;
  let num = n;
  while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return rev === n;
}`,
    traceTable: {
      inputLabel: 'n = 121',
      columns: ['num', 'num % 10', 'rev'],
      rows: [
        ['121', '1', '1'],
        ['12', '2', '12'],
        ['1', '1', '121']
      ]
    },
    patternTag: 'while-loop',
    patternExplanation: 'Comparing the mathematically reversed number to the original number tests for palindromic symmetry.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [121], expected: true, label: '121 is palindrome' },
      { input: [123], expected: false, label: '123 is not palindrome' },
      { input: [7], expected: true, label: 'single digit is palindrome' },
      { input: [1221], expected: true, label: 'even length palindrome' },
      { input: [10], expected: false, label: '10 is not palindrome' }
    ]
  },

  // -------------------------------------------------------------
  // Sub-Set 2: Operators & Control Flow in Loops (5 problems)
  // -------------------------------------------------------------
  {
    id: 'basic-loops-comma-dual-pointer',
    title: 'Two Pointers with Comma Operator',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'reverseInPlaceCopy',
    description: 'Reverse an array into a new array by using two pointers `i` and `j` in a single for loop header utilizing the JavaScript comma operator (`for (let i = 0, j = arr.length - 1; i < arr.length; i++, j--)`).',
    whatShouldHappen: [
      'Create a new array of length arr.length',
      'Use a for loop header with two variables i and j separated by comma: for (let i = 0, j = arr.length - 1; i < arr.length; i++, j--)',
      'Assign res[i] = arr[j]',
      'Return res'
    ],
    starterCode: `function reverseInPlaceCopy(arr) {
  // Reverse arr using two pointers in a single for loop header with comma operator
}
`,
    solution: `function reverseInPlaceCopy(arr) {
  const res = new Array(arr.length);
  for (let i = 0, j = arr.length - 1; i < arr.length; i++, j--) {
    res[i] = arr[j];
  }
  return res;
}
`,
    skeletonHint: `function reverseInPlaceCopy(arr) {
  const res = new Array(arr.length);
  for (let i = 0, j = arr.length - 1; i < arr.length; i++, j--) {
    res[i] = arr[j];
  }
  return res;
}`,
    traceTable: {
      inputLabel: 'arr = [1, 2, 3]',
      columns: ['i', 'j', 'res[i]'],
      rows: [
        ['0', '2', '3'],
        ['1', '1', '2'],
        ['2', '0', '1']
      ]
    },
    patternTag: 'basic-loops',
    patternExplanation: 'The comma operator in the loop initialization and update clause allows managing multiple index variables simultaneously.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, 4]], expected: [4, 3, 2, 1], label: 'four elements' },
      { input: [['a', 'b', 'c']], expected: ['c', 'b', 'a'], label: 'strings' },
      { input: [[42]], expected: [42], label: 'single element' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'basic-loops-logical-or-assign',
    title: 'Word Frequency with Logical OR Assignment',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'countWordsWithOrAssign',
    description: 'Build a word frequency counter object from an array of words using a for...of loop and the logical OR assignment operator `counts[word] ||= 0; counts[word]++;`.',
    whatShouldHappen: [
      'Initialize an empty object counts = {}',
      'Iterate through words with for...of',
      'Use counts[word] ||= 0 to set to 0 if falsy, then increment',
      'Return counts'
    ],
    starterCode: `function countWordsWithOrAssign(words) {
  // Count word frequencies using ||= operator
}
`,
    solution: `function countWordsWithOrAssign(words) {
  const counts = {};
  for (const word of words) {
    counts[word] ||= 0;
    counts[word]++;
  }
  return counts;
}
`,
    skeletonHint: `function countWordsWithOrAssign(words) {
  const counts = {};
  for (const word of words) {
    counts[word] ||= 0;
    counts[word]++;
  }
  return counts;
}`,
    traceTable: {
      inputLabel: "['cat', 'dog', 'cat']",
      columns: ['word', 'counts[word] before', 'counts[word] after'],
      rows: [
        ['cat', 'undefined -> 0', '1'],
        ['dog', 'undefined -> 0', '1'],
        ['cat', '1', '2']
      ]
    },
    patternTag: 'basic-loops',
    patternExplanation: 'Logical OR assignment (a ||= b) assigns b to a only if a is falsy, initializing missing keys cleanly.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['apple', 'banana', 'apple']], expected: { apple: 2, banana: 1 }, label: 'repeated words' },
      { input: [['cat', 'cat', 'cat']], expected: { cat: 3 }, label: 'all identical' },
      { input: [[]], expected: {}, label: 'empty list' },
      { input: [['a', 'b', 'c']], expected: { a: 1, b: 1, c: 1 }, label: 'all unique' }
    ]
  },
  {
    id: 'basic-loops-logical-and-assign',
    title: 'Strict Validity Pass with Logical AND Assignment',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'allConditionsPass',
    description: 'Given an array of numeric test scores, iterate through them with a for...of loop and update a boolean status `let valid = true;` using the logical AND assignment operator `valid &&= (score >= minThreshold);`. Return the final boolean.',
    whatShouldHappen: [
      'Initialize valid = true',
      'Iterate over scores with for...of',
      'Apply valid &&= (score >= minThreshold)',
      'Return valid'
    ],
    starterCode: `function allConditionsPass(scores, minThreshold = 50) {
  // Validate all scores >= minThreshold using &&= operator in loop
}
`,
    solution: `function allConditionsPass(scores, minThreshold = 50) {
  let valid = true;
  for (const score of scores) {
    valid &&= (score >= minThreshold);
  }
  return valid;
}
`,
    skeletonHint: `function allConditionsPass(scores, minThreshold = 50) {
  let valid = true;
  for (const score of scores) {
    valid &&= (score >= minThreshold);
  }
  return valid;
}`,
    traceTable: {
      inputLabel: 'scores = [60, 45, 80], min = 50',
      columns: ['score', 'score >= 50', 'valid'],
      rows: [
        ['60', 'true', 'true'],
        ['45', 'false', 'false'],
        ['80', 'true', 'false']
      ]
    },
    patternTag: 'basic-loops',
    patternExplanation: 'Logical AND assignment (a &&= b) only evaluates and keeps truthy if both operands are truthy, acting as an accumulator guard.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[60, 75, 80], 50], expected: true, label: 'all above 50' },
      { input: [[60, 45, 90], 50], expected: false, label: 'one below 50' },
      { input: [[], 50], expected: true, label: 'empty scores' },
      { input: [[10, 20], 30], expected: false, label: 'all below' }
    ]
  },
  {
    id: 'basic-loops-nullish-assign',
    title: 'Default Config Merge with Nullish Assignment',
    category: 'basic-loops',
    difficulty: 'Beginner',
    functionName: 'applyDefaultSettings',
    description: 'Given an options object and an array of default [key, defaultValue] pairs, iterate through the defaults and apply them to options using the nullish coalescing assignment operator `opts[key] ??= defaultValue`. Return the modified options object.',
    whatShouldHappen: [
      'Create a shallow copy of options: const res = { ...options }',
      'Iterate through defaults pairs with for...of',
      'Assign res[key] ??= defaultValue',
      'Return res'
    ],
    starterCode: `function applyDefaultSettings(options, defaults) {
  // Apply defaults using ??= operator in a loop
}
`,
    solution: `function applyDefaultSettings(options, defaults) {
  const res = { ...options };
  for (const [key, val] of defaults) {
    res[key] ??= val;
  }
  return res;
}
`,
    skeletonHint: `function applyDefaultSettings(options, defaults) {
  const res = { ...options };
  for (const [key, val] of defaults) {
    res[key] ??= val;
  }
  return res;
}`,
    traceTable: {
      inputLabel: "opts = { theme: 'dark', timeout: null }, defaults = [['timeout', 3000]]",
      columns: ['key', 'val', 'res[key] before', 'res[key] after'],
      rows: [
        ['timeout', '3000', 'null', '3000']
      ]
    },
    patternTag: 'basic-loops',
    patternExplanation: 'Nullish coalescing assignment (a ??= b) only assigns when a is null or undefined, preserving falsy values like 0, false, and empty string.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ theme: 'dark', timeout: null }, [['theme', 'light'], ['timeout', 3000], ['retries', 3]]], expected: { theme: 'dark', timeout: 3000, retries: 3 }, label: 'preserves dark, replaces null timeout' },
      { input: [{}, [['port', 8080], ['host', 'localhost']]], expected: { port: 8080, host: 'localhost' }, label: 'empty options' },
      { input: [{ count: 0 }, [['count', 10], ['name', 'test']]], expected: { count: 0, name: 'test' }, label: 'preserves 0' },
      { input: [{ active: false }, [['active', true]]], expected: { active: false }, label: 'preserves false' }
    ]
  },
  {
    id: 'basic-loops-labeled-break-search',
    title: 'Find Target in 2D Matrix with Labeled Break',
    category: 'basic-loops',
    difficulty: 'Easy',
    functionName: 'findInMatrix',
    description: 'Given a 2D matrix (array of arrays) and a target value, find the [row, col] coordinates of its first occurrence using nested for loops with a labeled break statement (`search: for (...)`). If not found, return [-1, -1].',
    whatShouldHappen: [
      'Initialize result = [-1, -1]',
      'Label outer loop: outer: for (let r = 0; r < matrix.length; r++)',
      'Inner loop through columns: if matrix[r][c] === target, set result = [r, c] and break outer',
      'Return result'
    ],
    starterCode: `function findInMatrix(matrix, target) {
  // Search 2D matrix and break early out of both loops using a label
}
`,
    solution: `function findInMatrix(matrix, target) {
  let result = [-1, -1];
  outer: for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === target) {
        result = [r, c];
        break outer;
      }
    }
  }
  return result;
}
`,
    skeletonHint: `function findInMatrix(matrix, target) {
  let result = [-1, -1];
  outer: for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === target) {
        result = [r, c];
        break outer;
      }
    }
  }
  return result;
}`,
    traceTable: {
      inputLabel: 'matrix = [[1, 2], [3, 4]], target = 3',
      columns: ['r', 'c', 'matrix[r][c]', 'action'],
      rows: [
        ['0', '0', '1', 'continue'],
        ['0', '1', '2', 'continue'],
        ['1', '0', '3', 'match -> break outer']
      ]
    },
    patternTag: 'basic-loops',
    patternExplanation: 'A labeled break statement terminates the outer loop immediately without needing additional boolean flag variables.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[[1, 2], [3, 4]], 3], expected: [1, 0], label: 'found in second row' },
      { input: [[[10, 20], [30, 40]], 99], expected: [-1, -1], label: 'not found' },
      { input: [[[5, 5], [5, 5]], 5], expected: [0, 0], label: 'first match at 0, 0' },
      { input: [[[], [1]], 1], expected: [1, 0], label: 'empty row handled' }
    ]
  }
];

module.exports = { loopFlowMethodsProblems };
