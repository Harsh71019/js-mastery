export interface ValidationError {
  field: string
  message: string
}

const VALID_DIFFICULTIES = ['Beginner', 'Easy', 'Medium', 'Hard'] as const

const SHARED_REQUIRED_STRINGS = [
  'id', 'title', 'category', 'patternTag', 'patternExplanation',
] as const

const SHARED_WITH_DESCRIPTION = [...SHARED_REQUIRED_STRINGS, 'description'] as const

const CODING_REQUIRED_STRINGS = [
  'functionName', 'starterCode', 'solution', 'skeletonHint',
] as const

export const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const checkShared = (doc: Record<string, unknown>, requireDescription = true): ValidationError[] => {
  const errors: ValidationError[] = []

  const fields = requireDescription ? SHARED_WITH_DESCRIPTION : SHARED_REQUIRED_STRINGS
  for (const field of fields) {
    if (typeof doc[field] !== 'string' || !(doc[field] as string).trim()) {
      errors.push({ field, message: 'required non-empty string' })
    }
  }

  if (!VALID_DIFFICULTIES.includes(doc.difficulty as (typeof VALID_DIFFICULTIES)[number])) {
    errors.push({ field: 'difficulty', message: `must be one of: ${VALID_DIFFICULTIES.join(', ')}` })
  }

  if (typeof doc.estimatedMinutes !== 'number' || (doc.estimatedMinutes as number) <= 0) {
    errors.push({ field: 'estimatedMinutes', message: 'required positive number' })
  }

  return errors
}

const validateCodingFields = (doc: Record<string, unknown>): ValidationError[] => {
  const errors = checkShared(doc)

  for (const field of CODING_REQUIRED_STRINGS) {
    if (typeof doc[field] !== 'string' || !(doc[field] as string).trim()) {
      errors.push({ field, message: 'required non-empty string' })
    }
  }

  if (!Array.isArray(doc.whatShouldHappen) || (doc.whatShouldHappen as unknown[]).length === 0) {
    errors.push({ field: 'whatShouldHappen', message: 'required non-empty array' })
  }

  if (!Array.isArray(doc.tests) || (doc.tests as unknown[]).length < 4) {
    errors.push({ field: 'tests', message: 'requires at least 4 test cases' })
  }

  const tt = doc.traceTable as Record<string, unknown> | undefined
  if (!tt || typeof tt.inputLabel !== 'string' || !Array.isArray(tt.columns) || !Array.isArray(tt.rows)) {
    errors.push({ field: 'traceTable', message: 'required: { inputLabel: string, columns: string[], rows: any[] }' })
  }

  return errors
}

const validateMcqFields = (doc: Record<string, unknown>): ValidationError[] => {
  const errors = checkShared(doc)

  const options = doc.options as unknown[] | undefined
  if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
    errors.push({ field: 'options', message: 'required array of 2–6 strings' })
  } else if (options.some((o) => typeof o !== 'string' || !(o as string).trim())) {
    errors.push({ field: 'options', message: 'all options must be non-empty strings' })
  }

  const validOptions = Array.isArray(options) && options.length >= 2
  if (
    typeof doc.correctIndex !== 'number' ||
    !Number.isInteger(doc.correctIndex as number) ||
    (validOptions && ((doc.correctIndex as number) < 0 || (doc.correctIndex as number) >= (options as unknown[]).length))
  ) {
    errors.push({ field: 'correctIndex', message: 'required integer, valid index into options' })
  }

  if (typeof doc.explanation !== 'string' || !(doc.explanation as string).trim()) {
    errors.push({ field: 'explanation', message: 'required non-empty string' })
  }

  return errors
}

const validateTrickFields = (doc: Record<string, unknown>): ValidationError[] => {
  const errors = checkShared(doc, false)

  if (typeof doc.codeSnippet !== 'string' || !(doc.codeSnippet as string).trim()) {
    errors.push({ field: 'codeSnippet', message: 'required non-empty string' })
  }

  const options = doc.options as unknown[] | undefined
  if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
    errors.push({ field: 'options', message: 'required array of 2–6 strings' })
  } else if (options.some((o) => typeof o !== 'string' || !(o as string).trim())) {
    errors.push({ field: 'options', message: 'all options must be non-empty strings' })
  }

  const validOptions = Array.isArray(options) && options.length >= 2
  if (
    typeof doc.correctIndex !== 'number' ||
    !Number.isInteger(doc.correctIndex as number) ||
    (validOptions && ((doc.correctIndex as number) < 0 || (doc.correctIndex as number) >= (options as unknown[]).length))
  ) {
    errors.push({ field: 'correctIndex', message: 'required integer, valid index into options' })
  }

  if (typeof doc.gotchaExplanation !== 'string' || !(doc.gotchaExplanation as string).trim()) {
    errors.push({ field: 'gotchaExplanation', message: 'required non-empty string' })
  }

  return errors
}

export const validateProblem = (doc: Record<string, unknown>): ValidationError[] => {
  if (doc.type === 'trick') return validateTrickFields(doc)
  if (doc.type === 'mcq')   return validateMcqFields(doc)
  return validateCodingFields(doc)
}
