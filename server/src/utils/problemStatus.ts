import mongoose from 'mongoose';
import { IProblemReport } from '../models/ProblemReport.js';
import { ProblemStatus } from '../types/index.js';

/**
 * Applies a citizen-visible report status change and records its audit entry
 * in the existing ProblemReport document.
 */
export function appendProblemStatus(
  report: IProblemReport,
  status: ProblemStatus,
  note: string,
  updatedBy?: mongoose.Types.ObjectId,
): void {
  report.status = status;
  report.statusHistory.push({
    status,
    note,
    updatedBy,
    updatedAt: new Date(),
  });
}
