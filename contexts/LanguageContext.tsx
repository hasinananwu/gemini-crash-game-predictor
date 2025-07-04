
import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { Language } from '../types';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { mg } from '../i18n/mg';

const translations = { en, fr, mg };

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        const langDict = translations[language];
        const keys = key.split('.');
        
        let result: any = langDict;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        if (typeof result === 'string' && params) {
            return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
                return str.replace(`{${paramKey}}`, String(paramValue));
            }, result);
        }

        return result || key;
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
