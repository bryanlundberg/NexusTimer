import { Schema, model } from 'mongoose'

// Read model with the public profile fields only; the full schema moves here with the users domain.
const userSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  country: { type: String },
  pronoun: { type: String },
  goal: { type: String }
})

export const UserModel = model('User', userSchema)
