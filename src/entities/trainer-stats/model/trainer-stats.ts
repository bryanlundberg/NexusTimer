import { model, models, Schema } from 'mongoose'

export type {
  TrainerCaseStatsDoc,
  TrainerMethodStatsDoc,
  TrainerStatsDocument
} from '@/entities/trainer-stats/model/types'

/**
 * Single document per user holding aggregated trainer stats for ALL methods.
 * `methods` is Mixed so we can update with dotted paths atomically. We persist
 * sums + counters so averages and records stay O(1) per solve without
 * scanning the solves collection. See `./types.ts` for the shape.
 */

const TrainerStatsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required']
    },
    methods: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true, minimize: false }
)

TrainerStatsSchema.index({ user: 1 }, { unique: true })

export default models.TrainerStats || model('TrainerStats', TrainerStatsSchema)
