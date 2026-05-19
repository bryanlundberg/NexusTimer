import { Schema, models, model, Types } from 'mongoose'

export interface UserCredentialDocument {
  _id: string
  userId: Types.ObjectId
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const UserCredentialSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export default models.UserCredential || model('UserCredential', UserCredentialSchema)
