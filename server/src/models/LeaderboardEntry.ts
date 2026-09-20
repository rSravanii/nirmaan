import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  entityType: 'USER' | 'UNIVERSITY';
  entityId?: mongoose.Types.ObjectId;
  entityName: string;
  category?: string; // e.g. student, contributor, university
  avatarUrl?: string;
  points: number;
  resolvedProblemsCount: number;
  activeProjectsCount: number;
  rank: number;
  badge: string;
  updatedAt: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    entityType: { type: String, required: true, enum: ['USER', 'UNIVERSITY'], index: true },
    entityId: { type: Schema.Types.ObjectId, ref: 'User' },
    entityName: { type: String, required: true },
    category: { type: String, default: 'student' },
    avatarUrl: { type: String },
    points: { type: Number, default: 0, index: true },
    resolvedProblemsCount: { type: Number, default: 0 },
    activeProjectsCount: { type: Number, default: 0 },
    rank: { type: Number, default: 1 },
    badge: { type: String, default: 'Bronze Contributor' },
  },
  { timestamps: true }
);

LeaderboardEntrySchema.index({ entityType: 1, points: -1 });

export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
