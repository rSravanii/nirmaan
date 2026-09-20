import mongoose, { Document, Schema } from 'mongoose';

export interface ISolution extends Document {
  projectId: mongoose.Types.ObjectId;
  problemReportId: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  implementationDetails?: string;
  technologies: string[];
  resourcesRequired: string[];
  outcome?: string;
  limitations?: string;
  evidenceUrls: string[];
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'OUTDATED';
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISolution>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true, index: true },
  problemReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport', required: true, index: true },
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true },
  implementationDetails: { type: String },
  technologies: [{ type: String }],
  resourcesRequired: [{ type: String }],
  outcome: { type: String },
  limitations: { type: String },
  evidenceUrls: [{ type: String }],
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  verificationStatus: { type: String, enum: ['PENDING','VERIFIED','REJECTED','OUTDATED'], default: 'PENDING', index: true },
  embedding: [{ type: Number }],
}, { timestamps: true });

export const Solution = mongoose.model<ISolution>('Solution', schema);
