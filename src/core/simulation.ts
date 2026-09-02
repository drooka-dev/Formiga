/**
 * Simulation de placements.
 *
 * Les taux par défaut sont des ordres de grandeur indicatifs : ils sont tous
 * modifiables dans l'écran de simulation, et la fiscalité appliquée est un
 * modèle simplifié (pas de prise en compte du TMI, des abattements, ni de
 * l'assiette exacte des prélèvements sociaux au fil de l'eau).
 */

import type { Dict } from '../i18n/fr';

export type Taxation = 'none' | 'pfu' | 'social' | 'pea' | 'lifeInsurance';

export type ProductKey = keyof Dict['products'];

export interface Product {
  key: ProductKey;
  emoji: string;
  /** Taux annuel brut par défaut (0.017 = 1,7 %). */
  defaultRate: number;
  /** Plafond de versements, hors intérêts capitalisés. */
  ceiling?: number;
  taxation: Taxation;
  /** 0 = capital garanti, 3 = fortement volatil. */
  risk: 0 | 1 | 2 | 3;
}

export const PRODUCTS: Product[] = [
  { key: 'livretA', emoji: '🐷', defaultRate: 0.017, ceiling: 22950, taxation: 'none', risk: 0 },
  { key: 'ldds', emoji: '🌱', defaultRate: 0.017, ceiling: 12000, taxation: 'none', risk: 0 },
  { key: 'lep', emoji: '⭐', defaultRate: 0.027, ceiling: 10000, taxation: 'none', risk: 0 },
  { key: 'pel', emoji: '🔑', defaultRate: 0.0175, ceiling: 61200, taxation: 'pfu', risk: 0 },
  { key: 'avEuro', emoji: '🛟', defaultRate: 0.026, taxation: 'lifeInsurance', risk: 0 },
  { key: 'avUc', emoji: '🧭', defaultRate: 0.055, taxation: 'lifeInsurance', risk: 2 },
  { key: 'pea', emoji: '📈', defaultRate: 0.07, ceiling: 150000, taxation: 'pea', risk: 3 },
  { key: 'cto', emoji: '🌍', defaultRate: 0.07, taxation: 'pfu', risk: 3 },
  { key: 'scpi', emoji: '🏢', defaultRate: 0.045, taxation: 'pfu', risk: 2 },
];

export function productByKey(key: string): Product {
  return PRODUCTS.find((p) => p.key === key) ?? PRODUCTS[0];
}

/** Libellés d'un produit dans la langue active. */
export function productText(t: Dict, key: ProductKey) {
  return t.products[key];
}

export function riskLabel(t: Dict, risk: 0 | 1 | 2 | 3): string {
  return [t.risk.none, t.risk.low, t.risk.medium, t.risk.high][risk];
}

/** Taux d'imposition appliqué aux plus-values à la sortie. */
export function taxRate(taxation: Taxation, years: number): number {
  switch (taxation) {
    case 'none':
      return 0;
    case 'social':
      return 0.172;
    case 'pfu':
      return 0.3;
    case 'pea':
      return years >= 5 ? 0.172 : 0.3;
    case 'lifeInsurance':
      return years >= 8 ? 0.172 : 0.302;
    default:
      return 0;
  }
}

export interface SimulationInput {
  initialCapital: number;
  monthlyContribution: number;
  years: number;
  annualRate: number;
  ceiling?: number;
  taxation: Taxation;
  /** Inflation annuelle pour le calcul en euros constants (0.02 = 2 %). */
  inflation: number;
}

export interface SimulationYear {
  year: number;
  deposited: number;
  gross: number;
  gains: number;
  net: number;
  /** Valeur nette exprimée en euros d'aujourd'hui. */
  real: number;
}

export interface SimulationResult {
  years: SimulationYear[];
  deposited: number;
  gross: number;
  gains: number;
  net: number;
  netGains: number;
  real: number;
  taxRate: number;
  /** Le plafond de versement a-t-il été atteint pendant la simulation ? */
  ceilingReachedAtMonth: number | null;
}

/**
 * Capitalisation mensuelle. Les versements s'arrêtent dès que le cumul versé
 * atteint le plafond du produit ; les intérêts, eux, continuent de courir
 * au-dessus du plafond (comme sur un Livret A réel).
 */
export function simulate(input: SimulationInput): SimulationResult {
  const { initialCapital, monthlyContribution, years, annualRate, ceiling, taxation, inflation } =
    input;

  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const totalMonths = Math.max(0, Math.round(years * 12));

  let balance = ceiling ? Math.min(initialCapital, ceiling) : initialCapital;
  let deposited = balance;
  let ceilingReachedAtMonth: number | null = ceiling && deposited >= ceiling ? 0 : null;

  const yearRows: SimulationYear[] = [];
  const rate = taxRate(taxation, years);

  const pushYear = (year: number) => {
    const gains = Math.max(balance - deposited, 0);
    const net = deposited + gains * (1 - rate);
    yearRows.push({
      year,
      deposited,
      gross: balance,
      gains,
      net,
      real: net / Math.pow(1 + inflation, year),
    });
  };

  pushYear(0);

  for (let month = 1; month <= totalMonths; month += 1) {
    balance *= 1 + monthlyRate;

    let contribution = monthlyContribution;
    if (ceiling !== undefined) {
      contribution = Math.max(0, Math.min(contribution, ceiling - deposited));
      if (contribution === 0 && ceilingReachedAtMonth === null) ceilingReachedAtMonth = month;
    }
    balance += contribution;
    deposited += contribution;

    if (month % 12 === 0) pushYear(month / 12);
  }

  if (totalMonths % 12 !== 0) pushYear(years);

  const last = yearRows[yearRows.length - 1];
  return {
    years: yearRows,
    deposited: last.deposited,
    gross: last.gross,
    gains: last.gains,
    net: last.net,
    netGains: last.net - last.deposited,
    real: last.real,
    taxRate: rate,
    ceilingReachedAtMonth,
  };
}

export interface ComparisonRow {
  product: Product;
  result: SimulationResult;
}

/** Simule un même effort d'épargne sur plusieurs enveloppes, pour comparaison. */
export function compareProducts(
  keys: string[],
  base: Omit<SimulationInput, 'annualRate' | 'ceiling' | 'taxation'>,
  rateOverrides: Record<string, number> = {},
): ComparisonRow[] {
  return keys
    .map((key) => {
      const product = productByKey(key);
      return {
        product,
        result: simulate({
          ...base,
          annualRate: rateOverrides[key] ?? product.defaultRate,
          ceiling: product.ceiling,
          taxation: product.taxation,
        }),
      };
    })
    .sort((a, b) => b.result.net - a.result.net);
}

/**
 * Répartition suggérée d'un effort d'épargne mensuel :
 * précaution d'abord (livrets), puis moyen/long terme.
 */
export interface AllocationSlice {
  productKey: string;
  label: string;
  emoji: string;
  monthly: number;
  rationale: string;
}

export function suggestAllocation(
  t: Dict,
  monthlyEffort: number,
  emergencyMonthsCovered: number,
  emergencyTargetMonths: number,
): AllocationSlice[] {
  if (monthlyEffort <= 0) return [];
  const covered = emergencyMonthsCovered >= emergencyTargetMonths;

  if (!covered) {
    return [
      {
        productKey: 'livretA',
        label: t.advice.allocationEmergency,
        emoji: '🐷',
        monthly: monthlyEffort,
        rationale: t.advice.allocationEmergencyWhy,
      },
    ];
  }

  const round = (v: number) => Math.round(v / 5) * 5;
  const secure = round(monthlyEffort * 0.2);
  const midTerm = round(monthlyEffort * 0.3);
  const longTerm = Math.max(0, monthlyEffort - secure - midTerm);

  return [
    {
      productKey: 'livretA',
      label: t.advice.allocationSecure,
      emoji: '🐷',
      monthly: secure,
      rationale: t.advice.allocationSecureWhy,
    },
    {
      productKey: 'avEuro',
      label: t.advice.allocationMid,
      emoji: '🛟',
      monthly: midTerm,
      rationale: t.advice.allocationMidWhy,
    },
    {
      productKey: 'pea',
      label: t.advice.allocationLong,
      emoji: '📈',
      monthly: longTerm,
      rationale: t.advice.allocationLongWhy,
    },
  ].filter((s) => s.monthly > 0);
}
