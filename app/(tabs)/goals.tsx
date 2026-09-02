import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '../../src/components/charts';
import { Split } from '../../src/components/layout';
import { confirm } from '../../src/components/dialogs';
import { AmountField, Field, Slider, Stepper, TextField } from '../../src/components/inputs';
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
import { monthsToTarget } from '../../src/core/budget';
import { useT } from '../../src/i18n';
import { formatEuro, formatPercent } from '../../src/core/money';
import { useAppState, useMonthlyEffort, useSummary } from '../../src/store/hooks';
import { useBudgetStore } from '../../src/store/useBudgetStore';
import { font, radius, spacing, useTheme, useThemedStyles, type Colors } from '../../src/theme';

const PROJECT_EMOJIS = ['🎯', '🗾', '🏠', '🚗', '💍', '🎓', '🛋️', '🏖️', '💻', '🚲'];

export default function GoalsScreen() {
  const ui = useUi();
  const t = useT();
  const s = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const state = useAppState();
  const summary = useSummary();
  const effort = useMonthlyEffort();
  const setGoals = useBudgetStore((s) => s.setGoals);
  const addProject = useBudgetStore((s) => s.addProject);
  const removeProject = useBudgetStore((s) => s.removeProject);
  const contributeToProject = useBudgetStore((s) => s.contributeToProject);

  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState(0);
  const [newEmoji, setNewEmoji] = useState(PROJECT_EMOJIS[0]);

  const { goals } = state;
  const burn = summary.fixedExpenses + summary.variableExpenses;
  const emergencyTarget = burn * goals.emergencyMonths;
  const emergencyProgress = emergencyTarget > 0 ? goals.currentSavings / emergencyTarget : 0;
  const goalRatio = goals.monthlySavingTarget > 0 ? effort / goals.monthlySavingTarget : 0;

  const suggestions = [0.05, 0.1, 0.15, 0.2]
    .map((r) => Math.round((summary.income * r) / 10) * 10)
    .filter((v) => v > 0);

  const createProject = () => {
    if (!newLabel.trim() || newTarget <= 0) return;
    addProject({ label: newLabel.trim(), target: newTarget, emoji: newEmoji });
    setNewLabel('');
    setNewTarget(0);
    setCreating(false);
  };

  return (
    <Screen>
      <ScreenTitle
        title={t.goals.title}
        subtitle={t.goals.subtitle}
      />

      {/* Réglages à gauche, projets à droite dès que la largeur le permet. */}
      <Split
        left={
          <>
          {/* Objectif d'épargne mensuelle */}
          <SectionTitle title={t.goals.monthlyTargetTitle} />
          <Card>
            <AmountField
              value={goals.monthlySavingTarget}
              onChange={(v) => setGoals({ monthlySavingTarget: v })}
              size="small"
            />
            {suggestions.length > 0 ? (
              <View style={s.chipRow}>
                {suggestions.map((v, i) => (
                  <Chip
                    key={v}
                    label={`${formatEuro(v)} · ${[5, 10, 15, 20][i]} %`}
                    active={goals.monthlySavingTarget === v}
                    onPress={() => setGoals({ monthlySavingTarget: v })}
                  />
                ))}
              </View>
            ) : null}
    
            {goals.monthlySavingTarget > 0 ? (
              <View style={{ marginTop: spacing(4) }}>
                <View style={s.rowBetween}>
                  <Muted>{t.goals.budgetYields(formatEuro(effort))}</Muted>
                  <Badge tone={goalRatio >= 1 ? 'success' : goalRatio >= 0.8 ? 'warn' : 'danger'}>
                    {formatPercent(goalRatio)}
                  </Badge>
                </View>
                <View style={{ marginTop: spacing(2) }}>
                  <ProgressBar value={goalRatio} color={goalRatio >= 1 ? colors.success : colors.primary} />
                </View>
                <Muted style={{ marginTop: spacing(2) }}>
                  {goalRatio >= 1
                    ? t.goals.targetMet(
                        formatEuro(effort - goals.monthlySavingTarget),
                        formatEuro(effort * 12),
                      )
                    : t.goals.targetMissing(
                        formatEuro(goals.monthlySavingTarget - effort),
                        formatEuro(goals.monthlySavingTarget * 12),
                      )}
                </Muted>
              </View>
            ) : null}
          </Card>
    
          {/* Plafond de dépenses variables */}
          <SectionTitle title={t.goals.spendingCapTitle} />
          <Card>
            <Muted>{t.goals.spendingCapBody(formatEuro(summary.variableExpenses))}</Muted>
            <View style={{ marginTop: spacing(3) }}>
              <Slider
                value={goals.monthlySpendingCap}
                min={0}
                max={Math.max(1500, Math.ceil(summary.income / 100) * 100)}
                step={25}
                onChange={(v) => setGoals({ monthlySpendingCap: v })}
              />
              <View style={s.rowBetween}>
                <Text style={s.capValue}>{formatEuro(goals.monthlySpendingCap)}</Text>
                {goals.monthlySpendingCap > 0 ? (
                  <Badge tone={summary.variableExpenses <= goals.monthlySpendingCap ? 'success' : 'danger'}>
                    {summary.variableExpenses <= goals.monthlySpendingCap
                      ? t.goals.underCap(
                          formatEuro(goals.monthlySpendingCap - summary.variableExpenses),
                        )
                      : t.goals.overCap(
                          formatEuro(summary.variableExpenses - goals.monthlySpendingCap),
                        )}
                  </Badge>
                ) : (
                  <Muted>{t.goals.noCap}</Muted>
                )}
              </View>
            </View>
          </Card>
    
          {/* Épargne de précaution */}
          <SectionTitle title={t.goals.emergencyTitle} />
          <Card>
            <Field label={t.goals.alreadySaved}>
              <AmountField
                value={goals.currentSavings}
                onChange={(v) => setGoals({ currentSavings: v })}
                size="small"
              />
            </Field>
            <Field label={t.goals.monthsToCover} hint={t.goals.monthsHint}>
              <Stepper
                value={goals.emergencyMonths}
                onChange={(v) => setGoals({ emergencyMonths: v })}
                min={1}
                max={24}
                format={(v) => t.common.months(v)}
              />
            </Field>
    
            {emergencyTarget > 0 ? (
              <>
                <View style={s.rowBetween}>
                  <Text style={ui.h3}>{formatEuro(goals.currentSavings)}</Text>
                  <Muted>{t.goals.outOf(formatEuro(emergencyTarget))}</Muted>
                </View>
                <View style={{ marginTop: spacing(2) }}>
                  <ProgressBar
                    value={emergencyProgress}
                    color={emergencyProgress >= 1 ? colors.success : colors.accent}
                    height={12}
                  />
                </View>
                <Muted style={{ marginTop: spacing(2) }}>
                  {emergencyProgress >= 1
                    ? t.goals.emergencyComplete
                    : (() => {
                        const m = monthsToTarget(emergencyTarget, goals.currentSavings, effort);
                        return m === null ? t.goals.emergencyNoCapacity : t.goals.emergencyIn(m);
                      })()}
                </Muted>
              </>
            ) : null}
          </Card>
          </>
        }
        right={
          <>
          {/* Projets */}
          <SectionTitle
            title={t.goals.projectsTitle}
            action={creating ? t.common.cancel : t.goals.newProject}
            onAction={() => setCreating((v) => !v)}
          />
    
          {creating ? (
            <Card style={{ marginBottom: spacing(3) }}>
              <Field label={t.goals.projectName}>
                <TextField value={newLabel} onChangeText={setNewLabel} placeholder={t.goals.projectNamePlaceholder} autoFocus />
              </Field>
              <Field label={t.goals.projectTarget}>
                <AmountField value={newTarget} onChange={setNewTarget} size="small" />
              </Field>
              <Field label={t.goals.projectIcon}>
                <View style={s.chipRow}>
                  {PROJECT_EMOJIS.map((e) => (
                    <Pressable
                      key={e}
                      onPress={() => setNewEmoji(e)}
                      style={[s.emojiChip, newEmoji === e && s.emojiChipActive]}
                    >
                      <Text style={{ fontSize: 20 }}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>
              <Button title={t.goals.createProject} onPress={createProject} disabled={!newLabel.trim() || newTarget <= 0} />
            </Card>
          ) : null}
    
          {state.projects.length === 0 && !creating ? (
            <Card tone="plain">
              <Muted>{t.goals.projectsEmpty}</Muted>
            </Card>
          ) : null}
    
          <View style={{ gap: spacing(3) }}>
            {state.projects.map((project) => {
              const ratio = project.target > 0 ? project.saved / project.target : 0;
              const months = monthsToTarget(project.target, project.saved, effort);
              return (
                <Card key={project.id}>
                  <View style={s.rowBetween}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(3), flex: 1 }}>
                      <Text style={{ fontSize: 24 }}>{project.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={ui.h3}>{project.label}</Text>
                        <Muted style={{ fontSize: 12 }}>
                          {t.goals.savedOf(formatEuro(project.saved), formatEuro(project.target))}
                        </Muted>
                      </View>
                    </View>
                    <Pressable
                      hitSlop={10}
                      onPress={async () => {
                        const accepted = await confirm({
                          title: t.goals.deleteProjectTitle,
                          message: project.label,
                          confirmLabel: t.common.delete,
                          cancelLabel: t.common.cancel,
                          destructive: true,
                        });
                        if (accepted) removeProject(project.id);
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
                    </Pressable>
                  </View>
    
                  <View style={{ marginTop: spacing(3) }}>
                    <ProgressBar value={ratio} color={ratio >= 1 ? colors.success : colors.primary} height={10} />
                  </View>
    
                  <View style={[s.rowBetween, { marginTop: spacing(2.5) }]}>
                    <Muted>
                      {ratio >= 1
                        ? t.goals.projectReached
                        : months === null
                          ? t.goals.rhythmToDefine
                          : t.goals.aboutMonths(months)}
                    </Muted>
                    <Badge tone={ratio >= 1 ? 'success' : 'primary'}>{formatPercent(Math.min(ratio, 1))}</Badge>
                  </View>
    
                  <View style={s.contribRow}>
                    {[50, 100, 250].map((amount) => (
                      <Chip
                        key={amount}
                        label={`+ ${amount} €`}
                        onPress={() => contributeToProject(project.id, amount)}
                      />
                    ))}
                    <Chip label="− 50 €" onPress={() => contributeToProject(project.id, -50)} />
                  </View>
                </Card>
              );
            })}
          </View>
          </>
        }
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2), marginTop: spacing(3) },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    capValue: { ...font.h2, color: colors.ink },
    emojiChip: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    emojiChipActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    contribRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2), marginTop: spacing(3) },
  });
