import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useOfflineDraft } from '../hooks/useOfflineDraft.js';
import { CameraCapture } from '../components/CameraCapture.js';
import { AIProcessingCard } from '../components/AIProcessingCard.js';
import { DuplicateAlertCard } from '../components/DuplicateAlertCard.js';
import { apiRequest } from '../api/client.js';
import {
  Mic,
  MicOff,
  MapPin,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  WifiOff,
  HardDrive,
  Users,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'East Singhbhum',
  'West Singhbhum',
  'Hazaribagh',
  'Bokaro',
  'Dhanbad',
  'Dumka',
  'Deoghar',
  'Gumla',
  'Simdega',
  'Garhwa',
  'Palamu',
  'Chatra',
  'Giridih',
  'Koderma',
  'Ramgarh',
  'Lohardaga',
  'Khunti',
  'Latehar',
  'Jamtara',
  'Godda',
  'Sahibganj',
  'Pakur',
  'Seraikela Kharsawan'
];

const CATEGORIES = [
  'Broken bridge',
  'Damaged road',
  'Drinking water shortage',
  'Non-functional borewell',
  'Streetlight failure',
  'Waste-management issue',
  'School infrastructure problem',
  'Drainage problem',
  'Electricity issue',
  'Healthcare/access issue',
  'Other'
];

export const ReportProblemPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const { draft, saveDraft, clearDraft, isSavedLocally, isOnline } = useOfflineDraft({
    title: '',
    description: '',
    category: 'Broken bridge',
    district: 'Ranchi',
    village: 'Hesal, Angara Block',
    affectedPopulation: 450,
    isAnonymous: false,
    latitude: 23.3850,
    longitude: 85.4520,
    photoData: ''
  });

  const [form, setForm] = useState(draft);
  const [photoPreview, setPhotoPreview] = useState<string | null>(draft.photoData || null);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  // Sync form changes with offline draft hook
  const updateFormField = (field: string, value: any) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    saveDraft({ [field]: value });
  };

  // Quick prompt presets for jury demonstration
  const setJuryPreset = (langKey: 'en' | 'hi' | 'te') => {
    if (langKey === 'hi') {
      updateFormField('title', 'गाँव के पास का पुल टूट गया है');
      updateFormField(
        'description',
        'हमारे गाँव के पास का पुल भारी बारिश के बाद टूट गया है और बच्चे सुरक्षित रूप से पार नहीं कर सकते। आपातकालीन एम्बुलेंस भी नहीं आ पा रही है।'
      );
      updateFormField('category', 'Broken bridge');
      updateFormField('district', 'Ranchi');
      updateFormField('village', 'Hesal, Angara Block');
    } else if (langKey === 'te') {
      updateFormField('title', 'గ్రామం సమీపంలో వంతెన కూలిపోయింది');
      updateFormField(
        'description',
        'మా గ్రామం సమీపంలో వంతెన దెబ్బతింది మరియు పిల్లలు సురక్షితంగా దాటలేరు. వాహనాల రాకపోకలు పూర్తిగా నిలిచిపోయాయి.'
      );
      updateFormField('category', 'Broken bridge');
      updateFormField('district', 'Ranchi');
      updateFormField('village', 'Hesal, Angara Block');
    } else {
      updateFormField('title', 'Damaged rural bridge cuts off access to primary school');
      updateFormField(
        'description',
        'The bridge near our village has been damaged and children cannot safely cross it. Heavy rains washed out the embankment footings.'
      );
      updateFormField('category', 'Broken bridge');
      updateFormField('district', 'Ranchi');
      updateFormField('village', 'Hesal, Angara Block');
    }
  };

  // Capture Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGeoStatus('Acquiring high-accuracy GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateFormField('latitude', Number(pos.coords.latitude.toFixed(5)));
        updateFormField('longitude', Number(pos.coords.longitude.toFixed(5)));
        setGeoStatus(`GPS Locked: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setGeoStatus('Using district default coordinates (Location access denied).');
      },
      { timeout: 8000 }
    );
  };

  // Web Speech API Voice Input
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input or Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      if (speechText) {
        updateFormField('description', form.description ? `${form.description} ${speechText}` : speechText);
        if (!form.title) {
          updateFormField('title', speechText.substring(0, 70));
        }
      }
    };

    recognition.start();
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('Please provide a title and description for the problem report.');
      return;
    }

    if (!isOnline) {
      saveDraft({ title: form.title, description: form.description, category: form.category, district: form.district, village: form.village, affectedPopulation: form.affectedPopulation, latitude: form.latitude, longitude: form.longitude, isAnonymous: form.isAnonymous });
      alert('You are offline. The report details were saved locally. Reconnect to submit the report.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('category', form.category);
    formData.append('district', form.district);
    formData.append('village', form.village || '');
    formData.append('affectedPopulation', String(form.affectedPopulation || 0));
    formData.append('latitude', String(form.latitude || ''));
    formData.append('longitude', String(form.longitude || ''));
    formData.append('originalLanguage', language);
    formData.append('isAnonymous', String(Boolean(form.isAnonymous)));
    formData.append('cameraCaptured', String(Boolean(photoPreview)));

    if (photoPreview?.startsWith('data:image/')) {
      const imageResponse = await fetch(photoPreview);
      const blob = await imageResponse.blob();
      const file = new File([blob], `problem-evidence-${Date.now()}.jpg`, { type: 'image/jpeg' });
      formData.append('photos', file);
    }

    const res = await apiRequest('/problems', {
      method: 'POST',
      body: formData
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmissionResult(res);
      clearDraft();
    } else {
      alert(res.message || 'Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.reportForm.heading}
            </h1>
          </div>

          {/* Quick Jury Demo Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-500 px-1 text-[10px] uppercase font-bold">Demo Preset:</span>
            <button
              type="button"
              onClick={() => setJuryPreset('en')}
              className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs"
            >
              English Bridge
            </button>
            <button
              type="button"
              onClick={() => setJuryPreset('hi')}
              className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-emerald-800 text-[11px] font-bold shadow-2xs"
            >
              हिन्दी पुल
            </button>
            <button
              type="button"
              onClick={() => setJuryPreset('te')}
              className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-blue-800 text-[11px] font-bold shadow-2xs"
            >
              తెలుగు వంతెన
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          {t.reportForm.subheading}
        </p>

        {/* Offline Draft & Connectivity Bar */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                <WifiOff className="w-3 h-3" />
                Offline Mode Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Network Online
              </span>
            )}
            {isSavedLocally && (
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium animate-fade-in">
                <HardDrive className="w-3 h-3" />
                Saved to local storage draft
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Submission Success & AI Results Banner */}
      {submissionResult && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-4">
            <div className="p-2 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-lg text-emerald-950">
                Report Submitted & Processed by AI Engine!
              </h3>
              <p className="text-xs text-emerald-800">
                Report ID: <code className="font-mono font-bold">{submissionResult.report?._id}</code>. Impact points credited to your account.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionResult(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  Submit Another Report
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/problems/${submissionResult.report?._id}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-bold transition-colors"
                >
                  View Details & Smart Matches
                </button>
              </div>
            </div>
          </div>

          {/* Render Semantic Duplicate Alert if matched */}
          {submissionResult.aiAnalysis?.isDuplicate && (
            <DuplicateAlertCard
              isDuplicate={submissionResult.aiAnalysis.isDuplicate}
              highestSimilarity={submissionResult.aiAnalysis.highestSimilarity}
              explanation={submissionResult.aiAnalysis.explanation}
              clusterId={submissionResult.aiAnalysis.duplicateCandidates?.[0]?.clusterId}
              clusterTitle={submissionResult.aiAnalysis.duplicateCandidates?.[0]?.title}
              candidates={submissionResult.aiAnalysis.duplicateCandidates}
            />
          )}

          {/* Render Full Structured AI Processing Card */}
          {submissionResult.aiAnalysis && (
            <AIProcessingCard analysis={submissionResult.aiAnalysis} />
          )}
        </div>
      )}

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.reportForm.titleLabel} *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateFormField('title', e.target.value)}
            placeholder={t.reportForm.titlePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
            required
          />
        </div>

        {/* Description + Voice input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.reportForm.descLabel} *
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? t.reportForm.voiceListening : t.reportForm.voiceInput}</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => updateFormField('description', e.target.value)}
            placeholder={t.reportForm.descPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
            required
          />
        </div>

        {/* Camera Capture Section (Section 6) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Visual Proof / Camera Capture *
          </label>
          <CameraCapture
            photoPreview={photoPreview}
            onPhotoCaptured={(photoUrl) => {
              setPhotoPreview(photoUrl);
            }}
            onPhotoCleared={() => {
              setPhotoPreview(null);
            }}
          />
        </div>

        {/* Grid: Category, District, Village */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.reportForm.categoryLabel}
            </label>
            <select
              value={form.category}
              onChange={(e) => updateFormField('category', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.reportForm.districtLabel} *
            </label>
            <select
              value={form.district}
              onChange={(e) => updateFormField('district', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
              required
            >
              {JHARKHAND_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.reportForm.villageLabel}
            </label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => updateFormField('village', e.target.value)}
              placeholder={t.reportForm.villagePlaceholder}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
            />
          </div>
        </div>

        {/* Affected Population & Geolocation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Estimated Affected People
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={1}
                max={50000}
                value={form.affectedPopulation}
                onChange={(e) => updateFormField('affectedPopulation', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GPS Coordinates
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Fetch Live GPS
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span>Lat: {form.latitude}</span>
              <span className="text-slate-300">|</span>
              <span>Lng: {form.longitude}</span>
            </div>
            {geoStatus && <p className="text-[11px] text-emerald-700 font-medium">{geoStatus}</p>}
          </div>
        </div>

        {/* Anonymous Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(e) => updateFormField('isAnonymous', e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>{t.reportForm.anonymousCheckbox}</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Submission will run through the multilingual AI translation & deduplication pipeline.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.reportForm.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.reportForm.submitButton}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
