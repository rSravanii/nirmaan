import React from 'react';
import { ProblemStatusHistoryEntry } from '../types/index.js';
import { getTrackingStatus, trackingToneClasses } from '../utils/reportTracking.js';

export const ReportStatusTimeline: React.FC<{ history?: ProblemStatusHistoryEntry[] }> = ({ history }) => {
  if (!history?.length) return <p className="text-sm text-slate-500">No status updates have been recorded yet.</p>;
  const entries = [...history].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return <ol className="space-y-4">
    {entries.map((entry, index) => {
      const stage = getTrackingStatus(entry.status);
      return <li key={`${entry.updatedAt}-${index}`} className="relative pl-6">
        <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
        {index < entries.length - 1 && <span className="absolute left-[5px] top-5 h-[calc(100%+0.5rem)] w-px bg-slate-200" />}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${trackingToneClasses[stage.tone]}`}>{stage.label}</span>
          <time className="text-xs text-slate-500">{new Date(entry.updatedAt).toLocaleString()}</time>
        </div>
        <p className="mt-1 text-sm text-slate-700">{entry.note}</p>
        {entry.updatedBy?.name && <p className="mt-1 text-xs text-slate-500">Updated by {entry.updatedBy.name}</p>}
      </li>;
    })}
  </ol>;
};
