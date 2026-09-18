import { Schema, models, model } from 'mongoose'
import { FACE_COLORS } from '@/shared/const/face-colors'
import { CUBING_METHODS, type CubingMethod } from '@/shared/const/cubing-methods'
import { Layers } from '@/shared/types/enums'
import { FRIEND_REQUEST_POLICIES, STATS_VISIBILITIES, type PrivacySettings } from '@/entities/privacy/model/types'

export interface UserDocument {
  _id: string
  name: string
  email: string
  image: string
  bio?: string
  pronoun?: string
  country?: string
  goal?: string
  method?: CubingMethod
  mainColors?: Layers[]
  links?: string[]
  wcaId?: string
  wcaVerifiedAt?: number
  backup?: {
    url: string
    updatedAt: number
  }
  providers: Array<{
    provider: string
    providerId: string
  }>
  privacy?: Partial<PrivacySettings>
  createdAt: Date
  updatedAt: Date
  __v: number
}

/**
 * Shape of the user as returned by `GET /api/v1/users/[id]`. Extends the
 * persisted document with fields the endpoint joins on the fly: the keys of
 * manually-granted achievements and whether the viewer may see the stats.
 */
export interface UserProfile extends UserDocument {
  grantedAchievements?: string[]
  statsHidden?: boolean
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
    method: {
      type: String,
      enum: CUBING_METHODS
    },
    mainColors: {
      type: [{ type: String, enum: FACE_COLORS }],
      default: undefined
    },
    links: {
      type: [String],
      default: undefined
    },
    wcaId: {
      type: String
    },
    wcaVerifiedAt: {
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
    ],
    privacy: {
      type: {
        friendRequests: { type: String, enum: FRIEND_REQUEST_POLICIES },
        statsVisibility: { type: String, enum: STATS_VISIBILITIES },
        readReceipts: { type: Boolean },
        typingIndicator: { type: Boolean }
      },
      _id: false
    }
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
