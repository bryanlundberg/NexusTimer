import { serve } from '@hono/node-server'
import { buildApp } from './bootstrap'
import { disconnectMongo } from './infra/mongo'
import { disconnectRedis } from './infra/redis'
import { logger } from './lib/logger'

const { env, app } = buildApp()

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => logger.info('api listening', { port: info.port }))

let closing = false

async function shutdown(signal: NodeJS.Signals) {
  if (closing) return
  closing = true
  logger.info('api shutting down', { signal })
  server.close()
  await Promise.allSettled([disconnectMongo(), disconnectRedis()])
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
