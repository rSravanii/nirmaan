import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';
import {
  Award,
  Trophy,
  Building2,
  GraduationCap,
  Users,
  Medal,
  CheckCircle2
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [topUniversities, setTopUniversities] = useState<any[]>([]);
  const [topCitizens, setTopCitizens] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'universities' | 'students' | 'citizens'>('universities');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/rewards/leaderboard').then((res) => {
      if (res.success) {
        setTopStudents(res.topStudents || []);
        setTopUniversities(res.topUniversities || []);
        setTopCitizens(res.topCitizens || []);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Jharkhand Civic Impact & Honor Roll</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Social Innovation Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Recognizing universities, student engineering innovators, and rural community champions driving verified ground solutions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('universities')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'universities'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Top Universities</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Top Student Problem Solvers</span>
          </button>
          <button
            onClick={() => setActiveTab('citizens')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'citizens'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>Community Contributors</span>
          </button>
        </div>
      </div>

      {/* Table Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === 'universities' && (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="col-span-1">Rank</span>
              <span className="col-span-6">Institution</span>
              <span className="col-span-2 text-center">Resolved Issues</span>
              <span className="col-span-3 text-right">Impact Score</span>
            </div>
            {topUniversities.map((uni, idx) => (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors">
                <div className="col-span-1">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' :
                    idx === 1 ? 'bg-slate-200 text-slate-800' :
                    idx === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'
                  }`}>
                    #{idx + 1}
                  </span>
                </div>
                <div className="col-span-6 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{uni.entityName}</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {uni.badge}
                  </span>
                </div>
                <div className="col-span-2 text-center text-xs font-bold text-slate-700">
                  {uni.resolvedProblemsCount} Verified
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-base font-black text-emerald-600">{uni.points}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Points</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="col-span-1">Rank</span>
              <span className="col-span-6">Student Innovator</span>
              <span className="col-span-2 text-center">Department</span>
              <span className="col-span-3 text-right">Impact Points</span>
            </div>
            {topStudents.map((st, idx) => (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors">
                <div className="col-span-1">
                  <span className="font-black text-xs text-slate-700">#{idx + 1}</span>
                </div>
                <div className="col-span-6 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{st.name}</h4>
                  <span className="text-xs text-slate-500">{st.institution || 'BIT Mesra'}</span>
                </div>
                <div className="col-span-2 text-center text-xs font-medium text-slate-600">
                  {st.department || 'Civil Engg'}
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-base font-black text-blue-600">{st.impactPoints}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Points</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'citizens' && (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="col-span-1">Rank</span>
              <span className="col-span-7">Citizen Reporter</span>
              <span className="col-span-4 text-right">Impact Points</span>
            </div>
            {topCitizens.map((cit, idx) => (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors">
                <div className="col-span-1">
                  <span className="font-black text-xs text-slate-700">#{idx + 1}</span>
                </div>
                <div className="col-span-7 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{cit.name}</h4>
                  <span className="text-xs text-slate-500">{cit.district || 'Ranchi'}</span>
                </div>
                <div className="col-span-4 text-right">
                  <span className="text-base font-black text-emerald-600">{cit.impactPoints}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Points</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
