import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountField, Field, TextField } from '../src/components/inputs';
import { Logo } from '../src/components/Logo';
import { Button, Card, Chip, Muted, useUi } from '../src/components/ui';
import { formatEuro } from '../src/core/money';
import { LANGUAGES, LANGUAGE_NAMES, useT } from '../src/i18n';
import type { Language } from '../src/i18n';
import type { Category } from '../src/core/types';
import type { Dict } from '../src/i18n';
import { useBudgetStore } from '../src/store/useBudgetStore';
import {
  font,
  radius,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Colors,
} from '../src/theme';

type Starter = { key: keyof Dict['onboarding']; category: Category; emoji: string; variable: boolean };

const STARTER_EXPENSES: Starter[] = [
  { key: 'starterHousing', category: 'housing', emoji: '🏡', variable: false },
  { key: 'starterUtilities', category: 'utilities', emoji: '💡', variable: false },
  { key: 'starterInsurance', category: 'insurance', emoji: '🛡️', variable: false },
  { key: 'starterTransport', category: 'transport', emoji: '🚗', variable: true },
  { key: 'starterFood', category: 'food', emoji: '🛒', variable: true },
  { key: 'starterSubscriptions', category: 'subscriptions', emoji: '📺', variable: false },
];

/** L'écran de présentation, une fois la langue choisie. */
const WELCOME_STEP = 1;

export default function Onboarding() {
  const ui = useUi();
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const { frameWidth } = useLayout();
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addEntry = useBudgetStore((s) => s.addEntry);
  const setGoals = useBudgetStore((s) => s.setGoals);
  const setSettings = useBudgetStore((s) => s.setSettings);
  const language = useBudgetStore((st) => st.settings.language);
  const loadSample = useBudgetStore((s) => s.loadSample);

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [salary, setSalary] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [savingTarget, setSavingTarget] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + v, 0);
  const income = salary + otherIncome;
  const rest = income - totalExpenses;

  const finish = () => {
    if (salary > 0) {
      addEntry({
        kind: 'income',
        label: t.onboarding.netSalary,
        amount: salary,
        frequency: 'monthly',
        category: 'salary',
      });
    }
    if (otherIncome > 0) {
      addEntry({
        kind: 'income',
        label: t.onboarding.otherIncomeLabel,
        amount: otherIncome,
        frequency: 'monthly',
        category: 'other_income',
      });
    }
    for (const item of STARTER_EXPENSES) {
      const amount = expenses[item.key];
      if (amount > 0) {
        addEntry({
          kind: 'expense',
          label: t.onboarding[item.key],
          amount,
          frequency: 'monthly',
          category: item.category,
          variable: item.variable,
        });
      }
    }
    setGoals({ monthlySavingTarget: savingTarget, currentSavings });
    setSettings({ firstName: firstName.trim(), onboarded: true });
    router.replace('/');
  };

  const demo = () => {
    loadSample(t);
    router.replace('/');
  };

  const steps = [
    // 0 — langue
    <View key="language">
      <StepTitle
        title={t.onboarding.languageStepTitle}
        subtitle={t.onboarding.languageStepSubtitle}
      />
      <View style={{ gap: spacing(3) }}>
        {LANGUAGES.map((lang) => (
          <Card
            key={lang}
            tone={language === lang ? 'plain' : 'surface'}
            onPress={() => setSettings({ language: lang })}
          >
            <View style={s.expenseRow}>
              <Text style={s.expenseLabel}>{LANGUAGE_NAMES[lang]}</Text>
              {language === lang ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : null}
            </View>
          </Card>
        ))}
      </View>
    </View>,

    // 1 — accueil
    <View key="welcome" style={{ flex: 1, justifyContent: 'center' }}>
      <Logo size={88} />
      <Text style={[ui.h1, { marginTop: spacing(4), fontSize: 34 }]}>Formiga</Text>
      <Text style={s.lead}>{t.onboarding.lead}</Text>
      <View style={{ gap: spacing(3), marginTop: spacing(8) }}>
        <Feature
          emoji="👛"
          title={t.onboarding.featureDisposableTitle}
          body={t.onboarding.featureDisposableBody}
        />
        <Feature
          emoji="🎯"
          title={t.onboarding.featureGoalsTitle}
          body={t.onboarding.featureGoalsBody}
        />
        <Feature
          emoji="📈"
          title={t.onboarding.featureSimulationTitle}
          body={t.onboarding.featureSimulationBody}
        />
        <Feature
          emoji="🔒"
          title={t.onboarding.featureLocalTitle}
          body={t.onboarding.featureLocalBody}
        />
      </View>
    </View>,

    // 2 — identité
    <View key="name">
      <StepTitle title={t.onboarding.nameStepTitle} subtitle={t.onboarding.nameStepSubtitle} />
      <Field label={t.onboarding.firstName}>
        <TextField
          value={firstName}
          onChangeText={setFirstName}
          placeholder={t.onboarding.firstNamePlaceholder}
          autoFocus
        />
      </Field>
    </View>,

    // 3 — revenus
    <View key="income">
      <StepTitle title={t.onboarding.incomeStepTitle} subtitle={t.onboarding.incomeStepSubtitle} />
      <Field label={t.onboarding.netSalary}>
        <AmountField value={salary} onChange={setSalary} autoFocus />
      </Field>
      <Field label={t.onboarding.otherIncome} hint={t.onboarding.otherIncomeHint}>
        <AmountField value={otherIncome} onChange={setOtherIncome} size="small" />
      </Field>
      {income > 0 ? (
        <Card tone="plain">
          <Muted>{t.onboarding.monthlyTotal}</Muted>
          <Text style={ui.h2}>{formatEuro(income)}</Text>
        </Card>
      ) : null}
    </View>,

    // 4 — charges
    <View key="expenses">
      <StepTitle
        title={t.onboarding.expensesStepTitle}
        subtitle={t.onboarding.expensesStepSubtitle}
      />
      <View style={{ gap: spacing(3) }}>
        {STARTER_EXPENSES.map((item) => (
          <Card key={item.key} style={{ paddingVertical: spacing(3) }}>
            <View style={s.expenseRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2.5), flex: 1 }}>
                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                <Text style={s.expenseLabel}>{t.onboarding[item.key]}</Text>
              </View>
              <View style={{ width: 118 }}>
                <AmountField
                  value={expenses[item.key] ?? 0}
                  onChange={(v) => setExpenses((prev) => ({ ...prev, [item.key]: v }))}
                  size="small"
                />
              </View>
            </View>
          </Card>
        ))}
      </View>
      {totalExpenses > 0 ? (
        <Card tone="plain" style={{ marginTop: spacing(4) }}>
          <View style={s.expenseRow}>
            <Muted>{t.onboarding.enteredCharges}</Muted>
            <Text style={ui.h3}>{formatEuro(totalExpenses)}</Text>
          </View>
          {income > 0 ? (
            <View style={[s.expenseRow, { marginTop: spacing(2) }]}>
              <Muted>{t.onboarding.estimatedDisposable}</Muted>
              <Text style={[ui.h3, { color: rest >= 0 ? colors.success : colors.danger }]}>
                {formatEuro(rest)}
              </Text>
            </View>
          ) : null}
        </Card>
      ) : null}
    </View>,

    // 5 — objectif
    <View key="goal">
      <StepTitle
        title={t.onboarding.goalStepTitle}
        subtitle={t.onboarding.goalStepSubtitle}
      />
      <Field label={t.onboarding.monthlyTarget}>
        <AmountField value={savingTarget} onChange={setSavingTarget} />
      </Field>
      {income > 0 ? (
        <View style={s.chipRow}>
          {[0.05, 0.1, 0.15, 0.2].map((r) => {
            const v = Math.round((income * r) / 10) * 10;
            return (
              <Chip
                key={r}
                label={`${formatEuro(v)} · ${Math.round(r * 100)} %`}
                active={savingTarget === v}
                onPress={() => setSavingTarget(v)}
              />
            );
          })}
        </View>
      ) : null}
      <Field
        label={t.onboarding.currentSavings}
        hint={t.onboarding.currentSavingsHint}
        style={{ marginTop: spacing(6) }}
      >
        <AmountField value={currentSavings} onChange={setCurrentSavings} size="small" />
      </Field>
    </View>,
  ];

  const isLast = step === steps.length - 1;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[s.progress, { paddingTop: insets.top + spacing(3) }]}>
        {steps.map((_, i) => (
          <View key={i} style={[s.progressDot, i <= step && s.progressDotActive]} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing(6),
          paddingBottom: spacing(10),
          width: '100%',
          maxWidth: frameWidth,
          alignSelf: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {steps[step]}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + spacing(4) }]}>
        <View style={{ flexDirection: 'row', gap: spacing(3) }}>
          {step > 0 ? (
            <Pressable onPress={() => setStep((v) => v - 1)} style={s.backButton} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color={colors.inkSoft} />
            </Pressable>
          ) : null}
          <Button
            title={
              isLast ? t.onboarding.finish : step === WELCOME_STEP ? t.onboarding.start : t.onboarding.continue
            }
            onPress={() => (isLast ? finish() : setStep((v) => v + 1))}
            style={{ flex: 1 }}
          />
        </View>
        {step === WELCOME_STEP ? (
          <Button title={t.onboarding.demo} variant="ghost" onPress={demo} />
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  const ui = useUi();
  const s = useThemedStyles(makeStyles);
  return (
    <View style={{ marginBottom: spacing(6) }}>
      <Text style={[ui.h1, { fontSize: 26 }]}>{title}</Text>
      <Text style={s.lead}>{subtitle}</Text>
    </View>
  );
}

function Feature({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(3) }}>
      <View style={s.featureIcon}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    lead: { ...font.body, color: colors.muted, lineHeight: 22, marginTop: spacing(2) },

    progress: {
      flexDirection: 'row',
      gap: spacing(1.5),
      paddingHorizontal: spacing(6),
      paddingBottom: spacing(2),
    },
    progressDot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
    progressDotActive: { backgroundColor: colors.primary },

    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    featureTitle: { ...font.bodyStrong, color: colors.ink },
    featureBody: { ...font.small, color: colors.muted, marginTop: 1 },

    expenseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    expenseLabel: { ...font.body, color: colors.ink, fontWeight: '600', flexShrink: 1 },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },

    footer: {
      paddingHorizontal: spacing(6),
      paddingTop: spacing(3),
      gap: spacing(2),
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    backButton: {
      width: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
  });
