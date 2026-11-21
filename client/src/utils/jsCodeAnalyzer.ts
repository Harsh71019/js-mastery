export type FindingSeverity = 'error' | 'warning' | 'info' | 'optimal'

export interface CodeFinding {
  readonly id: string
  readonly title: string
  readonly severity: FindingSeverity
  readonly category: 'Complexity' | 'JS Language Quirk' | 'Boundary & Bounds' | 'Iteration Semantics' | 'Best Practice'
  readonly message: string
  readonly whyInJavaScript: string
  readonly recommendation: string
  readonly codeSnippet?: string
  readonly line?: number
}

export interface AnalysisSummary {
  readonly findings: readonly CodeFinding[]
  readonly patternDetected: string
  readonly score: 'Clean & Idiomatic' | 'Needs Attention' | 'Critical Issues'
  readonly warningCount: number
  readonly errorCount: number
  readonly optimalCount: number
}

export const analyzeJsCode = (code: string): AnalysisSummary => {
  const findings: CodeFinding[] = []

  if (!code || code.trim().length === 0) {
    return {
      findings: [],
      patternDetected: 'No code provided',
      score: 'Clean & Idiomatic',
      warningCount: 0,
      errorCount: 0,
      optimalCount: 0,
    }
  }

  const lines = code.split('\n')

  // 1. Check for i <= arr.length (Off-by-one / undefined element trap)
  const offByOneRegex = /for\s*\([^;]*;\s*(\w+)\s*<=\s*(\w+)\.length\s*;/
  lines.forEach((line, idx) => {
    const match = line.match(offByOneRegex)
    if (match) {
      findings.push({
        id: `off-by-one-${idx}`,
        title: 'Off-by-One Array Boundary (undefined Access)',
        severity: 'error',
        category: 'Boundary & Bounds',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: `Found \`${match[1]} <= ${match[2]}.length\` in loop condition.`,
        whyInJavaScript:
          'In JavaScript, array indices run from 0 to length - 1. When i reaches arr.length, accessing arr[arr.length] evaluates to `undefined` without throwing an error. This undefined silently propagates into mathematical calculations, turning numbers into `NaN`, or throws `TypeError` when reading properties.',
        recommendation: `Change condition from \`${match[1]} <= ${match[2]}.length\` to \`${match[1]} < ${match[2]}.length\`.`,
      })
    }
  })

  // 2. Check for hidden O(N^2) operations inside loops
  const loopStartRegex = /(for\s*\(|while\s*\(|for\s+await\s*\()/
  let inLoop = false
  let loopDepth = 0

  lines.forEach((line, idx) => {
    if (loopStartRegex.test(line)) {
      inLoop = true
      loopDepth++
    }

    if (inLoop) {
      // Look for linear methods: includes, indexOf, lastIndexOf, slice, splice, shift
      const linearMethods = [
        { name: 'includes', complexity: 'O(N)' },
        { name: 'indexOf', complexity: 'O(N)' },
        { name: 'lastIndexOf', complexity: 'O(N)' },
        { name: 'slice', complexity: 'O(N)' },
        { name: 'splice', complexity: 'O(N)' },
        { name: 'shift', complexity: 'O(N) re-indexing' },
      ]

      for (const method of linearMethods) {
        const methodRegex = new RegExp(`\\.\\s*${method.name}\\s*\\(`)
        if (methodRegex.test(line)) {
          findings.push({
            id: `hidden-complexity-${idx}-${method.name}`,
            title: `Accidental O(N²) Quadratic Search (\`.${method.name}()\` inside loop)`,
            severity: 'warning',
            category: 'Complexity',
            line: idx + 1,
            codeSnippet: line.trim(),
            message: `Invoking \`.${method.name}()\` inside an iteration loop creates nested O(N) work.`,
            whyInJavaScript:
              `In JavaScript, \`Array.prototype.${method.name}()\` performs a linear scan through the array elements under the hood. When placed inside a loop running N times, the total operations become N × N = O(N²), which will cause Time Limit Exceeded (TLE) on inputs with 10⁴+ items.`,
            recommendation:
              'For O(1) existence checks, convert the array to a `Set` before the loop: `const seen = new Set(arr); seen.has(item);`',
          })
          break
        }
      }
    }

    // Rough brace tracking
    const openBraces = (line.match(/{/g) || []).length
    const closeBraces = (line.match(/}/g) || []).length
    if (closeBraces > openBraces && loopDepth > 0) {
      loopDepth = Math.max(0, loopDepth - (closeBraces - openBraces))
      if (loopDepth === 0) inLoop = false
    }
  })

  // 3. Check for for...in on Array
  const forInRegex = /for\s*\(\s*(const|let|var)?\s*(\w+)\s+in\s+(\w+)\s*\)/
  lines.forEach((line, idx) => {
    const match = line.match(forInRegex)
    if (match) {
      findings.push({
        id: `for-in-array-${idx}`,
        title: 'Using `for...in` on Array (String Keys & Unordered)',
        severity: 'warning',
        category: 'Iteration Semantics',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: `\`for...in\` iterates over object property keys as strings, not array values.`,
        whyInJavaScript:
          '`for...in` is meant for object property inspection. When used on arrays, the loop variable is the string key (`"0"`, `"1"`), not the numeric index or item. It also traverses enumerable prototype properties and does not guarantee strict numerical order across all JS engines.',
        recommendation:
          'Use `for (const item of arr)` to iterate values, or `for (let i = 0; i < arr.length; i++)` for indices.',
      })
    }
  })

  // 4. Check for return inside forEach
  const forEachRegex = /\.forEach\s*\(/
  let insideForEach = false
  lines.forEach((line, idx) => {
    if (forEachRegex.test(line)) insideForEach = true
    if (insideForEach && /\breturn\b/.test(line) && !/=>\s*{/.test(line)) {
      findings.push({
        id: `foreach-return-${idx}`,
        title: '`return` Inside `forEach` Does Not Break Loop',
        severity: 'warning',
        category: 'Iteration Semantics',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: 'A `return` statement inside a `forEach` callback only exits the current callback, not the outer function.',
        whyInJavaScript:
          'In JavaScript, `.forEach()` executes a supplied callback function for every element. Returning from that callback is equivalent to a `continue` in a standard loop. It does not terminate iteration early or return from the enclosing function.',
        recommendation:
          'Use a standard `for (const x of arr)` loop where `break` or `return` will immediately exit.',
      })
      insideForEach = false
    }
    if (line.includes('})') || line.includes('});')) insideForEach = false
  })

  // 5. Check for loose equality == or !=
  lines.forEach((line, idx) => {
    // Avoid regex, comments, or === / !==
    if (
      /[^!=]==[^=]/.test(line) &&
      !line.trim().startsWith('//') &&
      !line.trim().startsWith('*')
    ) {
      findings.push({
        id: `loose-equality-${idx}`,
        title: 'Loose Equality (`==`) Implicit Coercion Trap',
        severity: 'info',
        category: 'JS Language Quirk',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: 'Loose equality (`==`) invokes type coercion rules.',
        whyInJavaScript:
          'JavaScript loose equality coerces types unpredictably: `0 == ""` is true, `false == []` is true, but `[] == []` is false. Strict equality (`===`) checks both type and value without unexpected coercion.',
        recommendation: 'Replace `==` with `===` (and `!=` with `!==`).',
      })
    }
  })

  // 6. Check for NaN === NaN
  lines.forEach((line, idx) => {
    if (/===\s*NaN\b|\bNaN\s*===/.test(line)) {
      findings.push({
        id: `nan-equality-${idx}`,
        title: '`x === NaN` is Always False in JavaScript',
        severity: 'error',
        category: 'JS Language Quirk',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: 'Checking equality against `NaN` using `===` always evaluates to false.',
        whyInJavaScript:
          'In accordance with IEEE 754 floating-point standards adopted by JavaScript, `NaN` represents an undefined numerical result and is never equal to any value, including itself (`NaN === NaN` is false).',
        recommendation: 'Use `Number.isNaN(value)` to check if a value is NaN.',
      })
    }
  })

  // 7. Check for integer division assumptions
  lines.forEach((line, idx) => {
    const divMatch = line.match(/\(([\w\s+*-]+)\)\s*\/\s*2\b/)
    if (divMatch && !line.includes('Math.floor') && !line.includes('Math.trunc') && !line.includes('>>')) {
      findings.push({
        id: `float-div-${idx}`,
        title: 'Floating-Point Division in Midpoint Indexing',
        severity: 'warning',
        category: 'Boundary & Bounds',
        line: idx + 1,
        codeSnippet: line.trim(),
        message: `\`${divMatch[0]}\` results in a floating-point decimal in JavaScript.`,
        whyInJavaScript:
          'Unlike languages with native integer division (Java, C++, Python 3 `//`), JavaScript numbers are 64-bit IEEE floats. `7 / 2` evaluates to `3.5`. Using `arr[3.5]` will evaluate to `undefined` because index 3.5 does not exist.',
        recommendation:
          'Wrap mid calculation with `Math.floor((left + right) / 2)` or bitwise `(left + right) >> 1`.',
      })
    }
  })

  // 8. Positive Pattern Detection
  let pattern = 'Standard Iteration'
  if (/(\bleft\b|\bright\b|\bptr1\b|\bptr2\b)/.test(code) && /(while\s*\(|for\s*\()/.test(code)) {
    pattern = 'Two-Pointer Technique'
    findings.push({
      id: 'optimal-two-pointer',
      title: 'Optimal Pattern: Two-Pointer Traversal',
      severity: 'optimal',
      category: 'Best Practice',
      message: 'Detected two pointers converging or expanding across the collection.',
      whyInJavaScript:
        'Two-pointer algorithms achieve optimal O(N) time with O(1) auxiliary memory by maintaining two index coordinates, avoiding unnecessary nested arrays or allocations.',
      recommendation: 'Ensure your termination condition (e.g. `left < right` or `left <= right`) prevents infinite loops.',
    })
  } else if (/(\bwindowStart\b|\bwindowEnd\b|\bk\b|\bwindow\b)/.test(code)) {
    pattern = 'Sliding Window Pattern'
    findings.push({
      id: 'optimal-sliding-window',
      title: 'Optimal Pattern: Sliding Window',
      severity: 'optimal',
      category: 'Best Practice',
      message: 'Detected sliding window range tracking.',
      whyInJavaScript:
        'Sliding window maintains a continuous subarray or substring state in O(N) by adding incoming elements and dropping outgoing elements in O(1) per step.',
      recommendation: 'Remember to adjust your running state (sum, frequencies) before expanding or shrinking bounds.',
    })
  } else if (/new\s+(Map|Set)\s*\(/.test(code)) {
    pattern = 'Hash Caching (Map / Set)'
    findings.push({
      id: 'optimal-hash-cache',
      title: 'Optimal Pattern: Hash Collection Lookup',
      severity: 'optimal',
      category: 'Best Practice',
      message: 'Using JavaScript `Map` or `Set` for O(1) hash lookups.',
      whyInJavaScript:
        'JavaScript `Set` and `Map` use hash tables internally to provide average O(1) insertion, deletion, and lookup times, avoiding expensive O(N) array scans.',
      recommendation: 'Great choice! Maps also preserve insertion order in JavaScript.',
    })
  }

  const errorCount = findings.filter((f) => f.severity === 'error').length
  const warningCount = findings.filter((f) => f.severity === 'warning').length
  const optimalCount = findings.filter((f) => f.severity === 'optimal').length

  let score: AnalysisSummary['score'] = 'Clean & Idiomatic'
  if (errorCount > 0) score = 'Critical Issues'
  else if (warningCount > 0) score = 'Needs Attention'

  return {
    findings,
    patternDetected: pattern,
    score,
    errorCount,
    warningCount,
    optimalCount,
  }
}
