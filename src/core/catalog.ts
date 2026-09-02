import type { Dict } from '../i18n/fr';
import type { Category, ExpenseCategory, Frequency, IncomeCategory } from './types';

/**
 * Les libellés vivent dans les dictionnaires de `src/i18n` : ce catalogue ne
 * garde que ce qui ne se traduit pas — l'identité, la couleur, l'icône et le
 * comportement par défaut de chaque catégorie.
 */
export interface CategoryMeta {
  key: Category;
  emoji: string;
  color: string;
  /** Charges essentielles vs. arbitrables — sert au moteur de conseils. */
  essential?: boolean;
  defaultVariable?: boolean;
}

export const INCOME_CATEGORIES: Record<IncomeCategory, CategoryMeta> = {
  salary: { key: 'salary', emoji: '💼', color: '#0E7C66' },
  freelance: { key: 'freelance', emoji: '🧾', color: '#3FA796' },
  rental: { key: 'rental', emoji: '🏠', color: '#6C8EBF' },
  investment: { key: 'investment', emoji: '📈', color: '#8FB339' },
  benefits: { key: 'benefits', emoji: '🤝', color: '#B07AA1' },
  other_income: { key: 'other_income', emoji: '✨', color: '#E08A2E' },
};

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryMeta> = {
  housing: { key: 'housing', emoji: '🏡', color: '#0E7C66', essential: true },
  loan: { key: 'loan', emoji: '🏦', color: '#D9694F', essential: true },
  utilities: { key: 'utilities', emoji: '💡', color: '#E08A2E', essential: true },
  subscriptions: { key: 'subscriptions', emoji: '📺', color: '#B07AA1' },
  insurance: { key: 'insurance', emoji: '🛡️', color: '#6C8EBF', essential: true },
  transport: { key: 'transport', emoji: '🚗', color: '#5E7C8B', essential: true, defaultVariable: true },
  food: { key: 'food', emoji: '🛒', color: '#8FB339', essential: true, defaultVariable: true },
  health: { key: 'health', emoji: '💊', color: '#3FA796', essential: true },
  childcare: { key: 'childcare', emoji: '🧸', color: '#D9A441', essential: true },
  taxes: { key: 'taxes', emoji: '🧮', color: '#8C6E63', essential: true },
  leisure: { key: 'leisure', emoji: '🎬', color: '#E0715E', defaultVariable: true },
  savings: { key: 'savings', emoji: '🐜', color: '#12A567' },
  other_expense: { key: 'other_expense', emoji: '📦', color: '#7A8F89', defaultVariable: true },
};

export const CATEGORIES: Record<string, CategoryMeta> = {
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
};

export function categoryMeta(key: Category): CategoryMeta {
  return CATEGORIES[key] ?? { key, emoji: '📦', color: '#7A8F89' };
}

export function categoryLabel(t: Dict, key: Category): string {
  return t.categories[key as keyof Dict['categories']] ?? String(key);
}

export const FREQUENCY_KEYS: Frequency[] = [
  'weekly',
  'monthly',
  'quarterly',
  'semiannual',
  'yearly',
];

export function frequencyLabel(t: Dict, frequency: Frequency): string {
  return t.frequencies[frequency];
}

/** Suffixe court affiché à côté d'un montant : « /mois », « /yr », « /ano ». */
export function frequencyShort(t: Dict, frequency: Frequency): string {
  const map: Record<Frequency, string> = {
    weekly: t.frequencies.weeklyShort,
    monthly: t.frequencies.monthlyShort,
    quarterly: t.frequencies.quarterlyShort,
    semiannual: t.frequencies.semiannualShort,
    yearly: t.frequencies.yearlyShort,
  };
  return map[frequency];
}

/* ------------------------------------------------------------------ */
/* Raccourcis de saisie                                                */
/* ------------------------------------------------------------------ */

export interface QuickEntry {
  key: string;
  label: string;
  category: Category;
  emoji: string;
}

export function quickIncome(t: Dict): QuickEntry[] {
  const q = t.quickIncome;
  return [
    { key: 'netSalary', label: q.netSalary, category: 'salary', emoji: '💼' },
    { key: 'bonus', label: q.bonus, category: 'salary', emoji: '🎁' },
    { key: 'rentReceived', label: q.rentReceived, category: 'rental', emoji: '🏠' },
    { key: 'benefits', label: q.benefits, category: 'benefits', emoji: '🤝' },
    { key: 'dividends', label: q.dividends, category: 'investment', emoji: '📈' },
    { key: 'freelance', label: q.freelance, category: 'freelance', emoji: '🧾' },
  ];
}

export function quickExpense(t: Dict): QuickEntry[] {
  const q = t.quickExpense;
  return [
    { key: 'rent', label: q.rent, category: 'housing', emoji: '🏡' },
    { key: 'mortgage', label: q.mortgage, category: 'loan', emoji: '🏦' },
    { key: 'electricity', label: q.electricity, category: 'utilities', emoji: '💡' },
    { key: 'internet', label: q.internet, category: 'utilities', emoji: '🌐' },
    { key: 'mobile', label: q.mobile, category: 'utilities', emoji: '📱' },
    { key: 'streaming', label: q.streaming, category: 'subscriptions', emoji: '📺' },
    { key: 'music', label: q.music, category: 'subscriptions', emoji: '🎧' },
    { key: 'gym', label: q.gym, category: 'subscriptions', emoji: '🏋️' },
    { key: 'homeInsurance', label: q.homeInsurance, category: 'insurance', emoji: '🛡️' },
    { key: 'carInsurance', label: q.carInsurance, category: 'insurance', emoji: '🚗' },
    { key: 'healthInsurance', label: q.healthInsurance, category: 'health', emoji: '💊' },
    { key: 'groceries', label: q.groceries, category: 'food', emoji: '🛒' },
    { key: 'fuel', label: q.fuel, category: 'transport', emoji: '⛽' },
    { key: 'publicTransport', label: q.publicTransport, category: 'transport', emoji: '🚇' },
    { key: 'childcare', label: q.childcare, category: 'childcare', emoji: '🧸' },
    { key: 'incomeTax', label: q.incomeTax, category: 'taxes', emoji: '🧮' },
    { key: 'autoSaving', label: q.autoSaving, category: 'savings', emoji: '🐜' },
  ];
}
