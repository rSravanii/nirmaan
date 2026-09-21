import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, FileText } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { useSocket } from '../context/SocketContext.js';
import { ProblemReport } from '../types/index.js';
import { getTrackingStatus, getVerificationLabel, trackingToneClasses } from '../utils/reportTracking.js';

export const MyReportsPage: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const [reports, setReports] = useState<ProblemReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reportId = searchParams.get('reportId');

  const loadReports = async () => {
    setLoading(true); setError('');
    const res = await apiRequest('/problems/mine');
    if (res.success && res.reports) setReports(res.reports);
    else {
      setError(res.message || 'Unable to load your reports.');
      if (res.status === 401 || res.status === 403) logout();
    }
    setLoading(false);
  };
  useEffect(() => { if (!isLoading && user) void loadReports(); else if (!isLoading) setLoading(false); }, [isLoading, user?.id]);
  useEffect(() => {
    if (!socket) return;
    const refresh = () => { if (user) void loadReports(); };
    socket.on('notification', refresh);
    return () => { socket.off('notification', refresh); };
  }, [socket, user?.id]);

  if (reportId) return <Navigate to={`/problems/${reportId}`} replace />;
  if (!isLoading && !user) return <Navigate to="/login" replace />;
  if (loading) return <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-500">Loading your reports…</div>;
  if (error) return <div className="mx-auto max-w-2xl px-4 py-16 text-center"><p className="text-red-700">{error}</p><button onClick={loadReports} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Try again</button></div>;
  return <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black text-slate-900">My Reports</h1><p className="text-sm text-slate-600">Track updates on issues you submitted.</p></div><button onClick={loadReports} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700"><RefreshCw className="h-4 w-4" />Refresh</button></div>{reports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><FileText className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 font-bold">No reports yet</h2><Link to="/report" className="mt-3 inline-block text-sm font-bold text-emerald-700">Submit a report</Link></div> : <div className="grid gap-4 sm:grid-cols-2">{reports.map(report => { const stage = getTrackingStatus(report.status); const verification = getVerificationLabel(report); return <article key={report._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="break-all font-mono text-xs text-slate-500">Report ID: {report._id}</p><h2 className="mt-2 text-lg font-bold text-slate-900">{report.title}</h2><p className="mt-1 text-sm text-slate-600">{report.category} · {report.district}</p><p className="mt-2 text-xs text-slate-500">Submitted {new Date(report.createdAt).toLocaleDateString()}</p><div className="mt-4 flex flex-wrap gap-2"><span className={`rounded-full border px-2 py-1 text-xs font-bold ${trackingToneClasses[stage.tone]}`}>{stage.label}</span><span className={`rounded-full border px-2 py-1 text-xs font-bold ${trackingToneClasses[verification.tone]}`}>{verification.label}</span></div><Link to={`/problems/${report._id}`} className="mt-5 inline-block text-sm font-bold text-emerald-700">View Details →</Link></article>; })}</div>}</div>;
};
