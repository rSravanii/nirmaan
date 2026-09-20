import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types/index.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  institution?: string;
  department?: string;
  district?: string;
  state?: string;
  impactPoints: number;
  badges: string[];
  isDemoAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      enum: ['CITIZEN', 'NGO', 'STUDENT', 'PROFESSOR', 'RESEARCHER', 'COMPANY', 'EVALUATOR', 'ADMIN'],
      default: 'CITIZEN',
      index: true
    },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    institution: { type: String, trim: true },
    department: { type: String, trim: true },
    district: { type: String, trim: true, default: 'Ranchi', index: true },
    state: { type: String, default: 'Jharkhand' },
    impactPoints: { type: Number, default: 0, index: true },
    badges: [{ type: String }],
    isDemoAccount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
