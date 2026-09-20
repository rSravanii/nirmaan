import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { User, GraduationCap, BookOpen, ShieldCheck, Settings, CheckCircle2, Building2 } from 'lucide-react';

const roles: Array<{ role: UserRole; label: string; icon: any; color: string; desc: string }> = [
  { role: 'CITIZEN', label: 'Citizen', icon: User, color: 'bg-emerald-500 text-white', desc: 'Birsa Munda (Report Problems)' },
  { role: 'STUDENT', label: 'Student', icon: GraduationCap, color: 'bg-blue-600 text-white', desc: 'Aarav Sharma (Claim & Work)' },
  { role: 'PROFESSOR', label: 'Professor', icon: BookOpen, color: 'bg-purple-600 text-white', desc: 'Dr. Mahto (Domain Guidance)' },
  { role: 'RESEARCHER', label: 'Researcher', icon: BookOpen, color: 'bg-cyan-600 text-white', desc: 'Research Network' },
  { role: 'COMPANY', label: 'Company', icon: Building2, color: 'bg-indigo-600 text-white', desc: 'Industry Partner' },
  { role: 'EVALUATOR', label: 'Evaluator', icon: ShieldCheck, color: 'bg-amber-600 text-white', desc: 'Pooja Soren (Verify Impact)' },
  { role: 'ADMIN', label: 'Admin', icon: Settings, color: 'bg-slate-800 text-white', desc: 'State Gov (Analytics & Health)' },
];

export const DemoSwitcher: React.FC = () => {
  const demoEnabled = import.meta.env.VITE_DEMO_MODE === 'true';
  const { user, switchDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!demoEnabled) return null;

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-3 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-300 font-semibold tracking-wide uppercase text-[10px]">
          Hackathon Jury Demo Mode:
        </span>
        <span className="hidden sm:inline text-slate-400">Try Live Role As:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {roles.map(({ role, label, icon: Icon, color }) => {
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              onClick={async () => { await switchDemoRole(role as any); if (role === 'COMPANY') navigate('/company'); else if (role === 'RESEARCHER') navigate('/expert'); else if (role === 'PROFESSOR') navigate('/professor'); else if (role === 'STUDENT') navigate('/student'); else if (role === 'ADMIN') navigate('/admin'); else if (role === 'EVALUATOR') navigate('/evaluator'); }}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all text-xs ${
                isActive
                  ? `${color} shadow-sm ring-1 ring-white/30 font-bold scale-105`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={`Switch to ${label} demo account`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {isActive && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
