import mongoose, { Document, Schema } from 'mongoose';
import { ProblemCategory, ProblemSeverity, ProblemStatus } from '../types/index.js';

export interface IProblemCluster extends Document {
  title: string;
  category: ProblemCategory;
  district: string;
  village: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  severity: ProblemSeverity;
  status: ProblemStatus;
  primaryReportId: mongoose.Types.ObjectId;
  reportIds: mongoose.Types.ObjectId[];
  reportCount: number;
  totalAffectedPopulation: number;
  embedding: number[];
  tags: string[];
  suggestedResearchDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProblemClusterSchema = new Schema<IProblemCluster>(
  {
    title: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    village: { type: String, default: '' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    severity: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
      default: 'MEDIUM',
      index: true
    },
    status: { 
      type: String, 
      enum: ['OPEN', 'VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
      index: true
    },
    primaryReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport' },
    reportIds: [{ type: Schema.Types.ObjectId, ref: 'ProblemReport' }],
    reportCount: { type: Number, default: 1 },
    totalAffectedPopulation: { type: Number, default: 0 },
    embedding: [{ type: Number }],
    tags: [{ type: String }],
    suggestedResearchDomains: [{ type: String }],
  },
  { timestamps: true }
);

ProblemClusterSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
ProblemClusterSchema.index({ district: 1, category: 1, status: 1 });

export const ProblemCluster = mongoose.model<IProblemCluster>('ProblemCluster', ProblemClusterSchema);
