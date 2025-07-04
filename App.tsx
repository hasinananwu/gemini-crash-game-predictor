
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCrashSimulator } from './hooks/useCrashSimulator';
import { useTranslations } from './hooks/useTranslations';
import { useTelegram } from './hooks/useTelegram';
import { useApiKey } from './hooks/useApiKey';
import { ControlPanel } from './components/ControlPanel';
import { ForecastDisplay } from './components/ForecastDisplay';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Guide } from './components/Guide';
import { FeedbackForm } from './components/FeedbackForm';
import { getAIForecastAnalysis, RateLimitError } from './services/geminiService';
import { generateLocalInsightForMinute } from './services/localAnalysisService';
import type { Forecast } from './types';
import { SettingsDrawer } from './components/SettingsDrawer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Switch } from './components/ui/Switch';

const groupForecastByMinute = (forecast: Forecast[]) => {
    return forecast.reduce((acc, item) => {
        const minuteKey = item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if (!acc[minuteKey]) {
            acc[minuteKey] = [];
        }
        acc[minuteKey].push(item);
        return acc;
    }, {} as Record<string, Forecast[]>);
};

const App = () => {
    const { t, language } = useTranslations();
    const { tg, ready, themeParams } = useTelegram();
    const { apiKey, saveApiKey, isCloudStorageSupported } = useApiKey();

    const {
        state,
        generateForecast,
        applyRealResult,
        resetSession,
        loadHistory,
        getHistoryCsv,
        updateConfig,
        updateForecastItem,
    } = useCrashSimulator();

    const [showGuide, setShowGuide] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAiAnalysisEnabled, setIsAiAnalysisEnabled] = useState(false);
    const [insights, setInsights] = useState<Record<string, string>>({});
    const [insightSource, setInsightSource] = useState<'none' | 'local' | 'ai'>('none');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [useRealTimeForForecast, setUseRealTimeForForecast] = useState(true);
    const [editingRound, setEditingRound] = useState<number | null>(null);
    const isFetchingRef = useRef(false);

    // Initialize Telegram Mini App
    useEffect(() => {
        ready();
    }, [ready]);

    // Adapt theme to Telegram
    useEffect(() => {
        if (themeParams?.bg_color) {
            document.body.style.backgroundColor = themeParams.bg_color;
        }
    }, [themeParams]);

    const generateAndSetLocalInsights = useCallback((forecast: Forecast[]) => {
        const grouped = groupForecastByMinute(forecast);
        const localInsights: Record<string, string> = {};
        for (const minuteKey in grouped) {
            localInsights[minuteKey] = generateLocalInsightForMinute(grouped[minuteKey], t);
        }
        setInsights(localInsights);
        setInsightSource('local');
    }, [t]);

    const fetchAiInsight = useCallback(async (forecast: Forecast[]) => {
        if (isFetchingRef.current || isRateLimited || !apiKey) return;
        
        isFetchingRef.current = true;
        setIsAiLoading(true);
        setInsights({});
        setInsightSource('none');

        try {
            const insight = await getAIForecastAnalysis(forecast, t, language, apiKey);
            setInsights(insight);
            setInsightSource('ai');
        } catch (error) {
            console.error("Error fetching AI insight:", error);
            if (error instanceof RateLimitError) {
                setInsights({ error: t('app.geminiRateLimitError') });
                setIsRateLimited(true);
                setTimeout(() => setIsRateLimited(false), 60000); // 60-second cooldown
            } else {
                 setInsights({ error: t('app.geminiError') });
            }
            // Fallback to local analysis on any error
            generateAndSetLocalInsights(forecast);
        } finally {
            setIsAiLoading(false);
            isFetchingRef.current = false;
        }
    }, [t, language, isRateLimited, generateAndSetLocalInsights, apiKey]);

    // Generate forecast on initial load if it's empty
    useEffect(() => {
      if (state.forecast.length === 0) {
        generateForecast();
      }
    }, [state.forecast.length, generateForecast]);

    // Handles fetching AI insights or generating local ones based on toggle state
    useEffect(() => {
        if (state.forecast.length > 0) {
            if (isAiAnalysisEnabled) {
                if(apiKey) {
                    fetchAiInsight(state.forecast);
                } else {
                    // No API key, so clear insights and let the UI show the prompt.
                    setInsights({});
                    setInsightSource('none');
                }
            } else {
                generateAndSetLocalInsights(state.forecast);
            }
        } else {
            setInsights({});
            setInsightSource('none');
        }
    }, [isAiAnalysisEnabled, state.forecast, fetchAiInsight, generateAndSetLocalInsights, apiKey]);

    const handleGenerateForecast = useCallback(() => {
        const startTime = useRealTimeForForecast ? new Date() : undefined;
        generateForecast(startTime);
    }, [useRealTimeForForecast, generateForecast]);

    // Configure Telegram Main Button
    useEffect(() => {
        if (tg) {
            tg.MainButton.setText(t('controls.generate'));
            tg.MainButton.onClick(handleGenerateForecast);
            tg.MainButton.show();
        }
        return () => {
            if (tg) {
                tg.MainButton.offClick(handleGenerateForecast);
                tg.MainButton.hide();
            }
        };
    }, [tg, handleGenerateForecast, t]);


    const handleApplyFeedback = (multiplier: number, crashTime: Date) => {
        const eventTime = state.forecast[0]?.startTime || state.currentTime;
        applyRealResult(multiplier, crashTime, eventTime);
    };

    const handleStartEdit = useCallback((round: number) => {
        setEditingRound(round);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingRound(null);
    }, []);

    const handleApplyEdit = useCallback((round: number, updatedValues: { startTime: Date; crashTime: Date; multiplier: number; }) => {
        updateForecastItem(round, updatedValues);
        setEditingRound(null);
    }, [updateForecastItem]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
                    {t('app.title')}
                </h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Switch
                        id="ai-toggle"
                        label={t('app.aiAnalysis')}
                        checked={isAiAnalysisEnabled}
                        onChange={setIsAiAnalysisEnabled}
                    />
                    <LanguageSwitcher />
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        {showGuide ? t('app.hideGuide') : t('app.showGuide')}
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label={t('app.openSettings')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <ControlPanel
                        currentTime={state.currentTime}
                        onGenerate={handleGenerateForecast}
                        onReset={resetSession}
                        onLoadHistory={loadHistory}
                        onDownloadHistory={getHistoryCsv}
                        useRealTime={useRealTimeForForecast}
                        onUseRealTimeChange={setUseRealTimeForForecast}
                        isInTelegram={!!tg}
                    />
                    <AnalysisPanel trends={state} />
                </div>

                <div className="lg:col-span-9 space-y-6">
                    {showGuide && <Guide onClose={() => setShowGuide(false)} />}
                    <ForecastDisplay 
                        forecast={state.forecast} 
                        insights={insights}
                        insightSource={insightSource}
                        isAiLoading={isAiLoading}
                        isAiAnalysisEnabled={isAiAnalysisEnabled}
                        hasApiKey={!!apiKey}
                        editingRound={editingRound}
                        onStartEdit={handleStartEdit}
                        onCancelEdit={handleCancelEdit}
                        onApplyEdit={handleApplyEdit}
                    />
                     {state.forecast.length > 0 && (
                        <FeedbackForm 
                            startTime={state.forecast[0].startTime}
                            onApplyFeedback={handleApplyFeedback}
                        />
                    )}
                </div>
            </main>
            
            <SettingsDrawer 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                config={state.config}
                onUpdateConfig={updateConfig}
                apiKey={apiKey}
                onSaveApiKey={saveApiKey}
                isInTelegram={!!tg}
                isCloudStorageSupported={isCloudStorageSupported}
            />

            <footer className="text-center p-4 bg-gray-800 text-xs text-gray-500">
                <p>{t('app.footer')}</p>
            </footer>
        </div>
    );
};

export default App;