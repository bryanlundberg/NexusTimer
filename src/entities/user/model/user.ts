import { Schema, models, model } from 'mongoose'

export interface UserDocument {
  _id: string
  name: string
  email: string
  image: string
  bio?: string
  pronoun?: string
  country?: string
  goal?: string
  wcaId?: string
  wcaVerifiedAt?: number
  lastSeenAt?: number
  backup?: {
    url: string
    updatedAt: number
  }
  providers: Array<{
    provider: string
    providerId: string
  }>
  createdAt: Date
  updatedAt: Date
  __v: number
}

/**
 * Shape of the user as returned by `GET /api/v1/users/[id]`. Extends the
 * persisted document with fields the endpoint joins on the fly — currently
 * just the keys of manually-granted achievements.
 */
export interface UserProfile extends UserDocument {
  grantedAchievements?: string[]
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    pronoun: {
      type: String
    },
    country: {
      type: String
    },
    goal: {
      type: String
    },
    wcaId: {
      type: String
    },
    wcaVerifiedAt: {
      type: Number
    },
    lastSeenAt: {
      type: Number
    },
    backup: {
      type: {
        url: { type: String },
        updatedAt: { type: Number }
      }
    },
    providers: [
      {
        provider: { type: String },
        providerId: { type: String },
        _id: false
      }
    ]
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ 'providers.provider': 1, 'providers.providerId': 1 }, { unique: true, sparse: true })
UserSchema.index({ 'backup.updatedAt': -1, createdAt: -1 })
UserSchema.index({ country: 1, 'backup.updatedAt': -1, createdAt: -1 })
UserSchema.index({ name: 1 })
UserSchema.index({ wcaId: 1 }, { unique: true, sparse: true })

export default models.User || model('User', UserSchema)
