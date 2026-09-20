import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyParticipation extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  participationType: 'MENTORSHIP' | 'FUNDING' | 'TECHNICAL_RESOURCE' | 'COLLABORATION';
  status: 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICompanyParticipation>({
  companyId: { type: Schema.Types.ObjectId, ref: 'CompanyProfile', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  participationType: { type: String, enum: ['MENTORSHIP','FUNDING','TECHNICAL_RESOURCE','COLLABORATION'], required: true },
  status: { type: String, enum: ['REQUESTED','APPROVED','ACTIVE','COMPLETED','REJECTED'], default: 'REQUESTED', index: true },
  notes: { type: String },
}, { timestamps: true });

schema.index({ companyId: 1, projectId: 1, participationType: 1 }, { unique: true });
export const CompanyParticipation = mongoose.model<ICompanyParticipation>('CompanyParticipation', schema);
