import mongoose, { Document, Schema } from 'mongoose';

export interface IProfessorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  department: string;
  designation: string;
  expertiseAreas: string[];
  publishedTopics: string[];
  mentoredProjectsCount: number;
  contactEmail: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessorProfileSchema = new Schema<IProfessorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    institution: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    designation: { type: String, default: 'Associate Professor' },
    expertiseAreas: [{ type: String, index: true }],
    publishedTopics: [{ type: String }],
    mentoredProjectsCount: { type: Number, default: 0 },
    contactEmail: { type: String, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

export const ProfessorProfile = mongoose.model<IProfessorProfile>('ProfessorProfile', ProfessorProfileSchema);
