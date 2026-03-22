import { gridKey } from './wallGrid.js';

/**
 * Optional extra blocked tiles (same `"col,row"` keys as `getWalls()`).
 * Edit here for quick tests without touching `collision-map.json`.
 */
export const extraWalls = new Set();

for (const row of [4, 5, 6, 7,8]) {
  extraWalls.add(gridKey(18, row));
  extraWalls.add(gridKey(19, row));
  extraWalls.add(gridKey(20, row));
  extraWalls.add(gridKey(21, row));
  extraWalls.add(gridKey(22, row));
  extraWalls.add(gridKey(23, row));
  extraWalls.add(gridKey(24, row));
  extraWalls.add(gridKey(25, row));
  extraWalls.add(gridKey(26, row));
  extraWalls.add(gridKey(27, row));
}

// Examples (grid columns & rows — not raw pixels):
// extraWalls.add(gridKey(10, 5));
// extraWalls.add('12,9');
