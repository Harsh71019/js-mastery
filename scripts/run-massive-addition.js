const fs = require('fs');
const path = require('path');
const { validateProblem } = require('../server/dist/utils/problem-validation.js');

const { arrayMethodsProblems } = require('./generators/array-methods.js');
const { stringMethodsProblems } = require('./generators/string-methods.js');
const { objectMethodsProblems } = require('./generators/object-methods.js');
const { mapSetMethodsProblems } = require('./generators/map-set-methods.js');
const { mathNumberMethodsProblems } = require('./generators/math-number-methods.js');
const { binaryMethodsProblems } = require('./generators/binary-methods.js');
const { loopFlowMethodsProblems } = require('./generators/loop-flow-methods.js');

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

const getAllJsonFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
};

const PROBLEMS_DIR = path.resolve(__dirname, '../server/data/problems');

// Collect existing problems
const existingFiles = getAllJsonFiles(PROBLEMS_DIR);
const existingIds = new Set();
const existingTitles = new Set();
let existingCount = 0;

for (const f of existingFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (Array.isArray(content)) {
      for (const p of content) {
        if (p.id) existingIds.add(p.id);
        if (p.title) existingTitles.add(p.title);
        existingCount++;
      }
    }
  } catch (err) {
    console.error(`Error reading ${f}:`, err);
  }
}

console.log(`Found ${existingCount} existing problems across ${existingFiles.length} files.`);

const allNewBatches = [
  { name: 'Array Methods', problems: arrayMethodsProblems },
  { name: 'String Methods', problems: stringMethodsProblems },
  { name: 'Object Methods', problems: objectMethodsProblems },
  { name: 'Map & Set Methods', problems: mapSetMethodsProblems },
  { name: 'Math & Number Methods', problems: mathNumberMethodsProblems },
  { name: 'Binary & Bitwise Methods', problems: binaryMethodsProblems },
  { name: 'Loop & Flow Methods', problems: loopFlowMethodsProblems }
];

const totalNew = allNewBatches.reduce((acc, b) => acc + b.problems.length, 0);
console.log(`Total new problems to process: ${totalNew}`);

// 1. Validation & Uniqueness Checks
const seenNewIds = new Set();
const seenNewTitles = new Set();
let validationFailed = false;

for (const batch of allNewBatches) {
  console.log(`\nValidating batch: ${batch.name} (${batch.problems.length} problems)...`);
  for (const p of batch.problems) {
    // Uniqueness
    if (existingIds.has(p.id)) {
      console.error(`[ERROR] ID collision with existing problem: ${p.id}`);
      validationFailed = true;
    }
    if (seenNewIds.has(p.id)) {
      console.error(`[ERROR] Duplicate ID within new problems: ${p.id}`);
      validationFailed = true;
    }
    seenNewIds.add(p.id);

    if (existingTitles.has(p.title)) {
      console.error(`[ERROR] Title collision with existing problem: "${p.title}" (id: ${p.id})`);
      validationFailed = true;
    }
    if (seenNewTitles.has(p.title)) {
      console.error(`[ERROR] Duplicate Title within new problems: "${p.title}" (id: ${p.id})`);
      validationFailed = true;
    }
    seenNewTitles.add(p.title);

    // Schema validation
    const errors = validateProblem(p);
    if (errors.length > 0) {
      console.error(`[ERROR] Schema validation error on ${p.id}:`, errors);
      validationFailed = true;
    }

    // Solution testing
    try {
      const fn = new Function(`${p.solution}; return ${p.functionName};`)();
      for (let t = 0; t < p.tests.length; t++) {
        const testCase = p.tests[t];
        // Clone input arguments to prevent mutations affecting tests
        const inputArgs = structuredClone(testCase.input);
        const actual = fn(...inputArgs);
        if (!deepEqual(actual, testCase.expected)) {
          console.error(`[TEST FAILED] ${p.id} test #${t} (${testCase.label}): expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
          validationFailed = true;
        }
      }
    } catch (testErr) {
      console.error(`[TEST RUNTIME ERROR] ${p.id}:`, testErr);
      validationFailed = true;
    }
  }
}

if (validationFailed) {
  console.error('\n❌ VALIDATION / TESTS FAILED. Aborting write operation.');
  process.exit(1);
}

console.log('\n✅ ALL 220 PROBLEMS VALIDATED AND PASSED 100% OF TEST CASES!');

// 2. Writing to Target Files
// Helper to append or create
function writeOrAppend(filePath, newProblems) {
  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const combined = existing.concat(newProblems);
  fs.writeFileSync(filePath, JSON.stringify(combined, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${newProblems.length} problems to ${path.relative(process.cwd(), filePath)} (Total in file: ${combined.length})`);
}

console.log('\nWriting problems to target data files...');

// 1. Array methods -> server/data/problems/array-methods/methods-mastery.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'array-methods', 'methods-mastery.json'),
  arrayMethodsProblems
);

// 2. Strings -> server/data/problems/strings.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'strings.json'),
  stringMethodsProblems
);

// 3. Object methods -> server/data/problems/object-loops.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'object-loops.json'),
  objectMethodsProblems
);

// 4. Map & Set -> server/data/problems/maps-and-sets.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'maps-and-sets.json'),
  mapSetMethodsProblems
);

// 5. Math/Number & Loop Flow -> server/data/problems/basic-loops.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'basic-loops.json'),
  mathNumberMethodsProblems.concat(loopFlowMethodsProblems)
);

// 6. Binary -> server/data/problems/binary.json
writeOrAppend(
  path.join(PROBLEMS_DIR, 'binary.json'),
  binaryMethodsProblems
);

// 3. Final Count Verification
const finalFiles = getAllJsonFiles(PROBLEMS_DIR);
let finalCount = 0;
for (const f of finalFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (Array.isArray(content)) {
      finalCount += content.length;
    }
  } catch (err) {}
}

console.log(`\n🎉 SUCCESS! Problem repository updated:`);
console.log(`Previous count: ${existingCount}`);
console.log(`Added: ${totalNew}`);
console.log(`New total count: ${finalCount}`);
