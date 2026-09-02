import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { setCompactSuffixes, setNumberLocale } from '../core/money';
import { en } from './en';
import { fr, type Dict } from './fr';
import { pt } from './pt';

export type { Dict } from './fr';

export type Language = 'fr' | 'en' | 'pt';

export const LANGUAGES: Language[] = ['fr', 'en', 'pt'];

const DICTS: Record<Language, Dict> = { fr, en, pt };

export function dictFor(language: Language): Dict {
  return DICTS[language] ?? fr;
}

/** Nom natif de chaque langue, jamais traduit : on le lit dans sa propre langue. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  fr: fr.languageName,
  en: en.languageName,
  pt: pt.languageName,
};

export interface I18n {
  t: Dict;
  language: Language;
  /** Étiquette BCP 47 pour Intl et les dates : fr-FR, en-GB, pt-PT. */
  locale: string;
}

const I18nContext = createContext<I18n>({ t: fr, language: 'fr', locale: fr.locale });

export function I18nProvider({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  const value = useMemo<I18n>(() => {
    const t = dictFor(language);
    return { t, language, locale: t.locale };
  }, [language]);

  // Les formateurs de `money.ts` sont appelés depuis des fonctions pures qui ne
  // peuvent pas lire un contexte React. On leur pousse la locale ici, avant que
  // les enfants ne rendent, plutôt que de faire passer la locale à travers une
  // quarantaine d'appels. Les hooks qui produisent du texte formaté listent la
  // langue dans leurs dépendances pour être recalculés au changement.
  setNumberLocale(value.locale);
  setCompactSuffixes(value.t.common.thousandsSuffix, value.t.common.millionsSuffix);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}

/** Raccourci : `const t = useT();` puis `t.dashboard.income`. */
export function useT(): Dict {
  return useContext(I18nContext).t;
}
