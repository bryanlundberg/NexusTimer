import { PasswordResetTokenModel, PendingRegistrationModel } from './auth.model'

export type PendingRegistration = {
  id: string
  email: string
  name: string
  passwordHash: string
  code: string
  expiresAt: Date
}

export type PasswordResetToken = { id: string; userId: string; oobCode: string; expiresAt: Date }

export type AuthRepository = {
  savePendingRegistration(registration: Omit<PendingRegistration, 'id'>): Promise<void>
  findPendingRegistration(email: string, code?: string): Promise<PendingRegistration | null>
  updatePendingCode(id: string, code: string, expiresAt: Date): Promise<void>
  deletePendingRegistration(id: string): Promise<void>
  createResetToken(token: Omit<PasswordResetToken, 'id'>): Promise<void>
  findResetToken(oobCode: string): Promise<PasswordResetToken | null>
  deleteResetToken(id: string): Promise<void>
}

export const authRepository: AuthRepository = {
  async savePendingRegistration(registration) {
    await PendingRegistrationModel.findOneAndUpdate({ email: registration.email }, registration, { upsert: true })
  },
  async findPendingRegistration(email, code) {
    const doc = await PendingRegistrationModel.findOne(code === undefined ? { email } : { email, code }).lean()
    if (!doc) return null
    return {
      id: String(doc._id),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      code: doc.code,
      expiresAt: doc.expiresAt
    }
  },
  async updatePendingCode(id, code, expiresAt) {
    await PendingRegistrationModel.updateOne({ _id: id }, { $set: { code, expiresAt } })
  },
  async deletePendingRegistration(id) {
    await PendingRegistrationModel.deleteOne({ _id: id })
  },
  async createResetToken(token) {
    await PasswordResetTokenModel.create(token)
  },
  async findResetToken(oobCode) {
    const doc = await PasswordResetTokenModel.findOne({ oobCode }).lean()
    if (!doc) return null
    return { id: String(doc._id), userId: String(doc.userId), oobCode: doc.oobCode, expiresAt: doc.expiresAt }
  },
  async deleteResetToken(id) {
    await PasswordResetTokenModel.deleteOne({ _id: id })
  }
}
