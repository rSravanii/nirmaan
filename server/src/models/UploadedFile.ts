import mongoose, { Document, Schema } from 'mongoose';

export interface IUploadedFile extends Document {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy?: mongoose.Types.ObjectId;
  fileType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  purpose: 'PROBLEM_REPORT' | 'MILESTONE_EVIDENCE' | 'AVATAR' | 'PROJECT_DOC';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const UploadedFileSchema = new Schema<IUploadedFile>(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    fileType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'],
      default: 'IMAGE',
    },
    purpose: {
      type: String,
      enum: ['PROBLEM_REPORT', 'MILESTONE_EVIDENCE', 'AVATAR', 'PROJECT_DOC'],
      default: 'PROBLEM_REPORT',
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UploadedFile = mongoose.model<IUploadedFile>('UploadedFile', UploadedFileSchema);
