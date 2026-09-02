/**
 * Dictionnaire de référence. Son type contraint les autres langues : ajouter
 * une clé ici provoque une erreur de compilation dans `en.ts` et `pt.ts` tant
 * qu'elle n'y est pas traduite.
 *
 * Les chaînes paramétrées sont des fonctions plutôt que des gabarits à trous :
 * l'interpolation reste typée et chaque langue garde la liberté de placer ses
 * valeurs où sa grammaire l'exige.
 */
export const fr = {
  locale: 'fr-FR',
  languageName: 'Français',

  common: {
    cancel: 'Annuler',
    delete: 'Supprimer',
    save: 'Enregistrer',
    edit: 'Modifier',
    detail: 'Détail',
    add: 'Ajouter',
    perMonth: 'par mois',
    months: (n: number) => `${n} mois`,
    years: (n: number) => `${n} an${n > 1 ? 's' : ''}`,
    /** Français : espace insécable avant les deux-points. */
    labelSeparator: ' : ',
    thousandsSuffix: 'k€',
    millionsSuffix: 'M€',
  },

  tabs: {
    dashboard: 'Bord',
    budget: 'Budget',
    goals: 'Objectifs',
    simulation: 'Simulation',
    advice: 'Conseils',
    dashboardTitle: 'Tableau de bord',
  },

  categories: {
    salary: 'Salaire',
    freelance: 'Activité indépendante',
    rental: 'Revenus locatifs',
    investment: 'Placements & dividendes',
    benefits: 'Aides & allocations',
    other_income: 'Autre revenu',
    housing: 'Logement',
    loan: 'Crédit',
    utilities: 'Énergie & télécom',
    subscriptions: 'Abonnements',
    insurance: 'Assurances',
    transport: 'Transport',
    food: 'Alimentation',
    health: 'Santé',
    childcare: 'Enfants & garde',
    taxes: 'Impôts & taxes',
    leisure: 'Loisirs & sorties',
    savings: 'Épargne programmée',
    other_expense: 'Autre charge',
  },

  frequencies: {
    weekly: 'Par semaine',
    monthly: 'Par mois',
    quarterly: 'Par trimestre',
    semiannual: 'Par semestre',
    yearly: 'Par an',
    weeklyShort: '/sem.',
    monthlyShort: '/mois',
    quarterlyShort: '/trim.',
    semiannualShort: '/sem.',
    yearlyShort: '/an',
  },

  quickIncome: {
    netSalary: 'Salaire net',
    bonus: 'Prime',
    rentReceived: 'Loyer perçu',
    benefits: 'Aides',
    dividends: 'Dividendes',
    freelance: 'Freelance',
  },

  quickExpense: {
    rent: 'Loyer',
    mortgage: 'Crédit immobilier',
    electricity: 'Électricité',
    internet: 'Internet',
    mobile: 'Forfait mobile',
    streaming: 'Streaming vidéo',
    music: 'Musique',
    gym: 'Salle de sport',
    homeInsurance: 'Assurance habitation',
    carInsurance: 'Assurance auto',
    healthInsurance: 'Mutuelle',
    groceries: 'Courses',
    fuel: 'Carburant',
    publicTransport: 'Transports en commun',
    childcare: 'Crèche / garde',
    incomeTax: 'Impôt sur le revenu',
    autoSaving: 'Épargne auto',
  },

  risk: {
    none: 'Capital garanti',
    low: 'Risque faible',
    medium: 'Risque modéré',
    high: 'Risque élevé',
  },

  products: {
    livretA: {
      label: 'Livret A',
      description: 'Capital garanti, intérêts nets d’impôt et de prélèvements sociaux.',
      liquidity: 'Disponible à tout moment',
    },
    ldds: {
      label: 'LDDS',
      description: 'Même rémunération que le Livret A, plafond plus bas. Cumulable avec lui.',
      liquidity: 'Disponible à tout moment',
    },
    lep: {
      label: 'LEP',
      description: 'Réservé sous conditions de revenus. Le meilleur taux garanti du marché.',
      liquidity: 'Disponible à tout moment',
    },
    pel: {
      label: 'PEL',
      description: 'Taux fixé à l’ouverture. Intérêts soumis au prélèvement forfaitaire de 30 %.',
      liquidity: 'Bloqué 4 ans pour garder le taux',
    },
    avEuro: {
      label: 'Assurance-vie — fonds euros',
      description: 'Capital garanti par l’assureur. Fiscalité allégée après 8 ans de détention.',
      liquidity: 'Rachat possible, fiscalité douce après 8 ans',
    },
    avUc: {
      label: 'Assurance-vie — unités de compte',
      description: 'Capital non garanti, investi en fonds. Enveloppe utile pour la transmission.',
      liquidity: 'Rachat possible, fiscalité douce après 8 ans',
    },
    pea: {
      label: 'PEA',
      description: 'Actions européennes. Après 5 ans, seuls les prélèvements sociaux s’appliquent.',
      liquidity: 'Retrait sans clôture après 5 ans',
    },
    cto: {
      label: 'Compte-titres',
      description: 'Aucun plafond ni restriction géographique, mais 30 % de flat tax sur les gains.',
      liquidity: 'Disponible à tout moment',
    },
    scpi: {
      label: 'SCPI',
      description: 'Immobilier locatif mutualisé. Fiscalité réelle souvent plus lourde que ce modèle.',
      liquidity: 'Revente longue (plusieurs semaines à mois)',
    },
  },

  dashboard: {
    goodNight: 'Bonne nuit',
    goodMorning: 'Bonjour',
    goodEvening: 'Bonsoir',
    tagline: 'Votre budget, à la fourmi',
    disposableIncome: 'RESTE À VIVRE',
    perDayAndDaysLeft: (perDay: string, days: number) =>
      `soit ${perDay} par jour · ${days} j restants`,
    fixedCharges: 'Charges fixes',
    savings: 'Épargne',
    toLive: 'À vivre',
    income: 'Revenus',
    charges: 'Charges',
    margin: 'Marge',
    savingGoalTitle: 'Objectif d’épargne du mois',
    ofGoal: (pct: string) => `${pct} de l’objectif`,
    onTarget: (target: string) => `sur ${target} visés`,
    cashflowTitle: 'Le flux de votre argent',
    enlarge: 'Agrandir',
    whereMoneyGoes: 'Où part votre argent',
    addChargesToSee: 'Ajoutez vos charges pour voir la répartition.',
    projectionTitle: 'Projection sur 12 mois',
    projectionSub: (effort: string | null) =>
      `épargne cumulée dans un an si vous tenez ce rythme${effort ? ` (${effort} par mois)` : ''}`,
    upcoming: 'Prochaines échéances',
    today: 'aujourd’hui',
    inDays: (n: number) => `dans ${n} jour${n > 1 ? 's' : ''}`,
    wordOfTheDay: 'Le mot du jour',
    allAdvice: 'Tous les conseils',
    addBudgetLine: 'Ajouter une ligne au budget',
    sampleBannerTitle: 'Vous explorez un budget d’exemple',
    sampleBannerBody:
      'Ces chiffres sont fictifs. Repartez de zéro pour saisir vos propres revenus et charges — ou modifiez une ligne pour vous approprier cet exemple.',
    sampleBannerAction: 'Saisir mes propres données',
    emptyTitle: 'Rien à afficher pour l’instant',
    emptyBody:
      'Ajoutez votre premier revenu : le reste à vivre, le score et les projections se calculent automatiquement.',
    emptyAction: 'Ajouter un revenu',
  },

  budget: {
    title: 'Mon budget',
    subtitle: 'Tout est ramené à un équivalent mensuel, quelle que soit la périodicité saisie.',
    chargesTab: (total: string) => `Charges · ${total}`,
    incomeTab: (total: string) => `Revenus · ${total}`,
    fixed: 'Fixes',
    variable: 'Variables',
    savings: 'Épargne',
    emptyIncomeTitle: 'Aucun revenu enregistré',
    emptyIncomeBody:
      'Salaire, revenus locatifs, aides, dividendes : ajoutez tout ce qui entre chaque mois.',
    emptyExpenseTitle: 'Aucune charge enregistrée',
    emptyExpenseBody:
      'Loyer, crédit, énergie, abonnements, courses : ajoutez tout ce qui sort chaque mois.',
    linesAndShare: (lines: number, pct: number) =>
      `${lines} ligne${lines > 1 ? 's' : ''} · ${pct} % du total`,
    pausedCount: (n: number) => `En pause (${n})`,
    variableBadge: 'variable',
    withEndBadge: 'avec fin',
    onDay: (day: number) => `le ${day} du mois`,
    monthly: 'mensuel',
    addCharge: 'Ajouter une charge',
    addIncome: 'Ajouter un revenu',
  },

  goals: {
    title: 'Mes objectifs',
    subtitle: 'Fixez une cible d’épargne, un plafond de dépenses, et suivez vos projets.',
    monthlyTargetTitle: 'Épargne mensuelle visée',
    budgetYields: (amount: string) => `Votre budget dégage ${amount}`,
    targetMet: (margin: string, yearly: string) =>
      `Objectif tenu, avec ${margin} de marge. Sur un an : ${yearly}.`,
    targetMissing: (missing: string, yearly: string) =>
      `Il manque ${missing} par mois. Sur un an, l’objectif représenterait ${yearly}.`,
    spendingCapTitle: 'Plafond de dépenses variables',
    spendingCapBody: (planned: string) =>
      `Courses, carburant, loisirs : le montant à ne pas dépasser chaque mois. Actuellement prévu ${planned}.`,
    underCap: (amount: string) => `${amount} sous le plafond`,
    overCap: (amount: string) => `${amount} au-dessus`,
    noCap: 'Aucun plafond fixé',
    emergencyTitle: 'Épargne de précaution',
    alreadySaved: 'Épargne déjà constituée',
    monthsToCover: 'Mois de charges à couvrir',
    monthsHint: 'Trois à six mois de charges sont le repère le plus courant.',
    outOf: (total: string) => `sur ${total}`,
    emergencyComplete:
      'Matelas de sécurité complet. Le surplus peut viser un horizon plus long.',
    emergencyNoCapacity:
      'Aucune capacité d’épargne pour l’instant : commencez par dégager une marge mensuelle.',
    emergencyIn: (months: number) => `Complet dans ${months} mois à votre rythme actuel.`,
    projectsTitle: 'Projets d’épargne',
    newProject: 'Nouveau',
    projectName: 'Nom du projet',
    projectNamePlaceholder: 'Voyage, apport, voiture…',
    projectTarget: 'Montant à atteindre',
    projectIcon: 'Icône',
    createProject: 'Créer le projet',
    projectsEmpty:
      'Un projet donne un cap concret à l’épargne : voyage, apport, changement de voiture. Formiga calcule l’échéance à votre rythme actuel.',
    savedOf: (saved: string, target: string) => `${saved} sur ${target}`,
    projectReached: 'Objectif atteint 🎉',
    rhythmToDefine: 'Rythme d’épargne à définir',
    aboutMonths: (months: number) => `≈ ${months} mois au rythme actuel`,
    deleteProjectTitle: 'Supprimer ce projet ?',
  },

  simulation: {
    title: 'Simuler un placement',
    subtitle:
      'Combien votre effort d’épargne peut-il devenir sur la durée, une fois la fiscalité déduite ?',
    monthlyPayment: 'Versement mensuel',
    myCapacity: (amount: string) => `Ma capacité : ${amount}`,
    myGoal: (amount: string) => `Mon objectif : ${amount}`,
    initialCapital: 'Capital de départ',
    mySavings: (amount: string) => `Mon épargne actuelle : ${amount}`,
    duration: (years: string) => `Durée : ${years}`,
    oneYear: '1 an',
    fortyYears: '40 ans',
    inflationLabel: (pct: string) => `Inflation retenue : ${pct}`,
    inflationHint:
      'Sert à exprimer le résultat en euros d’aujourd’hui, à pouvoir d’achat constant.',
    supportTitle: 'Support de placement',
    yieldRetained: 'Rendement annuel retenu : ',
    backToDefault: (pct: string) => `Revenir au taux par défaut (${pct})`,
    noTax: 'Aucune fiscalité sur les intérêts',
    taxOnGains: (pct: string, years: string) => `${pct} sur les gains à ${years}`,
    ceiling: (amount: string) => `Plafond de versements : ${amount}`,
    ceilingReached: (years: number) => ` — atteint au bout de ${years} an(s)`,
    resultTitle: (years: string) => `Résultat à ${years}`,
    netCapital: 'CAPITAL NET APRÈS IMPÔT',
    resultSub: (gains: string, deposited: string) =>
      `dont ${gains} de gains nets, pour ${deposited} versés`,
    payments: (amount: string) => `Versements ${amount}`,
    netInterest: (amount: string) => `Intérêts nets ${amount}`,
    evolution: 'Évolution',
    currentEuros: 'Euros courants',
    constantEuros: 'Euros constants',
    netValue: 'Valeur nette',
    netValueReal: 'Valeur nette en euros d’aujourd’hui',
    totalDeposited: 'Total versé',
    realNote: (nominal: string, real: string, inflation: string) =>
      `À ${inflation} d’inflation, vos ${nominal} vaudront ${real} en pouvoir d’achat d’aujourd’hui.`,
    comparisonTitle: 'Comparatif des enveloppes',
    sameEffort: (amount: string, years: string) =>
      `Même effort (${amount} par mois pendant ${years}), fiscalité de sortie appliquée.`,
    grossRate: (pct: string) => `${pct} brut`,
    netOfTax: 'net d’impôt',
    taxOf: (pct: string) => `${pct} de fiscalité`,
    disclaimer:
      'Ces projections sont des ordres de grandeur, pas une promesse de rendement ni un conseil en investissement. Les taux sont paramétrables parce qu’ils évoluent ; la fiscalité modélisée est simplifiée (ni TMI, ni abattements, ni frais d’enveloppe). Les supports à risque peuvent perdre de la valeur.',
    frenchProductsNote:
      'Les enveloppes proposées et leur fiscalité sont celles du droit français. Elles restent affichées quelle que soit la langue choisie.',
  },

  cashflow: {
    title: 'Flux du mois',
    byCategory: 'Par poste',
    lineByLine: 'Ligne par ligne',
    inflows: 'Entrées',
    outflows: 'Sorties',
    unallocated: 'Non affecté',
    overdraft: 'Découvert',
    budgetNode: 'Budget',
    deficitNode: 'Puisé dans l’épargne',
    unallocatedNode: 'Reste non affecté',
    emptyTitle: 'Pas encore de flux à tracer',
    emptyBody:
      'Ajoutez au moins un revenu et une charge : le diagramme montrera alors le trajet de chaque euro.',
    emptyAction: 'Ajouter une ligne',
    howToRead: 'Comment le lire',
    howToReadBody:
      'L’argent se lit de gauche à droite : vos revenus alimentent le budget, qui se répartit ensuite entre vos postes de dépense. L’épaisseur de chaque ruban est proportionnelle au montant mensuel, ce qui rend visible d’un coup d’œil ce qui pèse vraiment.',
    unallocatedNote: (amount: string) =>
      `Le ruban vert « Reste non affecté » représente les ${amount} que votre budget dégage sans destination définie. Leur donner une affectation explicite — épargne programmée, projet — est le moyen le plus sûr de ne pas les voir disparaître.`,
    deficitNote: (amount: string) =>
      `Le ruban rouge signale que vos charges dépassent vos revenus de ${amount} : ce montant est prélevé chaque mois sur votre épargne.`,
  },

  entry: {
    newLine: 'Nouvelle ligne',
    editLine: 'Modifier',
    aCharge: 'Une charge',
    anIncome: 'Un revenu',
    equivalentPerMonth: (amount: string) => `équivaut à ${amount} par mois`,
    shortcuts: 'Raccourcis',
    label: 'Libellé',
    labelPlaceholderIncome: 'Salaire net, prime…',
    labelPlaceholderExpense: 'Loyer, abonnement, courses…',
    category: 'Catégorie',
    advancedOptions: 'Options avancées',
    variableAmount: 'Montant variable',
    variableHint:
      'Courses, carburant, loisirs… Ces charges sont exclues des charges fixes et déduites du reste à vivre.',
    incomeDay: 'Jour de versement',
    expenseDay: 'Jour de prélèvement',
    dayHint: 'Alimente les prochaines échéances du tableau de bord.',
    hasEnd: 'Cette charge a une fin',
    hasEndHint:
      'Crédit, location, engagement : Formiga anticipe l’argent qui se libérera.',
    remainingPayments: 'Mensualités restantes',
    endExpected: (date: string) => `Fin prévue en ${date}.`,
    deleteLine: 'Supprimer cette ligne',
    deleteTitle: 'Supprimer cette ligne ?',
    deleteBody: (label: string) => `« ${label} » sera définitivement retirée du budget.`,
    addToBudget: 'Ajouter au budget',
    copySuffix: (label: string) => `${label} (copie)`,
  },

  onboarding: {
    lead:
      'La fourmi ne déplace pas la fourmilière en un jour. Posez vos revenus et vos charges, et voyez exactement ce qu’il vous reste — puis ce que cela peut devenir.',
    featureDisposableTitle: 'Reste à vivre',
    featureDisposableBody: 'Le vrai montant disponible, au jour près.',
    featureGoalsTitle: 'Objectifs',
    featureGoalsBody: 'Une cible d’épargne, des projets, un cap.',
    featureSimulationTitle: 'Simulation',
    featureSimulationBody: 'Livret A, PEA, assurance-vie : projetez sur X années.',
    featureLocalTitle: '100 % local',
    featureLocalBody: 'Vos données restent sur votre téléphone.',
    languageStepTitle: 'Choisissez votre langue',
    languageStepSubtitle: 'Vous pourrez en changer à tout moment dans les réglages.',
    nameStepTitle: 'Comment vous appelez-vous ?',
    nameStepSubtitle: 'Uniquement pour vous dire bonjour. Vous pouvez laisser vide.',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Votre prénom',
    incomeStepTitle: 'Vos revenus mensuels',
    incomeStepSubtitle: 'Le montant net qui arrive réellement sur le compte.',
    netSalary: 'Salaire net mensuel',
    otherIncome: 'Autres revenus réguliers',
    otherIncomeHint: 'Loyers perçus, aides, pension, activité complémentaire.',
    otherIncomeLabel: 'Autres revenus',
    monthlyTotal: 'Total mensuel',
    expensesStepTitle: 'Vos charges principales',
    expensesStepSubtitle:
      'Une estimation suffit : tout reste modifiable ensuite, poste par poste.',
    starterHousing: 'Loyer / crédit immobilier',
    starterUtilities: 'Énergie & télécom',
    starterInsurance: 'Assurances',
    starterTransport: 'Transport',
    starterFood: 'Courses',
    starterSubscriptions: 'Abonnements',
    enteredCharges: 'Charges saisies',
    estimatedDisposable: 'Reste à vivre estimé',
    goalStepTitle: 'Votre objectif d’épargne',
    goalStepSubtitle:
      'Combien souhaitez-vous mettre de côté chaque mois ? Vous pourrez l’ajuster à tout moment.',
    monthlyTarget: 'Épargne mensuelle visée',
    currentSavings: 'Épargne déjà constituée',
    currentSavingsHint:
      'Livrets, assurance-vie, comptes titres. Sert à mesurer votre matelas de sécurité.',
    start: 'Commencer',
    continue: 'Continuer',
    finish: 'Terminer',
    demo: 'Explorer avec un budget d’exemple',
  },

  settings: {
    title: 'Réglages',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Votre prénom',
    language: 'Langue',
    languageNote:
      'Les libellés que vous avez saisis vous-même ne sont pas traduits : ce sont vos données.',
    appearance: 'Apparence',
    system: 'Système',
    light: 'Clair',
    dark: 'Sombre',
    appearanceSystemNote: (scheme: string) =>
      `Formiga suit le réglage de votre appareil, actuellement ${scheme}.`,
    schemeDark: 'sombre',
    schemeLight: 'clair',
    appearanceFixedNote: 'Le thème reste fixe, quel que soit le réglage de votre appareil.',
    myData: 'Mes données',
    budgetLines: 'Lignes de budget',
    savingsProjects: 'Projets d’épargne',
    dataNote:
      'Tout est stocké uniquement sur cet appareil. Aucune donnée n’est envoyée sur un serveur, et l’application fonctionne hors connexion. Une désinstallation efface tout : pensez à exporter.',
    backup: 'Sauvegarde',
    exportData: 'Exporter mes données',
    importData: 'Importer une sauvegarde',
    cancelImport: 'Annuler l’import',
    pasteHere: 'Collez ici le contenu exporté',
    pasteHint: 'Le budget actuel sera remplacé.',
    restore: 'Restaurer',
    exportTitle: 'Sauvegarde Formiga',
    exportErrorTitle: 'Export impossible',
    exportErrorBody: 'Le partage n’a pas pu être ouvert sur cet appareil.',
    importSuccessTitle: 'Import réussi',
    importSuccessBody: (n: number) => `${n} lignes restaurées.`,
    importErrorTitle: 'Import impossible',
    importErrorBody: 'Le contenu collé n’est pas une sauvegarde Formiga valide.',
    dangerZone: 'Zone sensible',
    loadSample: 'Charger un budget d’exemple',
    loadSampleTitle: 'Charger l’exemple ?',
    loadSampleBody: 'Votre budget actuel sera remplacé par un jeu de démonstration.',
    load: 'Charger',
    resetAll: 'Tout effacer',
    resetTitle: 'Tout effacer ?',
    resetBody:
      'Vos revenus, charges, objectifs et projets seront définitivement supprimés de cet appareil.',
    startOver: 'Repartir de zéro',
    startOverTitle: 'Repartir de zéro ?',
    startOverBody:
      'Vos revenus, charges, objectifs et projets seront effacés de cet appareil, et la configuration guidée redémarrera. Votre langue et votre thème sont conservés.',
    startOverConfirm: 'Repartir de zéro',
    footer: 'Formiga · budget & épargne · v1.0',
  },

  sample: {
    annualBonus: 'Prime annuelle',
    studioRent: 'Loyer studio',
    carLoan: 'Crédit auto',
    internetMobile: 'Internet + mobile',
    propertyTax: 'Taxe foncière',
    savingTransfer: 'Virement épargne',
    leisure: 'Loisirs & sorties',
    tripProject: 'Voyage au Japon',
    homeDeposit: 'Apport immobilier',
  },

  score: {
    excellent: 'Excellent',
    solid: 'Solide',
    correct: 'Correct',
    fragile: 'Fragile',
    poor: 'À redresser',
    budgetHealth: 'Santé du budget',
    compositeNote: 'Note composite sur cinq critères, recalculée à chaque modification.',
    savingsRate: 'Taux d’épargne',
    savingsRateHint: 'Viser 20 % des revenus mis de côté chaque mois.',
    monthBalance: 'Équilibre du mois',
    monthBalanceHint: 'Terminer le mois avec une marge positive.',
    housingWeight: 'Poids du logement',
    housingWeightHint: 'Le logement devrait rester sous 30 % des revenus.',
    debtRatio: 'Taux d’endettement',
    debtRatioHint: 'Les banques plafonnent le crédit à 35 % des revenus.',
    emergencyFund: 'Épargne de précaution',
    emergencyFundHint: (months: number) => `${months} mois de charges à garder d’avance.`,
  },

  advice: {
    title: 'Conseils',
    subtitle:
      'Analyse automatique de vos chiffres. Tout est calculé sur l’appareil, rien n’est envoyé ailleurs.',
    toneCritical: 'À traiter',
    toneWarning: 'À surveiller',
    toneTip: 'Piste',
    toneWin: 'Bravo',
    nothingTitle: 'Rien à signaler',
    nothingBody:
      'Votre budget ne déclenche aucune alerte. Revenez après avoir mis vos chiffres à jour.',
    allocationTitle: 'Où placer votre effort d’épargne',
    allocationSub: (amount: string) =>
      `Répartition indicative de vos ${amount} mensuels, du plus liquide au plus long terme.`,
    allocationSimulate: 'Simuler cette répartition',
    perMonthBadge: (amount: string) => `${amount} / mois`,
    disclaimer:
      'Formiga applique des règles budgétaires générales à vos chiffres. Ce n’est ni un conseil en investissement, ni un accompagnement personnalisé : pour une décision engageante, parlez-en à un professionnel.',

    allocationEmergency: 'Livret A',
    allocationEmergencyWhy:
      'Tant que l’épargne de précaution n’est pas constituée, priorité à un support liquide et garanti.',
    allocationSecure: 'Livret A / LDDS',
    allocationSecureWhy: 'Matelas de sécurité toujours disponible.',
    allocationMid: 'Assurance-vie fonds euros',
    allocationMidWhy:
      'Projets à 3-8 ans, capital garanti et fiscalité qui s’allège avec le temps.',
    allocationLong: 'PEA',
    allocationLongWhy:
      'Horizon supérieur à 8 ans : c’est là que les intérêts composés travaillent.',

    onboardingIncomeTitle: 'Commencez par vos revenus',
    onboardingIncomeBody:
      'Ajoutez votre salaire net et vos éventuels revenus complémentaires : tout le reste du tableau de bord en découle.',
    onboardingIncomeAction: 'Ajouter un revenu',
    onboardingExpensesTitle: 'Ajoutez vos charges fixes',
    onboardingExpensesBody:
      'Loyer, crédit, énergie, abonnements… Ce sont elles qui déterminent votre reste à vivre.',
    onboardingExpensesAction: 'Ajouter une charge',

    deficitTitle: 'Votre mois est déficitaire',
    deficitBody: (monthly: string, yearly: string) =>
      `Vos charges dépassent vos revenus de ${monthly} par mois, soit ${yearly} sur un an. Commencez par les postes arbitrables : abonnements, loisirs, assurances à renégocier.`,
    deficitAction: 'Voir mes charges',

    tightTitle: 'Budget à l’équilibre, sans marge',
    tightBody: (margin: string) =>
      `Il ne vous reste que ${margin} en fin de mois. Un imprévu suffirait à faire basculer le budget : dégager ne serait-ce que 50 € changerait déjà la donne.`,

    savingsExcellentTitle: 'Taux d’épargne remarquable',
    savingsExcellentBody: (rate: string, yearly: string) =>
      `Vous mettez de côté ${rate} de vos revenus, bien au-dessus de la moyenne des ménages. À ce rythme, vous épargnez ${yearly} par an.`,

    savingsLowTitle: 'Faites travailler la règle des petits pas',
    savingsLowBody: (rate: string, tenPercent: string) =>
      `Vous épargnez ${rate} de vos revenus. Passer à 10 % représenterait ${tenPercent} par mois — souvent atteignable en agissant sur deux ou trois postes seulement.`,

    automateTitle: 'Automatisez votre épargne',
    automateBody: (margin: string) =>
      `Vous dégagez ${margin} de marge, mais aucun virement d’épargne n’est programmé. Un virement automatique le jour de la paie met l’argent à l’abri avant qu’il ne soit dépensé.`,
    automateAction: 'Programmer une épargne',

    housingTitle: 'Le logement pèse lourd',
    housingBody: (ratio: string) =>
      `Votre logement absorbe ${ratio} de vos revenus, contre un repère usuel de 30 %. Renégociation d’assurance emprunteur, aides au logement ou colocation sont les leviers les plus efficaces sur ce poste.`,

    debtHighTitle: 'Taux d’endettement au-dessus du seuil',
    debtHighBody: (ratio: string) =>
      `Vos crédits représentent ${ratio} de vos revenus, au-delà des 35 % retenus par les banques. Un regroupement de crédits ou un rachat peut alléger la mensualité.`,

    debtWatchTitle: 'Endettement à surveiller',
    debtWatchBody: (ratio: string) =>
      `À ${ratio}, vous approchez du plafond de 35 % qui conditionne l’accès à un nouveau crédit.`,

    subscriptionsTitle: 'Passez vos abonnements en revue',
    subscriptionsBody: (count: number, monthly: string, yearly: string) =>
      `${count} abonnement${count > 1 ? 's' : ''} pour ${monthly} par mois, soit ${yearly} par an. C’est le poste où l’on récupère le plus d’argent pour le moins d’effort.`,
    subscriptionsAction: 'Voir le détail',

    emergencyTitle: 'Construisez votre matelas de sécurité',
    emergencyBody: (covered: string, target: number, missing: string, months: number | null) =>
      `Vous couvrez ${covered} mois de charges sur les ${target} visés. Il manque ${missing}${
        months !== null ? `, soit ${months} mois à votre rythme actuel` : ''
      }.`,
    emergencyMetric: (covered: string, target: number) => `${covered} / ${target} mois`,
    emergencyAction: 'Ajuster mes objectifs',

    emergencyDoneTitle: 'Épargne de précaution constituée',
    emergencyDoneBody: (savings: string, covered: string) =>
      `Vos ${savings} couvrent ${covered} mois de charges. Le surplus peut désormais viser le moyen et le long terme, où le rendement compte davantage que la disponibilité.`,
    emergencyDoneMetric: (covered: string) => `${covered} mois`,
    emergencyDoneAction: 'Simuler un placement',

    goalReachedTitle: 'Objectif d’épargne atteint',
    goalReachedBody: (effort: string, target: string, canRaise: boolean) =>
      `Votre budget dégage ${effort} pour un objectif de ${target}. ${
        canRaise ? 'Vous pourriez même relever la barre.' : 'Tenez ce rythme.'
      }`,

    goalCloseTitle: 'L’objectif est à portée',
    goalCloseBody: (missing: string, perDay: string) =>
      `Il vous manque ${missing} par mois pour atteindre votre cible, soit environ ${perDay} par jour.`,

    goalFarTitle: 'Objectif encore loin',
    goalFarBody: (ratio: string, target: string, missing: string) =>
      `Vous atteignez ${ratio} de votre objectif de ${target}. Soit vous ajustez la cible pour qu’elle reste motivante, soit vous libérez ${missing} sur vos charges.`,
    goalFarAction: 'Revoir mes objectifs',

    capExceededTitle: 'Dépenses variables au-dessus du plafond',
    capExceededBody: (planned: string, cap: string) =>
      `Vous prévoyez ${planned} de dépenses variables pour un plafond fixé à ${cap}.`,

    dailyLowTitle: 'Reste à vivre quotidien serré',
    dailyLowBody: (perDay: string) =>
      `Une fois les charges fixes payées, il reste ${perDay} par jour pour tout le quotidien. Vérifiez qu’aucune charge fixe n’est en réalité arbitrable.`,
    dailyLowMetric: (perDay: string) => `${perDay}/jour`,

    creditEndingTitle: 'Une charge se termine bientôt',
    creditEndingBody: (label: string, months: number, relief: string) =>
      `« ${label} » s’arrête dans ${months} mois : ${relief} par mois se libèrent. Décidez dès maintenant de leur destination, sinon ils se dissoudront dans le quotidien.`,
    creditEndingMetric: (relief: string) => `+${relief}/mois`,
    creditEndingAction: 'Simuler ce montant',

    taxProvisionTitle: 'Aucune provision fiscale',
    taxProvisionBody:
      'Vous déclarez un revenu d’activité indépendante mais aucune ligne d’impôts ou de cotisations. Provisionner chaque mois évite le trou de trésorerie au moment de l’appel.',
    taxProvisionAction: 'Ajouter une provision',

    encouragementsLow: [
      'Chaque euro repéré est un euro repris. Le simple fait de tout poser à plat est déjà la moitié du chemin.',
      'Un budget serré n’est pas un échec, c’est une contrainte à contourner. Commencez par le plus petit poste que vous pouvez réduire.',
      'La fourmi ne déplace pas la fourmilière en un jour. Un ajustement par semaine suffit à changer l’année.',
      'Les mois difficiles apprennent plus que les mois faciles. Vous saurez exactement où vous en êtes.',
    ],
    encouragementsMid: [
      'Votre budget tient debout. Le prochain palier se joue sur un seul poste : choisissez lequel.',
      'Régulier vaut mieux qu’ambitieux. Un virement automatique modeste bat une grosse résolution oubliée.',
      'Vous êtes au-dessus de la moyenne des ménages. Encore quelques points et vous entrez dans le peloton de tête.',
      'Le plus dur est fait : vous savez où va votre argent. Le reste n’est que réglage.',
    ],
    encouragementsHigh: [
      'Budget solide et discipline installée. Le sujet devient le rendement plutôt que l’effort.',
      'À ce rythme, le temps travaille pour vous : les intérêts composés font le reste.',
      'Vous épargnez plus que la grande majorité des ménages. Pensez à vous accorder aussi un poste plaisir assumé.',
      'Objectif tenu. La meilleure chose à faire maintenant est de ne rien changer.',
    ],
  },
};

/**
 * Sans `as const`, les littéraux s'élargissent en `string` et les tableaux en
 * `string[]` : le type décrit la forme du dictionnaire sans figer les valeurs
 * françaises, ce qui permet aux autres langues de s'y conformer.
 */
export type Dict = typeof fr;
