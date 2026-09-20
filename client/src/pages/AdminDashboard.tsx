import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { BarChart3, Database, Sparkles, ShieldCheck, Search, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [problemId, setProblemId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    const [m, k, r] = await Promise.all([
      apiRequest('/admin/dashboard'),
      apiRequest('/knowledge'),
      apiRequest('/admin/reports?limit=12&page=1'),
    ]);
    if (m.success) setMetrics(m.metrics);
    if (k.success) setKnowledge(k.records || []);
    if (r.success) setReports(r.reports || []);
    if (!m.success || !k.success || !r.success) setError(m.message || k.message || r.message || 'Unable to load the government dashboard.');
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const search = async (selectedId = problemId) => {
    if (!selectedId) return;
    setProblemId(selectedId);
    setBusy(true);
    setError('');
    const r = await apiRequest(`/knowledge/search?problemId=${encodeURIComponent(selectedId)}`);
    setMatches(r.success ? r.matches || [] : []);
    if (!r.success) setError(r.message || 'Historical search failed.');
    setBusy(false);
  };

  const review = async (match: any, decision: 'APPROVED' | 'REJECTED') => {
    const r = await apiRequest('/knowledge/matches/review', {
      method: 'POST',
      body: JSON.stringify({
        problemReportId: problemId,
        knowledgeRecordId: match.knowledgeRecordId,
        similarity: match.similarity,
        decision,
      }),
    });
    if (!r.success) setError(r.message || 'Could not save review.');
    else setMatches((prev) => prev.filter((item) => item.knowledgeRecordId !== match.knowledgeRecordId));
  };

  if (loading) return <div className="py-20 text-center text-slate-500">Loading government administration dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold"><BarChart3 className="w-4 h-4" />Government Administration</div>
        <h1 className="text-3xl font-black mt-3">Nirmaan Decision Support Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Review verified problems, historical knowledge and AI retrieval recommendations.</p>
      </header>

      {error && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Reports', metrics?.totalReports], ['Verified', metrics?.verifiedReports], ['Historical knowledge', metrics?.historicalKnowledge], ['Pending match reviews', metrics?.pendingKnowledgeReviews]].map(([label, value]) => (
          <div key={label as string} className="bg-white border rounded-2xl p-5"><div className="text-2xl font-black">{value ?? 0}</div><div className="text-xs text-slate-500">{label}</div></div>
        ))}
      </div>

      <section className="bg-white border rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div><div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600" /><h2 className="text-xl font-black">Historical solution retrieval</h2></div><p className="text-xs text-slate-500 mt-1">Select a problem. AI compares it with verified historical knowledge using semantic similarity and contextual metadata.</p></div>
          <button onClick={() => void load()} className="p-2 rounded-lg border hover:bg-slate-50" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-2">
          <select value={problemId} onChange={(e) => setProblemId(e.target.value)} className="px-4 py-3 rounded-xl border bg-white text-sm">
            <option value="">Select a problem report</option>
            {reports.map((report) => <option key={report._id} value={report._id}>{report.title} — {report.district}</option>)}
          </select>
          <button onClick={() => void search()} disabled={!problemId || busy} className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm disabled:opacity-50"><Search className="w-4 h-4 inline mr-1" />{busy ? 'Searching...' : 'Find matches'}</button>
        </div>

        {problemId && reports.find((r) => r._id === problemId) && (
          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">Selected: <b>{reports.find((r) => r._id === problemId)?.title}</b></div>
        )}

        <div className="space-y-3">
          {matches.length === 0 && !busy && <div className="text-sm text-slate-500 border border-dashed rounded-2xl p-6 text-center">No historical matches above the configured similarity threshold.</div>}
          {matches.map((m) => (
            <div key={m.knowledgeRecordId} className="border rounded-2xl p-5 space-y-3">
              <div className="flex justify-between gap-3"><div><b>{m.title}</b><div className="text-xs text-slate-500 mt-1">{m.category} • {m.district} • {m.explanation}</div></div><span className="font-black text-emerald-700">{Math.round(m.similarity * 100)}%</span></div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm"><b>Previous verified solution:</b><p className="mt-1 text-slate-700">{m.solution?.summary || 'Verified solution details are available in the knowledge record.'}</p></div>
              <div className="flex flex-wrap gap-2"><button onClick={() => void review(m, 'APPROVED')} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"><CheckCircle2 className="w-3 h-3 inline mr-1" />Approve match</button><button onClick={() => void review(m, 'REJECTED')} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold"><XCircle className="w-3 h-3 inline mr-1" />Reject</button></div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4"><div className="flex items-center gap-2"><Database className="w-5 h-5" /><h2 className="text-xl font-black">Verified historical knowledge</h2></div><div className="grid md:grid-cols-2 gap-4">{knowledge.map((k) => <div key={k._id} className="bg-white border rounded-2xl p-5"><div className="flex justify-between"><span className="text-xs font-bold text-emerald-700">{k.category}</span><span className="text-[10px] font-bold text-slate-400">{k.verificationStatus}</span></div><h3 className="font-bold mt-2">{k.title}</h3><p className="text-xs text-slate-600 mt-2 line-clamp-3">{k.solutionText}</p><div className="text-[10px] text-slate-400 mt-3">Source: {k.sourceType}</div></div>)}</div></section>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3"><ShieldCheck className="w-5 h-5 text-blue-700" /><p className="text-xs text-blue-900"><b>Human approval remains required.</b> AI only retrieves and ranks previously verified records; it does not automatically apply a solution to a government problem.</p></div>
    </div>
  );
};
