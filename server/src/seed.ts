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
  for (const field of REQUIRED_FIELDS) {
    if (doc[field] === undefined || doc[field] === null || doc[field] === '') {
      return `[${slug}][${index}] missing required field: ${field}`
    }
  }
  return null
}

const loadCategory = (filePath: string): Record<string, unknown>[] => {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Record<string, unknown>[]
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

  const files = fs.readdirSync(PROBLEMS_DIR).filter((f) => f.endsWith('.json'))
  if (files.length === 0) {
    console.error('No JSON files found in server/data/problems/. Run npm run convert first.')
    process.exit(1)
  }

  let totalInserted = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const file of files) {
    const slug = file.replace('.json', '')
    const problems = loadCategory(path.join(PROBLEMS_DIR, file))
    const { inserted, skipped, errors } = await seedCategory(slug, problems)

    console.log(`${slug}: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)
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
