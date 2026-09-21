import { ProblemReport, ProblemStatus } from '../types/index.js';

export interface TrackingStatus {
  label: string;
  tone: 'slate' | 'amber' | 'emerald' | 'blue' | 'purple' | 'red';
}

const statusMap: Record<ProblemStatus, TrackingStatus> = {
  OPEN: { label: 'Report Submitted', tone: 'slate' },
  VERIFIED: { label: 'Verified', tone: 'emerald' },
  REJECTED: { label: 'Rejected', tone: 'red' },
  CLAIMED: { label: 'Assigned', tone: 'blue' },
  IN_PROGRESS: { label: 'Project In Progress', tone: 'blue' },
  SUBMITTED: { label: 'Solution Submitted', tone: 'purple' },
  UNDER_REVIEW: { label: 'Government Verification', tone: 'amber' },
  RESOLVED: { label: 'Resolved', tone: 'emerald' },
};

export function getTrackingStatus(status: ProblemStatus): TrackingStatus {
  return statusMap[status];
}

export function getVerificationLabel(report: Pick<ProblemReport, 'verificationStatus' | 'status'>): TrackingStatus {
  if (report.verificationStatus === 'VERIFIED') return { label: 'Authority Verified', tone: 'emerald' };
  if (report.verificationStatus === 'REJECTED') return { label: 'Verification Rejected', tone: 'red' };
  if (report.status === 'UNDER_REVIEW') return { label: 'Government Verification Pending', tone: 'amber' };
  return { label: 'Under Review', tone: 'amber' };
}

export const trackingToneClasses: Record<TrackingStatus['tone'], string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-50 text-blue-800 border-blue-200',
  purple: 'bg-purple-50 text-purple-800 border-purple-200',
  red: 'bg-red-50 text-red-800 border-red-200',
};
