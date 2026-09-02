import type { Dict } from '../i18n/fr';
import { endingCharges, monthsToTarget, type BudgetSummary } from './budget';
import { formatEuro, formatNumber, formatPercent } from './money';
import type { AppState } from './types';

export type AdviceTone = 'critical' | 'warning' | 'tip' | 'win';

export interface Advice {
  id: string;
  tone: AdviceTone;
  emoji: string;
  title: string;
  body: string;
  /** Chiffre clé mis en avant sur la carte. */
  metric?: string;
  action?: { label: string; route: string };
  /** Plus le nombre est bas, plus le conseil remonte haut dans la liste. */
  priority: number;
}

const TONE_RANK: Record<AdviceTone, number> = { critical: 0, warning: 1, tip: 2, win: 3 };

/**
 * Moteur de conseils déterministe : chaque règle regarde les agrégats du mois
 * et produit au plus un conseil. Aucune donnée ne quitte le téléphone.
 *
 * Le dictionnaire est passé en paramètre plutôt que lu depuis un contexte :
 * la fonction reste pure et testable, et le texte suit la langue active.
 */
export function buildAdvice(
  state: AppState,
  summary: BudgetSummary,
  t: Dict,
  now = new Date(),
): Advice[] {
  const a = t.advice;
  const out: Advice[] = [];
  const { goals } = state;
  const effort = summary.plannedSavings + Math.max(summary.margin, 0);
  const hasIncome = summary.income > 0;
  const expenseCount = state.entries.filter((e) => e.active && e.kind === 'expense').length;

  // — Prise en main ————————————————————————————————————————————
  if (!hasIncome) {
    out.push({
      id: 'onboarding-income',
      tone: 'tip',
      emoji: '👋',
      title: a.onboardingIncomeTitle,
      body: a.onboardingIncomeBody,
      action: { label: a.onboardingIncomeAction, route: '/entry/new?kind=income' },
      priority: 0,
    });
    return out;
  }

  if (expenseCount === 0) {
    out.push({
      id: 'onboarding-expenses',
      tone: 'tip',
      emoji: '🧾',
      title: a.onboardingExpensesTitle,
      body: a.onboardingExpensesBody,
      action: { label: a.onboardingExpensesAction, route: '/entry/new?kind=expense' },
      priority: 1,
    });
  }

  // — Équilibre du mois ————————————————————————————————————————
  if (summary.margin < 0) {
    out.push({
      id: 'deficit',
      tone: 'critical',
      emoji: '🚨',
      title: a.deficitTitle,
      body: a.deficitBody(formatEuro(-summary.margin), formatEuro(-summary.margin * 12)),
      metric: formatEuro(summary.margin),
      action: { label: a.deficitAction, route: '/budget' },
      priority: 0,
    });
  } else if (summary.income > 0 && summary.margin / summary.income < 0.05) {
    out.push({
      id: 'tight',
      tone: 'warning',
      emoji: '⚖️',
      title: a.tightTitle,
      body: a.tightBody(formatEuro(summary.margin)),
      metric: formatEuro(summary.margin),
      priority: 2,
    });
  }

  // — Taux d'épargne ——————————————————————————————————————————
  if (summary.savingsRate >= 0.2) {
    out.push({
      id: 'savings-excellent',
      tone: 'win',
      emoji: '🏆',
      title: a.savingsExcellentTitle,
      body: a.savingsExcellentBody(formatPercent(summary.savingsRate), formatEuro(effort * 12)),
      metric: formatPercent(summary.savingsRate),
      priority: 3,
    });
  } else if (summary.savingsRate > 0 && summary.savingsRate < 0.05 && summary.margin >= 0) {
    out.push({
      id: 'savings-low',
      tone: 'tip',
      emoji: '🐜',
      title: a.savingsLowTitle,
      body: a.savingsLowBody(formatPercent(summary.savingsRate), formatEuro(summary.income * 0.1)),
      metric: formatPercent(summary.savingsRate),
      priority: 2,
    });
  }

  // — Automatisation de l'épargne ————————————————————————————————
  if (summary.plannedSavings === 0 && summary.margin > 50) {
    out.push({
      id: 'automate',
      tone: 'tip',
      emoji: '⚙️',
      title: a.automateTitle,
      body: a.automateBody(formatEuro(summary.margin)),
      metric: formatEuro(summary.margin),
      action: { label: a.automateAction, route: '/entry/new?kind=expense&category=savings' },
      priority: 1,
    });
  }

  // — Structure des charges ————————————————————————————————————
  if (summary.housingRatio > 0.35) {
    out.push({
      id: 'housing-heavy',
      tone: 'warning',
      emoji: '🏡',
      title: a.housingTitle,
      body: a.housingBody(formatPercent(summary.housingRatio)),
      metric: formatPercent(summary.housingRatio),
      priority: 2,
    });
  }

  if (summary.debtRatio > 0.35) {
    out.push({
      id: 'debt-high',
      tone: 'critical',
      emoji: '🏦',
      title: a.debtHighTitle,
      body: a.debtHighBody(formatPercent(summary.debtRatio)),
      metric: formatPercent(summary.debtRatio),
      priority: 0,
    });
  } else if (summary.debtRatio > 0.28) {
    out.push({
      id: 'debt-watch',
      tone: 'warning',
      emoji: '📉',
      title: a.debtWatchTitle,
      body: a.debtWatchBody(formatPercent(summary.debtRatio)),
      metric: formatPercent(summary.debtRatio),
      priority: 3,
    });
  }

  if (summary.subscriptionsTotal >= 60 || summary.subscriptionsTotal / summary.income > 0.04) {
    const count = state.entries.filter(
      (e) => e.active && e.kind === 'expense' && e.category === 'subscriptions',
    ).length;
    out.push({
      id: 'subscriptions',
      tone: 'tip',
      emoji: '📺',
      title: a.subscriptionsTitle,
      body: a.subscriptionsBody(
        count,
        formatEuro(summary.subscriptionsTotal),
        formatEuro(summary.subscriptionsTotal * 12),
      ),
      metric: formatEuro(summary.subscriptionsTotal),
      action: { label: a.subscriptionsAction, route: '/budget' },
      priority: 2,
    });
  }

  // — Épargne de précaution ————————————————————————————————————
  const target = goals.emergencyMonths || 3;
  const burn = summary.fixedExpenses + summary.variableExpenses;
  const covered = formatNumber(summary.emergencyMonthsCovered, 1);

  if (burn > 0 && summary.emergencyMonthsCovered < target) {
    const needed = burn * target - goals.currentSavings;
    const months = monthsToTarget(burn * target, goals.currentSavings, effort);
    out.push({
      id: 'emergency-fund',
      tone: summary.emergencyMonthsCovered < 1 ? 'warning' : 'tip',
      emoji: '🛟',
      title: a.emergencyTitle,
      body: a.emergencyBody(covered, target, formatEuro(needed), months),
      metric: a.emergencyMetric(covered, target),
      action: { label: a.emergencyAction, route: '/goals' },
      priority: 1,
    });
  } else if (burn > 0 && summary.emergencyMonthsCovered >= target && effort > 0) {
    out.push({
      id: 'emergency-done',
      tone: 'win',
      emoji: '🛡️',
      title: a.emergencyDoneTitle,
      body: a.emergencyDoneBody(formatEuro(goals.currentSavings), covered),
      metric: a.emergencyDoneMetric(covered),
      action: { label: a.emergencyDoneAction, route: '/simulation' },
      priority: 3,
    });
  }

  // — Objectif d'épargne mensuel ————————————————————————————————
  if (goals.monthlySavingTarget > 0) {
    const ratio = effort / goals.monthlySavingTarget;
    if (ratio >= 1) {
      out.push({
        id: 'goal-reached',
        tone: 'win',
        emoji: '🎯',
        title: a.goalReachedTitle,
        body: a.goalReachedBody(
          formatEuro(effort),
          formatEuro(goals.monthlySavingTarget),
          ratio >= 1.2,
        ),
        metric: formatPercent(ratio),
        priority: 3,
      });
    } else if (ratio >= 0.8) {
      const missing = goals.monthlySavingTarget - effort;
      out.push({
        id: 'goal-close',
        tone: 'tip',
        emoji: '🔥',
        title: a.goalCloseTitle,
        body: a.goalCloseBody(formatEuro(missing), formatEuro(missing / 30)),
        metric: formatPercent(ratio),
        priority: 2,
      });
    } else if (ratio > 0) {
      out.push({
        id: 'goal-far',
        tone: 'tip',
        emoji: '🧗',
        title: a.goalFarTitle,
        body: a.goalFarBody(
          formatPercent(ratio),
          formatEuro(goals.monthlySavingTarget),
          formatEuro(goals.monthlySavingTarget - effort),
        ),
        metric: formatPercent(ratio),
        action: { label: a.goalFarAction, route: '/goals' },
        priority: 2,
      });
    }
  }

  // — Plafond de dépenses variables ——————————————————————————————
  if (goals.monthlySpendingCap > 0 && summary.variableExpenses > goals.monthlySpendingCap) {
    out.push({
      id: 'cap-exceeded',
      tone: 'warning',
      emoji: '🧺',
      title: a.capExceededTitle,
      body: a.capExceededBody(
        formatEuro(summary.variableExpenses),
        formatEuro(goals.monthlySpendingCap),
      ),
      metric: formatEuro(summary.variableExpenses - goals.monthlySpendingCap),
      priority: 2,
    });
  }

  // — Reste à vivre quotidien ————————————————————————————————————
  if (summary.dailyAllowance > 0 && summary.dailyAllowance < 12) {
    out.push({
      id: 'daily-low',
      tone: 'warning',
      emoji: '📅',
      title: a.dailyLowTitle,
      body: a.dailyLowBody(formatEuro(summary.dailyAllowance)),
      metric: a.dailyLowMetric(formatEuro(summary.dailyAllowance)),
      priority: 1,
    });
  }

  // — Fin de crédit en vue ————————————————————————————————————————
  const ending = endingCharges(state, now).filter((c) => c.monthsLeft <= 12);
  if (ending.length > 0) {
    const next = ending[0];
    out.push({
      id: 'credit-ending',
      tone: 'win',
      emoji: '🗓️',
      title: a.creditEndingTitle,
      body: a.creditEndingBody(
        next.entry.label,
        next.monthsLeft,
        formatEuro(next.monthlyRelief),
      ),
      metric: a.creditEndingMetric(formatEuro(next.monthlyRelief)),
      action: { label: a.creditEndingAction, route: '/simulation' },
      priority: 2,
    });
  }

  // — Provision fiscale pour les indépendants ————————————————————
  const hasFreelance = state.entries.some(
    (e) => e.active && e.kind === 'income' && e.category === 'freelance',
  );
  const hasTaxLine = state.entries.some(
    (e) => e.active && e.kind === 'expense' && e.category === 'taxes',
  );
  if (hasFreelance && !hasTaxLine) {
    out.push({
      id: 'tax-provision',
      tone: 'warning',
      emoji: '🧮',
      title: a.taxProvisionTitle,
      body: a.taxProvisionBody,
      action: { label: a.taxProvisionAction, route: '/entry/new?kind=expense&category=taxes' },
      priority: 1,
    });
  }

  return out.sort((x, y) => x.priority - y.priority || TONE_RANK[x.tone] - TONE_RANK[y.tone]);
}

/** Message d'encouragement, stable sur la journée, adapté au score. */
export function dailyEncouragement(t: Dict, score: number, now = new Date()): string {
  const pool =
    score < 40
      ? t.advice.encouragementsLow
      : score < 70
        ? t.advice.encouragementsMid
        : t.advice.encouragementsHigh;
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return pool[dayOfYear % pool.length];
}

export function scoreLabel(t: Dict, score: number): string {
  if (score >= 80) return t.score.excellent;
  if (score >= 65) return t.score.solid;
  if (score >= 45) return t.score.correct;
  if (score >= 25) return t.score.fragile;
  return t.score.poor;
}

/** Libellé et repère associés à chaque critère du score de santé. */
export function scorePartText(
  t: Dict,
  key: 'savings' | 'balance' | 'housing' | 'debt' | 'emergency',
  emergencyMonths: number,
): { label: string; hint: string } {
  switch (key) {
    case 'savings':
      return { label: t.score.savingsRate, hint: t.score.savingsRateHint };
    case 'balance':
      return { label: t.score.monthBalance, hint: t.score.monthBalanceHint };
    case 'housing':
      return { label: t.score.housingWeight, hint: t.score.housingWeightHint };
    case 'debt':
      return { label: t.score.debtRatio, hint: t.score.debtRatioHint };
    case 'emergency':
      return {
        label: t.score.emergencyFund,
        hint: t.score.emergencyFundHint(emergencyMonths),
      };
  }
}
