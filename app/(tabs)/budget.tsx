import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '../../src/components/charts';
import { CardGrid } from '../../src/components/layout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Muted,
  Screen,
  ScreenTitle,
  Segmented,
  useUi,
} from '../../src/components/ui';
import { monthlyAmount } from '../../src/core/budget';
import { categoryLabel, frequencyShort } from '../../src/core/catalog';
import { useT } from '../../src/i18n';
import type { Dict } from '../../src/i18n';
import { formatEuro, formatEuroCents } from '../../src/core/money';
import type { Entry } from '../../src/core/types';
import { useAppState, useSummary } from '../../src/store/hooks';
import { useBudgetStore } from '../../src/store/useBudgetStore';
import { font, radius, spacing, useTheme, useThemedStyles, type Colors } from '../../src/theme';

type Tab = 'income' | 'expense';

export default function BudgetScreen() {
  const ui = useUi();
  const t = useT();
  const s = useThemedStyles(makeStyles);
  const router = useRouter();
  const state = useAppState();
  const summary = useSummary();
  const toggleEntry = useBudgetStore((s) => s.toggleEntry);
  const [tab, setTab] = useState<Tab>('expense');

  const groups = tab === 'income' ? summary.incomeByCategory : summary.expenseByCategory;
  const total = tab === 'income' ? summary.income : summary.totalExpenses;
  const inactive = useMemo(
    () => state.entries.filter((e) => !e.active && e.kind === tab),
    [state.entries, tab],
  );

  return (
    <Screen>
      <ScreenTitle
        title={t.budget.title}
        subtitle={t.budget.subtitle}
      />

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { key: 'expense', label: t.budget.chargesTab(formatEuro(summary.totalExpenses)) },
          { key: 'income', label: t.budget.incomeTab(formatEuro(summary.income)) },
        ]}
      />

      {tab === 'expense' ? (
        <View style={s.summaryRow}>
          <MiniStat label={t.budget.fixed} value={summary.fixedExpenses} />
          <MiniStat label={t.budget.variable} value={summary.variableExpenses} />
          <MiniStat label={t.budget.savings} value={summary.plannedSavings} />
        </View>
      ) : null}

      {groups.length === 0 ? (
        <EmptyState
          emoji={tab === 'income' ? '💼' : '🧾'}
          title={tab === 'income' ? t.budget.emptyIncomeTitle : t.budget.emptyExpenseTitle}
          body={tab === 'income' ? t.budget.emptyIncomeBody : t.budget.emptyExpenseBody}
          actionLabel={t.common.add}
          onAction={() => router.push(`/entry/new?kind=${tab}`)}
        />
      ) : (
        <View style={{ marginTop: spacing(5) }}>
          <CardGrid gap={spacing(3)}>
            {groups.map((group) => (
            <Card key={String(group.key)} style={{ padding: spacing(3.5) }}>
              <View style={s.groupHeader}>
                <View style={s.groupTitle}>
                  <Text style={{ fontSize: 18 }}>{group.meta.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.groupLabel}>{categoryLabel(t, group.key)}</Text>
                    <Muted style={{ fontSize: 12 }}>
                      {t.budget.linesAndShare(group.entries.length, Math.round(group.share * 100))}
                    </Muted>
                  </View>
                </View>
                <Text style={s.groupTotal}>{formatEuro(group.monthly)}</Text>
              </View>

              <View style={{ marginTop: spacing(2), marginBottom: spacing(3) }}>
                <ProgressBar value={group.share} color={group.meta.color} height={5} />
              </View>

              {group.entries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  t={t}
                  onPress={() => router.push(`/entry/${entry.id}`)}
                  onToggle={() => toggleEntry(entry.id)}
                />
              ))}
            </Card>
            ))}
          </CardGrid>
        </View>
      )}

      {inactive.length > 0 ? (
        <>
          <Text style={[ui.h3, { marginTop: spacing(6), marginBottom: spacing(3) }]}>
            {t.budget.pausedCount(inactive.length)}
          </Text>
          <Card style={{ padding: spacing(3.5) }}>
            {inactive.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                t={t}
                onPress={() => router.push(`/entry/${entry.id}`)}
                onToggle={() => toggleEntry(entry.id)}
              />
            ))}
          </Card>
        </>
      ) : null}

      <View style={{ gap: spacing(3), marginTop: spacing(6) }}>
        <Button
          title={t.budget.addCharge}
          icon="remove-circle-outline"
          variant="secondary"
          onPress={() => router.push('/entry/new?kind=expense')}
        />
        <Button
          title={t.budget.addIncome}
          icon="add-circle-outline"
          onPress={() => router.push('/entry/new?kind=income')}
        />
      </View>
    </Screen>
  );
}

function EntryRow({
  entry,
  t,
  onPress,
  onToggle,
}: {
  entry: Entry;
  t: Dict;
  onPress: () => void;
  onToggle: () => void;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const monthly = monthlyAmount(entry);
  const isMonthly = entry.frequency === 'monthly';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.entryRow, pressed && { opacity: 0.6 }, !entry.active && { opacity: 0.45 }]}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2) }}>
          <Text style={s.entryLabel} numberOfLines={1}>
            {entry.label}
          </Text>
          {entry.variable ? <Badge tone="neutral">{t.budget.variableBadge}</Badge> : null}
          {entry.endsOn ? <Badge tone="primary">{t.budget.withEndBadge}</Badge> : null}
        </View>
        <Muted style={{ fontSize: 12, marginTop: 2 }}>
          {isMonthly
            ? entry.dayOfMonth
              ? t.budget.onDay(entry.dayOfMonth)
              : t.budget.monthly
            : `${formatEuroCents(entry.amount)} ${frequencyShort(t, entry.frequency)}`}
        </Muted>
      </View>

      <Text style={s.entryAmount}>{formatEuroCents(monthly)}</Text>

      <Pressable onPress={onToggle} hitSlop={8} style={{ marginLeft: spacing(2) }}>
        <Ionicons
          name={entry.active ? 'pause-circle-outline' : 'play-circle-outline'}
          size={22}
          color={colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.miniStat}>
      <Text style={s.miniLabel}>{label}</Text>
      <Text style={s.miniValue}>{formatEuro(value)}</Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    summaryRow: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(3) },
    miniStat: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing(2.5),
      paddingHorizontal: spacing(3),
    },
    miniLabel: { ...font.small, fontSize: 11, color: colors.muted },
    miniValue: { ...font.bodyStrong, color: colors.ink, marginTop: 2 },

    groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    groupTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing(3), flex: 1 },
    groupLabel: { ...font.h3, color: colors.ink },
    groupTotal: { ...font.h3, color: colors.ink, fontVariant: ['tabular-nums'] },

    entryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing(2.5),
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    entryLabel: { ...font.body, color: colors.ink, fontWeight: '600', flexShrink: 1 },
    entryAmount: { ...font.bodyStrong, color: colors.ink, fontVariant: ['tabular-nums'] },
  });
