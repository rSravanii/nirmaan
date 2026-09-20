import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyOffer extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  type: 'MENTORSHIP' | 'FUNDING' | 'TECHNICAL_RESOURCE';
  title: string;
  description: string;
  amount?: number;
  status: 'OPEN' | 'ACCEPTED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICompanyOffer>({
  companyId: { type: Schema.Types.ObjectId, ref: 'CompanyProfile', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
  type: { type: String, enum: ['MENTORSHIP','FUNDING','TECHNICAL_RESOURCE'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  amount: { type: Number, min: 0 },
  status: { type: String, enum: ['OPEN','ACCEPTED','CLOSED'], default: 'OPEN', index: true },
}, { timestamps: true });

export const CompanyOffer = mongoose.model<ICompanyOffer>('CompanyOffer', schema);
