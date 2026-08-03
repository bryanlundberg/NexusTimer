import { Schema, models, model } from 'mongoose'
import type { AchievementRarityStats } from './rarity'

/**
 * Rarity lives in exactly one document. The whole set is swapped at once, so a
 * reader never sees half of a recompute - and there is nothing to clean up when
 * a badge id is renamed, since the next run rewrites `badges` wholesale.
 */
export const ACHIEVEMENT_RARITY_ID = 'current'

export interface AchievementRarityDocument extends AchievementRarityStats {
  _id: string
  updatedAt: Date
}

const RarityEntrySchema = new Schema(
  {
    holders: { type: Number, required: true },
    pct: { type: Number, required: true }
  },
  { _id: false }
)

const AchievementRaritySchema = new Schema(
  {
    _id: { type: String, default: ACHIEVEMENT_RARITY_ID },
    registeredUsers: { type: Number, required: true },
    scannedUsers: { type: Number, required: true },
    failedUsers: { type: Number, required: true, default: 0 },
    computedAt: { type: Date, required: true },
    badges: { type: Map, of: RarityEntrySchema, required: true }
  },
  { timestamps: true, _id: false }
)

export default models.AchievementRarity || model('AchievementRarity', AchievementRaritySchema)
