import 'dotenv/config'
import mongoose from 'mongoose'
import { Problem } from './models/Problem'

const run = async (): Promise<void> => {
  const category = process.argv[2]

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables')

  await mongoose.connect(uri)

  const filter = category ? { category, status: 'published' } : { status: 'published' }
  const problems = await Problem.find(filter).select('id title category -_id').lean()

  if (category) {
    const titles = problems.map((p) => p.id).join(', ')
    console.log(`\n${category} (${problems.length} problems):\n${titles}\n`)
  } else {
    const byCategory = problems.reduce<Record<string, string[]>>((acc, p) => {
      const cat = p.category as string
      if (!acc[cat]) acc[cat] = []
      acc[cat]!.push(p.id as string)
      return acc
    }, {})

    for (const [cat, ids] of Object.entries(byCategory)) {
      console.log(`\n${cat} (${ids.length} problems):\n${ids.join(', ')}`)
    }
    console.log(`\nTotal: ${problems.length} published problems`)
  }

  await mongoose.disconnect()
}

run().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
