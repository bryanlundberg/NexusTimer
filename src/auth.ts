import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createOrUpdateUser } from "@/actions/actions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      return await createOrUpdateUser({
        email: user.email as string,
        image: user.image as string,
        name: user.name as string,
      });
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          const userResponse = await fetch(`${baseUrl}/api/user?email=${encodeURIComponent(session.user.email)}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.image) session.user.image = userData.image;
            if (userData.name) session.user.name = userData.name;
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error);
        }
      }
      return session;
    },
  },
});
