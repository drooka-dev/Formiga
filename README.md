# Formiga 🐜

Application mobile (Android + iOS) de gestion de budget personnel. Tout est calculé et stocké
**sur le téléphone** : aucun compte, aucun serveur, aucune donnée qui sort de l'appareil.

## Ce que fait l'app

| Écran | Contenu |
| --- | --- |
| **Tableau de bord** | Reste à vivre, budget quotidien, score de santé, diagramme de flux, répartition des charges, projection d'épargne sur 12 mois, prochaines échéances |
| **Flux du mois** | Diagramme de Sankey plein écran : revenus → budget → postes → lignes de détail. Le reste non affecté (ou le découvert) y apparaît comme un flux à part entière |
| **Budget** | Saisie des revenus et charges, regroupés par catégorie, avec équivalent mensuel automatique quelle que soit la périodicité |
| **Objectifs** | Cible d'épargne mensuelle, plafond de dépenses variables, épargne de précaution, projets d'épargne suivis |
| **Simulation** | Livret A, LDDS, LEP, PEL, assurance-vie, PEA, compte-titres, SCPI : capital net après fiscalité sur X années, comparatif de toutes les enveloppes |
| **Conseils** | Analyse automatique déterministe des chiffres, encouragements, répartition d'épargne suggérée |

## Démarrer

```bash
npm install
```

Puis lancer le serveur de développement :

```bash
npx expo start
```

Scannez le QR code avec **Expo Go** (Android ou iOS) pour tester immédiatement sur votre téléphone.
`npx expo start --web` ouvre la même app dans un navigateur, pratique pour itérer vite.

Vérifier les types :

```bash
npm run typecheck
```

## Construire les binaires

### Android — en local

Nécessite le SDK Android et un JDK 17+.

```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

L'APK sort dans `android/app/build/outputs/apk/release/`. Le dossier `android/` est généré et
ignoré par git : `prebuild` le recrée à partir de `app.json`.

Cet APK est signé avec la **clé de debug** fournie par le gabarit Expo. Il s'installe sans problème
par sideload, mais le Play Store le refusera : pour publier, il faut générer sa propre clé de
signature et la conserver — la perdre interdit toute mise à jour ultérieure de l'application sous la
même identité.

### iOS

Un `.ipa` **ne peut pas être produit depuis Windows** : la compilation iOS exige macOS et Xcode, et
un binaire installable exige un compte Apple Developer (99 $/an) pour le provisioning. Les deux
chemins possibles :

```bash
npm install -g eas-cli
eas login
eas build --profile release --platform ios      # .ipa signé, compte Apple requis
eas build --profile preview --platform ios      # build simulateur, sans compte Apple
```

**EAS Build** compile sur des machines macOS distantes, ce qui contourne l'absence de Mac mais pas
celle du compte Apple. Le profil `preview` produit un build pour le simulateur iOS — utile pour
tester, mais ce n'est pas un `.ipa` installable sur un iPhone.

### Play Store et App Store

```bash
eas build --profile production --platform android   # .aab
eas build --profile production --platform ios       # .ipa signé pour l'App Store
```

## Architecture

```
app/                    routes expo-router
  (tabs)/               les 5 onglets
  entry/[id].tsx        modale de saisie / édition d'une ligne
  cashflow.tsx          diagramme de flux en plein écran
  onboarding.tsx        parcours de première ouverture
  settings.tsx          réglages, export / import, réinitialisation
src/
  core/                 logique métier pure, sans React
    types.ts            modèle de données
    catalog.ts          catégories, périodicités, raccourcis de saisie
    money.ts            conversions de périodicité, formatage fr-FR
    budget.ts           reste à vivre, ratios, score de santé, projections
    simulation.ts       produits d'épargne, capitalisation, fiscalité
    advice.ts           moteur de conseils déterministe
    sankey.ts           construction et mise en page du diagramme de flux
  store/                zustand + persistance AsyncStorage
  components/           primitives d'interface, graphiques SVG, champs de saisie
  i18n/                 dictionnaires fr / en / pt-PT, provider de langue
  theme/                jetons de design, palettes claire et sombre, provider
```

Tout `src/core` est constitué de fonctions pures : elles se testent et se relisent sans monter
l'interface.

## Thème clair / sombre

Le choix se fait dans les réglages : **Système**, **Clair** ou **Sombre**. Il est persisté avec le
reste des données et survit à une réinitialisation du budget.

`src/theme/palette.ts` définit les deux palettes derrière un même type `Colors` ; `ThemeProvider`
expose la palette active via `useTheme()`. Comme `StyleSheet.create` s'exécute au chargement du
module et ne peut donc pas lire le thème, chaque feuille de style est écrite comme une fabrique
`(colors: Colors) => StyleSheet.create({...})` consommée par `useThemedStyles`, qui met le résultat
en cache par thème — une feuille n'est construite qu'une fois par thème, quel que soit le nombre de
rendus.

Les couleurs de catégorie de `catalog.ts` sont calibrées pour un fond clair ; `tint()` les éclaircit
en thème sombre, sinon les teintes les plus foncées disparaissent sur les graphiques.

## Langues

Français, anglais et portugais du Portugal (pt-PT, pas pt-BR). Le choix se fait au premier
lancement puis dans les réglages ; il est persisté et survit à une réinitialisation.

`src/i18n/fr.ts` est le dictionnaire de référence : son type contraint `en.ts` et `pt.ts`, si bien
qu’ajouter une clé sans la traduire casse la compilation. Les chaînes à variables sont des
fonctions plutôt que des gabarits à trous, ce qui garde l’interpolation typée et laisse chaque
langue placer ses valeurs où sa grammaire l’exige — d’où un vrai singulier en anglais et en
portugais là où le français écrit « mois » dans les deux cas.

Les modules de `src/core` reçoivent le dictionnaire en paramètre au lieu de lire un contexte : ils
restent des fonctions pures. Les montants, pourcentages et dates passent par `Intl` avec la locale
active (`fr-FR`, `en-GB`, `pt-PT`), d’où des formats réellement différents : `1 407 €` en français,
`€1,407` en anglais.

Ce qui n’est **pas** traduit, volontairement : les libellés que vous saisissez vous-même (ce sont
vos données), et les noms des enveloppes d’épargne françaises (un Livret A reste un Livret A).

## Icônes

L'illustration source est `assets/source-icon.jpg`. Toutes les déclinaisons en sont dérivées :

```bash
npm run icons
```

Le script isole le carré coloré du fond clair, rogne le liseré d'anticrénelage, rebouche les coins
arrondis avec le dégradé, puis écrit `icon.png` (iOS et stores, opaque et plein cadre — c'est l'OS
qui arrondit), `logo.png` (affichage dans l'app, coins transparents), `favicon.png`,
`splash-icon.png` et le couple Android : un dégradé plein cadre en arrière-plan, et l'illustration
détourée de son fond placée dans la zone sûre, afin de rester entière quel que soit le masque du
lanceur.

Dans l'interface, `<Logo>` remplace l'emoji fourmi là où l'application se présente elle-même :
accueil de la configuration, écran vide, cartes d'encouragement. Les fourmis restantes sont des
**pictogrammes de catégorie** (« Épargne programmée ») affichés à 14-18 px au milieu d'autres
emojis : à cette taille une illustration détaillée devient illisible et rompt l'homogénéité de la
série.

## Mise en page responsive

Deux dispositions, séparées par un seuil à **760 px** (`WIDE_BREAKPOINT`) :

- **compacte** — téléphone : une colonne, cadre plafonné à 560 px ;
- **large** — tablette, paysage, navigateur : cadre jusqu'à 1180 px et **deux colonnes**.

`useLayout()` fournit la géométrie (`contentWidth`, `columnWidth`, `isWide`) ; les graphiques
dimensionnés en pixels s'y réfèrent plutôt qu'à la largeur de la fenêtre, qui n'est pas celle qui
leur est allouée. Deux primitives suffisent à décliner les écrans : `<Split>` place deux blocs côte
à côte et les empile en compact, `<CardGrid>` répartit une liste de cartes en colonnes de hauteurs
voisines.

En large : réglages à gauche et résultat à droite dans la simulation, objectifs à gauche et projets
à droite, postes de budget et conseils en grille, et un diagramme de flux pleine largeur. Sa hauteur
suit la largeur (`flowHeight`) pour conserver des proportions lisibles — sans cela il s'étirait en
une bande de 1 300 × 250 px où les colonnes étaient séparées par du vide et les rubans réduits à des
traits horizontaux.

## Budget d'exemple et retour à zéro

Le bouton « Explorer avec un budget d'exemple » de l'accueil charge un jeu de démonstration et pose
`settings.isSample`. Tant que ce marqueur est vrai, le tableau de bord affiche une bannière qui
rappelle que les chiffres sont fictifs et propose de **repartir de zéro** — ce qui efface les
données et relance la configuration guidée, en conservant la langue et le thème. La même action
figure dans les réglages.

Le marqueur tombe dès que vous ajoutez, modifiez ou supprimez une ligne : à partir de là le budget
est le vôtre, et la bannière disparaît sans qu'il y ait à la fermer.

## Modèle de calcul

- Chaque ligne est ramenée à un **équivalent mensuel** (hebdo × 52/12, trimestriel ÷ 3, annuel ÷ 12…).
- **Reste à vivre** = revenus − charges fixes − épargne programmée.
- **Marge** = reste à vivre − dépenses variables prévues. C'est le vrai surplus de fin de mois.
- **Capacité d'épargne** = épargne programmée + marge positive.
- **Score de santé** (0-100) : taux d'épargne (30 %), équilibre du mois (25 %), poids du logement
  (15 %), taux d'endettement (15 %), épargne de précaution (15 %).

## Limites assumées

- Les **taux de rendement** des supports d'épargne sont des ordres de grandeur, tous modifiables
  dans l'écran de simulation. Ils évoluent : vérifiez-les avant de vous appuyer sur un chiffre.
- La **fiscalité modélisée est simplifiée** : pas de tranche marginale d'imposition, pas
  d'abattement, pas de frais d'enveloppe, prélèvements sociaux appliqués à la sortie.
- L'app **ne se connecte à aucune banque**. Les montants sont saisis à la main, il s'agit d'un
  budget prévisionnel, pas d'un suivi de transactions.
- Une **désinstallation efface tout**. La sauvegarde passe par l'export JSON dans les réglages.
- Ce n'est ni un conseil en investissement, ni un accompagnement financier personnalisé.
