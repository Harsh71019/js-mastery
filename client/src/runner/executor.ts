export type Verdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Compile Error'
  | 'Time Limit Exceeded'

export interface TestResult {
  readonly input: unknown
  readonly expected: unknown
  readonly actual: unknown
  readonly passed: boolean
  readonly error: string | null
}

export interface ExecutionResult {
  readonly results: readonly TestResult[]
  readonly timedOut: boolean
  readonly executionTimeMs: number
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

const deriveVerdict = (results: readonly TestResult[], timedOut: boolean): Verdict => {
  if (timedOut) return 'Time Limit Exceeded'
  if (results.length === 0) return 'Wrong Answer'
  if (results.every((r) => r.passed)) return 'Accepted'
  const errored = results.filter((r) => r.error !== null)
  if (errored.length === 0) return 'Wrong Answer'
  const isCompileError = results.every((r) => r.error === errored[0].error)
  return isCompileError ? 'Compile Error' : 'Runtime Error'
}

// Injected into the sandbox — key-order-independent, NaN-aware, null/undefined-strict
const DEEP_EQUAL_FN = `function deepEqual(a,b){
  if(a===b)return true;
  if(typeof a==='number'&&typeof b==='number'&&isNaN(a)&&isNaN(b))return true;
  if(a===null||a===undefined||b===null||b===undefined)return false;
  if(typeof a!==typeof b)return false;
  if(Array.isArray(a)!==Array.isArray(b))return false;
  if(Array.isArray(a)){
    if(a.length!==b.length)return false;
    for(var di=0;di<a.length;di++){if(!deepEqual(a[di],b[di]))return false;}
    return true;
  }
  if(typeof a==='object'){
    var ak=Object.keys(a).sort(),bk=Object.keys(b).sort();
    if(ak.length!==bk.length)return false;
    for(var di=0;di<ak.length;di++){
      if(ak[di]!==bk[di])return false;
      if(!deepEqual(a[ak[di]],b[bk[di]]))return false;
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

  return `<!doctype html><html><body>
<script>
window.__tests__ = ${serializedTests};
window.__fnName__ = ${safeFnName};
window.__results__ = [];
window.__error__ = null;
<\/script>
<script>
try {
${userCode}
} catch (e) {
  window.__error__ = e.message;
}
<\/script>
<script>
${DEEP_EQUAL_FN}
(async function () {
  var tests = window.__tests__;
  var fnName = window.__fnName__;
  var results = window.__results__;

  if (window.__error__) {
    tests.forEach(function (t) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: window.__error__ });
    });
    window.parent.postMessage({ type: 'results', results: results, executionMs: 0 }, '*');
    return;
  }

  if (typeof window[fnName] !== 'function') {
    tests.forEach(function (t) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: 'Function "' + fnName + '" is not defined. Check the function name matches the starter code.' });
    });
    window.parent.postMessage({ type: 'results', results: results, executionMs: 0 }, '*');
    return;
  }

  var execStart = performance.now();

  for (var i = 0; i < tests.length; i++) {
    var t = tests[i];
    try {
      var args = Array.isArray(t.input) ? t.input : [t.input];

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

      var passed = deepEqual(actual, t.expected);
      results.push({ input: t.input, expected: t.expected, actual: actual, passed: passed, error: null });
    } catch (runtimeErr) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: runtimeErr.message });
    }
  }

  var executionMs = Math.round(performance.now() - execStart);
  window.parent.postMessage({ type: 'results', results: results, executionMs: executionMs }, '*');
})();
<\/script>
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

    const cleanup = (): void => {
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
      const rawResults = event.data.results as TestResult[]
      const codeExecutionMs =
        typeof event.data.executionMs === 'number' && event.data.executionMs >= 0
          ? event.data.executionMs
          : Math.max(1, Date.now() - startTime)
      settle({
        results: rawResults,
        timedOut: false,
        executionTimeMs: codeExecutionMs,
        verdict: deriveVerdict(rawResults, false),
      })
    }

    const timeoutId = setTimeout(() => {
      const timeoutResults: TestResult[] = tests.map((test) => ({
        input: test.input,
        expected: test.expected,
        actual: null,
        passed: false,
        error: 'Execution timed out — check for an infinite loop',
      }))
      settle({
        results: timeoutResults,
        timedOut: true,
        executionTimeMs: 0,
        verdict: 'Time Limit Exceeded',
      })
    }, TIMEOUT_MS)

    window.addEventListener('message', onMessage)
    document.body.appendChild(iframe)
    iframe.srcdoc = buildSandboxHtml(userCode, functionName, tests)

    void timeoutId
  })
