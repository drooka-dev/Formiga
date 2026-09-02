/**
 * Construction et mise en page d'un diagramme de flux (Sankey) du budget.
 *
 * Le graphe est un arbre joint en son centre sur le nœud « Budget » :
 *   revenus → Budget → postes de dépense → lignes de détail
 * Cette structure garantit une mise en page sans croisement de rubans, ce qui
 * évite d'avoir à implémenter l'optimisation itérative d'un vrai Sankey.
 */

import { computeSummary, monthlyAmount } from './budget';
import type { AppState, Category } from './types';

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
  depth: number;
  color: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

/** Couleurs des nœuds qui n'appartiennent à aucune catégorie de budget. */
export interface CashflowPalette {
  budget: string;
  deficit: string;
  unallocated: string;
  /** Ajuste une couleur de catégorie au thème courant. */
  tintCategory: (hex: string) => string;
  /** Libellés des nœuds qui ne sont pas des catégories de budget. */
  budgetLabel: string;
  deficitLabel: string;
  unallocatedLabel: string;
  /** Libellé d'une catégorie dans la langue active. */
  categoryLabel: (key: Category) => string;
}

export interface SankeyGraph {
  nodes: SankeyNode[];
  links: SankeyLink[];
  /** Somme des entrées, qui est aussi la somme des sorties. */
  total: number;
  /** Montant non affecté restant en fin de mois (0 si le budget est déficitaire). */
  unallocated: number;
  /** Montant manquant, couvert par l'épargne (0 si le budget est à l'équilibre). */
  deficit: number;
}

/**
 * @param detailed ajoute une quatrième colonne détaillant chaque ligne de budget
 *                 à l'intérieur de son poste.
 * @param palette  couleurs à donner aux nœuds hors catégorie, fournies par le
 *                 thème courant.
 */
export function buildCashflowGraph(
  state: AppState,
  detailed: boolean,
  palette: CashflowPalette,
  now = new Date(),
): SankeyGraph {
  const summary = computeSummary(state, now);
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  // — Colonne 0 : d'où vient l'argent ————————————————————————————
  for (const cat of summary.incomeByCategory) {
    if (cat.monthly <= 0) continue;
    nodes.push({
      id: `in:${cat.key}`,
      label: palette.categoryLabel(cat.key),
      value: cat.monthly,
      depth: 0,
      color: palette.tintCategory(cat.meta.color),
    });
    links.push({ source: `in:${cat.key}`, target: 'budget', value: cat.monthly });
  }

  const deficit = Math.max(0, summary.totalExpenses - summary.income);
  if (deficit > 0) {
    nodes.push({
      id: 'deficit',
      label: palette.deficitLabel,
      value: deficit,
      depth: 0,
      color: palette.deficit,
    });
    links.push({ source: 'deficit', target: 'budget', value: deficit });
  }

  const total = summary.income + deficit;
  if (total <= 0) return { nodes: [], links: [], total: 0, unallocated: 0, deficit: 0 };

  // — Colonne 1 : le budget ————————————————————————————————————
  nodes.push({
    id: 'budget',
    label: palette.budgetLabel,
    value: total,
    depth: 1,
    color: palette.budget,
  });

  // — Colonne 2 : les postes ————————————————————————————————————
  // L'épargne et le reste non affecté sont placés en tête : ce qu'on garde
  // se lit en haut du diagramme, ce qu'on dépense en dessous.
  const unallocated = Math.max(0, summary.income - summary.totalExpenses);
  const categories = [...summary.expenseByCategory].filter((c) => c.monthly > 0);
  const savingsIndex = categories.findIndex((c) => c.key === 'savings');
  const ordered =
    savingsIndex >= 0
      ? [categories[savingsIndex], ...categories.filter((_, i) => i !== savingsIndex)]
      : categories;

  const emitCategory = (
    id: string,
    label: string,
    value: number,
    color: string,
    leaves: { id: string; label: string; value: number }[],
  ) => {
    nodes.push({ id, label, value, depth: 2, color });
    links.push({ source: 'budget', target: id, value });
    if (!detailed) return;
    for (const leaf of leaves) {
      if (leaf.value <= 0) continue;
      nodes.push({ id: leaf.id, label: leaf.label, value: leaf.value, depth: 3, color });
      links.push({ source: id, target: leaf.id, value: leaf.value });
    }
  };

  let restEmitted = false;
  const emitRest = () => {
    if (restEmitted || unallocated <= 0) return;
    restEmitted = true;
    nodes.push({
      id: 'rest',
      label: palette.unallocatedLabel,
      value: unallocated,
      depth: 2,
      color: palette.unallocated,
    });
    links.push({ source: 'budget', target: 'rest', value: unallocated });
  };

  for (const cat of ordered) {
    if (cat.key !== 'savings') emitRest();
    emitCategory(
      `out:${cat.key}`,
      palette.categoryLabel(cat.key),
      cat.monthly,
      palette.tintCategory(cat.meta.color),
      [...cat.entries]
        .sort((a, b) => monthlyAmount(b) - monthlyAmount(a))
        .map((e) => ({ id: `leaf:${e.id}`, label: e.label, value: monthlyAmount(e) })),
    );
  }
  emitRest();

  return { nodes, links, total, unallocated, deficit };
}

/* ------------------------------------------------------------------ */
/* Mise en page                                                        */
/* ------------------------------------------------------------------ */

export interface LaidOutNode extends SankeyNode {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface LaidOutLink {
  id: string;
  value: number;
  source: LaidOutNode;
  target: LaidOutNode;
  /** Bord supérieur du ruban côté source, puis côté cible. */
  sourceY: number;
  targetY: number;
  width: number;
}

export interface SankeyLayout {
  nodes: LaidOutNode[];
  links: LaidOutLink[];
}

export interface LayoutOptions {
  width: number;
  height: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export function layoutSankey(graph: SankeyGraph, options: LayoutOptions): SankeyLayout {
  const nodeWidth = options.nodeWidth ?? 9;
  const nodePadding = options.nodePadding ?? 12;

  const byDepth = new Map<number, SankeyNode[]>();
  for (const node of graph.nodes) {
    const column = byDepth.get(node.depth);
    if (column) column.push(node);
    else byDepth.set(node.depth, [node]);
  }
  const depths = [...byDepth.keys()].sort((a, b) => a - b);
  if (depths.length === 0) return { nodes: [], links: [] };
  const maxDepth = depths[depths.length - 1];

  // Une seule échelle pour toutes les colonnes : sans cela, les épaisseurs ne
  // seraient plus comparables d'une colonne à l'autre.
  let scale = Number.POSITIVE_INFINITY;
  for (const depth of depths) {
    const column = byDepth.get(depth) as SankeyNode[];
    const columnTotal = column.reduce((sum, n) => sum + n.value, 0);
    if (columnTotal <= 0) continue;
    const available = options.height - (column.length - 1) * nodePadding;
    scale = Math.min(scale, available / columnTotal);
  }
  if (!Number.isFinite(scale) || scale <= 0) scale = 0;

  const positioned = new Map<string, LaidOutNode>();
  const laidOutNodes: LaidOutNode[] = [];

  for (const depth of depths) {
    const column = byDepth.get(depth) as SankeyNode[];
    const columnHeight =
      column.reduce((sum, n) => sum + Math.max(n.value * scale, 2), 0) +
      (column.length - 1) * nodePadding;
    let y = Math.max(0, (options.height - columnHeight) / 2);
    const x0 = maxDepth === 0 ? 0 : (depth / maxDepth) * (options.width - nodeWidth);

    for (const node of column) {
      const height = Math.max(node.value * scale, 2);
      const laid: LaidOutNode = { ...node, x0, x1: x0 + nodeWidth, y0: y, y1: y + height };
      positioned.set(node.id, laid);
      laidOutNodes.push(laid);
      y += height + nodePadding;
    }
  }

  const resolved = graph.links
    .map((link) => ({
      link,
      source: positioned.get(link.source),
      target: positioned.get(link.target),
    }))
    .filter((l): l is { link: SankeyLink; source: LaidOutNode; target: LaidOutNode } =>
      Boolean(l.source && l.target),
    );

  // Les rubans sont empilés sur chaque nœud dans l'ordre vertical de l'autre
  // extrémité : c'est ce qui les empêche de se croiser au départ et à l'arrivée.
  const sourceOffsets = new Map<string, number>();
  const targetOffsets = new Map<string, number>();
  const sourceY = new Map<SankeyLink, number>();
  const targetY = new Map<SankeyLink, number>();

  for (const item of [...resolved].sort(
    (a, b) => a.source.y0 - b.source.y0 || a.target.y0 - b.target.y0,
  )) {
    const offset = sourceOffsets.get(item.source.id) ?? item.source.y0;
    sourceY.set(item.link, offset);
    sourceOffsets.set(item.source.id, offset + Math.max(item.link.value * scale, 1));
  }

  for (const item of [...resolved].sort(
    (a, b) => a.target.y0 - b.target.y0 || a.source.y0 - b.source.y0,
  )) {
    const offset = targetOffsets.get(item.target.id) ?? item.target.y0;
    targetY.set(item.link, offset);
    targetOffsets.set(item.target.id, offset + Math.max(item.link.value * scale, 1));
  }

  const links: LaidOutLink[] = resolved.map(({ link, source, target }) => ({
    id: `${link.source}->${link.target}`,
    value: link.value,
    source,
    target,
    sourceY: sourceY.get(link) ?? source.y0,
    targetY: targetY.get(link) ?? target.y0,
    width: Math.max(link.value * scale, 1),
  }));

  return { nodes: laidOutNodes, links };
}

/** Ruban de flux : deux courbes de Bézier refermées. */
export function linkPath(link: LaidOutLink): string {
  const x0 = link.source.x1;
  const x1 = link.target.x0;
  const mid = (x0 + x1) / 2;
  const topStart = link.sourceY;
  const topEnd = link.targetY;
  const bottomStart = topStart + link.width;
  const bottomEnd = topEnd + link.width;

  return [
    `M ${x0} ${topStart}`,
    `C ${mid} ${topStart}, ${mid} ${topEnd}, ${x1} ${topEnd}`,
    `L ${x1} ${bottomEnd}`,
    `C ${mid} ${bottomEnd}, ${mid} ${bottomStart}, ${x0} ${bottomStart}`,
    'Z',
  ].join(' ');
}
