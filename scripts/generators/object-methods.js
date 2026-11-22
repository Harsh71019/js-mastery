// scripts/generators/object-methods.js
// 30 well-tested simple/easy problems covering JavaScript Object methods

const objectMethodsProblems = [
  // -------------------------------------------------------------------------
  // Sub-Set 1: Property Introspection & Checks (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-has-own-property',
    title: 'Object.hasOwn: Check Direct Property',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'checkHasOwn',
    description: 'Given an object obj and a string key, use Object.hasOwn(obj, key) to return whether key is an own property of obj.',
    whatShouldHappen: [
      'Call Object.hasOwn(obj, key).',
      'Return boolean.'
    ],
    starterCode: 'function checkHasOwn(obj, key) {\n  // your code here\n}',
    solution: 'function checkHasOwn(obj, key) {\n  return Object.hasOwn(obj, key);\n}',
    skeletonHint: 'function checkHasOwn(obj, key) {\n  return Object.____(obj, key);\n}',
    traceTable: {
      inputLabel: "obj = { a: 1 }, key = 'a'",
      columns: ['obj', 'key', 'Object.hasOwn'],
      rows: [
        { obj: '{ a: 1 }', key: "'a'", 'Object.hasOwn': 'true' }
      ]
    },
    patternTag: 'Own Property Verification',
    patternExplanation: 'Object.hasOwn() is the modern replacement for Object.prototype.hasOwnProperty, safely handling objects without prototypes.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1 }, 'a'], expected: true, label: 'own property exists' },
      { input: [{ a: 1 }, 'b'], expected: false, label: 'property does not exist' },
      { input: [{}, 'toString'], expected: false, label: 'inherited property is not own' },
      { input: [{ x: null }, 'x'], expected: true, label: 'property exists with null value' }
    ]
  },
  {
    id: 'objects-key-in-operator',
    title: 'Object in Operator: Check Key Existence',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'checkKeyInObj',
    description: 'Given an object obj and a string key, use the in operator (key in obj) to check if key exists anywhere on the object or its prototype chain.',
    whatShouldHappen: [
      'Check key in obj.',
      'Return boolean.'
    ],
    starterCode: 'function checkKeyInObj(obj, key) {\n  // your code here\n}',
    solution: 'function checkKeyInObj(obj, key) {\n  return key in obj;\n}',
    skeletonHint: 'function checkKeyInObj(obj, key) {\n  return ____ in obj;\n}',
    traceTable: {
      inputLabel: "obj = { name: 'Alice' }, key = 'name'",
      columns: ['key', 'in obj?'],
      rows: [
        { key: "'name'", 'in obj?': 'true' }
      ]
    },
    patternTag: 'In Operator Membership',
    patternExplanation: 'The "in" operator verifies if a property exists in an object including its prototype chain.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ name: 'Alice' }, 'name'], expected: true, label: 'direct property' },
      { input: [{ name: 'Alice' }, 'age'], expected: false, label: 'absent property' },
      { input: [{}, 'toString'], expected: true, label: 'prototype property' },
      { input: [{ val: null }, 'val'], expected: true, label: 'null property exists' }
    ]
  },
  {
    id: 'objects-keys-count',
    title: 'Object.keys: Count Own Properties',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'countOwnProperties',
    description: 'Given an object obj, use Object.keys(obj).length to return the number of enumerable own properties.',
    whatShouldHappen: [
      'Call Object.keys(obj).length.',
      'Return count.'
    ],
    starterCode: 'function countOwnProperties(obj) {\n  // your code here\n}',
    solution: 'function countOwnProperties(obj) {\n  return Object.keys(obj).length;\n}',
    skeletonHint: 'function countOwnProperties(obj) {\n  return Object.____(obj).length;\n}',
    traceTable: {
      inputLabel: 'obj = { a: 1, b: 2, c: 3 }',
      columns: ['Object.keys', 'length'],
      rows: [
        { 'Object.keys': "['a', 'b', 'c']", length: 3 }
      ]
    },
    patternTag: 'Property Cardinality',
    patternExplanation: 'Object.keys() returns an array of an object own property names, whose length reflects the property count.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2, c: 3 }], expected: 3, label: 'three properties' },
      { input: [{ x: 10 }], expected: 1, label: 'one property' },
      { input: [{}], expected: 0, label: 'empty object' },
      { input: [{ p1: null, p2: 0 }], expected: 2, label: 'falsy values count' }
    ]
  },
  {
    id: 'objects-has-nested-key',
    title: 'Object: Check Truthy Property Value',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'hasTruthyProperty',
    description: 'Given an object obj and a string key, return true if key exists in obj and obj[key] is truthy, otherwise false.',
    whatShouldHappen: [
      'Check Boolean(obj && obj[key]).',
      'Return boolean.'
    ],
    starterCode: 'function hasTruthyProperty(obj, key) {\n  // your code here\n}',
    solution: 'function hasTruthyProperty(obj, key) {\n  return Boolean(obj && obj[key]);\n}',
    skeletonHint: 'function hasTruthyProperty(obj, key) {\n  return Boolean(obj && obj[____]);\n}',
    traceTable: {
      inputLabel: "obj = { active: true }, key = 'active'",
      columns: ['key', 'obj[key]', 'Boolean'],
      rows: [
        { key: "'active'", 'obj[key]': 'true', Boolean: 'true' }
      ]
    },
    patternTag: 'Truthy Guard Check',
    patternExplanation: 'Guarding object access with Boolean coercion verifies both existence and truthiness.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ active: true }, 'active'], expected: true, label: 'truthy boolean' },
      { input: [{ count: 0 }, 'count'], expected: false, label: 'zero is falsy' },
      { input: [{ name: 'Bob' }, 'age'], expected: false, label: 'missing key' },
      { input: [{ flag: false }, 'flag'], expected: false, label: 'false is falsy' }
    ]
  },
  {
    id: 'objects-is-empty-object',
    title: 'Object.keys: Check If Object Is Empty',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'isObjectEmpty',
    description: 'Given an object obj, use Object.keys(obj).length === 0 to return true if obj has no own properties, otherwise false.',
    whatShouldHappen: [
      'Call Object.keys(obj).length === 0.',
      'Return boolean.'
    ],
    starterCode: 'function isObjectEmpty(obj) {\n  // your code here\n}',
    solution: 'function isObjectEmpty(obj) {\n  return Object.keys(obj).length === 0;\n}',
    skeletonHint: 'function isObjectEmpty(obj) {\n  return Object.keys(obj).length === ____;\n}',
    traceTable: {
      inputLabel: 'obj = {}',
      columns: ['Object.keys(obj)', 'length === 0'],
      rows: [
        { 'Object.keys(obj)': '[]', 'length === 0': 'true' }
      ]
    },
    patternTag: 'Empty Dictionary Check',
    patternExplanation: 'Testing Object.keys(obj).length === 0 is the standard pattern for checking empty object literals.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{}], expected: true, label: 'empty object' },
      { input: [{ a: 1 }], expected: false, label: 'non-empty object' },
      { input: [{ key: null }], expected: false, label: 'key with null value is not empty' },
      { input: [{ x: 0, y: 0 }], expected: false, label: 'two properties' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 2: Object.fromEntries & Transformations (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-from-entries-pairs',
    title: 'Object.fromEntries: Convert Pairs to Object',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'pairsToObject',
    description: 'Given an array of [key, value] pairs, use Object.fromEntries(pairs) to construct and return an object.',
    whatShouldHappen: [
      'Call Object.fromEntries(pairs).',
      'Return resulting object.'
    ],
    starterCode: 'function pairsToObject(pairs) {\n  // your code here\n}',
    solution: 'function pairsToObject(pairs) {\n  return Object.fromEntries(pairs);\n}',
    skeletonHint: 'function pairsToObject(pairs) {\n  return Object.____(pairs);\n}',
    traceTable: {
      inputLabel: "pairs = [['a', 1], ['b', 2]]",
      columns: ['pairs', 'Object.fromEntries'],
      rows: [
        { pairs: "[['a', 1], ['b', 2]]", 'Object.fromEntries': '{ a: 1, b: 2 }' }
      ]
    },
    patternTag: 'Pair to Object Hydration',
    patternExplanation: 'Object.fromEntries() transforms an iterable of key-value pairs into a plain object.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[['a', 1], ['b', 2]]], expected: { a: 1, b: 2 }, label: 'two pairs' },
      { input: [[['name', 'Alice'], ['role', 'admin']]], expected: { name: 'Alice', role: 'admin' }, label: 'string values' },
      { input: [[]], expected: {}, label: 'empty pairs' },
      { input: [[['x', 10]]], expected: { x: 10 }, label: 'single pair' }
    ]
  },
  {
    id: 'objects-filter-entries-threshold',
    title: 'Object.fromEntries: Filter Properties by Minimum',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'filterPropertiesByMin',
    description: 'Given an object obj whose values are numbers and a minVal threshold, use Object.entries, .filter(), and Object.fromEntries to return a new object with values >= minVal.',
    whatShouldHappen: [
      'Convert obj to entries: Object.entries(obj).',
      'Filter where value >= minVal.',
      'Reassemble with Object.fromEntries().',
      'Return filtered object.'
    ],
    starterCode: 'function filterPropertiesByMin(obj, minVal) {\n  // your code here\n}',
    solution: 'function filterPropertiesByMin(obj, minVal) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([_, val]) => val >= minVal)\n  );\n}',
    skeletonHint: 'function filterPropertiesByMin(obj, minVal) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([_, val]) => val >= ____)\n  );\n}',
    traceTable: {
      inputLabel: 'obj = { a: 10, b: 5, c: 20 }, minVal = 10',
      columns: ['key', 'val', 'val >= 10', 'kept?'],
      rows: [
        { key: 'a', val: 10, 'val >= 10': 'true', 'kept?': 'yes' },
        { key: 'b', val: 5, 'val >= 10': 'false', 'kept?': 'no' },
        { key: 'c', val: 20, 'val >= 10': 'true', 'kept?': 'yes' }
      ]
    },
    patternTag: 'Entries Functional Pipeline',
    patternExplanation: 'The Object.entries -> filter/map -> Object.fromEntries pipeline allows using Array methods on objects.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 10, b: 5, c: 20 }, 10], expected: { a: 10, c: 20 }, label: 'filter values >= 10' },
      { input: [{ x: 1, y: 2 }, 5], expected: {}, label: 'none pass' },
      { input: [{ p: 100 }, 50], expected: { p: 100 }, label: 'one pass' },
      { input: [{}, 0], expected: {}, label: 'empty object' }
    ]
  },
  {
    id: 'objects-map-keys-uppercase',
    title: 'Object.fromEntries: Uppercase All Keys',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'upperCaseKeys',
    description: 'Given an object obj, return a new object where every property key is converted to uppercase using Object.entries and Object.fromEntries.',
    whatShouldHappen: [
      'Extract Object.entries(obj).',
      'Map [key, val] to [key.toUpperCase(), val].',
      'Convert back with Object.fromEntries.',
      'Return new object.'
    ],
    starterCode: 'function upperCaseKeys(obj) {\n  // your code here\n}',
    solution: 'function upperCaseKeys(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([key, val]) => [key.toUpperCase(), val])\n  );\n}',
    skeletonHint: 'function upperCaseKeys(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([key, val]) => [key.____(), val])\n  );\n}',
    traceTable: {
      inputLabel: "obj = { name: 'Bob', age: 30 }",
      columns: ['original key', 'uppercase key', 'result'],
      rows: [
        { 'original key': "'name'", 'uppercase key': "'NAME'", result: "NAME: 'Bob'" },
        { 'original key': "'age'", 'uppercase key': "'AGE'", result: 'AGE: 30' }
      ]
    },
    patternTag: 'Key Remapping',
    patternExplanation: 'Mapping the first element of [key, value] tuples transforms object property identifiers.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ name: 'Bob', age: 30 }], expected: { NAME: 'Bob', AGE: 30 }, label: 'two keys uppercased' },
      { input: [{ a: 1, b: 2 }], expected: { A: 1, B: 2 }, label: 'single letter keys' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ ALL: true }], expected: { ALL: true }, label: 'already uppercase' }
    ]
  },
  {
    id: 'objects-map-values-double',
    title: 'Object.fromEntries: Double Numeric Values',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'doubleNumericProps',
    description: 'Given an object obj, return a new object where every property whose value is a number is doubled (v * 2). Non-numbers remain unchanged.',
    whatShouldHappen: [
      'Extract Object.entries(obj).',
      'Map [k, v] to [k, typeof v === "number" ? v * 2 : v].',
      'Assemble with Object.fromEntries().',
      'Return new object.'
    ],
    starterCode: 'function doubleNumericProps(obj) {\n  // your code here\n}',
    solution: 'function doubleNumericProps(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, typeof v === "number" ? v * 2 : v])\n  );\n}',
    skeletonHint: 'function doubleNumericProps(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, typeof v === "number" ? v * ____ : v])\n  );\n}',
    traceTable: {
      inputLabel: "obj = { a: 5, label: 'x' }",
      columns: ['key', 'val', 'typeof', 'new val'],
      rows: [
        { key: 'a', val: 5, typeof: 'number', 'new val': 10 },
        { key: 'label', val: "'x'", typeof: 'string', 'new val': "'x'" }
      ]
    },
    patternTag: 'Conditional Value Mapping',
    patternExplanation: 'Checking typeof v === "number" selectively targets numeric values for transformation.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 5, b: 10 }], expected: { a: 10, b: 20 }, label: 'double numbers' },
      { input: [{ count: 3, label: 'tag' }], expected: { count: 6, label: 'tag' }, label: 'preserves string' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ zero: 0, neg: -4 }], expected: { zero: 0, neg: -8 }, label: 'zero and negative' }
    ]
  },
  {
    id: 'objects-invert-key-value',
    title: 'Object.fromEntries: Invert Keys and Values',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'invertObjectEntries',
    description: 'Given an object obj with unique primitive values, return a new object where each property key and value are swapped ([String(val), key]).',
    whatShouldHappen: [
      'Extract Object.entries(obj).',
      'Map [key, val] to [String(val), key].',
      'Convert back with Object.fromEntries().',
      'Return inverted object.'
    ],
    starterCode: 'function invertObjectEntries(obj) {\n  // your code here\n}',
    solution: 'function invertObjectEntries(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [String(v), k])\n  );\n}',
    skeletonHint: 'function invertObjectEntries(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [String(____), ____])\n  );\n}',
    traceTable: {
      inputLabel: "obj = { a: '1', b: '2' }",
      columns: ['original', 'inverted pair'],
      rows: [
        { original: "['a', '1']", 'inverted pair': "['1', 'a']" },
        { original: "['b', '2']", 'inverted pair': "['2', 'b']" }
      ]
    },
    patternTag: 'Object Inversion',
    patternExplanation: 'Swapping key and value in Object.entries enables reverse lookups from values back to keys.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2 }], expected: { '1': 'a', '2': 'b' }, label: 'invert numbers to strings' },
      { input: [{ front: 'back' }], expected: { back: 'front' }, label: 'invert strings' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ x: 'alpha', y: 'beta' }], expected: { alpha: 'x', beta: 'y' }, label: 'word inversion' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 3: Cloning, Merging & Defaults (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-assign-shallow-copy',
    title: 'Object.assign: Shallow Clone Object',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'shallowCloneObj',
    description: 'Given an object obj, use Object.assign({}, obj) to return a shallow copy that has a different object reference.',
    whatShouldHappen: [
      'Call Object.assign({}, obj).',
      'Return shallow copy.'
    ],
    starterCode: 'function shallowCloneObj(obj) {\n  // your code here\n}',
    solution: 'function shallowCloneObj(obj) {\n  return Object.assign({}, obj);\n}',
    skeletonHint: 'function shallowCloneObj(obj) {\n  return Object.assign({}, ____);\n}',
    traceTable: {
      inputLabel: 'obj = { x: 10, y: 20 }',
      columns: ['target', 'source', 'returned clone'],
      rows: [
        { target: '{}', source: '{ x: 10, y: 20 }', 'returned clone': '{ x: 10, y: 20 }' }
      ]
    },
    patternTag: 'Object Shallow Clone',
    patternExplanation: 'Object.assign with an empty object target ({}) produces an independent shallow copy.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ x: 10, y: 20 }], expected: { x: 10, y: 20 }, label: 'two properties cloned' },
      { input: [{ a: 'test' }], expected: { a: 'test' }, label: 'string value' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ n: null }], expected: { n: null }, label: 'null property' }
    ]
  },
  {
    id: 'objects-assign-merge-defaults',
    title: 'Object.assign: Apply Default Settings',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'applyDefaultSettings',
    description: 'Given userOptions and defaultOptions, use Object.assign({}, defaultOptions, userOptions) so user settings override defaults.',
    whatShouldHappen: [
      'Call Object.assign({}, defaultOptions, userOptions).',
      'Return merged options object.'
    ],
    starterCode: 'function applyDefaultSettings(userOptions, defaultOptions) {\n  // your code here\n}',
    solution: 'function applyDefaultSettings(userOptions, defaultOptions) {\n  return Object.assign({}, defaultOptions, userOptions);\n}',
    skeletonHint: 'function applyDefaultSettings(userOptions, defaultOptions) {\n  return Object.assign({}, ____, ____);\n}',
    traceTable: {
      inputLabel: "user = { theme: 'dark' }, defaults = { theme: 'light', zoom: 1 }",
      columns: ['defaults', 'user', 'merged result'],
      rows: [
        { defaults: "{ theme: 'light', zoom: 1 }", user: "{ theme: 'dark' }", 'merged result': "{ theme: 'dark', zoom: 1 }" }
      ]
    },
    patternTag: 'Defaults Override',
    patternExplanation: 'Later arguments in Object.assign override earlier ones, making it ideal for default configuration options.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ theme: 'dark' }, { theme: 'light', zoom: 1 }], expected: { theme: 'dark', zoom: 1 }, label: 'override theme keep zoom' },
      { input: [{}, { port: 8080 }], expected: { port: 8080 }, label: 'empty user options' },
      { input: [{ custom: true }, {}], expected: { custom: true }, label: 'empty defaults' },
      { input: [{}, {}], expected: {}, label: 'both empty' }
    ]
  },
  {
    id: 'objects-merge-three-objects',
    title: 'Object.assign: Merge Three Tiers of Config',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'mergeThreeConfigs',
    description: 'Given baseConfig, envConfig, and cliConfig, return a merged configuration object using Object.assign({}, baseConfig, envConfig, cliConfig) in order of precedence.',
    whatShouldHappen: [
      'Call Object.assign({}, baseConfig, envConfig, cliConfig).',
      'Return combined object.'
    ],
    starterCode: 'function mergeThreeConfigs(baseConfig, envConfig, cliConfig) {\n  // your code here\n}',
    solution: 'function mergeThreeConfigs(baseConfig, envConfig, cliConfig) {\n  return Object.assign({}, baseConfig, envConfig, cliConfig);\n}',
    skeletonHint: 'function mergeThreeConfigs(baseConfig, envConfig, cliConfig) {\n  return Object.assign({}, ____, ____, ____);\n}',
    traceTable: {
      inputLabel: 'base = { a: 1 }, env = { a: 2, b: 2 }, cli = { a: 3 }',
      columns: ['base', 'env', 'cli', 'result'],
      rows: [
        { base: 'a: 1', env: 'a: 2, b: 2', cli: 'a: 3', result: '{ a: 3, b: 2 }' }
      ]
    },
    patternTag: 'Multi-Source Merge',
    patternExplanation: 'Object.assign accepts variable source arguments, applying rightward precedence across cascading layers.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1 }, { a: 2, b: 2 }, { a: 3 }], expected: { a: 3, b: 2 }, label: 'cli overrides all' },
      { input: [{ host: 'localhost' }, { port: 3000 }, { debug: true }], expected: { host: 'localhost', port: 3000, debug: true }, label: 'non-overlapping configs' },
      { input: [{}, {}, { solo: 1 }], expected: { solo: 1 }, label: 'empty base and env' },
      { input: [{}, {}, {}], expected: {}, label: 'all empty' }
    ]
  },
  {
    id: 'objects-omit-keys',
    title: 'Object: Omit Specified Keys',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'omitKeys',
    description: 'Given an object obj and an array of keys keysToOmit, return a new object omitting all properties whose keys are included in keysToOmit.',
    whatShouldHappen: [
      'Convert keysToOmit into a Set for fast lookup.',
      'Iterate Object.entries(obj).',
      'Keep entries where !omitSet.has(key).',
      'Assemble with Object.fromEntries and return.'
    ],
    starterCode: 'function omitKeys(obj, keysToOmit) {\n  // your code here\n}',
    solution: 'function omitKeys(obj, keysToOmit) {\n  const omitSet = new Set(keysToOmit);\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => !omitSet.has(k))\n  );\n}',
    skeletonHint: 'function omitKeys(obj, keysToOmit) {\n  const omitSet = new Set(____);\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => !omitSet.____(k))\n  );\n}',
    traceTable: {
      inputLabel: "obj = { a: 1, b: 2, c: 3 }, keysToOmit = ['b']",
      columns: ['key', 'omitSet.has?', 'kept?'],
      rows: [
        { key: 'a', 'omitSet.has?': 'false', 'kept?': 'yes' },
        { key: 'b', 'omitSet.has?': 'true', 'kept?': 'no' },
        { key: 'c', 'omitSet.has?': 'false', 'kept?': 'yes' }
      ]
    },
    patternTag: 'Property Omission',
    patternExplanation: 'Filtering entries against a Set of excluded keys removes sensitive or unwanted fields.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2, c: 3 }, ['b']], expected: { a: 1, c: 3 }, label: 'omit b' },
      { input: [{ x: 10, y: 20 }, ['x', 'y']], expected: {}, label: 'omit all keys' },
      { input: [{ name: 'Alice' }, ['age']], expected: { name: 'Alice' }, label: 'omit non-existent key' },
      { input: [{}, ['any']], expected: {}, label: 'empty object' }
    ]
  },
  {
    id: 'objects-pick-keys',
    title: 'Object: Pick Specified Keys',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'pickKeys',
    description: 'Given an object obj and an array of keys keysToPick, return a new object containing only the properties in keysToPick that exist in obj.',
    whatShouldHappen: [
      'Initialize result = {}.',
      'For each key in keysToPick, if Object.hasOwn(obj, key), assign result[key] = obj[key].',
      'Return result.'
    ],
    starterCode: 'function pickKeys(obj, keysToPick) {\n  // your code here\n}',
    solution: 'function pickKeys(obj, keysToPick) {\n  const result = {};\n  for (const k of keysToPick) {\n    if (Object.hasOwn(obj, k)) {\n      result[k] = obj[k];\n    }\n  }\n  return result;\n}',
    skeletonHint: 'function pickKeys(obj, keysToPick) {\n  const result = {};\n  for (const k of keysToPick) {\n    if (Object.hasOwn(obj, k)) {\n      result[k] = obj[____];\n    }\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "obj = { id: 1, name: 'Alice', role: 'admin' }, keysToPick = ['id', 'name']",
      columns: ['k', 'in obj?', 'assigned?'],
      rows: [
        { k: 'id', 'in obj?': 'true', 'assigned?': 'id: 1' },
        { k: 'name', 'in obj?': 'true', 'assigned?': "name: 'Alice'" }
      ]
    },
    patternTag: 'Property Selection',
    patternExplanation: 'Picking a subset of object keys projects only requested fields into a clean payload.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ id: 1, name: 'Alice', role: 'admin' }, ['id', 'name']], expected: { id: 1, name: 'Alice' }, label: 'pick id and name' },
      { input: [{ a: 1 }, ['b']], expected: {}, label: 'pick missing key' },
      { input: [{ x: 10, y: 20 }, ['x', 'y', 'z']], expected: { x: 10, y: 20 }, label: 'pick partial existing' },
      { input: [{}, ['any']], expected: {}, label: 'empty object' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 4: Immutability & Status (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-freeze-immutable',
    title: 'Object.freeze: Create Frozen Copy',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'freezeObjectCopy',
    description: 'Given an object obj, return a shallow clone of obj that is frozen using Object.freeze({ ...obj }).',
    whatShouldHappen: [
      'Call Object.freeze({ ...obj }).',
      'Return frozen copy.'
    ],
    starterCode: 'function freezeObjectCopy(obj) {\n  // your code here\n}',
    solution: 'function freezeObjectCopy(obj) {\n  return Object.freeze({ ...obj });\n}',
    skeletonHint: 'function freezeObjectCopy(obj) {\n  return Object.____({ ...obj });\n}',
    traceTable: {
      inputLabel: 'obj = { a: 1 }',
      columns: ['clone', 'Object.freeze', 'isFrozen?'],
      rows: [
        { clone: '{ a: 1 }', 'Object.freeze': 'freeze clone', 'isFrozen?': 'true' }
      ]
    },
    patternTag: 'Object Freezing',
    patternExplanation: 'Object.freeze() prevents new properties from being added and existing properties from being modified or removed.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1 }], expected: { a: 1 }, label: 'freeze single property' },
      { input: [{ x: 10, y: 20 }], expected: { x: 10, y: 20 }, label: 'freeze two properties' },
      { input: [{}], expected: {}, label: 'freeze empty' },
      { input: [{ msg: 'hello' }], expected: { msg: 'hello' }, label: 'freeze string' }
    ]
  },
  {
    id: 'objects-is-same-value',
    title: 'Object.is: Strict SameValue Equality',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'checkSameValue',
    description: 'Given two values a and b, determine if they are the exact same value using Object.is(a, b). Unlike strict equality (===), Object.is considers NaN equal to NaN and differentiates +0 from -0.',
    whatShouldHappen: [
      'Call Object.is(a, b).',
      'Return boolean.'
    ],
    starterCode: 'function checkSameValue(a, b) {\n  // your code here\n}',
    solution: 'function checkSameValue(a, b) {\n  return Object.is(a, b);\n}',
    skeletonHint: 'function checkSameValue(a, b) {\n  return Object.____(a, b);\n}',
    traceTable: {
      inputLabel: "a = 'hello', b = 'hello'",
      columns: ['a', 'b', 'Object.is(a, b)'],
      rows: [
        { a: "'hello'", b: "'hello'", 'Object.is(a, b)': 'true' }
      ]
    },
    patternTag: 'SameValue Equality',
    patternExplanation: 'Object.is determines whether two values are the exact same value according to the ECMAScript SameValue algorithm.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: ['hello', 'hello'], expected: true, label: 'identical strings' },
      { input: [10, 20], expected: false, label: 'different numbers' },
      { input: [0, 0], expected: true, label: 'identical zeros' },
      { input: ['a', 'b'], expected: false, label: 'different characters' }
    ]
  },
  {
    id: 'objects-seal-object',
    title: 'Object.seal: Seal Object Copy',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'sealObjectCopy',
    description: 'Given an object obj, return a shallow clone that is sealed using Object.seal({ ...obj }). Sealed objects allow property modification but forbid addition/deletion of properties.',
    whatShouldHappen: [
      'Call Object.seal({ ...obj }).',
      'Return sealed copy.'
    ],
    starterCode: 'function sealObjectCopy(obj) {\n  // your code here\n}',
    solution: 'function sealObjectCopy(obj) {\n  return Object.seal({ ...obj });\n}',
    skeletonHint: 'function sealObjectCopy(obj) {\n  return Object.____({ ...obj });\n}',
    traceTable: {
      inputLabel: 'obj = { a: 1 }',
      columns: ['clone', 'Object.seal result'],
      rows: [
        { clone: '{ a: 1 }', 'Object.seal result': 'sealed object' }
      ]
    },
    patternTag: 'Object Sealing',
    patternExplanation: 'Object.seal() prevents additions and deletions while permitting in-place updates to existing properties.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1 }], expected: { a: 1 }, label: 'seal object' },
      { input: [{ x: 10, y: 20 }], expected: { x: 10, y: 20 }, label: 'seal pair' },
      { input: [{}], expected: {}, label: 'seal empty' },
      { input: [{ flag: true }], expected: { flag: true }, label: 'seal boolean' }
    ]
  },
  {
    id: 'objects-property-names',
    title: 'Object.getOwnPropertyNames: List Property Keys',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'getPropertyNames',
    description: 'Given an object obj, return an array of all its own property names using Object.getOwnPropertyNames(obj).',
    whatShouldHappen: [
      'Call Object.getOwnPropertyNames(obj).',
      'Return array of property names.'
    ],
    starterCode: 'function getPropertyNames(obj) {\n  // your code here\n}',
    solution: 'function getPropertyNames(obj) {\n  return Object.getOwnPropertyNames(obj);\n}',
    skeletonHint: 'function getPropertyNames(obj) {\n  return Object.____(obj);\n}',
    traceTable: {
      inputLabel: 'obj = { a: 1, b: 2 }',
      columns: ['obj', 'property names'],
      rows: [
        { obj: '{ a: 1, b: 2 }', 'property names': "['a', 'b']" }
      ]
    },
    patternTag: 'Property Inspection',
    patternExplanation: 'Object.getOwnPropertyNames returns an array of all own properties found on a given object.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2 }], expected: ['a', 'b'], label: 'two properties' },
      { input: [{}], expected: [], label: 'empty object' },
      { input: [{ x: 10, y: 20, z: 30 }], expected: ['x', 'y', 'z'], label: 'three properties' },
      { input: [{ name: 'Test' }], expected: ['name'], label: 'single property' }
    ]
  },
  {
    id: 'objects-prevent-extensions',
    title: 'Object.preventExtensions: Forbid New Keys',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'preventExtensionsCopy',
    description: 'Given an object obj, return a clone with Object.preventExtensions({ ...obj }) so no new keys can be added.',
    whatShouldHappen: [
      'Call Object.preventExtensions({ ...obj }).',
      'Return copy.'
    ],
    starterCode: 'function preventExtensionsCopy(obj) {\n  // your code here\n}',
    solution: 'function preventExtensionsCopy(obj) {\n  return Object.preventExtensions({ ...obj });\n}',
    skeletonHint: 'function preventExtensionsCopy(obj) {\n  return Object.____({ ...obj });\n}',
    traceTable: {
      inputLabel: 'obj = { a: 1 }',
      columns: ['clone', 'preventExtensions'],
      rows: [
        { clone: '{ a: 1 }', preventExtensions: 'non-extensible copy' }
      ]
    },
    patternTag: 'Extension Prevention',
    patternExplanation: 'Object.preventExtensions() permanently locks an object from accepting new properties.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1 }], expected: { a: 1 }, label: 'prevent extensions' },
      { input: [{ x: 10, y: 20 }], expected: { x: 10, y: 20 }, label: 'two keys' },
      { input: [{}], expected: {}, label: 'empty object' },
      { input: [{ tag: 'stable' }], expected: { tag: 'stable' }, label: 'string prop' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 5: Dynamic Key Computation (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-prefix-keys',
    title: 'Object: Prefix All Property Keys',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'prefixAllKeys',
    description: 'Given an object obj and string prefix, return a new object where every property key is prepended with prefix (e.g. `${prefix}${key}`).',
    whatShouldHappen: [
      'Initialize result = {}.',
      'Iterate through [key, value] of Object.entries(obj).',
      'Assign result[`${prefix}${key}`] = value.',
      'Return result.'
    ],
    starterCode: 'function prefixAllKeys(obj, prefix) {\n  // your code here\n}',
    solution: 'function prefixAllKeys(obj, prefix) {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    result[`${prefix}${key}`] = value;\n  }\n  return result;\n}',
    skeletonHint: 'function prefixAllKeys(obj, prefix) {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    result[`${____}${key}`] = value;\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "obj = { id: 1, name: 'Item' }, prefix = 'data_'",
      columns: ['original key', 'prefixed key', 'result'],
      rows: [
        { 'original key': 'id', 'prefixed key': 'data_id', result: 'data_id: 1' },
        { 'original key': 'name', 'prefixed key': 'data_name', result: "data_name: 'Item'" }
      ]
    },
    patternTag: 'Namespace Prefixing',
    patternExplanation: 'Iterating entries and prepending prefixes scopes properties into structured namespaces.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ id: 1, name: 'Item' }, 'data_'], expected: { data_id: 1, data_name: 'Item' }, label: 'prefix two keys' },
      { input: [{ a: 1 }, 'pre_'], expected: { pre_a: 1 }, label: 'single key' },
      { input: [{}, 'test_'], expected: {}, label: 'empty object' },
      { input: [{ x: 10 }, ''], expected: { x: 10 }, label: 'empty prefix' }
    ]
  },
  {
    id: 'objects-dynamic-accumulator',
    title: 'Object: Group Words by Length',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'groupWordsByLength',
    description: 'Given an array of strings words, group them into an object where keys are the word lengths (as numbers or strings) and values are arrays of words having that length.',
    whatShouldHappen: [
      'Initialize result = {}.',
      'For each word in words:',
      '  const len = word.length;',
      '  if (!result[len]) result[len] = [];',
      '  result[len].push(word);',
      'Return result.'
    ],
    starterCode: 'function groupWordsByLength(words) {\n  // your code here\n}',
    solution: 'function groupWordsByLength(words) {\n  const result = {};\n  for (const w of words) {\n    const len = w.length;\n    if (!result[len]) result[len] = [];\n    result[len].push(w);\n  }\n  return result;\n}',
    skeletonHint: 'function groupWordsByLength(words) {\n  const result = {};\n  for (const w of words) {\n    const len = w.length;\n    if (!result[len]) result[len] = [];\n    result[len].push(____);\n  }\n  return result;\n}',
    traceTable: {
      inputLabel: "words = ['a', 'bb', 'c']",
      columns: ['word', 'len', 'result state'],
      rows: [
        { word: 'a', len: 1, 'result state': "{ '1': ['a'] }" },
        { word: 'bb', len: 2, 'result state': "{ '1': ['a'], '2': ['bb'] }" },
        { word: 'c', len: 1, 'result state': "{ '1': ['a', 'c'], '2': ['bb'] }" }
      ]
    },
    patternTag: 'Dynamic Bucket Grouping',
    patternExplanation: 'Using computed properties to dynamically create and populate arrays organizes data by attribute.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [['a', 'bb', 'c', 'ddd']], expected: { '1': ['a', 'c'], '2': ['bb'], '3': ['ddd'] }, label: 'group 4 words' },
      { input: [['hello', 'world']], expected: { '5': ['hello', 'world'] }, label: 'same length words' },
      { input: [['single']], expected: { '6': ['single'] }, label: 'one word' },
      { input: [[]], expected: {}, label: 'empty words array' }
    ]
  },
  {
    id: 'objects-extract-values-by-keys',
    title: 'Object: Extract Values in Key Sequence',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'extractValuesInOrder',
    description: 'Given an object obj and an array of key strings keysList, return an array of values corresponding to each key in order. If a key is missing from obj, return null for that position.',
    whatShouldHappen: [
      'Map keysList using key => Object.hasOwn(obj, key) ? obj[key] : null.',
      'Return mapped array.'
    ],
    starterCode: 'function extractValuesInOrder(obj, keysList) {\n  // your code here\n}',
    solution: 'function extractValuesInOrder(obj, keysList) {\n  return keysList.map(k => Object.hasOwn(obj, k) ? obj[k] : null);\n}',
    skeletonHint: 'function extractValuesInOrder(obj, keysList) {\n  return keysList.map(k => Object.hasOwn(obj, k) ? obj[____] : null);\n}',
    traceTable: {
      inputLabel: "obj = { a: 1, b: 2 }, keysList = ['b', 'c', 'a']",
      columns: ['k', 'in obj?', 'value'],
      rows: [
        { k: 'b', 'in obj?': 'true', value: 2 },
        { k: 'c', 'in obj?': 'false', value: 'null' },
        { k: 'a', 'in obj?': 'true', value: 1 }
      ]
    },
    patternTag: 'Ordered Property Lookup',
    patternExplanation: 'Mapping key lists into values with fallback defaults converts dictionaries into ordered arrays.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2 }, ['b', 'c', 'a']], expected: [2, null, 1], label: 'lookup with one missing key' },
      { input: [{ x: 10, y: 20 }, ['x', 'y']], expected: [10, 20], label: 'all keys present' },
      { input: [{}, ['missing']], expected: [null], label: 'empty object' },
      { input: [{ a: 1 }, []], expected: [], label: 'empty keysList' }
    ]
  },
  {
    id: 'objects-rename-single-key',
    title: 'Object: Rename Single Property Key',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'renamePropertyKey',
    description: 'Given an object obj, an oldKey string, and newKey string, return a new object where oldKey is renamed to newKey with its value preserved. If oldKey does not exist in obj, return a copy of obj unchanged.',
    whatShouldHappen: [
      'If !Object.hasOwn(obj, oldKey) return { ...obj }.',
      'Create result = { ...obj }.',
      'Set result[newKey] = result[oldKey].',
      'Delete result[oldKey].',
      'Return result.'
    ],
    starterCode: 'function renamePropertyKey(obj, oldKey, newKey) {\n  // your code here\n}',
    solution: 'function renamePropertyKey(obj, oldKey, newKey) {\n  if (!Object.hasOwn(obj, oldKey)) return { ...obj };\n  if (oldKey === newKey) return { ...obj };\n  const result = { ...obj };\n  result[newKey] = result[oldKey];\n  delete result[oldKey];\n  return result;\n}',
    skeletonHint: 'function renamePropertyKey(obj, oldKey, newKey) {\n  if (!Object.hasOwn(obj, oldKey)) return { ...obj };\n  const result = { ...obj };\n  result[newKey] = result[____];\n  delete result[____];\n  return result;\n}',
    traceTable: {
      inputLabel: "obj = { id: 1, name: 'Alice' }, oldKey = 'name', newKey = 'fullName'",
      columns: ['oldKey exists?', 'reassign', 'deleted old', 'result'],
      rows: [
        { 'oldKey exists?': 'true', reassign: "fullName: 'Alice'", 'deleted old': 'name deleted', result: "{ id: 1, fullName: 'Alice' }" }
      ]
    },
    patternTag: 'Property Key Renaming',
    patternExplanation: 'Reassigning the property under the new key on a clone and deleting the old key renames properties cleanly.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ id: 1, name: 'Alice' }, 'name', 'fullName'], expected: { id: 1, fullName: 'Alice' }, label: 'rename name to fullName' },
      { input: [{ a: 1, b: 2 }, 'c', 'd'], expected: { a: 1, b: 2 }, label: 'oldKey not present' },
      { input: [{}, 'x', 'y'], expected: {}, label: 'empty object' },
      { input: [{ key: 'value' }, 'key', 'key'], expected: { key: 'value' }, label: 'rename to same key' }
    ]
  },
  {
    id: 'objects-swap-two-properties',
    title: 'Object: Swap Values of Two Keys',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'swapPropertyValues',
    description: 'Given an object obj, key1, and key2, return a new object with the values of key1 and key2 swapped. If either key is missing, return a copy of obj unchanged.',
    whatShouldHappen: [
      'If !Object.hasOwn(obj, key1) || !Object.hasOwn(obj, key2) return { ...obj }.',
      'Return { ...obj, [key1]: obj[key2], [key2]: obj[key1] }.'
    ],
    starterCode: 'function swapPropertyValues(obj, key1, key2) {\n  // your code here\n}',
    solution: 'function swapPropertyValues(obj, key1, key2) {\n  if (!Object.hasOwn(obj, key1) || !Object.hasOwn(obj, key2)) return { ...obj };\n  return { ...obj, [key1]: obj[key2], [key2]: obj[key1] };\n}',
    skeletonHint: 'function swapPropertyValues(obj, key1, key2) {\n  if (!Object.hasOwn(obj, key1) || !Object.hasOwn(obj, key2)) return { ...obj };\n  return { ...obj, [key1]: obj[____], [key2]: obj[____] };\n}',
    traceTable: {
      inputLabel: "obj = { a: 1, b: 2 }, key1 = 'a', key2 = 'b'",
      columns: ['original a', 'original b', 'swapped result'],
      rows: [
        { 'original a': 1, 'original b': 2, 'swapped result': '{ a: 2, b: 1 }' }
      ]
    },
    patternTag: 'Property Swapping',
    patternExplanation: 'Computed property names in object literals enable simultaneous, atomic property value swapping.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 2 }, 'a', 'b'], expected: { a: 2, b: 1 }, label: 'swap a and b' },
      { input: [{ x: 10, y: 20 }, 'x', 'z'], expected: { x: 10, y: 20 }, label: 'missing key2' },
      { input: [{ p: 'first', q: 'second' }, 'p', 'q'], expected: { p: 'second', q: 'first' }, label: 'swap strings' },
      { input: [{}, 'a', 'b'], expected: {}, label: 'empty object' }
    ]
  },

  // -------------------------------------------------------------------------
  // Sub-Set 6: Aggregations & Numerical Summaries (5 problems)
  // -------------------------------------------------------------------------
  {
    id: 'objects-sum-numeric-values',
    title: 'Object.values: Sum Numeric Properties',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'sumNumericProps',
    description: 'Given an object obj containing mixed value types, return the sum of all properties where typeof value === "number". Return 0 if none.',
    whatShouldHappen: [
      'Initialize total = 0.',
      'Iterate through Object.values(obj).',
      'If typeof val === "number" and !isNaN(val), total += val.',
      'Return total.'
    ],
    starterCode: 'function sumNumericProps(obj) {\n  // your code here\n}',
    solution: 'function sumNumericProps(obj) {\n  let total = 0;\n  for (const val of Object.values(obj)) {\n    if (typeof val === "number" && !isNaN(val)) {\n      total += val;\n    }\n  }\n  return total;\n}',
    skeletonHint: 'function sumNumericProps(obj) {\n  let total = 0;\n  for (const val of Object.values(obj)) {\n    if (typeof val === "____") {\n      total += val;\n    }\n  }\n  return total;\n}',
    traceTable: {
      inputLabel: "obj = { a: 5, b: 'skip', c: 10 }",
      columns: ['val', 'typeof number?', 'total'],
      rows: [
        { val: 5, 'typeof number?': 'true', total: 5 },
        { val: "'skip'", 'typeof number?': 'false', total: 5 },
        { val: 10, 'typeof number?': 'true', total: 15 }
      ]
    },
    patternTag: 'Numeric Property Accumulator',
    patternExplanation: 'Filtering Object.values() by typeof val === "number" sums values without processing keys.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 5, b: 'skip', c: 10 }], expected: 15, label: 'sum numbers ignore string' },
      { input: [{ x: 1, y: 2, z: 3 }], expected: 6, label: 'all numbers' },
      { input: [{ label: 'test', flag: true }], expected: 0, label: 'no numbers' },
      { input: [{}], expected: 0, label: 'empty object' }
    ]
  },
  {
    id: 'objects-average-numeric-values',
    title: 'Object.values: Average of Numeric Properties',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'averageNumericProps',
    description: 'Given an object obj, calculate the arithmetic mean of all numeric values. If no numeric values exist, return 0.',
    whatShouldHappen: [
      'Filter Object.values(obj) for numbers: nums = values.filter(v => typeof v === "number").',
      'If nums.length === 0, return 0.',
      'Return sum / nums.length.'
    ],
    starterCode: 'function averageNumericProps(obj) {\n  // your code here\n}',
    solution: 'function averageNumericProps(obj) {\n  const nums = Object.values(obj).filter(v => typeof v === "number" && !isNaN(v));\n  if (nums.length === 0) return 0;\n  const sum = nums.reduce((acc, n) => acc + n, 0);\n  return sum / nums.length;\n}',
    skeletonHint: 'function averageNumericProps(obj) {\n  const nums = Object.values(obj).filter(v => typeof v === "____");\n  if (nums.length === 0) return 0;\n  return nums.reduce((a, b) => a + b, 0) / nums.____;\n}',
    traceTable: {
      inputLabel: 'obj = { a: 10, b: 20, c: 30 }',
      columns: ['nums', 'sum', 'count', 'average'],
      rows: [
        { nums: '[10, 20, 30]', sum: 60, count: 3, average: 20 }
      ]
    },
    patternTag: 'Property Mean Calculation',
    patternExplanation: 'Filtering numeric values and dividing their reduced sum by count computes the average.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ a: 10, b: 20, c: 30 }], expected: 20, label: 'average of 10 20 30' },
      { input: [{ x: 5, label: 'txt' }], expected: 5, label: 'single number with string' },
      { input: [{ name: 'none' }], expected: 0, label: 'no numbers' },
      { input: [{}], expected: 0, label: 'empty object' }
    ]
  },
  {
    id: 'objects-find-max-property-key',
    title: 'Object.entries: Find Key of Highest Value',
    category: 'object-loops',
    difficulty: 'Easy',
    functionName: 'findMaxPropKey',
    description: 'Given an object obj whose values are numbers, return the key associated with the largest value. If obj has no keys, return null.',
    whatShouldHappen: [
      'const entries = Object.entries(obj).',
      'If entries.length === 0 return null.',
      'Track maxKey = entries[0][0], maxVal = entries[0][1].',
      'Iterate entries, if val > maxVal update maxKey and maxVal.',
      'Return maxKey.'
    ],
    starterCode: 'function findMaxPropKey(obj) {\n  // your code here\n}',
    solution: 'function findMaxPropKey(obj) {\n  const entries = Object.entries(obj);\n  if (entries.length === 0) return null;\n  let maxKey = entries[0][0];\n  let maxVal = entries[0][1];\n  for (const [k, v] of entries) {\n    if (v > maxVal) {\n      maxVal = v;\n      maxKey = k;\n    }\n  }\n  return maxKey;\n}',
    skeletonHint: 'function findMaxPropKey(obj) {\n  const entries = Object.entries(obj);\n  if (entries.length === 0) return null;\n  let maxKey = entries[0][0], maxVal = entries[0][1];\n  for (const [k, v] of entries) {\n    if (v > maxVal) {\n      maxVal = ____;\n      maxKey = ____;\n    }\n  }\n  return maxKey;\n}',
    traceTable: {
      inputLabel: 'obj = { gold: 50, silver: 100, bronze: 20 }',
      columns: ['key', 'v', 'v > maxVal?', 'current maxKey'],
      rows: [
        { key: 'gold', v: 50, 'v > maxVal?': 'init (50)', 'current maxKey': 'gold' },
        { key: 'silver', v: 100, 'v > maxVal?': 'true (100 > 50)', 'current maxKey': 'silver' },
        { key: 'bronze', v: 20, 'v > maxVal?': 'false', 'current maxKey': 'silver' }
      ]
    },
    patternTag: 'Dictionary Extremum Search',
    patternExplanation: 'Iterating [key, val] tuples and updating a max pointer locates the key corresponding to an extremum.',
    estimatedMinutes: 5,
    status: 'published',
    tests: [
      { input: [{ gold: 50, silver: 100, bronze: 20 }], expected: 'silver', label: 'highest is silver' },
      { input: [{ a: -10, b: -2 }], expected: 'b', label: 'negative values' },
      { input: [{ lone: 42 }], expected: 'lone', label: 'single key' },
      { input: [{}], expected: null, label: 'empty object' }
    ]
  },
  {
    id: 'objects-pluck-values-array',
    title: 'Array.map: Pluck Property from Object Array',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'pluckProperty',
    description: 'Given an array of objects items and property name prop, return an array of values for that property (e.g. items.map(item => item[prop])).',
    whatShouldHappen: [
      'Call items.map(item => item[prop]).',
      'Return plucked values array.'
    ],
    starterCode: 'function pluckProperty(items, prop) {\n  // your code here\n}',
    solution: 'function pluckProperty(items, prop) {\n  return items.map(item => item[prop]);\n}',
    skeletonHint: 'function pluckProperty(items, prop) {\n  return items.map(item => item[____]);\n}',
    traceTable: {
      inputLabel: "items = [{id: 1}, {id: 2}], prop = 'id'",
      columns: ['item', 'item[prop]'],
      rows: [
        { item: '{id: 1}', 'item[prop]': 1 },
        { item: '{id: 2}', 'item[prop]': 2 }
      ]
    },
    patternTag: 'Property Plucking',
    patternExplanation: 'Extracting a designated property from a collection of records projects a single dimension.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [[{ id: 1 }, { id: 2 }], 'id'], expected: [1, 2], label: 'pluck id numbers' },
      { input: [[{ name: 'A' }, { name: 'B' }], 'name'], expected: ['A', 'B'], label: 'pluck name strings' },
      { input: [[{ a: 1 }, { b: 2 }], 'a'], expected: [1, undefined], label: 'missing in second object' },
      { input: [[], 'id'], expected: [], label: 'empty items' }
    ]
  },
  {
    id: 'objects-count-truthy-values',
    title: 'Object.values: Count Truthy Values',
    category: 'object-loops',
    difficulty: 'Beginner',
    functionName: 'countTruthyValues',
    description: 'Given an object obj, use Object.values(obj) to count how many properties contain truthy values.',
    whatShouldHappen: [
      'Filter Object.values(obj) with Boolean.',
      'Return length.'
    ],
    starterCode: 'function countTruthyValues(obj) {\n  // your code here\n}',
    solution: 'function countTruthyValues(obj) {\n  return Object.values(obj).filter(Boolean).length;\n}',
    skeletonHint: 'function countTruthyValues(obj) {\n  return Object.values(obj).filter(____).length;\n}',
    traceTable: {
      inputLabel: "obj = { a: 1, b: 0, c: 'yes', d: false }",
      columns: ['val', 'Boolean(val)', 'count'],
      rows: [
        { val: 1, 'Boolean(val)': 'true', count: 1 },
        { val: 0, 'Boolean(val)': 'false', count: 1 },
        { val: "'yes'", 'Boolean(val)': 'true', count: 2 },
        { val: 'false', 'Boolean(val)': 'false', count: 2 }
      ]
    },
    patternTag: 'Truthy Value Counting',
    patternExplanation: 'Extracting values and filtering with Boolean provides a rapid count of active flags or present fields.',
    estimatedMinutes: 3,
    status: 'published',
    tests: [
      { input: [{ a: 1, b: 0, c: 'yes', d: false }], expected: 2, label: 'two truthy values' },
      { input: [{ x: 1, y: 2 }], expected: 2, label: 'all truthy' },
      { input: [{ p: '', q: null, r: undefined }], expected: 0, label: 'all falsy' },
      { input: [{}], expected: 0, label: 'empty object' }
    ]
  }
];

module.exports = { objectMethodsProblems };
