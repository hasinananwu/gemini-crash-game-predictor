
import type { Forecast } from '../types';

const getAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export const generateLocalInsightForMinute = (
    minuteForecast: Forecast[],
    t: (key: string, params?: Record<string, string | number>) => string
): string => {
    if (!minuteForecast || minuteForecast.length === 0) {
        return '';
    }

    const multipliers = minuteForecast.map(f => f.multiplier);
    const lowCount = multipliers.filter(m => m < 2.0).length;
    const avgMultiplier = getAverage(multipliers);
    let insightParts: string[] = [];

    // Rule 1: Many low multipliers
    if (lowCount / multipliers.length >= 0.5) {
        insightParts.push(t('localAnalysis.low_many'));
        const lowAvg = getAverage(multipliers.filter(m => m < 2.0));
        if (lowAvg > 0) {
            const min = Math.max(1.0, lowAvg - 0.2).toFixed(2);
            const max = (lowAvg + 0.2).toFixed(2);
            insightParts.push(t('localAnalysis.low_range', { min, max }));
        }
    }
    // Rule 2: 2.x multipliers
    else if (avgMultiplier >= 2.0 && avgMultiplier < 3.0) {
        insightParts.push(t('localAnalysis.medium_high'));
        insightParts.push(t('localAnalysis.medium_range'));
        
        const firstItemSeconds = minuteForecast[0].startTime.getSeconds();
        if ((firstItemSeconds >= 46 && firstItemSeconds <= 50) || (firstItemSeconds >= 4 && firstItemSeconds <= 6)) {
            insightParts.push(t('localAnalysis.medium_timed'));
        }
    }
    // Rule 3: 3.x multipliers
    else if (avgMultiplier >= 3.0 && avgMultiplier < 4.0) {
        insightParts.push(t('localAnalysis.good_range'));
    }
    // Rule 4: >= 4.x multipliers
    else if (avgMultiplier >= 4.0) {
        insightParts.push(t('localAnalysis.high_target'));
        insightParts.push(t('localAnalysis.high_safety'));
    }

    // Default catch-all
    if (insightParts.length === 0) {
        insightParts.push(t('localAnalysis.default'));
    }
    
    return insightParts.join(' ');
};
