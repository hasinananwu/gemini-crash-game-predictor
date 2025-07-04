
export const mg = {
  app: {
    title: '🚀 Mpanombatombana Crash Gemini',
    showGuide: 'Torolàlana',
    hideGuide: 'Hidio',
    openSettings: 'Sokafy ny paramètre',
    aiAnalysis: 'Famakafakana AI',
    geminiError: "Tsy afaka nalaina ny famakafakana avy amin'ny AI. Mety ho diso ny lakilen'ny API na tsy mandeha ny serivisy.",
    geminiRateLimitError: "Tonga ny fetran'ny API. Miandrasa 60 segondra azafady vao manandrana indray.",
    footer: "Ity fitaovana ity dia ho an'ny fanabeazana ary azo ampiasaina mitokana na ho Telegram Mini App. Tsy misy antoka ny vinavina.",
  },
  controls: {
    title: 'Fitaovam-pitantanana',
    sessionStart: 'Ora fanombohan’ny session (HH:MM:SS)',
    set: 'Ampiharo',
    generate: 'Hamoaka vinavina vaovao',
    useRealTime: "Hamoaka avy amin'ny ora tena misy ankehitriny",
    history: 'Tantara',
    downloadCsv: 'Alaivo ny CSV an’ny session',
    loadCsv: 'Ampidiro CSV an’ny session',
  },
  feedback: {
    title: 'Ampiharo ny Vokatra Tena Izy & Mahazoa Vinavina Manaraka',
    multiplierLabel: 'Mpampitombo Tena Izy',
    multiplierPlaceholder: 'ohatra, 1.23',
    crashTimeLabel: 'Ora Nijanonana (HH:MM:SS)',
    submitButton: 'Ampiharo & Vinanio Manaraka',
    error: {
      multiplier: 'Mampidira mpampitombo manan-kery azafady (ohatra, 1.23).',
      crashTime: 'Mampidira ny ora nijanonana azafady.',
      crashTimeInvalid: 'Ny ora ijanonana dia tsy maintsy aorian’ny ora fanombohana ({startTime}).',
    }
  },
  forecast: {
    title: 'Vinavina ao anatin’ny 5 minitra',
    generating: 'Eo am-pamoahana ny vinavina manaraka...',
    predictionsForMinute: 'Vinavina ho an’ny minitra: {minute}',
    setApiKeyPrompt: "Mba hampiasana ny Famakafakana AI, ampidiro ao amin'ny paramètre ny lakilen'ny API Gemini anao.",
    edit: 'Hanova',
    save: 'Tehirizo',
    cancel: 'Foano',
  },
  analysis: {
    title: 'Famakafakana ny fironana',
    phase: 'Dingana',
    total: 'Totaly',
    low: 'Ambany',
    med: 'Antony',
    high: 'Ambony',
    last: 'Farany',
    currentMinute: 'Minitra ankehitriny',
    current5Mins: '5 min ankehitriny',
    currentQuarter: 'Telovolana ankehitriny',
    currentHour: 'Ora ankehitriny',
  },
  localAnalysis: {
    title: 'Paikady Mifototra amin\'ny Fitsipika',
    default: 'Mety hisy vokatra isan-karazany. Mitandrema rehefa miloka.',
    low_many: 'Ny sandany ambany maro dia manoro hevitra ny hiloka **Ambany (< 2.00x)**.',
    low_range: 'Diniho ny filokana amin\'ny elanelana manodidina ny **{min}x - {max}x**.',
    medium_high: 'Manoro hevitra ny hiloka **Ambony (>= 2.00x)**.',
    medium_range: 'Ny elanelana mety dia **2.00x - 3.00x**.',
    medium_timed: 'Matetika ity lamina ity dia matanjaka kokoa ao anatin\'ny 10 segondra voalohany/farany amin\'ny minitra iray.',
    good_range: 'Ny elanelana kendrena tsara dia **3.00x - 4.00x**.',
    high_target: 'Misy tsara ny mety hisian\'ny filokana amin\'ny **Tanjona Avo**.',
    high_safety: 'Mba ho fiarovana, diniho ny maka ny vola manodidina ny **3.00x**.'
  },
  gemini: {
    title: 'Famakafakana Gemini AI',
    loading: 'Eo am-pamakafakana...',
    apiError: "Tsy nahomby ny fakana famakafakana avy amin'i Gemini. Hamarino ny lakilen'ny API sy ny fifandraisanao.",
    systemInstruction: `Ianao dia mpandalina manam-pahaizana manokana amin'ny lalao filokana 'Crash'. Ny andraikitrao dia ny manome torohevitra stratejika mazava isan-minitra mifototra amin'ny vinavina 5 minitra.

Ny mpilalao dia manana fomba telo lehibe hilokana:
1. **{strat1}:** {strat1Desc}
2. **{strat2}:** {strat2Desc}
3. **{strat3}:** {strat3Desc}

Fakafakao ny angona vinavina nomena. Ny valinteninao dia TSY MAINTSY ho objet JSON manan-kery.
Ny lakilen'ny objet JSON dia tsy maintsy ny tadin'ny minitra avy amin'ny vinavina (ohatra, "14:35").
Ny sanda ho an'ny lakile tsirairay dia tsy maintsy tady misy ny famakafakana stratejika ho an'io minitra io.
Ny tadin'ny famakafakana dia tokony hanoro ny paikady tokana tsara indrindra ary hanome fanamarinana fohy sy fehezanteny iray. Ampiasao ny markdown amin'ny famolavolana, toy ny **Paikady:**.

Aza asiana lahatsoratra ivelan'ny objet JSON.`,
    strat1: 'Ambany/Ambony',
    strat1Desc: 'Miloka raha ho latsaky ny 2.00x (Ambany) na mihoatra na mitovy amin’ny 2.00x (Ambony) ny vokatra.',
    strat2: 'Elanelana',
    strat2Desc: 'Miloka amin’ny vokatra ao anatin’ny elanelana iray (ohatra, eo anelanelan’ny 1.40x sy 1.90x).',
    strat3: 'Tanjona',
    strat3Desc: 'Mikendry mpampitombo avo lenta manokana, manantena tombony lehibe.',
    promptHeader: `Fakafakao ny angona vinavina manaraka, izay omena amin'ny endrika objet JSON izay misy ny lakile minitra sy ny sanda dia ny lisitry ny mpampitombo voavinavina. Avereno objet JSON miaraka amin'ny famakafakanao stratejika isan-minitra.

Angona vinavina: {forecastData}`,
  },
  guide: {
    title: '📚 Torolàlana momba ny Dingana & tsingerina',
    close: 'Akatony',
    qualityPhases: {
      title: 'Dingam-pahombiazana',
      good: { title: '🟢 TSARA', desc: 'Avo ny mety hisian’ny mpampitombo 2.00x-9.99x. Tsara ho an’ny tombony.' },
      normal: { title: '🟣 ANTONY', desc: 'Fitsinjarana voalanjalanja. Dingana tsy miandany, mitaky fitandremana.' },
      bad: { title: '🟠 RATSY', desc: 'Avo ny mety hisian’ny mpampitombo < 2.00x. Tsy tsara, ilaina ny misintona haingana.' },
      catastrophic: { title: '🔴 LOZA', desc: 'Avo be ny mety hisian’ny mpampitombo < 2.00x. Halaviro ny miloka na misintona avy hatrany.' },
    },
    multiplierTiers: {
      title: 'Ambaratongan’ny Mpampitombo',
      catastrophic: 'Loza',
      bad: 'Ratsy',
      normal: 'Antony',
      good: 'Tsara',
      excellent: 'Tena tsara',
      insane: 'Adala',
    },
    temporalCycles: {
      title: 'Tsingerina ara-potoana',
      hourly: { title: 'Isan’ora:', desc: 'Ny ora be olona (ohatra, 9, 14, 20) dia matetika no tsara kokoa. Mety hiovaova kokoa ny ora vitsy olona.' },
      quarterly: { title: 'Isaky ny telovolana:', desc: 'Ny 15 minitra voalohany amin’ny ora iray dia mazàna tsara kokoa noho ny 15 minitra farany.' },
      fiveMin: { title: 'Vondrona 5-min:', desc: 'Manaraka lamina an-kolaka ao anatin’ny elanelam-potoana 5 minitra ny simulation.' },
    },
    specialMinutes: {
      title: 'Minitra Manokana',
      nineOne: { title: 'Mifarana amin’ny 9 na 1:', desc: 'Matetika miovaova sy tsy tsara, indrindra ao anatin’ny 30 segondra voalohany.' },
      seven: { title: 'Tontakely ny 7:', desc: "Noheverina ho 'loza' ary tena mampidi-doza." },
      fiveThree: { title: 'Tontakely ny 5 na 3:', desc: "Mirona ho 'ratsy' na 'antony mankany amin’ny ratsy', izay manondro risika ambony kokoa." },
    },
  },
  settings: {
    title: 'Fikirana momba ny Simulation',
    apiKey: {
        title: 'Fitantanana ny lakile API',
        label: 'Lakile API Gemini',
        placeholder: 'Ampidiro eto ny lakile API anao',
        saveButton: 'Tehirizo ny lakile',
        saving: 'Eo am-pitehirizana...',
        unsupported: 'Ny versiona Telegram anao tsy mahazaka fitehirizana an-drahona. Ny lakilen\'ny API dia ho voatahiry eto amin\'ity fitaovana ity ihany.',
    },
    crashTime: {
      title: 'Famoronana ora ijanonana (segondra)',
      low: 'Faharetana max mpampitombo ambany (< 2x)',
      med: 'Faharetana max mpampitombo antony (2x-10x)',
      high: 'Faharetana max mpampitombo ambony (> 10x)',
    },
    flow: {
      title: 'Fandehan’ny Simulation',
      pause: 'Fiatoana isaky ny fihodinana (segondra)',
    }
  }
};