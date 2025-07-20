import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update' && session && session?.user?.image) {
        token.picture = session.user.image;
      }

      if (trigger === 'update' && session && session?.user?.name) {
        token.name = session.user.name;
      }

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/v1/users`, {
          method: 'POST',
          body: JSON.stringify({
            email: user.email as string,
            image: user.image as string,
            name: user.name as string,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          user.id = userData._id;
          user.email = userData.email
          user.image = userData.image
          user.name = userData.name
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error creating/updating user:', error);
        return false;
      }
    },
  },
});
