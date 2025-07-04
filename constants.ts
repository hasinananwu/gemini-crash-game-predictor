
import type { Config } from './types';

export const CONFIG: Config = {
    simulation: {
        pause_between_rounds_seconds: 10,
        forecast_duration_minutes: 5,
    },
    crash_time_generation: {
        low_mult_max_seconds: 5,
        med_mult_max_seconds: 20,
        high_mult_max_seconds: 120,
    },
    quality_rules: {
        hour: {
            peak: { hours: [9, 10, 14, 15, 20, 21], weights: [0.4, 0.4, 0.2] }, // good, normal, bad
            medium: { hours: [11, 12, 13, 16, 17, 18, 19], weights: [0.3, 0.5, 0.2] }, // good, normal, bad
            off_peak: { weights: [0.2, 0.4, 0.3, 0.1] }, // good, normal, bad, catastrophic
        },
        quarter: {
            first: { weights: [0.6, 0.4] }, // good, normal
            last: { weights: [0.4, 0.4, 0.2] }, // normal, bad, catastrophic
            middle: { weights: [0.3, 0.5, 0.2] }, // good, normal, bad
        },
        five_min: {
            even: { weights: [0.6, 0.4] }, // good, normal
            odd: { weights: [0.4, 0.4, 0.2] }, // normal, bad, catastrophic
        },
        minute: {
            special_9_early: "catastrophic",
            special_9_late: { weights: [0.3, 0.7] }, // bad, catastrophic
            special_1_early: { weights: [0.4, 0.6] }, // bad, catastrophic
            special_1_late: { weights: [0.6, 0.4] }, // normal, bad
            multiple_of_7: "catastrophic",
            multiple_of_5: { weights: [0.6, 0.4] }, // bad, catastrophic
            multiple_of_3: { weights: [0.6, 0.4] }, // normal, bad
            default: { weights: [0.5, 0.5] }, // good, normal
        }
    },
    multiplier_generation: {
        special_minute_low_chance: 0.95,
        good_phase_high_mult_chance: 0.7,
        bad_phase_low_mult_chance: 0.7,
        catastrophic_phase_low_mult_chance: 0.9,
    },
    compensation: {
        history_length: 5,
        trigger_threshold: 4,
        min_low_mults: 2,
        max_low_mults: 4,
    },
    output: {
        csv_filename: "interactive_session_log.csv"
    }
};

export const MULTIPLIER_COLORS: { [key: string]: { text: string, bg: string, ball: string } } = {
    catastrophic: { text: 'text-red-400', bg: 'bg-red-900/50', ball: '🔴' }, // < 1.51
    bad: { text: 'text-orange-400', bg: 'bg-orange-900/50', ball: '🟠' }, // 1.51 - 1.99
    normal: { text: 'text-green-400', bg: 'bg-green-900/50', ball: '🟢' }, // 2.00 - 2.99
    good: { text: 'text-blue-400', bg: 'bg-blue-900/50', ball: '🔵' }, // 3.00 - 3.99
    excellent: { text: 'text-purple-400', bg: 'bg-purple-900/50', ball: '🟣' }, // 4.00 - 9.99
    insane: { text: 'text-cyan-400', bg: 'bg-cyan-900/50', ball: '💎' }, // >= 10.00
};

export const getMultiplierCategory = (multiplier: number): string => {
    if (multiplier < 1.51) return 'catastrophic';
    if (multiplier < 2.00) return 'bad';
    if (multiplier < 3.00) return 'normal';
    if (multiplier < 4.00) return 'good';
    if (multiplier < 10.00) return 'excellent';
    return 'insane';
};
