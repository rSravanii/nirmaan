import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  industry: string;
  website?: string;
  description?: string;
  focusAreas: string[];
  capabilities: string[];
  districts: string[];
  contactEmail: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICompanyProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  companyName: { type: String, required: true, trim: true, index: true },
  industry: { type: String, required: true, index: true },
  website: { type: String },
  description: { type: String },
  focusAreas: [{ type: String, index: true }],
  capabilities: [{ type: String, index: true }],
  districts: [{ type: String, index: true }],
  contactEmail: { type: String, required: true },
  verified: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const CompanyProfile = mongoose.model<ICompanyProfile>('CompanyProfile', schema);
