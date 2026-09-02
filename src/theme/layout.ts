import { useWindowDimensions } from 'react-native';

import { spacing } from './metrics';

/**
 * Au-delà de ce seuil, l'écran est assez large pour porter deux colonnes :
 * tablette en portrait, tablette en paysage, fenêtre de navigateur.
 */
export const WIDE_BREAKPOINT = 760;

/** Un seul flux de cartes ne se lit plus au-delà de cette largeur. */
export const COMPACT_MAX_WIDTH = 560;

/** Largeur maximale du cadre à deux colonnes, marges comprises. */
export const WIDE_MAX_WIDTH = 1180;

const SCREEN_PADDING = spacing(5);

export interface Layout {
  /** Largeur de la fenêtre, sans plafond. */
  windowWidth: number;
  isWide: boolean;
  /** Largeur du cadre, marges latérales comprises. */
  frameWidth: number;
  /** Largeur utile, une fois les marges latérales retirées. */
  contentWidth: number;
  /** Largeur d'une colonne, égale à `contentWidth` en affichage compact. */
  columnWidth: number;
  columns: 1 | 2;
  gutter: number;
}

/**
 * Géométrie de la mise en page. Les graphiques dimensionnés en pixels doivent
 * s'y référer plutôt qu'à la fenêtre : ce sont ces largeurs-là qui leur sont
 * réellement allouées.
 */
export function useLayout(): Layout {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const frameWidth = Math.min(width, isWide ? WIDE_MAX_WIDTH : COMPACT_MAX_WIDTH);
  const contentWidth = frameWidth - SCREEN_PADDING * 2;
  const gutter = spacing(4);
  const columns: 1 | 2 = isWide ? 2 : 1;
  const columnWidth = columns === 1 ? contentWidth : (contentWidth - gutter) / 2;

  return { windowWidth: width, isWide, frameWidth, contentWidth, columnWidth, columns, gutter };
}
