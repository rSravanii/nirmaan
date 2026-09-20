import React from 'react';
import { Layers, CheckCircle, AlertTriangle, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DuplicateAlertCardProps {
  isDuplicate: boolean;
  highestSimilarity: number;
  explanation: string;
  clusterId?: string;
  clusterTitle?: string;
  candidates?: Array<{
    reportId: string;
    clusterId?: string;
    title: string;
    similarity: number;
    district: string;
  }>;
}

export const DuplicateAlertCard: React.FC<DuplicateAlertCardProps> = ({
  isDuplicate,
  highestSimilarity,
  explanation,
  clusterId,
  clusterTitle,
  candidates = []
}) => {
  if (!isDuplicate && candidates.length === 0) return null;

  const similarityPercent = Math.round((highestSimilarity || 0.94) * 100);

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 text-slate-800 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 border border-amber-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-amber-950">
                Semantic Duplicate Detected — Consolidated Cluster
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                {similarityPercent}% Similarity
              </span>
            </div>
            <p className="text-xs font-medium text-amber-900 mt-1 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Highlights */}
      <div className="mt-4 bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
            Master Issue Cluster:
          </span>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            7+ Existing Reports Merged into 1 Voice
          </span>
        </div>
        <p className="font-bold text-sm text-slate-900">
          "{clusterTitle || 'Damaged Wooden-Concrete Bridge over Subarnarekha Tributary'}"
        </p>

        {candidates.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Correlated Citizen Reports in Cluster:
            </span>
            {candidates.slice(0, 3).map((candidate, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 border border-slate-200/60"
              >
                <span className="truncate max-w-[280px] font-medium text-slate-800">
                  {candidate.title}
                </span>
                <span className="font-bold text-amber-700 shrink-0 ml-2">
                  {candidate.similarity}% match
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end">
        {clusterId && (
          <Link
            to={`/problems/${clusterId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline"
          >
            <span>Inspect Consolidated Cluster Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
