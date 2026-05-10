import mongoose from 'mongoose'
import { logger } from './config/logger'

export const connectDb = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables')

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'))

  await mongoose.connect(uri)
  logger.info('MongoDB connected')
}
