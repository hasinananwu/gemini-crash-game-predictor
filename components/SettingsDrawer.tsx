
import React, { useState, useEffect } from 'react';
import type { Config, DeepPartial } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useTranslations } from '../hooks/useTranslations';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    config: Config;
    onUpdateConfig: (newConfig: DeepPartial<Config>) => void;
    apiKey: string | null;
    onSaveApiKey: (key: string) => Promise<void>;
    isInTelegram: boolean;
    isCloudStorageSupported: boolean;
}

const SettingInput = ({ label, value, onChange }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <Input
                type="number"
                value={value}
                onChange={e => onChange(parseFloat(e.target.value) || 0)}
                className="w-full"
            />
        </div>
    );
};


export const SettingsDrawer = ({ isOpen, onClose, config, onUpdateConfig, apiKey, onSaveApiKey, isInTelegram, isCloudStorageSupported }: SettingsDrawerProps) => {
    const { t } = useTranslations();
    const [keyInput, setKeyInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setKeyInput(apiKey || '');
    }, [apiKey]);
    
    const handleSave = async () => {
        if (!keyInput) return;
        setIsSaving(true);
        try {
            await onSaveApiKey(keyInput);
            // Optionally, provide feedback to the user
            alert('API Key saved successfully!');
        } catch (e) {
            console.error("Failed to save API Key:", e);
            alert('Failed to save API Key.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={onClose}
        >
            <div
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
                onClick={e => e.stopPropagation()}
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
                <Card className="h-full flex flex-col rounded-none border-0 border-l border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                    <Card.Title>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {t('settings.title')}
                            </span>
                            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                        </div>
                    </Card.Title>
                    <Card.Body className="flex-grow overflow-y-auto space-y-6">
                        {isInTelegram && (
                            <div>
                                <h3 className="text-md font-semibold text-cyan-400 mb-2">{t('settings.apiKey.title')}</h3>
                                {!isCloudStorageSupported && (
                                    <div className="bg-orange-900/50 border border-orange-700 text-orange-300 text-xs rounded-md p-2 mb-4">
                                        {t('settings.apiKey.unsupported')}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-400 mb-1">{t('settings.apiKey.label')}</label>
                                        <Input
                                            id="api-key-input"
                                            type="password"
                                            placeholder={t('settings.apiKey.placeholder')}
                                            value={keyInput}
                                            onChange={e => setKeyInput(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <Button onClick={handleSave} disabled={isSaving} className="w-full">
                                        {isSaving ? t('settings.apiKey.saving') : t('settings.apiKey.saveButton')}
                                    </Button>
                                </div>
                            </div>
                        )}
                         <div className={isInTelegram ? "border-t border-gray-700 pt-4" : ""}>
                            <h3 className="text-md font-semibold text-cyan-400 mb-2">{t('settings.crashTime.title')}</h3>
                            <div className="space-y-4">
                               <SettingInput 
                                    label={t('settings.crashTime.low')}
                                    value={config.crash_time_generation.low_mult_max_seconds}
                                    onChange={v => onUpdateConfig({ crash_time_generation: { low_mult_max_seconds: v }})}
                               />
                               <SettingInput 
                                    label={t('settings.crashTime.med')}
                                    value={config.crash_time_generation.med_mult_max_seconds}
                                    onChange={v => onUpdateConfig({ crash_time_generation: { med_mult_max_seconds: v }})}
                               />
                               <SettingInput 
                                    label={t('settings.crashTime.high')}
                                    value={config.crash_time_generation.high_mult_max_seconds}
                                    onChange={v => onUpdateConfig({ crash_time_generation: { high_mult_max_seconds: v }})}
                               />
                            </div>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                            <h3 className="text-md font-semibold text-cyan-400 mb-2">{t('settings.flow.title')}</h3>
                            <div className="space-y-4">
                               <SettingInput 
                                    label={t('settings.flow.pause')}
                                    value={config.simulation.pause_between_rounds_seconds}
                                    onChange={v => onUpdateConfig({ simulation: { pause_between_rounds_seconds: v }})}
                               />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};
