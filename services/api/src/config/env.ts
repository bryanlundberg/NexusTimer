import { z } from 'zod'

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().min(1),
    REDIS_URL: z.string().min(1),
    EDGE_SECRET: z.string().min(32).optional()
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && !env.EDGE_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['EDGE_SECRET'], message: 'Required in production' })
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
