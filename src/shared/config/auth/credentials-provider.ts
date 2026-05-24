import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserCredential from '@/entities/user-credential/model/user-credential'

export const CredentialsProvider = Credentials({
  id: 'credentials',
  name: 'Email and Password',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' }
  },
  authorize: async (credentials) => {
    const email = credentials?.email as string | undefined
    const password = credentials?.password as string | undefined

    if (!email || !password) return null

    await connectDB()

    const dbUser = await User.findOne({ email }).lean()
    if (!dbUser) return null

    const userCredential = await UserCredential.findOne({ userId: dbUser._id })
    if (!userCredential) return null

    const passwordMatch = await compare(password, userCredential.passwordHash)
    if (!passwordMatch) return null

    return {
      id: dbUser._id.toString(),
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image
    }
  }
})
