import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { Article } from './models/Article'

const resolveDataFile = (relPath: string): string => {
  const candidates = [
    path.resolve(__dirname, '../data', relPath),
    path.resolve(__dirname, '../../server/data', relPath),
    path.resolve(process.cwd(), 'server/data', relPath),
    path.resolve(process.cwd(), 'data', relPath),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return candidates[0]!
}

const ARTICLES_FILE = resolveDataFile('articles/engineering_blogs.json')

const run = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables')

  await mongoose.connect(uri)
  console.log('MongoDB connected for Article seeding\n')

  if (!fs.existsSync(ARTICLES_FILE)) {
    console.error(`Articles file not found at: ${ARTICLES_FILE}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(ARTICLES_FILE, 'utf-8')
  const articles = JSON.parse(raw)

  if (!Array.isArray(articles)) {
    console.error('Articles file must contain an array of articles')
    process.exit(1)
  }

  let inserted = 0
  let skipped = 0

  for (const doc of articles) {
    try {
      const result = await Article.updateOne(
        { id: doc.id },
        { $set: { ...doc, status: doc.status || 'published' } },
        { upsert: true }
      )
      if (result.upsertedCount > 0) {
        inserted++
        console.log(`  INSERTED: ${doc.title} (${doc.company})`)
      } else {
        skipped++
      }
    } catch (error) {
      console.error(`  ERROR seeding ${doc.id}:`, error)
    }
  }

  console.log(`\nArticles: ${inserted} inserted, ${skipped} skipped`)
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error('Article seed failed:', error)
  process.exit(1)
})
