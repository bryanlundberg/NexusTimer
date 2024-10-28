import { Document, Schema, model, models } from "mongoose";

export interface Users extends Document {
  name: string;
  email: string;
  image: string;
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
