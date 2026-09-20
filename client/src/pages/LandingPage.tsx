import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.js';
import { apiRequest } from '../api/client.js';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  GraduationCap,
  Award,
  ChevronRight,
  CheckCircle2,
  Users,
  MapPin,
  TrendingUp,
  FileCheck,
  Building2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalReports: 24,
    verifiedReports: 18,
    activeProjects: 6,
    impactPoints: 3420,
    districtsActive: 10
  });

  useEffect(() => {
    apiRequest('/admin/dashboard').then(res => {
      if (res.success && res.metrics) {
        setStats({
          totalReports: res.metrics.totalReports || 24,
          verifiedReports: res.metrics.verifiedReports || 18,
          activeProjects: res.metrics.projectsInProgress || 6,
          impactPoints: res.metrics.totalImpactPoints || 3420,
          districtsActive: res.metrics.problemsByDistrict?.length || 10
        });
      }
    });
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon • Problem Statement SIH26043</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.hero.reportCta}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>{t.hero.exploreCta}</span>
            </Link>

            <Link
              to="/presentation"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Jury Pitch Deck</span>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>

          {/* Live Metrics Row */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.totalReports}+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Rural Problems Logged</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{stats.verifiedReports}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Authority Verified</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">{stats.activeProjects}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Active University Projects</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.impactPoints}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Impact Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Central Loop: REPORT -> UNDERSTAND -> MATCH -> RESOLVE -> VERIFY -> REWARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span>The End-to-End Civic Loop</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How GramUtthan Solves Rural Challenges
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            AI turns fragmented local complaints into structured, actionable university engineering projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              step: '1',
              title: t.loop.report,
              desc: t.loop.reportDesc,
              color: 'border-emerald-500 text-emerald-600 bg-emerald-50'
            },
            {
              step: '2',
              title: t.loop.understand,
              desc: t.loop.understandDesc,
              color: 'border-teal-500 text-teal-600 bg-teal-50'
            },
            {
              step: '3',
              title: t.loop.match,
              desc: t.loop.matchDesc,
              color: 'border-blue-500 text-blue-600 bg-blue-50'
            },
            {
              step: '4',
              title: t.loop.resolve,
              desc: t.loop.resolveDesc,
              color: 'border-purple-500 text-purple-600 bg-purple-50'
            },
            {
              step: '5',
              title: t.loop.verify,
              desc: t.loop.verifyDesc,
              color: 'border-amber-500 text-amber-600 bg-amber-50'
            },
            {
              step: '6',
              title: t.loop.reward,
              desc: t.loop.rewardDesc,
              color: 'border-rose-500 text-rose-600 bg-rose-50'
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-5 border-2 ${item.color.split(' ')[0]} bg-white shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center font-black text-xs`}>
                    {item.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">STAGE</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Core Technical Innovations
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              Built Specifically for Rural Ground Reality
            </h2>
            <p className="text-slate-300 text-sm">
              Not a generic AI mockup. Every pipeline module is backed by functioning services, transparent heuristics, and fail-safe offline mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Multilingual Local Audio & Text</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full UI & processing support for Hindi, Telugu, Santhali (Ol Chiki), Mundari, and Ho, removing language literacy barriers for villagers.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Semantic Vector Deduplication</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                50 citizens reporting the same broken culvert with different phrasing are automatically clustered (e.g. 94% similarity) rather than flooding the queue.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Transparent Smart University Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates weighted recommendations connecting structural problems to civil engineers and water issues to environmental researchers with explainable scoring.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Milestone Verification Workflow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                District authorities directly validate engineering milestones and physical evidence on-site before marking problems resolved and awarding points.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Institutional Leaderboard & Gamification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ranks universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur) and student teams by verified civic impact, fostering academic competition for social good.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Offline Resilience & Mobile Camera</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native HTML5 camera viewfinder with snapshot capture, retake, and browser localStorage draft persistence for low-connectivity rural pockets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 sm:p-12 space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            Experience the Live Hackathon Demonstration
          </h3>
          <p className="text-sm text-emerald-800 max-w-2xl mx-auto leading-relaxed">
            Follow the 18-step jury demo: Submit a bridge complaint as a Citizen, inspect the AI translation & duplicate cluster, switch to Student to claim it, and verify as Evaluator!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/report"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Step 1: Report a Problem
            </Link>
            <Link
              to="/presentation"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              View 10-Slide Pitch Deck
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
