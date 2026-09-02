import type { Dict } from './fr';

/** Accord singulier/pluriel, réutilisé partout où un nombre de mois s'affiche. */
const months = (n: number) => `${n} month${n === 1 ? '' : 's'}`;

export const en: Dict = {
  locale: 'en-GB',
  languageName: 'English',

  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    edit: 'Edit',
    detail: 'Details',
    add: 'Add',
    perMonth: 'per month',
    months,
    years: (n) => `${n} year${n > 1 ? 's' : ''}`,
    labelSeparator: ': ',
    thousandsSuffix: 'k€',
    millionsSuffix: 'M€',
  },

  tabs: {
    dashboard: 'Home',
    budget: 'Budget',
    goals: 'Goals',
    simulation: 'Invest',
    advice: 'Advice',
    dashboardTitle: 'Dashboard',
  },

  categories: {
    salary: 'Salary',
    freelance: 'Self-employment',
    rental: 'Rental income',
    investment: 'Investments & dividends',
    benefits: 'Benefits & allowances',
    other_income: 'Other income',
    housing: 'Housing',
    loan: 'Loan repayments',
    utilities: 'Utilities & telecom',
    subscriptions: 'Subscriptions',
    insurance: 'Insurance',
    transport: 'Transport',
    food: 'Groceries',
    health: 'Health',
    childcare: 'Children & childcare',
    taxes: 'Taxes',
    leisure: 'Leisure & going out',
    savings: 'Scheduled savings',
    other_expense: 'Other expense',
  },

  frequencies: {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    semiannual: 'Twice a year',
    yearly: 'Yearly',
    weeklyShort: '/wk',
    monthlyShort: '/mo',
    quarterlyShort: '/qtr',
    semiannualShort: '/6 mo',
    yearlyShort: '/yr',
  },

  quickIncome: {
    netSalary: 'Net salary',
    bonus: 'Bonus',
    rentReceived: 'Rent received',
    benefits: 'Benefits',
    dividends: 'Dividends',
    freelance: 'Freelance',
  },

  quickExpense: {
    rent: 'Rent',
    mortgage: 'Mortgage',
    electricity: 'Electricity',
    internet: 'Internet',
    mobile: 'Mobile plan',
    streaming: 'Video streaming',
    music: 'Music',
    gym: 'Gym',
    homeInsurance: 'Home insurance',
    carInsurance: 'Car insurance',
    healthInsurance: 'Health insurance',
    groceries: 'Groceries',
    fuel: 'Fuel',
    publicTransport: 'Public transport',
    childcare: 'Childcare',
    incomeTax: 'Income tax',
    autoSaving: 'Automatic saving',
  },

  risk: {
    none: 'Capital guaranteed',
    low: 'Low risk',
    medium: 'Moderate risk',
    high: 'High risk',
  },

  products: {
    livretA: {
      label: 'Livret A',
      description: 'Regulated French savings account. Guaranteed capital, interest entirely tax-free.',
      liquidity: 'Available at any time',
    },
    ldds: {
      label: 'LDDS',
      description: 'Same rate as the Livret A with a lower cap. The two can be held together.',
      liquidity: 'Available at any time',
    },
    lep: {
      label: 'LEP',
      description: 'Means-tested French account. The best guaranteed rate on the market.',
      liquidity: 'Available at any time',
    },
    pel: {
      label: 'PEL',
      description: 'Rate fixed when opened. Interest is taxed at the 30 % flat rate.',
      liquidity: 'Locked for 4 years to keep the rate',
    },
    avEuro: {
      label: 'Life insurance — euro fund',
      description: 'Capital guaranteed by the insurer. Lighter taxation after 8 years.',
      liquidity: 'Withdrawable, favourable tax after 8 years',
    },
    avUc: {
      label: 'Life insurance — unit-linked',
      description: 'Capital not guaranteed, invested in funds. Useful for estate planning.',
      liquidity: 'Withdrawable, favourable tax after 8 years',
    },
    pea: {
      label: 'PEA',
      description: 'European equities. After 5 years only social charges apply.',
      liquidity: 'Withdrawals without closing after 5 years',
    },
    cto: {
      label: 'Securities account',
      description: 'No cap, no geographic limit, but a 30 % flat tax on gains.',
      liquidity: 'Available at any time',
    },
    scpi: {
      label: 'SCPI',
      description: 'Pooled rental property. Real taxation is often heavier than this model.',
      liquidity: 'Slow to sell (weeks to months)',
    },
  },

  dashboard: {
    goodNight: 'Good night',
    goodMorning: 'Good morning',
    goodEvening: 'Good evening',
    tagline: 'Your budget, one crumb at a time',
    disposableIncome: 'LEFT TO LIVE ON',
    perDayAndDaysLeft: (perDay, days) => `that is ${perDay} a day · ${days} days left`,
    fixedCharges: 'Fixed costs',
    savings: 'Savings',
    toLive: 'To live on',
    income: 'Income',
    charges: 'Expenses',
    margin: 'Margin',
    savingGoalTitle: 'This month’s savings goal',
    ofGoal: (pct) => `${pct} of goal`,
    onTarget: (target) => `of ${target} targeted`,
    cashflowTitle: 'Where your money flows',
    enlarge: 'Expand',
    whereMoneyGoes: 'Where your money goes',
    addChargesToSee: 'Add your expenses to see the breakdown.',
    projectionTitle: '12-month projection',
    projectionSub: (effort) =>
      `total savings a year from now if you keep this pace${effort ? ` (${effort} a month)` : ''}`,
    upcoming: 'Coming up',
    today: 'today',
    inDays: (n) => `in ${n} day${n > 1 ? 's' : ''}`,
    wordOfTheDay: 'Thought for the day',
    allAdvice: 'All advice',
    addBudgetLine: 'Add a budget line',
    sampleBannerTitle: 'You are exploring a sample budget',
    sampleBannerBody:
      'These figures are made up. Start over to enter your own income and expenses — or edit any line to make this sample yours.',
    sampleBannerAction: 'Enter my own data',
    emptyTitle: 'Nothing to show yet',
    emptyBody:
      'Add your first income: your disposable income, score and projections are all worked out from it.',
    emptyAction: 'Add income',
  },

  budget: {
    title: 'My budget',
    subtitle: 'Everything is converted to a monthly equivalent, whatever frequency you enter.',
    chargesTab: (total) => `Expenses · ${total}`,
    incomeTab: (total) => `Income · ${total}`,
    fixed: 'Fixed',
    variable: 'Variable',
    savings: 'Savings',
    emptyIncomeTitle: 'No income recorded',
    emptyIncomeBody:
      'Salary, rental income, benefits, dividends: add everything that comes in each month.',
    emptyExpenseTitle: 'No expenses recorded',
    emptyExpenseBody:
      'Rent, loans, utilities, subscriptions, groceries: add everything that goes out each month.',
    linesAndShare: (lines, pct) => `${lines} line${lines > 1 ? 's' : ''} · ${pct} % of total`,
    pausedCount: (n) => `Paused (${n})`,
    variableBadge: 'variable',
    withEndBadge: 'has an end',
    onDay: (day) => `on day ${day}`,
    monthly: 'monthly',
    addCharge: 'Add an expense',
    addIncome: 'Add income',
  },

  goals: {
    title: 'My goals',
    subtitle: 'Set a savings target, a spending cap, and track your projects.',
    monthlyTargetTitle: 'Monthly savings target',
    budgetYields: (amount) => `Your budget frees up ${amount}`,
    targetMet: (margin, yearly) => `Target met, with ${margin} to spare. Over a year: ${yearly}.`,
    targetMissing: (missing, yearly) =>
      `You are ${missing} a month short. Over a year the target would be ${yearly}.`,
    spendingCapTitle: 'Variable spending cap',
    spendingCapBody: (planned) =>
      `Groceries, fuel, leisure: the amount not to exceed each month. Currently planned: ${planned}.`,
    underCap: (amount) => `${amount} under the cap`,
    overCap: (amount) => `${amount} over`,
    noCap: 'No cap set',
    emergencyTitle: 'Emergency fund',
    alreadySaved: 'Savings already put aside',
    monthsToCover: 'Months of expenses to cover',
    monthsHint: 'Three to six months of expenses is the usual benchmark.',
    outOf: (total) => `of ${total}`,
    emergencyComplete: 'Safety net complete. The surplus can now aim at a longer horizon.',
    emergencyNoCapacity:
      'No savings capacity right now: start by freeing up a monthly margin.',
    emergencyIn: (n) => `Complete in ${months(n)} at your current pace.`,
    projectsTitle: 'Savings projects',
    newProject: 'New',
    projectName: 'Project name',
    projectNamePlaceholder: 'Trip, deposit, car…',
    projectTarget: 'Target amount',
    projectIcon: 'Icon',
    createProject: 'Create project',
    projectsEmpty:
      'A project gives your saving a concrete destination: a trip, a deposit, a new car. Formiga works out the date at your current pace.',
    savedOf: (saved, target) => `${saved} of ${target}`,
    projectReached: 'Goal reached 🎉',
    rhythmToDefine: 'Savings pace to be set',
    aboutMonths: (n) => `≈ ${months(n)} at current pace`,
    deleteProjectTitle: 'Delete this project?',
  },

  simulation: {
    title: 'Simulate an investment',
    subtitle: 'What can your saving effort become over time, once tax is deducted?',
    monthlyPayment: 'Monthly contribution',
    myCapacity: (amount) => `My capacity: ${amount}`,
    myGoal: (amount) => `My goal: ${amount}`,
    initialCapital: 'Starting capital',
    mySavings: (amount) => `My current savings: ${amount}`,
    duration: (years) => `Duration: ${years}`,
    oneYear: '1 year',
    fortyYears: '40 years',
    inflationLabel: (pct) => `Inflation assumed: ${pct}`,
    inflationHint: 'Used to express the result in today’s euros, at constant purchasing power.',
    supportTitle: 'Investment vehicle',
    yieldRetained: 'Annual return used: ',
    backToDefault: (pct) => `Back to the default rate (${pct})`,
    noTax: 'No tax on interest',
    taxOnGains: (pct, years) => `${pct} on gains at ${years}`,
    ceiling: (amount) => `Contribution cap: ${amount}`,
    ceilingReached: (years) => ` — reached after ${years} year(s)`,
    resultTitle: (years) => `Result after ${years}`,
    netCapital: 'NET CAPITAL AFTER TAX',
    resultSub: (gains, deposited) => `including ${gains} of net gains, on ${deposited} paid in`,
    payments: (amount) => `Paid in ${amount}`,
    netInterest: (amount) => `Net interest ${amount}`,
    evolution: 'Growth',
    currentEuros: 'Nominal euros',
    constantEuros: 'Constant euros',
    netValue: 'Net value',
    netValueReal: 'Net value in today’s euros',
    totalDeposited: 'Total paid in',
    realNote: (nominal, real, inflation) =>
      `At ${inflation} inflation, your ${nominal} will be worth ${real} in today’s purchasing power.`,
    comparisonTitle: 'Comparing the vehicles',
    sameEffort: (amount, years) =>
      `Same effort (${amount} a month for ${years}), exit taxation applied.`,
    grossRate: (pct) => `${pct} gross`,
    netOfTax: 'tax-free',
    taxOf: (pct) => `${pct} tax`,
    disclaimer:
      'These projections are orders of magnitude, not a promise of return nor investment advice. Rates are adjustable because they change over time; the tax model is simplified (no marginal rate, no allowances, no product fees). Risk-bearing vehicles can lose value.',
    frenchProductsNote:
      'The vehicles offered and their taxation are those of French law. They stay the same whatever language you choose.',
  },

  cashflow: {
    title: 'This month’s flow',
    byCategory: 'By category',
    lineByLine: 'Line by line',
    inflows: 'In',
    outflows: 'Out',
    unallocated: 'Unallocated',
    overdraft: 'Shortfall',
    budgetNode: 'Budget',
    deficitNode: 'Drawn from savings',
    unallocatedNode: 'Unallocated',
    emptyTitle: 'No flow to draw yet',
    emptyBody:
      'Add at least one income and one expense: the diagram will then show where every euro goes.',
    emptyAction: 'Add a line',
    howToRead: 'How to read it',
    howToReadBody:
      'Money reads from left to right: your income feeds the budget, which then splits across your spending categories. Each ribbon’s thickness is proportional to the monthly amount, so what really weighs is visible at a glance.',
    unallocatedNote: (amount) =>
      `The green “Unallocated” ribbon is the ${amount} your budget frees up with no destination. Giving it an explicit purpose — scheduled saving, a project — is the surest way not to watch it disappear.`,
    deficitNote: (amount) =>
      `The red ribbon means your expenses exceed your income by ${amount}: that amount is taken from your savings every month.`,
  },

  entry: {
    newLine: 'New line',
    editLine: 'Edit',
    aCharge: 'An expense',
    anIncome: 'An income',
    equivalentPerMonth: (amount) => `equals ${amount} a month`,
    shortcuts: 'Shortcuts',
    label: 'Label',
    labelPlaceholderIncome: 'Net salary, bonus…',
    labelPlaceholderExpense: 'Rent, subscription, groceries…',
    category: 'Category',
    advancedOptions: 'Advanced options',
    variableAmount: 'Variable amount',
    variableHint:
      'Groceries, fuel, leisure… These are excluded from fixed costs and taken out of what you have left to live on.',
    incomeDay: 'Day it comes in',
    expenseDay: 'Day it goes out',
    dayHint: 'Feeds the “coming up” list on the dashboard.',
    hasEnd: 'This expense has an end date',
    hasEndHint: 'Loan, lease, commitment: Formiga anticipates the money that will free up.',
    remainingPayments: 'Remaining payments',
    endExpected: (date) => `Ends in ${date}.`,
    deleteLine: 'Delete this line',
    deleteTitle: 'Delete this line?',
    deleteBody: (label) => `“${label}” will be permanently removed from the budget.`,
    addToBudget: 'Add to budget',
    copySuffix: (label) => `${label} (copy)`,
  },

  onboarding: {
    lead:
      'An ant does not move the anthill in a day. Lay out your income and your expenses, see exactly what is left — then what it could become.',
    featureDisposableTitle: 'Left to live on',
    featureDisposableBody: 'The real amount available, down to the day.',
    featureGoalsTitle: 'Goals',
    featureGoalsBody: 'A savings target, projects, a direction.',
    featureSimulationTitle: 'Simulation',
    featureSimulationBody: 'Livret A, PEA, life insurance: project over X years.',
    featureLocalTitle: '100 % on-device',
    featureLocalBody: 'Your data never leaves your phone.',
    languageStepTitle: 'Choose your language',
    languageStepSubtitle: 'You can change it at any time in the settings.',
    nameStepTitle: 'What should we call you?',
    nameStepSubtitle: 'Only to say hello. You can leave it blank.',
    firstName: 'First name',
    firstNamePlaceholder: 'Your first name',
    incomeStepTitle: 'Your monthly income',
    incomeStepSubtitle: 'The net amount that actually lands in your account.',
    netSalary: 'Net monthly salary',
    otherIncome: 'Other regular income',
    otherIncomeHint: 'Rent received, benefits, pension, side work.',
    otherIncomeLabel: 'Other income',
    monthlyTotal: 'Monthly total',
    expensesStepTitle: 'Your main expenses',
    expensesStepSubtitle: 'A rough estimate is enough: everything stays editable, line by line.',
    starterHousing: 'Rent / mortgage',
    starterUtilities: 'Utilities & telecom',
    starterInsurance: 'Insurance',
    starterTransport: 'Transport',
    starterFood: 'Groceries',
    starterSubscriptions: 'Subscriptions',
    enteredCharges: 'Expenses entered',
    estimatedDisposable: 'Estimated left to live on',
    goalStepTitle: 'Your savings goal',
    goalStepSubtitle: 'How much would you like to set aside each month? You can adjust it any time.',
    monthlyTarget: 'Monthly savings target',
    currentSavings: 'Savings already put aside',
    currentSavingsHint:
      'Savings accounts, life insurance, securities. Used to measure your safety net.',
    start: 'Get started',
    continue: 'Continue',
    finish: 'Finish',
    demo: 'Explore with a sample budget',
  },

  settings: {
    title: 'Settings',
    firstName: 'First name',
    firstNamePlaceholder: 'Your first name',
    language: 'Language',
    languageNote: 'Labels you typed yourself are not translated: they are your data.',
    appearance: 'Appearance',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    appearanceSystemNote: (scheme) =>
      `Formiga follows your device setting, currently ${scheme}.`,
    schemeDark: 'dark',
    schemeLight: 'light',
    appearanceFixedNote: 'The theme stays fixed, whatever your device setting.',
    myData: 'My data',
    budgetLines: 'Budget lines',
    savingsProjects: 'Savings projects',
    dataNote:
      'Everything is stored on this device only. No data is sent to a server, and the app works offline. Uninstalling erases everything: remember to export.',
    backup: 'Backup',
    exportData: 'Export my data',
    importData: 'Import a backup',
    cancelImport: 'Cancel import',
    pasteHere: 'Paste the exported content here',
    pasteHint: 'Your current budget will be replaced.',
    restore: 'Restore',
    exportTitle: 'Formiga backup',
    exportErrorTitle: 'Export failed',
    exportErrorBody: 'Sharing could not be opened on this device.',
    importSuccessTitle: 'Import successful',
    importSuccessBody: (n) => `${n} lines restored.`,
    importErrorTitle: 'Import failed',
    importErrorBody: 'The pasted content is not a valid Formiga backup.',
    dangerZone: 'Danger zone',
    loadSample: 'Load a sample budget',
    loadSampleTitle: 'Load the sample?',
    loadSampleBody: 'Your current budget will be replaced by a demonstration set.',
    load: 'Load',
    resetAll: 'Erase everything',
    resetTitle: 'Erase everything?',
    resetBody:
      'Your income, expenses, goals and projects will be permanently deleted from this device.',
    startOver: 'Start over',
    startOverTitle: 'Start over?',
    startOverBody:
      'Your income, expenses, goals and projects will be erased from this device, and the guided setup will run again. Your language and theme are kept.',
    startOverConfirm: 'Start over',
    footer: 'Formiga · budget & savings · v1.0',
  },

  sample: {
    annualBonus: 'Annual bonus',
    studioRent: 'Studio rent received',
    carLoan: 'Car loan',
    internetMobile: 'Internet + mobile',
    propertyTax: 'Property tax',
    savingTransfer: 'Savings transfer',
    leisure: 'Leisure & going out',
    tripProject: 'Trip to Japan',
    homeDeposit: 'House deposit',
  },

  score: {
    excellent: 'Excellent',
    solid: 'Solid',
    correct: 'Fair',
    fragile: 'Fragile',
    poor: 'Needs work',
    budgetHealth: 'Budget health',
    compositeNote: 'A composite score over five criteria, recalculated on every change.',
    savingsRate: 'Savings rate',
    savingsRateHint: 'Aim to set aside 20 % of your income each month.',
    monthBalance: 'Month balance',
    monthBalanceHint: 'Finish the month with a positive margin.',
    housingWeight: 'Housing weight',
    housingWeightHint: 'Housing should stay below 30 % of income.',
    debtRatio: 'Debt-to-income ratio',
    debtRatioHint: 'Lenders cap borrowing at 35 % of income.',
    emergencyFund: 'Emergency fund',
    emergencyFundHint: (n) => `${months(n)} of expenses to keep in reserve.`,
  },

  advice: {
    title: 'Advice',
    subtitle:
      'An automatic read of your figures. Everything is computed on the device, nothing is sent anywhere.',
    toneCritical: 'Deal with this',
    toneWarning: 'Keep an eye on',
    toneTip: 'Worth trying',
    toneWin: 'Well done',
    nothingTitle: 'Nothing to report',
    nothingBody: 'Your budget triggers no alert. Come back once your figures have changed.',
    allocationTitle: 'Where to put your saving effort',
    allocationSub: (amount) =>
      `An indicative split of your ${amount} a month, from the most liquid to the longest term.`,
    allocationSimulate: 'Simulate this split',
    perMonthBadge: (amount) => `${amount} / month`,
    disclaimer:
      'Formiga applies general budgeting rules to your figures. This is neither investment advice nor personal guidance: for a decision that commits you, talk to a professional.',

    allocationEmergency: 'Livret A',
    allocationEmergencyWhy:
      'Until the emergency fund is built, priority goes to a liquid, guaranteed account.',
    allocationSecure: 'Livret A / LDDS',
    allocationSecureWhy: 'A safety net that stays available.',
    allocationMid: 'Life insurance euro fund',
    allocationMidWhy:
      'Projects 3 to 8 years out: guaranteed capital and tax that eases with time.',
    allocationLong: 'PEA',
    allocationLongWhy: 'Beyond 8 years: this is where compound interest does the work.',

    onboardingIncomeTitle: 'Start with your income',
    onboardingIncomeBody:
      'Add your net salary and any extra income: everything else on the dashboard follows from it.',
    onboardingIncomeAction: 'Add income',
    onboardingExpensesTitle: 'Add your fixed costs',
    onboardingExpensesBody:
      'Rent, loans, utilities, subscriptions… These are what determine what you have left to live on.',
    onboardingExpensesAction: 'Add an expense',

    deficitTitle: 'Your month is in deficit',
    deficitBody: (monthly, yearly) =>
      `Your expenses exceed your income by ${monthly} a month, that is ${yearly} over a year. Start with what you can choose: subscriptions, leisure, insurance to renegotiate.`,
    deficitAction: 'See my expenses',

    tightTitle: 'Balanced, but with no room',
    tightBody: (margin) =>
      `You are left with only ${margin} at the end of the month. One surprise would tip the budget over: freeing up even 50 € would already change things.`,

    savingsExcellentTitle: 'Remarkable savings rate',
    savingsExcellentBody: (rate, yearly) =>
      `You set aside ${rate} of your income, well above the household average. At this pace you save ${yearly} a year.`,

    savingsLowTitle: 'Let small steps do the work',
    savingsLowBody: (rate, tenPercent) =>
      `You save ${rate} of your income. Moving to 10 % would mean ${tenPercent} a month — often reachable by acting on just two or three lines.`,

    automateTitle: 'Automate your saving',
    automateBody: (margin) =>
      `You free up ${margin} of margin, but no savings transfer is scheduled. An automatic transfer on payday puts the money out of reach before it gets spent.`,
    automateAction: 'Schedule a saving',

    housingTitle: 'Housing weighs heavily',
    housingBody: (ratio) =>
      `Housing takes ${ratio} of your income, against a usual benchmark of 30 %. Renegotiating loan insurance, housing benefits or sharing are the most effective levers here.`,

    debtHighTitle: 'Debt ratio above the threshold',
    debtHighBody: (ratio) =>
      `Your loans represent ${ratio} of your income, beyond the 35 % lenders use. Consolidating or refinancing can lighten the monthly payment.`,

    debtWatchTitle: 'Debt worth watching',
    debtWatchBody: (ratio) =>
      `At ${ratio}, you are approaching the 35 % ceiling that governs access to a new loan.`,

    subscriptionsTitle: 'Review your subscriptions',
    subscriptionsBody: (count, monthly, yearly) =>
      `${count} subscription${count > 1 ? 's' : ''} for ${monthly} a month, that is ${yearly} a year. This is where you recover the most money for the least effort.`,
    subscriptionsAction: 'See the detail',

    emergencyTitle: 'Build your safety net',
    emergencyBody: (covered, target, missing, monthsToGo) =>
      `You cover ${covered} months of expenses out of the ${target} targeted. You are ${missing} short${
        monthsToGo !== null ? `, that is ${months(monthsToGo)} at your current pace` : ''
      }.`,
    emergencyMetric: (covered, target) => `${covered} / ${months(target)}`,
    emergencyAction: 'Adjust my goals',

    emergencyDoneTitle: 'Emergency fund complete',
    emergencyDoneBody: (savings, covered) =>
      `Your ${savings} cover ${covered} months of expenses. The surplus can now aim at the medium and long term, where return matters more than availability.`,
    emergencyDoneMetric: (covered) => `${covered} months`,
    emergencyDoneAction: 'Simulate an investment',

    goalReachedTitle: 'Savings goal reached',
    goalReachedBody: (effort, target, canRaise) =>
      `Your budget frees up ${effort} against a ${target} goal. ${
        canRaise ? 'You could even raise the bar.' : 'Keep this pace.'
      }`,

    goalCloseTitle: 'The goal is within reach',
    goalCloseBody: (missing, perDay) =>
      `You are ${missing} a month short of your target, roughly ${perDay} a day.`,

    goalFarTitle: 'The goal is still far',
    goalFarBody: (ratio, target, missing) =>
      `You reach ${ratio} of your ${target} goal. Either lower the target so it stays motivating, or free up ${missing} from your expenses.`,
    goalFarAction: 'Review my goals',

    capExceededTitle: 'Variable spending above the cap',
    capExceededBody: (planned, cap) =>
      `You plan ${planned} of variable spending against a cap set at ${cap}.`,

    dailyLowTitle: 'Tight daily allowance',
    dailyLowBody: (perDay) =>
      `Once fixed costs are paid, ${perDay} a day is left for everything else. Check that no fixed cost is in fact negotiable.`,
    dailyLowMetric: (perDay) => `${perDay}/day`,

    creditEndingTitle: 'An expense is about to end',
    creditEndingBody: (label, monthsLeftCount, relief) =>
      `“${label}” stops in ${months(monthsLeftCount)}: ${relief} a month frees up. Decide now where it goes, or it will dissolve into everyday spending.`,
    creditEndingMetric: (relief) => `+${relief}/month`,
    creditEndingAction: 'Simulate this amount',

    taxProvisionTitle: 'No tax set aside',
    taxProvisionBody:
      'You declare self-employment income but no tax or contribution line. Setting money aside monthly avoids the cash gap when the bill arrives.',
    taxProvisionAction: 'Add a provision',

    encouragementsLow: [
      'Every euro you spot is a euro you take back. Simply laying it all out is already half the journey.',
      'A tight budget is not a failure, it is a constraint to work around. Start with the smallest line you can cut.',
      'An ant does not move the anthill in a day. One adjustment a week is enough to change the year.',
      'Hard months teach more than easy ones. You will know exactly where you stand.',
    ],
    encouragementsMid: [
      'Your budget stands up. The next step comes down to a single line: pick which one.',
      'Regular beats ambitious. A modest automatic transfer beats a big forgotten resolution.',
      'You are above the household average. A few points more and you join the leading pack.',
      'The hard part is done: you know where your money goes. The rest is fine-tuning.',
    ],
    encouragementsHigh: [
      'Solid budget, discipline in place. The question becomes return rather than effort.',
      'At this pace time works for you: compound interest does the rest.',
      'You save more than the vast majority of households. Remember to allow yourself a guilt-free treat too.',
      'Target met. The best thing to do now is change nothing.',
    ],
  },
};
