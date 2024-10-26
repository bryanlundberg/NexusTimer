import { Schema, model, models } from "mongoose";

const BackupSchema = new Schema(
  {
    user: {
      type: Object,
      required: false,
    },
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Backup = models.Backup || model("Backup", BackupSchema);

export default Backup;
