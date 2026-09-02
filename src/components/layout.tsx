import { Children, type ReactNode } from 'react';
import { View } from 'react-native';

import { useLayout } from '../theme';

/**
 * Deux blocs côte à côte sur écran large, empilés sinon. La colonne de gauche
 * porte ce qui doit rester en tête de lecture ; celle de droite le complément.
 */
export function Split({
  left,
  right,
  /** Poids relatif de la colonne de gauche (0.5 = colonnes égales). */
  leftWeight = 0.5,
}: {
  left: ReactNode;
  right: ReactNode;
  leftWeight?: number;
}) {
  const { isWide, gutter } = useLayout();

  if (!isWide) {
    return (
      <>
        {left}
        {right}
      </>
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: gutter, alignItems: 'flex-start' }}>
      <View style={{ flex: leftWeight }}>{left}</View>
      <View style={{ flex: 1 - leftWeight }}>{right}</View>
    </View>
  );
}

/**
 * Répartit une liste de cartes sur plusieurs colonnes. La distribution est
 * alternée plutôt que séquentielle : les colonnes restent de hauteurs voisines
 * même quand les cartes ont des tailles très différentes.
 */
export function CardGrid({ children, gap }: { children: ReactNode; gap?: number }) {
  const { columns, gutter } = useLayout();
  const items = Children.toArray(children);
  const spacingBetween = gap ?? gutter;

  if (columns === 1) {
    return <View style={{ gap: spacingBetween }}>{items}</View>;
  }

  const buckets: ReactNode[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => buckets[index % columns].push(item));

  return (
    <View style={{ flexDirection: 'row', gap: gutter, alignItems: 'flex-start' }}>
      {buckets.map((bucket, index) => (
        <View key={index} style={{ flex: 1, gap: spacingBetween }}>
          {bucket}
        </View>
      ))}
    </View>
  );
}

/**
 * Hauteur d'un graphique de flux : elle suit la largeur pour que le diagramme
 * garde des proportions lisibles, sans jamais descendre sous ce qu'exige le
 * nombre de lignes à afficher.
 */
export function flowHeight(width: number, rows: number, rowHeight: number, minimum: number): number {
  return Math.max(minimum, rows * rowHeight, Math.round(width * 0.42));
}
