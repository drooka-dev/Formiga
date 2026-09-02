import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { formatCompact } from '../core/money';
import { font, radius, spacing, useTheme, useThemedStyles, type Colors } from '../theme';

/* ------------------------------------------------------------------ */
/* Barre de progression                                                */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  color,
  track,
  height = 10,
  /** Repère optionnel (ex. objectif) placé en fraction de la largeur. */
  marker,
}: {
  value: number;
  color?: string;
  track?: string;
  height?: number;
  marker?: number;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      style={[
        styles.progressTrack,
        { height, backgroundColor: track ?? colors.surfaceAlt, borderRadius: height },
      ]}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          backgroundColor: color ?? colors.primary,
          borderRadius: height,
        }}
      />
      {marker !== undefined ? (
        <View
          style={[
            styles.marker,
            { left: `${Math.min(100, marker * 100)}%`, height: height + 6, top: -3 },
          ]}
        />
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Anneau de score                                                     */
/* ------------------------------------------------------------------ */

export function ScoreRing({
  score,
  size = 132,
  stroke = 12,
  label,
  color = '#FFFFFF',
  trackColor = 'rgba(255,255,255,0.22)',
  textColor = '#FFFFFF',
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
  trackColor?: string;
  textColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * pct} ${c}`}
            fill="none"
          />
        </G>
      </Svg>
      <Text style={{ fontSize: size * 0.28, fontWeight: '700', color: textColor }}>
        {Math.round(score)}
      </Text>
      {label ? (
        <Text style={{ fontSize: 12, fontWeight: '600', color: textColor, opacity: 0.8 }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Donut de répartition                                                */
/* ------------------------------------------------------------------ */

export interface Slice {
  key: string;
  label: string;
  value: number;
  color: string;
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number, width: number) {
  const inner = r - width;
  const p = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });
  const a1 = p(startAngle, r);
  const a2 = p(endAngle, r);
  const b1 = p(endAngle, inner);
  const b2 = p(startAngle, inner);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${a1.x} ${a1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${a2.x} ${a2.y}`,
    `L ${b1.x} ${b1.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${b2.x} ${b2.y}`,
    'Z',
  ].join(' ');
}

export function DonutChart({
  slices,
  size = 168,
  thickness = 26,
  centerTop,
  centerBottom,
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerBottom?: string;
}) {
  const { colors } = useTheme();
  const total = slices.reduce((s, x) => s + x.value, 0);
  const paths = useMemo(() => {
    if (total <= 0) return [];
    const gap = 0.02;
    let angle = -Math.PI / 2;
    return slices.map((slice) => {
      const sweep = (slice.value / total) * Math.PI * 2;
      const start = angle + gap / 2;
      const end = angle + sweep - gap / 2;
      angle += sweep;
      return {
        key: slice.key,
        color: slice.color,
        d: arcPath(size / 2, size / 2, size / 2, Math.max(start, -Math.PI / 2), Math.max(end, start + 0.01), thickness),
      };
    });
  }, [slices, total, size, thickness]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {total <= 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - thickness / 2}
            stroke={colors.surfaceAlt}
            strokeWidth={thickness}
            fill="none"
          />
        ) : (
          paths.map((p) => <Path key={p.key} d={p.d} fill={p.color} />)
        )}
      </Svg>
      {centerTop ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...font.h2, color: colors.ink }}>{centerTop}</Text>
          {centerBottom ? (
            <Text style={{ ...font.small, color: colors.muted }}>{centerBottom}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function Legend({ slices, total }: { slices: Slice[]; total: number }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={{ flex: 1, gap: spacing(2) }}>
      {slices.map((s) => (
        <View key={s.key} style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: s.color }]} />
          <Text style={styles.legendLabel} numberOfLines={1}>
            {s.label}
          </Text>
          <Text style={styles.legendValue}>
            {total > 0 ? `${Math.round((s.value / total) * 100)} %` : '—'}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Barre empilée revenus / charges                                     */
/* ------------------------------------------------------------------ */

export function StackedBar({ segments, height = 14 }: { segments: Slice[]; height?: number }) {
  const styles = useThemedStyles(makeStyles);
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total <= 0) {
    return <View style={[styles.progressTrack, { height, borderRadius: height }]} />;
  }
  return (
    <View style={[styles.stack, { height, borderRadius: height }]}>
      {segments.map((s) => (
        <View key={s.key} style={{ flex: s.value / total, backgroundColor: s.color }} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Courbes (projection / simulation)                                   */
/* ------------------------------------------------------------------ */

export interface Series {
  key: string;
  color: string;
  points: number[];
  /** Aire dégradée sous la courbe. */
  fill?: boolean;
  dashed?: boolean;
}

export function LineChart({
  series,
  xLabels,
  width,
  height = 190,
  yTicks = 4,
}: {
  series: Series[];
  xLabels: string[];
  width: number;
  height?: number;
  yTicks?: number;
}) {
  const { colors } = useTheme();
  const padLeft = 46;
  const padRight = 10;
  const padTop = 12;
  const padBottom = 24;
  const innerW = Math.max(10, width - padLeft - padRight);
  const innerH = Math.max(10, height - padTop - padBottom);

  const all = series.flatMap((s) => s.points);
  const max = Math.max(1, ...all);
  const min = Math.min(0, ...all);
  const count = Math.max(...series.map((s) => s.points.length), 1);

  const x = (i: number) => padLeft + (count <= 1 ? innerW / 2 : (i / (count - 1)) * innerW);
  const y = (v: number) => padTop + innerH - ((v - min) / (max - min || 1)) * innerH;

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + ((max - min) / yTicks) * i);

  return (
    <Svg width={width} height={height}>
      <Defs>
        {series.map((s) => (
          <LinearGradient key={`g-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={s.color} stopOpacity="0.28" />
            <Stop offset="1" stopColor={s.color} stopOpacity="0.02" />
          </LinearGradient>
        ))}
      </Defs>

      {ticks.map((t, i) => (
        <G key={`t-${i}`}>
          <Line x1={padLeft} y1={y(t)} x2={width - padRight} y2={y(t)} stroke={colors.border} strokeWidth={1} />
          <SvgText x={padLeft - 8} y={y(t) + 4} fontSize={10} fill={colors.muted} textAnchor="end">
            {formatCompact(t)}
          </SvgText>
        </G>
      ))}

      {series.map((s) => {
        if (s.points.length === 0) return null;
        const line = s.points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
        const area = `${line} L ${x(s.points.length - 1)} ${y(min)} L ${x(0)} ${y(min)} Z`;
        return (
          <G key={s.key}>
            {s.fill ? <Path d={area} fill={`url(#grad-${s.key})`} /> : null}
            <Path
              d={line}
              stroke={s.color}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? '5 5' : undefined}
            />
          </G>
        );
      })}

      {xLabels.map((label, i) => {
        const step = Math.max(1, Math.ceil(xLabels.length / 6));
        if (i % step !== 0 && i !== xLabels.length - 1) return null;
        return (
          <SvgText
            key={`x-${i}`}
            x={x(i)}
            y={height - 6}
            fontSize={10}
            fill={colors.muted}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Barres comparatives horizontales                                    */
/* ------------------------------------------------------------------ */

export function CompareBars({
  rows,
  width,
  barHeight = 34,
}: {
  rows: { key: string; label: string; deposited: number; gains: number; color: string }[];
  width: number;
  barHeight?: number;
}) {
  const max = Math.max(1, ...rows.map((r) => r.deposited + r.gains));
  const gap = 12;
  const height = rows.length * (barHeight + gap);

  return (
    <Svg width={width} height={height}>
      {rows.map((row, i) => {
        const y = i * (barHeight + gap);
        const totalW = ((row.deposited + row.gains) / max) * width;
        const depositW = ((row.deposited / max) * width) || 0;
        return (
          <G key={row.key}>
            <Rect x={0} y={y} width={Math.max(totalW, 2)} height={barHeight} rx={8} fill={row.color} opacity={0.25} />
            <Rect x={0} y={y} width={Math.max(depositW, 2)} height={barHeight} rx={8} fill={row.color} />
          </G>
        );
      })}
    </Svg>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
  progressTrack: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    overflow: 'visible',
    justifyContent: 'center',
  },
  marker: {
    position: 'absolute',
    width: 2,
    backgroundColor: colors.ink,
    borderRadius: 2,
    opacity: 0.55,
  },
  stack: { width: '100%', flexDirection: 'row', overflow: 'hidden' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  legendDot: { width: 10, height: 10, borderRadius: radius.pill },
  legendLabel: { ...font.small, color: colors.inkSoft, flex: 1 },
  legendValue: { ...font.small, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
});
