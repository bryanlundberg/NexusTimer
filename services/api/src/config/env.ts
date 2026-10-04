import { z } from 'zod'

const optionalSecret = z.string().min(1).optional()

const PRODUCTION_REQUIRED = [
  'EDGE_SECRET',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'AUTH_DISCORD_ID',
  'AUTH_DISCORD_SECRET',
  'RESEND_API_KEY',
  'BREVO_API_KEY',
  'MEILISEARCH_HOST',
  'MEILISEARCH_API_KEY'
] as const

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().min(1),
    REDIS_URL: z.string().min(1),
    EDGE_SECRET: z.string().min(32).optional(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    AUTH_GOOGLE_ID: optionalSecret,
    AUTH_GOOGLE_SECRET: optionalSecret,
    AUTH_DISCORD_ID: optionalSecret,
    AUTH_DISCORD_SECRET: optionalSecret,
    RESEND_API_KEY: optionalSecret,
    BREVO_API_KEY: optionalSecret,
    MEILISEARCH_HOST: z.string().url().optional(),
    MEILISEARCH_API_KEY: optionalSecret,
    REALTIME_URL: z.string().url().optional(),
    REALTIME_SECRET: optionalSecret
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return
    for (const key of PRODUCTION_REQUIRED) {
      if (!env[key]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: 'Required in production' })
    }
  })

export type Env = z.infer<typeof envSchema>

export function parseEnv(source: Record<string, string | undefined>): Env {
  const values = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, value === '' ? undefined : value])
  )
  const parsed = envSchema.safeParse(values)
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
    throw new Error(`Invalid environment: ${details}`)
  }
  return parsed.data
}

let cached: Env | undefined

export function getEnv(): Env {
  cached ??= parseEnv(process.env)
  return cached
}
