import { categoryMeta, EXPENSE_CATEGORIES, type CategoryMeta } from './catalog';
import { clamp, daysInMonth, daysLeftInMonth, toMonthly } from './money';
import type { AppState, Category, Entry, Goals } from './types';

export interface CategoryTotal {
  key: Category;
  meta: CategoryMeta;
  monthly: number;
  share: number;
  entries: Entry[];
}

/** Les libellés sont résolus à l'affichage, à partir de la clé. */
export interface ScorePart {
  key: 'savings' | 'balance' | 'housing' | 'debt' | 'emergency';
  score: number;
  weight: number;
}

export interface BudgetSummary {
  income: number;
  /** Charges récurrentes non arbitrables (hors épargne programmée, hors variables). */
  fixedExpenses: number;
  /** Charges dont le montant fluctue (courses, carburant, loisirs...). */
  variableExpenses: number;
  /** Virements d'épargne déjà programmés. */
  plannedSavings: number;
  totalExpenses: number;
  /** Revenus − charges fixes − épargne programmée. */
  resteAVivre: number;
  /** Reste à vivre − dépenses variables prévues : le vrai surplus de fin de mois. */
  margin: number;
  /** (épargne programmée + marge) / revenus */
  savingsRate: number;
  housingRatio: number;
  debtRatio: number;
  subscriptionsTotal: number;
  dailyAllowance: number;
  daysLeft: number;
  daysInMonth: number;
  incomeByCategory: CategoryTotal[];
  expenseByCategory: CategoryTotal[];
  healthScore: number;
  scoreParts: ScorePart[];
  emergencyMonthsCovered: number;
}

export function monthlyAmount(entry: Entry): number {
  return toMonthly(entry.amount, entry.frequency);
}

function isSavingsEntry(e: Entry): boolean {
  return e.kind === 'expense' && e.category === 'savings';
}

function groupByCategory(entries: Entry[], total: number): CategoryTotal[] {
  const map = new Map<Category, CategoryTotal>();
  for (const entry of entries) {
    const current = map.get(entry.category);
    const amount = monthlyAmount(entry);
    if (current) {
      current.monthly += amount;
      current.entries.push(entry);
    } else {
      map.set(entry.category, {
        key: entry.category,
        meta: categoryMeta(entry.category),
        monthly: amount,
        share: 0,
        entries: [entry],
      });
    }
  }
  const list = [...map.values()];
  for (const item of list) item.share = total > 0 ? item.monthly / total : 0;
  return list.sort((a, b) => b.monthly - a.monthly);
}

function scoreBetween(value: number, best: number, worst: number): number {
  if (best === worst) return 100;
  return clamp((value - worst) / (best - worst), 0, 1) * 100;
}

export function computeSummary(state: AppState, now = new Date()): BudgetSummary {
  const active = state.entries.filter((e) => e.active);
  const incomeEntries = active.filter((e) => e.kind === 'income');
  const expenseEntries = active.filter((e) => e.kind === 'expense');

  const income = incomeEntries.reduce((sum, e) => sum + monthlyAmount(e), 0);
  const plannedSavings = expenseEntries
    .filter(isSavingsEntry)
    .reduce((s, e) => s + monthlyAmount(e), 0);
  const variableExpenses = expenseEntries
    .filter((e) => e.variable && !isSavingsEntry(e))
    .reduce((s, e) => s + monthlyAmount(e), 0);
  const fixedExpenses = expenseEntries
    .filter((e) => !e.variable && !isSavingsEntry(e))
    .reduce((s, e) => s + monthlyAmount(e), 0);
  const totalExpenses = fixedExpenses + variableExpenses + plannedSavings;

  const resteAVivre = income - fixedExpenses - plannedSavings;
  const margin = resteAVivre - variableExpenses;

  const sumOf = (cats: Category[]) =>
    expenseEntries
      .filter((e) => cats.includes(e.category))
      .reduce((s, e) => s + monthlyAmount(e), 0);

  const housing = sumOf(['housing']);
  const debt = sumOf(['loan']);
  const subscriptionsTotal = sumOf(['subscriptions']);

  const nbDays = daysInMonth(now);
  const daysLeft = daysLeftInMonth(now);
  const dailyAllowance = resteAVivre > 0 ? resteAVivre / nbDays : 0;

  const monthlyBurn = fixedExpenses + variableExpenses;
  const emergencyMonthsCovered = monthlyBurn > 0 ? state.goals.currentSavings / monthlyBurn : 0;

  const savingsRate = income > 0 ? (plannedSavings + Math.max(margin, 0)) / income : 0;
  const housingRatio = income > 0 ? housing / income : 0;
  const debtRatio = income > 0 ? debt / income : 0;
  const emergencyTarget = state.goals.emergencyMonths || 3;

  const scoreParts: ScorePart[] = [
    { key: 'savings', weight: 30, score: scoreBetween(savingsRate, 0.2, 0) },
    {
      key: 'balance',
      weight: 25,
      score: income > 0 ? scoreBetween(margin / income, 0.15, -0.05) : 0,
    },
    { key: 'housing', weight: 15, score: income > 0 ? scoreBetween(housingRatio, 0.25, 0.45) : 100 },
    { key: 'debt', weight: 15, score: income > 0 ? scoreBetween(debtRatio, 0.05, 0.35) : 100 },
    { key: 'emergency', weight: 15, score: scoreBetween(emergencyMonthsCovered, emergencyTarget, 0) },
  ];

  const totalWeight = scoreParts.reduce((s, p) => s + p.weight, 0);
  const healthScore =
    income > 0
      ? Math.round(scoreParts.reduce((s, p) => s + p.score * p.weight, 0) / totalWeight)
      : 0;

  return {
    income,
    fixedExpenses,
    variableExpenses,
    plannedSavings,
    totalExpenses,
    resteAVivre,
    margin,
    savingsRate,
    housingRatio,
    debtRatio,
    subscriptionsTotal,
    dailyAllowance,
    daysLeft,
    daysInMonth: nbDays,
    incomeByCategory: groupByCategory(incomeEntries, income),
    expenseByCategory: groupByCategory(expenseEntries, totalExpenses),
    healthScore,
    scoreParts,
    emergencyMonthsCovered,
  };
}

export interface EndingCharge {
  entry: Entry;
  monthsLeft: number;
  monthlyRelief: number;
}

/** Crédits et engagements dont la date de fin est connue, triés par échéance. */
export function endingCharges(state: AppState, now = new Date()): EndingCharge[] {
  return state.entries
    .filter((e) => e.active && e.kind === 'expense' && e.endsOn)
    .map((entry) => {
      const end = new Date(entry.endsOn as string);
      const monthsLeft =
        (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
      return { entry, monthsLeft, monthlyRelief: monthlyAmount(entry) };
    })
    .filter((c) => c.monthsLeft >= 0)
    .sort((a, b) => a.monthsLeft - b.monthsLeft);
}

export interface ProjectionPoint {
  month: number;
  label: string;
  savings: number;
  monthlyContribution: number;
}

/**
 * Projection de l'épargne cumulée sur `months` mois, en tenant compte des
 * charges qui s'arrêtent en cours de route (crédits soldés).
 */
export function projectSavings(
  state: AppState,
  months = 12,
  locale = 'fr-FR',
  now = new Date(),
): ProjectionPoint[] {
  const summary = computeSummary(state, now);
  const baseContribution = summary.plannedSavings + Math.max(summary.margin, 0);
  const ending = endingCharges(state, now);
  const points: ProjectionPoint[] = [];
  let cumulative = state.goals.currentSavings;

  for (let m = 1; m <= months; m += 1) {
    const relief = ending.filter((c) => c.monthsLeft < m).reduce((s, c) => s + c.monthlyRelief, 0);
    const contribution = baseContribution + relief;
    cumulative += contribution;
    const date = new Date(now.getFullYear(), now.getMonth() + m, 1);
    points.push({
      month: m,
      label: date.toLocaleDateString(locale, { month: 'short' }),
      savings: cumulative,
      monthlyContribution: contribution,
    });
  }
  return points;
}

/** Nombre de mois pour atteindre un objectif au rythme d'épargne courant. */
export function monthsToTarget(target: number, current: number, monthly: number): number | null {
  if (current >= target) return 0;
  if (monthly <= 0) return null;
  return Math.ceil((target - current) / monthly);
}

/** Avancement sur l'objectif d'épargne mensuelle (1 = objectif atteint). */
export function goalProgress(goals: Goals, summary: BudgetSummary): number {
  if (goals.monthlySavingTarget <= 0) return 0;
  const actual = summary.plannedSavings + Math.max(summary.margin, 0);
  return clamp(actual / goals.monthlySavingTarget, 0, 1.5);
}

export const EXPENSE_CATEGORY_LIST = Object.values(EXPENSE_CATEGORIES);
