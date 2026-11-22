// scripts/generators/map-set-methods.js
// 30 well-tested simple/easy problems covering JavaScript Map and Set methods

const mapSetMethodsProblems = [
  // -------------------------------------------------------------------------
  // Sub-Set 1: Set Fundamentals (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-set-add-chain',
    title: 'Set: Construct and Verify Size',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'createSetFromElements',
    description: 'Given an array arr, construct a Set and return its unique element count using set.size.',
    whatShouldHappen: [
      'Call const set = new Set(arr).',
      'Return set.size.'
    ],
    starterCode: 'function createSetFromElements(arr) {\n  // your code here\n}',
    solution: 'function createSetFromElements(arr) {\n  return new Set(arr).size;\n}',
    skeletonHint: 'function createSetFromElements(arr) {\n  return new Set(arr).____;\n}',
    traceTable: {
      inputLabel: 'arr = [1, 2, 2, 3]',
      columns: ['arr', 'new Set(arr)', 'size'],
      rows: [
        { arr: '[1, 2, 2, 3]', 'new Set(arr)': 'Set(3) {1, 2, 3}', size: 3 }
      ]
    },
    patternTag: 'Set Cardinality',
    patternExplanation: 'Set automatically deduplicates input collections; .size returns the number of distinct elements.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2, 2, 3]], expected: 3, label: 'one duplicate number' },
      { input: [['a', 'b', 'c']], expected: 3, label: 'distinct strings' },
      { input: [[5, 5, 5, 5]], expected: 1, label: 'all identical' },
      { input: [[]], expected: 0, label: 'empty array' }
    ]
  },
  {
    id: 'maps-and-sets-set-has-check',
    title: 'Set.has: Check All Targets Present',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'hasAllTargets',
    description: 'Given an array sourceList and an array targets, convert sourceList to a Set and return true if every item in targets is present in the set.',
    whatShouldHappen: [
      'Create const set = new Set(sourceList).',
      'Check targets.every(t => set.has(t)).',
      'Return boolean.'
    ],
    starterCode: 'function hasAllTargets(sourceList, targets) {\n  // your code here\n}',
    solution: 'function hasAllTargets(sourceList, targets) {\n  const set = new Set(sourceList);\n  return targets.every(t => set.has(t));\n}',
    skeletonHint: 'function hasAllTargets(sourceList, targets) {\n  const set = new Set(sourceList);\n  return targets.every(t => set.____(t));\n}',
    traceTable: {
      inputLabel: 'source = [1, 2, 3, 4], targets = [2, 4]',
      columns: ['target', 'set.has(target)', 'action'],
      rows: [
        { target: 2, 'set.has(target)': 'true', action: 'continue' },
        { target: 4, 'set.has(target)': 'true', action: 'return true' }
      ]
    },
    patternTag: 'Set Membership Verification',
    patternExplanation: 'Using Set.prototype.has() within .every() checks multi-element inclusion in linear O(N + M) time.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2, 3, 4], [2, 4]], expected: true, label: 'all targets present' },
      { input: [[1, 2, 3], [2, 5]], expected: false, label: '5 is missing' },
      { input: [['a', 'b'], []], expected: true, label: 'empty targets' },
      { input: [[], ['a']], expected: false, label: 'empty source' }
    ]
  },
  {
    id: 'maps-and-sets-set-delete-item',
    title: 'Set.delete: Remove Element from Set',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'removeElementFromSet',
    description: 'Given an array arr and a value toDelete, construct a Set, delete toDelete using set.delete(toDelete), and return the remaining elements as an array.',
    whatShouldHappen: [
      'Create const set = new Set(arr).',
      'Call set.delete(toDelete).',
      'Return Array.from(set).'
    ],
    starterCode: 'function removeElementFromSet(arr, toDelete) {\n  // your code here\n}',
    solution: 'function removeElementFromSet(arr, toDelete) {\n  const set = new Set(arr);\n  set.delete(toDelete);\n  return Array.from(set);\n}',
    skeletonHint: 'function removeElementFromSet(arr, toDelete) {\n  const set = new Set(arr);\n  set.____(toDelete);\n  return Array.from(set);\n}',
    traceTable: {
      inputLabel: "arr = ['a', 'b', 'c'], toDelete = 'b'",
      columns: ['set before', 'delete', 'set after'],
      rows: [
        { 'set before': "{'a', 'b', 'c'}", delete: 'delete b', 'set after': "{'a', 'c'}" }
      ]
    },
    patternTag: 'Set Element Removal',
    patternExplanation: 'Set.prototype.delete() deletes a specified key in O(1) time and returns whether the element was present.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [['a', 'b', 'c'], 'b'], expected: ['a', 'c'], label: 'remove middle element' },
      { input: [[1, 2, 3], 1], expected: [2, 3], label: 'remove first element' },
      { input: [[10, 20], 99], expected: [10, 20], label: 'element not in set' },
      { input: [[], 'x'], expected: [], label: 'empty set' }
    ]
  },
  {
    id: 'maps-and-sets-set-size-dedup',
    title: 'Set: Count Unique Strings',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'countUniqueStrings',
    description: 'Given an array of strings words, return the count of distinct strings ignoring case by converting each word to lowercase before adding to Set.',
    whatShouldHappen: [
      'Map words to lowercase: lower = words.map(w => w.toLowerCase()).',
      'Return new Set(lower).size.'
    ],
    starterCode: 'function countUniqueStrings(words) {\n  // your code here\n}',
    solution: 'function countUniqueStrings(words) {\n  return new Set(words.map(w => w.toLowerCase())).size;\n}',
    skeletonHint: 'function countUniqueStrings(words) {\n  return new Set(words.map(w => w.____())).size;\n}',
    traceTable: {
      inputLabel: "words = ['Hello', 'hello', 'world']",
      columns: ['word', 'lowercase', 'set size'],
      rows: [
        { word: 'Hello', lowercase: 'hello', 'set size': 1 },
        { word: 'hello', lowercase: 'hello', 'set size': 1 },
        { word: 'world', lowercase: 'world', 'set size': 2 }
      ]
    },
    patternTag: 'Normalized Deduplication',
    patternExplanation: 'Transforming elements before insertion into a Set ensures case-insensitive uniqueness.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [['Hello', 'hello', 'world']], expected: 2, label: 'case duplicate' },
      { input: [['a', 'B', 'c']], expected: 3, label: 'distinct letters' },
      { input: [['test', 'TEST', 'Test']], expected: 1, label: 'three cases of same word' },
      { input: [[]], expected: 0, label: 'empty array' }
    ]
  },
  {
    id: 'maps-and-sets-set-to-array',
    title: 'Set: Fast Array Deduplication',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'deduplicateArray',
    description: 'Given an array arr containing duplicate elements, return an array of unique elements in first-seen order using [...new Set(arr)].',
    whatShouldHappen: [
      'Call [...new Set(arr)].',
      'Return unique array.'
    ],
    starterCode: 'function deduplicateArray(arr) {\n  // your code here\n}',
    solution: 'function deduplicateArray(arr) {\n  return [...new Set(arr)];\n}',
    skeletonHint: 'function deduplicateArray(arr) {\n  return [...new ____(arr)];\n}',
    traceTable: {
      inputLabel: 'arr = [1, 2, 1, 3, 2]',
      columns: ['input', 'unique output'],
      rows: [
        { input: '[1, 2, 1, 3, 2]', 'unique output': '[1, 2, 3]' }
      ]
    },
    patternTag: 'Idiomatic Deduplication',
    patternExplanation: '[...new Set(arr)] is the idiomatic O(N) deduplication idiom in modern JavaScript.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2, 1, 3, 2]], expected: [1, 2, 3], label: 'deduplicate numbers' },
      { input: [['a', 'b', 'a']], expected: ['a', 'b'], label: 'deduplicate strings' },
      { input: [[10]], expected: [10], label: 'single element' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 2: Set Mathematical Relations (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-is-subset',
    title: 'Set: Check if Subset of Another',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'isSubset',
    description: 'Given two arrays subArr and superArr, return true if every element of subArr is contained in superArr using a Set.',
    whatShouldHappen: [
      'Create superSet = new Set(superArr).',
      'Check subArr.every(item => superSet.has(item)).',
      'Return boolean.'
    ],
    starterCode: 'function isSubset(subArr, superArr) {\n  // your code here\n}',
    solution: 'function isSubset(subArr, superArr) {\n  const superSet = new Set(superArr);\n  return subArr.every(x => superSet.has(x));\n}',
    skeletonHint: 'function isSubset(subArr, superArr) {\n  const superSet = new Set(superArr);\n  return subArr.every(x => superSet.____(x));\n}',
    traceTable: {
      inputLabel: 'sub = [1, 2], super = [1, 2, 3]',
      columns: ['sub element', 'superSet.has?', 'valid?'],
      rows: [
        { 'sub element': 1, 'superSet.has?': 'true', 'valid?': 'yes' },
        { 'sub element': 2, 'superSet.has?': 'true', 'valid?': 'yes' }
      ]
    },
    patternTag: 'Subset Relation',
    patternExplanation: 'A set A is a subset of B if every member of A is contained in B.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2], [1, 2, 3]], expected: true, label: 'proper subset' },
      { input: [[1, 4], [1, 2, 3]], expected: false, label: 'element not in superset' },
      { input: [[], [1, 2]], expected: true, label: 'empty set is subset of all' },
      { input: [[1, 2], [1, 2]], expected: true, label: 'identical sets' }
    ]
  },
  {
    id: 'maps-and-sets-is-superset',
    title: 'Set: Check if Superset of Another',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'isSuperset',
    description: 'Given superArr and subArr, return true if superArr contains all elements of subArr.',
    whatShouldHappen: [
      'Create superSet = new Set(superArr).',
      'Return subArr.every(x => superSet.has(x)).'
    ],
    starterCode: 'function isSuperset(superArr, subArr) {\n  // your code here\n}',
    solution: 'function isSuperset(superArr, subArr) {\n  const superSet = new Set(superArr);\n  return subArr.every(x => superSet.has(x));\n}',
    skeletonHint: 'function isSuperset(superArr, subArr) {\n  const superSet = new Set(____);\n  return subArr.every(x => superSet.has(x));\n}',
    traceTable: {
      inputLabel: 'super = [1, 2, 3], sub = [2, 3]',
      columns: ['sub element', 'in super?'],
      rows: [
        { 'sub element': 2, 'in super?': 'true' },
        { 'sub element': 3, 'in super?': 'true' }
      ]
    },
    patternTag: 'Superset Relation',
    patternExplanation: 'A set B is a superset of A if B includes all elements of A.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2, 3], [2, 3]], expected: true, label: 'valid superset' },
      { input: [[1, 2], [1, 2, 3]], expected: false, label: 'sub is larger' },
      { input: [['a', 'b'], ['a']], expected: true, label: 'strings superset' },
      { input: [[], []], expected: true, label: 'both empty' }
    ]
  },
  {
    id: 'maps-and-sets-are-disjoint',
    title: 'Set: Check if Two Sets are Disjoint',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'areSetsDisjoint',
    description: 'Given two arrays arr1 and arr2, return true if they share no common elements (disjoint sets), otherwise false.',
    whatShouldHappen: [
      'Create set1 = new Set(arr1).',
      'Check !arr2.some(x => set1.has(x)).',
      'Return boolean.'
    ],
    starterCode: 'function areSetsDisjoint(arr1, arr2) {\n  // your code here\n}',
    solution: 'function areSetsDisjoint(arr1, arr2) {\n  const set1 = new Set(arr1);\n  return !arr2.some(x => set1.has(x));\n}',
    skeletonHint: 'function areSetsDisjoint(arr1, arr2) {\n  const set1 = new Set(arr1);\n  return !arr2.some(x => set1.____(x));\n}',
    traceTable: {
      inputLabel: 'arr1 = [1, 2], arr2 = [3, 4]',
      columns: ['arr2 item', 'in set1?', 'disjoint?'],
      rows: [
        { 'arr2 item': 3, 'in set1?': 'false', 'disjoint?': 'true' },
        { 'arr2 item': 4, 'in set1?': 'false', 'disjoint?': 'true' }
      ]
    },
    patternTag: 'Disjoint Verification',
    patternExplanation: 'Sets are disjoint when their intersection is empty, verified by checking if no member of one exists in the other.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1, 2], [3, 4]], expected: true, label: 'no overlap' },
      { input: [[1, 2], [2, 3]], expected: false, label: 'shares 2' },
      { input: [['a'], ['b']], expected: true, label: 'strings disjoint' },
      { input: [[], [1, 2]], expected: true, label: 'empty array disjoint with any' }
    ]
  },
  {
    id: 'maps-and-sets-union-three',
    title: 'Set: Union of Three Arrays',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'unionOfThreeArrays',
    description: 'Given three arrays arr1, arr2, and arr3, return an array of all distinct elements appearing across any of the three arrays.',
    whatShouldHappen: [
      'Call [...new Set([...arr1, ...arr2, ...arr3])].',
      'Return unique union array.'
    ],
    starterCode: 'function unionOfThreeArrays(arr1, arr2, arr3) {\n  // your code here\n}',
    solution: 'function unionOfThreeArrays(arr1, arr2, arr3) {\n  return [...new Set([...arr1, ...arr2, ...arr3])];\n}',
    skeletonHint: 'function unionOfThreeArrays(arr1, arr2, arr3) {\n  return [...new Set([...arr1, ...____, ...____])];\n}',
    traceTable: {
      inputLabel: 'arr1 = [1], arr2 = [2], arr3 = [1, 3]',
      columns: ['combined', 'Set deduplicated'],
      rows: [
        { combined: '[1, 2, 1, 3]', 'Set deduplicated': '[1, 2, 3]' }
      ]
    },
    patternTag: 'Multi-Set Union',
    patternExplanation: 'Spreading multiple arrays into a single Set constructor computes the combined union cleanly.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[1], [2], [1, 3]], expected: [1, 2, 3], label: 'union of three arrays' },
      { input: [['a', 'b'], ['b', 'c'], ['c', 'd']], expected: ['a', 'b', 'c', 'd'], label: 'strings union' },
      { input: [[1, 1], [1], [1]], expected: [1], label: 'all identical' },
      { input: [[], [], []], expected: [], label: 'all empty' }
    ]
  },
  {
    id: 'maps-and-sets-intersection-three',
    title: 'Set: Intersection of Three Arrays',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'intersectionOfThree',
    description: 'Given three arrays arr1, arr2, and arr3, return an array of elements that appear in all three arrays without duplicates.',
    whatShouldHappen: [
      'Create set2 = new Set(arr2) and set3 = new Set(arr3).',
      'Filter new Set(arr1) keeping items where set2.has(x) && set3.has(x).',
      'Return matching array.'
    ],
    starterCode: 'function intersectionOfThree(arr1, arr2, arr3) {\n  // your code here\n}',
    solution: 'function intersectionOfThree(arr1, arr2, arr3) {\n  const set2 = new Set(arr2);\n  const set3 = new Set(arr3);\n  return [...new Set(arr1)].filter(x => set2.has(x) && set3.has(x));\n}',
    skeletonHint: 'function intersectionOfThree(arr1, arr2, arr3) {\n  const set2 = new Set(arr2);\n  const set3 = new Set(arr3);\n  return [...new Set(arr1)].filter(x => set2.has(x) && set3.____(x));\n}',
    traceTable: {
      inputLabel: 'arr1 = [1, 2, 3], arr2 = [2, 3, 4], arr3 = [3, 4, 5]',
      columns: ['val in arr1', 'in arr2?', 'in arr3?', 'in all 3?'],
      rows: [
        { 'val in arr1': 1, 'in arr2?': 'false', 'in arr3?': 'false', 'in all 3?': 'no' },
        { 'val in arr1': 2, 'in arr2?': 'true', 'in arr3?': 'false', 'in all 3?': 'no' },
        { 'val in arr1': 3, 'in arr2?': 'true', 'in arr3?': 'true', 'in all 3?': 'yes' }
      ]
    },
    patternTag: 'Multi-Set Intersection',
    patternExplanation: 'Checking element presence across multiple Sets with logical AND computes multi-set intersections.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[1, 2, 3], [2, 3, 4], [3, 4, 5]], expected: [3], label: 'only 3 in all three' },
      { input: [['a', 'b'], ['b'], ['b', 'c']], expected: ['b'], label: 'letter b common' },
      { input: [[1, 2], [3, 4], [5, 6]], expected: [], label: 'no common element' },
      { input: [[1, 1], [1], [1]], expected: [1], label: 'deduplicated common element' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 3: Map Core Operations (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-map-set-get',
    title: 'Map.get: Key Lookup with Default',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'mapGetOrDefault',
    description: 'Given an array of [key, value] pairs, construct a Map and return map.get(targetKey) if present, otherwise return defaultVal.',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Return map.has(targetKey) ? map.get(targetKey) : defaultVal.'
    ],
    starterCode: 'function mapGetOrDefault(pairs, targetKey, defaultVal) {\n  // your code here\n}',
    solution: 'function mapGetOrDefault(pairs, targetKey, defaultVal) {\n  const map = new Map(pairs);\n  return map.has(targetKey) ? map.get(targetKey) : defaultVal;\n}',
    skeletonHint: 'function mapGetOrDefault(pairs, targetKey, defaultVal) {\n  const map = new Map(pairs);\n  return map.has(targetKey) ? map.____(targetKey) : defaultVal;\n}',
    traceTable: {
      inputLabel: "pairs = [['user', 'Alice']], targetKey = 'user', defaultVal = 'Guest'",
      columns: ['has target?', 'value returned'],
      rows: [
        { 'has target?': 'true', 'value returned': "'Alice'" }
      ]
    },
    patternTag: 'Map Lookup with Fallback',
    patternExplanation: 'Using map.has() before map.get() safely distinguishes stored undefined/null values from absent keys.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['user', 'Alice']], 'user', 'Guest'], expected: 'Alice', label: 'key found' },
      { input: [[['user', 'Alice']], 'role', 'Guest'], expected: 'Guest', label: 'key missing, returns default' },
      { input: [[['count', 0]], 'count', 10], expected: 0, label: 'zero value preserved' },
      { input: [[], 'any', 'fallback'], expected: 'fallback', label: 'empty map' }
    ]
  },
  {
    id: 'maps-and-sets-map-has-key',
    title: 'Map.has: Verify Key Existence',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'mapHasKey',
    description: 'Given an array of [key, value] pairs, construct a Map and use map.has(targetKey) to check whether the key exists.',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Return map.has(targetKey).'
    ],
    starterCode: 'function mapHasKey(pairs, targetKey) {\n  // your code here\n}',
    solution: 'function mapHasKey(pairs, targetKey) {\n  return new Map(pairs).has(targetKey);\n}',
    skeletonHint: 'function mapHasKey(pairs, targetKey) {\n  return new Map(pairs).____(targetKey);\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1]], targetKey = 'a'",
      columns: ['targetKey', 'map.has'],
      rows: [
        { targetKey: "'a'", 'map.has': 'true' }
      ]
    },
    patternTag: 'Map Key Verification',
    patternExplanation: 'Map.prototype.has() returns boolean indicating whether a key exists in the Map.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2]], 'a'], expected: true, label: 'key a exists' },
      { input: [[['a', 1]], 'c'], expected: false, label: 'key c absent' },
      { input: [[['x', undefined]], 'x'], expected: true, label: 'undefined value key exists' },
      { input: [[], 'test'], expected: false, label: 'empty map' }
    ]
  },
  {
    id: 'maps-and-sets-map-delete-key',
    title: 'Map.delete: Remove Entry from Map',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'deleteKeyFromMap',
    description: 'Given an array of [key, value] pairs, construct a Map, delete the entry with keyToDelete using map.delete(keyToDelete), and return Array.from(map.entries()).',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Call map.delete(keyToDelete).',
      'Return Array.from(map.entries()).'
    ],
    starterCode: 'function deleteKeyFromMap(pairs, keyToDelete) {\n  // your code here\n}',
    solution: 'function deleteKeyFromMap(pairs, keyToDelete) {\n  const map = new Map(pairs);\n  map.delete(keyToDelete);\n  return Array.from(map.entries());\n}',
    skeletonHint: 'function deleteKeyFromMap(pairs, keyToDelete) {\n  const map = new Map(pairs);\n  map.____(keyToDelete);\n  return Array.from(map.entries());\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['b', 2]], keyToDelete = 'a'",
      columns: ['delete key', 'remaining entries'],
      rows: [
        { 'delete key': "'a'", 'remaining entries': "[['b', 2]]" }
      ]
    },
    patternTag: 'Map Entry Deletion',
    patternExplanation: 'Map.prototype.delete() removes an element by key, returning true if found.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2]], 'a'], expected: [['b', 2]], label: 'delete key a' },
      { input: [[['x', 10]], 'y'], expected: [['x', 10]], label: 'key not present' },
      { input: [[['first', 1]], 'first'], expected: [], label: 'delete only key' },
      { input: [[], 'test'], expected: [], label: 'empty map' }
    ]
  },
  {
    id: 'maps-and-sets-map-size',
    title: 'Map.size: Total Unique Keys',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'getMapSize',
    description: 'Given an array of [key, value] pairs, construct a Map and return the number of distinct keys using map.size.',
    whatShouldHappen: [
      'Call const map = new Map(pairs).',
      'Return map.size.'
    ],
    starterCode: 'function getMapSize(pairs) {\n  // your code here\n}',
    solution: 'function getMapSize(pairs) {\n  return new Map(pairs).size;\n}',
    skeletonHint: 'function getMapSize(pairs) {\n  return new Map(pairs).____;\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['a', 2], ['b', 3]]",
      columns: ['pairs', 'distinct keys count'],
      rows: [
        { pairs: "2 'a' keys, 1 'b'", 'distinct keys count': 2 }
      ]
    },
    patternTag: 'Map Size Cardinality',
    patternExplanation: 'Map.prototype.size accurately tracks active unique keys, automatically collapsing duplicate keys.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['a', 2], ['b', 3]]], expected: 2, label: 'duplicate a key' },
      { input: [[['x', 1], ['y', 2]]], expected: 2, label: 'two distinct keys' },
      { input: [[]], expected: 0, label: 'empty pairs' },
      { input: [[['k', 1], ['k', 2], ['k', 3]]], expected: 1, label: 'triplicate key' }
    ]
  },
  {
    id: 'maps-and-sets-map-clear-repopulate',
    title: 'Map.clear: Reset and Reload Map',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'resetMapWithNewPairs',
    description: 'Given initialPairs and newPairs, construct a Map with initialPairs, call map.clear(), populate it with newPairs, and return Array.from(map.entries()).',
    whatShouldHappen: [
      'Create map = new Map(initialPairs).',
      'Call map.clear().',
      'For each [k, v] in newPairs, map.set(k, v).',
      'Return Array.from(map.entries()).'
    ],
    starterCode: 'function resetMapWithNewPairs(initialPairs, newPairs) {\n  // your code here\n}',
    solution: 'function resetMapWithNewPairs(initialPairs, newPairs) {\n  const map = new Map(initialPairs);\n  map.clear();\n  for (const [k, v] of newPairs) {\n    map.set(k, v);\n  }\n  return Array.from(map.entries());\n}',
    skeletonHint: 'function resetMapWithNewPairs(initialPairs, newPairs) {\n  const map = new Map(initialPairs);\n  map.____();\n  for (const [k, v] of newPairs) {\n    map.set(k, v);\n  }\n  return Array.from(map.entries());\n}',
    traceTable: {
      inputLabel: "initial = [['old', 1]], new = [['new', 2]]",
      columns: ['after clear', 'after repopulate'],
      rows: [
        { 'after clear': 'size 0', 'after repopulate': "[['new', 2]]" }
      ]
    },
    patternTag: 'Map State Flush',
    patternExplanation: 'Map.prototype.clear() flushes all entries in constant time, resetting the map for fresh population.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[['old', 1]], [['new', 2]]], expected: [['new', 2]], label: 'clear and reload new' },
      { input: [[['a', 1]], []], expected: [], label: 'clear to empty' },
      { input: [[], [['x', 10]]], expected: [['x', 10]], label: 'empty initial' },
      { input: [[['a', 1], ['b', 2]], [['c', 3]]], expected: [['c', 3]], label: 'replace two with one' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 4: Map Iterators (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-map-keys-array',
    title: 'Map.keys: Collect All Map Keys',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'getMapKeysList',
    description: 'Given an array of [key, value] pairs, construct a Map and return an array of its keys using Array.from(map.keys()).',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Return Array.from(map.keys()).'
    ],
    starterCode: 'function getMapKeysList(pairs) {\n  // your code here\n}',
    solution: 'function getMapKeysList(pairs) {\n  return Array.from(new Map(pairs).keys());\n}',
    skeletonHint: 'function getMapKeysList(pairs) {\n  return Array.from(new Map(pairs).____());\n}',
    traceTable: {
      inputLabel: "pairs = [['name', 'Alice'], ['age', 30]]",
      columns: ['Map', 'keys array'],
      rows: [
        { Map: "{ 'name', 'age' }", 'keys array': "['name', 'age']" }
      ]
    },
    patternTag: 'Key Iterator Extraction',
    patternExplanation: 'Map.prototype.keys() returns an iterator over keys in insertion order.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['name', 'Alice'], ['age', 30]]], expected: ['name', 'age'], label: 'keys in insertion order' },
      { input: [[[1, 'a'], [2, 'b']]], expected: [1, 2], label: 'numeric keys' },
      { input: [[]], expected: [], label: 'empty map' },
      { input: [[['single', 100]]], expected: ['single'], label: 'one key' }
    ]
  },
  {
    id: 'maps-and-sets-map-values-array',
    title: 'Map.values: Collect All Map Values',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'getMapValuesList',
    description: 'Given an array of [key, value] pairs, construct a Map and return an array of its values using Array.from(map.values()).',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Return Array.from(map.values()).'
    ],
    starterCode: 'function getMapValuesList(pairs) {\n  // your code here\n}',
    solution: 'function getMapValuesList(pairs) {\n  return Array.from(new Map(pairs).values());\n}',
    skeletonHint: 'function getMapValuesList(pairs) {\n  return Array.from(new Map(pairs).____());\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 10], ['b', 20]]",
      columns: ['Map', 'values array'],
      rows: [
        { Map: 'Map(2)', 'values array': '[10, 20]' }
      ]
    },
    patternTag: 'Value Iterator Extraction',
    patternExplanation: 'Map.prototype.values() yields value elements without key descriptors.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 10], ['b', 20]]], expected: [10, 20], label: 'two values' },
      { input: [[['k1', 'x'], ['k2', 'y']]], expected: ['x', 'y'], label: 'string values' },
      { input: [[]], expected: [], label: 'empty map' },
      { input: [[['z', true]]], expected: [true], label: 'boolean value' }
    ]
  },
  {
    id: 'maps-and-sets-map-sum-values',
    title: 'Map.values: Sum All Numeric Values',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'sumMapNumericValues',
    description: 'Given an array of [key, value] pairs where values are numbers, construct a Map and iterate over map.values() to compute their sum.',
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Initialize sum = 0.',
      'For (const val of map.values()), sum += val.',
      'Return sum.'
    ],
    starterCode: 'function sumMapNumericValues(pairs) {\n  // your code here\n}',
    solution: 'function sumMapNumericValues(pairs) {\n  const map = new Map(pairs);\n  let sum = 0;\n  for (const val of map.values()) {\n    sum += val;\n  }\n  return sum;\n}',
    skeletonHint: 'function sumMapNumericValues(pairs) {\n  const map = new Map(pairs);\n  let sum = 0;\n  for (const val of map.____()) {\n    sum += val;\n  }\n  return sum;\n}',
    traceTable: {
      inputLabel: "pairs = [['apples', 5], ['oranges', 10]]",
      columns: ['val', 'sum'],
      rows: [
        { val: 5, sum: 5 },
        { val: 10, sum: 15 }
      ]
    },
    patternTag: 'Map Value Reduction',
    patternExplanation: 'Iterating map.values() directly computes metrics across values without processing unused keys.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['apples', 5], ['oranges', 10]]], expected: 15, label: 'sum two values' },
      { input: [[['a', -2], ['b', 7]]], expected: 5, label: 'negative values' },
      { input: [[]], expected: 0, label: 'empty map' },
      { input: [[['only', 42]]], expected: 42, label: 'single value' }
    ]
  },
  {
    id: 'maps-and-sets-map-format-entries',
    title: 'Map.entries: Format Key-Value Pairs',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'formatMapEntries',
    description: "Given an array of [key, value] pairs, construct a Map and return an array of strings formatted as 'key => value'.",
    whatShouldHappen: [
      'Create const map = new Map(pairs).',
      'Initialize result = [].',
      'For (const [k, v] of map.entries()), push `${k} => ${v}`.',
      'Return result.'
    ],
    starterCode: 'function formatMapEntries(pairs) {\n  // your code here\n}',
    solution: 'function formatMapEntries(pairs) {\n  const map = new Map(pairs);\n  const result = [];\n  for (const [k, v] of map.entries()) {\n    result.push(`${k} => ${v}`);\n  }\n  return result;\n}',
    skeletonHint: 'function formatMapEntries(pairs) {\n  const map = new Map(pairs);\n  const result = [];\n  for (const [k, v] of map.____()) {\n    result.push(`${k} => ${v}`);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['b', 2]]",
      columns: ['k', 'v', 'formatted string'],
      rows: [
        { k: 'a', v: 1, 'formatted string': "'a => 1'" },
        { k: 'b', v: 2, 'formatted string': "'b => 2'" }
      ]
    },
    patternTag: 'Entry Formatting',
    patternExplanation: 'Destructuring [k, v] in a for...of loop over map.entries() cleanly serializes Map state.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2]]], expected: ['a => 1', 'b => 2'], label: 'format two entries' },
      { input: [[['id', 100]]], expected: ['id => 100'], label: 'single entry' },
      { input: [[]], expected: [], label: 'empty map' },
      { input: [[['x', 'y'], ['z', 'w']]], expected: ['x => y', 'z => w'], label: 'string entries' }
    ]
  },
  {
    id: 'maps-and-sets-map-foreach-accumulator',
    title: 'Map.forEach: Count Elements by Threshold',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'countEntriesAboveThreshold',
    description: 'Given an array of [key, numericValue] pairs and threshold, construct a Map and use map.forEach((val, key) => ...) to count how many entries have val >= threshold.',
    whatShouldHappen: [
      'Create map = new Map(pairs).',
      'Initialize count = 0.',
      'Call map.forEach(val => { if (val >= threshold) count++; }).',
      'Return count.'
    ],
    starterCode: 'function countEntriesAboveThreshold(pairs, threshold) {\n  // your code here\n}',
    solution: 'function countEntriesAboveThreshold(pairs, threshold) {\n  const map = new Map(pairs);\n  let count = 0;\n  map.forEach((val) => {\n    if (val >= threshold) count++;\n  });\n  return count;\n}',
    skeletonHint: 'function countEntriesAboveThreshold(pairs, threshold) {\n  const map = new Map(pairs);\n  let count = 0;\n  map.forEach((val) => {\n    if (val >= ____) count++;\n  });\n  return count;\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 10], ['b', 5]], threshold = 10",
      columns: ['val', 'val >= 10', 'count'],
      rows: [
        { val: 10, 'val >= 10': 'true', count: 1 },
        { val: 5, 'val >= 10': 'false', count: 1 }
      ]
    },
    patternTag: 'Map Callback Iteration',
    patternExplanation: 'Map.prototype.forEach((value, key, map) => ...) provides callback iteration with value as the first parameter.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 10], ['b', 5], ['c', 20]], 10], expected: 2, label: 'two entries >= 10' },
      { input: [[['x', 1]], 5], expected: 0, label: 'none meet threshold' },
      { input: [[['p', 50]], 50], expected: 1, label: 'exact threshold' },
      { input: [[], 0], expected: 0, label: 'empty map' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 5: Map Conversions (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-map-from-object',
    title: 'Map: Convert Plain Object to Map Entries',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'objectToMapEntries',
    description: 'Given a plain object obj, construct a Map from Object.entries(obj) and return Array.from(map.entries()).',
    whatShouldHappen: [
      'Call const map = new Map(Object.entries(obj)).',
      'Return Array.from(map.entries()).'
    ],
    starterCode: 'function objectToMapEntries(obj) {\n  // your code here\n}',
    solution: 'function objectToMapEntries(obj) {\n  return Array.from(new Map(Object.entries(obj)).entries());\n}',
    skeletonHint: 'function objectToMapEntries(obj) {\n  return Array.from(new Map(Object.____(obj)).entries());\n}',
    traceTable: {
      inputLabel: "obj = { a: 1, b: 2 }",
      columns: ['Object.entries', 'Map entries'],
      rows: [
        { 'Object.entries': "[['a', 1], ['b', 2]]", 'Map entries': "[['a', 1], ['b', 2]]" }
      ]
    },
    patternTag: 'Object to Map Conversion',
    patternExplanation: 'Passing Object.entries(obj) to new Map() converts plain objects into Maps.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2 }], expected: [['a', 1], ['b', 2]], label: 'two properties to map' },
      { input: [{ name: 'Alice' }], expected: [['name', 'Alice']], label: 'single property' },
      { input: [{}], expected: [], label: 'empty object' },
      { input: [{ x: true, y: false }], expected: [['x', true], ['y', false]], label: 'booleans' }
    ]
  },
  {
    id: 'maps-and-sets-object-from-map',
    title: 'Object.fromEntries: Convert Map to Plain Object',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'mapToObjectPlain',
    description: 'Given an array of [key, value] pairs representing a Map, use Object.fromEntries(new Map(pairs)) to convert it to a plain object.',
    whatShouldHappen: [
      'Create map = new Map(pairs).',
      'Call Object.fromEntries(map).',
      'Return plain object.'
    ],
    starterCode: 'function mapToObjectPlain(pairs) {\n  // your code here\n}',
    solution: 'function mapToObjectPlain(pairs) {\n  return Object.fromEntries(new Map(pairs));\n}',
    skeletonHint: 'function mapToObjectPlain(pairs) {\n  return Object.____(new Map(pairs));\n}',
    traceTable: {
      inputLabel: "pairs = [['name', 'Bob'], ['role', 'dev']]",
      columns: ['Map', 'plain object'],
      rows: [
        { Map: 'Map(2)', 'plain object': "{ name: 'Bob', role: 'dev' }" }
      ]
    },
    patternTag: 'Map to Object Conversion',
    patternExplanation: 'Object.fromEntries(map) serializes a Map into a plain JavaScript object.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['name', 'Bob'], ['role', 'dev']]], expected: { name: 'Bob', role: 'dev' }, label: 'convert map to object' },
      { input: [[['count', 1]]], expected: { count: 1 }, label: 'single entry' },
      { input: [[]], expected: {}, label: 'empty pairs' },
      { input: [[['flag', false]]], expected: { flag: false }, label: 'boolean value' }
    ]
  },
  {
    id: 'maps-and-sets-invert-map',
    title: 'Map: Invert Keys and Values',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'invertMapPairs',
    description: 'Given an array of [key, value] pairs representing a Map with unique values, construct an inverted Map where values become keys and keys become values. Return Array.from(invertedMap.entries()).',
    whatShouldHappen: [
      'Create original map = new Map(pairs).',
      'Initialize invertedMap = new Map().',
      'For (const [k, v] of map), invertedMap.set(v, k).',
      'Return Array.from(invertedMap.entries()).'
    ],
    starterCode: 'function invertMapPairs(pairs) {\n  // your code here\n}',
    solution: 'function invertMapPairs(pairs) {\n  const map = new Map(pairs);\n  const inverted = new Map();\n  for (const [k, v] of map) {\n    inverted.set(v, k);\n  }\n  return Array.from(inverted.entries());\n}',
    skeletonHint: 'function invertMapPairs(pairs) {\n  const map = new Map(pairs);\n  const inverted = new Map();\n  for (const [k, v] of map) {\n    inverted.set(____, ____);\n  }\n  return Array.from(inverted.entries());\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['b', 2]]",
      columns: ['k', 'v', 'inverted entry'],
      rows: [
        { k: 'a', v: 1, 'inverted entry': '[1, a]' },
        { k: 'b', v: 2, 'inverted entry': '[2, b]' }
      ]
    },
    patternTag: 'Map Inversion',
    patternExplanation: 'Iterating Map entries and setting inverted.set(v, k) creates a bidirectional reverse mapping.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2]]], expected: [[1, 'a'], [2, 'b']], label: 'invert numbers' },
      { input: [[['first', 'second']]], expected: [['second', 'first']], label: 'invert strings' },
      { input: [[]], expected: [], label: 'empty pairs' },
      { input: [[['x', 10], ['y', 20]]], expected: [[10, 'x'], [20, 'y']], label: 'two pairs' }
    ]
  },
  {
    id: 'maps-and-sets-filter-map-by-key',
    title: 'Map: Filter Entries by Allowed Keys',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'filterMapByAllowedKeys',
    description: 'Given pairs and an array allowedKeys, construct a Map and return Array.from(map.entries()) containing only entries whose key exists in allowedKeys.',
    whatShouldHappen: [
      'Create allowedSet = new Set(allowedKeys).',
      'Create map = new Map(pairs).',
      'Initialize result = new Map().',
      'For (const [k, v] of map) if (allowedSet.has(k)) result.set(k, v).',
      'Return Array.from(result.entries()).'
    ],
    starterCode: 'function filterMapByAllowedKeys(pairs, allowedKeys) {\n  // your code here\n}',
    solution: 'function filterMapByAllowedKeys(pairs, allowedKeys) {\n  const allowedSet = new Set(allowedKeys);\n  const result = [];\n  for (const [k, v] of new Map(pairs)) {\n    if (allowedSet.has(k)) {\n      result.push([k, v]);\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function filterMapByAllowedKeys(pairs, allowedKeys) {\n  const allowedSet = new Set(allowedKeys);\n  const result = [];\n  for (const [k, v] of new Map(pairs)) {\n    if (allowedSet.____(k)) {\n      result.push([k, v]);\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['b', 2]], allowed = ['a']",
      columns: ['key', 'allowedSet.has?', 'kept?'],
      rows: [
        { key: 'a', 'allowedSet.has?': 'true', 'kept?': 'yes' },
        { key: 'b', 'allowedSet.has?': 'false', 'kept?': 'no' }
      ]
    },
    patternTag: 'Map Key Projection',
    patternExplanation: 'Filtering Map entries against an allowed key Set projects desired dimensions.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2], ['c', 3]], ['a', 'c']], expected: [['a', 1], ['c', 3]], label: 'keep a and c' },
      { input: [[['x', 10]], ['y']], expected: [], label: 'none allowed' },
      { input: [[], ['a']], expected: [], label: 'empty map' },
      { input: [[['k', 1]], ['k']], expected: [['k', 1]], label: 'keep single' }
    ]
  },
  {
    id: 'maps-and-sets-map-values-squared',
    title: 'Map: Square Numeric Values',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'squareMapValues',
    description: 'Given pairs where values are numbers, construct a Map and return Array.from(map.entries()) where each numeric value is squared (v ** 2).',
    whatShouldHappen: [
      'Create map = new Map(pairs).',
      'Initialize result = new Map().',
      'For (const [k, v] of map) result.set(k, v ** 2).',
      'Return Array.from(result.entries()).'
    ],
    starterCode: 'function squareMapValues(pairs) {\n  // your code here\n}',
    solution: 'function squareMapValues(pairs) {\n  const result = [];\n  for (const [k, v] of new Map(pairs)) {\n    result.push([k, v ** 2]);\n  }\n  return result;\n}',
    skeletonHint: 'function squareMapValues(pairs) {\n  const result = [];\n  for (const [k, v] of new Map(pairs)) {\n    result.push([k, v ** ____]);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 3], ['b', 4]]",
      columns: ['k', 'v', 'v ** 2', 'entry'],
      rows: [
        { k: 'a', v: 3, 'v ** 2': 9, entry: "['a', 9]" },
        { k: 'b', v: 4, 'v ** 2': 16, entry: "['b', 16]" }
      ]
    },
    patternTag: 'Map Value Transformation',
    patternExplanation: 'Iterating a Map and transforming the value into a new collection creates a mapped dataset.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 3], ['b', 4]]], expected: [['a', 9], ['b', 16]], label: 'square 3 and 4' },
      { input: [[['zero', 0], ['neg', -2]]], expected: [['zero', 0], ['neg', 4]], label: 'zero and negative' },
      { input: [[]], expected: [], label: 'empty pairs' },
      { input: [[['x', 1]]], expected: [['x', 1]], label: 'one squared is one' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 6: Advanced Grouping & Counting with Map (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'maps-and-sets-group-anagrams',
    title: 'Map: Group Words by Sorted Characters',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'groupAnagramsMap',
    description: "Given an array of strings words, group anagrams together into arrays using a Map keyed by sorted letters. Return Array.from(map.values()).",
    whatShouldHappen: [
      'Create map = new Map().',
      "For each word: const key = [...word].sort().join('').",
      'If (!map.has(key)) map.set(key, []).',
      'map.get(key).push(word).',
      'Return Array.from(map.values()).'
    ],
    starterCode: 'function groupAnagramsMap(words) {\n  // your code here\n}',
    solution: "function groupAnagramsMap(words) {\n  const map = new Map();\n  for (const w of words) {\n    const key = [...w].sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(w);\n  }\n  return Array.from(map.values());\n}",
    skeletonHint: "function groupAnagramsMap(words) {\n  const map = new Map();\n  for (const w of words) {\n    const key = [...w].sort().join('');\n    if (!map.has(key)) map.set(key, ____);\n    map.get(key).push(w);\n  }\n  return Array.from(map.values());\n}",
    traceTable: {
      inputLabel: "words = ['eat', 'tea', 'tan']",
      columns: ['word', 'sorted key', 'grouped map state'],
      rows: [
        { word: 'eat', 'sorted key': 'aet', 'grouped map state': "{ 'aet' => ['eat'] }" },
        { word: 'tea', 'sorted key': 'aet', 'grouped map state': "{ 'aet' => ['eat', 'tea'] }" },
        { word: 'tan', 'sorted key': 'ant', 'grouped map state': "{ 'aet' => ['eat', 'tea'], 'ant' => ['tan'] }" }
      ]
    },
    patternTag: 'Anagram Canonical Key Hashing',
    patternExplanation: 'Sorting the characters of words generates canonical hash keys for grouping anagrams in a Map.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [['eat', 'tea', 'tan', 'nat', 'bat']], expected: [['eat', 'tea'], ['tan', 'nat'], ['bat']], label: 'three anagram groups' },
      { input: [['a']], expected: [['a']], label: 'single char' },
      { input: [[]], expected: [], label: 'empty words' },
      { input: [['rat', 'tar', 'art']], expected: [['rat', 'tar', 'art']], label: 'all same anagrams' }
    ]
  },
  {
    id: 'maps-and-sets-memoize-with-map',
    title: 'Map: Cache Computation with Map',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'computeWithMapCache',
    description: 'Given an array of integer inputs, process each number n sequentially. Use an internal Map to cache computed squares: if cache has n, retrieve it; otherwise compute n * n and store in cache. Return the array of computed or cached squares.',
    whatShouldHappen: [
      'Initialize cache = new Map() and results = [].',
      'For each n in inputs:',
      '  if (!cache.has(n)) cache.set(n, n * n);',
      '  results.push(cache.get(n));',
      'Return results.'
    ],
    starterCode: 'function computeWithMapCache(inputs) {\n  // your code here\n}',
    solution: 'function computeWithMapCache(inputs) {\n  const cache = new Map();\n  const results = [];\n  for (const n of inputs) {\n    if (!cache.has(n)) {\n      cache.set(n, n * n);\n    }\n    results.push(cache.get(n));\n  }\n  return results;\n}',
    skeletonHint: 'function computeWithMapCache(inputs) {\n  const cache = new Map();\n  const results = [];\n  for (const n of inputs) {\n    if (!cache.has(n)) {\n      cache.set(n, ____);\n    }\n    results.push(cache.get(n));\n  }\n  return results;\n}',
    traceTable: {
      inputLabel: 'inputs = [2, 3, 2]',
      columns: ['n', 'cache hit?', 'computed/retrieved', 'cache size'],
      rows: [
        { n: 2, 'cache hit?': 'false (miss)', 'computed/retrieved': 4, 'cache size': 1 },
        { n: 3, 'cache hit?': 'false (miss)', 'computed/retrieved': 9, 'cache size': 2 },
        { n: 2, 'cache hit?': 'true (hit)', 'computed/retrieved': 4, 'cache size': 2 }
      ]
    },
    patternTag: 'Memoization Cache Pattern',
    patternExplanation: 'Using Map.has() and Map.get() caches expensive computation results to avoid redundant operations.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [[2, 3, 2]], expected: [4, 9, 4], label: 'cache hit on second 2' },
      { input: [[5]], expected: [25], label: 'single element' },
      { input: [[]], expected: [], label: 'empty inputs' },
      { input: [[0, 1, 0, 1]], expected: [0, 1, 0, 1], label: 'zero and one with repeats' }
    ]
  },
  {
    id: 'maps-and-sets-frequency-sort',
    title: 'Map: Sort Elements by Frequency',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'sortByFrequency',
    description: 'Given an array arr, count frequencies using a Map, and return a new array sorted by frequency descending (most frequent items first). If frequencies tie, preserve natural order.',
    whatShouldHappen: [
      'Build frequency map: map.set(x, (map.get(x) || 0) + 1).',
      'Sort [...arr] using (a, b) => map.get(b) - map.get(a).',
      'Return sorted array.'
    ],
    starterCode: 'function sortByFrequency(arr) {\n  // your code here\n}',
    solution: 'function sortByFrequency(arr) {\n  const freq = new Map();\n  for (const x of arr) freq.set(x, (freq.get(x) || 0) + 1);\n  return [...arr].sort((a, b) => freq.get(b) - freq.get(a));\n}',
    skeletonHint: 'function sortByFrequency(arr) {\n  const freq = new Map();\n  for (const x of arr) freq.set(x, (freq.get(x) || 0) + 1);\n  return [...arr].sort((a, b) => freq.get(____) - freq.get(____));\n}',
    traceTable: {
      inputLabel: 'arr = [1, 1, 2, 2, 2, 3]',
      columns: ['item', 'frequency in map', 'sorted order'],
      rows: [
        { item: 2, 'frequency in map': 3, 'sorted order': 'first (2, 2, 2)' },
        { item: 1, 'frequency in map': 2, 'sorted order': 'second (1, 1)' },
        { item: 3, 'frequency in map': 1, 'sorted order': 'last (3)' }
      ]
    },
    patternTag: 'Frequency Map Comparator',
    patternExplanation: 'Referencing a frequency Map inside an array sort comparator re-orders items by prevalence.',
    estimatedMinutes: 8,
    status: 'published',
    tests: [
      { input: [[1, 1, 2, 2, 2, 3]], expected: [2, 2, 2, 1, 1, 3], label: '2s appear 3 times, 1s twice, 3 once' },
      { input: [['a', 'b', 'b']], expected: ['b', 'b', 'a'], label: 'strings frequency sort' },
      { input: [[1, 2, 3]], expected: [1, 2, 3], label: 'all tie' },
      { input: [[]], expected: [], label: 'empty array' }
    ]
  },
  {
    id: 'maps-and-sets-first-unique-char',
    title: 'Map: Find First Non-Repeating Character',
    category: 'maps-and-sets',
    difficulty: 'Beginner',
    functionName: 'firstUniqueChar',
    description: 'Given a string str, use a Map to count character frequencies. Iterate through the string to return the first character with frequency 1. If none exists, return null.',
    whatShouldHappen: [
      'Build frequency Map: for (const c of str) map.set(c, (map.get(c) || 0) + 1).',
      'Iterate through str: if (map.get(c) === 1) return c.',
      'Return null if no unique character found.'
    ],
    starterCode: 'function firstUniqueChar(str) {\n  // your code here\n}',
    solution: 'function firstUniqueChar(str) {\n  const map = new Map();\n  for (const c of str) map.set(c, (map.get(c) || 0) + 1);\n  for (const c of str) {\n    if (map.get(c) === 1) return c;\n  }\n  return null;\n}',
    skeletonHint: 'function firstUniqueChar(str) {\n  const map = new Map();\n  for (const c of str) map.set(c, (map.get(c) || 0) + 1);\n  for (const c of str) {\n    if (map.get(c) === ____) return c;\n  }\n  return null;\n}',
    traceTable: {
      inputLabel: "str = 'swiss'",
      columns: ['char', 'count in map', 'is unique?'],
      rows: [
        { char: 's', 'count in map': 3, 'is unique?': 'no' },
        { char: 'w', 'count in map': 1, 'is unique?': 'yes (return w)' }
      ]
    },
    patternTag: 'Two-Pass Frequency Map',
    patternExplanation: 'First pass tallies counts in Map; second pass inspects keys in original order to pinpoint the first non-repeating element.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: ['swiss'], expected: 'w', label: 'first unique is w' },
      { input: ['leetcode'], expected: 'l', label: 'first unique is l' },
      { input: ['aabb'], expected: null, label: 'no unique characters' },
      { input: ['z'], expected: 'z', label: 'single character' }
    ]
  },
  {
    id: 'maps-and-sets-group-by-first-letter',
    title: 'Map: Group Words by First Letter',
    category: 'maps-and-sets',
    difficulty: 'Easy',
    functionName: 'groupByFirstLetter',
    description: "Given an array of strings words, group them into a Map where keys are the lowercase first letters and values are arrays of words starting with that letter. Return Array.from(map.entries()).",
    whatShouldHappen: [
      'Create map = new Map().',
      'For each word in words:',
      '  const letter = word[0].toLowerCase();',
      '  if (!map.has(letter)) map.set(letter, []);',
      '  map.get(letter).push(word);',
      'Return Array.from(map.entries()).'
    ],
    starterCode: 'function groupByFirstLetter(words) {\n  // your code here\n}',
    solution: 'function groupByFirstLetter(words) {\n  const map = new Map();\n  for (const w of words) {\n    if (!w) continue;\n    const letter = w[0].toLowerCase();\n    if (!map.has(letter)) map.set(letter, []);\n    map.get(letter).push(w);\n  }\n  return Array.from(map.entries());\n}',
    skeletonHint: 'function groupByFirstLetter(words) {\n  const map = new Map();\n  for (const w of words) {\n    const letter = w[0].toLowerCase();\n    if (!map.has(letter)) map.set(letter, ____);\n    map.get(letter).push(w);\n  }\n  return Array.from(map.entries());\n}',
    traceTable: {
      inputLabel: "words = ['Apple', 'ant', 'banana']",
      columns: ['word', 'first letter', 'map state'],
      rows: [
        { word: 'Apple', 'first letter': 'a', 'map state': "{ 'a' => ['Apple'] }" },
        { word: 'ant', 'first letter': 'a', 'map state': "{ 'a' => ['Apple', 'ant'] }" },
        { word: 'banana', 'first letter': 'b', 'map state': "{ 'a' => ['Apple', 'ant'], 'b' => ['banana'] }" }
      ]
    },
    patternTag: 'Map Key Bucket Grouping',
    patternExplanation: 'Using Map.has() and Map.get() groups collections into bucket arrays with clean key preservation.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['Apple', 'ant', 'banana']], expected: [['a', ['Apple', 'ant']], ['b', ['banana']]], label: 'group a and b' },
      { input: [['cat', 'car', 'dog']], expected: [['c', ['cat', 'car']], ['d', ['dog']]], label: 'group c and d' },
      { input: [['solo']], expected: [['s', ['solo']]], label: 'single word' },
      { input: [[]], expected: [], label: 'empty words' }
    ]
  }
];

module.exports = { mapSetMethodsProblems };
