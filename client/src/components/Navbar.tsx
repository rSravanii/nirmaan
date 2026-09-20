import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { SupportedLanguage } from '../types/index.js';
import {
  Menu,
  X,
  Globe,
  Award,
  PlusCircle,
  MapPin,
  FolderGit2,
  CheckSquare,
  BarChart3,
  Presentation,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                GU
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
                    Nirmaan
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    SIH26043
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline leading-none">
                  Govt of Jharkhand • Social Innovation Network
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/explore')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{t.nav.exploreProblems}</span>
              </div>
            </Link>

            {/* Role-adaptive actions */}
            {(!user || user.role === 'CITIZEN' || user.role === 'NGO') && (
              <Link
                to="/report"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/report')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t.nav.reportProblem}</span>
                </div>
              </Link>
            )}

            {user?.role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/student') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                    <span>Projects & Matching</span>
                  </div>
                </Link>
              </>
            )}

            {user?.role === 'PROFESSOR' && (
              <Link
                to="/professor"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/professor') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Research Dashboard</span>
              </Link>
            )}

            {(user?.role === 'EVALUATOR' || user?.role === 'ADMIN') && (
              <Link
                to="/evaluator"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/evaluator') ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>{t.nav.evaluator}</span>
                </div>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/admin') ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-slate-700" />
                  <span>{t.nav.admin}</span>
                </div>
              </Link>
            )}

            <Link
              to="/leaderboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/leaderboard') ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{t.nav.leaderboard}</span>
              </div>
            </Link>

            <Link
              to="/presentation"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/presentation') ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Presentation className="w-4 h-4 text-indigo-600" />
                <span>{t.nav.presentation}</span>
              </div>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Multilingual Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{availableLanguages.find(l => l.code === language)?.native || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                    Select Language / भाषा चुनें
                  </div>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                        language === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Impact Points pill */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.impactPoints || 0} pts</span>
              </div>
            )}

            {/* User status & Logout */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
              >
                {t.nav.login}
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.exploreProblems}
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.reportProblem}
          </Link>
          <Link
            to="/student"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Student Projects & Matching
          </Link>
          <Link
            to="/evaluator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.evaluator}
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.admin}
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.leaderboard}
          </Link>
          <Link
            to="/presentation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-bold text-indigo-600 bg-indigo-50"
          >
            {t.nav.presentation} (10-Slide Deck)
          </Link>
        </div>
      )}
    </nav>
  );
};
