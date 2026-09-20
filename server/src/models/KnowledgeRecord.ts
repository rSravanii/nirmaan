import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeRecord extends Document {
  problemReportId: mongoose.Types.ObjectId;
  solutionId: mongoose.Types.ObjectId;
  title: string;
  problemText: string;
  solutionText: string;
  category: string;
  subcategory?: string;
  district?: string;
  state?: string;
  tags: string[];
  sourceType: 'VERIFIED_PROJECT' | 'GOVERNMENT_HISTORY' | 'IMPORTED' | 'MANUAL';
  sourceReference?: string;
  verificationStatus: 'VERIFIED' | 'OUTDATED' | 'ARCHIVED' | 'REVOKED';
  visibility: 'PUBLIC' | 'ADMIN_ONLY' | 'RESTRICTED';
  embedding?: number[];
  createdBy?: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  lastReviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IKnowledgeRecord>({
  problemReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport', required: true, index: true },
  solutionId: { type: Schema.Types.ObjectId, ref: 'Solution', required: true, index: true },
  title: { type: String, required: true, index: true },
  problemText: { type: String, required: true },
  solutionText: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, index: true },
  district: { type: String, index: true },
  state: { type: String, index: true },
  tags: [{ type: String, index: true }],
  sourceType: { type: String, enum: ['VERIFIED_PROJECT','GOVERNMENT_HISTORY','IMPORTED','MANUAL'], required: true },
  sourceReference: { type: String },
  verificationStatus: { type: String, enum: ['VERIFIED','OUTDATED','ARCHIVED','REVOKED'], default: 'VERIFIED', index: true },
  visibility: { type: String, enum: ['PUBLIC','ADMIN_ONLY','RESTRICTED'], default: 'ADMIN_ONLY', index: true },
  embedding: [{ type: Number }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  lastReviewedAt: { type: Date },
}, { timestamps: true });

schema.index({ category: 1, district: 1, verificationStatus: 1 });
schema.index({ tags: 1, verificationStatus: 1 });
export const KnowledgeRecord = mongoose.model<IKnowledgeRecord>('KnowledgeRecord', schema);
