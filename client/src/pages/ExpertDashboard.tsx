import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FolderKanban, GraduationCap, Search } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';

export const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{apiRequest('/experts/dashboard').then(r=>{if(r.success)setData(r);setLoading(false);});},[]);
  if(loading) return <div className="py-20 text-center text-slate-500">Loading expert dashboard...</div>;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="bg-slate-900 text-white rounded-3xl p-7 flex flex-col md:flex-row justify-between gap-5">
      <div><div className="text-xs uppercase tracking-wider font-bold text-blue-300">Expert & Research Network</div><h1 className="text-3xl font-black mt-2">{user?.name}</h1><p className="text-sm text-slate-300 mt-1">{user?.department} • {user?.institution}</p></div>
      <div className="flex gap-6"><div><b className="text-2xl">{data?.stats?.recommendedProblems || 0}</b><span className="block text-xs text-slate-400">Recommended problems</span></div><div><b className="text-2xl">{data?.stats?.projects || 0}</b><span className="block text-xs text-slate-400">Projects</span></div></div>
    </div>
    <div className="grid lg:grid-cols-3 gap-4">
      {(data?.profile?.expertiseAreas || data?.profile?.interestDomains || []).map((x:string)=><span key={x} className="bg-white border rounded-xl px-4 py-3 text-sm font-bold text-slate-700">{x}</span>)}
    </div>
    <section className="space-y-4"><div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600"/><h2 className="text-xl font-black">AI-matched opportunities</h2></div><div className="grid md:grid-cols-2 gap-4">{(data?.recommendedProblems||[]).map((p:any)=><div key={p._id} className="bg-white border rounded-2xl p-5 space-y-3"><div className="flex justify-between"><span className="text-xs font-bold text-blue-700">{p.category}</span><span className="text-xs text-slate-400">{p.district}</span></div><h3 className="font-bold">{p.title}</h3><p className="text-sm text-slate-600 line-clamp-3">{p.aiSummary||p.description}</p><Link className="text-sm font-bold text-blue-700" to={`/problems/${p._id}`}>View problem →</Link></div>)}</div></section>
    <section className="space-y-4"><div className="flex items-center gap-2"><FolderKanban className="w-5 h-5"/><h2 className="text-xl font-black">My collaboration projects</h2></div><div className="grid md:grid-cols-2 gap-4">{(data?.projects||[]).map((p:any)=><Link key={p._id} to={`/workspace/${p._id}`} className="bg-white border rounded-2xl p-5"><div className="text-xs font-bold text-slate-500">{p.status}</div><h3 className="font-bold mt-1">{p.title}</h3><p className="text-xs text-slate-500 mt-2">{p.problemReportId?.title}</p></Link>)}</div></section>
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3"><Search className="w-5 h-5 text-blue-700"/><div><b className="text-blue-950">Decision support, not automatic assignment</b><p className="text-xs text-blue-800 mt-1">AI recommendations are based on stored profile/problem data. Experts decide which problems or projects to pursue.</p></div></div>
  </div>;
};
