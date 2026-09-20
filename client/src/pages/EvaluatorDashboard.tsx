import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../api/client.js';
import { ProblemReport, Project } from '../types/index.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Users,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const EvaluatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingReports, setPendingReports] = useState<ProblemReport[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);

    apiRequest('/problems?verificationStatus=PENDING').then((res) => {
      if (res.success && res.reports) {
        setPendingReports(res.reports);
      }
    });

    apiRequest('/projects').then((res) => {
      if (res.success && res.projects) {
        setActiveProjects(res.projects);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyReport = async (reportId: string, status: 'VERIFIED' | 'REJECTED') => {
    const res = await apiRequest(`/problems/${reportId}/verify`, {
      method: 'POST',
      body: JSON.stringify({
        status,
        remarks: status === 'VERIFIED' ? 'Field verification confirmed by authority officer.' : 'Dismissed after review.'
      })
    });

    if (res.success) {
      alert(`Report marked as ${status}!`);
      fetchData();
    }
  };

  // Step 15 in demo: Evaluator verifies milestone
  const handleVerifyMilestone = async (projectId: string, milestoneId: string) => {
    const res = await apiRequest(`/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
        reviewerNotes: 'Verified concrete lab specimen certificates from BIT Mesra. 32 MPa compression standard passed.'
      })
    });

    if (res.success) {
      alert('Milestone APPROVED! Student awarded +30 Impact Points.');
      fetchData();
    }
  };

  // Step 16 in demo: Mark project as VERIFIED!
  const handleVerifyProject = async (projectId: string) => {
    const res = await apiRequest(`/projects/${projectId}/verify`, {
      method: 'POST',
      body: JSON.stringify({
        remarks: 'Physical culvert implementation and site assessment verified on-site in Angara. Problem RESOLVED.',
        impactScore: 95
      })
    });

    if (res.success) {
      alert('Project marked as VERIFIED! Lead student awarded 100 Impact Points and issue marked RESOLVED!');
      fetchData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>State Authority & District Evaluator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'Pooja Soren (District Evaluator)'}</h1>
          <p className="text-xs sm:text-sm text-amber-200">
            {user?.department || 'Rural Development & Infrastructure Wing'} • Govt of Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs text-amber-200 block font-medium">Evaluation Authority</span>
            <span className="text-sm font-black text-white">Ranchi District Jurisdiction</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Student Project Milestones Awaiting Review (Step 15 & 16) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Project Milestone & Final Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                Verify student engineering deliverables and certify impact.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeProjects.map((proj) => {
            const pendingMilestones = proj.milestones?.filter((m: any) => m.status === 'SUBMITTED') || [];

            return (
              <div
                key={proj._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      proj.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {proj.status}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Team Lead: <span className="font-bold text-slate-700">{proj.leadStudentId?.name || 'Aarav Sharma'}</span> ({proj.institution})
                    </p>
                  </div>

                  {/* Step 16 Action: Mark Project as VERIFIED */}
                  {proj.status !== 'VERIFIED' && (
                    <button
                      onClick={() => handleVerifyProject(proj._id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Project VERIFIED (+100 Pts)</span>
                    </button>
                  )}
                </div>

                {/* Milestones in this project */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Milestones Review:
                  </span>
                  {proj.milestones?.map((m: any, idx: number) => (
                    <div
                      key={m._id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{m.title}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            m.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-200'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{m.description}</p>
                      </div>

                      {/* Step 15 Action: Evaluator verifies milestone */}
                      {m.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleVerifyMilestone(proj._id, m._id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                        >
                          Verify Milestone (+30 Pts)
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Citizen Reports Awaiting Initial Verification */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-black text-slate-900">
          Citizen Problem Reports Queue ({pendingReports.length} Pending)
        </h2>

        {pendingReports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            All submitted reports have been verified. Great job!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                      {report.severity}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {report.district}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{report.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleVerifyReport(report._id, 'VERIFIED')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Verify Report (+25 Pts)
                  </button>
                  <button
                    onClick={() => handleVerifyReport(report._id, 'REJECTED')}
                    className="py-2 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
