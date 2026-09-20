import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  roleInTeam: string;
  joinedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roleInTeam: { type: String, default: 'Developer' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
