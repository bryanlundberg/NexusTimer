import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Discord from 'next-auth/providers/discord'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Log, { LogType } from '@/entities/log/model/log'

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
  providers: [Google, Discord],
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
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token?.id) session.user.id = token.id as string
      if (token?.picture) session.user.image = token.picture as string
      if (token?.name) session.user.name = token.name as string
      return session
    },
    async signIn({ user, account }) {
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
  }
})
