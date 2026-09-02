import type { Frequency } from './types';

const WEEKS_PER_MONTH = 52 / 12;

export const FREQUENCY_TO_MONTHLY: Record<Frequency, number> = {
  weekly: WEEKS_PER_MONTH,
  monthly: 1,
  quarterly: 1 / 3,
  semiannual: 1 / 6,
  yearly: 1 / 12,
};

/** Ramène n'importe quel montant périodique à son équivalent mensuel. */
export function toMonthly(amount: number, frequency: Frequency): number {
  return amount * FREQUENCY_TO_MONTHLY[frequency];
}

/* ------------------------------------------------------------------ */
/* Formatage localisé                                                  */
/* ------------------------------------------------------------------ */

/**
 * Locale active, poussée par `I18nProvider`. Ce module est importé par des
 * fonctions pures (moteur de conseils, projections) qui ne peuvent pas lire un
 * contexte React : la locale vit donc ici, et les hooks qui produisent du texte
 * formaté déclarent la langue dans leurs dépendances.
 */
let activeLocale = 'fr-FR';

interface Formatters {
  euro: Intl.NumberFormat;
  euroCents: Intl.NumberFormat;
  plain: Intl.NumberFormat;
}

const cache = new Map<string, Formatters>();

function formatters(): Formatters {
  const cached = cache.get(activeLocale);
  if (cached) return cached;
  const made: Formatters = {
    euro: new Intl.NumberFormat(activeLocale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }),
    euroCents: new Intl.NumberFormat(activeLocale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    plain: new Intl.NumberFormat(activeLocale, { maximumFractionDigits: 1 }),
  };
  cache.set(activeLocale, made);
  return made;
}

export function setNumberLocale(locale: string): void {
  activeLocale = locale;
}

export function getNumberLocale(): string {
  return activeLocale;
}

/** Suffixes des montants abrégés, injectés par la langue active. */
let compactSuffixes = { thousands: 'k€', millions: 'M€' };

export function setCompactSuffixes(thousands: string, millions: string): void {
  compactSuffixes = { thousands, millions };
}

/** 1 234 € — arrondi, pour les gros chiffres et les graphiques. */
export function formatEuro(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return formatters().euro.format(Math.round(value));
}

/** 1 234,50 € — pour les montants saisis par l'utilisateur. */
export function formatEuroCents(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return formatters().euroCents.format(value);
}

/** 12 k€ — pour les axes de graphiques, où la place manque. */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const { plain } = formatters();
  if (abs >= 1_000_000) return `${plain.format(value / 1_000_000)} ${compactSuffixes.millions}`;
  if (abs >= 1_000) return `${plain.format(Math.round(value / 1_000))} ${compactSuffixes.thousands}`;
  return formatEuro(value);
}

export function formatPercent(ratio: number, digits = 0): string {
  if (!Number.isFinite(ratio)) return '—';
  return new Intl.NumberFormat(activeLocale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
}

/** Nombre simple, séparateur décimal de la langue active. */
export function formatNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(activeLocale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Parse une saisie clavier en nombre. Accepte la virgule comme le point :
 * les trois langues gérées écrivent les décimales avec une virgule, mais les
 * claviers numériques n'offrent pas toujours le bon séparateur.
 */
export function parseAmount(input: string): number {
  const cleaned = input
    .replace(/\s| |€/g, '')
    .replace(/,/g, '.')
    .replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function daysInMonth(date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Jours restants dans le mois, aujourd'hui inclus. */
export function daysLeftInMonth(date = new Date()): number {
  return daysInMonth(date) - date.getDate() + 1;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
