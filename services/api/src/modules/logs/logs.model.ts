import { Schema, model } from 'mongoose'

export const LOG_TYPES = ['auth_error', 'api_error', 'info', 'warning'] as const

export type LogType = (typeof LOG_TYPES)[number]

const logSchema = new Schema(
  {
    type: { type: String, enum: LOG_TYPES, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true, capped: { size: 5 * 1024 * 1024, max: 1000 } }
)

logSchema.index({ createdAt: -1 })
logSchema.index({ type: 1 })

export const LogModel = model('Log', logSchema)
