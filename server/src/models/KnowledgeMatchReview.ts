import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeMatchReview extends Document {
  problemReportId: mongoose.Types.ObjectId;
  knowledgeRecordId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  similarity: number;
  decision: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  notes?: string;
  createdAt: Date;
}

const schema = new Schema<IKnowledgeMatchReview>({
  problemReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport', required: true, index: true },
  knowledgeRecordId: { type: Schema.Types.ObjectId, ref: 'KnowledgeRecord', required: true, index: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  similarity: { type: Number, required: true, min: 0, max: 1 },
  decision: { type: String, enum: ['APPROVED','REJECTED','NEEDS_REVIEW'], required: true },
  notes: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const KnowledgeMatchReview = mongoose.model<IKnowledgeMatchReview>('KnowledgeMatchReview', schema);
