/**
 * Organic shape library for the blob layer, drawn in a 200×200 box. Referenced by
 * index from backgroundConfig (`shape: 0`). Add a path here to make it available.
 */
export const organicShapes = [
  // 0 — leaf: a long asymmetric lobe with a soft point.
  'M100 8C146 22 186 62 190 108C194 154 156 190 106 192C58 194 18 162 12 116C6 70 44 34 100 8Z',
  // 1 — seed pod: rounder, with one gently flattened side.
  'M104 14C152 16 188 52 186 100C184 150 150 186 98 186C50 186 14 154 14 104C14 60 52 12 104 14Z',
  // 2 — droplet / water: tapering to a lifted tail.
  'M100 6C128 46 176 84 176 128C176 166 142 194 100 194C58 194 24 166 24 128C24 84 72 46 100 6Z',
] as const;
