import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectMilestone extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  phaseNumber: number;
  evidenceFiles: string[];
  evidenceNotes?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  reviewerNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  submittedAt?: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMilestoneSchema = new Schema<IProjectMilestone>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    phaseNumber: { type: Number, default: 1 },
    evidenceFiles: [{ type: String }],
    evidenceNotes: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    reviewerNotes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

export const ProjectMilestone = mongoose.model<IProjectMilestone>('ProjectMilestone', ProjectMilestoneSchema);
