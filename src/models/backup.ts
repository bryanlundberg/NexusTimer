import { Schema, models, model } from "mongoose";

const BackupSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    data: {
      type: String,
      required: [true, "Parse and include the backup into a string"],
    },
    index: {
      type: Number,
      required: [true, "Please provide the chunk index"],
    }
  },
  { timestamps: true }
);

export default models.Backup || model("Backup", BackupSchema);
