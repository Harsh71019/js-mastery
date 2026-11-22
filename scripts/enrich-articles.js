const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '../server/data/articles/engineering_blogs.json')
const articles = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

const domainMapping = {
  // JavaScript & V8
  'v8-fast-properties': 'javascript-v8',
  'mathias-shapes-ics': 'javascript-v8',
  'jake-event-loop': 'javascript-v8',
  'lydia-js-engine-event-loop': 'javascript-v8',
  'dan-abramov-useeffect': 'javascript-v8',
  'nodejs-memory-leak-profiling': 'javascript-v8',
  'microsoft-typescript-evolution': 'javascript-v8',

  // Distributed Systems
  'stripe-idempotency': 'distributed-systems',
  'google-spanner-paper': 'distributed-systems',
  'amazon-dynamo-paper': 'distributed-systems',
  'discord-trillions-messages': 'distributed-systems',
  'uber-schemaless': 'distributed-systems',
  'razorpay-outbox-pattern': 'distributed-systems',
  'razorpay-concurrency': 'distributed-systems',
  'razorpay-payments-idempotency': 'distributed-systems',
  'phonepe-bullhorn': 'distributed-systems',
  'uber-push-grpc': 'distributed-systems',
  'uber-ramen-push': 'distributed-systems',
  'amazon-s3-consistency': 'distributed-systems',
  'stripe-distributed-tracing': 'distributed-systems',
  'stripe-robust-distributed-systems': 'distributed-systems',
  'ola-real-time-web': 'distributed-systems',

  // Frontend & Web Performance
  'zomato-micro-frontends': 'frontend-performance',
  'webdev-optimize-lcp-inp': 'frontend-performance',
  'chrome-inside-browser-part1': 'frontend-performance',
  'chrome-inside-browser-rendering': 'frontend-performance',
  'vercel-app-router-works': 'frontend-performance',
  'vercel-edge-functions-explained': 'frontend-performance',
  'meta-redesign-facebook': 'frontend-performance',
  'github-actions-rebuilt': 'frontend-performance',

  // Databases & Caching
  'kleppmann-btrees-vs-lsm': 'databases-caching',
  'swiggy-caching-system': 'databases-caching',
  'planetscale-how-vitess-works': 'databases-caching',
  'shopify-40m-flash-sale': 'databases-caching',
  'google-dremel-paper': 'databases-caching',
  'flipkart-data-platform-foundation': 'databases-caching',
  'zomato-ipl-surges': 'databases-caching',
  'flipkart-flash-sales': 'databases-caching',
  'flipkart-search-scale': 'databases-caching',

  // Architecture & Design
  'airbnb-server-driven-ui': 'architecture-design',
  'figma-multiplayer-engine': 'architecture-design',
  'slack-api-evolution': 'architecture-design',
  'whatsapp-1m-connections': 'architecture-design',
  'airbnb-building-services': 'architecture-design',
  'uber-michelangelo': 'architecture-design',
  'netflix-video-encoding-scale': 'architecture-design',
  'x-recommendation-algorithm': 'architecture-design',
  'x-ranking-algorithm': 'architecture-design',
  'meta-graphql-scaling': 'architecture-design',
  'zomato-menu-ml': 'architecture-design',
  'swiggy-cart-pricing-engine': 'architecture-design',
  'uber-cash-platform': 'architecture-design',
  'amazon-architecture-overview': 'architecture-design',

  // Reliability & Security
  'netflix-chaos-engineering': 'reliability-security',
  'netflix-fault-tolerance-hystrix': 'reliability-security',
  'swiggy-resilient-microservices': 'reliability-security',
  'stripe-rate-limiters': 'reliability-security',
  'cred-app-security': 'reliability-security',
  'cloudflare-why-rust': 'reliability-security',
  'cloudflare-introducing-workers': 'reliability-security',
  'cloudflare-edge-middleware': 'reliability-security',
  'cloudflare-pingora-rust': 'reliability-security',
  'datadog-what-is-observability': 'reliability-security',
  'datadog-microservice-observability': 'reliability-security',
  'google-sre-intro': 'reliability-security',
  'google-monorepo-cacm': 'reliability-security',
  'google-borg-cluster': 'reliability-security',
  'netflix-full-cycle-devs': 'reliability-security',
  'netflix-open-connect-cdn': 'reliability-security',
  'github-ruby-upgrade-zero-downtime': 'reliability-security',
  'mozilla-csp-nonce-hardening': 'reliability-security',
  'swiggy-checkout-service': 'reliability-security',
  'x-engineering-overhaul': 'reliability-security',
  'discord-why-rust': 'reliability-security',
  'railway-building-platform': 'reliability-security',
}

const deepDives = {
  'stripe-idempotency': {
    domain: 'distributed-systems',
    takeaways: [
      'Idempotency keys ensure at-most-once execution for financial and mutative requests.',
      'Distributed locks or atomic database unique constraints must protect against race conditions during retry bursts.',
      'Always store the HTTP status code and response body alongside the idempotency record to replay identical responses instantly.',
      'Reject subsequent requests that arrive with the same idempotency key but a modified payload with HTTP 422/400 (Idempotency Key Conflict).'
    ],
    content: `## The Core Problem at Stripe Scale
In high-volume payment processing, network timeouts and transient drops are unavoidable. If an API consumer sends a \`POST /v1/charges\` request and the TCP connection drops before receiving an acknowledgment, the client has no way to know whether the charge went through or timed out before execution.

Retrying without safety leads to double billing customers—an unacceptable financial failure mode.

\`\`\`
Client                     Stripe API Gateway               Payment Engine
  |                                |                               |
  |--- POST /charges ($50) ------->|                               |
  |    (Idempotency-Key: abc-123)  |--- Acquire Redis Lock ------->|
  |                                |--- Check Cache/DB ------------|
  |                                |    [Status: IN_PROGRESS]      |
  |                                |--- Process Transaction ------>| (Success)
  |                                |<-- Write Response ($50 Chg)---|
  |  (Connection Times Out!)       |--- Save in DB & Cache --------|
  x                                |                               |
  |                                |                               |
  |--- RETRY POST /charges ($50) ->|                               |
  |    (Same Key: abc-123)         |--- Check Cache/DB ------------|
  |                                |    [Found: Cached Response]   |
  |<-- 200 OK (Replay Cached) -----| (No Double Charge!)           |
\`\`\`

## System Architecture & Mechanics
Stripe utilizes client-generated unique UUIDs sent via the \`Idempotency-Key\` HTTP header.

1. **Atomic Request Locking**: When a request arrives, the server hashes the request method, path, and payload. It attempts to acquire an atomic distributed lock (via Redis with a short TTL, e.g., 60 seconds).
2. **Payload Hash Verification**: If an idempotency record already exists, the server checks if the request body hash matches the stored hash. If the payload differs, it returns \`400 Bad Request\` / \`Idempotency Conflict\` to prevent malicious key re-use.
3. **In-Flight Handling**: If a concurrent duplicate arrives while the initial request is still processing, the second request yields or polls with exponential backoff until the first completes.
4. **Replay Persistence**: Once processed, the response headers, HTTP status code (e.g. 200), and JSON response body are committed to a transactional store with a 24-48 hour TTL. Subsequent retries bypass the payment engine and replay the cached payload with zero latency.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Production Express/Node.js Idempotency Middleware',
        code: `import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idempotencyKey = req.header('Idempotency-Key')
  if (!idempotencyKey) return next()

  // Hash payload to detect concurrent conflicts
  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(req.body || {}))
    .digest('hex')

  const cacheKey = \`idempotency:\${idempotencyKey}\`
  const lockKey = \`lock:\${cacheKey}\`

  // 1. Check for existing cached execution
  const existing = await redis.get(cacheKey)
  if (existing) {
    const { hash, status, body } = JSON.parse(existing)
    if (hash !== payloadHash) {
      return res.status(422).json({
        error: 'Idempotency conflict: key was previously used with a different request payload.'
      })
    }
    return res.status(status).set('X-Cache-Replay', 'true').json(body)
  }

  // 2. Acquire atomic distributed lock for in-flight protection
  const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 30)
  if (!acquired) {
    return res.status(409).json({
      error: 'Concurrent request in progress for this Idempotency-Key. Please retry shortly.'
    })
  }

  // 3. Intercept response to persist upon completion
  const originalJson = res.json.bind(res)
  res.json = (body: any) => {
    // Save response atomically for subsequent retries
    redis.set(
      cacheKey,
      JSON.stringify({ hash: payloadHash, status: res.statusCode, body }),
      'EX',
      86400 // 24-hour TTL
    )
    redis.del(lockKey)
    return originalJson(body)
  }

  next()
}`,
        explanation: 'Uses Redis atomic SET NX EX to guard against concurrent replay spikes, validates SHA-256 payload consistency, and automatically caches response status and body for 24 hours.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'What should an idempotent API do if a client sends an existing Idempotency Key with a different request body?',
        options: [
          'Overwrite the old transaction with the new payload',
          'Reject the request with an Idempotency Conflict error (400/422)',
          'Silently replay the previous response without checking',
          'Create a new charge with an incremented ID'
        ],
        correctIndex: 1,
        explanation: 'Reusing an idempotency key with differing parameters is an error. Hashing request parameters allows servers to detect mutations and abort with an idempotency conflict code.'
      },
      {
        question: 'Why must the idempotency check acquire an atomic lock before executing business logic?',
        options: [
          'To prevent concurrent duplicate requests from executing simultaneously before either finishes',
          'To compress the database payload size',
          'To bypass TLS handshake latency',
          'Because Redis only supports synchronous queries'
        ],
        correctIndex: 0,
        explanation: 'Without an atomic distributed lock, two identical requests arriving milliseconds apart would both find no cached result and execute double mutative operations simultaneously.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you design an end-to-end idempotent payment endpoint when both Redis and SQL databases are involved?',
        sampleAnswer: '1. Validate client Idempotency-Key header.\n2. In Redis, query key idempotency:{key}. If found, check payload hash and replay.\n3. If not found, acquire a short-lived Redis lock with SET NX EX 30s to prevent concurrent duplicate execution.\n4. Inside PostgreSQL, maintain an idempotency table with a UNIQUE constraint on idempotency_key.\n5. Run the payment and write the transaction response inside the same DB transaction or outbox.\n6. Cache the finalized response in Redis with a 24-hour TTL and release the lock.'
      }
    ]
  },

  'v8-fast-properties': {
    domain: 'javascript-v8',
    takeaways: [
      'V8 transitions JavaScript objects through hidden classes (Shapes/Maps) to achieve C++ like struct performance.',
      'In-Object properties are stored directly on the object memory buffer and are the fastest property accesses in V8.',
      'Adding properties in different orders creates divergent hidden class transitions, de-optimizing Inline Caches.',
      'Deleting properties with delete operator transitions objects into Slow/Dictionary Mode (hash table fallback), severely harming performance.'
    ],
    content: `## JavaScript Objects are Not Hash Tables
In standard ECMAScript specification, objects behave like associative arrays (maps of string keys to values). However, dynamic hash table lookups are far too slow for high-performance rendering and algorithmic processing.

To achieve near-C++ memory speeds, the Google V8 engine (Chrome & Node.js) represents objects using **Hidden Classes** (also called **Shapes** or **Maps**).

\`\`\`
Point Object                  Hidden Class (Shape)
[ Shape Reference ] --------> [ Shape 0: Offset 0 -> x ]
[ Slot 0: 10      ]                    |
[ Slot 1: 20      ]                    v Add 'y'
                              [ Shape 1: Offset 1 -> y ]
\`\`\`

## The Three Tiers of V8 Properties
1. **In-Object Properties**: Stored directly on the JSObject memory chunk itself. These offer the fastest possible memory access (direct pointer offset calculation).
2. **Fast / Backing Store Properties**: When an object exceeds its in-object property allocation (typically 4 properties), extra properties are placed in a contiguous linear array pointed to by an internal pointer.
3. **Slow / Dictionary Properties**: If you use the \`delete\` keyword or add excessive dynamic keys, V8 abandons shapes and converts the backing store into a standard dictionary hash table, causing a 5x-10x performance penalty.`,
    codeSnippets: [
      {
        language: 'javascript',
        title: 'Optimizing V8 Object Shapes & Preventing De-optimization',
        code: `// 1. GOOD: Consistent initialization order creates ONE shared Shape
function createVector(x, y) {
  return { x, y }; // Shape_0 -> Shape_1 (Consistent transition tree)
}

const v1 = createVector(10, 20);
const v2 = createVector(30, 40); // Shares identical shape with v1!

// 2. BAD: Different insertion orders create branched Shapes
const objA = {};
objA.x = 1;
objA.y = 2; // Transition: {} -> {x} -> {x, y}

const objB = {};
objB.y = 2;
objB.x = 1; // Transition: {} -> {y} -> {y, x} (DIFFERENT SHAPE!)
// Inline caches encountering objA and objB become Polymorphic / Megamorphic!

// 3. BAD: delete operator forces Slow/Dictionary Mode
const user = { id: 101, name: 'Alice', token: 'xyz' };
delete user.token; // FORCES user into Dictionary Mode (Hash Table)

// 4. GOOD: Set to undefined or null instead of delete
user.token = undefined; // Preserves Fast Properties shape!`,
        explanation: 'Demonstrates how consistent property initialization order enables V8 Inline Caches (ICs) to stay monomorphic, and why setting unused properties to undefined is drastically faster than using the delete operator.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why does using the `delete` operator on an object degrade JavaScript performance in V8?',
        options: [
          'It clears the V8 garbage collection heap',
          'It transitions the object from Fast Shape Mode into Slow Dictionary (Hash Table) Mode',
          'It forces synchronous disk writes',
          'It changes numbers from floats into strings'
        ],
        correctIndex: 1,
        explanation: 'Deleting properties breaks the linear shape transition chain, forcing V8 to abandon optimized hidden classes and fall back to a dictionary hash table.'
      },
      {
        question: 'What is a "Monomorphic" inline cache in V8?',
        options: [
          'An IC that has observed only one consistent object Shape across repeated executions',
          'A cache that only stores boolean values',
          'A memory leak caused by event listeners',
          'A garbage collector phase for generational memory'
        ],
        correctIndex: 0,
        explanation: 'When a function receives objects that always have the exact same shape, the IC is monomorphic and compiles down to a single direct memory offset instruction without lookup checks.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What are hidden classes and inline caches (ICs) in V8, and how do they impact function performance?',
        sampleAnswer: 'V8 assigns every object a hidden class (Shape) that maps property names to memory offsets. When a function reads obj.x repeatedly, V8’s Inline Cache records the Shape and offset. If future calls receive objects with the same Shape, V8 generates a direct memory read without hash lookups (Monomorphic). If 2-4 shapes are seen, it becomes Polymorphic. If >4 shapes are seen, it falls back to Megamorphic (slow dictionary lookup).'
      }
    ]
  },

  'jake-event-loop': {
    domain: 'javascript-v8',
    takeaways: [
      'The Microtask queue (Promises, queueMicrotask, MutationObserver) drains COMPLETELY before the next macrotask or render phase.',
      'Starving the microtask queue with infinite Promise chains completely freezes UI rendering and user interactions.',
      'requestAnimationFrame runs immediately BEFORE layout, paint, and composite calculations.',
      'setTimeout and setInterval callbacks are macrotasks that run on the next event loop turn with a minimum ~4ms clamping delay.'
    ],
    content: `## The Anatomy of the Event Loop
Many developers believe JavaScript executes chronologically based on timer delays. In reality, the JavaScript runtime is governed by the Event Loop phases:

\`\`\`
+--------------------------------------------------------+
|                      CALL STACK                        |
|  (Executes Synchronous JavaScript Code to Completion)   |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                    MICROTASK QUEUE                     |
|  (Promise.then, queueMicrotask, MutationObserver)      |
|  * DRAINS COMPLETELY UNTIL EMPTY BEFORE PROCEEDING *   |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                  RENDER OPPORTUNITY                    |
|  (requestAnimationFrame -> Style -> Layout -> Paint)   |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                     MACROTASKS                         |
|  (setTimeout, setInterval, I/O, UI Events, MessagePort)|
|  * EXECUTES ONE TASK PER LOOP ITERATION *              |
+--------------------------------------------------------+
\`\`\`

## Microtasks vs Macrotasks
- **Microtasks**: Scheduled via \`Promise.resolve().then()\`, \`queueMicrotask()\`, or async/await continuations. The engine **MUST drain all microtasks** before yielding control back to browser rendering or macrotasks.
- **Macrotasks**: Scheduled via \`setTimeout\`, \`setImmediate\`, or I/O events. The event loop takes **only one macrotask** per iteration, and then re-evaluates microtasks and rendering.`,
    codeSnippets: [
      {
        language: 'javascript',
        title: 'Microtask vs Macrotask vs Animation Frame Execution Order',
        code: `console.log('1: Sync script start');

setTimeout(() => {
  console.log('6: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask 1');
}).then(() => {
  console.log('4: Microtask 2');
});

queueMicrotask(() => {
  console.log('5: Microtask 3 (queueMicrotask)');
});

requestAnimationFrame(() => {
  console.log('Render: requestAnimationFrame');
});

console.log('2: Sync script end');

// ORDER OF OUTPUT:
// 1: Sync script start
// 2: Sync script end
// 3: Microtask 1
// 4: Microtask 2
// 5: Microtask 3 (queueMicrotask)
// Render: requestAnimationFrame (before next paint)
// 6: Macrotask (setTimeout)`,
        explanation: 'Illustrates that synchronous code finishes first, followed by exhaustive drainage of the microtask queue, then browser paint step (rAF), and finally the next macrotask.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'What happens if a recursive function schedules microtasks using queueMicrotask without termination?',
        options: [
          'The browser safely skips to the next setTimeout',
          'The call stack immediately exceeds maximum size',
          'The event loop freezes, blocking all UI rendering and macrotasks',
          'The memory is automatically garbage collected'
        ],
        correctIndex: 2,
        explanation: 'Because the event loop refuses to proceed to rendering or macrotasks until the microtask queue is 100% empty, infinite microtask generation causes a complete UI lockup.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Explain the exact execution order between Promise.then, setTimeout(0), and requestAnimationFrame.',
        sampleAnswer: '1. Synchronous call stack executes to completion.\n2. Microtask queue (Promise.then, queueMicrotask) drains completely.\n3. If the display refresh interval is due (e.g. 60Hz/120Hz), requestAnimationFrame callbacks execute right before style recalibration, layout, and paint.\n4. Finally, the event loop dequeues one macrotask (setTimeout).'
      }
    ]
  },

  'zomato-micro-frontends': {
    domain: 'frontend-performance',
    takeaways: [
      'Micro-frontends allow independent engineering squads to build and deploy distinct business domains autonomously.',
      'Webpack Module Federation enables sharing common vendor dependencies (React, design system) dynamically at runtime.',
      'Routing coordination and CSS isolation are the two most common operational pitfalls in micro-frontend architectures.',
      'A container shell application coordinates cross-app communication via custom events or lightweight pub/sub.'
    ],
    content: `## Why Zomato Migrated from Monolith to Micro-Frontends
As Zomato grew into food delivery, quick commerce (Blinkit), and dining out, maintaining a single monolithic web codebase became a bottleneck. Deploying a minor button change required rebuilding and regression-testing the entire multi-feature website.

Zomato adopted **Module Federation** to decouple independent domains into independently deployable micro-frontends coordinated by a parent shell application.

\`\`\`
                    [ HOST SHELL APPLICATION ]
                (Authentication, Global State, Router)
                                  |
         +------------------------+------------------------+
         |                                                 |
         v                                                 v
[ REMOTE: Restaurant Discovery ]                 [ REMOTE: Cart & Checkout ]
(Deployed to CDN 1 independently)                (Deployed to CDN 2 independently)
\`\`\`

## Key Technical Decisions
1. **Module Federation**: Unlike runtime iframes which break accessibility and keyboard navigation, Module Federation imports compiled remote ES chunks directly into the host browser memory space.
2. **Shared Singletons**: React, ReactDOM, and the UI design system are declared as shared singletons (\`singleton: true\`) so multiple instances are never bundled or duplicated.
3. **Resilient Fallbacks**: If a remote micro-frontend fails to load from the CDN, the host shell wraps the remote in an \`ErrorBoundary\` with a localized skeleton loader instead of crashing the entire user experience.`,
    codeSnippets: [
      {
        language: 'javascript',
        title: 'Webpack Module Federation Config (Host & Remote)',
        code: `// Host container webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'zomato_shell',
      remotes: {
        discovery: 'discoveryApp@https://cdn.zomato.com/discovery/remoteEntry.js',
        checkout: 'checkoutApp@https://cdn.zomato.com/checkout/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: true },
        '@zomato/ui-kit': { singleton: true },
      },
    }),
  ],
};`,
        explanation: 'Demonstrates configuring host shell remotes with strict singleton version requirements to avoid duplicate React instances in runtime memory.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'What is the primary risk of having multiple versions of React loaded in a micro-frontend architecture?',
        options: [
          'Duplicate React runtimes break React Context and Hook dispatcher state',
          'CSS styles become invisible',
          'Database indexes get corrupted',
          'The server drops all incoming WebSocket connections'
        ],
        correctIndex: 0,
        explanation: 'Hooks (useState, useContext) rely on a single global React dispatcher. If two versions of React are bundled, hook calls will fail with Invalid Hook Call errors.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you share state and communication across micro-frontends without tight coupling?',
        sampleAnswer: '1. Custom DOM Events or a browser Window-level Pub/Sub event emitter.\n2. URL query parameters as the single source of truth for routing and filter state.\n3. Shared global store (e.g. lightweight zustand instance attached to window or imported via module federation).\n4. Cookie/Local storage tokens for unified authentication.'
      }
    ]
  },

  'swiggy-resilient-microservices': {
    domain: 'reliability-security',
    takeaways: [
      'Cascading failures occur when one overloaded dependency exhausts threads and connection pools in upstream services.',
      'Circuit breakers transition between CLOSED, OPEN, and HALF-OPEN states to fast-fail traffic and protect recovering services.',
      'Bulkheading isolates critical resources (e.g. order placement thread pools vs recommendation thread pools).',
      'Timeout budgets and exponential backoff with jitter prevent retry storms during outage recoveries.'
    ],
    content: `## Managing Peak Traffic Spikes at Swiggy
During major events like the IPL finals or New Year's Eve, Swiggy experiences tens of thousands of orders per minute. If a secondary downstream microservice (such as personalized menu recommendations) slows down, upstream checkout servers quickly exhaust their HTTP connection pools waiting for responses.

Without isolation, a non-critical feature outage can take down the entire food ordering pipeline.

\`\`\`
Normal Flow (CLOSED):
Client ---> [ API Gateway ] ---> [ Service A ] ---> [ Service B (Healthy) ]

Failure Spike (OPEN):
Client ---> [ API Gateway ] ---> [ Service A ] -x-> [ Circuit Breaker OPEN ]
                                      |
                                      +--> [ Instant Fallback Response ]
                                           (No load sent to failing Service B)
\`\`\`

## Circuit Breaker State Machine
1. **CLOSED**: Requests pass through normally. Failures are counted in a rolling time window.
2. **OPEN**: If error rate exceeds threshold (e.g. 50% over 10 seconds), the circuit trips to OPEN. All subsequent requests fail immediately or return fallback responses without invoking the downstream service.
3. **HALF-OPEN**: After a cooldown period (e.g. 15 seconds), a small probe fraction of requests are allowed through. If successful, the circuit resets to CLOSED; if failures persist, it flips back to OPEN.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Production Circuit Breaker State Machine in TypeScript',
        code: `type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private lastFailureTime = 0

  constructor(
    private readonly threshold: number = 5,
    private readonly cooldownMs: number = 10000
  ) {}

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    const now = Date.now()

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.state = 'HALF_OPEN'
      } else {
        return fallback() // Fast fail with fallback
      }
    }

    try {
      const result = await fn()
      if (this.state === 'HALF_OPEN') {
        this.reset()
      }
      return result
    } catch (error) {
      this.recordFailure()
      return fallback()
    }
  }

  private recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN'
    }
  }

  private reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
  }
}`,
        explanation: 'Implements the full 3-state Circuit Breaker pattern with fast-fail fallback, failure threshold counting, and cooldown-based HALF-OPEN probing.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'What is the purpose of the HALF-OPEN state in a circuit breaker?',
        options: [
          'To test if the failing downstream service has recovered by passing a controlled probe of traffic',
          'To double the request timeout duration',
          'To restart the Kubernetes pod',
          'To log security audit events'
        ],
        correctIndex: 0,
        explanation: 'In HALF-OPEN, the breaker allows a test request to pass. If it succeeds, the downstream service is presumed healthy and the breaker transitions back to CLOSED.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Bulkheading and Rate Limiting in microservices?',
        sampleAnswer: 'Rate Limiting limits the number of incoming requests over a time window to protect capacity. Bulkheading partitions internal resources (like thread pools, CPU cores, or DB connection pools) into isolated silos, ensuring that exhaustion in one non-critical domain (e.g. reviews) cannot starve a critical domain (e.g. checkout).'
      }
    ]
  },

  'stripe-rate-limiters': {
    domain: 'reliability-security',
    takeaways: [
      'Rate limiters protect infrastructure from denial-of-service, scraping, and misconfigured client retry loops.',
      'Sliding Window Log vs Sliding Window Counter provide optimal accuracy with minimal Redis memory overhead.',
      'Token Bucket algorithms allow short traffic bursts while enforcing strict sustained rate caps.',
      'Always return standard HTTP 429 headers: Retry-After, X-RateLimit-Limit, and X-RateLimit-Remaining.'
    ],
    content: `## Protecting Public APIs at Scale
Stripe operates four tiers of rate limiters: Request Rate Limiter (per-customer), Tiered Limiters (per-endpoint), Critical Resource Limiters (preventing DB exhaustion), and Authentication Failure Limiters (brute force protection).

\`\`\`
Incoming Request
      |
      v
[ Sliding Window Counter in Redis ]
      |
      +---> (Count <= Limit) ---> [ Forward to API Gateway ] (200 OK)
      |
      +---> (Count > Limit)  ---> [ Reject with 429 Too Many Requests ]
                                   (Header: Retry-After: 3)
\`\`\`

## Sliding Window Counter Algorithm
Fixed window rate limiting suffers from the "boundary burst" problem (clients can send 2x the limit at the boundary of two minutes). The Sliding Window algorithm calculates:
\`\`\`
Current Weight = (Current Time in Window) / Window Size
Estimated Count = (Previous Window Count * (1 - Current Weight)) + Current Window Count
\`\`\`
This achieves 99.9% accuracy with constant memory O(1) in Redis.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Redis Sliding Window Counter Rate Limiter',
        code: `import Redis from 'ioredis'
const redis = new Redis()

export async function isRateLimited(
  userId: string,
  limit: number = 100,
  windowSec: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Math.floor(Date.now() / 1000)
  const currentWindow = Math.floor(now / windowSec)
  const prevWindow = currentWindow - 1

  const currentKey = \`rate:\${userId}:\${currentWindow}\`
  const prevKey = \`rate:\${userId}:\${prevWindow}\`

  const [currentCountRaw, prevCountRaw] = await Promise.all([
    redis.get(currentKey),
    redis.get(prevKey),
  ])

  const currentCount = parseInt(currentCountRaw || '0', 10)
  const prevCount = parseInt(prevCountRaw || '0', 10)

  const timeIntoCurrentWindow = now % windowSec
  const weight = (windowSec - timeIntoCurrentWindow) / windowSec
  const estimatedCount = Math.floor(prevCount * weight) + currentCount

  if (estimatedCount >= limit) {
    return { allowed: false, remaining: 0 }
  }

  // Increment and set TTL
  await redis.multi()
    .incr(currentKey)
    .expire(currentKey, windowSec * 2)
    .exec()

  return { allowed: true, remaining: limit - estimatedCount - 1 }
}`,
        explanation: 'Calculates the sliding window overlap mathematically using two Redis counters, preventing boundary spikes while using O(1) storage.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why does the Fixed Window Counter algorithm fail to prevent traffic spikes?',
        options: [
          'Clients can send the maximum quota at the very end of Window 1 and again at the start of Window 2, doubling the allowed burst',
          'It requires too much Redis RAM',
          'It is incompatible with IPv6 addresses',
          'It cannot run on Linux servers'
        ],
        correctIndex: 0,
        explanation: 'In Fixed Window, a client with 100 req/min can send 100 requests at 00:59 and 100 requests at 01:00, bombarding the server with 200 requests within two seconds.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you handle distributed rate limiting across a cluster of multi-region Redis servers?',
        sampleAnswer: '1. Local in-memory token buckets at the Envoy/API gateway for ultra-fast low-latency rejection.\n2. Periodic asynchronous batch sync to regional Redis instances.\n3. Consistent hashing by user ID to route requests to the same Redis shard.\n4. Fail-open strategy: if Redis cluster is down, allow traffic to prevent blocking legitimate users.'
      }
    ]
  },

  'dan-abramov-useeffect': {
    domain: 'javascript-v8',
    takeaways: [
      'Each render has its own props, state, and event handlers captured in closure.',
      'useEffect does not "watch" for changes—it runs after rendering with values captured from that specific render.',
      'Stale closures occur when an effect or callback captures values from an earlier render without proper dependencies or updater functions.',
      'Functional state updates (e.g. setCount(c => c + 1)) decouple state updates from state reading, preventing stale closures.'
    ],
    content: `## Thinking in React Renders
A common pitfall among React engineers is thinking of \`useEffect\` as an imperative lifecycle method (like \`componentDidUpdate\`).

In React, every render creates a discrete snapshot of:
1. Props
2. State
3. Functions & Event Handlers
4. Effects

\`\`\`
Render 0: count = 0 | () => { console.log(count) } // logs 0
Render 1: count = 1 | () => { console.log(count) } // logs 1
Render 2: count = 2 | () => { console.log(count) } // logs 2
\`\`\`

## The Stale Closure Problem
When an asynchronous callback or timer captures \`count\` from Render 0, it will permanently read \`0\` even if future renders occur—unless its dependency array explicitly triggers a fresh effect capture or uses a functional updater.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Fixing Stale Closures with Functional State Updaters',
        code: `import React, { useState, useEffect } from 'react'

// BAD: Stale closure bug
function BuggyCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: count is locked to 0 forever inside this closure!
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, []) // Empty deps locks in Render 0 values!

  return <div>{count}</div>
}

// GOOD: Functional updater reads current state at invocation time
function CorrectCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // SUCCESS: No dependency on outer count variable!
      setCount(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, []) // Empty deps is now safe!

  return <div>{count}</div>
}`,
        explanation: 'Demonstrates why functional updater setCount(prev => prev + 1) avoids re-running the interval while guaranteeing fresh state.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why does setCount(count + 1) inside an interval with [] dependency array result in the counter staying stuck at 1?',
        options: [
          'JavaScript garbage collects the counter',
          'The closure created on initial render permanently captures count as 0',
          'Intervals are not supported in React',
          'React batches all intervals together'
        ],
        correctIndex: 1,
        explanation: 'Because the effect never re-ran, the interval callback permanently referenced the count variable from the initial render where count === 0, repeatedly calculating 0 + 1.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you avoid recreating functions on every render while maintaining fresh state in effects?',
        sampleAnswer: '1. Use functional state updates (setCount(c => c + 1)).\n2. Use useReducer to decouple actions from state reading.\n3. Use useCallback with precise dependencies.\n4. Store mutable values in useRef when state triggers are not needed.'
      }
    ]
  },

  'netflix-chaos-engineering': {
    domain: 'reliability-security',
    takeaways: [
      'Chaos Engineering proactively injects real-world failures into production to uncover vulnerabilities before outages occur.',
      'Chaos Monkey terminates EC2 instances at random to verify auto-scaling and multi-zone failover.',
      'Hypothesis-driven experimentation: define steady state, inject blast-radius controlled fault, verify resilience.',
      'Resilient systems must gracefully degrade functionality rather than crashing completely.'
    ],
    content: `## Injecting Chaos to Build Resilience
When Netflix migrated its monolithic DVD operations to AWS cloud microservices, it realized hardware and network failures in cloud environments are inevitable.

Instead of hoping systems wouldn't crash, Netflix built **Chaos Monkey** to deliberately and randomly terminate virtual machines during normal business hours.

\`\`\`
Steady State Metrics: SPS (Stream Starts Per Second) = Stable
        |
        v
[ Chaos Injected: Random Microservice Killed ]
        |
        +---> If Resilient: SPS remains stable (Degrades gracefully)
        |
        +---> If Vulnerable: SPS drops (Bug identified and fixed!)
\`\`\`

## Principles of Chaos Engineering
1. **Define Steady State**: Identify a measurable business metric (e.g. Netflix SPS - Stream Starts per Second).
2. **Formulate a Hypothesis**: Predict that steady state will continue even when a server or database replica dies.
3. **Introduce Real-World Variables**: Terminate nodes, inject 500ms network latency, partition networks.
4. **Automate & Minimize Blast Radius**: Run experiments in production with automated kill switches.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Chaos Fault Injection Middleware (Simulating Latency and 500 Errors)',
        code: `import { Request, Response, NextFunction } from 'express'

export interface ChaosConfig {
  enabled: boolean
  failureRate: number // 0.0 to 1.0 (e.g. 0.05 = 5% failures)
  addedLatencyMs: number // Artificial latency injection
}

export const chaosMiddleware = (config: ChaosConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!config.enabled) return next()

    // 1. Inject artificial latency
    if (config.addedLatencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, config.addedLatencyMs))
    }

    // 2. Inject random server faults
    if (Math.random() < config.failureRate) {
      return res.status(503).json({
        error: 'CHAOS_SIMULATION: Downstream microservice failed temporarily.',
      })
    }

    next()
  }
}`,
        explanation: 'Injects configurable network latency and HTTP 503 failures into development or staging pipelines to verify circuit breaker and fallback handlers.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'What is the primary metric Netflix uses to determine if a chaos experiment has caused customer impact?',
        options: [
          'Stream Starts Per Second (SPS)',
          'CPU fan speed',
          'Number of open GitHub issues',
          'Total git commits per hour'
        ],
        correctIndex: 0,
        explanation: 'SPS (Stream Starts Per Second) tracks customer playback behavior. If SPS drops unexpectedly during a chaos experiment, automated safety controls halt the experiment immediately.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why should chaos experiments be conducted in production rather than only staging?',
        sampleAnswer: 'Staging environments rarely replicate the scale, unpredictable user behavior, third-party dependency quirks, and live caching states of production. Testing in production with strict blast radius controls reveals true operational weak points.'
      }
    ]
  },

  'uber-schemaless': {
    domain: 'distributed-systems',
    takeaways: [
      'Schemaless is an append-only, fault-tolerant datastore built on top of MySQL InnoDB engines.',
      'Data is written as immutable cells (row key, column name, ref_key, timestamp, body).',
      'Never execute UPDATE or DELETE operations in place; append new cell versions to preserve audit logs and avoid lock contention.',
      'Secondary indexing is maintained asynchronously via change-data-capture Kafka message queues.'
    ],
    content: `## Why Uber Replaced Postgres with Schemaless
As Uber expanded globally, its relational Postgres setup hit scaling limits with high write volumes, unbuffered master-replica replication lag, and table schema migration downtime during trip events.

Instead of adopting NoSQL systems like Cassandra (which lacked transaction-level cell validation at the time), Uber designed **Schemaless**: a sharded, append-only key-value data layer running on rock-solid MySQL InnoDB instances.

\`\`\`
Row Key: Trip-9872
+---------------------------------------------------------------------------------+
| Column Name  | Ref Key | Timestamp | Payload (JSON)                             |
+---------------------------------------------------------------------------------+
| status       | 0       | 10:00:00  | { "state": "REQUESTED", "rider": "Alice" } |
| status       | 1       | 10:02:15  | { "state": "ACCEPTED", "driver": "Bob" }   |
| status       | 2       | 10:15:30  | { "state": "COMPLETED", "fare": 24.50 }    |
+---------------------------------------------------------------------------------+
* NEVER OVERWRITE: NEW VERSIONS ARE APPENDED AS NEW CELLS WITH INCREMENTED REF_KEY *
\`\`\`

## Core Design Principles
1. **Append-Only Immutability**: All trip state changes are inserted as new rows with incremented \`ref_key\` counters. This completely eliminates MySQL row-level lock contention and deadlocks.
2. **Fixed 4K Byte Bucketing**: Data is sharded by row key into fixed shards across MySQL instances.
3. **Decoupled Secondary Indexes**: Secondary queries (e.g. "Find all trips for Driver X") are not queried directly against master shards; they are populated asynchronously via Kafka into dedicated search indexes.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Append-Only Cell Storage Model in TypeScript/Node.js',
        code: `export interface SchemalessCell<T> {
  rowKey: string
  columnName: string
  refKey: number
  timestamp: number
  body: T
}

export class AppendOnlyEntityStore<T> {
  private cells: SchemalessCell<T>[] = []

  // Always append: never mutate existing rows
  append(rowKey: string, columnName: string, body: T): SchemalessCell<T> {
    const existing = this.cells.filter(
      c => c.rowKey === rowKey && c.columnName === columnName
    )
    const nextRef = existing.length

    const cell: SchemalessCell<T> = {
      rowKey,
      columnName,
      refKey: nextRef,
      timestamp: Date.now(),
      body,
    }

    this.cells.push(cell)
    return cell
  }

  // Get current state: reads highest refKey
  getLatest(rowKey: string, columnName: string): SchemalessCell<T> | undefined {
    const matches = this.cells.filter(
      c => c.rowKey === rowKey && c.columnName === columnName
    )
    return matches[matches.length - 1]
  }

  // Time-travel / audit log inspection
  getHistory(rowKey: string, columnName: string): SchemalessCell<T>[] {
    return this.cells.filter(
      c => c.rowKey === rowKey && c.columnName === columnName
    )
  }
}`,
        explanation: 'Models Schemaless append-only immutability where cell versions are never updated in place, enabling time-travel auditing and eliminating row write contention.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why does an append-only architecture reduce database deadlocks and lock contention compared to UPDATE queries?',
        options: [
          'Because INSERT statements append to the end of index leaves and do not contend for shared row-level locks on existing records',
          'Because append-only databases disable TCP networking',
          'Because MySQL automatically converts all data into CSV files',
          'Because it deletes old tables daily'
        ],
        correctIndex: 0,
        explanation: 'In-place UPDATE queries acquire exclusive row locks that conflict with concurrent read/write queries. Append-only inserts avoid locking existing rows.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you handle secondary indexing in an append-only sharded data store?',
        sampleAnswer: 'Secondary indexes are decoupled from the primary write path. When a cell is appended, an event is emitted to a message log (e.g. Kafka). Background consumers consume the event stream and update dedicated secondary index tables or Elasticsearch instances asynchronously.'
      }
    ]
  },

  'cloudflare-introducing-workers': {
    domain: 'reliability-security',
    takeaways: [
      'V8 Isolates provide secure, multi-tenant execution with sub-millisecond cold starts (under 5ms).',
      'Container-based serverless (Docker/Lambda) incurs 100ms-500ms cold starts due to kernel namespace and VM virtualization overhead.',
      'Thousands of V8 isolates can run inside a single OS process, sharing memory without leaking state.',
      'Edge execution eliminates transatlantic latency by serving computing logic from the nearest point of presence (PoP).'
    ],
    content: `## Beyond Docker and Virtual Machines
Traditional serverless platforms (like AWS Lambda) execute user code inside lightweight micro-VMs or Docker containers. While secure, spinning up a new container requires initializing an operating system user space, file systems, and a Node.js process—resulting in 200ms-1000ms "cold start" latency.

Cloudflare Workers pioneered running edge serverless using **V8 Isolates** directly within the C++ runtime.

\`\`\`
Traditional Container Model:
[ Hardware ] -> [ Host OS ] -> [ Docker Daemon ] -> [ MicroVM/Container ] -> [ Node.js Runtime ] (Cold Start: 300ms)

Cloudflare Workers Model:
[ Hardware ] -> [ Host OS ] -> [ Single V8 C++ Process ]
                                   +--> [ Isolate 1 (Customer A) ] (Cold Start: < 5ms)
                                   +--> [ Isolate 2 (Customer B) ]
                                   +--> [ Isolate 3 (Customer C) ]
\`\`\`

## Isolates vs Containers
1. **Sub-5ms Cold Starts**: Initializing a V8 Isolate takes under 5 milliseconds because the V8 engine is already warm and running in memory.
2. **Minimal Memory Footprint**: A container consumes ~30MB-100MB of RAM even when idle. A V8 isolate requires only a few kilobytes of memory.
3. **Hardware-Enforced Memory Boundaries**: Isolates cannot access memory addresses outside their allocated heap boundary, ensuring strong multi-tenant security within a single process.`,
    codeSnippets: [
      {
        language: 'javascript',
        title: 'Modern Edge Worker Fetch Handler (Cloudflare / V8)',
        code: `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Edge Geolocation & Fast Routing
    const country = request.cf?.country || 'US';
    const city = request.cf?.city || 'Unknown';

    // 2. Sub-millisecond Cache Inspection
    const cache = caches.default;
    let response = await cache.match(request);
    if (response) {
      return response;
    }

    // 3. Transform and proxy request to origin
    response = await fetch(request);

    // Add security and debug headers at the edge
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Edge-Location', \`\${city}, \${country}\`);
    newHeaders.set('X-Frame-Options', 'DENY');

    const edgeResponse = new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

    // Cache at edge asynchronously without blocking client
    ctx.waitUntil(cache.put(request, edgeResponse.clone()));

    return edgeResponse;
  },
};`,
        explanation: 'Demonstrates handling edge requests with V8 sub-millisecond dispatch, edge cache matching, and non-blocking background caching using ctx.waitUntil.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why are V8 Isolates able to achieve cold starts under 5 milliseconds compared to Docker containers?',
        options: [
          'Because the V8 process is already initialized and creating an isolate only allocates a small isolated heap space without OS kernel virtualization',
          'Because they run in web browsers instead of servers',
          'Because they disable all JavaScript security checks',
          'Because they only support static HTML files'
        ],
        correctIndex: 0,
        explanation: 'V8 isolates avoid the overhead of booting a virtual OS, mounting filesystems, or initializing separate Node.js processes. Thousands of isolates share one host process.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What are the trade-offs of running code in V8 Isolates compared to traditional Docker-based serverless containers?',
        sampleAnswer: 'Advantages: Sub-5ms cold starts, near-zero idle memory cost, and massive multi-tenant density.\nLimitations: Cannot run arbitrary binary packages (no native C++ addons, no full POSIX filesystem, no raw TCP sockets unless polyfilled), and strict per-request CPU time limits (e.g. 50ms).'
      }
    ]
  },

  'nodejs-memory-leak-profiling': {
    domain: 'javascript-v8',
    takeaways: [
      'Memory leaks in Node.js occur when unreferenced objects are kept reachable through global variables, event listeners, or closures.',
      'The V8 Garbage Collector uses a Generational strategy: Scavenger for Young Generation (Nursery) and Mark-Sweep-Compact for Old Generation.',
      'Heap snapshots comparison (Delta between two points in time) is the gold standard for locating retained memory allocations.',
      'Always clean up event emitters (emitter.off / removeListener) and clear setInterval / setTimeout timers when connections close.'
    ],
    content: `## Diagnosing Production Node.js Memory Leaks
Because Node.js runs as a long-lived server process, subtle memory retention issues will gradually consume available memory until the V8 heap limit is reached (default ~1.4GB on 64-bit systems), causing the process to crash with \`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory\`.

\`\`\`
V8 Heap Memory Layout:
+--------------------+------------------------------------------+
|  Young Generation  |             Old Generation               |
|  (New Space / Eden)|  (Objects that survived 2 GC sweeps)    |
|  * 16MB - 32MB *   |  * Scanned via Mark-Sweep-Compact *      |
+--------------------+------------------------------------------+
\`\`\`

## The 4 Most Common Causes of Node.js Memory Leaks
1. **Unbounded Global Arrays & Maps**: Caching data in in-memory Maps without LRU eviction or TTL.
2. **Dangling Event Listeners**: Adding \`socket.on('data', ...)\` without calling \`socket.removeListener()\` on client disconnect.
3. **Accidental Closure Retention**: Inner functions capturing large parent scope objects even when only a small property was needed.
4. **Unreleased Timers**: \`setInterval\` callbacks that hold references to parent request contexts.`,
    codeSnippets: [
      {
        language: 'javascript',
        title: 'Common Closure Memory Leak vs Fixed Implementation',
        code: `// LEAKY CODE: Parent scope retention
let leakyHolder;
function createLeakyHandler() {
  const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
  const smallId = 42;

  // The closure below retains the ENTIRE lexical scope including largeBuffer!
  return function getId() {
    return smallId;
  };
}

// FIXED CODE: Decouple values from large scopes
function createCleanHandler() {
  const largeBuffer = Buffer.alloc(10 * 1024 * 1024);
  const smallId = 42;

  // Explicitly extract only what is needed before returning closure
  const isolatedId = smallId;
  return (function(id) {
    return function getId() {
      return id; // largeBuffer is eligible for immediate garbage collection!
    };
  })(isolatedId);
}`,
        explanation: 'Demonstrates how inner closures can inadvertently retain huge parent scope buffers in memory, and how isolating primitives allows V8 garbage collection to reclaim memory.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Which V8 garbage collection algorithm is responsible for reclaiming objects that survive multiple young generation cycles?',
        options: [
          'Major GC: Mark-Sweep-Compact',
          'Minor GC: Scavenger',
          'Reference Counting',
          'QuickSort'
        ],
        correctIndex: 0,
        explanation: 'Major GC runs Mark-Sweep-Compact on the Old Generation space. It traverses all root pointers, marks reachable objects, sweeps dead ones, and compacts fragmented memory.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you take and analyze a Node.js heap snapshot in production without bringing down the service?',
        sampleAnswer: '1. Use the built-in v8 module: v8.writeHeapSnapshot() or trigger via SIGUSR2 signal / Chrome DevTools protocol.\n2. In high-traffic clusters, pull the target instance out of the load balancer pool before capturing, as generating a 1GB heap snapshot pauses the event loop for 1-2 seconds.\n3. Load two snapshots (baseline and after 10,000 requests) into Chrome DevTools Memory Profiler and inspect the "Comparison" view to see objects with positive delta count and high Retained Size.'
      }
    ]
  },

  'kleppmann-btrees-vs-lsm': {
    domain: 'databases-caching',
    takeaways: [
      'B-Trees optimize for random reads by updating fixed-size pages (4KB-16KB) in-place with write-ahead logs (WAL).',
      'LSM-Trees (Log-Structured Merge-Trees) optimize for write-heavy workloads by writing sequentially to an in-memory MemTable and appending to SSTables on disk.',
      'Write Amplification is the ratio of bytes written to underlying storage versus bytes written to the database.',
      'Compaction in LSM-trees asynchronously merges sorted SSTables and purges deleted tombstones.'
    ],
    content: `## Storage Engines: The Foundation of Databases
In "Designing Data-Intensive Applications", Martin Kleppmann highlights the fundamental tradeoff between the two dominant storage engines in computer science:

1. **B-Trees (B+ Trees)**: Used in Postgres, MySQL InnoDB, Oracle.
2. **LSM-Trees**: Used in Cassandra, RocksDB, LevelDB, CockroachDB.

\`\`\`
LSM-Tree Write Path:
Write -> [ MemTable in RAM (SkipList) ]
             |
             v (Flushed when full)
         [ Disk: Immutable Sorted String Table (SSTable) Level 0 ]
             |
             v (Background Compaction)
         [ Disk: SSTable Level 1 ] ---> [ Disk: SSTable Level 2 ]
\`\`\`

## Structural Comparison
- **B-Trees**: Overwrite 4KB disk blocks in place. Requires a Write-Ahead Log (WAL) to survive crashes. Excellent for fast point reads (O(log N)), but random writes cause disk seek contention.
- **LSM-Trees**: Writes are always sequential appends to RAM (MemTable) and disk (WAL). Reads check the MemTable, then use Bloom Filters to check SSTables. Writes are blazingly fast with zero random disk seeking.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Simplified LSM-Tree In-Memory MemTable with Flush Simulation',
        code: `export class LSMStorageEngine {
  private memTable = new Map<string, string>() // Simulates in-memory sorted map
  private sstables: Array<Map<string, string>> = []
  private readonly maxMemTableSize = 3

  set(key: string, value: string) {
    this.memTable.set(key, value)
    if (this.memTable.size >= this.maxMemTableSize) {
      this.flushMemTable()
    }
  }

  get(key: string): string | null {
    // 1. Check in-memory MemTable first (most recent writes)
    if (this.memTable.has(key)) {
      const val = this.memTable.get(key)!
      return val === '__DELETED__' ? null : val
    }

    // 2. Search SSTables from newest to oldest
    for (let i = this.sstables.length - 1; i >= 0; i--) {
      if (this.sstables[i].has(key)) {
        const val = this.sstables[i].get(key)!
        return val === '__DELETED__' ? null : val
      }
    }

    return null
  }

  delete(key: string) {
    // Write a tombstone marker
    this.set(key, '__DELETED__')
  }

  private flushMemTable() {
    // Freeze and flush immutable SSTable
    const immutableSSTable = new Map([...this.memTable.entries()].sort())
    this.sstables.push(immutableSSTable)
    this.memTable.clear()
  }
}`,
        explanation: 'Simulates the LSM-Tree write path with in-memory MemTable, sequential flush to immutable SSTables, and tombstone-based deletes.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why do LSM-Tree storage engines use Bloom Filters?',
        options: [
          'To quickly tell if an SSTable definitely DOES NOT contain a key without reading from disk',
          'To encrypt customer passwords',
          'To calculate B-Tree page checksums',
          'To compress video files'
        ],
        correctIndex: 0,
        explanation: 'Because keys might reside in any SSTable on disk, Bloom filters allow the engine to skip checking files that definitely do not contain the requested key, speeding up reads.'
      }
    ],
    interviewQuestions: [
      {
        question: 'When would you choose an LSM-Tree database over a B-Tree database for a system design interview?',
        sampleAnswer: 'Choose an LSM-Tree (RocksDB, Cassandra) for write-heavy workloads (e.g. IoT telemetry, append-only financial ledgers, clickstream tracking) where write throughput and low write amplification are paramount. Choose B-Trees (PostgreSQL, MySQL) for read-heavy transactional systems requiring low read latency and strong relational foreign key constraints.'
      }
    ]
  },

  'figma-multiplayer-engine': {
    domain: 'architecture-design',
    takeaways: [
      'Figma builds its real-time multiplayer editing using WebAssembly, C++, and custom conflict-free data structures.',
      'Centralized authoritative server sequences operational transform modifications to guarantee eventual consistency.',
      'Rendering 60fps on HTML5 Canvas in WebAssembly avoids DOM layout thrashing and garbage collection spikes.',
      'Ephemerality: cursor positions and presence updates are sent over lightweight binary WebSockets with no database persistence.'
    ],
    content: `## How Figma Built Real-Time Collaborative Canvas
Unlike Google Docs which manipulates linear text documents using Operational Transformation (OT), Figma needed to support 2D graphic trees with parent-child relationships, vector networks, and simultaneous concurrent editing by dozens of designers on a single artboard.

\`\`\`
Browser 1 (WebAssembly Canvas)             Browser 2 (WebAssembly Canvas)
       |                                                 |
       |--- WebSocket: Move Circle (x: 150) ------------>|
       |                                                 |
       v                                                 v
[ Authoritative WebSocket Server: Sequences Changes and Resolves Parent ID Conflicts ]
\`\`\`

## Architecture Decisions
1. **Authoritative Server Ordering**: While peer-to-peer CRDTs work for distributed local apps, Figma uses a central server to assign an absolute sequence number to every change.
2. **WebAssembly + C++ Engine**: Running C++ compiled to WebAssembly yields 60fps rendering across millions of vector coordinates, bypassing JavaScript garbage collection stutter.
3. **Presence Layer Separation**: High-frequency cursor movements (60 updates/sec) are broadcast through an ephemeral UDP/WebSocket channel that completely bypasses database persistence.`,
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Vector State Conflict Resolution Tree in TypeScript',
        code: `export interface NodeTransform {
  id: string
  x: number
  y: number
  version: number
}

export class CollaborativeCanvasTree {
  private nodes = new Map<string, NodeTransform>()

  applyRemoteTransform(change: NodeTransform): boolean {
    const local = this.nodes.get(change.id)

    // Last-Write-Wins based on authoritative server version
    if (!local || change.version > local.version) {
      this.nodes.set(change.id, change)
      return true
    }

    return false // Discard stale transformation
  }

  getNode(id: string): NodeTransform | undefined {
    return this.nodes.get(id)
  }
}`,
        explanation: 'Demonstrates version-sequenced transformation resolution ensuring multiple clients converge on identical 2D positions.'
      }
    ],
    knowledgeCheck: [
      {
        question: 'Why did Figma choose WebAssembly over native DOM rendering for its collaborative canvas?',
        options: [
          'DOM elements carry immense memory overhead and cause layout reflow stutter with thousands of vector nodes',
          'WebAssembly cannot connect to WebSockets',
          'HTML5 Canvas does not support mouse events',
          'Web browsers disabled CSS in 2020'
        ],
        correctIndex: 0,
        explanation: 'Each HTML DOM element carries megabytes of style and event metadata. Rendering directly to WebAssembly-controlled Canvas allows 60fps rendering of 100,000+ vector paths with zero GC pauses.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you design a real-time multiplayer system for collaborative whiteboard tools like Figma or Miro?',
        sampleAnswer: '1. Use WebSockets for bi-directional low-latency messaging.\n2. Separate ephemeral state (cursor positions, selection boxes) from persistent state (vector paths, text).\n3. Maintain an authoritative server to assign sequential version numbers and resolve conflicting edits.\n4. Use WebAssembly / Canvas for rendering to prevent DOM reflow and garbage collection drops.'
      }
    ]
  }
}


// Default fallback generator for remaining articles to ensure every article has high-yield takeaways, content, and Q&A
function generateDefaultDeepDive(article) {
  const domain = domainMapping[article.id] || 'architecture-design'
  const takeaways = [
    'Architected specifically for high-scale reliability at ' + article.company + '.',
    'Employs modular boundaries and decoupled state to prevent systemic failures.',
    'Provides observable metrics and telemetry for proactive incident mitigation.',
    'Demonstrates key trade-offs between consistency, availability, and developer velocity.'
  ]

  const content = '## Engineering Context at ' + article.company + '\n' +
    article.summary + '\n\n' +
    'At ' + article.company + '\'s production scale, small architectural inefficiencies compound into latency spikes and service outages. This deep-dive examines how their engineering team isolated root causes and implemented a resilient solution.\n\n' +
    '## Architectural Highlights & Design Mechanics\n' +
    '1. **Decoupled Architecture**: Systems are compartmentalized so degradation in non-critical components does not cascade into primary workflows.\n' +
    '2. **Predictable Scaling**: Stateless computing tiers backed by resilient, horizontally partitioned storage.\n' +
    '3. **Observability & Health Checks**: High-fidelity metrics, structured logging, and distributed tracing ensure rapid detection of anomalies.\n\n' +
    '## Trade-offs & Production Lessons\n' +
    '- **Latency vs Consistency**: Evaluating when eventual consistency is acceptable versus when strong linearizability is required.\n' +
    '- **Complexity vs Maintainability**: Balancing custom low-level optimizations against standard modular patterns.'

  const interviewQuestions = [
    {
      question: 'How would you apply ' + article.company + '\'s approach in ' + article.title + ' to a high-concurrency microservice?',
      sampleAnswer: '1. Implement clear interface boundaries with strict timeouts and circuit breakers.\n2. Choose appropriate data storage models (e.g. read-heavy caching vs append-only event logs).\n3. Design for failure from day one using automated health checks, rate limiting, and graceful degradation.'
    }
  ]

  return { domain, takeaways, content, interviewQuestions }
}

let enrichedCount = 0

const updatedArticles = articles.map(art => {
  const custom = deepDives[art.id]
  if (custom) {
    enrichedCount++
    return {
      ...art,
      domain: custom.domain,
      takeaways: custom.takeaways,
      content: custom.content,
      codeSnippets: custom.codeSnippets || [],
      knowledgeCheck: custom.knowledgeCheck || [],
      interviewQuestions: custom.interviewQuestions || [],
    }
  }

  const generated = generateDefaultDeepDive(art)
  return {
    ...art,
    domain: generated.domain,
    takeaways: generated.takeaways,
    content: generated.content,
    codeSnippets: [],
    knowledgeCheck: [],
    interviewQuestions: generated.interviewQuestions,
  }
})

fs.writeFileSync(filePath, JSON.stringify(updatedArticles, null, 2), 'utf-8')
console.log('Successfully updated ' + updatedArticles.length + ' articles! (' + enrichedCount + ' flagship deep dives configured)')
