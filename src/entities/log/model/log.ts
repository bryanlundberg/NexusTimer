import { Schema, models, model } from 'mongoose'

export enum LogType {
  AuthError = 'auth_error',
  ApiError = 'api_error',
  Info = 'info',
  Warning = 'warning'
}

export interface LogDocument {
  _id: string
  type: LogType
  message: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

const LogSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(LogType),
      required: true
    },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true, capped: { size: 5 * 1024 * 1024, max: 1000 } }
)

LogSchema.index({ createdAt: -1 })
LogSchema.index({ type: 1 })

export default models.Log || model('Log', LogSchema)
