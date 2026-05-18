import Credentials from 'next-auth/providers/credentials'

export const DevProviders =
  process.env.NODE_ENV !== 'production'
    ? [
        Credentials({
          id: 'dev-login',
          name: 'Dev Login (local only)',
          credentials: {},
          authorize: async () => {
            return {
              id: 'dev-user',
              email: 'dev@local.test',
              name: 'Dev User',
              image: 'https://ui-avatars.com/api/?name=developer&background=random&size=128'
            }
          }
        })
      ]
    : []
