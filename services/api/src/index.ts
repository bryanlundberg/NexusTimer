import type { Hono } from 'hono'
import { buildApp } from './bootstrap'
import type { AppEnv } from './http/types'

const app: Hono<AppEnv> = buildApp().app

export default app
