import { Schema, model, models } from 'mongoose'

const UserCredentialSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
)

UserCredentialSchema.index({ userId: 1 }, { unique: true })

export default models.UserCredential || model('UserCredential', UserCredentialSchema)
