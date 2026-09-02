import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { confirm, notify } from '../src/components/dialogs';
import { Field, TextField } from '../src/components/inputs';
import { Button, Card, Muted, SectionTitle, Segmented } from '../src/components/ui';
import type { AppState } from '../src/core/types';
import { LANGUAGES, LANGUAGE_NAMES, useT } from '../src/i18n';
import { useAppState } from '../src/store/hooks';
import { useBudgetStore } from '../src/store/useBudgetStore';
import {
  font,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Colors,
} from '../src/theme';

export default function SettingsScreen() {
  const s = useThemedStyles(makeStyles);
  const { colors, scheme } = useTheme();
  const { frameWidth } = useLayout();
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const state = useAppState();
  const setSettings = useBudgetStore((s) => s.setSettings);
  const resetAll = useBudgetStore((s) => s.resetAll);
  const loadSample = useBudgetStore((s) => s.loadSample);

  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const entryCount = state.entries.length;

  const exportData = async () => {
    const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
    try {
      await Share.share({ message: payload, title: t.settings.exportTitle });
    } catch {
      notify(t.settings.exportErrorTitle, t.settings.exportErrorBody);
    }
  };

  const importData = () => {
    try {
      const parsed = JSON.parse(importText) as { data?: AppState } & Partial<AppState>;
      const data = parsed.data ?? (parsed as AppState);
      if (!Array.isArray(data.entries)) throw new Error('format');
      useBudgetStore.setState({
        entries: data.entries,
        projects: data.projects ?? [],
        goals: data.goals ?? state.goals,
        settings: { ...state.settings, ...(data.settings ?? {}), onboarded: true },
      });
      setImportText('');
      setShowImport(false);
      notify(t.settings.importSuccessTitle, t.settings.importSuccessBody(data.entries.length));
    } catch {
      notify(t.settings.importErrorTitle, t.settings.importErrorBody);
    }
  };

  const confirmStartOver = async () => {
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

  const confirmLoadSample = async () => {
    const accepted = await confirm({
      title: t.settings.loadSampleTitle,
      message: t.settings.loadSampleBody,
      confirmLabel: t.settings.load,
      cancelLabel: t.common.cancel,
    });
    if (!accepted) return;
    loadSample(t);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[s.topBar, { paddingTop: insets.top > 0 ? spacing(3) : spacing(5) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.inkSoft} />
        </Pressable>
        <Text style={s.topTitle}>{t.settings.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing(5), paddingBottom: insets.bottom + spacing(10), width: '100%', maxWidth: frameWidth, alignSelf: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <Field label={t.settings.firstName} style={{ marginBottom: 0 }}>
            <TextField
              value={state.settings.firstName}
              onChangeText={(v) => setSettings({ firstName: v })}
              placeholder={t.settings.firstNamePlaceholder}
            />
          </Field>
        </Card>

        <SectionTitle title={t.settings.language} />
        <Card>
          <Segmented
            value={state.settings.language}
            onChange={(language) => setSettings({ language })}
            options={LANGUAGES.map((lang) => ({ key: lang, label: LANGUAGE_NAMES[lang] }))}
          />
          <Muted style={{ marginTop: spacing(3), fontSize: 12, lineHeight: 18 }}>
            {t.settings.languageNote}
          </Muted>
        </Card>

        <SectionTitle title={t.settings.appearance} />
        <Card>
          <Segmented
            value={state.settings.themeMode}
            onChange={(themeMode) => setSettings({ themeMode })}
            options={[
              { key: 'system', label: t.settings.system },
              { key: 'light', label: t.settings.light },
              { key: 'dark', label: t.settings.dark },
            ]}
          />
          <Muted style={{ marginTop: spacing(3), fontSize: 12, lineHeight: 18 }}>
            {state.settings.themeMode === 'system'
              ? t.settings.appearanceSystemNote(
                  scheme === 'dark' ? t.settings.schemeDark : t.settings.schemeLight,
                )
              : t.settings.appearanceFixedNote}
          </Muted>
        </Card>

        <SectionTitle title={t.settings.myData} />
        <Card>
          <View style={s.row}>
            <Muted>{t.settings.budgetLines}</Muted>
            <Text style={s.value}>{entryCount}</Text>
          </View>
          <View style={s.sep} />
          <View style={s.row}>
            <Muted>{t.settings.savingsProjects}</Muted>
            <Text style={s.value}>{state.projects.length}</Text>
          </View>
          <View style={s.sep} />
          <Muted style={{ fontSize: 12, lineHeight: 18 }}>{t.settings.dataNote}</Muted>
        </Card>

        <SectionTitle title={t.settings.backup} />
        <View style={{ gap: spacing(3) }}>
          <Button title={t.settings.exportData} icon="share-outline" variant="secondary" onPress={exportData} />
          <Button
            title={showImport ? t.settings.cancelImport : t.settings.importData}
            icon="download-outline"
            variant="secondary"
            onPress={() => setShowImport((v) => !v)}
          />
          {showImport ? (
            <Card>
              <Field label={t.settings.pasteHere} hint={t.settings.pasteHint}>
                <TextField
                  value={importText}
                  onChangeText={setImportText}
                  placeholder='{"version":1,...}'
                />
              </Field>
              <Button title={t.settings.restore} onPress={importData} disabled={importText.trim().length === 0} />
            </Card>
          ) : null}
        </View>

        <SectionTitle title={t.settings.dangerZone} />
        <View style={{ gap: spacing(3) }}>
          <Button
            title={t.settings.loadSample}
            icon="sparkles-outline"
            variant="secondary"
            onPress={confirmLoadSample}
          />
          <Button
            title={t.settings.startOver}
            icon="refresh-outline"
            variant="danger"
            onPress={confirmStartOver}
          />
        </View>

        <Text style={s.footer}>{t.settings.footer}</Text>
      </ScrollView>
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
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing(1) },
    value: { ...font.bodyStrong, color: colors.ink },
    sep: { height: 1, backgroundColor: colors.border, marginVertical: spacing(2.5) },
    footer: { ...font.small, color: colors.muted, textAlign: 'center', marginTop: spacing(10) },
  });
