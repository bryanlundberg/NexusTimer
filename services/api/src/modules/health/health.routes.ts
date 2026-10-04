import type { HealthCheckResult, HealthReport } from '@nexustimer/contracts'
import { Hono } from 'hono'
import type { AppEnv } from '../../http/types'
import { logger, serializeError } from '../../lib/logger'

export type HealthCheck = () => Promise<void>
export type HealthChecks = Record<string, HealthCheck>

const CHECK_TIMEOUT_MS = 3000

async function runCheck(name: string, check: HealthCheck, requestId: string): Promise<HealthCheckResult> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${name} check timed out`)), CHECK_TIMEOUT_MS)
  })

  try {
    await Promise.race([check(), timeout])
    return 'ok'
  } catch (error) {
    logger.warn('health check failed', { requestId, check: name, error: serializeError(error) })
    return 'fail'
  } finally {
    clearTimeout(timer)
  }
}

export function healthRoutes(checks: HealthChecks) {
  return new Hono<AppEnv>()
    .get('/', () => Response.json({ status: 'ok' } satisfies HealthReport))
    .get('/ready', async (c) => {
      const results = Object.fromEntries(
        await Promise.all(
          Object.entries(checks).map(async ([name, check]) => [name, await runCheck(name, check, c.var.requestId)])
        )
      ) as Record<string, HealthCheckResult>
      const healthy = Object.values(results).every((result) => result === 'ok')
      const report: HealthReport = { status: healthy ? 'ok' : 'degraded', checks: results }
      return Response.json(report, { status: healthy ? 200 : 503 })
    })
}
