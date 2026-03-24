import { isBlocked } from './collision.js';

/** hero-sheet.png: 96×256px → 3 columns × 8 rows, 32×32px per cell. Rows 0–3 = walk cycles (down, right, up, left). */
const COLS = 3;
const ROWS = 8;

export default class Player {
  constructor(image, x, y) {
    this.image = image;

    this.x = x;
    this.y = y;

    this.spriteWidth = 32;
    this.spriteHeight = 32;

    this.width = 64;
    this.height = 64;

    /** Collision uses a smaller box at the “feet” so you can stand next to red cells without the full sprite rect blocking early. */
    this.hitboxWidth = 34;
    this.hitboxHeight = 22;
    this.hitboxOffsetX = (this.width - this.hitboxWidth) / 2;
    this.hitboxOffsetY = this.height - this.hitboxHeight - 6;

    /** Pixels per second (delta-time independent) */
    this.speed = 60;

    this.frameX = 0;
    this.frameY = 0;
    /** Three walk frames per direction: columns 0, 1, 2 */
    this.maxFrame = 2;

    this.animationTick = 0;
    this.animationSpeed = 8;
  }

  syncSpriteSizeFromImage() {
    const img = this.image;
    if (!img.complete || img.naturalWidth <= 0) return;
    this.spriteWidth = Math.floor(img.naturalWidth / COLS);
    this.spriteHeight = Math.floor(img.naturalHeight / ROWS);
  }

  /**
   * @param collision - from buildDefaultCollision / your own grid; pass null to disable
   * @param deltaTime - seconds since last frame (for frame-rate independent movement)
   */
  update(input, canvas, collision, deltaTime = 1/60) {
    this.syncSpriteSizeFromImage();

    const move = this.speed * deltaTime;
    let dx = 0;
    let dy = 0;
    let isMoving = false;

    if (input.keys.ArrowRight) {
      dx += move;
      this.frameY = 1;
      isMoving = true;
    }

    if (input.keys.ArrowLeft) {
      dx -= move;
      this.frameY = 3;
      isMoving = true;
    }

    if (input.keys.ArrowUp) {
      dy -= move;
      this.frameY = 2;
      isMoving = true;
    }

    if (input.keys.ArrowDown) {
      dy += move;
      this.frameY = 0;
      isMoving = true;
    }

    const hbW = this.hitboxWidth;
    const hbH = this.hitboxHeight;
    const hbOx = this.hitboxOffsetX;
    const hbOy = this.hitboxOffsetY;
    const nextX = this.x + dx;
    const nextY = this.y + dy;

    if (collision) {
      if (!isBlocked(collision, nextX + hbOx, this.y + hbOy, hbW, hbH)) this.x = nextX;
      if (!isBlocked(collision, this.x + hbOx, nextY + hbOy, hbW, hbH)) this.y = nextY;
    } else {
      this.x = nextX;
      this.y = nextY;
    }

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;

    if (isMoving) {
      this.animationTick++;

      if (this.animationTick >= this.animationSpeed) {
        this.frameX++;
        if (this.frameX > this.maxFrame) {
          this.frameX = 0;
        }
        this.animationTick = 0;
      }
    } else {
      this.frameX = 1;
    }
  }

  draw(ctx) {
    if (!this.image.complete || this.image.naturalWidth === 0) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }

    this.syncSpriteSizeFromImage();

    const prevSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    ctx.imageSmoothingEnabled = prevSmoothing;
  }
}
