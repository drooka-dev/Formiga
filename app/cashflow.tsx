import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SankeyChart } from '../src/components/SankeyChart';
import { flowHeight } from '../src/components/layout';
import { Card, EmptyState, Muted, Screen, Segmented, useUi } from '../src/components/ui';
import { formatEuro } from '../src/core/money';
import { useT } from '../src/i18n';
import { useCashflowGraph, useSummary } from '../src/store/hooks';
import {
  font,
  radius,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Colors,
} from '../src/theme';

type Mode = 'simple' | 'detailed';

/** Hauteur nécessaire pour que la colonne la plus chargée reste lisible. */
function chartHeight(nodesPerDepth: number[], base: number, rowHeight: number): number {
  const densest = Math.max(1, ...nodesPerDepth);
  return Math.max(base, densest * rowHeight);
}

export default function CashflowScreen() {
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const summary = useSummary();
  const { contentWidth, isWide, frameWidth } = useLayout();
  const [mode, setMode] = useState<Mode>('simple');

  const graph = useCashflowGraph(mode === 'detailed');

  const counts = useMemo(() => {
    const perDepth = new Map<number, number>();
    for (const node of graph.nodes) perDepth.set(node.depth, (perDepth.get(node.depth) ?? 0) + 1);
    return [...perDepth.values()];
  }, [graph.nodes]);

  const detailed = mode === 'detailed';
  // Le diagramme tient toujours dans la largeur : un Sankey qu'il faut faire
  // défiler perd ce qui fait son intérêt, voir le flux entier d'un coup d'œil.
  // C'est la hauteur qui absorbe le nombre de lignes.
  const chartWidth = contentWidth - spacing(5);
  const height = flowHeight(
    chartWidth,
    Math.max(1, ...counts),
    detailed ? 36 : 44,
    detailed ? 440 : 340,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[s.topBar, { paddingTop: insets.top + spacing(3) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.inkSoft} />
        </Pressable>
        <Text style={s.topTitle}>{t.cashflow.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Screen contentStyle={{ paddingTop: 0 }}>
        {graph.nodes.length === 0 ? (
          <EmptyState
            emoji="🌊"
            title={t.cashflow.emptyTitle}
            body={t.cashflow.emptyBody}
            actionLabel={t.cashflow.emptyAction}
            onAction={() => router.push('/entry/new')}
          />
        ) : (
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { key: 'simple', label: t.cashflow.byCategory },
                { key: 'detailed', label: t.cashflow.lineByLine },
              ]}
            />

            <View style={s.stats}>
              <Stat label={t.cashflow.inflows} value={summary.income} color={colors.primary} />
              <Stat label={t.cashflow.outflows} value={summary.totalExpenses} color={colors.accent} />
              <Stat
                label={graph.deficit > 0 ? t.cashflow.overdraft : t.cashflow.unallocated}
                value={graph.deficit > 0 ? -graph.deficit : graph.unallocated}
                color={graph.deficit > 0 ? colors.danger : colors.success}
              />
            </View>

            <Card style={{ marginTop: spacing(4), paddingHorizontal: spacing(2.5) }}>
              <SankeyChart
                graph={graph}
                width={chartWidth}
                height={height}
                fontSize={isWide ? 12 : detailed ? 9 : 10}
                maxLabelChars={isWide ? 26 : detailed ? 13 : 17}
                nodePadding={detailed ? 13 : 16}
                nodeWidth={detailed ? 7 : 9}
              />
            </Card>

            <Card tone="plain" style={{ marginTop: spacing(4) }}>
              <Text style={s.legendTitle}>{t.cashflow.howToRead}</Text>
              <Muted style={{ marginTop: spacing(2) }}>{t.cashflow.howToReadBody}</Muted>
              {graph.unallocated > 0 ? (
                <Muted style={{ marginTop: spacing(2) }}>
                  {t.cashflow.unallocatedNote(formatEuro(graph.unallocated))}
                </Muted>
              ) : null}
              {graph.deficit > 0 ? (
                <Muted style={{ marginTop: spacing(2) }}>
                  {t.cashflow.deficitNote(formatEuro(graph.deficit))}
                </Muted>
              ) : null}
            </Card>
          </>
        )}
      </Screen>
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {formatEuro(value)}
      </Text>
    </View>
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

    stats: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(4) },
    stat: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing(3),
    },
    statLabel: { ...font.small, fontSize: 11, color: colors.muted },
    statValue: { ...font.h3, fontSize: 17, marginTop: 2 },

    legendTitle: { ...font.h3, color: colors.ink },
  });
