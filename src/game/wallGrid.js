/**
 * Simple wall map: each blocked tile is a string key `"col,row"` in grid space.
 * Use with `GRID_CELL_SIZE` from `collision.js` (same cell size as the map).
 */

/** @param {number} col @param {number} row */
export function gridKey(col, row) {
  return `${col},${row}`;
}

/** Pixel length of n cells (e.g. gridCells(4, 32) === 128). */
export function gridCells(n, cellSize) {
  return n * cellSize;
}

/** Top-left pixel of a grid cell. */
export function gridCellOrigin(col, row, cellSize) {
  return { x: col * cellSize, y: row * cellSize };
}

/**
 * True if the axis-aligned box (player hitbox) does not overlap any wall cell.
 * Same idea as your `isSpaceFree`: returns true when walkable.
 */
export function isSpaceFree(walls, x, y, w, h, cellSize, cols, rows) {
  const left = Math.floor(x / cellSize);
  const top = Math.floor(y / cellSize);
  const right = Math.floor((x + w - 1) / cellSize);
  const bottom = Math.floor((y + h - 1) / cellSize);

  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return false;
      if (walls.has(gridKey(col, row))) return false;
    }
  }
  return true;
}

/** Add every cell covered by a pixel rectangle (same rules as `blockPixels`). */
export function addWallRectPixels(walls, px, py, pw, ph, cellSize, cols, rows) {
  const c0 = Math.max(0, Math.floor(px / cellSize));
  const r0 = Math.max(0, Math.floor(py / cellSize));
  const c1 = Math.min(cols - 1, Math.floor((px + pw - 1) / cellSize));
  const r1 = Math.min(rows - 1, Math.floor((py + ph - 1) / cellSize));
  if (c0 > c1 || r0 > r1) return;
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      walls.add(gridKey(c, r));
    }
  }
}

/** Remove a rectangle of cells (cell coordinates). */
export function removeWallRectCells(walls, col0, row0, colCount, rowCount) {
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      walls.delete(gridKey(col0 + c, row0 + r));
    }
  }
}

/** Rebuild a Set from the Uint8Array collision grid (call after loading the map). */
export function wallSetFromGridCells(cells, cols, rows) {
  const walls = new Set();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (cells[row * cols + col]) walls.add(gridKey(col, row));
    }
  }
  return walls;
}
