import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './db'
import problemsRouter from './routes/problems'
import progressRouter from './routes/progress'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/problems', problemsRouter)
app.use('/api/progress', progressRouter)

const start = async (): Promise<void> => {
  await connectDb()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch((error: unknown) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
