import { compare } from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from '@/shared/config/mongodb'
import { isAllowedEmail } from '@/features/auth/lib/is-allowed-email'
import { User } from '@/entities/user/model/user'
import { UserCredential } from '@/entities/user/model/user-credential'
import type { SessionUser } from '@/features/auth/model/session'

export async function verifyPassword(email: string, password: string): Promise<SessionUser | null> {
  if (!isAllowedEmail(email)) return null

  await connectDB()
  const user = await User.findOne({ email: email.trim() }).lean()
  if (!user) return null

  const credential = await UserCredential.findOne({
    userId: new mongoose.Types.ObjectId(String(user._id))
  }).lean()
  if (!credential?.passwordHash) return null
  if (!(await compare(password, credential.passwordHash))) return null

  return {
    id: String(user._id),
    email: user.email,
    name: user.name ?? '',
    image: user.image ?? ''
  }
}
