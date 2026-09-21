import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProblemReport, ResearcherMatch } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useSocket } from '../context/SocketContext.js';
import { apiRequest, resolveAssetUrl } from '../api/client.js';
import { ReportStatusTimeline } from '../components/ReportStatusTimeline.js';
import { getTrackingStatus, getVerificationLabel, trackingToneClasses } from '../utils/reportTracking.js';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Share2,
  FolderGit2
} from 'lucide-react';

export const ProblemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<ProblemReport | null>(null);
  const [matches, setMatches] = useState<ResearcherMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [evaluatorNotes, setEvaluatorNotes] = useState('');
  const [error, setError] = useState('');

  const loadProblem = async () => {
    if (!id) return;
    setLoading(true); setError('');
    const res = await apiRequest(`/problems/${id}`);
    if (res.success && res.report) {
      // The API envelope is { success, report }; history belongs to that report.
      // Normalise only absent legacy history to an empty list; never synthesize it.
      setProblem({ ...res.report, statusHistory: Array.isArray(res.report.statusHistory) ? res.report.statusHistory : [] });
      setProjectTitle(`Engineering Resolution: ${res.report.title}`);
      setProjectDesc(`Student team technical project addressing "${res.report.title}" in ${res.report.district}.`);
    } else setError(res.message || 'Unable to load this report.');
    setLoading(false);
  };

  useEffect(() => {
    if (!id) return;
    void loadProblem();

    apiRequest(`/problems/${id}/matches`).then((res) => {
      if (res.success && res.matches) {
        setMatches(res.matches);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    const onNotification = (notification: { metadata?: { reportId?: string } }) => {
      if (notification.metadata?.reportId === id) void loadProblem();
    };
    socket.on('notification', onNotification);
    return () => { socket.off('notification', onNotification); };
  }, [socket, id]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in with a student account to claim this problem.');
      return;
    }

    setIsClaiming(true);
    const res = await apiRequest(`/problems/${id}/claim`, {
      method: 'POST',
      body: JSON.stringify({
        projectTitle,
        projectDescription: projectDesc,
        institution: user.institution || 'BIT Mesra',
        department: user.department || 'Civil Engineering'
      })
    });

    setIsClaiming(false);
    if (res.success && res.project) {
      setClaimModalOpen(false);
      navigate(`/workspace/${res.project._id}`);
    } else {
      alert(res.message || 'Failed to claim problem');
    }
  };

  const handleVerify = async (status: 'VERIFIED' | 'REJECTED') => {
    const res = await apiRequest(`/problems/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({
        status,
        remarks: evaluatorNotes || (status === 'VERIFIED' ? 'Field verification confirmed by authority.' : 'Rejected.')
      })
    });

    if (res.success) {
      alert(`Report ${status.toLowerCase()} successfully!`);
      setProblem(res.report);
    } else {
      alert(res.message || 'Verification failed');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-medium">Loading problem details...</div>;
  }

  if (!problem) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-slate-800">{error || 'Problem not found'}</h2>
        <Link to="/explore" className="text-emerald-600 text-sm font-semibold underline mt-2 block">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Breadcrumbs & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/explore" className="hover:text-emerald-700">Explore</Link>
          <span>/</span>
          <span>{problem.district}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold">{problem.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${trackingToneClasses[getTrackingStatus(problem.status).tone]}`}>Current: {getTrackingStatus(problem.status).label}</span>
          <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${trackingToneClasses[getVerificationLabel(problem).tone]}`}>Verification: {getVerificationLabel(problem).label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem details & Photos (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {problem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {problem.locationName || `${problem.village}, ${problem.district}`}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                ~{problem.affectedPopulation} affected citizens
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                {new Date(problem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Photo Evidence Gallery */}
          {problem.photos && problem.photos.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-80 bg-slate-950 flex items-center justify-center">
              <img
                src={resolveAssetUrl(problem.photos[0])}
                alt={problem.title}
                className="w-full h-full object-contain max-h-80"
              />
            </div>
          )}

          {/* Description & AI Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Citizen Ground Report:
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed font-normal">
                {problem.description}
              </p>
            </div>

            {problem.aiSummary && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Standardized English Synthesis:</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed italic">
                  "{problem.aiSummary}"
                </p>
              </div>
            )}

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                {problem.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-black text-slate-900">Status Timeline</h2>
            <p className="mt-1 text-sm text-slate-600">Only recorded report updates are shown.</p>
            <div className="mt-5"><ReportStatusTimeline history={problem.statusHistory} currentStatus={problem.status} /></div>
          </section>

          {/* Evaluator Verification Action Panel */}
          {user?.role === 'EVALUATOR' && problem.verificationStatus === 'PENDING' && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>Authority Verification Action</span>
              </div>
              <p className="text-xs text-amber-800">
                As District Evaluator, verify ground reality, confirm severity, and approve citizen impact points.
              </p>
              <textarea
                rows={2}
                placeholder="Add physical verification notes / remarks..."
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify('VERIFIED')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Verify & Approve Report (+25 Pts)
                </button>
                <button
                  onClick={() => handleVerify('REJECTED')}
                  className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs"
                >
                  Reject Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Smart Matching Engine & Claim CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {typeof problem.claimedByProjectId === 'object' && problem.claimedByProjectId && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-black text-slate-900">Project Information</h2>
              <p className="mt-2 text-sm font-bold">{problem.claimedByProjectId.title}</p>
              <p className="mt-1 text-sm text-slate-600">{problem.claimedByProjectId.institution} · {problem.claimedByProjectId.status}</p>
              {problem.claimedByProjectId.solutionSummary && <p className="mt-3 text-sm text-slate-700">{problem.claimedByProjectId.solutionSummary}</p>}
              {problem.status === 'RESOLVED' && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{problem.verificationNotes || problem.claimedByProjectId.evaluatorRemarks || 'Resolution verified.'}</p>}
            </section>
          )}
          {/* Action Box: Claim problem */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                Actionable Civic Challenge
              </span>
              <h3 className="text-xl font-black mt-1">Ready to Solve This Problem?</h3>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                University students and research teams can claim this issue, collaborate in a dedicated project workspace, and submit engineering milestones.
              </p>
            </div>

            {problem.status === 'CLAIMED' || problem.status === 'IN_PROGRESS' ? (
              <div className="p-3 bg-white/10 rounded-xl text-xs font-semibold text-center border border-white/20">
                Problem is already Claimed and In Progress by an Engineering Team.
              </div>
            ) : (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Claim Problem & Form Team</span>
              </button>
            )}
          </div>

          {/* Smart Matching Engine Rankings (Section 10) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Smart University Matching</h4>
                  <p className="text-[10px] text-slate-500">
                    Transparent weighted prototype recommendation
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Formula v1.0
              </span>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono">
              <span className="font-bold text-slate-700 block mb-0.5">Scoring Model:</span>
              0.55*sem + 0.20*dom + 0.10*kw + 0.10*dept + 0.05*exp
            </div>

            <div className="space-y-3">
              {matches.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Calculating matches...</p>
              ) : (
                matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-white space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          match.type === 'PROFESSOR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {match.type}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900 mt-1">
                          {match.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {match.department} • {match.institution}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-blue-600">
                          {match.matchScore}%
                        </span>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">
                          Match
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">
                      "{match.explanation}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                University Engineering Claim
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Claim Problem: {problem.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Create a student project team to engineer and verify a real solution.
              </p>
            </div>

            <form onSubmit={handleClaim} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Technical Solution Proposal *
                </label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block">Lead Institution:</span>
                  <span className="font-bold text-slate-800">{user?.institution || 'BIT Mesra'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block">Department:</span>
                  <span className="font-bold text-slate-800">{user?.department || 'Civil Engineering'}</span>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isClaiming}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isClaiming ? 'Initializing Project...' : 'Confirm Claim & Launch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
