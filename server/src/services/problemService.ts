import { type Types } from 'mongoose'
import * as problemRepo from '../repositories/problemRepository'
import { escapeRegex, validateProblem, type ValidationError } from '../utils/problem-validation'
import { parsePagination } from '../utils/pagination'
import type { CreateProblemInput, PatchProblemInput } from '../types/schemas/problemSchemas'
import { type ParsedQs } from 'qs'

export interface ProblemListOptions {
  query:        ParsedQs
  category?:    string
  difficulty?:  string
  search?:      string
  type?:        string
  patternTag?:  string
  collectionId?: string
}

export interface ProblemListResult {
  problems:   unknown[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

type RawTest = { hidden?: boolean; expected?: unknown; [key: string]: unknown }

const stripHiddenExpected = (tests: RawTest[]): RawTest[] =>
  tests.map((t) => (t.hidden ? { ...t, expected: null } : t))

export const listProblems = async (opts: ProblemListOptions): Promise<ProblemListResult> => {
  const { query, category, difficulty, search, type, patternTag, collectionId } = opts
  const pagination = parsePagination(query)

  const filter: Record<string, unknown> = {}
  if (category)     filter.category     = category
  if (difficulty)   filter.difficulty   = difficulty
  if (search)       filter.title        = { $regex: escapeRegex(search), $options: 'i' }
  if (patternTag)   filter.patternTag   = patternTag
  if (collectionId) filter.collectionId = collectionId
  if (type === 'coding')    filter.type = { $in: ['coding', null] }
  else if (type === 'quiz') filter.type = { $in: ['mcq', 'trick'] }
  else if (type)            filter.type = type

  const [problems, total] = await problemRepo.findPublished(filter, pagination)
  return {
    problems,
    pagination: {
      page:       pagination.page,
      limit:      pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  }
}

export const getPatterns = () => problemRepo.aggregatePatterns()

export const getCategoryCounts = () => problemRepo.aggregateCategoryCounts()

export const getCollectionCounts = () => problemRepo.aggregateCollectionCounts()

export const getProblemById = async (id: string) => {
  const [problem, meta] = await Promise.all([
    problemRepo.findByIdPublished(id),
    problemRepo.findMongoIdByProblemId(id),
  ])

  if (!problem || !meta) return null

  const { prevId, nextId } = await problemRepo.findPrevNext(meta._id as Types.ObjectId)

  return {
    ...problem,
    tests: Array.isArray(problem.tests)
      ? stripHiddenExpected(problem.tests as unknown as RawTest[])
      : problem.tests,
    prevId,
    nextId,
  }
}

export const getSubmitTests = async (id: string) => {
  const problem = await problemRepo.findTestsById(id)
  return problem ? (problem.tests ?? []) : null
}

export const createProblem = async (doc: Record<string, unknown>) => {
  const result = await problemRepo.upsertOne(doc.id as string, doc)
  return { id: doc.id, created: result.upsertedCount > 0 }
}

export const bulkCreateProblems = async (problems: Record<string, unknown>[]) => {
  let inserted = 0
  let skipped  = 0

  for (const doc of problems) {
    const result = await problemRepo.upsertOne(doc.id as string, doc)
    if (result.upsertedCount > 0) inserted++
    else skipped++
  }

  return { inserted, skipped }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminListOptions {
  query:       ParsedQs
  status?:     string
  category?:   string
  difficulty?: string
  search?:     string
}

export const adminListProblems = async (opts: AdminListOptions) => {
  const { query, status, category, difficulty, search } = opts
  const pagination = parsePagination(query)

  const filter: Record<string, unknown> = {}
  if (status)     filter.status     = status
  if (category)   filter.category   = category
  if (difficulty) filter.difficulty = difficulty
  if (search)     filter.title      = { $regex: escapeRegex(search), $options: 'i' }

  const [problems, total] = await problemRepo.findAdmin(filter, pagination)
  return {
    problems,
    pagination: {
      page:       pagination.page,
      limit:      pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  }
}

export const adminGetStats = async () => {
  const [byStatus, byCategory] = await problemRepo.aggregateAdminStats()
  return { byStatus, byCategory }
}

export const adminCreateProblem = async (doc: CreateProblemInput) => {
  const errors = validateProblem(doc as Record<string, unknown>)
  if (errors.length > 0) return { errors }

  const escapedTitle = escapeRegex(doc.title)
  const duplicate = await problemRepo.findDuplicate(doc.id, escapedTitle, doc.functionName ?? '')
  if (duplicate) return { duplicate }

  const problem = await problemRepo.createOne(doc as Record<string, unknown>)
  return { id: problem.id }
}

export const adminBulkCreate = async (items: CreateProblemInput[]) => {
  const inserted:   string[] = []
  const duplicates: Array<{ index: number; id: string; matchedId: string }> = []
  const invalid:    Array<{ index: number; id?: string; errors: ValidationError[] }> = []

  for (let i = 0; i < items.length; i++) {
    const doc = items[i]
    if (!doc) continue

    const errors = validateProblem(doc as Record<string, unknown>)
    if (errors.length > 0) {
      invalid.push({ index: i, id: doc.id, errors })
      continue
    }

    const escapedTitle = escapeRegex(doc.title)
    const duplicate = await problemRepo.findDuplicate(doc.id, escapedTitle, doc.functionName ?? '')
    if (duplicate) {
      duplicates.push({ index: i, id: doc.id, matchedId: duplicate.id })
      continue
    }

    await problemRepo.createOne(doc as Record<string, unknown>)
    inserted.push(doc.id)
  }

  return {
    summary:    { inserted: inserted.length, duplicates: duplicates.length, invalid: invalid.length },
    inserted,
    duplicates,
    invalid,
  }
}

export const adminGetProblemById = (id: string) => problemRepo.findAdminById(id)

export const adminPatchProblem = (id: string, updates: PatchProblemInput) =>
  problemRepo.patchOne(id, updates as Record<string, unknown>)

export const adminDeleteProblem = (id: string) => problemRepo.deleteOne(id)

export const adminSetStatus = (id: string, status: 'published' | 'draft') =>
  problemRepo.setStatus(id, status)
