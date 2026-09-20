import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../api/client.js';
import { ProblemReport, Project } from '../types/index.js';
import { BookOpen, Sparkles, FolderGit2, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recommendedProblems, setRecommendedProblems] = useState<ProblemReport[]>([]);
  const [mentoredProjects, setMentoredProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiRequest('/problems?category=Broken%20bridge').then(res => {
      if (res.success && res.reports) {
        setRecommendedProblems(res.reports.slice(0, 3));
      }
    });

    apiRequest('/projects').then(res => {
      if (res.success && res.projects) {
        setMentoredProjects(res.projects.slice(0, 3));
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Faculty & Research Mentor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'Dr. Rameshwar Mahto'}</h1>
          <p className="text-xs sm:text-sm text-purple-200">
            {user?.department || 'Civil & Structural Engineering'} • {user?.institution || 'BIT Mesra, Ranchi'}
          </p>
        </div>

        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-center">
          <span className="text-2xl font-black text-amber-300">12</span>
          <span className="block text-[10px] uppercase font-bold text-purple-200">Mentored Projects</span>
        </div>
      </div>

      {/* Expertise profile badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-800">Verified Faculty Expertise Areas</h3>
        <div className="flex flex-wrap gap-2">
          {['Bridge Engineering', 'Structural Safety', 'Sustainable Materials', 'Disaster Resilience', 'Chota Nagpur Plateau Hydrology'].map((exp, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              {exp}
            </span>
          ))}
        </div>
      </div>

      {/* Problems matching expertise */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900">Recommended Rural Problems for Student Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedProblems.map(prob => (
            <div key={prob._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                {prob.category}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{prob.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2">{prob.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{prob.district}</span>
                <Link to={`/problems/${prob._id}`} className="text-xs font-bold text-purple-700 hover:text-purple-900">
                  Inspect Problem Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
