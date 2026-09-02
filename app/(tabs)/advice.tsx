import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProgressBar, ScoreRing } from '../../src/components/charts';
import { Logo } from '../../src/components/Logo';
import { CardGrid } from '../../src/components/layout';
import { Badge, Button, Card, EmptyState, Muted, Screen, ScreenTitle, SectionTitle, useUi } from '../../src/components/ui';
import { scoreLabel, scorePartText, type Advice, type AdviceTone } from '../../src/core/advice';
import { useT } from '../../src/i18n';
import type { Dict } from '../../src/i18n';
import { formatEuro } from '../../src/core/money';
import { suggestAllocation } from '../../src/core/simulation';
import { useAdvice, useAppState, useEncouragement, useMonthlyEffort, useSummary } from '../../src/store/hooks';
import { font, radius, spacing, useTheme, useThemedStyles, type Colors } from '../../src/theme';

interface ToneStyle {
  bg: string;
  fg: string;
  label: string;
  badge: 'danger' | 'warn' | 'primary' | 'success';
}

const toneStyles = (colors: Colors, t: Dict): Record<AdviceTone, ToneStyle> => ({
  critical: {
    bg: colors.dangerSoft,
    fg: colors.dangerInk,
    label: t.advice.toneCritical,
    badge: 'danger',
  },
  warning: { bg: colors.warnSoft, fg: colors.warnInk, label: t.advice.toneWarning, badge: 'warn' },
  tip: { bg: colors.primarySoft, fg: colors.primaryInk, label: t.advice.toneTip, badge: 'primary' },
  win: { bg: colors.successSoft, fg: colors.successInk, label: t.advice.toneWin, badge: 'success' },
});

const TONE_ORDER: AdviceTone[] = ['critical', 'warning', 'tip', 'win'];

export default function AdviceScreen() {
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const t = useT();
  const router = useRouter();
  const advice = useAdvice();
  const summary = useSummary();
  const state = useAppState();
  const effort = useMonthlyEffort();
  const encouragement = useEncouragement();

  const allocation = useMemo(
    () => suggestAllocation(t, effort, summary.emergencyMonthsCovered, state.goals.emergencyMonths || 3),
    [t, effort, summary.emergencyMonthsCovered, state.goals.emergencyMonths],
  );

  const tones = useMemo(() => toneStyles(colors, t), [colors, t]);

  const grouped = useMemo(() => {
    return TONE_ORDER
      .map((tone) => ({ tone, items: advice.filter((a) => a.tone === tone) }))
      .filter((g) => g.items.length > 0);
  }, [advice]);

  return (
    <Screen>
      <ScreenTitle
        title={t.advice.title}
        subtitle={t.advice.subtitle}
      />

      {/* Score détaillé */}
      <Card tone="primary">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(4) }}>
          <ScoreRing score={summary.healthScore} size={104} stroke={10} />
          <View style={{ flex: 1 }}>
            <Text style={s.scoreTitle}>{t.score.budgetHealth}</Text>
            <Text style={s.scoreLabel}>{scoreLabel(t, summary.healthScore)}</Text>
            <Text style={s.scoreHint}>
              {t.score.compositeNote}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: spacing(3) }}>
        {summary.scoreParts.map((part, i) => {
          const partText = scorePartText(t, part.key, state.goals.emergencyMonths || 3);
          return (
          <View key={part.key} style={[{ paddingVertical: spacing(2.5) }, i > 0 && s.partBorder]}>
            <View style={s.rowBetween}>
              <Text style={s.partLabel}>{partText.label}</Text>
              <Text style={s.partScore}>{Math.round(part.score)}/100</Text>
            </View>
            <View style={{ marginTop: spacing(2) }}>
              <ProgressBar
                value={part.score / 100}
                height={6}
                color={part.score >= 70 ? colors.success : part.score >= 40 ? colors.warn : colors.danger}
              />
            </View>
            <Muted style={{ fontSize: 12, marginTop: spacing(1.5) }}>{partText.hint}</Muted>
          </View>
          );
        })}
      </Card>

      {/* Encouragement */}
      <Card tone="plain" style={{ marginTop: spacing(4) }}>
        <View style={{ flexDirection: 'row', gap: spacing(3) }}>
          <Logo size={30} />
          <Text style={s.quote}>{encouragement}</Text>
        </View>
      </Card>

      {/* Conseils */}
      {advice.length === 0 ? (
        <EmptyState
          emoji="✅"
          title={t.advice.nothingTitle}
          body={t.advice.nothingBody}
        />
      ) : (
        grouped.map((group) => (
          <View key={group.tone}>
            <SectionTitle title={tones[group.tone].label} />
            <CardGrid gap={spacing(3)}>
              {group.items.map((item) => (
                <AdviceCard
                  key={item.id}
                  advice={item}
                  tone={tones[item.tone]}
                  onAction={(route) => router.push(route as never)}
                />
              ))}
            </CardGrid>
          </View>
        ))
      )}

      {/* Répartition suggérée */}
      {allocation.length > 0 ? (
        <>
          <SectionTitle title={t.advice.allocationTitle} />
          <Card>
            <Muted style={{ marginBottom: spacing(3) }}>
              {t.advice.allocationSub(formatEuro(effort))}
            </Muted>
            {allocation.map((slice, i) => (
              <View key={slice.productKey} style={[{ paddingVertical: spacing(3) }, i > 0 && s.partBorder]}>
                <View style={s.rowBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2), flex: 1 }}>
                    <Text style={{ fontSize: 18 }}>{slice.emoji}</Text>
                    <Text style={s.partLabel}>{slice.label}</Text>
                  </View>
                  <Badge tone="primary">{t.advice.perMonthBadge(formatEuro(slice.monthly))}</Badge>
                </View>
                <Muted style={{ fontSize: 12, marginTop: spacing(2) }}>{slice.rationale}</Muted>
              </View>
            ))}
            <Button
              title={t.advice.allocationSimulate}
              variant="secondary"
              icon="trending-up-outline"
              onPress={() => router.push('/simulation')}
              style={{ marginTop: spacing(3) }}
            />
          </Card>
        </>
      ) : null}

      <Card tone="plain" style={{ marginTop: spacing(4) }}>
        <Muted style={{ fontSize: 12 }}>{t.advice.disclaimer}</Muted>
      </Card>
    </Screen>
  );
}

function AdviceCard({
  advice,
  tone,
  onAction,
}: {
  advice: Advice;
  tone: ToneStyle;
  onAction: (route: string) => void;
}) {
  const ui = useUi();
  const s = useThemedStyles(makeStyles);
  return (
    <Card style={{ borderLeftWidth: 4, borderLeftColor: tone.fg }}>
      <View style={s.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2.5), flex: 1 }}>
          <View style={[s.adviceIcon, { backgroundColor: tone.bg }]}>
            <Text style={{ fontSize: 16 }}>{advice.emoji}</Text>
          </View>
          <Text style={[ui.h3, { flex: 1 }]}>{advice.title}</Text>
        </View>
      </View>

      {advice.metric ? (
        <Text style={[s.metric, { color: tone.fg }]}>{advice.metric}</Text>
      ) : null}

      <Muted style={{ marginTop: spacing(2), lineHeight: 20 }}>{advice.body}</Muted>

      {advice.action ? (
        <Button
          title={advice.action.label}
          variant="secondary"
          onPress={() => onAction(advice.action!.route)}
          style={{ marginTop: spacing(3) }}
        />
      ) : null}
    </Card>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    scoreTitle: { ...font.tiny, color: 'rgba(255,255,255,0.75)' },
    scoreLabel: { ...font.h2, color: '#FFFFFF', marginTop: 2 },
    scoreHint: { ...font.small, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: spacing(1.5), lineHeight: 17 },

    partBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    partLabel: { ...font.body, color: colors.ink, fontWeight: '600' },
    partScore: { ...font.small, color: colors.muted, fontVariant: ['tabular-nums'] },

    quote: { ...font.body, color: colors.inkSoft, lineHeight: 22, flex: 1 },

    adviceIcon: {
      width: 34,
      height: 34,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metric: { ...font.h2, marginTop: spacing(3) },
  });
