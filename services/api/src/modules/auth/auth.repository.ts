import { userCollection, userDocuments } from '../../infra/user-documents'
import { PasswordResetTokenModel, PendingRegistrationModel } from './auth.model'

export type PendingRegistration = {
  id: string
  email: string
  name: string
  passwordHash: string
  code: string
  attempts: number
  expiresAt: Date
}

export type PasswordResetToken = { id: string; userId: string; tokenHash: string; expiresAt: Date }

export type AuthRepository = {
  savePendingRegistration(registration: Omit<PendingRegistration, 'id' | 'attempts'>): Promise<void>
  recordCodeAttempt(email: string): Promise<PendingRegistration | null>
  deletePendingRegistration(id: string): Promise<void>
  createResetToken(token: Omit<PasswordResetToken, 'id'>): Promise<void>
  findResetToken(tokenHash: string): Promise<PasswordResetToken | null>
  deleteResetToken(id: string): Promise<void>
  deleteUserResetTokens(userId: string): Promise<void>
}

type PendingRegistrationDoc = Omit<PendingRegistration, 'id' | 'attempts'> & { _id: unknown; attempts?: number | null }

function toPendingRegistration(doc: PendingRegistrationDoc): PendingRegistration {
  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name,
    passwordHash: doc.passwordHash,
    code: doc.code,
    attempts: doc.attempts ?? 0,
    expiresAt: doc.expiresAt
  }
}

export const authRepository: AuthRepository = {
  async savePendingRegistration(registration) {
    await PendingRegistrationModel.findOneAndUpdate(
      { email: registration.email },
      { ...registration, attempts: 0 },
      { upsert: true }
    )
  },
  async recordCodeAttempt(email) {
    const doc = await PendingRegistrationModel.findOneAndUpdate(
      { email },
      { $inc: { attempts: 1 } },
      { returnDocument: 'after' }
    ).lean()
    return doc ? toPendingRegistration(doc) : null
  },
  async deletePendingRegistration(id) {
    await PendingRegistrationModel.deleteOne({ _id: id })
  },
  async createResetToken({ userId, tokenHash, expiresAt }) {
    await PasswordResetTokenModel.create({ userId, oobCode: tokenHash, expiresAt })
  },
  async findResetToken(tokenHash) {
    const doc = await PasswordResetTokenModel.findOne({ oobCode: tokenHash }).lean()
    if (!doc) return null
    return { id: String(doc._id), userId: String(doc.userId), tokenHash: doc.oobCode, expiresAt: doc.expiresAt }
  },
  async deleteResetToken(id) {
    await PasswordResetTokenModel.deleteOne({ _id: id })
  },
  async deleteUserResetTokens(userId) {
    await PasswordResetTokenModel.deleteMany({ userId })
  }
}

export const passwordResetTokensUserData = userDocuments(PasswordResetTokenModel, ({ id }) => ({ userId: id }))
export const pendingRegistrationsUserData = userDocuments(PendingRegistrationModel, ({ email }) => ({ email }))
export const legacyCredentialsUserData = userCollection('usercredentials', 'userId')
export const legacyEmailVerificationsUserData = userCollection('emailverifications', 'userId')
export const legacySessionsUserData = userCollection('sessions', 'userId')
