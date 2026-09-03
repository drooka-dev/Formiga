import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { font, radius, shadow, spacing, useLayout, useTheme, useThemedStyles, type Colors } from '../theme';

export function Screen({
  children,
  scroll = true,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const styles = useUi();
  const insets = useSafeAreaInsets();
  const { frameWidth } = useLayout();
  const padding = {
    paddingTop: insets.top + spacing(2),
    // De quoi passer sous la barre d'onglets, qui grandit elle aussi de la
    // hauteur réservée au système : sans ce terme, le dernier bloc de la page
    // finit caché derrière la navigation d'Android.
    paddingBottom: spacing(24) + insets.bottom,
    maxWidth: frameWidth,
  };

  if (!scroll) {
    return <View style={[styles.screen, padding, contentStyle]}>{children}</View>;
  }
  return (
    <ScrollView
      style={styles.screenScroll}
      contentContainerStyle={[styles.screenContent, padding, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const styles = useUi();
  return (
    <View style={{ marginBottom: spacing(4) }}>
      <Text style={styles.h1}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
  tone = 'surface',
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'primary' | 'plain';
  onPress?: () => void;
}) {
  const styles = useUi();
  const toneStyle =
    tone === 'primary' ? styles.cardPrimary : tone === 'plain' ? styles.cardPlain : styles.card;
  const content = <View style={[toneStyle, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
      {content}
    </Pressable>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const styles = useUi();
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.h3}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const styles = useUi();
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const styles = useUi();
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warn' | 'danger' | 'primary';
}) {
  const styles = useUi();
  const { colors } = useTheme();
  const map = {
    neutral: { bg: colors.surfaceAlt, fg: colors.inkSoft },
    success: { bg: colors.successSoft, fg: colors.successInk },
    warn: { bg: colors.warnSoft, fg: colors.warnInk },
    danger: { bg: colors.dangerSoft, fg: colors.dangerInk },
    primary: { bg: colors.primarySoft, fg: colors.primaryInk },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: map.bg }]}>
      <Text style={[styles.badgeText, { color: map.fg }]}>{children}</Text>
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useUi();
  const { colors } = useTheme();
  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.surface, fg: colors.ink, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    danger: { bg: colors.dangerSoft, fg: colors.dangerInk, border: 'transparent' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={palette.fg} /> : null}
      <Text style={[styles.buttonText, { color: palette.fg }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  tone = 'neutral',
  size = 20,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  tone?: 'neutral' | 'danger' | 'primary';
  size?: number;
}) {
  const styles = useUi();
  const { colors } = useTheme();
  const fg =
    tone === 'danger' ? colors.danger : tone === 'primary' ? colors.primary : colors.inkSoft;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
    >
      <Ionicons name={icon} size={size} color={fg} />
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  const styles = useUi();
  return (
    <View style={styles.segmented}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  emoji,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  emoji?: string;
}) {
  const styles = useUi();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.7 }]}
    >
      {emoji ? <Text style={{ fontSize: 14 }}>{emoji}</Text> : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function KeyValue({
  label,
  value,
  valueColor,
  hint,
}: {
  label: string;
  value: string;
  valueColor?: string;
  hint?: string;
}) {
  const styles = useUi();
  return (
    <View style={styles.keyValue}>
      <View style={{ flex: 1, paddingRight: spacing(3) }}>
        <Text style={styles.kvLabel}>{label}</Text>
        {hint ? <Text style={styles.kvHint}>{hint}</Text> : null}
      </View>
      <Text style={[styles.kvValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

export function Divider() {
  const styles = useUi();
  return <View style={styles.divider} />;
}

export function EmptyState({
  emoji,
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  emoji?: string;
  /** Illustration affichée à la place de l'emoji. */
  icon?: ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const styles = useUi();
  return (
    <View style={styles.empty}>
      {icon ?? <Text style={{ fontSize: 40 }}>{emoji}</Text>}
      <Text style={[styles.h3, { marginTop: spacing(3), textAlign: 'center' }]}>{title}</Text>
      <Text style={[styles.muted, { textAlign: 'center', marginTop: spacing(1.5) }]}>{body}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: spacing(4) }} />
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: spacing(5),
      width: '100%',
      alignSelf: 'center',
    },
    screenScroll: { flex: 1, backgroundColor: colors.bg },
    screenContent: {
      paddingHorizontal: spacing(5),
      width: '100%',
      alignSelf: 'center',
    },

    h1: { ...font.h1, color: colors.ink },
    h2: { ...font.h2, color: colors.ink },
    h3: { ...font.h3, color: colors.ink },
    subtitle: { ...font.body, color: colors.muted, marginTop: spacing(1) },
    muted: { ...font.small, color: colors.muted, lineHeight: 19 },
    label: { ...font.tiny, color: colors.muted, textTransform: 'uppercase' },
    link: { ...font.bodyStrong, color: colors.primary, fontSize: 14 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing(4),
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    cardPrimary: {
      backgroundColor: colors.heroBg,
      borderRadius: radius.xl,
      padding: spacing(5),
    },
    cardPlain: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.lg,
      padding: spacing(4),
    },

    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing(6),
      marginBottom: spacing(3),
    },

    badge: {
      paddingHorizontal: spacing(2.5),
      paddingVertical: spacing(1),
      borderRadius: radius.pill,
      alignSelf: 'flex-start',
    },
    badgeText: { ...font.tiny, fontSize: 11 },

    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(2),
      paddingVertical: spacing(3.5),
      paddingHorizontal: spacing(5),
      borderRadius: radius.md,
      borderWidth: 1,
    },
    buttonText: { ...font.bodyStrong },

    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.pill,
    },

    segmented: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      padding: 3,
      gap: 3,
    },
    segment: {
      flex: 1,
      paddingVertical: spacing(2.5),
      borderRadius: radius.sm + 2,
      alignItems: 'center',
    },
    segmentActive: { backgroundColor: colors.surface, ...shadow.card },
    segmentText: { ...font.bodyStrong, fontSize: 14, color: colors.muted },
    segmentTextActive: { color: colors.ink },

    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(1.5),
      paddingHorizontal: spacing(3.5),
      paddingVertical: spacing(2.5),
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
    chipText: { ...font.small, fontWeight: '600', color: colors.inkSoft },
    chipTextActive: { color: colors.primaryInk },

    keyValue: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing(2.5),
    },
    kvLabel: { ...font.body, color: colors.inkSoft },
    kvHint: { ...font.small, color: colors.muted, marginTop: 2, fontSize: 12 },
    kvValue: { ...font.bodyStrong, color: colors.ink, fontVariant: ['tabular-nums'] },

    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing(1) },

    empty: {
      alignItems: 'center',
      paddingVertical: spacing(10),
      paddingHorizontal: spacing(4),
    },
  });

/** Feuille de style partagée des primitives, adaptée au thème courant. */
export function useUi() {
  return useThemedStyles(makeStyles);
}
