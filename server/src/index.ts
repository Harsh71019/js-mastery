import 'dotenv/config'
import './config/env'
import http from 'http'
import express, { type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import pinoHttp from 'pino-http'
import { connectDb } from './db'
import { env } from './config/env'
import { logger } from './config/logger'
import { requestId } from './middleware/requestId'
import { requestTimeout } from './middleware/timeout'
import { errorHandler } from './middleware/errorHandler'
import { defaultLimiter, strictLimiter } from './middleware/rateLimiter'
import { adminAuth } from './middleware/adminAuth'
import problemsRouter from './routes/problems'
import progressRouter from './routes/progress'
import adminRouter from './routes/admin'
import dailyRouter from './routes/daily'
import submissionsRouter from './routes/submissions'
import visitsRouter from './routes/visits'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : '*',
  }),
)
app.use(requestId)
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req as Request & { id?: string }).id ?? '',
    customLogLevel: (_req, res) => {
      if (res.statusCode >= 500) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    },
  }),
)
app.use(express.json({ limit: '1mb' }))
// app.use(defaultLimiter)
app.use(requestTimeout)

app.get('/api/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected'
  res.json({
    ok: dbState === 1,
    db: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/problems', problemsRouter)
app.use('/api/progress', progressRouter)
app.use('/api/admin/problems', adminAuth, strictLimiter, adminRouter)
app.use('/api/daily', dailyRouter)
app.use('/api/submissions', submissionsRouter)
app.use('/api/visits', visitsRouter)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

// ── Process-level error guards ────────────────────────────────────────────────

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled promise rejection')
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception')
  process.exit(1)
})

// ── Graceful shutdown ─────────────────────────────────────────────────────────

const shutdown = (server: http.Server, signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`)

  server.close(async () => {
    logger.info('HTTP server closed')
    try {
      await mongoose.disconnect()
      logger.info('MongoDB disconnected')
      process.exit(0)
    } catch (err) {
      logger.error({ err }, 'Error during shutdown')
      process.exit(1)
    }
  })
}

// ── Start ─────────────────────────────────────────────────────────────────────

const start = async (): Promise<void> => {
  await connectDb()

  const server = http.createServer(app)
  server.keepAliveTimeout = 65_000
  server.headersTimeout = 66_000

  server.listen(parseInt(env.PORT), () => logger.info(`Server running on port ${env.PORT}`))

  process.on('SIGTERM', () => shutdown(server, 'SIGTERM'))
  process.on('SIGINT', () => shutdown(server, 'SIGINT'))
}

start().catch((error: unknown) => {
  logger.error({ err: error }, 'Failed to start server')
  process.exit(1)
})
