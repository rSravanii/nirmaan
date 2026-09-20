import React, { useState } from 'react';
import {
  Presentation,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Database,
  Smartphone,
  Server,
  ArrowDown,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Globe2,
  GitBranch
} from 'lucide-react';

export const ArchitecturePresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'slides' | 'diagram'>('slides');

  const slides = [
    {
      number: 1,
      tag: 'Introduction',
      title: 'Nirmaan — Crowdsourced Social Innovation Network',
      subtitle: 'Smart India Hackathon • SIH26043 • Government of Jharkhand',
      bullets: [
        'Bridging the critical gap between rural civic infrastructure problems and state university engineering capacity.',
        'Transforming local citizen voices into structured, solvable academic projects.',
        'End-to-end verified loop: REPORT → UNDERSTAND → MATCH → RESOLVE → VERIFY → REWARD.'
      ],
      icon: Presentation,
      color: 'from-emerald-600 to-teal-700'
    },
    {
      number: 2,
      tag: 'Problem Definition',
      title: 'Rural Realities & Systemic Gaps in Jharkhand',
      subtitle: 'Why rural civic issues remain unsolved for years',
      bullets: [
        'Fragmented Reporting: Villagers lack access to formal portals or suffer digital/linguistic exclusion.',
        'Language Barriers: Tribal and regional dialects (Santhali, Mundari, Ho, Telugu, Hindi) are unsupported by traditional e-governance.',
        'Academic Disconnect: Universities perform theoretical projects instead of solving physical community challenges.',
        'Zero Verification & Accountability: Absence of transparent on-ground milestone validation and impact attribution.'
      ],
      icon: Users,
      color: 'from-red-600 to-amber-700'
    },
    {
      number: 3,
      tag: 'Solution Paradigm',
      title: 'The Closed-Loop Civic Pipeline',
      subtitle: 'REPORT → RESOLVE → REWARD',
      bullets: [
        '1. REPORT: Simple native reporting with real camera capture, voice dictation, and GPS in local languages.',
        '2. UNDERSTAND: Multilingual AI translation, severity classification, and automated semantic deduplication.',
        '3. MATCH: Smart matching engine connects problems to university students & professor research domains.',
        '4. RESOLVE: University teams deploy prototypes, field test, and submit milestone evidence.',
        '5. VERIFY & REWARD: District evaluators physically inspect and certify impact; points & badges awarded.'
      ],
      icon: Zap,
      color: 'from-emerald-600 to-blue-700'
    },
    {
      number: 4,
      tag: 'System Architecture',
      title: 'Decoupled Scalable Full-Stack Architecture',
      subtitle: 'Community → React → Express → AI Orchestrator → MongoDB / Vectors → University → Verification',
      bullets: [
        'Client Tier: Mobile-first React 18 + Vite + Tailwind, accessible touch UI with offline draft persistence.',
        'Gateway & Real-time Tier: Node.js Express REST API with Socket.IO live collaboration broadcasts.',
        'AI Orchestration Layer: Provider abstraction supporting cloud LLMs (Gemini) and fail-safe deterministic SIH engine.',
        'Vector Search Layer: Normalized cosine vector similarity engine for instant duplicate clustering.'
      ],
      icon: Layers,
      color: 'from-blue-600 to-indigo-800'
    },
    {
      number: 5,
      tag: 'Tech Stack',
      title: 'Full MERN + Vector AI Technology Stack',
      subtitle: 'Modern, maintainable, and deployable across cloud & edge',
      bullets: [
        'Frontend: React, Vite, TypeScript, React Router, Tailwind CSS, Leaflet GIS, Lucide React.',
        'Backend: Node.js, Express.js, TypeScript, JWT auth, bcryptjs, Multer file handler, Socket.IO.',
        'Database: MongoDB & Mongoose schemas with indexing and zero-config embedded memory server fallback.',
        'AI & Vector: Provider abstraction layer, Gemini 1.5 Flash, Bhashini gateway, 64-dim cosine vector similarity.'
      ],
      icon: Server,
      color: 'from-indigo-600 to-purple-800'
    },
    {
      number: 6,
      tag: 'AI Innovation',
      title: 'Differentiators: Beyond Generic Chatbots',
      subtitle: 'Practical NLP & Vector Math engineered for civic scale',
      bullets: [
        'Multilingual Translation: Normalizes Hindi, Telugu, Santhali, Mundari, and Ho into actionable structured formats.',
        'Semantic Deduplication: Calculates cosine distance between reports to cluster duplicates (e.g. 94% similarity).',
        'Transparent Smart Matching: Evaluates 5-factor weighted formula (semantic, domain, keyword, department, experience).',
        'PII Scrubbing: Automatically sanitizes Aadhaar, mobile numbers, and names from public AI summaries.'
      ],
      icon: Cpu,
      color: 'from-purple-600 to-pink-700'
    },
    {
      number: 7,
      tag: 'Collaboration + Gamification',
      title: 'Academic Mobilization & Institutional Competition',
      subtitle: 'Channeling student talent into public service',
      bullets: [
        'Problem Claiming & Team Workspaces: Students create verified project spaces with chat and file sharing.',
        'Milestone Submission: Phased physical deliverables backed by concrete test reports, drone surveys & photos.',
        'Authority Verification: District Evaluator reviews evidence and marks impact VERIFIED.',
        'Impact Points & Leaderboards: Ranks top institutions (BIT Mesra, IIT ISM Dhanbad) and student problem solvers.'
      ],
      icon: Award,
      color: 'from-amber-600 to-orange-700'
    },
    {
      number: 8,
      tag: 'Feasibility & Security',
      title: 'Enterprise Governance & Ground Feasibility',
      subtitle: 'Privacy, security, and low-connectivity resilience',
      bullets: [
        'Role-Based Access Control (RBAC): Strict segregation across Citizen, Student, Professor, Evaluator, and Admin.',
        'Privacy & PII Protection: Contact information masked from unauthorized students; anonymous reporting support.',
        'Offline Resilience: Browser local storage caching ensures unfinished reports are preserved during network drops.',
        'No Paid Traps: Open-source Leaflet GIS tiles and resilient fallback AI guarantee zero operational stoppage.'
      ],
      icon: ShieldCheck,
      color: 'from-teal-600 to-emerald-800'
    },
    {
      number: 9,
      tag: 'Implementation Roadmap',
      title: 'Phased Scaling for Jharkhand State',
      subtitle: 'From Hackathon MVP to statewide public infrastructure',
      bullets: [
        'Phase 1 (MVP — Current): End-to-end prototype tested with 20+ problems across 10 Jharkhand districts.',
        'Phase 2 (University Pilot): Formal onboarding of BIT Mesra, NIT Jamshedpur & IIT ISM engineering departments.',
        'Phase 3 (District Administration Integration): Connecting Panchayati Raj offices and Gram Sabhas for automated alerts.',
        'Phase 4 (State Scaling): Integration with Jharkhand Pragati Portal and Bhashini national language mission.'
      ],
      icon: GitBranch,
      color: 'from-blue-700 to-slate-900'
    },
    {
      number: 10,
      tag: 'Future Scope',
      title: 'Sustainable Impact & Future Horizons',
      subtitle: 'Economic empowerment and civic technology evolution',
      bullets: [
        'Corporate Social Responsibility (CSR) Co-Funding: Direct grant funding for high-scoring student engineering prototypes.',
        'Rural Startup Incubation: Promoting successful student solutions into rural tech social enterprises.',
        'Predictive Civic Analytics: AI analysis of historical failure patterns to predict culvert washouts before monsoons.',
        'IoT Telemetric Sensor Integration: Automatic alerts from water quality sensors and solar grid telemetry.'
      ],
      icon: Globe2,
      color: 'from-emerald-700 to-teal-900'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Presentation className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900">Jury Presentation & Architecture</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly aligned with Sections 42 & 43 of the Master Build Specification
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'slides' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            10-Slide Pitch Deck
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'diagram' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Architecture
          </button>
        </div>
      </div>

      {/* VIEW 1: 10-Slide Pitch Deck */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          {/* Slide Box */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            {/* Background gradient flare */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${slides[currentSlide].color} opacity-20 blur-3xl pointer-events-none`}></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Slide {slides[currentSlide].number} of 10 • {slides[currentSlide].tag}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  SIH26043 — Govt of Jharkhand
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {slides[currentSlide].bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-normal">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === i ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-400 px-1">
                  {currentSlide + 1} / 10
                </span>
                <button
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Clean Professional System Architecture (Section 22 & 42) */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-xl font-black text-slate-900">GramUtthan Clean System Architecture</h2>
              <p className="text-xs text-slate-500">
                Responsive, multi-tiered micro-modular architecture designed for 20-second jury comprehension.
              </p>
            </div>

            {/* Architecture Flowchart Diagram */}
            <div className="max-w-2xl mx-auto space-y-4 pt-4">
              {/* Tier 1: Citizens */}
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>Community / NGO / Rural Citizen</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Multilingual Camera Capture, Audio Dictation & GPS (Hindi, Telugu, Santhali, Mundari, Ho)
                </p>
              </div>

              <div className="flex justify-center text-emerald-600">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>

              {/* Tier 2: React Web */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-center space-y-1 shadow-md">
                <div className="text-xs font-black uppercase text-emerald-400">
                  React 18 / Vite Responsive Web App + Leaflet GIS
                </div>
                <p className="text-xs text-slate-300">
                  Role-based views (Citizen, Student, Professor, Evaluator, Admin) + Offline Draft Cache
                </p>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Tier 3: Express Gateway */}
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 text-center space-y-1">
                <div className="text-xs font-black uppercase text-blue-900 flex items-center justify-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-700" />
                  <span>Express API Gateway & Real-Time Socket.IO</span>
                </div>
                <p className="text-xs text-blue-800">
                  JWT Auth, RBAC Authorization Middleware, Helmet, Multer File Upload, Privacy PII Masking
                </p>
              </div>

              <div className="flex justify-center text-blue-500">
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Tier 4: Core Logic */}
              <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300 text-center space-y-1">
                <div className="text-xs font-black uppercase text-purple-900">
                  Core Business & Crowdsourcing Logic
                </div>
                <p className="text-xs text-purple-800">
                  Problem Management • Milestone Lifecycle • Verification Engine • Impact Point Rewards
                </p>
              </div>

              <div className="flex justify-center text-purple-500">
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Tier 5: Database & AI Orchestration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-center space-y-1">
                  <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>MongoDB Database</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    14 Mongoose models with indexes & embedded memory server fallback
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-center space-y-1">
                  <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>AI Orchestration Provider</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Gemini Cloud API / Local Deterministic Engine with Bhashini translator
                  </p>
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Tier 6: Vector Math & Dedup */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1">
                <div className="text-xs font-black uppercase text-amber-900">
                  Vector Deduplication & Smart Matching Engine
                </div>
                <p className="text-xs text-amber-800 font-mono">
                  0.55*semantic + 0.20*domain + 0.10*keyword + 0.10*dept + 0.05*exp
                </p>
              </div>

              <div className="flex justify-center text-amber-600">
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Tier 7: Verification & Impact */}
              <div className="p-4 rounded-2xl bg-emerald-600 text-white text-center space-y-1 shadow-lg">
                <div className="text-xs font-black uppercase text-white flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>District Authority Verification & Impact Points Leaderboard</span>
                </div>
                <p className="text-xs text-emerald-100">
                  On-ground milestone confirmation and state recognition of student engineering achievements
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
