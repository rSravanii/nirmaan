import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  projectId?: mongoose.Types.ObjectId;
  leaderId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  institution: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    institution: { type: String, required: true },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
