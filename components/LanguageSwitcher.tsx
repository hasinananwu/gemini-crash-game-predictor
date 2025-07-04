
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslations();

    const languages: { code: Language, label: string }[] = [
        { code: 'en', label: 'EN' },
        { code: 'fr', label: 'FR' },
        { code: 'mg', label: 'MG' },
    ];

    return (
        <div className="flex items-center bg-gray-700 rounded-full p-1">
            {languages.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`px-3 py-1 text-sm font-bold rounded-full transition-colors duration-300 ${
                        language === code 
                            ? 'bg-cyan-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};
