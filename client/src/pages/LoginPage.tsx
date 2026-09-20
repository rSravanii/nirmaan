import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LogIn, KeyRound, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleQuickLogin = async (role: 'CITIZEN' | 'STUDENT' | 'PROFESSOR' | 'RESEARCHER' | 'COMPANY' | 'EVALUATOR' | 'ADMIN') => {
    await switchDemoRole(role);
    if (role === 'COMPANY') navigate('/company'); else if (role === 'RESEARCHER') navigate('/expert'); else if (role === 'PROFESSOR') navigate('/professor'); else if (role === 'STUDENT') navigate('/student'); else if (role === 'ADMIN') navigate('/admin'); else if (role === 'EVALUATOR') navigate('/evaluator'); else navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
          GU
        </div>
        <h1 className="text-2xl font-black text-slate-900">Sign in to GramUtthan</h1>
        <p className="text-xs text-slate-500">
          Government of Jharkhand • SIH Problem Statement SIH26043
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@demo.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors"
        >
          {submitting ? 'Authenticating...' : 'Sign In'}
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Create account
            </Link>
          </span>
        </div>
      </form>

      {/* Quick 1-Click Demo Logins for Jury */}
      <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            1-Click Demo Accounts (Jury Demo):
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Password: Demo@123</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleQuickLogin('CITIZEN')}
            className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 shadow-2xs text-left"
          >
            <span>Citizen</span>
            <span className="block text-[10px] text-slate-400 font-normal">citizen@demo.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('STUDENT')}
            className="p-2.5 rounded-xl bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 border border-slate-200 shadow-2xs text-left"
          >
            <span>Student Lead</span>
            <span className="block text-[10px] text-slate-400 font-normal">student@demo.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('PROFESSOR')}
            className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-800 border border-slate-200 shadow-2xs text-left"
          >
            <span>Professor</span>
            <span className="block text-[10px] text-slate-400 font-normal">professor@demo.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('EVALUATOR')}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 border border-slate-200 shadow-2xs text-left"
          >
            <span>Evaluator</span>
            <span className="block text-[10px] text-slate-400 font-normal">evaluator@demo.com</span>
          </button>
          <button type="button" onClick={() => handleQuickLogin('RESEARCHER')} className="p-2.5 rounded-xl bg-white hover:bg-cyan-50 text-slate-800 border border-slate-200 shadow-2xs text-left"><span>Researcher</span><span className="block text-[10px] text-slate-400 font-normal">researcher@demo.com</span></button>
          <button type="button" onClick={() => handleQuickLogin('COMPANY')} className="p-2.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 shadow-2xs text-left"><span>Company</span><span className="block text-[10px] text-slate-400 font-normal">company@demo.com</span></button>
        </div>
      </div>
    </div>
  );
};
