import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProblemReport } from '../types/index.js';
import { apiRequest } from '../api/client.js';
import { MapView } from '../components/MapView.js';
import {
  MapPin,
  Filter,
  Search,
  Grid,
  Map as MapIcon,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

const DISTRICTS = ['All', 'Ranchi', 'East Singhbhum', 'West Singhbhum', 'Hazaribagh', 'Bokaro', 'Dhanbad', 'Dumka', 'Deoghar', 'Gumla', 'Simdega'];
const CATEGORIES = ['All', 'Broken bridge', 'Damaged road', 'Drinking water shortage', 'Non-functional borewell', 'Streetlight failure', 'School infrastructure problem', 'Drainage problem'];

export const DiscoverProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'split' | 'grid'>('split');

  const fetchProblems = async () => {
    setLoading(true);
    let query = `/problems?limit=50`;
    if (selectedDistrict !== 'All') query += `&district=${selectedDistrict}`;
    if (selectedCategory !== 'All') query += `&category=${encodeURIComponent(selectedCategory)}`;
    if (selectedSeverity !== 'All') query += `&severity=${selectedSeverity}`;
    if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;

    const res = await apiRequest(query);
    if (res.success && res.reports) {
      setProblems(res.reports);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDistrict, selectedCategory, selectedSeverity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore Jharkhand Civic Problems
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-world challenges reported by rural citizens awaiting university and student engineering solutions.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Split View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Full Map</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards Grid</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. bridge, culvert, borehole, school)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
            >
              {DISTRICTS.map(d => <option key={d} value={d}>District: {d}</option>)}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
            >
              <option value="All">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Main Content: Split, Map, or Grid */}
      {viewMode === 'map' && (
        <div className="h-[650px]">
          <MapView problems={problems} />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map on Left (7 cols) */}
          <div className="lg:col-span-7 h-[620px] sticky top-20">
            <MapView problems={problems} />
          </div>

          {/* Cards List on Right (5 cols) */}
          <div className="lg:col-span-5 space-y-4 max-h-[620px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {problems.length} Problem Reports</span>
              <span>Sorted by Recent</span>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-400 text-xs">Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-700">No problems match your filter</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting the district or category filter</p>
              </div>
            ) : (
              problems.map((prob) => (
                <div
                  key={prob._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      prob.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      prob.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      prob.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prob.severity}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {prob.village ? `${prob.village}, ${prob.district}` : prob.district}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {prob.aiSummary || prob.description}
                  </p>

                  {/* Impact tag & cluster badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      ~{prob.affectedPopulation} citizens affected
                    </span>

                    <Link
                      to={`/problems/${prob._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>View Problem</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob) => (
            <div
              key={prob._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    prob.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    prob.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    prob.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {prob.severity}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {prob.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {prob.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3">
                  {prob.aiSummary || prob.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {prob.district}
                  </span>
                  <span className="text-emerald-700 font-bold">
                    ~{prob.affectedPopulation} affected
                  </span>
                </div>

                <Link
                  to={`/problems/${prob._id}`}
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors block"
                >
                  View Details & Smart Matches
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
