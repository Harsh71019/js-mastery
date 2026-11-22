export type Verdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Compile Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'

export interface TestResult {
  readonly input: unknown
  readonly expected: unknown
  readonly actual: unknown
  readonly passed: boolean
  readonly error: string | null
  readonly durationMs: number
  readonly memoryBytes?: number
  readonly logs?: readonly string[]
}

export interface ExecutionResult {
  readonly results: readonly TestResult[]
  readonly timedOut: boolean
  readonly memoryExceeded: boolean
  readonly executionTimeMs: number
  readonly cpuTimeMs: number
  readonly memoryBytes: number
  readonly memoryUsageMb: number
  readonly verdict: Verdict
}

interface TestCase {
  readonly input: unknown
  readonly expected: unknown
  readonly isEval?: boolean
  readonly isGenerator?: boolean
  readonly isIterable?: boolean
  readonly isAsyncGenerator?: boolean
  readonly isAsyncIterable?: boolean
  readonly testRunnerWrapper?: string
  readonly take?: number
}

const TIMEOUT_MS = 5000

const deriveVerdict = (
  results: readonly TestResult[],
  timedOut: boolean,
  memoryExceeded: boolean,
): Verdict => {
  if (timedOut) return 'Time Limit Exceeded'
  if (memoryExceeded) return 'Memory Limit Exceeded'
  if (results.length === 0) return 'Wrong Answer'
  if (results.every((r) => r.passed)) return 'Accepted'
  const errored = results.filter((r) => r.error !== null)
  if (errored.length === 0) return 'Wrong Answer'
  const isCompileError = results.every((r) => r.error === errored[0].error)
  return isCompileError ? 'Compile Error' : 'Runtime Error'
}

// Injected into the sandbox — key-order-independent, NaN-aware, Set/Map/Date-aware, loose null/undefined-tolerant
const DEEP_EQUAL_FN = `function deepEqual(a, b) {
  if (a === b) return true;
  if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
  if (typeof a !== typeof b) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.source === b.source && a.flags === b.flags;
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (var sa of a) {
      var found = false;
      for (var sb of b) {
        if (deepEqual(sa, sb)) { found = true; break; }
      }
      if (!found) return false;
    }
    return true;
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (var [mk, mv] of a) {
      if (!b.has(mk) || !deepEqual(mv, b.get(mk))) return false;
    }
    return true;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (var di = 0; di < a.length; di++) {
      if (!deepEqual(a[di], b[di])) return false;
    }
    return true;
  }
  if (typeof a === 'object') {
    var ak = Object.keys(a).sort(), bk = Object.keys(b).sort();
    if (ak.length !== bk.length) return false;
    for (var di = 0; di < ak.length; di++) {
      if (ak[di] !== bk[di]) return false;
      if (!deepEqual(a[ak[di]], b[bk[di]])) return false;
    }
    return true;
  }
  return false;
}`

const buildSandboxHtml = (
  userCode: string,
  functionName: string,
  tests: readonly TestCase[],
): string => {
  const serializedTests = JSON.stringify(tests)
  const safeFnName = JSON.stringify(functionName)
  const safeUserCode = userCode.replace(/<\/script/gi, '<\\/script')
  const closeScript = '</' + 'script>'

  return `<!doctype html><html><body>
<script>
window.__tests__ = ${serializedTests};
window.__fnName__ = ${safeFnName};
window.__results__ = [];
window.__error__ = null;
window.__currentLogs__ = [];

window.onerror = function(msg, url, line, col, err) {
  if (!window.__error__) {
    window.__error__ = err ? (err.message || String(err)) : String(msg);
  }
};

function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}
window.ListNode = ListNode;
window.TreeNode = TreeNode;

var formatArg = function(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return arg;
  if (typeof arg === 'number' || typeof arg === 'boolean' || typeof arg === 'bigint') return String(arg);
  if (typeof arg === 'symbol') return arg.toString();
  try {
    return JSON.stringify(arg);
  } catch (e) {
    return String(arg);
  }
};

var captureLog = function(type, args) {
  try {
    var prefix = type === 'log' ? '' : '[' + type.toUpperCase() + '] ';
    var msg = Array.prototype.slice.call(args).map(formatArg).join(' ');
    window.__currentLogs__.push(prefix + msg);
  } catch (e) {}
};

console.log = function() { captureLog('log', arguments); };
console.info = function() { captureLog('info', arguments); };
console.warn = function() { captureLog('warn', arguments); };
console.error = function() { captureLog('error', arguments); };
${closeScript}
<script>
try {
${safeUserCode}
  try {
    if (typeof ${functionName} === 'function') {
      window[${safeFnName}] = ${functionName};
    }
  } catch (_) {}
} catch (e) {
  window.__error__ = e ? (e.message || String(e)) : 'Execution failed';
}
${closeScript}
<script>
${DEEP_EQUAL_FN}
(async function () {
  var tests = window.__tests__;
  var fnName = window.__fnName__;
  var results = window.__results__;

  var getHeapBytes = function() {
    try {
      if (typeof performance !== 'undefined' && performance.memory && typeof performance.memory.usedJSHeapSize === 'number') {
        return performance.memory.usedJSHeapSize;
      }
    } catch (e) {}
    return null;
  };

  var estimateBytes = function(val) {
    try {
      var s = JSON.stringify(val);
      return s ? s.length * 2 : 64;
    } catch (e) {
      return 64;
    }
  };

  var initialHeap = getHeapBytes();
  var baselineV8Mb = 43.8;
  var peakHeapBytes = initialHeap || 0;
  var totalAllocatedBytes = 0;
  var memoryExceeded = false;
  var MAX_ALLOWED_BYTES = 128 * 1024 * 1024;

  if (window.__error__) {
    tests.forEach(function (t) {
      results.push({
        input: t.input,
        expected: t.expected,
        actual: null,
        passed: false,
        error: window.__error__,
        durationMs: 0,
        memoryBytes: 0,
        logs: window.__currentLogs__.slice()
      });
    });
    window.parent.postMessage({ type: 'results', results: results, executionMs: 0, cpuTimeMs: 0, memoryBytes: 0, memoryUsageMb: baselineV8Mb, memoryExceeded: false }, '*');
    return;
  }

  if (typeof window[fnName] !== 'function') {
    tests.forEach(function (t) {
      results.push({
        input: t.input,
        expected: t.expected,
        actual: null,
        passed: false,
        error: 'Function "' + fnName + '" is not defined. Check the function name matches the starter code.',
        durationMs: 0,
        memoryBytes: 0,
        logs: window.__currentLogs__.slice()
      });
    });
    window.parent.postMessage({ type: 'results', results: results, executionMs: 0, cpuTimeMs: 0, memoryBytes: 0, memoryUsageMb: baselineV8Mb, memoryExceeded: false }, '*');
    return;
  }

  var execStart = performance.now();

  for (var i = 0; i < tests.length; i++) {
    var t = tests[i];
    window.__currentLogs__ = [];
    var testStart = performance.now();
    var heapBefore = getHeapBytes();

    try {
      var rawArgs = Array.isArray(t.input) ? t.input : [t.input];
      var args;
      try {
        args = typeof structuredClone === 'function' ? structuredClone(rawArgs) : JSON.parse(JSON.stringify(rawArgs));
      } catch (_) {
        args = rawArgs.slice();
      }
      var inputSize = estimateBytes(args);

      if (t.isEval) {
        args = args.map(function(arg) {
          if (typeof arg === 'string') {
            try { return new Function('return ' + arg)(); } catch (e) { return arg; }
          }
          return arg;
        });
      }

      var actual;
      if (t.testRunnerWrapper) {
        var wrapper = new Function('fn', 'input', t.testRunnerWrapper + '\\nreturn runner(fn, input);');
        actual = await wrapper(window[fnName], args);
      } else {
        actual = await window[fnName].apply(null, args);
      }

      if (actual && typeof actual === 'object') {
        var isGen = t.isGenerator;
        var isIter = t.isIterable || (typeof actual[Symbol.iterator] === 'function' && (isGen || t.take));
        var isAsyncGen = t.isAsyncGenerator;
        var isAsyncIter = t.isAsyncIterable || (typeof actual[Symbol.asyncIterator] === 'function' && (isAsyncGen || t.take));

        if (isGen || isIter) {
          var iterArr = [], iterCount = 0, iterLimit = t.take || 100;
          for (var iterItem of actual) {
            iterArr.push(iterItem);
            if (++iterCount >= iterLimit) break;
          }
          actual = iterArr;
        } else if (isAsyncGen || isAsyncIter) {
          var iterArr = [], iterCount = 0, iterLimit = t.take || 100;
          for await (var iterItem of actual) {
            iterArr.push(iterItem);
            if (++iterCount >= iterLimit) break;
          }
          actual = iterArr;
        }
      }

      var testDuration = Math.max(0.01, +(performance.now() - testStart).toFixed(2));
      var heapAfter = getHeapBytes();
      var outputSize = estimateBytes(actual);

      var testMemoryDelta = 0;
      if (heapBefore !== null && heapAfter !== null) {
        testMemoryDelta = Math.max(0, heapAfter - heapBefore);
        peakHeapBytes = Math.max(peakHeapBytes, heapAfter);
      } else {
        testMemoryDelta = inputSize + outputSize + 128;
        totalAllocatedBytes += testMemoryDelta;
      }

      if ((heapAfter && heapAfter > MAX_ALLOWED_BYTES) || totalAllocatedBytes > MAX_ALLOWED_BYTES) {
        memoryExceeded = true;
      }

      var passed = t.custom && t.expected === undefined
        ? true
        : deepEqual(actual, t.expected);

      results.push({
        input: t.input,
        expected: t.expected,
        actual: actual,
        passed: passed,
        error: null,
        durationMs: testDuration,
        memoryBytes: testMemoryDelta,
        logs: window.__currentLogs__.slice()
      });
    } catch (runtimeErr) {
      var testDurationErr = Math.max(0.01, +(performance.now() - testStart).toFixed(2));
      var errMsg = runtimeErr ? (runtimeErr.message || String(runtimeErr)) : 'Runtime error';
      if (errMsg.indexOf('Out of memory') !== -1 || errMsg.indexOf('heap limit') !== -1 || errMsg.indexOf('call stack') !== -1) {
        memoryExceeded = true;
      }
      results.push({
        input: t.input,
        expected: t.expected,
        actual: null,
        passed: false,
        error: errMsg,
        durationMs: testDurationErr,
        memoryBytes: 0,
        logs: window.__currentLogs__.slice()
      });
    }
  }

  var totalTimeMs = Math.max(0.05, +(performance.now() - execStart).toFixed(2));
  var totalMemoryMb;
  var finalBytes;

  if (initialHeap !== null && peakHeapBytes > 0) {
    var rawMb = +(peakHeapBytes / (1024 * 1024)).toFixed(2);
    totalMemoryMb = rawMb < 30 ? +(baselineV8Mb + rawMb).toFixed(2) : rawMb;
    finalBytes = Math.round(totalMemoryMb * 1024 * 1024);
  } else {
    var dynamicMb = +(totalAllocatedBytes / (1024 * 1024)).toFixed(3);
    totalMemoryMb = +(baselineV8Mb + dynamicMb).toFixed(2);
    finalBytes = Math.round(totalMemoryMb * 1024 * 1024);
  }

  window.parent.postMessage({
    type: 'results',
    results: results,
    executionMs: totalTimeMs,
    cpuTimeMs: totalTimeMs,
    memoryBytes: finalBytes,
    memoryUsageMb: totalMemoryMb,
    memoryExceeded: memoryExceeded
  }, '*');
})();
${closeScript}
</body></html>`
}

export const runTests = (
  userCode: string,
  functionName: string,
  tests: readonly TestCase[],
): Promise<ExecutionResult> =>
  new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.style.display = 'none'

    const startTime = Date.now()
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const cleanup = (): void => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      window.removeEventListener('message', onMessage)
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }

    const settle = (result: ExecutionResult): void => {
      if (settled) return
      settled = true
      cleanup()
      resolve(result)
    }

    const onMessage = (event: MessageEvent): void => {
      const source = iframe.contentWindow
      if (source === null || event.source !== (source as unknown)) return
      if (event.data?.type !== 'results') return
      const rawResults = (event.data.results as TestResult[]) || []
      const codeExecutionMs =
        typeof event.data.executionMs === 'number' && event.data.executionMs >= 0
          ? event.data.executionMs
          : Math.max(0.1, Date.now() - startTime)
      const cpuTimeMs =
        typeof event.data.cpuTimeMs === 'number' && event.data.cpuTimeMs >= 0
          ? event.data.cpuTimeMs
          : codeExecutionMs
      const memoryBytes =
        typeof event.data.memoryBytes === 'number' && event.data.memoryBytes > 0
          ? event.data.memoryBytes
          : Math.round(43.8 * 1024 * 1024)
      const memoryUsageMb =
        typeof event.data.memoryUsageMb === 'number' && event.data.memoryUsageMb > 0
          ? event.data.memoryUsageMb
          : Number((memoryBytes / (1024 * 1024)).toFixed(2))
      const memoryExceeded = Boolean(event.data.memoryExceeded)

      settle({
        results: rawResults,
        timedOut: false,
        memoryExceeded,
        executionTimeMs: codeExecutionMs,
        cpuTimeMs,
        memoryBytes,
        memoryUsageMb,
        verdict: deriveVerdict(rawResults, false, memoryExceeded),
      })
    }

    timeoutId = setTimeout(() => {
      const timeoutResults: TestResult[] = tests.map((test) => ({
        input: test.input,
        expected: test.expected,
        actual: null,
        passed: false,
        error: 'Execution timed out — check for an infinite loop',
        durationMs: TIMEOUT_MS,
        memoryBytes: 0,
      }))
      settle({
        results: timeoutResults,
        timedOut: true,
        memoryExceeded: false,
        executionTimeMs: TIMEOUT_MS,
        cpuTimeMs: TIMEOUT_MS,
        memoryBytes: 0,
        memoryUsageMb: 0,
        verdict: 'Time Limit Exceeded',
      })
    }, TIMEOUT_MS)

    window.addEventListener('message', onMessage)
    document.body.appendChild(iframe)
    iframe.srcdoc = buildSandboxHtml(userCode, functionName, tests)
  })
