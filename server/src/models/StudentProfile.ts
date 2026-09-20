import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  department: string;
  yearOfStudy: number;
  skills: string[];
  interestDomains: string[];
  completedProjectsCount: number;
  activeProjectsCount: number;
  impactScore: number;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    institution: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    yearOfStudy: { type: Number, default: 3 },
    skills: [{ type: String, index: true }],
    interestDomains: [{ type: String, index: true }],
    completedProjectsCount: { type: Number, default: 0 },
    activeProjectsCount: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    bio: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
