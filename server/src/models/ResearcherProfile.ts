import mongoose, { Document, Schema } from 'mongoose';

export interface IResearcherProfile extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  department: string;
  designation?: string;
  expertiseAreas: string[];
  researchTopics: string[];
  publications?: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IResearcherProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  institution: { type: String, required: true, index: true },
  department: { type: String, required: true, index: true },
  designation: { type: String, default: 'Researcher' },
  expertiseAreas: [{ type: String, index: true }],
  researchTopics: [{ type: String }],
  publications: [{ type: String }],
  bio: { type: String },
}, { timestamps: true });

export const ResearcherProfile = mongoose.model<IResearcherProfile>('ResearcherProfile', schema);
