import { z } from 'zod'

export const healthCheckResultSchema = z.enum(['ok', 'fail'])

export const healthReportSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  checks: z.record(healthCheckResultSchema).optional()
})

export type HealthCheckResult = z.infer<typeof healthCheckResultSchema>
export type HealthReport = z.infer<typeof healthReportSchema>
