import mongoose, { Document, Schema } from 'mongoose';

export interface IReward extends Document {
  userId: mongoose.Types.ObjectId;
  points: number;
  reason: string;
  sourceType: 'REPORT_VERIFIED' | 'USEFUL_EVIDENCE' | 'PROBLEM_CLAIMED' | 'MILESTONE_COMPLETED' | 'SOLUTION_VERIFIED' | 'IMPACT_ACHIEVED';
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RewardSchema = new Schema<IReward>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    sourceType: {
      type: String,
      required: true,
      enum: ['REPORT_VERIFIED', 'USEFUL_EVIDENCE', 'PROBLEM_CLAIMED', 'MILESTONE_COMPLETED', 'SOLUTION_VERIFIED', 'IMPACT_ACHIEVED'],
      index: true
    },
    relatedId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);
