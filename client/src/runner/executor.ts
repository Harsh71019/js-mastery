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
(async function () {
  var tests = window.__tests__;
  var fnName = window.__fnName__;
  var results = window.__results__;

  if (window.__error__) {
    tests.forEach(function (t) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: window.__error__ });
    });
    window.parent.postMessage({ type: 'results', results: results }, '*');
    return;
  }

  if (typeof window[fnName] !== 'function') {
    tests.forEach(function (t) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: 'Function "' + fnName + '" is not defined. Check the function name matches the starter code.' });
    });
    window.parent.postMessage({ type: 'results', results: results }, '*');
    return;
  }

  for (var i = 0; i < tests.length; i++) {
    var t = tests[i];
    try {
      var args = Array.isArray(t.input) ? t.input : [t.input];
      
      if (t.isEval) {
        args = args.map(function(arg) {
          if (typeof arg === 'string') {
            try {
              return new Function('return ' + arg)();
            } catch (e) {
              return arg;
            }
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
          var arr = [];
          var count = 0;
          var limit = t.take || 100;
          for (var item of actual) {
            arr.push(item);
            if (++count >= limit) break;
          }
          actual = arr;
        } else if (isAsyncGen || isAsyncIter) {
          var arr = [];
          var count = 0;
          var limit = t.take || 100;
          for await (var item of actual) {
            arr.push(item);
            if (++count >= limit) break;
          }
          actual = arr;
        }
      }
      
      var normalizedActual = actual === undefined ? null : actual;
      var normalizedExpected = t.expected === undefined ? null : t.expected;
      
      var passed = JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected);
      results.push({ input: t.input, expected: t.expected, actual: actual, passed: passed, error: null });
    } catch (runtimeErr) {
      results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: runtimeErr.message });
    }
  }

  window.parent.postMessage({ type: 'results', results: results }, '*');
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

    let settled = false

    const cleanup = (): void => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
      window.removeEventListener('message', onMessage)
    }

    const settle = (result: ExecutionResult): void => {
      if (settled) return
      settled = true
      cleanup()
      resolve(result)
    }

    const onMessage = (event: MessageEvent): void => {
      if (event.source !== (iframe.contentWindow as unknown)) return
      if (event.data?.type !== 'results') return
      settle({ results: event.data.results as TestResult[], timedOut: false })
    }

    const timeoutId = setTimeout(() => {
      settle({
        results: tests.map((test) => ({
          input: test.input,
          expected: test.expected,
          actual: null,
          passed: false,
          error: 'Execution timed out — check for an infinite loop',
        })),
        timedOut: true,
      })
    }, TIMEOUT_MS)

    window.addEventListener('message', onMessage)
    document.body.appendChild(iframe)
    iframe.srcdoc = buildSandboxHtml(userCode, functionName, tests)

    void timeoutId
  })
