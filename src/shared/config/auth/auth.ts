import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Discord from 'next-auth/providers/discord'
import { randomUUID, createHash } from 'crypto'
import { headers } from 'next/headers'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import SessionModel from '@/entities/session/model/session'
import Log, { LogType } from '@/entities/log/model/log'
import { DevProviders } from '@/shared/config/auth/dev-provider'
import { CredentialsProvider } from '@/shared/config/auth/credentials-provider'
import { sessionCache } from '@/shared/lib/session-cache'
import { sendWelcomeEmail } from '@/features/authentication/server/welcome-email'

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

async function readRequestMetadata() {
  try {
    const h = await headers()
    const userAgent = h.get('user-agent') || undefined
    const forwardedFor = h.get('x-forwarded-for') || h.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim()
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : undefined
    return { userAgent, ipHash }
  } catch {
    return { userAgent: undefined, ipHash: undefined }
  }
}

async function isSessionValid(sessionId: string): Promise<boolean> {
  const cached = await sessionCache.get(sessionId)
  if (cached !== null) return cached

  await connectDB()
  const doc = await SessionModel.findOne({ sessionId }, { revokedAt: 1, expiresAt: 1 }).lean<{
    revokedAt?: Date
    expiresAt: Date
  } | null>()
  const valid = Boolean(doc && !doc.revokedAt && doc.expiresAt > new Date())
  await sessionCache.set(sessionId, valid)
  return valid
}

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, Discord, CredentialsProvider, ...DevProviders],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update') {
        if (session?.user?.image) token.picture = session.user.image
        if (session?.user?.name) token.name = session.user.name
      }

      if (user) {
        token.id = user.id
        token.picture = user.image
        token.name = user.name

        const sessionId = randomUUID()
        const { userAgent, ipHash } = await readRequestMetadata()

        try {
          await connectDB()
          await SessionModel.create({
            userId: user.id,
            sessionId,
            userAgent,
            ipHash,
            expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS)
          })
          token.sid = sessionId
          await sessionCache.set(sessionId, true)
        } catch (error) {
          console.error('Failed to create session record:', error)
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      const sessionId = token?.sid as string | undefined
      if (!sessionId || !(await isSessionValid(sessionId))) {
        return { ...session, user: undefined as unknown as typeof session.user }
      }

      if (token?.id) session.user.id = token.id as string
      if (token?.picture) session.user.image = token.picture as string
      if (token?.name) session.user.name = token.name as string
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true
      }

      try {
        await connectDB()

        let dbUser = await User.findOne({
          providers: {
            $elemMatch: { provider: account?.provider, providerId: account?.providerAccountId }
          }
        })

        if (dbUser) {
          user.id = dbUser._id.toString()
          user.name = dbUser.name
          user.image = dbUser.image
          user.email = dbUser.email
          return true
        }

        dbUser = await User.findOneAndUpdate(
          { email: user.email },
          { $addToSet: { providers: { provider: account?.provider, providerId: account?.providerAccountId } } },
          { upsert: false, returnDocument: 'after' }
        )

        if (!dbUser) {
          const image =
            user.image ??
            `https://ui-avatars.com/api/?name=${(user.name ?? '').replace(/\s+/g, '+')}&background=random&size=128`
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image,
            providers: [{ provider: account?.provider, providerId: account?.providerAccountId }]
          })
          if (user.email && user.name) {
            const recipientEmail = user.email
            const recipientName = user.name
            sendWelcomeEmail({ email: recipientEmail, name: recipientName }).catch(async (err) => {
              try {
                await Log.create({
                  type: LogType.ApiError,
                  message: err instanceof Error ? err.message : String(err),
                  metadata: {
                    source: 'welcome-email',
                    email: recipientEmail,
                    stack: err instanceof Error ? err.stack : undefined
                  }
                })
              } catch (logErr) {
                console.error('Failed to log welcome email error:', logErr)
              }
            })
          }
        }

        user.id = dbUser._id.toString()
        user.name = dbUser.name
        user.image = dbUser.image
        user.email = dbUser.email
        return true
      } catch (error) {
        try {
          await Log.create({
            type: LogType.AuthError,
            message: error instanceof Error ? error.message : String(error),
            metadata: {
              provider: account?.provider ?? 'unknown',
              email: user?.email ?? null,
              stack: error instanceof Error ? error.stack : undefined
            }
          })
        } catch {
          console.error('Failed to write log:', error)
        }
        return false
      }
    }
  },
  events: {
    signOut: async (message) => {
      const sessionId = 'token' in message ? (message.token?.sid as string | undefined) : undefined
      if (!sessionId) return
      await sessionCache.invalidate(sessionId)
      try {
        await connectDB()
        await SessionModel.updateOne({ sessionId }, { $set: { revokedAt: new Date() } })
      } catch (error) {
        console.error('Failed to revoke session record:', error)
      }
    }
  }
})
