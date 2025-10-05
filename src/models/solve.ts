import { model, models, Schema } from 'mongoose';

const SolveSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    time: {
      type: Number,
      required: [true, 'Please provide a solve time'],
    },
    scramble: {
      type: String,
      required: [true, 'Please provide a scramble'],
    },
    solution: {
      type: String,
      required: false,
    },
    puzzle: {
      type: String,
      enum: ['3x3x3'],
      default: '3x3x3',
      required: [true, 'Please provide a cube type'],
    },
  },
  { timestamps: true }
);

export default models.Solve || model('Solve', SolveSchema);
