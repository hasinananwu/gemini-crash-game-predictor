
import React from 'react';
import type { Trend } from '../types';
import { Card } from './ui/Card';
import { MULTIPLIER_COLORS, getMultiplierCategory } from '../constants';
import { useTranslations } from '../hooks/useTranslations';

interface AnalysisPanelProps {
    trends: {
        hourlyTrends: Record<string, Trend>;
        quarterHourTrends: Record<string, Trend>;
        fiveMinTrends: Record<string, Trend>;
        minuteTrends: Record<string, Trend>;
    };
}

const TrendItem = ({ title, trend }: { title: string; trend?: Trend }) => {
    const { t } = useTranslations();

    if (!trend || (trend.low_count === 0 && trend.med_count === 0 && trend.high_count === 0)) {
        return null; // Don't show empty trends
    }

    const total = trend.low_count + trend.med_count + trend.high_count;
    const low_pct = (trend.low_count / total) * 100;
    const med_pct = (trend.med_count / total) * 100;
    const high_pct = (trend.high_count / total) * 100;
    
    return (
        <div>
            <h4 className="font-semibold text-cyan-400">{title}</h4>
            <div className="text-xs text-gray-400">
                <p>{t('analysis.phase')}: <span className="font-bold text-purple-400">{trend.phase}</span> | {t('analysis.total')}: {total}</p>
                <div className="flex w-full h-2 bg-gray-700 rounded-full my-1 overflow-hidden">
                    <div className="bg-red-500" style={{ width: `${low_pct}%` }}></div>
                    <div className="bg-green-500" style={{ width: `${med_pct}%` }}></div>
                    <div className="bg-blue-500" style={{ width: `${high_pct}%` }}></div>
                </div>
                <div className="flex justify-between">
                    <span>{low_pct.toFixed(0)}% {t('analysis.low')}</span>
                    <span>{med_pct.toFixed(0)}% {t('analysis.med')}</span>
                    <span>{high_pct.toFixed(0)}% {t('analysis.high')}</span>
                </div>
                 {trend.last_multipliers.size > 0 && (
                     <div className="mt-1 flex flex-wrap gap-1 items-center">
                        <span className="text-gray-500">{t('analysis.last')}:</span>
                        {Array.from(trend.last_multipliers).slice(-5).map((m, i) => {
                            const category = getMultiplierCategory(m);
                            const { ball } = MULTIPLIER_COLORS[category];
                            return <span key={i} title={`${m.toFixed(2)}x`}>{ball}</span>;
                        })}
                     </div>
                 )}
            </div>
        </div>
    );
};


export const AnalysisPanel = ({ trends }: AnalysisPanelProps) => {
    const { t } = useTranslations();
    const latestHourKey = Object.keys(trends.hourlyTrends).sort().pop();
    const latestQuarterKey = Object.keys(trends.quarterHourTrends).sort().pop();
    const latestFiveMinKey = Object.keys(trends.fiveMinTrends).sort().pop();
    const latestMinuteKey = Object.keys(trends.minuteTrends).sort().pop();

    return (
        <Card>
            <Card.Title>{t('analysis.title')}</Card.Title>
            <Card.Body>
                <div className="space-y-4">
                   <TrendItem title={t('analysis.currentMinute')} trend={latestMinuteKey ? trends.minuteTrends[latestMinuteKey] : undefined} />
                   <TrendItem title={t('analysis.current5Mins')} trend={latestFiveMinKey ? trends.fiveMinTrends[latestFiveMinKey] : undefined} />
                   <TrendItem title={t('analysis.currentQuarter')} trend={latestQuarterKey ? trends.quarterHourTrends[latestQuarterKey] : undefined} />
                   <TrendItem title={t('analysis.currentHour')} trend={latestHourKey ? trends.hourlyTrends[latestHourKey] : undefined} />
                </div>
            </Card.Body>
        </Card>
    );
};
