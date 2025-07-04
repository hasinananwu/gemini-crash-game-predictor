import type { Deque } from '@blakeembrey/deque';

export type Quality = 'good' | 'normal' | 'bad' | 'catastrophic';

export type Language = 'en' | 'fr' | 'mg';

export interface Trend {
    low_count: number;
    med_count: number;
    high_count: number;
    last_multipliers: Deque<number>;
    phase: Quality;
    compensation_mode: boolean;
    compensation_target: number;
    compensation_count: number;
}

export interface Forecast {
    round: number;
    startTime: Date;
    crashTime: Date;
    multiplier: number;
}

export interface CrashTimeGenerationConfig {
    low_mult_max_seconds: number;
    med_mult_max_seconds: number;
    high_mult_max_seconds: number;
}

export interface Config {
    simulation: {
        pause_between_rounds_seconds: number;
        forecast_duration_minutes: number;
    };
    crash_time_generation: CrashTimeGenerationConfig;
    quality_rules: any; // Simplified for brevity, can be fully typed
    multiplier_generation: any;
    compensation: any;
    output: {
        csv_filename: string;
    };
}

export interface SimulatorState {
    currentTime: Date;
    hourlyTrends: Record<string, Trend>;
    quarterHourTrends: Record<string, Trend>;
    fiveMinTrends: Record<string, Trend>;
    minuteTrends: Record<string, Trend>;
    forecast: Forecast[];
    historyLog: any[];
    config: Config;
}

// New type for deep partial updates
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
