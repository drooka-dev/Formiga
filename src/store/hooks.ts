import { useMemo } from 'react';

import { useI18n } from '../i18n';
import { buildAdvice, dailyEncouragement } from '../core/advice';
import {
  computeSummary,
  endingCharges,
  projectSavings,
  type BudgetSummary,
} from '../core/budget';
import { buildCashflowGraph, type SankeyGraph } from '../core/sankey';
import { categoryLabel } from '../core/catalog';
import type { AppState } from '../core/types';
import { useTheme } from '../theme';
import { useBudgetStore } from './useBudgetStore';

/** L'état persisté seul, sans les actions — sert d'entrée aux calculs. */
export function useAppState(): AppState {
  const entries = useBudgetStore((s) => s.entries);
  const projects = useBudgetStore((s) => s.projects);
  const goals = useBudgetStore((s) => s.goals);
  const settings = useBudgetStore((s) => s.settings);
  return useMemo(
    () => ({ entries, projects, goals, settings }),
    [entries, projects, goals, settings],
  );
}

export function useSummary(): BudgetSummary {
  const state = useAppState();
  return useMemo(() => computeSummary(state), [state]);
}

/*
 * Les hooks ci-dessous produisent du texte formaté : la langue fait partie de
 * leurs dépendances, sans quoi les montants et les libellés resteraient figés
 * dans la langue précédente après un changement.
 */

export function useAdvice() {
  const state = useAppState();
  const summary = useSummary();
  const { t, language } = useI18n();
  return useMemo(() => buildAdvice(state, summary, t), [state, summary, t, language]);
}

export function useEncouragement() {
  const summary = useSummary();
  const { t, language } = useI18n();
  return useMemo(
    () => dailyEncouragement(t, summary.healthScore),
    [t, language, summary.healthScore],
  );
}

export function useProjection(months = 12) {
  const state = useAppState();
  const { locale, language } = useI18n();
  return useMemo(
    () => projectSavings(state, months, locale),
    [state, months, locale, language],
  );
}

export function useEndingCharges() {
  const state = useAppState();
  return useMemo(() => endingCharges(state), [state]);
}

/** Effort d'épargne mensuel réellement disponible (programmé + marge). */
export function useMonthlyEffort(): number {
  const summary = useSummary();
  return summary.plannedSavings + Math.max(summary.margin, 0);
}

/** Graphe de flux, dont les couleurs et les libellés suivent thème et langue. */
export function useCashflowGraph(detailed: boolean): SankeyGraph {
  const state = useAppState();
  const { colors, tint } = useTheme();
  const { t, language } = useI18n();
  return useMemo(
    () =>
      buildCashflowGraph(state, detailed, {
        budget: colors.accent,
        deficit: colors.danger,
        unallocated: colors.success,
        tintCategory: tint,
        budgetLabel: t.cashflow.budgetNode,
        deficitLabel: t.cashflow.deficitNode,
        unallocatedLabel: t.cashflow.unallocatedNode,
        categoryLabel: (key) => categoryLabel(t, key),
      }),
    [state, detailed, colors, tint, t, language],
  );
}
