import Svg, { Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { formatEuro } from '../core/money';
import { layoutSankey, linkPath, type SankeyGraph } from '../core/sankey';
import { useT } from '../i18n';
import { useTheme } from '../theme';

/** Largeur approchée d'un texte : react-native-svg ne sait pas la mesurer. */
function textWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.53;
}

function truncate(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function SankeyChart({
  graph,
  width,
  height,
  fontSize = 10,
  maxLabelChars = 20,
  nodeWidth = 9,
  nodePadding = 12,
  /** Masque le libellé des nœuds trop fins pour rester lisibles. */
  minLabelHeight = 0,
}: {
  graph: SankeyGraph;
  width: number;
  height: number;
  fontSize?: number;
  maxLabelChars?: number;
  nodeWidth?: number;
  nodePadding?: number;
  minLabelHeight?: number;
}) {
  const { colors } = useTheme();
  const t = useT();
  const { nodes, links } = layoutSankey(graph, { width, height, nodeWidth, nodePadding });
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const pillHeight = fontSize + 7;

  const labels = nodes
    .filter((node) => node.y1 - node.y0 >= minLabelHeight)
    .map((node) => {
      const text = `${truncate(node.label, maxLabelChars)}${t.common.labelSeparator}${formatEuro(
        node.value,
      )}`;
      const w = textWidth(text, fontSize);
      // Les libellés se lisent à gauche de leur barre, sauf ceux de la première
      // colonne qui n'ont rien à leur gauche.
      const anchorStart = node.depth === 0 && maxDepth > 0;
      const anchorX = anchorStart ? node.x1 + 6 : node.x0 - 6;
      const x = Math.max(0, Math.min(anchorStart ? anchorX - 4 : anchorX - w - 4, width - w - 8));
      // Les nœuds les plus fins tombent au ras du cadre : sans ce recentrage,
      // leur libellé serait coupé en haut ou en bas du graphique.
      const centerY = Math.min(
        Math.max((node.y0 + node.y1) / 2, pillHeight / 2),
        height - pillHeight / 2,
      );
      return { id: node.id, depth: node.depth, text, width: w, x, centerY };
    })
    .sort((a, b) => a.depth - b.depth || a.centerY - b.centerY);

  // Deux libellés peuvent se recouvrir : deux postes voisins trop fins dans une
  // même colonne, ou — cas le plus fréquent — un revenu unique dont la barre
  // couvre toute la hauteur, comme celle du budget qu'elle alimente : les deux
  // libellés se centrent alors exactement à la même ordonnée. On décale vers le
  // bas le second venu, ce qui suffit puisqu'ils restent collés à leur barre.
  const overlaps = (a: (typeof labels)[number], b: (typeof labels)[number]) =>
    a.x < b.x + b.width + 8 &&
    b.x < a.x + a.width + 8 &&
    Math.abs(a.centerY - b.centerY) < pillHeight + 2;

  for (let i = 1; i < labels.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (!overlaps(labels[j], labels[i])) continue;
      labels[i].centerY = Math.min(
        labels[j].centerY + pillHeight + 2,
        height - pillHeight / 2,
      );
    }
  }

  return (
    <Svg width={width} height={height}>
      <Defs>
        {links.map((link) => (
          <LinearGradient
            key={`grad-${link.id}`}
            id={`flow-${link.id}`}
            x1={link.source.x1}
            y1="0"
            x2={link.target.x0}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={link.source.color} stopOpacity="0.45" />
            <Stop offset="1" stopColor={link.target.color} stopOpacity="0.45" />
          </LinearGradient>
        ))}
      </Defs>

      {links.map((link) => (
        <Path key={link.id} d={linkPath(link)} fill={`url(#flow-${link.id})`} />
      ))}

      {nodes.map((node) => (
        <Rect
          key={node.id}
          x={node.x0}
          y={node.y0}
          width={node.x1 - node.x0}
          height={node.y1 - node.y0}
          rx={Math.min(3, (node.x1 - node.x0) / 2)}
          fill={node.color}
        />
      ))}

      {labels.map((label) => (
        <Rect
          key={`pill-${label.id}`}
          x={label.x}
          y={label.centerY - pillHeight / 2}
          width={label.width + 8}
          height={pillHeight}
          rx={5}
          fill={colors.surface}
          opacity={0.88}
        />
      ))}

      {labels.map((label) => (
        <SvgText
          key={`label-${label.id}`}
          x={label.x + 4}
          y={label.centerY + fontSize * 0.35}
          fontSize={fontSize}
          fontWeight="600"
          fill={colors.ink}
          textAnchor="start"
        >
          {label.text}
        </SvgText>
      ))}
    </Svg>
  );
}
