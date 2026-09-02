import { Image } from 'react-native';

import { radius } from '../theme';

/**
 * La fourmi de Formiga. Utilisée là où l'application se présente elle-même —
 * accueil, écran vide, encouragements — plutôt que comme pictogramme de
 * catégorie, où un emoji reste plus lisible aux petites tailles.
 */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.22) }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
