
import { Deque } from '@blakeembrey/deque';
import type { Trend, Quality, Config } from '../types';

// Helper for weighted random choice
const weightedRandom = <T,>(items: T[], weights: number[]): T => {
    let i;
    let sum = 0;
    const r = Math.random();
    for (i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (r <= sum) return items[i];
    }
    return items[items.length - 1]; // Fallback
};

export const initializeTrend = (): Trend => ({
    low_count: 0,
    med_count: 0,
    high_count: 0,
    last_multipliers: new Deque<number>(),
    phase: 'normal',
    compensation_mode: false,
    compensation_target: 0,
    compensation_count: 0
});

export const getTimeIntervals = (time: Date) => ({
    hour: `${String(time.getHours()).padStart(2, '0')}:00-${String((time.getHours() + 1) % 24).padStart(2, '0')}:00`,
    quarter: `${String(time.getHours()).padStart(2, '0')}:${String(Math.floor(time.getMinutes() / 15) * 15).padStart(2, '0')}-${String(time.getHours()).padStart(2, '0')}:${String(Math.min(Math.floor(time.getMinutes() / 15) * 15 + 15, 60)).padStart(2, '0')}`,
    five_min: `${String(time.getHours()).padStart(2, '0')}:${String(Math.floor(time.getMinutes() / 5) * 5).padStart(2, '0')}-${String(time.getHours()).padStart(2, '0')}:${String(Math.min(Math.floor(time.getMinutes() / 5) * 5 + 5, 60)).padStart(2, '0')}`,
    minute: `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:00-${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:59`
});

export const determineIntervalQuality = (intervalType: 'hour' | 'quarter' | 'five_min' | 'minute', time: Date, config: Config): Quality => {
    const rules = config.quality_rules[intervalType];
    if (intervalType === 'hour') {
        const hour = time.getHours();
        if (rules.peak.hours.includes(hour)) return weightedRandom(['good', 'normal', 'bad'], rules.peak.weights);
        if (rules.medium.hours.includes(hour)) return weightedRandom(['good', 'normal', 'bad'], rules.medium.weights);
        return weightedRandom(['good', 'normal', 'bad', 'catastrophic'], rules.off_peak.weights);
    }
    if (intervalType === 'quarter') {
        const q = Math.floor(time.getMinutes() / 15);
        if (q === 0) return weightedRandom(['good', 'normal'], rules.first.weights);
        if (q === 3) return weightedRandom(['normal', 'bad', 'catastrophic'], rules.last.weights);
        return weightedRandom(['good', 'normal', 'bad'], rules.middle.weights);
    }
    if (intervalType === 'five_min') {
        const b = Math.floor(time.getMinutes() / 5);
        if (b % 2 === 0) return weightedRandom(['good', 'normal'], rules.even.weights);
        return weightedRandom(['normal', 'bad', 'catastrophic'], rules.odd.weights);
    }
    if (intervalType === 'minute') {
        const m = time.getMinutes();
        const s = time.getSeconds();
        if (m % 10 === 9) return s < 30 ? rules.special_9_early : weightedRandom(['bad', 'catastrophic'], rules.special_9_late.weights);
        if (m % 10 === 1) return s < 30 ? weightedRandom(['bad', 'catastrophic'], rules.special_1_early.weights) : weightedRandom(['normal', 'bad'], rules.special_1_late.weights);
        if (m % 7 === 0) return rules.multiple_of_7;
        if (m % 5 === 0) return weightedRandom(['bad', 'catastrophic'], rules.multiple_of_5.weights);
        if (m % 3 === 0) return weightedRandom(['normal', 'bad'], rules.multiple_of_3.weights);
        return weightedRandom(['good', 'normal'], rules.default.weights);
    }
    return 'normal';
};


export const getQualityMultiplier = (quality: Quality, time: Date, config: Config): number => {
    const gen_rules = config.multiplier_generation;
    const { minute, second } = { minute: time.getMinutes(), second: time.getSeconds() };

    if ((minute % 10 === 9 && second < 30) || (minute % 10 === 1 && second < 30)) {
        return Math.random() < gen_rules.special_minute_low_chance
            ? 1.00 + Math.random() * 0.99
            : 2.00 + Math.random() * 0.50;
    }
    switch (quality) {
        case 'good':
            return Math.random() < gen_rules.good_phase_high_mult_chance
                ? 2.00 + Math.random() * 7.99
                : 1.00 + Math.random() * 0.99;
        case 'normal':
            const rand = Math.random();
            if (rand < 0.5) return 1.00 + Math.random() * 0.99;
            if (rand < 0.8) return 2.00 + Math.random() * 1.00;
            return 3.01 + Math.random() * 6.98;
        case 'bad':
            return Math.random() < gen_rules.bad_phase_low_mult_chance
                ? 1.00 + Math.random() * 0.99
                : 2.00 + Math.random() * 2.00;
        case 'catastrophic':
            return Math.random() < gen_rules.catastrophic_phase_low_mult_chance
                ? 1.00 + Math.random() * 0.99
                : 2.00 + Math.random() * 1.00;
        default:
            return 1.00 + Math.random() * 0.99;
    }
};

export const getAdaptedQualityMultiplier = (quality: Quality, time: Date, trend: Trend, config: Config): number => {
    const baseProb = config.multiplier_generation.good_phase_high_mult_chance;
    let adjustedProb = baseProb;
    
    // Adjust based on recent history
    if (trend.low_count > trend.high_count * 2) {
        adjustedProb += 0.2; // Increase chance of high multipliers
    } else if (trend.high_count > trend.low_count * 2) {
        adjustedProb -= 0.2; // Increase chance of low multipliers
    }
    
    // Use the adjusted probability for 'good' quality phases
    if (quality === 'good') {
        const finalMultiplier = Math.random() < Math.max(0.1, Math.min(0.9, adjustedProb))
            ? 2.00 + Math.random() * 7.99
            : 1.00 + Math.random() * 0.99;
        return parseFloat(finalMultiplier.toFixed(2));
    }
    
    const finalMultiplier = getQualityMultiplier(quality, time, config);
    return parseFloat(finalMultiplier.toFixed(2));
};

export const generateCrashTime = (start: Date, multiplier: number, config: Config): Date => {
    const crash_rules = config.crash_time_generation;
    let max_seconds: number;
    if (multiplier < 2.00) max_seconds = crash_rules.low_mult_max_seconds;
    else if (multiplier < 10.00) max_seconds = crash_rules.med_mult_max_seconds;
    else max_seconds = crash_rules.high_mult_max_seconds;
    
    const delaySeconds = 1 + Math.random() * (max_seconds - 1);
    const crashTime = new Date(start.getTime() + delaySeconds * 1000);
    return crashTime;
};
