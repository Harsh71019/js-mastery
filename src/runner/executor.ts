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
}

const TIMEOUT_MS = 5000

const buildSandboxHtml = (
  userCode: string,
  functionName: string,
  tests: readonly TestCase[],
): string => {
  const serializedTests = JSON.stringify(tests)
  const safeFnName = JSON.stringify(functionName)

  return `<!doctype html><html><body><script>
    (function() {
      var tests = ${serializedTests};
      var fnName = ${safeFnName};
      var results = [];

      try {
        eval(${JSON.stringify(userCode)});
      } catch (syntaxErr) {
        tests.forEach(function(t) {
          results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: syntaxErr.message });
        });
        window.parent.postMessage({ type: 'results', results: results }, '*');
        return;
      }

      if (typeof window[fnName] !== 'function') {
        tests.forEach(function(t) {
          results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: 'Function "' + fnName + '" is not defined. Make sure your function name matches exactly.' });
        });
        window.parent.postMessage({ type: 'results', results: results }, '*');
        return;
      }

      tests.forEach(function(t) {
        try {
          var args = Array.isArray(t.input) ? t.input : [t.input];
          var actual = window[fnName].apply(null, args);
          var passed = JSON.stringify(actual) === JSON.stringify(t.expected);
          results.push({ input: t.input, expected: t.expected, actual: actual, passed: passed, error: null });
        } catch (runtimeErr) {
          results.push({ input: t.input, expected: t.expected, actual: null, passed: false, error: runtimeErr.message });
        }
      });

      window.parent.postMessage({ type: 'results', results: results }, '*');
    })();
  <\/script></body></html>`
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
