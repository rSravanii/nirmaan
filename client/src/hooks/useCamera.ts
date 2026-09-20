import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  capturedImage: string | null;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  retakePhoto: () => void;
  clearImage: () => void;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      try { track.stop(); } catch { /* already stopped */ }
    });
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!window.isSecureContext) {
      setError('Camera access requires HTTPS. Open the deployed Nirmaan site using HTTPS.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('This browser does not support live camera access. Use Upload Photo instead.');
      return;
    }

    stopCamera();

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (firstError) {
        console.warn('Rear camera request failed; retrying with generic camera.', firstError);
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      const video = videoRef.current;

      if (!video) {
        stopCamera();
        setError('Camera preview could not be initialized. Please try again.');
        return;
      }

      video.srcObject = stream;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      await video.play();
      setIsStreaming(true);
    } catch (err: any) {
      console.error('Camera access failed:', err);
      stopCamera();

      const name = err?.name;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Allow camera access in browser settings, then try again.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('No camera was found. You can use Upload Photo instead.');
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setError('The camera is being used by another application. Close it and try again.');
      } else {
        setError(err?.message || 'Unable to access the camera. Please use Upload Photo.');
      }
    }
  }, [stopCamera]);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !isStreaming) {
      setError('Camera is not ready yet. Please wait for the preview.');
      return null;
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setError('Camera is still starting. Please wait a moment.');
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext('2d');
    if (!context) {
      setError('Unable to capture the camera frame.');
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    setCapturedImage(dataUrl);
    stopCamera();
    return dataUrl;
  }, [isStreaming, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    void startCamera();
  }, [startCamera]);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
    stopCamera();
  }, [stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef,
    isStreaming,
    capturedImage,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto,
    clearImage,
  };
}
