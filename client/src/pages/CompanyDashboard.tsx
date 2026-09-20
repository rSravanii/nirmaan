import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Handshake, Coins, Wrench } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';

export const CompanyDashboard: React.FC = () => {
  const {user}=useAuth(); const [data,setData]=useState<any>(null); const [loading,setLoading]=useState(true); const [busy,setBusy]=useState<string|null>(null);
  const load=()=>apiRequest('/companies/dashboard').then(r=>{if(r.success)setData(r);setLoading(false);});
  useEffect(()=>{load();},[]);
  const participate=async(projectId:string,type:'MENTORSHIP'|'FUNDING'|'TECHNICAL_RESOURCE')=>{setBusy(projectId+type); await apiRequest('/companies/participations',{method:'POST',body:JSON.stringify({projectId,participationType:type})}); await load();setBusy(null);};
  if(loading)return <div className="py-20 text-center text-slate-500">Loading company dashboard...</div>;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white rounded-3xl p-7"><div className="text-xs uppercase tracking-wider font-bold text-indigo-300">Industry Collaboration Hub</div><h1 className="text-3xl font-black mt-2">{data?.profile?.companyName||user?.name}</h1><p className="text-sm text-slate-300 mt-1">{data?.profile?.industry} • {data?.profile?.verified?'Verified partner':'Verification pending'}</p></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[['Projects',data?.stats?.projects],['Problems',data?.stats?.problems],['Offers',data?.stats?.offers],['Participations',data?.stats?.participations]].map(([a,b])=><div key={a as string} className="bg-white border rounded-2xl p-5"><div className="text-2xl font-black">{b||0}</div><div className="text-xs text-slate-500">{a}</div></div>)}</div>
    <div className="flex flex-wrap gap-2">{(data?.profile?.capabilities||[]).map((x:string)=><span key={x} className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">{x}</span>)}</div>
    <section><h2 className="text-xl font-black mb-4 flex items-center gap-2"><Building2 className="w-5 h-5"/>Discover projects</h2><div className="grid md:grid-cols-2 gap-4">{(data?.projects||[]).map((p:any)=><div key={p._id} className="bg-white border rounded-2xl p-5 space-y-3"><span className="text-xs font-bold text-indigo-700">{p.status}</span><h3 className="font-bold">{p.title}</h3><p className="text-xs text-slate-500">{p.problemReportId?.title} • {p.problemReportId?.district}</p><div className="flex gap-2 flex-wrap"><button disabled={!!busy} onClick={()=>participate(p._id,'MENTORSHIP')} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"><Handshake className="w-3 h-3 inline mr-1"/>Mentor</button><button disabled={!!busy} onClick={()=>participate(p._id,'FUNDING')} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"><Coins className="w-3 h-3 inline mr-1"/>Fund</button><button disabled={!!busy} onClick={()=>participate(p._id,'TECHNICAL_RESOURCE')} className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"><Wrench className="w-3 h-3 inline mr-1"/>Resources</button><Link to={`/workspace/${p._id}`} className="px-3 py-2 rounded-lg bg-slate-100 text-xs font-bold">Open</Link></div></div>)}</div></section>
  </div>;
};
