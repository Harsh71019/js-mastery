import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { Problem } from './models/Problem'

const PROBLEMS_DIR = path.resolve(__dirname, '../../server/data/problems')

const REQUIRED_FIELDS = [
  'id', 'title', 'category', 'difficulty', 'functionName',
  'description', 'whatShouldHappen', 'starterCode', 'solution',
  'traceTable', 'skeletonHint', 'tests', 'patternTag',
  'patternExplanation', 'estimatedMinutes',
]

const validate = (doc: Record<string, unknown>, slug: string, index: number): string | null => {
  // Only validate coding problems for now using this strict list
  // MCQ/Trick problems have different required fields but aren't typically in this dir
  if (doc.type && doc.type !== 'coding') return null;

  for (const field of REQUIRED_FIELDS) {
    if (doc[field] === undefined || doc[field] === null || doc[field] === '') {
      return `[${slug}][${index}] missing required field: ${field}`
    }
  }
  return null
}

const getAllJsonFiles = (dir: string): string[] => {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath))
    } else if (file.endsWith('.json')) {
      results.push(filePath)
    }
  })
  return results
}

const seedCategory = async (
  slug: string,
  problems: Record<string, unknown>[],
): Promise<{ inserted: number; skipped: number; errors: number }> => {
  let inserted = 0
  let skipped = 0
  let errors = 0

  for (let i = 0; i < problems.length; i++) {
    const doc = problems[i]
    const validationError = validate(doc, slug, i)
    if (validationError) {
      console.error(`  SKIP: ${validationError}`)
      errors++
      continue
    }

    try {
      const result = await Problem.updateOne(
        { id: doc.id },
        { $setOnInsert: { ...doc, status: 'published' } },
        { upsert: true },
      )
      if (result.upsertedCount > 0) {
        inserted++
      } else {
        skipped++
      }
    } catch (error: unknown) {
      const isDuplicateKey =
        typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
      if (isDuplicateKey) {
        console.warn(`  SKIP (duplicate): ${String(doc.id)}`)
        skipped++
      } else {
        throw error
      }
    }
  }

  return { inserted, skipped, errors }
}

const run = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables')

  await mongoose.connect(uri)
  console.log('MongoDB connected\n')

  const jsonFiles = getAllJsonFiles(PROBLEMS_DIR)
  if (jsonFiles.length === 0) {
    console.error('No JSON files found in server/data/problems/')
    process.exit(1)
  }

  let totalInserted = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const filePath of jsonFiles) {
    const relativePath = path.relative(PROBLEMS_DIR, filePath)
    const slug = relativePath.replace('.json', '').replace(/\//g, '-')
    
    const raw = fs.readFileSync(filePath, 'utf-8')
    let problems: Record<string, unknown>[] = []
    try {
        problems = JSON.parse(raw)
        if (!Array.isArray(problems)) problems = [problems]
    } catch (e) {
        console.error(`  ERROR: Failed to parse ${relativePath}`)
        totalErrors++
        continue
    }

    const { inserted, skipped, errors } = await seedCategory(slug, problems)

    if (inserted > 0 || errors > 0) {
        console.log(`${relativePath}: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)
    }
    
    totalInserted += inserted
    totalSkipped += skipped
    totalErrors += errors
  }

  console.log(`\nTotal: ${totalInserted} inserted, ${totalSkipped} skipped, ${totalErrors} errors`)
  await mongoose.disconnect()
}

run().catch((error: unknown) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
