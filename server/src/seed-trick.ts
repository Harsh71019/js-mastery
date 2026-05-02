import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { Problem } from './models/Problem'
import { validateProblem, escapeRegex } from './utils/problem-validation'

const TRICK_FILE = path.resolve(__dirname, '../../scripts/trick-starter.json')

const run = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set')
  await mongoose.connect(uri)
  console.log('MongoDB connected\n')

  const problems = JSON.parse(fs.readFileSync(TRICK_FILE, 'utf-8')) as Record<string, unknown>[]

  let inserted = 0
  let skipped = 0
  let errors = 0

  for (const problem of problems) {
    const validationErrors = validateProblem(problem)
    if (validationErrors.length > 0) {
      console.error(`  INVALID ${String(problem.id)}:`, validationErrors.map((e) => `${e.field}: ${e.message}`).join(', '))
      errors++
      continue
    }

    const duplicate = await Problem.findOne({
      $or: [
        { id: problem.id },
        { title: { $regex: `^${escapeRegex(String(problem.title))}$`, $options: 'i' } },
      ],
    }).lean()

    if (duplicate) {
      console.log(`  SKIP (duplicate): ${String(problem.id)}`)
      skipped++
      continue
    }

    await Problem.create(problem)
    console.log(`  + ${String(problem.id)}`)
    inserted++
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)
  await mongoose.disconnect()
}

run().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
