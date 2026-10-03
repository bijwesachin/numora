import type { FactorNode, FactorTreeVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const LEAF_W = 52;
const LEVEL_H = 58;
const R = 19;

interface Placed {
  node: FactorNode;
  x: number;
  depth: number;
  children: Placed[];
}

function leafCount(node: FactorNode): number {
  return node.children ? leafCount(node.children[0]) + leafCount(node.children[1]) : 1;
}

function place(node: FactorNode, left: number, depth: number): Placed {
  const width = leafCount(node) * LEAF_W;
  if (!node.children) return { node, x: left + width / 2, depth, children: [] };
  const a = place(node.children[0], left, depth + 1);
  const b = place(node.children[1], left + leafCount(node.children[0]) * LEAF_W, depth + 1);
  return { node, x: (a.x + b.x) / 2, depth, children: [a, b] };
}

function maxDepth(p: Placed): number {
  return Math.max(p.depth, ...p.children.map(maxDepth));
}

function primesOf(node: FactorNode): number[] {
  return node.children ? [...primesOf(node.children[0]), ...primesOf(node.children[1])] : [node.value];
}

export function FactorTree({ root }: FactorTreeVisual) {
  const tree = place(root, 0, 0);
  const width = leafCount(root) * LEAF_W;
  const height = (maxDepth(tree) + 1) * LEVEL_H + 10;
  const y = (depth: number) => R + 6 + depth * LEVEL_H;

  const render = (p: Placed): React.ReactNode => (
    <g key={`${p.depth}-${p.x}`}>
      {p.children.map((c) => (
        <line key={`l-${c.x}`} x1={p.x} y1={y(p.depth) + R} x2={c.x} y2={y(c.depth) - R} stroke={VISUAL_COLORS.stroke} strokeWidth={2} />
      ))}
      <circle cx={p.x} cy={y(p.depth)} r={R} fill={p.children.length ? VISUAL_COLORS.empty : VISUAL_COLORS.filled} stroke={VISUAL_COLORS.stroke} strokeWidth={2} />
      <text x={p.x} y={y(p.depth) + 5} textAnchor="middle" fontSize={p.node.value >= 100 ? 14 : 16} fontWeight={700} fill={VISUAL_COLORS.text}>
        {p.node.value}
      </text>
      {p.children.map(render)}
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: Math.max(width * 1.3, 200) }}
      role="img"
      aria-label={`Factor tree of ${root.value}: prime factors ${primesOf(root).join(' × ')}`}
    >
      {render(tree)}
    </svg>
  );
}
