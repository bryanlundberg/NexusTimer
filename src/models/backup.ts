import { Document, Schema, model, models } from "mongoose";

export interface Backups extends Document {
  user: string;
  data: string;
}

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
  },
  { timestamps: true }
);

export default models.Backup || model("Backup", BackupSchema);
