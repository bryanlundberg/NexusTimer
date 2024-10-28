import { Document, Schema, model, models } from "mongoose";

export interface Users extends Document {
  username: string;
  email: string;
  imagen: string;
}

const UserSchema = new Schema(
  {
    username: {
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
