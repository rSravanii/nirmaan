import React, { useState, useRef, useCallback, useEffect } from 'react';

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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Track already stopped
        }
      });

      streamRef.current = null;
    }

    const video = videoRef.current;

    if (video) {
      video.pause();
      video.srcObject = null;
    }

    setIsStreaming(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!window.isSecureContext) {
      setError(
        'Camera access requires HTTPS. Please open the deployed HTTPS website.'
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        'Live camera is not supported by this browser. Please use Upload File Fallback.'
      );
      return;
    }

    // Stop any previous stream first.
    stopCamera();

    try {
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: 'environment',
            },
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });
      } catch {
        // Fallback for browsers that don't accept the facingMode constraint.
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Tell React to render the video element.
      setIsStreaming(true);
    } catch (err: any) {
      console.error('Camera error:', err);

      const errorName = err?.name;

      if (
        errorName === 'NotAllowedError' ||
        errorName === 'PermissionDeniedError'
      ) {
        setError(
          'Camera permission was denied. Allow camera access in your browser settings and try again.'
        );
      } else if (
        errorName === 'NotFoundError' ||
        errorName === 'DevicesNotFoundError'
      ) {
        setError(
          'No camera was found on this device. Please use Upload File Fallback.'
        );
      } else if (
        errorName === 'NotReadableError' ||
        errorName === 'TrackStartError'
      ) {
        setError(
          'The camera is being used by another application. Close other camera apps and try again.'
        );
      } else if (errorName === 'OverconstrainedError') {
        setError(
          'The requested camera is not available. Please try again.'
        );
      } else {
        setError(
          'Camera could not be initialized. Please try again or use Upload File Fallback.'
        );
      }

      stopCamera();
    }
  }, [stopCamera]);

  /*
   * Important:
   * The <video> element is rendered only after isStreaming becomes true.
   * Therefore we attach the MediaStream in this effect instead of immediately
   * after getUserMedia().
   */
  useEffect(() => {
    if (!isStreaming) return;
    if (!streamRef.current) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const stream = streamRef.current;

    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    const startPreview = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn('Video play delayed:', error);

        // Retry after the browser finishes rendering the video element.
        window.setTimeout(async () => {
          try {
            await video.play();
          } catch (retryError) {
            console.error(
              'Camera preview could not be initialized:',
              retryError
            );

            setError(
              'Camera preview could not be initialized. Please try again.'
            );

            stopCamera();
          }
        }, 300);
      }
    };

    void startPreview();

    return () => {
      video.pause();
      video.srcObject = null;
    };
  }, [isStreaming, stopCamera]);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;

    if (!video || !isStreaming) {
      setError('Camera is not ready. Please wait for the preview.');
      return null;
    }

    if (
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setError('Camera is still starting. Please wait a moment.');
      return null;
    }

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      setError('Unable to capture the camera frame.');
      return null;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image = canvas.toDataURL('image/jpeg', 0.82);

    setCapturedImage(image);

    stopCamera();

    return image;
  }, [isStreaming, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    void startCamera();
  }, [startCamera]);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
    stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

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
