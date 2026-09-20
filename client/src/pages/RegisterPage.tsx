import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { UserPlus, Mail, Lock, User, Building2, MapPin } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        institution: role === 'STUDENT' || role === 'PROFESSOR' ? institution : undefined,
        department: role === 'STUDENT' || role === 'PROFESSOR' ? department : undefined,
        district
      })
    });

    setSubmitting(false);

    if (res.success && res.token) {
      localStorage.setItem('gramutthan_token', res.token);
      await refreshUser();
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900">Create GramUtthan Account</h1>
        <p className="text-xs text-slate-500">
          Join the social innovation network for rural Jharkhand
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Birsa Munda"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="citizen@jharkhand.in"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="STUDENT">Student</option>
              <option value="PROFESSOR">Professor</option>
              <option value="NGO">NGO Partner</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Ranchi"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
            />
          </div>
        </div>

        {(role === 'STUDENT' || role === 'PROFESSOR') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">University / College</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="BIT Mesra / IIT (ISM) Dhanbad"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Civil Engineering"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors"
        >
          {submitting ? 'Creating account...' : 'Complete Registration'}
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};
