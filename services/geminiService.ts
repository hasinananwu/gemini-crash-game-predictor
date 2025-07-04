
import type { Forecast, Language } from '../types';

// Custom error for rate limiting
export class RateLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RateLimitError';
    }
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

const parseJsonFromText = (text: string): Record<string, string> => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Raw text:", text);
        throw new Error("Invalid JSON response from AI");
    }
};

export const getAIForecastAnalysis = async (
    forecast: Forecast[],
    t: (key: string, params?: Record<string, string | number>) => string,
    language: Language,
    apiKey: string
): Promise<Record<string, string>> => {
    if (!apiKey) {
        throw new Error("A valid Gemini API key must be provided.");
    }

    // Dynamically import the library only when the function is called.
    const { GoogleGenAI } = await import('@google/genai');

    const ai = new GoogleGenAI({ apiKey });
    const groupedForecast = groupForecastByMinute(forecast);
    
    // Correctly format predictions as an array of numbers
    const formattedForecast = Object.entries(groupedForecast).map(([minute, items]) => {
        const predictions = items.map(f => f.multiplier.toFixed(2)).join(', ');
        return `"${minute}": [${predictions}]`;
    }).join(',\n');

    const systemInstruction = t('gemini.systemInstruction', {
        strat1: t('gemini.strat1'),
        strat2: t('gemini.strat2'),
        strat3: t('gemini.strat3'),
        strat1Desc: t('gemini.strat1Desc'),
        strat2Desc: t('gemini.strat2Desc'),
        strat3Desc: t('gemini.strat3Desc'),
    });
    
    const prompt = t('gemini.promptHeader', { forecastData: `{${formattedForecast}}` });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4,
                responseMimeType: "application/json",
            }
        });
        return parseJsonFromText(response.text);
    } catch (error: any) {
        console.error("Gemini API call failed:", error);
        // Check for rate limit error in the response from the fetch call
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
             throw new RateLimitError("API rate limit exceeded.");
        }
        // Check for specific error structure from GoogleGenAI library
        if (error.cause?.error?.status === 'RESOURCE_EXHAUSTED') {
            throw new RateLimitError("API rate limit exceeded.");
        }
        throw error;
    }
};
