import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV:         z.enum(['development', 'production', 'test']).default('development'),
  PORT:             z.string().default('3001'),
  MONGODB_URI:      z.string().min(1),
  ALLOWED_ORIGINS:  z.string().optional(),
  ADMIN_TOKEN:      z.string().optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  const missing = parsed.error.issues.map((e) => e.path.join('.')).join(', ')
  throw new Error(`Invalid environment variables: ${missing}`)
}

export const env = parsed.data
