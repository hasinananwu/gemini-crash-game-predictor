
export const en = {
  app: {
    title: '🚀 Gemini Crash Predictor',
    showGuide: 'Guide',
    hideGuide: 'Hide',
    openSettings: 'Open settings',
    aiAnalysis: 'AI Analysis',
    geminiError: 'Could not retrieve AI insight. The API key may be invalid or the service may be down.',
    geminiRateLimitError: 'API rate limit exceeded. Please wait 60 seconds before retrying.',
    footer: 'This tool is for educational purposes and can be run standalone or as a Telegram Mini App. Predictions are not guaranteed.',
  },
  controls: {
    title: 'Controls',
    sessionStart: 'Session Start Time (HH:MM:SS)',
    set: 'Set',
    generate: 'Generate New Forecast',
    useRealTime: 'Generate from current real time',
    history: 'History',
    downloadCsv: 'Download Session CSV',
    loadCsv: 'Load Session CSV',
  },
  feedback: {
    title: 'Apply Real Result & Get Next Forecast',
    multiplierLabel: 'Real Multiplier',
    multiplierPlaceholder: 'e.g., 1.23',
    crashTimeLabel: 'Crash Time (HH:MM:SS)',
    submitButton: 'Apply & Predict Next',
    error: {
      multiplier: 'Please enter a valid multiplier (e.g., 1.23).',
      crashTime: 'Please enter the crash time.',
      crashTimeInvalid: 'Crash time must be after start time ({startTime}).',
    }
  },
  forecast: {
    title: '5-Minute Forecast',
    generating: 'Generating next forecast...',
    predictionsForMinute: 'Predictions for Minute: {minute}',
    setApiKeyPrompt: 'To use AI Analysis, please set your Gemini API key in the settings panel.',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
  },
  analysis: {
    title: 'Trend Analysis',
    phase: 'Phase',
    total: 'Total',
    low: 'Low',
    med: 'Med',
    high: 'High',
    last: 'Last',
    currentMinute: 'Current Minute',
    current5Mins: 'Current 5 Mins',
    currentQuarter: 'Current Quarter',
    currentHour: 'Current Hour',
  },
  localAnalysis: {
    title: 'Rule-Based Strategy',
    default: 'A mix of outcomes is possible. Bet with caution.',
    low_many: 'Many low values suggest betting **Low (< 2.00x)**.',
    low_range: 'Consider an interval bet around **{min}x - {max}x**.',
    medium_high: 'Suggests betting **High (>= 2.00x)**.',
    medium_range: 'A reasonable interval is **2.00x - 3.00x**.',
    medium_timed: 'This pattern is often stronger in the first/last 10 seconds of a minute.',
    good_range: 'A good target interval is **3.00x - 4.00x**.',
    high_target: 'Good potential for a **High Target** bet.',
    high_safety: 'For safety, consider cashing out around **3.00x**.'
  },
  gemini: {
    title: 'Gemini AI Insight',
    loading: 'Analyzing...',
    apiError: 'Failed to get analysis from Gemini. Please check your API key and network connection.',
    systemInstruction: `You are an expert analyst for a 'Crash' style betting game. Your task is to provide clear, minute-by-minute strategic advice based on a 5-minute forecast.

Players have three main ways to bet:
1.  **{strat1}:** {strat1Desc}
2.  **{strat2}:** {strat2Desc}
3.  **{strat3}:** {strat3Desc}

Analyze the provided forecast data. Your response MUST be a valid JSON object.
The keys of the JSON object must be the minute strings from the forecast (e.g., "14:35").
The value for each key must be a string containing your strategic analysis for that minute.
The analysis string should recommend the single best strategy and provide a concise, one-sentence justification. Use markdown for formatting, like **Strategy:**.

Do not add any text outside of the JSON object.`,
    strat1: 'Low/High',
    strat1Desc: 'Bet on whether the result will be LESS than 2.00x (Low) or GREATER than or EQUAL to 2.00x (High).',
    strat2: 'Interval',
    strat2Desc: 'Bet on the result falling within a specific range (e.g., between 1.40x and 1.90x).',
    strat3: 'Target',
    strat3Desc: 'Aim for a specific high multiplier, hoping for a large payout.',
    promptHeader: `Analyze the following forecast data, which is provided as a JSON object where keys are minutes and values are arrays of predicted multipliers. Return a JSON object with your minute-by-minute strategic analysis.

Forecast Data: {forecastData}`,
  },
  guide: {
    title: '📚 Phases & Cycles Guide',
    close: 'Close',
    qualityPhases: {
      title: 'Quality Phases',
      good: { title: '🟢 GOOD', desc: 'High probability of multipliers 2.00x-9.99x. Favorable for gains.' },
      normal: { title: '🟣 NORMAL', desc: 'Balanced distribution of multipliers. Neutral phase, requires caution.' },
      bad: { title: '🟠 BAD', desc: 'High probability of multipliers < 2.00x. Unfavorable, quick withdrawal advised.' },
      catastrophic: { title: '🔴 CATASTROPHIC', desc: 'Very high probability of multipliers < 2.00x. Avoid betting or withdraw immediately.' },
    },
    multiplierTiers: {
      title: 'Multiplier Tiers',
      catastrophic: 'Catastrophic',
      bad: 'Bad',
      normal: 'Normal',
      good: 'Good',
      excellent: 'Excellent',
      insane: 'Insane',
    },
    temporalCycles: {
      title: 'Temporal Cycles',
      hourly: { title: 'Hourly:', desc: 'Peak hours (e.g., 9, 14, 20) are generally more favorable. Off-peak hours can be more volatile.' },
      quarterly: { title: 'Quarterly:', desc: 'The first 15 minutes of an hour tend to be better than the last 15 minutes.' },
      fiveMin: { title: '5-Min Blocks:', desc: 'The simulation follows subtle patterns within 5-minute intervals.' },
    },
    specialMinutes: {
      title: 'Special Minutes',
      nineOne: { title: 'Ending in 9 or 1:', desc: 'Often volatile and unfavorable, especially in the first 30 seconds.' },
      seven: { title: 'Multiples of 7:', desc: "Considered 'catastrophic' and very high risk." },
      fiveThree: { title: 'Multiples of 5 or 3:', desc: "Tend to be 'bad' or 'normal-to-bad', indicating higher risk." },
    },
  },
  settings: {
    title: 'Simulation Settings',
    apiKey: {
        title: 'API Key Management',
        label: 'Gemini API Key',
        placeholder: 'Enter your API key here',
        saveButton: 'Save Key',
        saving: 'Saving...',
        unsupported: 'Your Telegram version does not support cloud storage. The API key will be saved on this device only.',
    },
    crashTime: {
      title: 'Crash Time Generation (seconds)',
      low: 'Low Multiplier Max Duration (< 2x)',
      med: 'Medium Multiplier Max Duration (2x-10x)',
      high: 'High Multiplier Max Duration (> 10x)',
    },
    flow: {
      title: 'Simulation Flow',
      pause: 'Pause Between Rounds (seconds)',
    }
  }
};