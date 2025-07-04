
export const fr = {
  app: {
    title: '🚀 Prédicteur de Crash Gemini',
    showGuide: 'Guide',
    hideGuide: 'Masquer',
    openSettings: 'Ouvrir les paramètres',
    aiAnalysis: 'Analyse IA',
    geminiError: "Impossible de récupérer l'analyse de l'IA. La clé API est peut-être invalide ou le service est indisponible.",
    geminiRateLimitError: "Limite de l'API atteinte. Veuillez patienter 60 secondes avant de réessayer.",
    footer: "Cet outil est à des fins éducatives et peut être utilisé de manière autonome ou comme une Mini App Telegram. Les prédictions ne sont pas garanties.",
  },
  controls: {
    title: 'Contrôles',
    sessionStart: 'Heure de début de session (HH:MM:SS)',
    set: 'Définir',
    generate: 'Générer une nouvelle prévision',
    useRealTime: "Générer à partir de l'heure réelle actuelle",
    history: 'Historique',
    downloadCsv: 'Télécharger le CSV de la session',
    loadCsv: 'Charger un CSV de session',
  },
  feedback: {
    title: 'Appliquer le Résultat Réel & Prédire la Suite',
    multiplierLabel: 'Multiplicateur Réel',
    multiplierPlaceholder: 'ex: 1.23',
    crashTimeLabel: 'Heure du Crash (HH:MM:SS)',
    submitButton: 'Appliquer & Prédire',
    error: {
      multiplier: 'Veuillez entrer un multiplicateur valide (ex: 1.23).',
      crashTime: "Veuillez entrer l'heure du crash.",
      crashTimeInvalid: "L'heure du crash doit être après l'heure de début ({startTime}).",
    }
  },
  forecast: {
    title: 'Prévisions sur 5 minutes',
    generating: 'Génération de la prochaine prévision...',
    predictionsForMinute: 'Prédictions pour la minute : {minute}',
    setApiKeyPrompt: "Pour utiliser l'Analyse IA, veuillez définir votre clé API Gemini dans les paramètres.",
    edit: 'Modifier',
    save: 'Sauvegarder',
    cancel: 'Annuler',
  },
  analysis: {
    title: 'Analyse des tendances',
    phase: 'Phase',
    total: 'Total',
    low: 'Bas',
    med: 'Moyen',
    high: 'Élevé',
    last: 'Derniers',
    currentMinute: 'Minute actuelle',
    current5Mins: '5 min actuelles',
    currentQuarter: 'Quart d’heure actuel',
    currentHour: 'Heure actuelle',
  },
  localAnalysis: {
    title: 'Stratégie Basée sur les Règles',
    default: 'Un mélange de résultats est possible. Pariez avec prudence.',
    low_many: 'De nombreuses valeurs basses suggèrent de parier sur **Bas (< 2.00x)**.',
    low_range: 'Envisagez un pari sur un intervalle autour de **{min}x - {max}x**.',
    medium_high: 'Suggère de parier sur **Haut (>= 2.00x)**.',
    medium_range: 'Un intervalle raisonnable est **2.00x - 3.00x**.',
    medium_timed: "Ce modèle est often plus fort dans les 10 premières/dernières secondes d'une minute.",
    good_range: 'Un bon intervalle cible est **3.00x - 4.00x**.',
    high_target: 'Bon potentiel pour un pari sur une **Cible Élevée**.',
    high_safety: "Pour plus de sécurité, envisagez d'encaisser vers **3.00x**."
  },
  gemini: {
    title: 'Analyse par IA Gemini',
    loading: 'Analyse en cours...',
    apiError: "Échec de l'obtention de l'analyse de Gemini. Veuillez vérifier votre clé API et votre connexion réseau.",
    systemInstruction: `Vous êtes un analyste expert pour un jeu de paris de type 'Crash'. Votre tâche est de fournir des conseils stratégiques clairs, minute par minute, basés sur une prévision de 5 minutes.

Les joueurs ont trois façons principales de parier :
1.  **{strat1} :** {strat1Desc}
2.  **{strat2} :** {strat2Desc}
3.  **{strat3} :** {strat3Desc}

Analysez les données de prévision fournies. Votre réponse DOIT être un objet JSON valide.
Les clés de l'objet JSON doivent être les chaînes de minutes de la prévision (par exemple, "14:35").
La valeur pour chaque clé doit être une chaîne contenant votre analyse stratégique pour cette minute.
La chaîne d'analyse doit recommander la meilleure stratégie unique et fournir une justification concise en une phrase. Utilisez markdown pour la mise en forme, comme **Stratégie:**.

N'ajoutez aucun texte en dehors de l'objet JSON.`,
    strat1: 'Bas/Haut',
    strat1Desc: 'Parier sur le fait que le résultat sera INFÉRIEUR à 2.00x (Bas) ou SUPÉRIEUR ou ÉGAL à 2.00x (Haut).',
    strat2: 'Intervalle',
    strat2Desc: 'Parier sur le fait que le résultat se situera dans une plage spécifique (par exemple, entre 1.40x et 1.90x).',
    strat3: 'Cible',
    strat3Desc: 'Viser un multiplicateur élevé spécifique, en espérant un gros gain.',
    promptHeader: `Analysez les données de prévision suivantes, qui sont fournies sous forme d'objet JSON où les clés sont des minutes et les valeurs sont des tableaux de multiplicateurs prédits. Retournez un objet JSON avec votre analyse stratégique minute par minute.

Données de prévision : {forecastData}`,
  },
  guide: {
    title: '📚 Guide des Phases & Cycles',
    close: 'Fermer',
    qualityPhases: {
      title: 'Phases de Qualité',
      good: { title: '🟢 BONNE', desc: 'Haute probabilité de multiplicateurs de 2.00x à 9.99x. Favorable aux gains.' },
      normal: { title: '🟣 NORMALE', desc: 'Distribution équilibrée des multiplicateurs. Phase neutre, la prudence est de mise.' },
      bad: { title: '🟠 MAUVAISE', desc: 'Haute probabilité de multiplicateurs < 2.00x. Défavorable, un retrait rapide est conseillé.' },
      catastrophic: { title: '🔴 CATASTROPHIQUE', desc: 'Très haute probabilité de multiplicateurs < 2.00x. Évitez de parier ou retirez-vous immédiatement.' },
    },
    multiplierTiers: {
      title: 'Paliers de Multiplicateurs',
      catastrophic: 'Catastrophique',
      bad: 'Mauvais',
      normal: 'Normal',
      good: 'Bon',
      excellent: 'Excellent',
      insane: 'Fou',
    },
    temporalCycles: {
      title: 'Cycles Temporels',
      hourly: { title: 'Horaire :', desc: 'Les heures de pointe (ex: 9, 14, 20) sont généralement plus favorables. Les heures creuses peuvent être plus volatiles.' },
      quarterly: { title: 'Par quart d’heure :', desc: 'Les 15 premières minutes d’une heure ont tendance à être meilleures que les 15 dernières.' },
      fiveMin: { title: 'Blocs de 5 min :', desc: 'La simulation suit des schémas subtils dans des intervalles de 5 minutes.' },
    },
    specialMinutes: {
      title: 'Minutes Spéciales',
      nineOne: { title: 'Se terminant par 9 ou 1 :', desc: 'Souvent volatiles et défavorables, surtout dans les 30 premières secondes.' },
      seven: { title: 'Multiples de 7 :', desc: "Considérées comme 'catastrophiques' et à très haut risque." },
      fiveThree: { title: 'Multiples de 5 ou 3 :', desc: "Tendent à être 'mauvaises' ou 'normales à mauvaises', indiquant un risque plus élevé." },
    },
  },
  settings: {
    title: 'Paramètres de Simulation',
    apiKey: {
        title: 'Gestion de la clé API',
        label: 'Clé API Gemini',
        placeholder: 'Entrez votre clé API ici',
        saveButton: 'Enregistrer la clé',
        saving: 'Enregistrement...',
        unsupported: 'Votre version de Telegram ne prend pas en charge le stockage cloud. La clé API sera enregistrée sur cet appareil uniquement.',
    },
    crashTime: {
      title: 'Génération du temps de crash (secondes)',
      low: 'Durée max. multiplicateur bas (< 2x)',
      med: 'Durée max. multiplicateur moyen (2x-10x)',
      high: 'Durée max. multiplicateur élevé (> 10x)',
    },
    flow: {
      title: 'Flux de Simulation',
      pause: 'Pause entre les tours (secondes)',
    }
  }
};