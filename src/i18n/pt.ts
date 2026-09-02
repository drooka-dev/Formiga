import type { Dict } from './fr';

/** Acordo singular/plural, reutilizado sempre que se mostra um número de meses. */
const months = (n: number) => `${n} ${n === 1 ? 'mês' : 'meses'}`;

/** Português de Portugal (pt-PT), não do Brasil. */
export const pt: Dict = {
  locale: 'pt-PT',
  languageName: 'Português',

  common: {
    cancel: 'Cancelar',
    delete: 'Eliminar',
    save: 'Guardar',
    edit: 'Editar',
    detail: 'Detalhe',
    add: 'Adicionar',
    perMonth: 'por mês',
    months,
    years: (n) => `${n} ano${n > 1 ? 's' : ''}`,
    labelSeparator: ': ',
    thousandsSuffix: 'k€',
    millionsSuffix: 'M€',
  },

  tabs: {
    dashboard: 'Início',
    budget: 'Orçamento',
    goals: 'Objetivos',
    simulation: 'Simular',
    advice: 'Conselhos',
    dashboardTitle: 'Painel',
  },

  categories: {
    salary: 'Salário',
    freelance: 'Atividade por conta própria',
    rental: 'Rendas recebidas',
    investment: 'Investimentos e dividendos',
    benefits: 'Apoios e prestações',
    other_income: 'Outro rendimento',
    housing: 'Habitação',
    loan: 'Crédito',
    utilities: 'Energia e telecomunicações',
    subscriptions: 'Subscrições',
    insurance: 'Seguros',
    transport: 'Transportes',
    food: 'Alimentação',
    health: 'Saúde',
    childcare: 'Filhos e creche',
    taxes: 'Impostos',
    leisure: 'Lazer e saídas',
    savings: 'Poupança programada',
    other_expense: 'Outra despesa',
  },

  frequencies: {
    weekly: 'Por semana',
    monthly: 'Por mês',
    quarterly: 'Por trimestre',
    semiannual: 'Por semestre',
    yearly: 'Por ano',
    weeklyShort: '/sem.',
    monthlyShort: '/mês',
    quarterlyShort: '/trim.',
    semiannualShort: '/sem.',
    yearlyShort: '/ano',
  },

  quickIncome: {
    netSalary: 'Salário líquido',
    bonus: 'Prémio',
    rentReceived: 'Renda recebida',
    benefits: 'Apoios',
    dividends: 'Dividendos',
    freelance: 'Trabalho independente',
  },

  quickExpense: {
    rent: 'Renda',
    mortgage: 'Crédito habitação',
    electricity: 'Eletricidade',
    internet: 'Internet',
    mobile: 'Telemóvel',
    streaming: 'Streaming de vídeo',
    music: 'Música',
    gym: 'Ginásio',
    homeInsurance: 'Seguro de casa',
    carInsurance: 'Seguro automóvel',
    healthInsurance: 'Seguro de saúde',
    groceries: 'Supermercado',
    fuel: 'Combustível',
    publicTransport: 'Transportes públicos',
    childcare: 'Creche / ama',
    incomeTax: 'IRS',
    autoSaving: 'Poupança automática',
  },

  risk: {
    none: 'Capital garantido',
    low: 'Risco baixo',
    medium: 'Risco moderado',
    high: 'Risco elevado',
  },

  products: {
    livretA: {
      label: 'Livret A',
      description:
        'Conta poupança regulada francesa. Capital garantido e juros totalmente isentos de imposto.',
      liquidity: 'Disponível a qualquer momento',
    },
    ldds: {
      label: 'LDDS',
      description: 'A mesma taxa do Livret A, com limite mais baixo. Podem ser acumulados.',
      liquidity: 'Disponível a qualquer momento',
    },
    lep: {
      label: 'LEP',
      description: 'Conta francesa sujeita a condição de rendimentos. A melhor taxa garantida do mercado.',
      liquidity: 'Disponível a qualquer momento',
    },
    pel: {
      label: 'PEL',
      description: 'Taxa fixada na abertura. Os juros são tributados à taxa fixa de 30 %.',
      liquidity: 'Bloqueado 4 anos para manter a taxa',
    },
    avEuro: {
      label: 'Seguro de vida — fundo em euros',
      description: 'Capital garantido pela seguradora. Fiscalidade aliviada ao fim de 8 anos.',
      liquidity: 'Resgatável, fiscalidade suave após 8 anos',
    },
    avUc: {
      label: 'Seguro de vida — unidades de conta',
      description: 'Capital não garantido, investido em fundos. Útil para a transmissão do património.',
      liquidity: 'Resgatável, fiscalidade suave após 8 anos',
    },
    pea: {
      label: 'PEA',
      description: 'Ações europeias. Ao fim de 5 anos aplicam-se apenas as contribuições sociais.',
      liquidity: 'Levantamentos sem encerrar a conta após 5 anos',
    },
    cto: {
      label: 'Conta de títulos',
      description: 'Sem limite nem restrição geográfica, mas 30 % de imposto sobre as mais-valias.',
      liquidity: 'Disponível a qualquer momento',
    },
    scpi: {
      label: 'SCPI',
      description: 'Imobiliário de arrendamento em cotas. A fiscalidade real é muitas vezes mais pesada.',
      liquidity: 'Venda demorada (semanas a meses)',
    },
  },

  dashboard: {
    goodNight: 'Boa noite',
    goodMorning: 'Bom dia',
    goodEvening: 'Boa tarde',
    tagline: 'O seu orçamento, migalha a migalha',
    disposableIncome: 'DISPONÍVEL PARA VIVER',
    perDayAndDaysLeft: (perDay, days) => `ou seja ${perDay} por dia · faltam ${days} dias`,
    fixedCharges: 'Despesas fixas',
    savings: 'Poupança',
    toLive: 'Para viver',
    income: 'Rendimentos',
    charges: 'Despesas',
    margin: 'Margem',
    savingGoalTitle: 'Objetivo de poupança do mês',
    ofGoal: (pct) => `${pct} do objetivo`,
    onTarget: (target) => `de ${target} pretendidos`,
    cashflowTitle: 'O percurso do seu dinheiro',
    enlarge: 'Ampliar',
    whereMoneyGoes: 'Para onde vai o seu dinheiro',
    addChargesToSee: 'Adicione as suas despesas para ver a repartição.',
    projectionTitle: 'Projeção a 12 meses',
    projectionSub: (effort) =>
      `poupança acumulada dentro de um ano se mantiver este ritmo${effort ? ` (${effort} por mês)` : ''}`,
    upcoming: 'Próximos vencimentos',
    today: 'hoje',
    inDays: (n) => `daqui a ${n} dia${n > 1 ? 's' : ''}`,
    wordOfTheDay: 'A frase do dia',
    allAdvice: 'Todos os conselhos',
    addBudgetLine: 'Adicionar uma linha ao orçamento',
    sampleBannerTitle: 'Está a explorar um orçamento de exemplo',
    sampleBannerBody:
      'Estes números são fictícios. Recomece do zero para introduzir os seus rendimentos e despesas — ou edite uma linha para tornar este exemplo seu.',
    sampleBannerAction: 'Introduzir os meus dados',
    emptyTitle: 'Ainda não há nada para mostrar',
    emptyBody:
      'Adicione o seu primeiro rendimento: o disponível para viver, a pontuação e as projeções são calculados a partir daí.',
    emptyAction: 'Adicionar rendimento',
  },

  budget: {
    title: 'O meu orçamento',
    subtitle: 'Tudo é convertido para o equivalente mensal, qualquer que seja a periodicidade.',
    chargesTab: (total) => `Despesas · ${total}`,
    incomeTab: (total) => `Rendimentos · ${total}`,
    fixed: 'Fixas',
    variable: 'Variáveis',
    savings: 'Poupança',
    emptyIncomeTitle: 'Nenhum rendimento registado',
    emptyIncomeBody:
      'Salário, rendas, apoios, dividendos: adicione tudo o que entra todos os meses.',
    emptyExpenseTitle: 'Nenhuma despesa registada',
    emptyExpenseBody:
      'Renda, crédito, energia, subscrições, supermercado: adicione tudo o que sai todos os meses.',
    linesAndShare: (lines, pct) => `${lines} linha${lines > 1 ? 's' : ''} · ${pct} % do total`,
    pausedCount: (n) => `Em pausa (${n})`,
    variableBadge: 'variável',
    withEndBadge: 'com fim',
    onDay: (day) => `dia ${day} do mês`,
    monthly: 'mensal',
    addCharge: 'Adicionar uma despesa',
    addIncome: 'Adicionar um rendimento',
  },

  goals: {
    title: 'Os meus objetivos',
    subtitle: 'Defina uma meta de poupança, um limite de despesa e acompanhe os seus projetos.',
    monthlyTargetTitle: 'Poupança mensal pretendida',
    budgetYields: (amount) => `O seu orçamento liberta ${amount}`,
    targetMet: (margin, yearly) =>
      `Objetivo cumprido, com ${margin} de margem. Num ano: ${yearly}.`,
    targetMissing: (missing, yearly) =>
      `Faltam ${missing} por mês. Num ano, o objetivo representaria ${yearly}.`,
    spendingCapTitle: 'Limite de despesas variáveis',
    spendingCapBody: (planned) =>
      `Supermercado, combustível, lazer: o valor a não ultrapassar por mês. Previsto atualmente: ${planned}.`,
    underCap: (amount) => `${amount} abaixo do limite`,
    overCap: (amount) => `${amount} acima`,
    noCap: 'Sem limite definido',
    emergencyTitle: 'Fundo de emergência',
    alreadySaved: 'Poupança já constituída',
    monthsToCover: 'Meses de despesas a cobrir',
    monthsHint: 'Três a seis meses de despesas é a referência mais habitual.',
    outOf: (total) => `de ${total}`,
    emergencyComplete:
      'Rede de segurança completa. O excedente pode agora visar um horizonte mais longo.',
    emergencyNoCapacity:
      'Sem capacidade de poupança de momento: comece por libertar uma margem mensal.',
    emergencyIn: (n) => `Completo daqui a ${months(n)} ao ritmo atual.`,
    projectsTitle: 'Projetos de poupança',
    newProject: 'Novo',
    projectName: 'Nome do projeto',
    projectNamePlaceholder: 'Viagem, entrada, carro…',
    projectTarget: 'Valor a atingir',
    projectIcon: 'Ícone',
    createProject: 'Criar projeto',
    projectsEmpty:
      'Um projeto dá um rumo concreto à poupança: uma viagem, uma entrada, um carro novo. A Formiga calcula o prazo ao seu ritmo atual.',
    savedOf: (saved, target) => `${saved} de ${target}`,
    projectReached: 'Objetivo atingido 🎉',
    rhythmToDefine: 'Ritmo de poupança por definir',
    aboutMonths: (n) => `≈ ${months(n)} ao ritmo atual`,
    deleteProjectTitle: 'Eliminar este projeto?',
  },

  simulation: {
    title: 'Simular um investimento',
    subtitle: 'Quanto pode render o seu esforço de poupança ao longo do tempo, já depois de impostos?',
    monthlyPayment: 'Entrega mensal',
    myCapacity: (amount) => `A minha capacidade: ${amount}`,
    myGoal: (amount) => `O meu objetivo: ${amount}`,
    initialCapital: 'Capital inicial',
    mySavings: (amount) => `A minha poupança atual: ${amount}`,
    duration: (years) => `Duração: ${years}`,
    oneYear: '1 ano',
    fortyYears: '40 anos',
    inflationLabel: (pct) => `Inflação considerada: ${pct}`,
    inflationHint:
      'Serve para exprimir o resultado em euros de hoje, a poder de compra constante.',
    supportTitle: 'Produto de investimento',
    yieldRetained: 'Rendimento anual considerado: ',
    backToDefault: (pct) => `Voltar à taxa predefinida (${pct})`,
    noTax: 'Sem imposto sobre os juros',
    taxOnGains: (pct, years) => `${pct} sobre as mais-valias a ${years}`,
    ceiling: (amount) => `Limite de entregas: ${amount}`,
    ceilingReached: (years) => ` — atingido ao fim de ${years} ano(s)`,
    resultTitle: (years) => `Resultado a ${years}`,
    netCapital: 'CAPITAL LÍQUIDO APÓS IMPOSTOS',
    resultSub: (gains, deposited) =>
      `dos quais ${gains} de ganhos líquidos, para ${deposited} entregues`,
    payments: (amount) => `Entregas ${amount}`,
    netInterest: (amount) => `Juros líquidos ${amount}`,
    evolution: 'Evolução',
    currentEuros: 'Euros correntes',
    constantEuros: 'Euros constantes',
    netValue: 'Valor líquido',
    netValueReal: 'Valor líquido em euros de hoje',
    totalDeposited: 'Total entregue',
    realNote: (nominal, real, inflation) =>
      `Com ${inflation} de inflação, os seus ${nominal} valerão ${real} em poder de compra de hoje.`,
    comparisonTitle: 'Comparação dos produtos',
    sameEffort: (amount, years) =>
      `O mesmo esforço (${amount} por mês durante ${years}), com a fiscalidade de saída aplicada.`,
    grossRate: (pct) => `${pct} bruto`,
    netOfTax: 'isento de imposto',
    taxOf: (pct) => `${pct} de imposto`,
    disclaimer:
      'Estas projeções são ordens de grandeza, não uma promessa de rendimento nem aconselhamento de investimento. As taxas são ajustáveis porque mudam ao longo do tempo; a fiscalidade modelada é simplificada (sem escalão marginal, sem deduções, sem comissões). Os produtos com risco podem perder valor.',
    frenchProductsNote:
      'Os produtos apresentados e a respetiva fiscalidade são os do direito francês. Mantêm-se iguais qualquer que seja o idioma escolhido.',
  },

  cashflow: {
    title: 'Fluxo do mês',
    byCategory: 'Por categoria',
    lineByLine: 'Linha a linha',
    inflows: 'Entradas',
    outflows: 'Saídas',
    unallocated: 'Por afetar',
    overdraft: 'Descoberto',
    budgetNode: 'Orçamento',
    deficitNode: 'Retirado da poupança',
    unallocatedNode: 'Sobra por afetar',
    emptyTitle: 'Ainda não há fluxo para desenhar',
    emptyBody:
      'Adicione pelo menos um rendimento e uma despesa: o diagrama mostrará então o percurso de cada euro.',
    emptyAction: 'Adicionar uma linha',
    howToRead: 'Como ler o diagrama',
    howToReadBody:
      'O dinheiro lê-se da esquerda para a direita: os rendimentos alimentam o orçamento, que se reparte depois pelas categorias de despesa. A espessura de cada faixa é proporcional ao valor mensal, o que torna visível de imediato o que realmente pesa.',
    unallocatedNote: (amount) =>
      `A faixa verde «Sobra por afetar» representa os ${amount} que o seu orçamento liberta sem destino definido. Dar-lhes um destino explícito — poupança programada, um projeto — é a forma mais segura de não os ver desaparecer.`,
    deficitNote: (amount) =>
      `A faixa vermelha indica que as suas despesas excedem os rendimentos em ${amount}: esse valor é retirado da poupança todos os meses.`,
  },

  entry: {
    newLine: 'Nova linha',
    editLine: 'Editar',
    aCharge: 'Uma despesa',
    anIncome: 'Um rendimento',
    equivalentPerMonth: (amount) => `equivale a ${amount} por mês`,
    shortcuts: 'Atalhos',
    label: 'Descrição',
    labelPlaceholderIncome: 'Salário líquido, prémio…',
    labelPlaceholderExpense: 'Renda, subscrição, supermercado…',
    category: 'Categoria',
    advancedOptions: 'Opções avançadas',
    variableAmount: 'Valor variável',
    variableHint:
      'Supermercado, combustível, lazer… Estas despesas ficam fora das despesas fixas e são descontadas ao disponível para viver.',
    incomeDay: 'Dia de recebimento',
    expenseDay: 'Dia de débito',
    dayHint: 'Alimenta os próximos vencimentos no painel.',
    hasEnd: 'Esta despesa tem fim',
    hasEndHint:
      'Crédito, aluguer, compromisso: a Formiga antecipa o dinheiro que vai ficar livre.',
    remainingPayments: 'Prestações em falta',
    endExpected: (date) => `Fim previsto em ${date}.`,
    deleteLine: 'Eliminar esta linha',
    deleteTitle: 'Eliminar esta linha?',
    deleteBody: (label) => `«${label}» será removida definitivamente do orçamento.`,
    addToBudget: 'Adicionar ao orçamento',
    copySuffix: (label) => `${label} (cópia)`,
  },

  onboarding: {
    lead:
      'A formiga não muda o formigueiro num dia. Registe os seus rendimentos e despesas e veja exatamente o que lhe sobra — e depois no que isso se pode tornar.',
    featureDisposableTitle: 'Disponível para viver',
    featureDisposableBody: 'O valor realmente disponível, ao dia.',
    featureGoalsTitle: 'Objetivos',
    featureGoalsBody: 'Uma meta de poupança, projetos, um rumo.',
    featureSimulationTitle: 'Simulação',
    featureSimulationBody: 'Livret A, PEA, seguro de vida: projete a X anos.',
    featureLocalTitle: '100 % local',
    featureLocalBody: 'Os seus dados ficam no telemóvel.',
    languageStepTitle: 'Escolha o seu idioma',
    languageStepSubtitle: 'Pode mudar a qualquer momento nas definições.',
    nameStepTitle: 'Como se chama?',
    nameStepSubtitle: 'Apenas para lhe dizer olá. Pode deixar em branco.',
    firstName: 'Nome',
    firstNamePlaceholder: 'O seu nome',
    incomeStepTitle: 'Os seus rendimentos mensais',
    incomeStepSubtitle: 'O valor líquido que entra realmente na conta.',
    netSalary: 'Salário líquido mensal',
    otherIncome: 'Outros rendimentos regulares',
    otherIncomeHint: 'Rendas recebidas, apoios, pensão, atividade complementar.',
    otherIncomeLabel: 'Outros rendimentos',
    monthlyTotal: 'Total mensal',
    expensesStepTitle: 'As suas principais despesas',
    expensesStepSubtitle:
      'Uma estimativa chega: tudo fica editável depois, linha a linha.',
    starterHousing: 'Renda / crédito habitação',
    starterUtilities: 'Energia e telecomunicações',
    starterInsurance: 'Seguros',
    starterTransport: 'Transportes',
    starterFood: 'Supermercado',
    starterSubscriptions: 'Subscrições',
    enteredCharges: 'Despesas introduzidas',
    estimatedDisposable: 'Disponível estimado',
    goalStepTitle: 'O seu objetivo de poupança',
    goalStepSubtitle:
      'Quanto quer pôr de lado todos os meses? Pode ajustar a qualquer momento.',
    monthlyTarget: 'Poupança mensal pretendida',
    currentSavings: 'Poupança já constituída',
    currentSavingsHint:
      'Contas poupança, seguros de vida, títulos. Serve para medir a sua rede de segurança.',
    start: 'Começar',
    continue: 'Continuar',
    finish: 'Concluir',
    demo: 'Explorar com um orçamento de exemplo',
  },

  settings: {
    title: 'Definições',
    firstName: 'Nome',
    firstNamePlaceholder: 'O seu nome',
    language: 'Idioma',
    languageNote:
      'As descrições que escreveu não são traduzidas: são os seus dados.',
    appearance: 'Aspeto',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Escuro',
    appearanceSystemNote: (scheme) =>
      `A Formiga segue a definição do seu aparelho, atualmente ${scheme}.`,
    schemeDark: 'escuro',
    schemeLight: 'claro',
    appearanceFixedNote:
      'O tema mantém-se fixo, independentemente da definição do aparelho.',
    myData: 'Os meus dados',
    budgetLines: 'Linhas de orçamento',
    savingsProjects: 'Projetos de poupança',
    dataNote:
      'Tudo é guardado apenas neste aparelho. Nenhum dado é enviado para um servidor e a aplicação funciona sem ligação. Desinstalar apaga tudo: não se esqueça de exportar.',
    backup: 'Cópia de segurança',
    exportData: 'Exportar os meus dados',
    importData: 'Importar uma cópia',
    cancelImport: 'Cancelar a importação',
    pasteHere: 'Cole aqui o conteúdo exportado',
    pasteHint: 'O orçamento atual será substituído.',
    restore: 'Restaurar',
    exportTitle: 'Cópia de segurança Formiga',
    exportErrorTitle: 'Exportação impossível',
    exportErrorBody: 'Não foi possível abrir a partilha neste aparelho.',
    importSuccessTitle: 'Importação concluída',
    importSuccessBody: (n) => `${n} linhas restauradas.`,
    importErrorTitle: 'Importação impossível',
    importErrorBody: 'O conteúdo colado não é uma cópia Formiga válida.',
    dangerZone: 'Zona sensível',
    loadSample: 'Carregar um orçamento de exemplo',
    loadSampleTitle: 'Carregar o exemplo?',
    loadSampleBody: 'O seu orçamento atual será substituído por um conjunto de demonstração.',
    load: 'Carregar',
    resetAll: 'Apagar tudo',
    resetTitle: 'Apagar tudo?',
    resetBody:
      'Os seus rendimentos, despesas, objetivos e projetos serão eliminados definitivamente deste aparelho.',
    startOver: 'Recomeçar do zero',
    startOverTitle: 'Recomeçar do zero?',
    startOverBody:
      'Os seus rendimentos, despesas, objetivos e projetos serão apagados deste aparelho e a configuração guiada recomeça. O idioma e o tema são mantidos.',
    startOverConfirm: 'Recomeçar',
    footer: 'Formiga · orçamento e poupança · v1.0',
  },

  sample: {
    annualBonus: 'Prémio anual',
    studioRent: 'Renda do estúdio',
    carLoan: 'Crédito automóvel',
    internetMobile: 'Internet + telemóvel',
    propertyTax: 'IMI',
    savingTransfer: 'Transferência para poupança',
    leisure: 'Lazer e saídas',
    tripProject: 'Viagem ao Japão',
    homeDeposit: 'Entrada para casa',
  },

  score: {
    excellent: 'Excelente',
    solid: 'Sólido',
    correct: 'Razoável',
    fragile: 'Frágil',
    poor: 'A corrigir',
    budgetHealth: 'Saúde do orçamento',
    compositeNote: 'Pontuação composta por cinco critérios, recalculada a cada alteração.',
    savingsRate: 'Taxa de poupança',
    savingsRateHint: 'Procure pôr de lado 20 % dos rendimentos todos os meses.',
    monthBalance: 'Equilíbrio do mês',
    monthBalanceHint: 'Terminar o mês com margem positiva.',
    housingWeight: 'Peso da habitação',
    housingWeightHint: 'A habitação deveria ficar abaixo de 30 % dos rendimentos.',
    debtRatio: 'Taxa de esforço',
    debtRatioHint: 'Os bancos limitam o crédito a 35 % dos rendimentos.',
    emergencyFund: 'Fundo de emergência',
    emergencyFundHint: (n) => `${months(n)} de despesas a manter de reserva.`,
  },

  advice: {
    title: 'Conselhos',
    subtitle:
      'Leitura automática dos seus números. Tudo é calculado no aparelho, nada é enviado para fora.',
    toneCritical: 'A resolver',
    toneWarning: 'A vigiar',
    toneTip: 'Pista',
    toneWin: 'Parabéns',
    nothingTitle: 'Nada a assinalar',
    nothingBody:
      'O seu orçamento não gera qualquer alerta. Volte depois de atualizar os seus números.',
    allocationTitle: 'Onde colocar o seu esforço de poupança',
    allocationSub: (amount) =>
      `Repartição indicativa dos seus ${amount} mensais, do mais líquido ao mais longo prazo.`,
    allocationSimulate: 'Simular esta repartição',
    perMonthBadge: (amount) => `${amount} / mês`,
    disclaimer:
      'A Formiga aplica regras orçamentais gerais aos seus números. Não é aconselhamento de investimento nem acompanhamento personalizado: para uma decisão que o compromete, fale com um profissional.',

    allocationEmergency: 'Livret A',
    allocationEmergencyWhy:
      'Enquanto o fundo de emergência não estiver constituído, a prioridade vai para um produto líquido e garantido.',
    allocationSecure: 'Livret A / LDDS',
    allocationSecureWhy: 'Uma rede de segurança sempre disponível.',
    allocationMid: 'Seguro de vida, fundo em euros',
    allocationMidWhy:
      'Projetos a 3-8 anos: capital garantido e fiscalidade que alivia com o tempo.',
    allocationLong: 'PEA',
    allocationLongWhy: 'Acima de 8 anos: é aqui que os juros compostos trabalham.',

    onboardingIncomeTitle: 'Comece pelos rendimentos',
    onboardingIncomeBody:
      'Adicione o seu salário líquido e outros rendimentos: todo o resto do painel decorre daí.',
    onboardingIncomeAction: 'Adicionar rendimento',
    onboardingExpensesTitle: 'Adicione as despesas fixas',
    onboardingExpensesBody:
      'Renda, crédito, energia, subscrições… São elas que determinam o que lhe sobra para viver.',
    onboardingExpensesAction: 'Adicionar uma despesa',

    deficitTitle: 'O seu mês está deficitário',
    deficitBody: (monthly, yearly) =>
      `As suas despesas excedem os rendimentos em ${monthly} por mês, ou seja ${yearly} num ano. Comece pelo que é negociável: subscrições, lazer, seguros a renegociar.`,
    deficitAction: 'Ver as minhas despesas',

    tightTitle: 'Orçamento equilibrado, mas sem margem',
    tightBody: (margin) =>
      `Sobram-lhe apenas ${margin} no fim do mês. Um imprevisto bastaria para desequilibrar tudo: libertar nem que sejam 50 € já faria diferença.`,

    savingsExcellentTitle: 'Taxa de poupança notável',
    savingsExcellentBody: (rate, yearly) =>
      `Põe de lado ${rate} dos seus rendimentos, bem acima da média das famílias. A este ritmo, poupa ${yearly} por ano.`,

    savingsLowTitle: 'Deixe os pequenos passos trabalharem',
    savingsLowBody: (rate, tenPercent) =>
      `Poupa ${rate} dos seus rendimentos. Passar para 10 % representaria ${tenPercent} por mês — muitas vezes alcançável mexendo em apenas duas ou três linhas.`,

    automateTitle: 'Automatize a sua poupança',
    automateBody: (margin) =>
      `Liberta ${margin} de margem, mas não tem nenhuma transferência de poupança programada. Uma transferência automática no dia do salário põe o dinheiro a salvo antes de ser gasto.`,
    automateAction: 'Programar uma poupança',

    housingTitle: 'A habitação pesa muito',
    housingBody: (ratio) =>
      `A habitação absorve ${ratio} dos seus rendimentos, contra uma referência habitual de 30 %. Renegociar o seguro do crédito, procurar apoios à habitação ou partilhar casa são as alavancas mais eficazes.`,

    debtHighTitle: 'Taxa de esforço acima do limite',
    debtHighBody: (ratio) =>
      `Os seus créditos representam ${ratio} dos rendimentos, acima dos 35 % considerados pelos bancos. Um consolidado de créditos pode aliviar a prestação.`,

    debtWatchTitle: 'Endividamento a vigiar',
    debtWatchBody: (ratio) =>
      `Com ${ratio}, aproxima-se do limite de 35 % que condiciona o acesso a novo crédito.`,

    subscriptionsTitle: 'Reveja as suas subscrições',
    subscriptionsBody: (count, monthly, yearly) =>
      `${count} subscriç${count > 1 ? 'ões' : 'ão'} num total de ${monthly} por mês, ou seja ${yearly} por ano. É onde se recupera mais dinheiro com menos esforço.`,
    subscriptionsAction: 'Ver o detalhe',

    emergencyTitle: 'Construa a sua rede de segurança',
    emergencyBody: (covered, target, missing, monthsToGo) =>
      `Cobre ${covered} meses de despesas dos ${target} pretendidos. Faltam ${missing}${
        monthsToGo !== null ? `, ou seja ${months(monthsToGo)} ao ritmo atual` : ''
      }.`,
    emergencyMetric: (covered, target) => `${covered} / ${months(target)}`,
    emergencyAction: 'Ajustar os meus objetivos',

    emergencyDoneTitle: 'Fundo de emergência constituído',
    emergencyDoneBody: (savings, covered) =>
      `Os seus ${savings} cobrem ${covered} meses de despesas. O excedente pode agora visar o médio e o longo prazo, onde o rendimento conta mais do que a disponibilidade.`,
    emergencyDoneMetric: (covered) => `${covered} meses`,
    emergencyDoneAction: 'Simular um investimento',

    goalReachedTitle: 'Objetivo de poupança atingido',
    goalReachedBody: (effort, target, canRaise) =>
      `O seu orçamento liberta ${effort} para um objetivo de ${target}. ${
        canRaise ? 'Podia até subir a fasquia.' : 'Mantenha este ritmo.'
      }`,

    goalCloseTitle: 'O objetivo está ao alcance',
    goalCloseBody: (missing, perDay) =>
      `Faltam-lhe ${missing} por mês para atingir a meta, cerca de ${perDay} por dia.`,

    goalFarTitle: 'O objetivo ainda está longe',
    goalFarBody: (ratio, target, missing) =>
      `Atinge ${ratio} do seu objetivo de ${target}. Ou ajusta a meta para que continue motivante, ou liberta ${missing} nas suas despesas.`,
    goalFarAction: 'Rever os meus objetivos',

    capExceededTitle: 'Despesas variáveis acima do limite',
    capExceededBody: (planned, cap) =>
      `Prevê ${planned} de despesas variáveis para um limite fixado em ${cap}.`,

    dailyLowTitle: 'Disponível diário apertado',
    dailyLowBody: (perDay) =>
      `Pagas as despesas fixas, restam ${perDay} por dia para todo o resto. Verifique se nenhuma despesa fixa é, na verdade, negociável.`,
    dailyLowMetric: (perDay) => `${perDay}/dia`,

    creditEndingTitle: 'Uma despesa está prestes a terminar',
    creditEndingBody: (label, monthsLeftCount, relief) =>
      `«${label}» termina daqui a ${months(monthsLeftCount)}: ficam livres ${relief} por mês. Decida já o destino desse valor, ou dissolve-se no dia a dia.`,
    creditEndingMetric: (relief) => `+${relief}/mês`,
    creditEndingAction: 'Simular este valor',

    taxProvisionTitle: 'Sem provisão para impostos',
    taxProvisionBody:
      'Declara rendimento de atividade por conta própria mas nenhuma linha de impostos ou contribuições. Provisionar todos os meses evita o aperto de tesouraria quando chega a nota de cobrança.',
    taxProvisionAction: 'Adicionar uma provisão',

    encouragementsLow: [
      'Cada euro identificado é um euro recuperado. Pôr tudo em cima da mesa já é metade do caminho.',
      'Um orçamento apertado não é um fracasso, é uma limitação a contornar. Comece pela linha mais pequena que consiga cortar.',
      'A formiga não muda o formigueiro num dia. Um ajuste por semana chega para mudar o ano.',
      'Os meses difíceis ensinam mais do que os fáceis. Vai saber exatamente onde está.',
    ],
    encouragementsMid: [
      'O seu orçamento aguenta-se. O próximo patamar joga-se numa única linha: escolha qual.',
      'Regular vale mais do que ambicioso. Uma transferência automática modesta vence uma grande resolução esquecida.',
      'Está acima da média das famílias. Mais alguns pontos e entra no pelotão da frente.',
      'O mais difícil está feito: sabe para onde vai o seu dinheiro. O resto é afinação.',
    ],
    encouragementsHigh: [
      'Orçamento sólido e disciplina instalada. A questão passa a ser o rendimento, não o esforço.',
      'A este ritmo o tempo trabalha a seu favor: os juros compostos fazem o resto.',
      'Poupa mais do que a grande maioria das famílias. Lembre-se de se dar também um gosto sem culpa.',
      'Objetivo cumprido. A melhor coisa a fazer agora é não mudar nada.',
    ],
  },
};
