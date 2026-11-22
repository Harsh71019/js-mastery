const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../server/data/problems/quiz/mcq.json');
const current = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingIds = new Set(current.map(x => x.id));

const newTheoryMcqs = [
  {
    id: 'mcq-theory-v8-shapes',
    title: 'JS Theory: V8 Hidden Classes & Property Insertion Order',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: `Consider two functions initializing objects:

\`\`\`javascript
function createPointA(x, y) {
  const p = {};
  p.x = x;
  p.y = y;
  return p;
}

function createPointB(x, y) {
  const p = {};
  p.y = y;
  p.x = x;
  return p;
}
\`\`\`

How does the V8 engine optimize the internal shapes (hidden classes) of objects returned by \`createPointA\` versus \`createPointB\`?`,
    options: [
      'Both functions create objects with identical hidden classes because their final properties have the same names and types.',
      'They produce objects with different hidden classes because property addition order dictates the shape transition tree.',
      'V8 automatically sorts object keys alphabetically during compilation to merge equivalent shapes.',
      'Hidden classes are only allocated when using the class keyword with constructor.'
    ],
    correctIndex: 1,
    explanation: 'In V8 and JavaScriptCore, objects begin with an empty hidden class. Adding properties transitions the object along a shape tree: createPointA follows empty -> shape(x) -> shape(x, y), whereas createPointB follows empty -> shape(y) -> shape(y, x). Because property offsets and transition paths differ, they have different hidden classes. Mixing both at a single function callsite causes inline caches to deoptimize.',
    patternTag: 'V8 Engine Internals',
    patternExplanation: 'Always initialize object fields in the same order (or initialize in constructors) to allow V8 to reuse shapes and monomorphic inline caches.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-inline-caches',
    title: 'JS Theory: Monomorphic vs Megamorphic Inline Caches',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'In modern JavaScript engines (V8, SpiderMonkey), what is the difference between a Monomorphic and a Megamorphic Inline Cache (IC) when accessing a property `obj.foo`?',
    options: [
      'A monomorphic IC has seen only 1 object shape and generates direct memory offset loads; a megamorphic IC has seen 5+ shapes and falls back to a global hash table lookup.',
      'Monomorphic ICs work only with primitive values, while megamorphic ICs handle object references.',
      'Monomorphic ICs store data on the call stack, while megamorphic ICs allocate cache entries on the heap.',
      'Megamorphic ICs are faster than monomorphic ICs because they utilize multi-threaded speculative execution.'
    ],
    correctIndex: 0,
    explanation: 'Inline Caches (ICs) record observed object shapes at property access sites. If a site only ever encounters 1 shape, it is Monomorphic, allowing compiled code to load the property directly from a fixed memory offset. If it encounters 2-4 shapes, it is Polymorphic. If it encounters 5 or more shapes, it becomes Megamorphic and falls back to generic hash table lookup, significantly degrading throughput.',
    patternTag: 'V8 Engine Internals',
    patternExplanation: 'Avoid passing objects with differing shapes into hot loops and utility functions to prevent inline caches from becoming megamorphic.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-event-loop-microtasks',
    title: 'JS Theory: Event Loop Execution Order & Microtasks',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: `What is the exact console output of the following code?

\`\`\`javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => {
  console.log(3);
  queueMicrotask(() => console.log(4));
}).then(() => console.log(5));
console.log(6);
\`\`\``,
    options: [
      '1, 6, 3, 5, 4, 2',
      '1, 6, 3, 4, 5, 2',
      '1, 6, 2, 3, 4, 5',
      '1, 3, 5, 4, 6, 2'
    ],
    correctIndex: 1,
    explanation: '1 and 6 log synchronously. Next, the microtask queue runs: the first Promise callback logs 3 and enqueues queueMicrotask(4). Then .then(5) is queued after the first Promise resolves. The microtask queue processes sequentially: 4 is at the front of the microtask queue followed by 5. Finally, the microtask queue empties, and the macrotask setTimeout callback runs, logging 2.',
    patternTag: 'Event Loop',
    patternExplanation: 'Microtasks (Promise reactions, queueMicrotask) run continuously until the microtask queue is completely empty before the browser yields to rendering or macrotasks.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-gc-generational',
    title: 'JS Theory: Generational Garbage Collection in V8',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'How does V8 divide memory in its Generational Garbage Collector to minimize pause times?',
    options: [
      "Memory is partitioned into a Young Generation (nursery semi-spaces) collected frequently with Cheney's copying algorithm (Scavenger), and an Old Generation collected with Mark-Sweep-Compact.",
      'Memory is divided into Stack memory for numbers and booleans, and Heap memory for arrays and objects, with GC only running on the Stack.',
      'V8 relies exclusively on reference counting; cyclic references are resolved through a secondary thread without pauses.',
      'Memory is dynamically allocated in 64MB chunks and freed immediately when functions return, eliminating the need for GC cycles.'
    ],
    correctIndex: 0,
    explanation: "V8 is based on the Weak Generational Hypothesis: most objects die young. It divides the heap into the Young Generation (Semi-spaces: From-Space and To-Space), collected rapidly by the Scavenger algorithm. Objects that survive multiple scavenges are tenured into the Old Generation, which is garbage collected less frequently using incremental Mark-Sweep-Compact.",
    patternTag: 'Memory & Garbage Collection',
    patternExplanation: 'Understanding generational GC helps explain why allocating temporary objects inside tight loops triggers frequent minor GC scavenges.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-weakref-finalization',
    title: 'JS Theory: WeakRef and FinalizationRegistry',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'What is the primary characteristic of ECMAScript `WeakRef` and `FinalizationRegistry`?',
    options: [
      'WeakRef prevents garbage collection until deref() is called, whereas FinalizationRegistry forces immediate synchronous memory deallocation.',
      'WeakRef allows holding a reference to an object without preventing it from being garbage-collected, and FinalizationRegistry requests a callback after the target object is reclaimed.',
      'WeakRef converts any object into a primitive symbol that persists across browser reloads.',
      'FinalizationRegistry guarantees that its cleanup callback will execute synchronously in the same tick the object is dereferenced.'
    ],
    correctIndex: 1,
    explanation: 'WeakRef holds a weak reference to a target object, returning the object via weakRef.deref() if it is still alive or undefined if collected. FinalizationRegistry allows registering a cleanup callback that will be called after the object has been garbage collected. Note that the timing of garbage collection and registry callbacks is non-deterministic.',
    patternTag: 'Memory & Garbage Collection',
    patternExplanation: 'WeakRef is useful for memory-sensitive caches, but applications must not rely on exact GC timing or cleanup callback execution.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-proxy-invariants',
    title: 'JS Theory: Proxy Traps and Invariant Enforcement',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: `What happens if a Proxy get trap returns a different value when accessing a non-configurable, non-writable property of the target object?

\`\`\`javascript
const target = {};
Object.defineProperty(target, 'secret', {
  value: 42,
  writable: false,
  configurable: false,
});

const proxy = new Proxy(target, {
  get(t, prop) {
    return 999;
  },
});

console.log(proxy.secret);
\`\`\``,
    options: [
      'It returns 999 because the Proxy handler intercepts all property accesses.',
      'It returns 42 because proxies automatically bypass non-configurable properties.',
      'It throws a TypeError because Proxy handlers are strictly prohibited from violating target invariants.',
      'It returns undefined because conflicting property descriptors are silenced.'
    ],
    correctIndex: 2,
    explanation: "The ECMAScript specification enforces 'invariants' on Proxy handlers to preserve core language integrity. If target property is non-configurable and non-writable, the get trap MUST return the exact same value as the target property. Returning any other value throws a TypeError: 'get' on proxy: property is read-only and non-configurable on target, but the proxy did not return its actual value.",
    patternTag: 'Proxy & Metaprogramming',
    patternExplanation: 'Proxy traps cannot contradict the invariants of non-configurable or non-extensible target properties.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-symbol-toprimitive',
    title: 'JS Theory: Symbol.toPrimitive Coercion Algorithm',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'What hints does the `Symbol.toPrimitive` method receive during type conversion?',
    options: [
      "'number', 'string', and 'default'",
      "'boolean', 'number', and 'object'",
      "'strict' and 'loose'",
      "'implicit' and 'explicit'"
    ],
    correctIndex: 0,
    explanation: "The well-known symbol Symbol.toPrimitive specifies a method called to convert an object to a corresponding primitive value. It is invoked with one of three string hints: 'number' (e.g. unary +, Math methods), 'string' (e.g. String(), template literals), or 'default' (e.g. binary +, loose equality == where both number and string are permissible).",
    patternTag: 'Type Coercion',
    patternExplanation: 'Symbol.toPrimitive takes precedence over valueOf() and toString() when converting objects to primitives.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-esm-live-bindings',
    title: 'JS Theory: ESM Live Bindings vs CommonJS Value Copies',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'How do ES Module (ESM) exports differ fundamentally from CommonJS module.exports when an exported variable is mutated inside the exporting module?',
    options: [
      "ESM exports are 'live bindings' (read-only views of the exporter internal variables), reflecting updates when mutated; CommonJS exports copy values onto an exported object at the time of execution.",
      'CommonJS supports live bindings via getters, while ESM creates static immutable snapshots that never change.',
      'ESM clones all exported values using structured cloning upon import to ensure thread safety.',
      'Both module systems behave identically because JavaScript runs in a single-threaded event loop.'
    ],
    correctIndex: 0,
    explanation: 'In ESM, export let count = 0 creates a live binding. When count++ executes in the exporting module, any importing module reading count observes the updated value in real-time. In CommonJS, module.exports = { count } evaluates once and copies the primitive value; subsequent mutations in the exporting file do not alter the imported object property.',
    patternTag: 'Module Systems',
    patternExplanation: 'ESM modules create live bindings that reflect runtime updates, unlike CommonJS module exports which capture values at load time.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-closure-memory-retention',
    title: 'JS Theory: Scope Sharing and Closure Memory Leaks',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: `Why can the following pattern cause an unexpected memory leak in JavaScript engines?

\`\`\`javascript
let theThing = null;
const replaceThing = function () {
  const originalThing = theThing;
  const unused = function () {
    if (originalThing) console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join("*"),
    someMethod: function () {}
  };
};
setInterval(replaceThing, 1000);
\`\`\``,
    options: [
      'Both unused and someMethod share the same lexical scope environment record; because theThing.someMethod is retained, the entire scope (including originalThing) remains retained in memory.',
      'setInterval retains a strong reference to the entire global object on each tick.',
      'new Array().join() cannot be collected by V8 garbage collectors.',
      'Arrow functions are required in intervals to release inner scope closures.'
    ],
    correctIndex: 0,
    explanation: 'This is the classic Meteor closure memory leak. In V8, functions created within the same lexical context share the same scope object. Because someMethod is retained on theThing, its parent scope remains alive. That scope contains originalThing, which points to the previous theThing, creating an uncollectable linked chain of large arrays on every interval invocation.',
    patternTag: 'Closures & Memory',
    patternExplanation: 'Closures in the same lexical block share a scope environment. If one closure is retained, unreferenced variables captured by sibling closures can be kept alive in memory.',
    estimatedMinutes: 5,
    status: 'published'
  },
  {
    id: 'mcq-theory-layout-thrashing',
    title: 'JS Theory: Layout Thrashing (Forced Synchronous Layout)',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: "What causes 'Layout Thrashing' in web applications, and how should it be avoided?",
    options: [
      'Alternating between writing to the DOM (e.g. el.style.width) and reading geometric properties (e.g. el.offsetWidth) in a loop, forcing the browser to recalculate layout repeatedly.',
      'Using CSS grid instead of flexbox for complex responsive layouts.',
      'Attaching multiple click event listeners to child elements instead of using event delegation.',
      'Rendering canvas elements alongside SVG graphics on the main thread.'
    ],
    correctIndex: 0,
    explanation: 'Browsers batch style and layout calculations lazily. However, when code modifies an element style and immediately asks for geometric information (e.g. offsetWidth, clientHeight, getBoundingClientRect), the browser is forced to flush pending style changes and perform a synchronous layout. Doing this in a loop causes repeated forced reflows, known as Layout Thrashing. To prevent it, batch all reads first, then batch all writes.',
    patternTag: 'Browser Rendering Pipeline',
    patternExplanation: 'Always batch DOM layout reads before DOM writes, or use requestAnimationFrame to schedule writes on the next frame.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-compositing-layers',
    title: 'JS Theory: GPU Compositing Layers & will-change',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'What is the benefit and potential downside of promoting an element to its own GPU Compositing Layer using `will-change: transform`?',
    options: [
      'Benefit: Transformations can be animated on the compositor thread without triggering layout or paint; Downside: Excessive layers consume significant GPU VRAM and can cause memory exhaustion.',
      'Benefit: The element executes JavaScript on a background web worker thread; Downside: CSS animations are disabled.',
      'Benefit: The element becomes immune to XSS attacks; Downside: It cannot receive pointer events.',
      'Benefit: Reduces network latency for image assets; Downside: Degrades SEO ranking.'
    ],
    correctIndex: 0,
    explanation: 'Promoting an element to a composite layer allows the compositor thread on the GPU to handle transforms and opacity changes directly, bypassing both layout and paint on the CPU main thread. However, each layer requires its own bitmap stored in GPU memory. Creating too many layers consumes vast amounts of VRAM and CPU-GPU bandwidth.',
    patternTag: 'Browser Rendering Pipeline',
    patternExplanation: 'Use will-change sparingly and remove it when animations finish to prevent unnecessary GPU memory consumption.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-samesite-cookies',
    title: 'JS Theory: SameSite Cookie Attributes & CSRF',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'How does `SameSite=Lax` cookie behavior protect users against Cross-Site Request Forgery (CSRF)?',
    options: [
      'Cookies are withheld on cross-site requests (like POST forms or image embeds), but are sent when the user navigates top-level to the origin site (e.g. following a standard link).',
      'Cookies are never sent under any cross-origin circumstances, even when clicking an external link.',
      'Cookies are encrypted using the client public key before transmission.',
      'Cookies can only be accessed by JavaScript running inside HTTPS iframes.'
    ],
    correctIndex: 0,
    explanation: 'SameSite=Lax blocks cookies from being sent on cross-site subrequests (such as cross-origin POST forms, AJAX fetch requests, or images), preventing classic CSRF exploits. However, it still attaches cookies on safe top-level navigations (e.g. clicking a standard GET link to the site from an external search engine).',
    patternTag: 'Web Security',
    patternExplanation: 'SameSite=Lax is the modern browser default and provides baseline CSRF defense for state-changing cross-origin requests.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-async-iterators-backpressure',
    title: 'JS Theory: Asynchronous Generators & Backpressure',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'How does the `for await...of` loop handle backpressure when consuming an asynchronous generator?',
    options: [
      'It pauses consumption and does not invoke .next() on the generator until the promise returned by the current iteration has fulfilled.',
      'It reads all generator yields concurrently and buffers them in an internal FIFO queue.',
      'It drops items if the consumer takes longer than 16.6ms to process each item.',
      'It spawns a background Web Worker to consume the generator in parallel.'
    ],
    correctIndex: 0,
    explanation: 'for await...of guarantees sequential processing. It awaits the promise returned by iterator.next(), executes the loop body with the resolved value, and only requests the next item after the current loop iteration completes. This naturally provides backpressure, preventing fast producers from overwhelming slow consumers.',
    patternTag: 'Async & Generators',
    patternExplanation: 'for await...of provides built-in backpressure by waiting for both the yield promise and loop body execution before pulling the next value.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-prototype-dictionary-mode',
    title: 'JS Theory: Object.create(null) vs Object Literal {}',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'Why is `Object.create(null)` preferred over `{}` when implementing a pure hash map or key-value lookup table?',
    options: [
      'Object.create(null) has no prototype (__proto__ is undefined), preventing collisions with built-in properties like toString, valueOf, or prototype pollution attacks.',
      'Object.create(null) allocates memory directly in the nursery space without garbage collection.',
      'Object.create(null) is an immutable data structure by default.',
      'Object.create(null) automatically converts string keys into 64-bit integer hashes.'
    ],
    correctIndex: 0,
    explanation: 'A standard object literal {} inherits from Object.prototype, containing properties like hasOwnProperty, toString, constructor, and __proto__. If user input supplies a key matching one of these names, it can overwrite methods or manipulate prototype chains. Object.create(null) has a prototype of null, making every key lookup safe.',
    patternTag: 'Prototypes & Objects',
    patternExplanation: 'Use Object.create(null) or Map for dictionary lookups to eliminate prototype property collisions and prototype pollution vulnerabilities.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-structured-clone',
    title: 'JS Theory: Structured Clone Algorithm Capabilities',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'Which of the following data types CANNOT be cloned using the native `structuredClone()` API?',
    options: [
      'Functions and DOM nodes',
      'Circular references and Maps',
      'Date objects and RegExp instances',
      'TypedArrays and ArrayBuffers'
    ],
    correctIndex: 0,
    explanation: 'structuredClone() supports circular references, Sets, Maps, Dates, RegExps, TypedArrays, and Error objects. However, attempting to clone Functions, DOM Nodes, or Symbols throws a DataCloneError.',
    patternTag: 'JavaScript APIs',
    patternExplanation: 'structuredClone handles complex nested structures and cyclic graphs, but cannot serialize executable functions or DOM elements.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-promise-any-vs-race',
    title: 'JS Theory: Promise.any vs Promise.race Failure Semantics',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'How does `Promise.any()` differ from `Promise.race()` when the first settling promise rejects?',
    options: [
      'Promise.race() rejects immediately with the first rejection reason; Promise.any() ignores rejections and waits for the first fulfillment, only rejecting with an AggregateError if all promises reject.',
      'Promise.any() returns the first rejected promise, while Promise.race() returns null.',
      'Promise.any() catches synchronous errors, while Promise.race() throws unhandled rejections.',
      'Both methods reject immediately if any promise in the array fails.'
    ],
    correctIndex: 0,
    explanation: 'Promise.race settles as soon as ANY promise settles (whether fulfilled or rejected). If the fastest promise rejects, Promise.race rejects immediately. Conversely, Promise.any looks for the first FULFILLED promise. It ignores individual rejections until ALL promises reject, in which case it rejects with an AggregateError containing all errors.',
    patternTag: 'Promises & Async',
    patternExplanation: 'Use Promise.any when you need the fastest successful response (e.g. querying fallback mirrors), and Promise.race when timeout or earliest cancellation is needed.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-event-delegation-phases',
    title: 'JS Theory: DOM Event Propagation & Delegation',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'What are the three sequential phases of DOM event dispatch as defined by the W3C Event specification?',
    options: [
      'Capture Phase (Root down to target) -> Target Phase -> Bubble Phase (Target up to root)',
      'Bubble Phase -> Target Phase -> Capture Phase',
      'Trigger Phase -> Propagation Phase -> Resolution Phase',
      'Dispatch Phase -> Listener Phase -> GC Phase'
    ],
    correctIndex: 0,
    explanation: 'When an event occurs, it first travels down the DOM tree from the window and document to the target during the Capture Phase. Next, it triggers listeners registered directly on the target during the Target Phase. Finally, it bubbles back up through ancestor elements to the root during the Bubble Phase (unless event.stopPropagation() is called).',
    patternTag: 'DOM & Events',
    patternExplanation: 'addEventListener(type, handler, true) registers for the capture phase, whereas addEventListener(type, handler, false) registers for the bubble phase.',
    estimatedMinutes: 3,
    status: 'published'
  },
  {
    id: 'mcq-theory-temporal-dead-zone',
    title: 'JS Theory: Temporal Dead Zone (TDZ) Mechanics',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: `Why does accessing variable \`x\` in the function call below throw a ReferenceError?

\`\`\`javascript
let x = 10;
function test(y = x, x) {
  return y;
}
test(undefined, 20);
\`\`\``,
    options: [
      'Parameter default values evaluate in an intermediate scope where parameter `x` is already hoisted but in its Temporal Dead Zone prior to parameter assignment.',
      'Default parameters cannot reference any variables outside the function.',
      'The variable `x` is private to the module and cannot be read as a default argument.',
      'Function arguments can only be primitives, not identifiers.'
    ],
    correctIndex: 0,
    explanation: 'Function parameters form their own scope during invocation. In `function test(y = x, x)`, the parameter identifier `x` shadows the outer `let x = 10`. When `y = x` evaluates, parameter `x` is in its Temporal Dead Zone (declared in parameter scope but not yet initialized), throwing a ReferenceError: Cannot access x before initialization.',
    patternTag: 'Scoping & Closures',
    patternExplanation: 'Parameter default expressions evaluate from left to right in their own scope. An earlier parameter cannot reference a later parameter because the later parameter is in TDZ.',
    estimatedMinutes: 4,
    status: 'published'
  },
  {
    id: 'mcq-theory-react-concurrent-fibers',
    title: 'JS Theory: React Concurrent Mode & Fiber Reentrancy',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Hard',
    description: 'In React 18+ Concurrent Mode, how does the Fiber architecture enable time-slicing and interruptible rendering?',
    options: [
      'The component tree is represented as a linked-list of Fiber nodes; the work loop checks `shouldYield()` between fibers and can yield control to the browser main thread to process user input before resuming.',
      'React compiles all components into WebAssembly threads that execute concurrently on separate CPU cores.',
      'Virtual DOM elements are rendered directly onto a hidden OffscreenCanvas using WebGL.',
      'React overrides the browser V8 garbage collector to prevent pauses during state updates.'
    ],
    correctIndex: 0,
    explanation: 'Unlike the old recursive stack reconciler which blocked the main thread until the entire tree rendered, Fiber models the tree as a linked list (child, sibling, return pointers). The work loop processes units of work one fiber at a time. After processing a fiber, it checks if the 5ms deadline has passed via the Scheduler. If so, it pauses, yields to the browser for user input or frame rendering, and later resumes.',
    patternTag: 'Frontend Architecture',
    patternExplanation: 'Fiber enables interruptible rendering by breaking component tree reconciliation into cooperative units of work along a linked list.',
    estimatedMinutes: 5,
    status: 'published'
  },
  {
    id: 'mcq-theory-core-web-vitals-inp',
    title: 'JS Theory: Interaction to Next Paint (INP) vs First Input Delay (FID)',
    type: 'mcq',
    category: 'tricky-patterns',
    difficulty: 'Medium',
    description: 'Why did Google replace First Input Delay (FID) with Interaction to Next Paint (INP) as a Core Web Vital?',
    options: [
      'FID only measured the input delay of the very first user interaction; INP measures the worst-case interaction latency (input delay + processing time + presentation delay) across the entire page lifecycle.',
      'FID was incompatible with mobile devices, whereas INP only measures touch events.',
      'INP measures network round-trip time, while FID measured CPU temperature.',
      'FID required server-side tracking, while INP is computed in the Service Worker.'
    ],
    correctIndex: 0,
    explanation: 'First Input Delay (FID) only captured the time between the user first interaction (e.g. click) and when the main thread began processing the event handler. It ignored the time taken to run the event handler and the time for the browser to paint the visual update. INP addresses this by measuring the end-to-end responsiveness of all interactions throughout the page visit.',
    patternTag: 'Web Performance',
    patternExplanation: 'Optimizing INP requires breaking up long JavaScript tasks and yielding to the main thread with setTimeout or scheduler.yield() before updating UI.',
    estimatedMinutes: 4,
    status: 'published'
  }
];

let added = 0;
for (const item of newTheoryMcqs) {
  if (!existingIds.has(item.id)) {
    current.push(item);
    existingIds.add(item.id);
    added++;
  }
}

fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n', 'utf8');
console.log(`Successfully added ${added} theory MCQs. Total now: ${current.length}`);
