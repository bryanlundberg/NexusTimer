import { getEnv } from './config/env'
import { createApp } from './create-app'
import { createSessionReader } from './infra/auth'
import { pingMongo } from './infra/mongo'
import { pingRedis } from './infra/redis'

export function buildApp() {
  const env = getEnv()
  const app = createApp({
    env,
    checks: {
      mongo: () => pingMongo(env.MONGODB_URI),
      redis: () => pingRedis(env.REDIS_URL)
    },
    sessions: createSessionReader(env)
  })
  return { env, app }
}
