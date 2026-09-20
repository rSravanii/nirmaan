import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types/index.js';
import { translations, TranslationSchema } from '../i18n/translations.js';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationSchema;
  availableLanguages: Array<{ code: SupportedLanguage; label: string; native: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const availableLanguages: Array<{ code: SupportedLanguage; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'sat', label: 'Santhali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'mun', label: 'Mundari', native: 'ᱢᱩᱱᱰᱟᱨᱤ (Mundari)' },
  { code: 'ho', label: 'Ho', native: 'ᱦᱳ (Ho)' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('gramutthan_lang') as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('gramutthan_lang', lang);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
