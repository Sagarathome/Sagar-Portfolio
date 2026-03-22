/**
 * Walk up to a building entrance and press Enter to open its modal.
 * `rel` is 0–1 relative to canvas width/height — tune with the grid overlay on.
 * `gridCells` is optional: list of [col, row] pairs — when player is in any of these cells, show prompt.
 */

import { GRID_CELL_SIZE } from './collision.js';

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function playerInGridCell(hx, hy, hw, hh, col, row, cellSize) {
  const cx = col * cellSize;
  const cy = row * cellSize;
  return rectsOverlap(hx, hy, hw, hh, cx, cy, cellSize, cellSize);
}

export const BUILDING_ENTRANCES = [
  {
    id: 'about',
    title: 'About',
    body: 'Add your bio, focus areas, and what you are looking for next.',
    rel: { x: 0.33, y: 0.52, w: 0.1, h: 0.12 },
  },
  {
    id: 'experience',
    title: 'Experience',
    body: 'List roles, impact, and tech — replace this placeholder copy.',
    // rel: { x: 0.57, y: 0.52, w: 0.1, h: 0.12 },
    gridCells: [[18, 9], [19, 9], [20, 9]],
  },
  {
    id: 'skills',
    title: 'Skills',
    body: 'Languages, frameworks, and tools you want to highlight.',
    gridCells: [[8,17], [9,17], [10,17], [11,17], [12,17], [13,17], [14,17], [15,17]],
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'Email, links, or a short call-to-action for visitors.',
    gridCells: [[17, 17], [18, 17], [19, 17], [20, 17], [21, 17], [22, 17],[23, 17]],
  },
  {
    id: 'projects',
    title: 'Projects',
    body: 'Portfolio projects.',
    gridCells: [[4, 12], [5, 12], [6, 12], [7, 12]],
  },
];

/**
 * @returns {typeof BUILDING_ENTRANCES[0] | null}
 */
export function getEntranceAtPlayer(player, canvasWidth, canvasHeight) {
  const hx = player.x + player.hitboxOffsetX;
  const hy = player.y + player.hitboxOffsetY;
  const hw = player.hitboxWidth;
  const hh = player.hitboxHeight;

  for (const e of BUILDING_ENTRANCES) {
    if (e.gridCells) {
      for (const [col, row] of e.gridCells) {
        if (playerInGridCell(hx, hy, hw, hh, col, row, GRID_CELL_SIZE)) return e;
      }
    } else if (e.rel) {
      const { x, y, w, h } = {
        x: e.rel.x * canvasWidth,
        y: e.rel.y * canvasHeight,
        w: e.rel.w * canvasWidth,
        h: e.rel.h * canvasHeight,
      };
      if (rectsOverlap(hx, hy, hw, hh, x, y, w, h)) return e;
    }
  }
  return null;
}
