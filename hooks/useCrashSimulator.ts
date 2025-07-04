

import { useState, useCallback } from 'react';
import { Deque } from '@blakeembrey/deque';
import { CONFIG } from '../constants';
import { 
    getTimeIntervals,
    initializeTrend,
    determineIntervalQuality,
    generateCrashTime,
    getAdaptedQualityMultiplier
} from '../services/simulationService';
import type { SimulatorState, Trend, Forecast, Config, DeepPartial } from '../types';

const INITIAL_STATE: SimulatorState = {
    currentTime: new Date(),
    hourlyTrends: {},
    quarterHourTrends: {},
    fiveMinTrends: {},
    minuteTrends: {},
    forecast: [],
    historyLog: [],
    config: CONFIG,
};

// Simple deep merge utility to update nested config objects
const mergeDeep = <T extends object>(target: T, source: DeepPartial<T>): T => {
    const output = { ...target };
    if (target && typeof target === 'object' && source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
            const sourceKey = key as keyof DeepPartial<T>;
            const targetValue = target[key as keyof T];
            const sourceValue = source[sourceKey];
            if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object') {
                output[key as keyof T] = mergeDeep(targetValue as object, sourceValue as object) as T[keyof T];
            } else if(sourceValue !== undefined) {
                (output as any)[key] = sourceValue;
            }
        });
    }
    return output;
};

// A pure function to calculate the next trend state immutably.
const calculateUpdatedTrends = (multiplier: number, time: Date, currentState: SimulatorState): Partial<SimulatorState> => {
    const intervals = getTimeIntervals(time);
    const config = currentState.config;

    // Create shallow copies of trend states to ensure immutability
    const nextHourlyTrends = { ...currentState.hourlyTrends };
    const nextQuarterHourTrends = { ...currentState.quarterHourTrends };
    const nextFiveMinTrends = { ...currentState.fiveMinTrends };
    const nextMinuteTrends = { ...currentState.minuteTrends };

    const trendMaps = [
        { trends: nextHourlyTrends, key: intervals.hour, type: 'hour' as const },
        { trends: nextQuarterHourTrends, key: intervals.quarter, type: 'quarter' as const },
        { trends: nextFiveMinTrends, key: intervals.five_min, type: 'five_min' as const },
        { trends: nextMinuteTrends, key: intervals.minute, type: 'minute' as const },
    ];

    for (const { trends, key, type } of trendMaps) {
        const originalTrend = trends[key] || initializeTrend();
        
        // If it's a new trend, determine its initial quality phase.
        const phase = trends[key] ? originalTrend.phase : determineIntervalQuality(type, time, config);

        const multipliersAsArray = Array.from(originalTrend.last_multipliers);
        multipliersAsArray.push(multiplier);
        if (multipliersAsArray.length > config.compensation.history_length) {
            multipliersAsArray.shift();
        }
        const newLastMultipliers = new Deque(multipliersAsArray);

        trends[key] = {
            ...originalTrend,
            phase,
            low_count: originalTrend.low_count + (multiplier < 2.00 ? 1 : 0),
            med_count: originalTrend.med_count + (multiplier >= 2.00 && multiplier < 10.00 ? 1 : 0),
            high_count: originalTrend.high_count + (multiplier >= 10.00 ? 1 : 0),
            last_multipliers: newLastMultipliers,
        };
    }

    return {
        hourlyTrends: nextHourlyTrends,
        quarterHourTrends: nextQuarterHourTrends,
        fiveMinTrends: nextFiveMinTrends,
        minuteTrends: nextMinuteTrends,
    };
};

// This helper is pure and doesn't depend on hook state, so it can live outside.
const generateMultiplier = (time: Date, currentState: SimulatorState): number => {
    const intervals = getTimeIntervals(time);
    const { minuteTrends, config } = currentState;

    // Find the relevant trend for the minute. If forecasting for the future,
    // this trend may not exist in the historical data yet.
    let minuteTrend = minuteTrends[intervals.minute];
    
    if (!minuteTrend) {
        // If the trend doesn't exist for this future minute, we create a temporary one
        // to determine its quality for prediction. This is NOT saved to the main state.
        minuteTrend = initializeTrend();
        minuteTrend.phase = determineIntervalQuality('minute', time, config);
    }
    
    const minuteQuality = minuteTrend.phase;
    
    return getAdaptedQualityMultiplier(minuteQuality, time, minuteTrend, config);
};


export const useCrashSimulator = () => {
    const [state, setState] = useState<SimulatorState>(INITIAL_STATE);

    const generateForecast = useCallback((startTime?: Date) => {
        setState(currentState => {
            // If a new start time is provided, we update the simulator's current time.
            // Otherwise, we use the existing time.
            const newCurrentTime = startTime || currentState.currentTime;
            
            // The state used for the generation process itself.
            const generationState = { ...currentState, currentTime: newCurrentTime };

            const forecast: Forecast[] = [];
            let tempTime = new Date(generationState.currentTime);
            const forecast_end_time = new Date(tempTime.getTime() + generationState.config.simulation.forecast_duration_minutes * 60000);
            let roundNumber = 1;

            while (tempTime < forecast_end_time) {
                const multiplier = generateMultiplier(tempTime, generationState);
                const crashTime = generateCrashTime(tempTime, multiplier, generationState.config);
                
                forecast.push({
                    round: roundNumber,
                    startTime: new Date(tempTime),
                    crashTime: new Date(crashTime),
                    multiplier,
                });

                tempTime = new Date(crashTime.getTime() + generationState.config.simulation.pause_between_rounds_seconds * 1000);
                roundNumber += 1;
            }

            // Return the updated state, including the new current time and forecast.
            return { ...currentState, currentTime: newCurrentTime, forecast };
        });
    }, []);
    
    const applyRealResult = useCallback((realMultiplier: number, realCrashTime: Date, eventStartTime: Date) => {
        setState(prevState => {
            const newTrends = calculateUpdatedTrends(realMultiplier, eventStartTime, prevState);

            const newHistoryLog = [...prevState.historyLog, {
                timestamp: eventStartTime.toISOString(),
                event_type: "real_result",
                multiplier: realMultiplier,
                comment: `Crash at ${realCrashTime.toISOString()}`
            }];
            
            const nextTime = new Date(realCrashTime.getTime() + prevState.config.simulation.pause_between_rounds_seconds * 1000);

            return {
                ...prevState,
                currentTime: nextTime,
                ...newTrends,
                historyLog: newHistoryLog,
                forecast: [], // Clear forecast to trigger regeneration in UI
            };
        });
    }, []);

    const resetSession = useCallback((newStartTime: Date) => {
        setState((prevState) => ({
            ...INITIAL_STATE,
            config: prevState.config, // Keep current config on reset
            currentTime: newStartTime,
            forecast: [], // Clear forecast
        }));
    }, []);

    const updateConfig = useCallback((newConfig: DeepPartial<Config>) => {
        setState(prevState => ({
            ...prevState,
            config: mergeDeep(prevState.config, newConfig),
        }));
    }, []);

    const updateForecastItem = useCallback((round: number, updatedValues: { startTime: Date, crashTime: Date, multiplier: number }) => {
        setState(prevState => {
            const newForecast = prevState.forecast.map(item => {
                if (item.round === round) {
                    return {
                        ...item,
                        ...updatedValues
                    };
                }
                return item;
            });
            return {
                ...prevState,
                forecast: newForecast,
            };
        });
    }, []);

    const loadHistory = useCallback((data: any[]) => {
        setState(prevState => {
            let tempState: SimulatorState = {
                ...INITIAL_STATE,
                config: prevState.config, // Keep current config
                historyLog: data,
            };
    
            const realResults = data.filter(row => row.event_type === 'real_result');
    
            for (const row of realResults) {
                const multiplier = parseFloat(row.multiplier);
                const timestamp = new Date(row.timestamp);
                if (!isNaN(multiplier) && !isNaN(timestamp.getTime())) {
                    const newTrends = calculateUpdatedTrends(multiplier, timestamp, tempState);
                    tempState = { ...tempState, ...newTrends };
                }
            }
            
            return {
                ...prevState,
                hourlyTrends: tempState.hourlyTrends,
                quarterHourTrends: tempState.quarterHourTrends,
                fiveMinTrends: tempState.fiveMinTrends,
                minuteTrends: tempState.minuteTrends,
                historyLog: data,
                forecast: [], // Clear forecast to trigger regeneration
            };
        });
    }, []);

    const getHistoryCsv = useCallback(() => {
        if (state.historyLog.length === 0) return;
        const header = Object.keys(state.historyLog[0]);
        const rows = state.historyLog.map(log => 
            header.map(fieldName => JSON.stringify(log[fieldName])).join(',')
        );
        const csvContent = [header.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", state.config.output.csv_filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [state.historyLog, state.config.output.csv_filename]);

    return {
        state,
        generateForecast,
        applyRealResult,
        resetSession,
        loadHistory,
        getHistoryCsv,
        updateConfig,
        updateForecastItem,
    };
};