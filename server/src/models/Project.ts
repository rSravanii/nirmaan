import mongoose, { Document, Schema } from 'mongoose';
import { ProjectStatus } from '../types/index.js';

export interface IProject extends Document {
  title: string;
  description: string;
  problemReportId: mongoose.Types.ObjectId;
  clusterId?: mongoose.Types.ObjectId;
  leadStudentId: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  institution: string;
  department: string;
  mentorProfessorId?: mongoose.Types.ObjectId;
  status: ProjectStatus;
  milestones: mongoose.Types.ObjectId[];
  impactScore: number;
  impactPointsAwarded: number;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  evaluatorRemarks?: string;
  solutionSummary?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    problemReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport', required: true, index: true },
    clusterId: { type: Schema.Types.ObjectId, ref: 'ProblemCluster' },
    leadStudentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    institution: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    mentorProfessorId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['OPEN', 'CLAIMED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'RESOLVED', 'REWARDED'],
      default: 'CLAIMED',
      index: true
    },
    milestones: [{ type: Schema.Types.ObjectId, ref: 'ProjectMilestone' }],
    impactScore: { type: Number, default: 0 },
    impactPointsAwarded: { type: Number, default: 0 },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    evaluatorRemarks: { type: String },
    solutionSummary: { type: String },
    repositoryUrl: { type: String },
    demoUrl: { type: String }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
