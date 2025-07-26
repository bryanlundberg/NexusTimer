import { Schema, models, model, Document } from "mongoose";

export interface Users extends Document {
  name: string;
  email: string;
  image: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
