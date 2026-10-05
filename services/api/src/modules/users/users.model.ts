import { CUBING_METHODS, FACE_COLORS, FRIEND_REQUEST_POLICIES, STATS_VISIBILITIES } from '@nexustimer/contracts'
import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    emailVerified: { type: Boolean },
    image: { type: String, required: true },
    bio: { type: String },
    pronoun: { type: String },
    country: { type: String },
    goal: { type: String },
    method: { type: String, enum: CUBING_METHODS },
    mainColors: { type: [{ type: String, enum: FACE_COLORS }], default: undefined },
    links: { type: [String], default: undefined },
    wcaId: { type: String },
    wcaVerifiedAt: { type: Number },
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
    ],
    privacy: {
      type: {
        friendRequests: { type: String, enum: FRIEND_REQUEST_POLICIES },
        statsVisibility: { type: String, enum: STATS_VISIBILITIES },
        friendRequestEmails: { type: Boolean },
        readReceipts: { type: Boolean },
        typingIndicator: { type: Boolean }
      },
      _id: false
    }
  },
  { timestamps: true }
)

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ 'providers.provider': 1, 'providers.providerId': 1 }, { unique: true, sparse: true })
userSchema.index({ 'backup.updatedAt': -1, createdAt: -1 })
userSchema.index({ country: 1, 'backup.updatedAt': -1, createdAt: -1 })
userSchema.index({ name: 1 })
userSchema.index({ wcaId: 1 }, { unique: true, sparse: true })

export const UserModel = model('User', userSchema)
