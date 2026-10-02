import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

export type ClientSession = typeof authClient.$Infer.Session
