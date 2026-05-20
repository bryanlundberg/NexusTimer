import { Schema, models, model, Types } from 'mongoose'

export interface SessionDocument {
  _id: string
  userId: Types.ObjectId
  sessionId: string
  userAgent?: string
  ipHash?: string
  createdAt: Date
  lastSeenAt: Date
  expiresAt: Date
  revokedAt?: Date
}

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true },
    userAgent: { type: String },
    ipHash: { type: String },
    lastSeenAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date }
  },
  { timestamps: true }
)

SessionSchema.index({ sessionId: 1 }, { unique: true })
SessionSchema.index({ userId: 1 })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.Session || model('Session', SessionSchema)
