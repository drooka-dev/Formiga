import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { paletteFor, tint, type Colors, type Scheme, type ThemeMode } from './palette';

export interface Theme {
  colors: Colors;
  scheme: Scheme;
  /** Préférence enregistrée, qui peut valoir « system ». */
  mode: ThemeMode;
  /** Éclaircit une couleur de catégorie si le thème sombre est actif. */
  tint: (hex: string) => string;
}

const ThemeContext = createContext<Theme>({
  colors: paletteFor('light'),
  scheme: 'light',
  mode: 'system',
  tint: (hex) => hex,
});

export function ThemeProvider({ mode, children }: { mode: ThemeMode; children: ReactNode }) {
  const systemScheme = useColorScheme();
  const scheme: Scheme = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  const value = useMemo<Theme>(
    () => ({
      colors: paletteFor(scheme),
      scheme,
      mode,
      tint: (hex: string) => tint(hex, scheme),
    }),
    [scheme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * Feuilles de style dépendantes du thème.
 *
 * `StyleSheet.create` est appelé au chargement du module et ne peut donc pas
 * lire le thème courant. On passe par une fabrique, dont le résultat est mis en
 * cache par (fabrique, thème) : chaque feuille n'est construite qu'une fois par
 * thème, quel que soit le nombre de rendus.
 */
const styleCache = new WeakMap<object, Map<Scheme, unknown>>();

export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
  const { colors, scheme } = useTheme();
  let bySchemeCache = styleCache.get(factory);
  if (!bySchemeCache) {
    bySchemeCache = new Map();
    styleCache.set(factory, bySchemeCache);
  }
  let styles = bySchemeCache.get(scheme) as T | undefined;
  if (!styles) {
    styles = factory(colors);
    bySchemeCache.set(scheme, styles);
  }
  return styles;
}
