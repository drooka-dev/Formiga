export type Scheme = 'light' | 'dark';

/** Préférence de l'utilisateur : « système » suit le réglage de l'OS. */
export type ThemeMode = 'system' | 'light' | 'dark';

export interface Colors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;

  ink: string;
  inkSoft: string;
  muted: string;

  primary: string;
  primarySoft: string;
  primaryInk: string;
  /** Texte posé sur un aplat `primary`. */
  onPrimary: string;

  accent: string;
  accentSoft: string;

  success: string;
  successSoft: string;
  successInk: string;
  warn: string;
  warnSoft: string;
  warnInk: string;
  danger: string;
  dangerSoft: string;
  dangerInk: string;

  /** Cartes pleines (reste à vivre, résultat de simulation). Sombre dans les deux thèmes. */
  heroBg: string;
  heroInk: string;

  chart: readonly string[];
}

const CHART = [
  '#0E7C66',
  '#3FA796',
  '#E08A2E',
  '#6C8EBF',
  '#B07AA1',
  '#8FB339',
  '#D9694F',
  '#5E7C8B',
] as const;

export const lightColors: Colors = {
  bg: '#F5F7F6',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F0',
  border: '#E2E8E5',

  ink: '#0F1D19',
  inkSoft: '#3F5650',
  muted: '#7A8F89',

  primary: '#0E7C66',
  primarySoft: '#DCF0EA',
  primaryInk: '#085548',
  onPrimary: '#FFFFFF',

  accent: '#E08A2E',
  accentSoft: '#FDF0DE',

  success: '#12A567',
  successSoft: '#DEF7EC',
  successInk: '#0A7C4C',
  warn: '#DE9B0A',
  warnSoft: '#FDF3D7',
  warnInk: '#946A05',
  danger: '#D33A2C',
  dangerSoft: '#FBE5E3',
  dangerInk: '#A02A20',

  heroBg: '#0E7C66',
  heroInk: '#FFFFFF',

  chart: CHART,
};

export const darkColors: Colors = {
  bg: '#0B110F',
  surface: '#141C19',
  surfaceAlt: '#1E2825',
  border: '#2A3733',

  ink: '#ECF3F0',
  inkSoft: '#B6C7C1',
  muted: '#7E9791',

  primary: '#2FB394',
  primarySoft: '#12362E',
  primaryInk: '#8FE0CC',
  // Sur un vert clair, un texte sombre reste bien plus lisible que du blanc.
  onPrimary: '#04211B',

  accent: '#EDA55C',
  accentSoft: '#3A2A16',

  success: '#2FC98A',
  successSoft: '#0F3527',
  successInk: '#7FE3B5',
  warn: '#E9B547',
  warnSoft: '#3A2E10',
  warnInk: '#F2D28A',
  danger: '#EE6B60',
  dangerSoft: '#3B1E1B',
  dangerInk: '#FFA79D',

  heroBg: '#0F4A3E',
  heroInk: '#F1FAF6',

  chart: CHART,
};

export function paletteFor(scheme: Scheme): Colors {
  return scheme === 'dark' ? darkColors : lightColors;
}

/* ------------------------------------------------------------------ */
/* Teintes de catégories                                               */
/* ------------------------------------------------------------------ */

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function toHex(channel: number): string {
  return Math.round(Math.min(255, Math.max(0, channel)))
    .toString(16)
    .padStart(2, '0');
}

/** Mélange deux couleurs. `ratio` = 0 renvoie `a`, 1 renvoie `b`. */
export function mix(a: string, b: string, ratio: number): string {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const t = Math.min(1, Math.max(0, ratio));
  return `#${toHex(r1 + (r2 - r1) * t)}${toHex(g1 + (g2 - g1) * t)}${toHex(b1 + (b2 - b1) * t)}`;
}

/**
 * Les couleurs de catégorie sont calibrées pour un fond clair. En thème sombre
 * on les éclaircit, sinon les teintes les plus foncées disparaissent sur les
 * surfaces sombres des graphiques.
 */
export function tint(hex: string, scheme: Scheme): string {
  return scheme === 'dark' ? mix(hex, '#FFFFFF', 0.26) : hex;
}
