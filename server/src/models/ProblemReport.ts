import mongoose, { Document, Schema } from 'mongoose';
import { ProblemCategory, ProblemSeverity, ProblemStatus, SupportedLanguage } from '../types/index.js';

export interface IProblemReport extends Document {
  title: string;
  description: string;
  originalLanguage: SupportedLanguage | string;
  translatedText?: string;
  aiSummary?: string;
  category: ProblemCategory;
  subcategory?: string;
  severity: ProblemSeverity;
  affectedPopulation: number;
  locationName: string;
  village: string;
  district: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos: string[];
  cameraCaptured: boolean;
  audioUrl?: string;
  videoUrl?: string;
  reportedBy?: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  reporterContactMasked?: string;
  clusterId?: mongoose.Types.ObjectId;
  duplicateConfidence?: number;
  isDuplicate: boolean;
  status: ProblemStatus;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: mongoose.Types.ObjectId;
  verificationNotes?: string;
  claimedByProjectId?: mongoose.Types.ObjectId;
  embedding?: number[];
  tags: string[];
  suggestedDomains: string[];
  upvotes: number;
  supporters: mongoose.Types.ObjectId[];
  aiMetadata?: {
    confidence: number;
    provider: string;
    isFallback: boolean;
    extractedEntities: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProblemReportSchema = new Schema<IProblemReport>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    originalLanguage: { type: String, default: 'en' },
    translatedText: { type: String },
    aiSummary: { type: String },
    category: { 
      type: String, 
      required: true,
      index: true
    },
    subcategory: { type: String },
    severity: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
      default: 'MEDIUM',
      index: true 
    },
    affectedPopulation: { type: Number, default: 50 },
    locationName: { type: String, default: '' },
    village: { type: String, default: '', index: true },
    district: { type: String, required: true, index: true },
    state: { type: String, default: 'Jharkhand' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    photos: [{ type: String }],
    cameraCaptured: { type: Boolean, default: false },
    audioUrl: { type: String },
    videoUrl: { type: String },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: false },
    reporterContactMasked: { type: String },
    clusterId: { type: Schema.Types.ObjectId, ref: 'ProblemCluster', index: true },
    duplicateConfidence: { type: Number, default: 0 },
    isDuplicate: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ['OPEN', 'VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
      index: true 
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationNotes: { type: String },
    claimedByProjectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    embedding: [{ type: Number }],
    tags: [{ type: String }],
    suggestedDomains: [{ type: String }],
    upvotes: { type: Number, default: 0 },
    supporters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    aiMetadata: {
      confidence: { type: Number, default: 0.9 },
      provider: { type: String, default: 'demo' },
      isFallback: { type: Boolean, default: true },
      extractedEntities: [{ type: String }],
    }
  },
  { timestamps: true }
);

ProblemReportSchema.index({ district: 1, category: 1, status: 1 });
ProblemReportSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

export const ProblemReport = mongoose.model<IProblemReport>('ProblemReport', ProblemReportSchema);
