import { useState, useEffect } from 'react';

const DRAFT_KEY = 'gramutthan_report_draft';

export function useOfflineDraft<T extends Record<string, any>>(initialValues: T) {
  const [draft, setDraft] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Photos are binary/base64 data and must not be stored in localStorage.
        // Keep old drafts usable while removing any legacy photo payload.
        if (parsed && typeof parsed === 'object') delete parsed.photoData;
        return { ...initialValues, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load local draft:', e);
      localStorage.removeItem(DRAFT_KEY);
    }
    return initialValues;
  });

  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveDraft = (values: Partial<T>) => {
    setDraft((prev) => {
      const updated = { ...prev, ...values };
      const { photoData: _photoData, ...persistable } = updated as any;
      void _photoData;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(persistable));
        setIsSavedLocally(true);
        window.setTimeout(() => setIsSavedLocally(false), 2500);
      } catch (e) {
        console.warn('Could not save draft locally:', e);
      }
      return updated;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(initialValues);
    setIsSavedLocally(false);
  };

  return { draft, saveDraft, clearDraft, isSavedLocally, isOnline };
}
