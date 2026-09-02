/** Domain model. Everything is stored in euros, amounts are positive numbers. */

import type { Language } from '../i18n';
import type { ThemeMode } from '../theme/palette';

export type { Language, ThemeMode };

export type EntryKind = 'income' | 'expense';

export type Frequency = 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'yearly';

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'rental'
  | 'investment'
  | 'benefits'
  | 'other_income';

export type ExpenseCategory =
  | 'housing'
  | 'loan'
  | 'utilities'
  | 'subscriptions'
  | 'insurance'
  | 'transport'
  | 'food'
  | 'health'
  | 'childcare'
  | 'taxes'
  | 'leisure'
  | 'savings'
  | 'other_expense';

export type Category = IncomeCategory | ExpenseCategory;

export interface Entry {
  id: string;
  kind: EntryKind;
  label: string;
  /** Amount expressed in the entry's own frequency. */
  amount: number;
  frequency: Frequency;
  category: Category;
  /** Day of the month it lands / is debited (1-31). Optional. */
  dayOfMonth?: number;
  /** Charges whose amount fluctuates (food, fuel...) are excluded from "fixed" totals. */
  variable: boolean;
  /** ISO date of the last occurrence, for credits with a known end. */
  endsOn?: string;
  active: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsProject {
  id: string;
  label: string;
  emoji: string;
  target: number;
  saved: number;
  deadline?: string;
  createdAt: string;
}

export interface Goals {
  /** Objectif d'épargne mensuelle (€). */
  monthlySavingTarget: number;
  /** Plafond que l'on se fixe pour les dépenses variables du mois (€). */
  monthlySpendingCap: number;
  /** Épargne déjà constituée, toutes enveloppes confondues (€). */
  currentSavings: number;
  /** Nombre de mois de charges visés pour l'épargne de précaution. */
  emergencyMonths: number;
}

export interface Settings {
  firstName: string;
  onboarded: boolean;
  /** Jour de versement du salaire, sert au décompte des jours avant paie. */
  payday: number;
  /** Apparence choisie : « system » suit le réglage de l'appareil. */
  themeMode: ThemeMode;
  /** Langue de l'interface. Les libellés saisis par l'utilisateur ne changent pas. */
  language: Language;
  /**
   * Le budget affiché provient du jeu de démonstration et n'a pas encore été
   * touché. Sert à proposer un retour à zéro tant que rien n'est personnel.
   */
  isSample: boolean;
}

export interface AppState {
  entries: Entry[];
  projects: SavingsProject[];
  goals: Goals;
  settings: Settings;
}
