import mongoose, { type Model } from 'mongoose'
const { Schema, model, models } = mongoose

export interface UserDoc {
  _id: string
  name: string
  email: string
  image: string
}

const UserSchema = new Schema<UserDoc>(
  {
    name: String,
    email: String,
    image: String
  },
  { collection: 'users', strict: false, timestamps: true }
)

export const User: Model<UserDoc> = (models.User as Model<UserDoc>) ?? model<UserDoc>('User', UserSchema)
