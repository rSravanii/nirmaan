import React, { useState } from 'react';
import { useCamera } from '../hooks/useCamera.js';
import { Camera, RefreshCw, CheckCircle2, Upload, AlertCircle, X } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCaptured: (photoDataUrl: string) => void;
  onPhotoCleared: () => void;
  photoPreview?: string | null;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCaptured,
  onPhotoCleared,
  photoPreview: externalPreview,
}) => {
  const {
    videoRef,
    isStreaming,
    capturedImage,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto,
    clearImage
  } = useCamera();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const preview = capturedImage || externalPreview;

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      onPhotoCaptured(photo);
    }
  };

  const handleRetake = () => {
    retakePhoto();
    onPhotoCleared();
  };

  const handleClear = () => {
    clearImage();
    onPhotoCleared();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please choose an image smaller than 10 MB.');
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please choose a valid image file.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onPhotoCaptured(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
      {/* Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!preview && !isStreaming) startCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'camera'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Device Camera</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File Fallback</span>
          </button>
        </div>

        {preview && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Evidence Attached
          </span>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-amber-700 mt-0.5">Please switch to "Upload File Fallback" below to attach a photo.</p>
          </div>
        </div>
      )}

      {/* Camera Preview / Captured Display */}
      {activeTab === 'camera' && (
        <div className="space-y-3">
          {preview ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-72 border border-slate-300 flex items-center justify-center">
              <img src={preview} alt="Captured evidence" className="w-full h-full object-contain" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-sm shadow-md transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
              </div>
            </div>
          ) : isStreaming ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-72 border border-slate-300">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 inset-x-0 flex justify-center">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg ring-4 ring-white/30 transform active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center bg-white flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Use Live Camera</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Supports phone camera and laptop webcam with instant snapshot capture.
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera Viewfinder</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* File Upload Fallback */}
      {activeTab === 'upload' && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center bg-white flex flex-col items-center justify-center gap-2">
          {preview ? (
            <div className="space-y-3 w-full">
              <img src={preview} alt="Uploaded preview" className="max-h-56 mx-auto rounded-lg object-contain" />
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Remove selected photo
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Upload Photo Evidence</p>
              <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 10MB</p>
              <label className="mt-1 cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};
