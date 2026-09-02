import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DonutChart, Legend, LineChart, ProgressBar, ScoreRing, StackedBar } from '../../src/components/charts';
import { Logo } from '../../src/components/Logo';
import { SankeyChart } from '../../src/components/SankeyChart';
import { CardGrid, Split, flowHeight } from '../../src/components/layout';
import { confirm } from '../../src/components/dialogs';
import { Badge, Button, Card, EmptyState, Muted, Screen, SectionTitle, useUi } from '../../src/components/ui';
import { scoreLabel } from '../../src/core/advice';
import { useI18n } from '../../src/i18n';
import { goalProgress, monthlyAmount } from '../../src/core/budget';
import { categoryLabel } from '../../src/core/catalog';
import { formatEuro, formatEuroCents, formatPercent } from '../../src/core/money';

import {
  useAppState,
  useCashflowGraph,
  useEncouragement,
  useProjection,
  useSummary,
} from '../../src/store/hooks';
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

export default function Dashboard() {
  const ui = useUi();
  const s = useThemedStyles(makeStyles);
  const { colors, tint } = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const state = useAppState();
  const summary = useSummary();
  const projection = useProjection(12);
  const encouragement = useEncouragement();
  const { contentWidth, columnWidth, isWide } = useLayout();
  // Largeur utile à l’intérieur d’une carte, marges intérieures déduites.
  const inCard = (outer: number) => outer - spacing(4) * 2;

  const cashflow = useCashflowGraph(false);
  // Assez de hauteur pour que les postes les plus fins gardent un libellé lisible.
  const cashflowWidth = inCard(contentWidth) + spacing(4);
  const cashflowHeight = flowHeight(
    cashflowWidth,
    cashflow.nodes.filter((n) => n.depth === 2).length,
    31,
    260,
  );

  const donutSlices = useMemo(
    () =>
      summary.expenseByCategory.slice(0, 6).map((c) => ({
        key: String(c.key),
        label: categoryLabel(t, c.key),
        value: c.monthly,
        color: tint(c.meta.color),
      })),
    [summary.expenseByCategory, tint],
  );

  const upcoming = useMemo(() => {
    const today = new Date().getDate();
    return state.entries
      .filter((e) => e.active && e.dayOfMonth)
      .map((e) => {
        const day = e.dayOfMonth as number;
        return { entry: e, day, inDays: day >= today ? day - today : day + 30 - today };
      })
      .sort((a, b) => a.inDays - b.inDays)
      .slice(0, 4);
  }, [state.entries]);

  const progress = goalProgress(state.goals, summary);
  const effort = summary.plannedSavings + Math.max(summary.margin, 0);
  const goalRatio =
    state.goals.monthlySavingTarget > 0 ? effort / state.goals.monthlySavingTarget : 0;
  const resetAll = useBudgetStore((st) => st.resetAll);

  const startOver = async () => {
    const accepted = await confirm({
      title: t.settings.startOverTitle,
      message: t.settings.startOverBody,
      confirmLabel: t.settings.startOverConfirm,
      cancelLabel: t.common.cancel,
      destructive: true,
    });
    if (!accepted) return;
    resetAll();
    router.replace('/onboarding');
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? t.dashboard.goodNight : hour < 18 ? t.dashboard.goodMorning : t.dashboard.goodEvening;
  const name = state.settings.firstName ? `, ${state.settings.firstName}` : '';

  if (summary.income === 0 && state.entries.length === 0) {
    return (
      <Screen>
        <View style={s.header}>
          <View>
            <Text style={ui.h1}>Formiga</Text>
            <Muted>{t.dashboard.tagline}</Muted>
          </View>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={22} color={colors.inkSoft} />
          </Pressable>
        </View>
        <EmptyState
          icon={<Logo size={72} />}
          title={t.dashboard.emptyTitle}
          body={t.dashboard.emptyBody}
          actionLabel={t.dashboard.emptyAction}
          onAction={() => router.push('/entry/new?kind=income')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Muted>
            {greeting}
            {name}
          </Muted>
          <Text style={ui.h1}>
            {new Date().toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
          <Ionicons name="settings-outline" size={22} color={colors.inkSoft} />
        </Pressable>
      </View>

      {/* Rappel que les chiffres affichés sont ceux de la démonstration */}
      {state.settings.isSample ? (
        <Card style={s.sampleBanner}>
          <View style={{ flexDirection: 'row', gap: spacing(3) }}>
            <Text style={{ fontSize: 20 }}>🧪</Text>
            <View style={{ flex: 1 }}>
              <Text style={ui.h3}>{t.dashboard.sampleBannerTitle}</Text>
              <Muted style={{ marginTop: spacing(1.5) }}>{t.dashboard.sampleBannerBody}</Muted>
              <Button
                title={t.dashboard.sampleBannerAction}
                variant="secondary"
                icon="refresh-outline"
                onPress={startOver}
                style={{ marginTop: spacing(3) }}
              />
            </View>
          </View>
        </Card>
      ) : null}

      {/* Reste à vivre — la carte maîtresse */}
      <Card tone="primary">
        <View style={s.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.heroLabel}>{t.dashboard.disposableIncome}</Text>
            <Text style={s.heroValue}>{formatEuro(summary.resteAVivre)}</Text>
            <Text style={s.heroSub}>
              {t.dashboard.perDayAndDaysLeft(formatEuroCents(summary.dailyAllowance), summary.daysLeft)}
            </Text>
          </View>
          <ScoreRing score={summary.healthScore} size={96} stroke={9} label={scoreLabel(t, summary.healthScore)} />
        </View>

        <View style={s.heroBar}>
          <StackedBar
            segments={[
              { key: 'fixed', label: t.dashboard.fixedCharges, value: summary.fixedExpenses, color: 'rgba(255,255,255,0.9)' },
              { key: 'savings', label: t.dashboard.savings, value: summary.plannedSavings, color: 'rgba(255,255,255,0.55)' },
              { key: 'rest', label: t.dashboard.toLive, value: Math.max(summary.resteAVivre, 0), color: 'rgba(255,255,255,0.22)' },
            ]}
          />
          <View style={s.heroLegend}>
            <HeroLegendItem label={t.dashboard.fixedCharges} value={summary.fixedExpenses} opacity={0.9} />
            <HeroLegendItem label={t.dashboard.savings} value={summary.plannedSavings} opacity={0.55} />
            <HeroLegendItem label={t.dashboard.toLive} value={Math.max(summary.resteAVivre, 0)} opacity={0.28} />
          </View>
        </View>
      </Card>

      {/* Trois chiffres clés */}
      <View style={s.tiles}>
        <Tile label={t.dashboard.income} value={formatEuro(summary.income)} color={colors.primary} icon="arrow-down" />
        <Tile label={t.dashboard.charges} value={formatEuro(summary.totalExpenses)} color={colors.accent} icon="arrow-up" />
        <Tile
          label={t.dashboard.margin}
          value={formatEuro(summary.margin)}
          color={summary.margin >= 0 ? colors.success : colors.danger}
          icon={summary.margin >= 0 ? 'trending-up' : 'trending-down'}
        />
      </View>

      {/* Flux */}
      {cashflow.nodes.length > 0 ? (
        <>
          <SectionTitle
            title={t.dashboard.cashflowTitle}
            action={t.dashboard.enlarge}
            onAction={() => router.push('/cashflow')}
          />
          <Card style={{ paddingHorizontal: spacing(2) }} onPress={() => router.push('/cashflow')}>
            <SankeyChart
              graph={cashflow}
              width={cashflowWidth}
              height={cashflowHeight}
              fontSize={isWide ? 11 : 9}
              maxLabelChars={isWide ? 24 : 14}
              nodePadding={15}
            />
          </Card>
        </>
      ) : null}

      {/* Sur écran large, les cartes secondaires se partagent la largeur
          plutôt que de s’étirer sur toute la ligne. */}
      <Split
        left={
          <>
          {/* Objectif d'épargne */}
          {state.goals.monthlySavingTarget > 0 ? (
            <>
              <SectionTitle title={t.dashboard.savingGoalTitle} action={t.common.edit} onAction={() => router.push('/goals')} />
              <Card>
                <View style={s.rowBetween}>
                  <Text style={ui.h2}>{formatEuro(effort)}</Text>
                  <Badge tone={progress >= 1 ? 'success' : progress >= 0.8 ? 'warn' : 'neutral'}>
                    {t.dashboard.ofGoal(formatPercent(goalRatio))}
                  </Badge>
                </View>
                <Muted style={{ marginTop: 2 }}>
                  {t.dashboard.onTarget(formatEuro(state.goals.monthlySavingTarget))}
                </Muted>
                <View style={{ marginTop: spacing(3) }}>
                  <ProgressBar
                    value={progress}
                    color={progress >= 1 ? colors.success : colors.primary}
                    height={12}
                  />
                </View>
              </Card>
            </>
          ) : null}
          {/* Répartition */}
          <SectionTitle title={t.dashboard.whereMoneyGoes} action={t.common.detail} onAction={() => router.push('/budget')} />
          <Card>
            {summary.totalExpenses > 0 ? (
              <View style={s.donutRow}>
                <DonutChart
                  slices={donutSlices}
                  size={140}
                  thickness={22}
                  centerTop={formatEuro(summary.totalExpenses)}
                  centerBottom={t.common.perMonth}
                />
                <Legend slices={donutSlices} total={summary.totalExpenses} />
              </View>
            ) : (
              <Muted>{t.dashboard.addChargesToSee}</Muted>
            )}
          </Card>
          </>
        }
        right={
          <>
          {/* Projection */}
          <SectionTitle title={t.dashboard.projectionTitle} />
          <Card>
            <Text style={ui.h2}>{formatEuro(projection[projection.length - 1]?.savings ?? 0)}</Text>
            <Muted>
              {t.dashboard.projectionSub(effort > 0 ? formatEuro(effort) : null)}
            </Muted>
            <View style={{ marginTop: spacing(3) }}>
              <LineChart
                width={inCard(columnWidth)}
                height={180}
                series={[
                  {
                    key: 'savings',
                    color: colors.primary,
                    points: [state.goals.currentSavings, ...projection.map((p) => p.savings)],
                    fill: true,
                  },
                ]}
                xLabels={[t.dashboard.today, ...projection.map((p) => p.label)]}
              />
            </View>
          </Card>
          {/* Prochaines échéances */}
          {upcoming.length > 0 ? (
            <>
              <SectionTitle title={t.dashboard.upcoming} />
              <Card>
                {upcoming.map((u, i) => (
                  <View key={u.entry.id}>
                    {i > 0 ? <View style={s.sep} /> : null}
                    <View style={s.rowBetween}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(3), flex: 1 }}>
                        <View style={s.dayChip}>
                          <Text style={s.dayChipText}>{u.day}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.entryLabel} numberOfLines={1}>
                            {u.entry.label}
                          </Text>
                          <Muted style={{ fontSize: 12 }}>
                            {u.inDays === 0 ? t.dashboard.today : t.dashboard.inDays(u.inDays)}
                          </Muted>
                        </View>
                      </View>
                      <Text
                        style={[
                          s.entryAmount,
                          { color: u.entry.kind === 'income' ? colors.success : colors.ink },
                        ]}
                      >
                        {u.entry.kind === 'income' ? '+' : '−'}
                        {formatEuroCents(monthlyAmount(u.entry))}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card>
            </>
          ) : null}
          </>
        }
      />

      {/* Encouragement */}
      <SectionTitle title={t.dashboard.wordOfTheDay} action={t.dashboard.allAdvice} onAction={() => router.push('/advice')} />
      <Card tone="plain">
        <Logo size={30} />
        <Text style={s.quote}>{encouragement}</Text>
      </Card>

      <Button
        title={t.dashboard.addBudgetLine}
        icon="add-circle-outline"
        onPress={() => router.push('/entry/new')}
        style={{ marginTop: spacing(6) }}
      />
    </Screen>
  );
}

function HeroLegendItem({ label, value, opacity }: { label: string; value: number; opacity: number }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: `rgba(255,255,255,${opacity})` }} />
        <Text style={s.heroLegendLabel}>{label}</Text>
      </View>
      <Text style={s.heroLegendValue}>{formatEuro(value)}</Text>
    </View>
  );
}

function Tile({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.tile}>
      <View style={[s.tileIcon, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <Text style={s.tileLabel}>{label}</Text>
      <Text style={[s.tileValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    sampleBanner: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginBottom: spacing(4),
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing(4),
    },
    heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
    heroLabel: { ...font.tiny, color: 'rgba(255,255,255,0.75)' },
    heroValue: { fontSize: 42, fontWeight: '700', color: '#FFFFFF', letterSpacing: -1.2, marginTop: 2 },
    heroSub: { ...font.small, color: 'rgba(255,255,255,0.82)', marginTop: 4 },
    heroBar: { marginTop: spacing(5) },
    heroLegend: { flexDirection: 'row', marginTop: spacing(3), gap: spacing(2) },
    heroLegendLabel: { ...font.small, fontSize: 11, color: 'rgba(255,255,255,0.78)' },
    heroLegendValue: { ...font.bodyStrong, fontSize: 14, color: '#FFFFFF', marginTop: 2 },

    tiles: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(3) },
    tile: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing(3),
    },
    tileIcon: {
      width: 24,
      height: 24,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing(2),
    },
    tileLabel: { ...font.small, fontSize: 11, color: colors.muted },
    tileValue: { ...font.h3, fontSize: 17, marginTop: 2 },

    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    donutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(4) },

    sep: { height: 1, backgroundColor: colors.border, marginVertical: spacing(2) },
    dayChip: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayChipText: { ...font.bodyStrong, color: colors.inkSoft, fontVariant: ['tabular-nums'] },
    entryLabel: { ...font.body, color: colors.ink, fontWeight: '600' },
    entryAmount: { ...font.bodyStrong, fontVariant: ['tabular-nums'] },

    quote: { ...font.body, color: colors.inkSoft, lineHeight: 22, marginTop: spacing(2) },
  });
