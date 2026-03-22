/** Level layout: edit `collision-map.json` (blocks / unblocks / halfCells). */
import collisionMapData from './collision-map.json';
import { extraWalls } from './extraWalls.js';
import { gridKey, isSpaceFree, wallSetFromGridCells } from './wallGrid.js';

/**
 * Tile grid collision in canvas pixel space (same as the drawn map).
 *
 * Map art: src/assets/cityMap.png — 1536×1024 isometric intersection (four corner
 * buildings: ABOUT, EXPERIENCE, SKILLS, CONTACT). The image is scaled to the canvas;
 * these rects are tuned for the current canvas size (see GameCanvas width/height).
 *
 * Isometric note: buildings read as diamonds on screen; axis-aligned cells are only an
 * approximation. Lower cellSize or add more blockRect() calls to tighten fit.
 */

/** Original asset size — useful if you convert editor/tool coords from image space. */
export const CITY_MAP_SOURCE_SIZE = { width: 1536, height: 1024 };

/** Full map grid lines (same spacing as collision cells). */
// export const SHOW_GRID_OVERLAY = true;
export const SHOW_GRID_OVERLAY = false;

/** Set to `false` when you finish tuning `blockRect` / `blockPixels` so players don’t see the overlay. */
// export const SHOW_COLLISION_DEBUG = true;
export const SHOW_COLLISION_DEBUG = false;

/** Draw `col,row` text on each cell while you carve walkable areas with `unblockPixels`. */
// export const SHOW_CELL_COORDINATES = true;
export const SHOW_CELL_COORDINATES = false;

/** Collision + grid cell size in canvas pixels. Smaller = finer blocks, more cells. */
export const GRID_CELL_SIZE = 32;

/** Target canvas size before snapping to the grid (edit here; use `getGameCanvasSize()` at runtime). */
export const GAME_CANVAS_DESIRED = { width: 1000, height: 600 };

/** Canvas width/height as exact multiples of `GRID_CELL_SIZE` so the map splits into whole cells only. */
export function getCanvasSizeForGrid(desiredWidth, desiredHeight, cellSize = GRID_CELL_SIZE) {
  const w = Math.max(cellSize, Math.floor(desiredWidth / cellSize) * cellSize);
  const h = Math.max(cellSize, Math.floor(desiredHeight / cellSize) * cellSize);
  return { width: w, height: h };
}

export function getGameCanvasSize() {
  return getCanvasSizeForGrid(GAME_CANVAS_DESIRED.width, GAME_CANVAS_DESIRED.height, GRID_CELL_SIZE);
}

export function createGrid(canvasWidth, canvasHeight, cellSize) {
  const cols = Math.floor(canvasWidth / cellSize);
  const rows = Math.floor(canvasHeight / cellSize);
  const cells = new Uint8Array(cols * rows);
  return { cellSize, cols, rows, cells };
}

export function index(cols, col, row) {
  return row * cols + col;
}

/**
 * Half-cell blockers loaded from `collision-map.json` (see `buildDefaultCollision`).
 * `side` is which region is blocked: left | right | top | bottom | topLeft (quarter).
 */
let collisionHalfCells = [];

/** Set of `"col,row"` keys — same tiles as the grid; use for easy checks / debugging. */
let collisionWalls = new Set();

export function getWalls() {
  return collisionWalls;
}

export { gridCells, gridKey, isSpaceFree } from './wallGrid.js';

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function halfBlockedPixelRect(col, row, side, cellSize) {
  const cl = col * cellSize;
  const ct = row * cellSize;
  const h2 = cellSize / 2;
  const s = typeof side === 'string' ? side.trim() : side;
  if (s === 'left') return { x: cl, y: ct, w: h2, h: cellSize };
  if (s === 'right') return { x: cl + h2, y: ct, w: h2, h: cellSize };
  if (s === 'top') return { x: cl, y: ct, w: cellSize, h: h2 };
  if (s === 'bottom') return { x: cl, y: ct + h2, w: cellSize, h: h2 };
  if (s === 'topLeft') return { x: cl, y: ct, w: h2, h: h2 };
  return { x: cl, y: ct, w: cellSize, h: cellSize };
}

export function overlapsHalfBlocked(x, y, w, h, cellSize) {
  for (const hb of collisionHalfCells) {
    const r = halfBlockedPixelRect(hb.col, hb.row, hb.side, cellSize);
    if (rectsOverlap(x, y, w, h, r.x, r.y, r.w, r.h)) return true;
  }
  return false;
}

/** Block a pixel-aligned rectangle (same coords as the drawn map). */
export function blockPixels(grid, px, py, pw, ph) {
  const { cellSize, cols, rows } = grid;
  const col0 = Math.max(0, Math.floor(px / cellSize));
  const row0 = Math.max(0, Math.floor(py / cellSize));
  const col1 = Math.min(cols - 1, Math.floor((px + pw - 1) / cellSize));
  const row1 = Math.min(rows - 1, Math.floor((py + ph - 1) / cellSize));
  if (col0 > col1 || row0 > row1) return;
  blockRect(grid, col0, row0, col1 - col0 + 1, row1 - row0 + 1);
}

/** Mark a rectangle of cells as blocked (in cell coordinates). */
export function blockRect(grid, col0, row0, colCount, rowCount) {
  const { cols, rows, cells } = grid;
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const col = col0 + c;
      const row = row0 + r;
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        cells[index(cols, col, row)] = 1;
      }
    }
  }
}

/** Set every cell to blocked (full-screen red overlay until you carve with `unblockPixels`). */
export function fillAllBlocked(grid) {
  grid.cells.fill(1);
}

/** Clear blocked cells (walkable). Cell coordinates — use labels on screen or `col,row` from debug text. */
export function unblockRect(grid, col0, row0, colCount, rowCount) {
  const { cols, rows, cells } = grid;
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const col = col0 + c;
      const row = row0 + r;
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        cells[index(cols, col, row)] = 0;
      }
    }
  }
}

/** Clear blocked cells inside a pixel rectangle (same coords as the map). */
export function unblockPixels(grid, px, py, pw, ph) {
  const { cellSize, cols, rows } = grid;
  const col0 = Math.max(0, Math.floor(px / cellSize));
  const row0 = Math.max(0, Math.floor(py / cellSize));
  const col1 = Math.min(cols - 1, Math.floor((px + pw - 1) / cellSize));
  const row1 = Math.min(rows - 1, Math.floor((py + ph - 1) / cellSize));
  if (col0 > col1 || row0 > row1) return;
  unblockRect(grid, col0, row0, col1 - col0 + 1, row1 - row0 + 1);
}

/** True if the axis-aligned box overlaps any blocked cell (uses `collisionWalls` Set + half-cells). */
export function isBlocked(grid, x, y, w, h) {
  const { cellSize, cols, rows } = grid;
  if (!isSpaceFree(collisionWalls, x, y, w, h, cellSize, cols, rows)) return true;
  if (overlapsHalfBlocked(x, y, w, h, cellSize)) return true;
  return false;
}

/** Draw blocked cells on top of the map (transparent red). */
export function drawCollisionDebug(ctx, grid) {
  if (!SHOW_COLLISION_DEBUG) return;
  const { cellSize, cols, rows } = grid;
  ctx.save();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!collisionWalls.has(gridKey(col, row))) continue;
      const x = col * cellSize;
      const y = row * cellSize;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.35)';
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeStyle = 'rgba(180, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
    }
  }
  for (const hb of collisionHalfCells) {
    const r = halfBlockedPixelRect(hb.col, hb.row, hb.side, cellSize);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.35)';
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = 'rgba(180, 0, 0, 0.5)';
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
  }
  if (SHOW_CELL_COORDINATES) {
    ctx.font = `${Math.max(7, Math.floor(cellSize * 0.22))}px ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const blocked = collisionWalls.has(gridKey(col, row));
        ctx.fillStyle = blocked ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.55)';
        ctx.fillText(`${col},${row}`, x + 2, y + 2);
      }
    }
  }
  ctx.restore();
}

/** Draw light lines across the whole canvas so every cell is visible (uses same step as collision). */
export function drawGridOverlay(ctx, canvasWidth, canvasHeight, cellSize) {
  if (!SHOW_GRID_OVERLAY) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 230, 255, 0.22)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvasWidth; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y <= canvasHeight; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(canvasWidth, y + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draw the map image split into one source slice per grid cell (same cols/rows as collision).
 * Keeps the full picture; each cell maps to a proportional region of `cityMap.png`.
 */
export function drawBackgroundInGrid(ctx, canvasWidth, canvasHeight, image, cellSize = GRID_CELL_SIZE) {
  if (!image.complete || image.naturalWidth <= 0) return false;
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  const cols = Math.floor(canvasWidth / cellSize);
  const rows = Math.floor(canvasHeight / cellSize);
  const prevSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = true;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = (col / cols) * iw;
      const sy = (row / rows) * ih;
      const sw = iw / cols;
      const sh = ih / rows;
      const dx = col * cellSize;
      const dy = row * cellSize;
      ctx.drawImage(image, sx, sy, sw, sh, dx, dy, cellSize, cellSize);
    }
  }
  ctx.imageSmoothingEnabled = prevSmoothing;
  return true;
}

/**
 * Build collision from `collision-map.json` (blocks, unblocks, halfCells).
 */
export function buildDefaultCollision(canvasWidth, canvasHeight) {
  const grid = createGrid(canvasWidth, canvasHeight, GRID_CELL_SIZE);
  const data = collisionMapData;

  for (const b of data.blocks ?? []) {
    blockPixels(grid, b.x, b.y, b.w, b.h);
  }
  for (const u of data.unblocks ?? []) {
    unblockRect(grid, u.col, u.row, u.cols, u.rows);
  }
  collisionHalfCells = Array.isArray(data.halfCells) ? data.halfCells.map((h) => ({ ...h })) : [];

  collisionWalls = wallSetFromGridCells(grid.cells, grid.cols, grid.rows);
  for (const key of extraWalls) {
    collisionWalls.add(key);
  }

  return grid;
}
