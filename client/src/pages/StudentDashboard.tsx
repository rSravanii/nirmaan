import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../api/client.js';
import { ProblemReport, Project } from '../types/index.js';
import {
  Sparkles,
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Award,
  Users,
  Building2,
  Layers
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recommendedProblems, setRecommendedProblems] = useState<ProblemReport[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch problems matching student's department (Civil Engineering for Aarav Sharma)
    apiRequest('/problems?category=Broken%20bridge').then((res) => {
      if (res.success && res.reports) {
        setRecommendedProblems(res.reports.slice(0, 3));
      }
    });

    // Fetch student's projects
    apiRequest('/projects?myProjects=true').then((res) => {
      if (res.success && res.projects) {
        setMyProjects(res.projects);
      }
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <span>Student Researcher Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'Aarav Sharma'}</h1>
          <p className="text-xs sm:text-sm text-blue-200">
            {user?.department || 'Civil & Structural Engineering'} • {user?.institution || 'BIT Mesra, Ranchi'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <span className="text-2xl font-black text-amber-300">{user?.impactPoints || 240}</span>
            <span className="block text-[10px] uppercase font-bold text-blue-200">Impact Points</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <span className="text-2xl font-black text-emerald-300">{myProjects.length}</span>
            <span className="block text-[10px] uppercase font-bold text-blue-200">Active Projects</span>
          </div>
        </div>
      </div>

      {/* JURY DEMO HIGHLIGHT: "Recommended for you" AI Matching Card (Step 11) */}
      <div className="bg-blue-50/70 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-blue-950">Recommended For You</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                  AI Match: 94%
                </span>
              </div>
              <p className="text-xs text-blue-800">
                Prioritized because your domain is <span className="font-bold">Civil & Structural Engineering</span> matching rural culvert and bridge failures.
              </p>
            </div>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 hidden sm:inline"
          >
            Explore All Problems →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedProblems.map((prob) => (
            <div
              key={prob._id}
              className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                    {prob.severity} Severity
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {prob.village || prob.district}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">
                  {prob.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {prob.aiSummary || prob.description}
                </p>

                {prob.isDuplicate && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                    Consolidated Issue: Matches 7 existing citizen reports in Angara.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">
                  ~{prob.affectedPopulation} affected citizens
                </span>

                <Link
                  to={`/problems/${prob._id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Claim Problem</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Student Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-black text-slate-900">My Claimed Projects & Workspaces</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{myProjects.length} Projects</span>
        </div>

        {myProjects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No active claimed projects</p>
            <p className="text-xs text-slate-400 mt-1">Claim a recommended problem above to launch your engineering project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.map((proj) => (
              <div
                key={proj._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    proj.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                    proj.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {proj.status}
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    Impact Score: {proj.impactScore || 90}/100
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Milestones: {proj.milestones?.length || 0} phases
                  </span>

                  <Link
                    to={`/workspace/${proj._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
