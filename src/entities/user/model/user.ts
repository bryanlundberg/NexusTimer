import { Schema, models, model } from 'mongoose'

export interface UserDocument {
  _id: string
  name: string
  email: string
  image: string
  bio?: string
  pronoun?: string
  timezone?: string
  goal?: string
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
    timezone: {
      type: String
    },
    goal: {
      type: String
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
UserSchema.index({ 'providers.provider': 1, 'providers.providerId': 1 }, { unique: true })

export default models.User || model('User', UserSchema)
