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
    }
  },
  { timestamps: true }
)

export default models.User || model('User', UserSchema)
