import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LineChart, ProgressBar } from '../../src/components/charts';
import { AmountField, Field, Slider } from '../../src/components/inputs';
import { Split } from '../../src/components/layout';
import {
  Badge,
  Button,
  Card,
  Chip,
  Muted,
  Screen,
  ScreenTitle,
  SectionTitle,
  useUi,
} from '../../src/components/ui';
import { formatEuro, formatPercent } from '../../src/core/money';
import { useT } from '../../src/i18n';
import {
  PRODUCTS,
  productText,
  riskLabel,
  compareProducts,
  productByKey,
  simulate,
} from '../../src/core/simulation';
import { useAppState, useMonthlyEffort, useSummary } from '../../src/store/hooks';
import {
  font,
  radius,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Colors,
} from '../../src/theme';

export default function SimulationScreen() {
  const ui = useUi();
  const t = useT();
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const { columnWidth } = useLayout();
  const chartWidth = columnWidth - spacing(4) * 2;
  const effort = useMonthlyEffort();
  const summary = useSummary();
  const state = useAppState();

  const [productKey, setProductKey] = useState('livretA');
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(() => Math.max(50, Math.round(effort / 10) * 10));
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(0.02);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [showReal, setShowReal] = useState(false);

  const product = productByKey(productKey);
  const rate = rates[productKey] ?? product.defaultRate;

  const result = useMemo(
    () =>
      simulate({
        initialCapital: initial,
        monthlyContribution: monthly,
        years,
        annualRate: rate,
        ceiling: product.ceiling,
        taxation: product.taxation,
        inflation,
      }),
    [initial, monthly, years, rate, product, inflation],
  );

  const comparison = useMemo(
    () =>
      compareProducts(
        PRODUCTS.map((p) => p.key),
        { initialCapital: initial, monthlyContribution: monthly, years, inflation },
        rates,
      ),
    [initial, monthly, years, inflation, rates],
  );

  const netSeries = result.years.map((y) => (showReal ? y.real : y.net));
  const depositSeries = result.years.map((y) => y.deposited);
  const bestNet = comparison[0]?.result.net ?? 1;

  return (
    <Screen>
      <ScreenTitle
        title={t.simulation.title}
        subtitle={t.simulation.subtitle}
      />

      {/* Les réglages restent visibles à côté de leur résultat sur écran large. */}
      <Split
        left={
          <>
          {/* Paramètres */}
          <Card>
            <Field label={t.simulation.monthlyPayment}>
              <AmountField value={monthly} onChange={setMonthly} size="small" />
              {effort > 0 ? (
                <View style={{ flexDirection: 'row', gap: spacing(2), marginTop: spacing(3), flexWrap: 'wrap' }}>
                  <Chip
                    label={t.simulation.myCapacity(formatEuro(effort))}
                    emoji="🐜"
                    active={monthly === Math.round(effort)}
                    onPress={() => setMonthly(Math.round(effort))}
                  />
                  {state.goals.monthlySavingTarget > 0 ? (
                    <Chip
                      label={t.simulation.myGoal(formatEuro(state.goals.monthlySavingTarget))}
                      emoji="🎯"
                      active={monthly === state.goals.monthlySavingTarget}
                      onPress={() => setMonthly(state.goals.monthlySavingTarget)}
                    />
                  ) : null}
                </View>
              ) : null}
            </Field>
    
            <Field label={t.simulation.initialCapital}>
              <AmountField value={initial} onChange={setInitial} size="small" />
              {state.goals.currentSavings > 0 ? (
                <View style={{ marginTop: spacing(3) }}>
                  <Chip
                    label={t.simulation.mySavings(formatEuro(state.goals.currentSavings))}
                    emoji="💰"
                    active={initial === state.goals.currentSavings}
                    onPress={() => setInitial(state.goals.currentSavings)}
                  />
                </View>
              ) : null}
            </Field>
    
            <Field label={t.simulation.duration(t.common.years(years))}>
              <Slider value={years} min={1} max={40} step={1} onChange={setYears} />
              <View style={s.sliderScale}>
                <Muted style={{ fontSize: 11 }}>{t.simulation.oneYear}</Muted>
                <Muted style={{ fontSize: 11 }}>{t.simulation.fortyYears}</Muted>
              </View>
            </Field>
    
            <Field
              label={t.simulation.inflationLabel(formatPercent(inflation, 1))}
              hint={t.simulation.inflationHint}
            >
              <Slider value={inflation} min={0} max={0.06} step={0.001} onChange={setInflation} color={colors.accent} />
            </Field>
          </Card>
          {/* Choix du support */}
          <SectionTitle title={t.simulation.supportTitle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing(2), paddingRight: spacing(5) }}>
            {PRODUCTS.map((p) => (
              <Chip
                key={p.key}
                label={productText(t, p.key).label}
                emoji={p.emoji}
                active={p.key === productKey}
                onPress={() => setProductKey(p.key)}
              />
            ))}
          </ScrollView>
    
          <Card style={{ marginTop: spacing(3) }}>
            <View style={s.rowBetween}>
              <Text style={ui.h3}>
                {product.emoji} {productText(t, product.key).label}
              </Text>
              <Badge tone={product.risk === 0 ? 'success' : product.risk >= 3 ? 'danger' : 'warn'}>
                {riskLabel(t, product.risk)}
              </Badge>
            </View>
            <Muted style={{ marginTop: spacing(2) }}>
              {productText(t, product.key).description}
            </Muted>
    
            <View style={{ marginTop: spacing(4) }}>
              <Text style={s.rateLabel}>
                {t.simulation.yieldRetained}
                <Text style={s.rateValue}>{formatPercent(rate, 2)}</Text>
              </Text>
              <Slider
                value={rate}
                min={0}
                max={0.12}
                step={0.0005}
                onChange={(v) => setRates((r) => ({ ...r, [productKey]: v }))}
              />
              {rate !== product.defaultRate ? (
                <Button
                  title={t.simulation.backToDefault(formatPercent(product.defaultRate, 2))}
                  variant="ghost"
                  onPress={() => setRates((r) => ({ ...r, [productKey]: product.defaultRate }))}
                />
              ) : null}
            </View>
    
            <View style={s.metaRow}>
              <View style={s.metaItem}>
                <Ionicons name="lock-open-outline" size={14} color={colors.muted} />
                <Muted style={{ fontSize: 12, flex: 1 }}>
                  {productText(t, product.key).liquidity}
                </Muted>
              </View>
              <View style={s.metaItem}>
                <Ionicons name="receipt-outline" size={14} color={colors.muted} />
                <Muted style={{ fontSize: 12, flex: 1 }}>
                  {result.taxRate === 0
                    ? t.simulation.noTax
                    : t.simulation.taxOnGains(
                        formatPercent(result.taxRate, 1),
                        t.common.years(years),
                      )}
                </Muted>
              </View>
              {product.ceiling ? (
                <View style={s.metaItem}>
                  <Ionicons name="speedometer-outline" size={14} color={colors.muted} />
                  <Muted style={{ fontSize: 12, flex: 1 }}>
                    {t.simulation.ceiling(formatEuro(product.ceiling))}
                    {result.ceilingReachedAtMonth !== null
                      ? t.simulation.ceilingReached(Math.round(result.ceilingReachedAtMonth / 12))
                      : ''}
                  </Muted>
                </View>
              ) : null}
            </View>
          </Card>
          </>
        }
        right={
          <>
          {/* Résultat */}
          <SectionTitle title={t.simulation.resultTitle(t.common.years(years))} />
          <Card tone="primary">
            <Text style={s.resultLabel}>{t.simulation.netCapital}</Text>
            <Text style={s.resultValue}>{formatEuro(result.net)}</Text>
            <Text style={s.resultSub}>
              {t.simulation.resultSub(formatEuro(result.netGains), formatEuro(result.deposited))}
            </Text>
    
            <View style={s.resultBar}>
              <ProgressBar
                value={result.deposited / Math.max(result.net, 1)}
                color="rgba(255,255,255,0.95)"
                track="rgba(255,255,255,0.28)"
                height={10}
              />
              <View style={[s.rowBetween, { marginTop: spacing(2) }]}>
                <Text style={s.resultLegend}>{t.simulation.payments(formatEuro(result.deposited))}</Text>
                <Text style={s.resultLegend}>{t.simulation.netInterest(formatEuro(result.netGains))}</Text>
              </View>
            </View>
          </Card>
    
          <Card style={{ marginTop: spacing(3) }}>
            <View style={s.rowBetween}>
              <Text style={ui.h3}>{t.simulation.evolution}</Text>
              <Chip
                label={showReal ? t.simulation.constantEuros : t.simulation.currentEuros}
                emoji={showReal ? '📉' : '💶'}
                onPress={() => setShowReal((v) => !v)}
              />
            </View>
            <View style={{ marginTop: spacing(3) }}>
              <LineChart
                width={chartWidth}
                height={200}
                series={[
                  { key: 'net', color: colors.primary, points: netSeries, fill: true },
                  { key: 'deposited', color: colors.muted, points: depositSeries, dashed: true },
                ]}
                xLabels={result.years.map((y) => (y.year === 0 ? '0' : `${Math.round(y.year)}a`))}
              />
            </View>
            <View style={s.chartLegend}>
              <LegendDot color={colors.primary} label={showReal ? t.simulation.netValueReal : t.simulation.netValue} />
              <LegendDot color={colors.muted} label={t.simulation.totalDeposited} />
            </View>
            {showReal ? (
              <Muted style={{ marginTop: spacing(2) }}>
                {t.simulation.realNote(
                  formatEuro(result.net),
                  formatEuro(result.real),
                  formatPercent(inflation, 1),
                )}
              </Muted>
            ) : null}
          </Card>
          </>
        }
      />

      {/* Comparatif */}
      <SectionTitle title={t.simulation.comparisonTitle} />
      <Card>
        <Muted style={{ marginBottom: spacing(3) }}>
          {t.simulation.sameEffort(formatEuro(monthly), t.common.years(years))}
        </Muted>
        {comparison.map((row, i) => (
          <View key={row.product.key} style={[s.compareRow, i > 0 && s.compareBorder]}>
            <View style={s.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2), flex: 1 }}>
                <Text style={{ fontSize: 16 }}>{row.product.emoji}</Text>
                <Text style={s.compareLabel} numberOfLines={1}>
                  {productText(t, row.product.key).label}
                </Text>
              </View>
              <Text style={s.compareValue}>{formatEuro(row.result.net)}</Text>
            </View>
            <View style={{ marginTop: spacing(2) }}>
              <ProgressBar
                value={row.result.net / bestNet}
                color={row.product.key === productKey ? colors.primary : colors.muted}
                height={6}
              />
            </View>
            <Muted style={{ fontSize: 11, marginTop: spacing(1.5) }}>
              {t.simulation.grossRate(
                formatPercent(rates[row.product.key] ?? row.product.defaultRate, 2),
              )}
              {" · "}
              {row.result.taxRate === 0
                ? t.simulation.netOfTax
                : t.simulation.taxOf(formatPercent(row.result.taxRate, 1))}
              {" · "}
              {riskLabel(t, row.product.risk).toLowerCase()}
            </Muted>
          </View>
        ))}
      </Card>

      <Card tone="plain" style={{ marginTop: spacing(4) }}>
        <Text style={{ fontSize: 18 }}>⚠️</Text>
        <Muted style={{ marginTop: spacing(2) }}>{t.simulation.disclaimer}</Muted>
        <Muted style={{ marginTop: spacing(2) }}>{t.simulation.frenchProductsNote}</Muted>
      </Card>
    </Screen>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) }}>
      <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: color }} />
      <Text style={{ ...font.small, fontSize: 11, color: colors.muted }}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sliderScale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -spacing(1) },

    rateLabel: { ...font.small, color: colors.muted },
    rateValue: { ...font.bodyStrong, color: colors.ink },

    metaRow: { marginTop: spacing(3), gap: spacing(2) },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },

    resultLabel: { ...font.tiny, color: 'rgba(255,255,255,0.75)' },
    resultValue: { fontSize: 38, fontWeight: '700', color: '#FFFFFF', letterSpacing: -1, marginTop: 2 },
    resultSub: { ...font.small, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    resultBar: { marginTop: spacing(4) },
    resultLegend: { ...font.small, fontSize: 11, color: 'rgba(255,255,255,0.85)' },

    chartLegend: { flexDirection: 'row', gap: spacing(4), marginTop: spacing(2) },

    compareRow: { paddingVertical: spacing(3) },
    compareBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    compareLabel: { ...font.body, color: colors.ink, fontWeight: '600', flex: 1 },
    compareValue: { ...font.bodyStrong, color: colors.ink, fontVariant: ['tabular-nums'] },
  });
