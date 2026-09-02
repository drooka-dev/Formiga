import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { clamp, parseAmount } from '../core/money';
import { font, radius, spacing, useTheme, useThemedStyles, type Colors } from '../theme';

export function Field({
  label,
  hint,
  children,
  style,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[{ marginBottom: spacing(4) }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function TextField({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  onSubmitEditing,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="next"
      style={styles.input}
    />
  );
}

/** Saisie de montant : gros chiffres, pavé numérique, € collé à droite. */
export function AmountField({
  value,
  onChange,
  autoFocus,
  suffix = '€',
  size = 'large',
}: {
  value: number;
  onChange: (v: number) => void;
  autoFocus?: boolean;
  suffix?: string;
  size?: 'large' | 'small';
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const [text, setText] = useState(() => (value ? String(value).replace('.', ',') : ''));

  // La valeur peut être poussée de l'extérieur (raccourci, suggestion) : on
  // resynchronise le texte affiché, sans écraser une saisie en cours.
  useEffect(() => {
    if (parseAmount(text) !== value) setText(value ? String(value).replace('.', ',') : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (raw: string) => {
    setText(raw);
    onChange(parseAmount(raw));
  };

  const big = size === 'large';
  return (
    <View style={[styles.amountWrap, big ? styles.amountWrapBig : styles.amountWrapSmall]}>
      <TextInput
        value={text}
        onChangeText={commit}
        placeholder="0"
        placeholderTextColor={colors.muted}
        keyboardType="decimal-pad"
        autoFocus={autoFocus}
        selectTextOnFocus
        style={[styles.amountInput, big ? styles.amountInputBig : styles.amountInputSmall]}
      />
      <Text style={[styles.amountSuffix, big ? { fontSize: 28 } : { fontSize: 16 }]}>{suffix}</Text>
    </View>
  );
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  format,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const set = (v: number) => onChange(clamp(Math.round(v * 100) / 100, min, max));
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => set(value - step)} style={styles.stepperButton} hitSlop={6}>
        <Ionicons name="remove" size={18} color={colors.inkSoft} />
      </Pressable>
      <Text style={styles.stepperValue}>{format ? format(value) : value}</Text>
      <Pressable onPress={() => set(value + step)} style={styles.stepperButton} hitSlop={6}>
        <Ionicons name="add" size={18} color={colors.inkSoft} />
      </Pressable>
    </View>
  );
}

/** Curseur tactile simple, sans dépendance native supplémentaire. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  color,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const track = color ?? colors.primary;
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);

  const fromX = (x: number) => {
    const w = widthRef.current || 1;
    const ratio = clamp(x / w, 0, 1);
    const raw = min + ratio * (max - min);
    return clamp(Math.round(raw / step) * step, min, max);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => onChange(fromX(e.nativeEvent.locationX)),
      onPanResponderMove: (e) => onChange(fromX(e.nativeEvent.locationX)),
    }),
  ).current;

  const pct = max > min ? clamp((value - min) / (max - min), 0, 1) : 0;

  return (
    <View
      style={styles.sliderHit}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
      {...responder.panHandlers}
    >
      <View style={styles.sliderTrack}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: track, borderRadius: 4 }} />
      </View>
      <View
        pointerEvents="none"
        style={[styles.sliderThumb, { left: Math.max(0, pct * width - 12), borderColor: track }]}
      />
    </View>
  );
}

export function SwitchRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1, paddingRight: spacing(3) }}>
        <Text style={styles.switchLabel}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

/** Sélecteur de jour du mois (1-31), en grille compacte. */
export function DayPicker({
  value,
  onChange,
}: {
  value?: number;
  onChange: (day: number | undefined) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.dayGrid}>
      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
        const active = value === day;
        return (
          <Pressable
            key={day}
            onPress={() => onChange(active ? undefined : day)}
            style={[styles.day, active && styles.dayActive]}
          >
            <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
  fieldLabel: { ...font.tiny, color: colors.muted, textTransform: 'uppercase', marginBottom: spacing(2) },
  hint: { ...font.small, color: colors.muted, marginTop: spacing(1.5), fontSize: 12, lineHeight: 17 },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3.5),
    ...font.body,
    color: colors.ink,
  },

  amountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  amountWrapBig: { paddingVertical: spacing(4), paddingHorizontal: spacing(4) },
  amountWrapSmall: { paddingVertical: spacing(2.5), paddingHorizontal: spacing(3) },
  amountInput: { color: colors.ink, textAlign: 'right', flexShrink: 1, minWidth: 60 },
  amountInputBig: { fontSize: 40, fontWeight: '700', letterSpacing: -1 },
  amountInputSmall: { fontSize: 18, fontWeight: '700' },
  amountSuffix: { color: colors.muted, fontWeight: '600', marginLeft: spacing(1.5) },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing(1.5),
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { ...font.bodyStrong, color: colors.ink, fontVariant: ['tabular-nums'] },

  sliderHit: { height: 40, justifyContent: 'center' },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(3),
  },
  switchLabel: { ...font.body, color: colors.ink },

  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  day: {
    width: 40,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { ...font.small, color: colors.inkSoft, fontVariant: ['tabular-nums'] },
  dayTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
