import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userRole?: string;
  action: string;
  details: string;
  entityType: 'REPORT' | 'PROJECT' | 'MILESTONE' | 'VERIFICATION' | 'SYSTEM';
  entityId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userRole: { type: String },
    action: { type: String, required: true },
    details: { type: String, required: true },
    entityType: {
      type: String,
      required: true,
      enum: ['REPORT', 'PROJECT', 'MILESTONE', 'VERIFICATION', 'SYSTEM'],
      index: true
    },
    entityId: { type: Schema.Types.ObjectId, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
