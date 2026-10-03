import { forwardRef } from 'react';

/**
 * Contour currents. The pattern repeats exactly every FLOW_PERIOD units and is drawn
 * across FLOW_WIDTH (four periods) on an element twice the visible width, so a -50%
 * translate lands on an identical frame — `seamlessLoop` animates that.
 */
const FLOW_PERIOD = 720;
const FLOW_WIDTH = FLOW_PERIOD * 4;

/** Two cubic halves per period with control points at crest and trough height. */
function wavePath(y: number, amplitude: number, phase: number): string {
  const half = FLOW_PERIOD / 2;
  const offset = (phase % 1) * FLOW_PERIOD;
  let d = `M ${-offset} ${y}`;
  for (let x = -offset; x < FLOW_WIDTH; x += FLOW_PERIOD) {
    d += ` C ${x + half * 0.36} ${y - amplitude} ${x + half * 0.64} ${y - amplitude} ${x + half} ${y}`;
    d += ` S ${x + FLOW_PERIOD * 0.82} ${y + amplitude} ${x + FLOW_PERIOD} ${y}`;
  }
  return d;
}

// Computed once at module load: five near currents and four far ones.
const flowSets = [
  Array.from({ length: 4 }, (_, i) => wavePath(170 + i * 46, 46 + i * 8, 0.4 + i * 0.11)),
  Array.from({ length: 5 }, (_, i) => wavePath(380 + i * 34, 70 - i * 6, i * 0.07)),
];

export const FlowLines = forwardRef<SVGSVGElement, { set: number; color: string }>(function FlowLines(
  { set, color },
  ref,
) {
  const paths = flowSets[set % flowSets.length];
  return (
    <svg
      ref={ref}
      className="bg-flow"
      viewBox={`0 0 ${FLOW_WIDTH} 800`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ stroke: color }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" style={{ opacity: 1 - i * 0.14 }} />
      ))}
    </svg>
  );
});
