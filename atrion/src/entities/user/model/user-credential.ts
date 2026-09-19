import mongoose, { type Model, type Types } from 'mongoose'

const { Schema, model, models } = mongoose

export interface UserCredentialDoc {
  _id: string
  userId: Types.ObjectId
  passwordHash: string
}

const UserCredentialSchema = new Schema<UserCredentialDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    passwordHash: String
  },
  { collection: 'usercredentials', strict: false, timestamps: true }
)

export const UserCredential: Model<UserCredentialDoc> =
  (models.UserCredential as Model<UserCredentialDoc>) ??
  model<UserCredentialDoc>('UserCredential', UserCredentialSchema)
