import React from 'react';
import { Bot, Sparkles, CheckCircle2, Globe2, Tag, BookOpen, AlertCircle, ShieldAlert } from 'lucide-react';

interface AIProcessingCardProps {
  analysis: {
    detectedLanguage?: string;
    originalText?: string;
    translatedText?: string;
    summary?: string;
    category?: string;
    subcategory?: string;
    severity?: string;
    affectedPopulation?: number;
    locationEntities?: string[];
    tags?: string[];
    suggestedResearchDomains?: string[];
    confidence?: number;
    provider?: string;
    isFallback?: boolean;
    explanation?: string;
    duplicateCandidates?: Array<{
      reportId: string;
      title: string;
      similarity: number;
    }>;
  };
  isLoading?: boolean;
}

export const AIProcessingCard: React.FC<AIProcessingCardProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Bot className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-base">AI Civic Orchestration Engine</h3>
            <p className="text-xs text-slate-300">Translating, categorizing & performing vector deduplication...</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-slate-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded-md w-1/2"></div>
        </div>
      </div>
    );
  }

  const langNames: Record<string, string> = {
    hi: 'हिन्दी (Hindi)',
    te: 'తెలుగు (Telugu)',
    sat: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)',
    mun: 'ᱢᱩᱱᱰᱟᱨᱤ (Mundari)',
    ho: 'ᱦᱳ (Ho)',
    en: 'English'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight text-white">AI Analysis & Structured Extraction</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {Math.round((analysis.confidence || 0.94) * 100)}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Provider: {analysis.provider || 'Demo AI Pipeline (Deterministic)'}
            </p>
          </div>
        </div>

        {/* Honest Provider badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{analysis.isFallback ? 'Deterministic SIH Engine' : 'Live Cloud LLM'}</span>
        </div>
      </div>

      {/* Grid of Extracted Attributes */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language & Translation */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              Detected Input Language:
            </span>
            <span className="text-white font-bold">
              {langNames[analysis.detectedLanguage || 'en'] || analysis.detectedLanguage || 'English'}
            </span>
          </div>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Normalized English Translation:</span>
            <p className="italic font-medium">{analysis.translatedText || analysis.originalText}</p>
          </div>
        </div>

        {/* Classification & Severity */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Classified Category:</span>
            <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-xs">
              {analysis.category || 'General Infrastructure'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Assessed Severity:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-xs ${
              analysis.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              analysis.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {analysis.severity || 'HIGH'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Affected Rural Population:</span>
            <span className="font-bold text-emerald-400">
              ~{analysis.affectedPopulation || 650} citizens
            </span>
          </div>
        </div>
      </div>

      {/* Suggested University Domains */}
      {analysis.suggestedResearchDomains && analysis.suggestedResearchDomains.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Recommended University Research Domains:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.suggestedResearchDomains.map((domain, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Tags */}
      {analysis.tags && analysis.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {analysis.tags.map((tag, i) => (
            <span key={i} className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-slate-500" />
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
