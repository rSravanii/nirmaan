import { ActivityLog } from '../models/ActivityLog.js';
import mongoose from 'mongoose';

export async function logActivity(params: {
  userId?: string | mongoose.Types.ObjectId;
  userName: string;
  userRole?: string;
  action: string;
  details: string;
  entityType: 'REPORT' | 'PROJECT' | 'MILESTONE' | 'VERIFICATION' | 'SYSTEM';
  entityId?: string | mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    await ActivityLog.create({
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      details: params.details,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata,
    });
  } catch (err) {
    console.error('Failed to record activity log:', err);
  }
}
