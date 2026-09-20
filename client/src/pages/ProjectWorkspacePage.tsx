import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, ProjectMilestone } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../api/client.js';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Upload,
  MessageSquare,
  Users,
  Send,
  FileText,
  ShieldCheck,
  Award,
  AlertCircle,
  Plus
} from 'lucide-react';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('Structural assessment completed');
  const [milestoneDesc, setMilestoneDesc] = useState('Completed on-site civil load inspection and fly-ash concrete compressive strength testing.');
  const [evidenceNotes, setEvidenceNotes] = useState('Laboratory test certificates from BIT Mesra attached.');
  const [isSubmittingMilestone, setIsSubmittingMilestone] = useState(false);

  const fetchProjectData = () => {
    if (!id) return;
    apiRequest(`/projects/${id}`).then((res) => {
      if (res.success && res.project) {
        setProject(res.project);
      }
    });

    apiRequest(`/projects/${id}/activity`).then((res) => {
      if (res.success && res.activities) {
        setActivities(res.activities);
      }
    });
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await apiRequest(`/projects/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment: commentText.trim() })
    });

    if (res.success) {
      setCommentText('');
      fetchProjectData();
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMilestone(true);

    const res = await apiRequest(`/projects/${id}/milestones`, {
      method: 'POST',
      body: JSON.stringify({
        title: milestoneTitle,
        description: milestoneDesc,
        evidenceNotes: evidenceNotes,
      })
    });

    setIsSubmittingMilestone(false);
    if (res.success) {
      setMilestoneModalOpen(false);
      fetchProjectData();
      alert('Milestone uploaded and submitted to Evaluator for review!');
    } else {
      alert(res.message || 'Failed to submit milestone');
    }
  };

  const handleSubmitFinalSolution = async () => {
    const res = await apiRequest(`/projects/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        solutionSummary: 'Final modular culvert structural design and implementation verified by academic guide.',
        repositoryUrl: 'https://github.com/jharkhand-innovators/gram-bridge-resilience'
      })
    });

    if (res.success) {
      alert('Project solution submitted for final State Authority verification!');
      fetchProjectData();
    }
  };

  if (!project) {
    return <div className="text-center py-20 text-slate-500 font-medium">Loading project workspace...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              project.status === 'VERIFIED' ? 'bg-emerald-500 text-white' :
              project.status === 'UNDER_REVIEW' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              {project.status}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {project.institution} • {project.department}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.status !== 'VERIFIED' && (
              <button
                onClick={handleSubmitFinalSolution}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Submit Project For Final Verification
              </button>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{project.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Team Members Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Engineering Team:
          </span>
          <span className="bg-slate-800 px-3 py-1 rounded-lg text-slate-200 font-semibold border border-slate-700">
            Lead: {project.leadStudentId?.name || 'Aarav Sharma'}
          </span>
          <span className="bg-slate-800 px-3 py-1 rounded-lg text-slate-200 font-semibold border border-slate-700">
            Mentor: Dr. Rameshwar Mahto (Structural Faculty)
          </span>
        </div>
      </div>

      {/* Grid: Milestones (7 cols) + Collaboration & Chat (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Milestones Tracker */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Project Milestones & Verification</h2>
            <button
              onClick={() => setMilestoneModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Milestone Evidence</span>
            </button>
          </div>

          <div className="space-y-4">
            {project.milestones?.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No milestones added yet. Click "Upload Milestone Evidence" to add phase proof.
              </div>
            ) : (
              project.milestones.map((ms: any, index: number) => (
                <div
                  key={ms._id || index}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        ms.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        ms.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        P{ms.phaseNumber || index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{ms.title}</h4>
                        <span className="text-[10px] text-slate-400">
                          Phase {ms.phaseNumber || index + 1}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ms.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      ms.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ms.status === 'APPROVED' ? 'Verified by Authority' : ms.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ms.description}
                  </p>

                  {ms.evidenceNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                      <span className="font-bold">Attached Evidence:</span> {ms.evidenceNotes}
                    </div>
                  )}

                  {ms.reviewerNotes && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Evaluator Verification Note:</span> {ms.reviewerNotes}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Collaboration Hub (Section 12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Collaboration Hub</h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold ml-auto">
                Real-time Socket
              </span>
            </div>

            {/* Comments Stream */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              {activities.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No discussion comments yet.</p>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{act.userName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600">{act.details}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post updates or ask mentor..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Upload Milestone Evidence Modal */}
      {milestoneModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                Project Milestone Submission
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Upload Milestone Evidence
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Demonstrate physical progress to the District Evaluator.
              </p>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Structural assessment completed"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Milestone Technical Work Performed *
                </label>
                <textarea
                  rows={3}
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Evidence Notes & Test Reports
                </label>
                <input
                  type="text"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Simulated Lab Certificate Attached: <code>flyash_compression_test_32mpa.pdf</code></span>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setMilestoneModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMilestone}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isSubmittingMilestone ? 'Uploading...' : 'Submit to Authority (+30 Pts)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
