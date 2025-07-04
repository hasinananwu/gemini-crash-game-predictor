
import React from 'react';
import type { Forecast } from '../types';
import { Card } from './ui/Card';
import { useTranslations } from '../hooks/useTranslations';
import { ForecastItem } from './ForecastItem';

interface ForecastDisplayProps {
    forecast: Forecast[];
    insights: Record<string, string>;
    insightSource: 'none' | 'local' | 'ai';
    isAiLoading: boolean;
    isAiAnalysisEnabled: boolean;
    hasApiKey: boolean;
    editingRound: number | null;
    onStartEdit: (round: number) => void;
    onCancelEdit: () => void;
    onApplyEdit: (round: number, updatedValues: { startTime: Date; crashTime: Date; multiplier: number; }) => void;
}

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

const FormattedInsight = ({ text }: { text: string }) => {
    if (!text) return null;
    
    // Simple markdown-like to HTML converter
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>') // Bold
        .replace(/\n/g, '<br />');

    return (
        <p 
            className="text-xs text-gray-400 prose prose-invert prose-p:my-1 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: formatted }}
        />
    );
};

const InsightLoader = () => {
    const { t } = useTranslations();
    return (
        <div className="flex items-center justify-start space-x-2 text-gray-500 mt-2 pt-2 border-t border-gray-700/50">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
            <span className="text-xs">{t('gemini.loading')}</span>
        </div>
    );
};


export const ForecastDisplay = ({ forecast, insights, insightSource, isAiLoading, isAiAnalysisEnabled, hasApiKey, editingRound, onStartEdit, onCancelEdit, onApplyEdit }: ForecastDisplayProps) => {
    const { t } = useTranslations();
    const groupedForecast = groupForecastByMinute(forecast);
    const minuteKeys = Object.keys(groupedForecast);

    const renderContent = () => {
        if (isAiAnalysisEnabled && !hasApiKey) {
            return <p className="text-orange-400 text-center py-4">{t('forecast.setApiKeyPrompt')}</p>;
        }
        if (forecast.length === 0) {
            return <p className="text-gray-500 text-center py-4">{t('forecast.generating')}</p>;
        }
        return (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {minuteKeys.map((minuteKey) => (
                    <div key={minuteKey} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">
                            {t('forecast.predictionsForMinute', { minute: minuteKey })}
                        </h3>
                        <div className="space-y-2">
                            {groupedForecast[minuteKey].map((item) => (
                                <ForecastItem 
                                    key={item.round}
                                    item={item}
                                    isEditing={editingRound === item.round}
                                    onStartEdit={onStartEdit}
                                    onCancelEdit={onCancelEdit}
                                    onApplyEdit={onApplyEdit}
                                />
                            ))}
                        </div>
                        {isAiLoading ? (
                            <InsightLoader />
                        ) : insights[minuteKey] ? (
                            <div className="mt-2 pt-2 border-t border-gray-700/50">
                                <h4 className="text-xs font-bold text-purple-400 mb-1">
                                    {insightSource === 'ai' ? t('gemini.title') : t('localAnalysis.title')}
                                </h4>
                                <FormattedInsight text={insights[minuteKey]} />
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <Card.Title>{t('forecast.title')}</Card.Title>
            <Card.Body>
                {renderContent()}
            </Card.Body>
        </Card>
    );
};