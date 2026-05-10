import type { CategorySlug } from '@/types/problem'

export interface NeuralScores {
  readonly iteration: number
  readonly logic: number
  readonly ds: number
  readonly speed: number
  readonly memory: number
}

export const CONCEPT_LABELS: Record<keyof NeuralScores, string> = {
  iteration: 'ITERATION',
  logic:     'LOGIC_GATE',
  ds:        'DATA_STRUCT',
  speed:     'VELOCITY',
  memory:    'BUFFER_OPT',
}

const DEFAULT_SCORES: NeuralScores = { iteration: 1, logic: 1, ds: 1, speed: 1, memory: 1 }

export const CATEGORY_METRICS: Record<CategorySlug, NeuralScores> = {
  'basic-loops':      { iteration: 10, logic: 3,  ds: 2,  speed: 1,  memory: 1  },
  'reverse-loops':    { iteration: 10, logic: 4,  ds: 2,  speed: 1,  memory: 1  },
  'for-in-for-of':    { iteration: 10, logic: 2,  ds: 5,  speed: 1,  memory: 1  },
  'nested-loops':     { iteration: 10, logic: 8,  ds: 4,  speed: 2,  memory: 4  },
  'array-building':   { iteration: 7,  logic: 4,  ds: 10, speed: 2,  memory: 6  },
  'object-loops':     { iteration: 8,  logic: 5,  ds: 10, speed: 1,  memory: 1  },
  'array-methods':    { iteration: 10, logic: 3,  ds: 6,  speed: 3,  memory: 3  },
  'two-pointer':      { iteration: 8,  logic: 10, ds: 5,  speed: 9,  memory: 10 },
  'prefix-suffix':    { iteration: 7,  logic: 9,  ds: 7,  speed: 7,  memory: 8  },
  'sliding-window':   { iteration: 7,  logic: 10, ds: 8,  speed: 10, memory: 9  },
  'polyfills':        { iteration: 10, logic: 10, ds: 10, speed: 5,  memory: 5  },
  'tricky-patterns':  { iteration: 9,  logic: 10, ds: 5,  speed: 5,  memory: 5  },
  'arrays':           { iteration: 5,  logic: 5,  ds: 10, speed: 5,  memory: 5  },
  'strings':          { iteration: 5,  logic: 8,  ds: 8,  speed: 5,  memory: 5  },
  'linked-lists':     { iteration: 4,  logic: 7,  ds: 10, speed: 6,  memory: 10 },
  'trees':            { iteration: 3,  logic: 10, ds: 10, speed: 5,  memory: 5  },
  'graphs':           { iteration: 2,  logic: 10, ds: 10, speed: 4,  memory: 4  },
  'dp':               { iteration: 5,  logic: 10, ds: 5,  speed: 10, memory: 8  },
  'intervals':        { iteration: 6,  logic: 10, ds: 6,  speed: 7,  memory: 7  },
  'matrix':           { iteration: 9,  logic: 9,  ds: 10, speed: 5,  memory: 5  },
  'binary':           { iteration: 3,  logic: 10, ds: 8,  speed: 10, memory: 10 },
  'heaps':            { iteration: 2,  logic: 9,  ds: 10, speed: 10, memory: 5  },
  'objects-and-classes': { iteration: 2, logic: 8, ds: 10, speed: 3, memory: 5  },
  'maps-and-sets':       { iteration: 4, logic: 7, ds: 10, speed: 9, memory: 8  },
  'functions-and-closures': { iteration: 2, logic: 10, ds: 3, speed: 4, memory: 9 },
}

export const calculateNeuralCoverage = (solvedProblems: Record<string, any>): NeuralScores => {
  const totals = { iteration: 0, logic: 0, ds: 0, speed: 0, memory: 0 }
  const solvedCount = Object.keys(solvedProblems).length
  
  if (solvedCount === 0) return totals

  Object.keys(solvedProblems).forEach(id => {
    // Problem IDs are often category-slug-number
    const category = Object.keys(CATEGORY_METRICS).find(cat => id.startsWith(cat)) as CategorySlug
    const scores = CATEGORY_METRICS[category] || DEFAULT_SCORES
    
    totals.iteration += scores.iteration
    totals.logic += scores.logic
    totals.ds += scores.ds
    totals.speed += scores.speed
    totals.memory += scores.memory
  })

  // Normalize to 0-100 scale (assuming max score per problem is 10)
  // We divide by solvedCount to get the average proficiency, then scale it.
  // Actually, let's divide by a fixed "mastery" constant or just relative to count.
  const scale = (val: number) => Math.min(100, Math.round((val / (solvedCount * 10)) * 100))

  return {
    iteration: scale(totals.iteration),
    logic:     scale(totals.logic),
    ds:        scale(totals.ds),
    speed:     scale(totals.speed),
    memory:    scale(totals.memory),
  }
}
