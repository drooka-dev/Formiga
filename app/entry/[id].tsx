import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { confirm } from '../../src/components/dialogs';
import { Badge, Button, Card, Chip, Muted, Segmented, useUi } from '../../src/components/ui';
import { AmountField, DayPicker, Field, Stepper, SwitchRow, TextField } from '../../src/components/inputs';
import {
  EXPENSE_CATEGORIES,
  FREQUENCY_KEYS,
  INCOME_CATEGORIES,
  categoryLabel,
  categoryMeta,
  quickExpense,
  quickIncome,
} from '../../src/core/catalog';
import { useI18n } from '../../src/i18n';
import { formatEuroCents, toMonthly } from '../../src/core/money';
import type { Category, EntryKind, Frequency } from '../../src/core/types';
import { useBudgetStore } from '../../src/store/useBudgetStore';
import {
  font,
  radius,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Colors,
} from '../../src/theme';

export default function EntryEditor() {
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const { frameWidth } = useLayout();
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; kind?: EntryKind; category?: Category }>();
  const isNew = params.id === 'new';

  const entries = useBudgetStore((s) => s.entries);
  const addEntry = useBudgetStore((s) => s.addEntry);
  const updateEntry = useBudgetStore((s) => s.updateEntry);
  const removeEntry = useBudgetStore((s) => s.removeEntry);
  const duplicateEntry = useBudgetStore((s) => s.duplicateEntry);

  const existing = useMemo(
    () => (isNew ? undefined : entries.find((e) => e.id === params.id)),
    [entries, params.id, isNew],
  );

  const [kind, setKind] = useState<EntryKind>(existing?.kind ?? params.kind ?? 'expense');
  const [amount, setAmount] = useState(existing?.amount ?? 0);
  const [frequency, setFrequency] = useState<Frequency>(existing?.frequency ?? 'monthly');
  const [label, setLabel] = useState(existing?.label ?? '');
  const [category, setCategory] = useState<Category>(
    existing?.category ?? params.category ?? (kind === 'income' ? 'salary' : 'housing'),
  );
  const [dayOfMonth, setDayOfMonth] = useState<number | undefined>(existing?.dayOfMonth);
  const [variable, setVariable] = useState(
    existing?.variable ?? categoryMeta(category).defaultVariable ?? false,
  );
  const [hasEnd, setHasEnd] = useState(Boolean(existing?.endsOn));
  const [monthsLeft, setMonthsLeft] = useState(() => {
    if (!existing?.endsOn) return 12;
    const end = new Date(existing.endsOn);
    const now = new Date();
    return Math.max(
      1,
      (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()),
    );
  });
  const [showAdvanced, setShowAdvanced] = useState(Boolean(existing?.endsOn || existing?.dayOfMonth));

  const quick = kind === 'income' ? quickIncome(t) : quickExpense(t);
  const categories = Object.values(kind === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES);

  const switchKind = (next: EntryKind) => {
    setKind(next);
    setCategory(next === 'income' ? 'salary' : 'housing');
    setVariable(false);
  };

  const pickQuick = (item: { label: string; category: Category }) => {
    Haptics.selectionAsync().catch(() => undefined);
    setLabel(item.label);
    setCategory(item.category);
    setVariable(categoryMeta(item.category).defaultVariable ?? false);
  };

  const pickCategory = (key: Category) => {
    setCategory(key);
    if (!existing) setVariable(categoryMeta(key).defaultVariable ?? false);
  };

  const monthlyPreview = toMonthly(amount, frequency);

  const canSave = amount > 0 && label.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const endsOn = hasEnd
      ? new Date(new Date().getFullYear(), new Date().getMonth() + monthsLeft, 1).toISOString()
      : undefined;

    const payload = {
      kind,
      label: label.trim(),
      amount,
      frequency,
      category,
      dayOfMonth,
      variable,
      endsOn,
    };

    if (existing) updateEntry(existing.id, payload);
    else addEntry({ ...payload, active: true, variable });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  };

  const confirmDelete = async () => {
    if (!existing) return;
    const accepted = await confirm({
      title: t.entry.deleteTitle,
      message: t.entry.deleteBody(existing.label),
      confirmLabel: t.common.delete,
      cancelLabel: t.common.cancel,
      destructive: true,
    });
    if (!accepted) return;
    removeEntry(existing.id);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[s.topBar, { paddingTop: insets.top + spacing(3) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.inkSoft} />
        </Pressable>
        <Text style={s.topTitle}>{isNew ? t.entry.newLine : t.entry.editLine}</Text>
        {existing ? (
          <Pressable
            onPress={() => {
              duplicateEntry(existing.id, t.entry.copySuffix(existing.label));
              router.back();
            }}
            hitSlop={10}
          >
            <Ionicons name="copy-outline" size={20} color={colors.inkSoft} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing(5), paddingBottom: spacing(20), width: '100%', maxWidth: frameWidth, alignSelf: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Segmented
          value={kind}
          onChange={switchKind}
          options={[
            { key: 'expense', label: t.entry.aCharge },
            { key: 'income', label: t.entry.anIncome },
          ]}
        />

        <View style={{ marginTop: spacing(5) }}>
          <AmountField value={amount} onChange={setAmount} autoFocus={isNew} />
          <View style={s.freqRow}>
            {FREQUENCY_KEYS.map((f) => (
              <Chip
                key={f}
                label={t.frequencies[f]}
                active={frequency === f}
                onPress={() => setFrequency(f)}
              />
            ))}
          </View>
          {frequency !== 'monthly' && amount > 0 ? (
            <View style={s.previewRow}>
              <Ionicons name="repeat" size={14} color={colors.primary} />
              <Text style={s.previewText}>
                {t.entry.equivalentPerMonth(formatEuroCents(monthlyPreview))}
              </Text>
            </View>
          ) : null}
        </View>

        {isNew ? (
          <Field label={t.entry.shortcuts} style={{ marginTop: spacing(6) }}>
            <View style={s.chipWrap}>
              {quick.map((item) => (
                <Chip
                  key={item.key}
                  label={item.label}
                  emoji={item.emoji}
                  active={label === item.label}
                  onPress={() => pickQuick(item)}
                />
              ))}
            </View>
          </Field>
        ) : null}

        <Field label={t.entry.label}>
          <TextField
            value={label}
            onChangeText={setLabel}
            placeholder={
              kind === 'income' ? t.entry.labelPlaceholderIncome : t.entry.labelPlaceholderExpense
            }
          />
        </Field>

        <Field label={t.entry.category}>
          <View style={s.chipWrap}>
            {categories.map((c) => (
              <Chip
                key={c.key}
                label={categoryLabel(t, c.key)}
                emoji={c.emoji}
                active={category === c.key}
                onPress={() => pickCategory(c.key)}
              />
            ))}
          </View>
        </Field>

        <Pressable onPress={() => setShowAdvanced((v) => !v)} style={s.advancedToggle}>
          <Text style={s.advancedText}>{t.entry.advancedOptions}</Text>
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.primary}
          />
        </Pressable>

        {showAdvanced ? (
          <Card style={{ marginBottom: spacing(4) }}>
            <SwitchRow
              label={t.entry.variableAmount}
              hint={t.entry.variableHint}
              value={variable}
              onChange={setVariable}
            />

            <View style={s.sep} />

            <Field label={kind === 'income' ? t.entry.incomeDay : t.entry.expenseDay}
              hint={t.entry.dayHint}
            >
              <DayPicker value={dayOfMonth} onChange={setDayOfMonth} />
            </Field>

            <View style={s.sep} />

            <SwitchRow
              label={t.entry.hasEnd}
              hint={t.entry.hasEndHint}
              value={hasEnd}
              onChange={setHasEnd}
            />
            {hasEnd ? (
              <Field label={t.entry.remainingPayments}>
                <Stepper
                  value={monthsLeft}
                  onChange={setMonthsLeft}
                  min={1}
                  max={480}
                  step={1}
                  format={(v) => t.common.months(v)}
                />
                <Muted style={{ marginTop: spacing(2) }}>
                  {t.entry.endExpected(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + monthsLeft,
                      1,
                    ).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
                  )}
                </Muted>
              </Field>
            ) : null}
          </Card>
        ) : null}

        {existing ? (
          <Button title={t.entry.deleteLine} variant="danger" icon="trash-outline" onPress={confirmDelete} />
        ) : null}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + spacing(4) }]}>
        {amount > 0 && label.trim() ? (
          <View style={s.footerPreview}>
            <Badge tone={kind === 'income' ? 'success' : 'neutral'}>
              {kind === 'income' ? '+' : '−'}
              {t.advice.perMonthBadge(formatEuroCents(monthlyPreview))}
            </Badge>
          </View>
        ) : null}
        <Button title={isNew ? t.entry.addToBudget : t.common.save} onPress={save} disabled={!canSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing(5),
      paddingBottom: spacing(3),
    },
    topTitle: { ...font.h3, color: colors.ink },

    freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2), marginTop: spacing(3) },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },

    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(1.5),
      marginTop: spacing(3),
      alignSelf: 'center',
    },
    previewText: { ...font.small, color: colors.primary, fontWeight: '600' },

    advancedToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(1.5),
      paddingVertical: spacing(3),
      marginBottom: spacing(3),
    },
    advancedText: { ...font.bodyStrong, fontSize: 14, color: colors.primary },

    sep: { height: 1, backgroundColor: colors.border, marginVertical: spacing(3) },

    footer: {
      paddingHorizontal: spacing(5),
      paddingTop: spacing(3),
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
    },
    footerPreview: { alignItems: 'center', marginBottom: spacing(3) },
  });
