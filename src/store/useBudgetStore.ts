import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { categoryMeta } from '../core/catalog';
import type { Dict } from '../i18n/fr';
import type { AppState, Entry, Goals, SavingsProject, Settings } from '../core/types';

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

const DEFAULT_GOALS: Goals = {
  monthlySavingTarget: 0,
  monthlySpendingCap: 0,
  currentSavings: 0,
  emergencyMonths: 3,
};

const DEFAULT_SETTINGS: Settings = {
  firstName: '',
  onboarded: false,
  payday: 1,
  themeMode: 'system',
  language: 'fr',
  isSample: false,
};

export type EntryDraft = Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'variable'> &
  Partial<Pick<Entry, 'active' | 'variable'>>;

interface BudgetActions {
  addEntry: (draft: EntryDraft) => Entry;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  removeEntry: (id: string) => void;
  toggleEntry: (id: string) => void;
  /** Le libellé de la copie est fourni par l’appelant, qui connaît la langue. */
  duplicateEntry: (id: string, label: string) => void;

  setGoals: (patch: Partial<Goals>) => void;
  setSettings: (patch: Partial<Settings>) => void;

  addProject: (project: Omit<SavingsProject, 'id' | 'createdAt' | 'saved'> & { saved?: number }) => void;
  updateProject: (id: string, patch: Partial<SavingsProject>) => void;
  removeProject: (id: string) => void;
  contributeToProject: (id: string, amount: number) => void;

  loadSample: (t: Dict) => void;
  resetAll: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export type BudgetStore = AppState & BudgetActions;

const initialState: AppState = {
  entries: [],
  projects: [],
  goals: DEFAULT_GOALS,
  settings: DEFAULT_SETTINGS,
};

/**
 * Marque le budget comme appartenant à l'utilisateur. Appelé dès qu'une ligne
 * est ajoutée, modifiée ou supprimée : à partir de là, la bannière « budget
 * d'exemple » n'a plus lieu d'être.
 */
function ownData(state: BudgetStore): Settings {
  return state.settings.isSample ? { ...state.settings, isSample: false } : state.settings;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      addEntry: (draft) => {
        const now = new Date().toISOString();
        const entry: Entry = {
          variable: categoryMeta(draft.category).defaultVariable ?? false,
          active: true,
          ...draft,
          id: uid(),
          createdAt: now,
          updatedAt: now,
        };
        set({ entries: [entry, ...get().entries], settings: ownData(get()) });
        return entry;
      },

      updateEntry: (id, patch) =>
        set({
          entries: get().entries.map((e) =>
            e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e,
          ),
          settings: ownData(get()),
        }),

      removeEntry: (id) =>
        set({ entries: get().entries.filter((e) => e.id !== id), settings: ownData(get()) }),

      toggleEntry: (id) =>
        set({
          entries: get().entries.map((e) => (e.id === id ? { ...e, active: !e.active } : e)),
          settings: ownData(get()),
        }),

      duplicateEntry: (id, label) => {
        const source = get().entries.find((e) => e.id === id);
        if (!source) return;
        const now = new Date().toISOString();
        set({
          entries: [
            { ...source, id: uid(), label, createdAt: now, updatedAt: now },
            ...get().entries,
          ],
          settings: ownData(get()),
        });
      },

      setGoals: (patch) => set({ goals: { ...get().goals, ...patch } }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

      addProject: (project) =>
        set({
          projects: [
            ...get().projects,
            { saved: 0, ...project, id: uid(), createdAt: new Date().toISOString() },
          ],
        }),

      updateProject: (id, patch) =>
        set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),

      removeProject: (id) => set({ projects: get().projects.filter((p) => p.id !== id) }),

      contributeToProject: (id, amount) =>
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, saved: Math.max(0, p.saved + amount) } : p,
          ),
        }),

      loadSample: (t) => {
        const sample = buildSampleState(t);
        set({
          ...sample,
          settings: {
            ...sample.settings,
            themeMode: get().settings.themeMode,
            language: get().settings.language,
            isSample: true,
          },
          hydrated: true,
        } as Partial<BudgetStore>);
      },

      resetAll: () =>
        set({
          ...initialState,
          settings: {
            ...DEFAULT_SETTINGS,
            themeMode: get().settings.themeMode,
            language: get().settings.language,
          },
          hydrated: true,
        } as Partial<BudgetStore>),
    }),
    {
      name: 'formiga-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ entries, projects, goals, settings }) => ({ entries, projects, goals, settings }),
      // Les sauvegardes antérieures ne connaissent pas tous les réglages :
      // on repart des valeurs par défaut et on écrase avec ce qui est stocké.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          goals: { ...DEFAULT_GOALS, ...(saved.goals ?? {}) },
          settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) },
        };
      },
      // Une sauvegarde illisible ne doit pas laisser l'app bloquée sur l'écran
      // de chargement : on démarre alors sur un état vierge.
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) useBudgetStore.setState({ hydrated: true });
        else state.setHydrated();
      },
    },
  ),
);

function entry(e: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Entry {
  const now = new Date().toISOString();
  return { ...e, id: uid(), createdAt: now, updatedAt: now };
}

/** Jeu de données de démonstration, pour explorer l'app sans rien saisir. */
export function buildSampleState(t: Dict): AppState {
  const in14Months = new Date();
  in14Months.setMonth(in14Months.getMonth() + 14);

  return {
    entries: [
      entry({ kind: 'income', label: t.quickIncome.netSalary, amount: 2450, frequency: 'monthly', category: 'salary', dayOfMonth: 27, variable: false, active: true }),
      entry({ kind: 'income', label: t.sample.annualBonus, amount: 1800, frequency: 'yearly', category: 'salary', variable: false, active: true }),
      entry({ kind: 'income', label: t.sample.studioRent, amount: 480, frequency: 'monthly', category: 'rental', dayOfMonth: 5, variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.rent, amount: 820, frequency: 'monthly', category: 'housing', dayOfMonth: 3, variable: false, active: true }),
      entry({ kind: 'expense', label: t.sample.carLoan, amount: 245, frequency: 'monthly', category: 'loan', dayOfMonth: 10, variable: false, active: true, endsOn: in14Months.toISOString() }),
      entry({ kind: 'expense', label: t.quickExpense.electricity, amount: 95, frequency: 'monthly', category: 'utilities', dayOfMonth: 15, variable: false, active: true }),
      entry({ kind: 'expense', label: t.sample.internetMobile, amount: 48, frequency: 'monthly', category: 'utilities', dayOfMonth: 8, variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.homeInsurance, amount: 220, frequency: 'yearly', category: 'insurance', variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.carInsurance, amount: 62, frequency: 'monthly', category: 'insurance', dayOfMonth: 12, variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.healthInsurance, amount: 54, frequency: 'monthly', category: 'health', dayOfMonth: 5, variable: false, active: true }),
      entry({ kind: 'expense', label: 'Netflix', amount: 13.49, frequency: 'monthly', category: 'subscriptions', variable: false, active: true }),
      entry({ kind: 'expense', label: 'Spotify', amount: 11.99, frequency: 'monthly', category: 'subscriptions', variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.gym, amount: 29.9, frequency: 'monthly', category: 'subscriptions', variable: false, active: true }),
      entry({ kind: 'expense', label: 'Stockage cloud', amount: 9.99, frequency: 'monthly', category: 'subscriptions', variable: false, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.groceries, amount: 420, frequency: 'monthly', category: 'food', variable: true, active: true }),
      entry({ kind: 'expense', label: t.quickExpense.fuel, amount: 110, frequency: 'monthly', category: 'transport', variable: true, active: true }),
      entry({ kind: 'expense', label: t.sample.leisure, amount: 150, frequency: 'monthly', category: 'leisure', variable: true, active: true }),
      entry({ kind: 'expense', label: t.sample.propertyTax, amount: 780, frequency: 'yearly', category: 'taxes', variable: false, active: true }),
      entry({ kind: 'expense', label: t.sample.savingTransfer, amount: 200, frequency: 'monthly', category: 'savings', dayOfMonth: 28, variable: false, active: true }),
    ],
    projects: [
      { id: uid(), label: t.sample.tripProject, emoji: '🗾', target: 4000, saved: 1150, createdAt: new Date().toISOString() },
      { id: uid(), label: t.sample.homeDeposit, emoji: '🏠', target: 25000, saved: 6800, createdAt: new Date().toISOString() },
    ],
    goals: {
      monthlySavingTarget: 400,
      monthlySpendingCap: 700,
      currentSavings: 7950,
      emergencyMonths: 4,
    },
    settings: { ...DEFAULT_SETTINGS, onboarded: true, payday: 27 },
  };
}
