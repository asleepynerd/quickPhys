import { BaseParticle } from './baseParticle.js';
import { MetalParticle } from './metalParticle.js';

export class AcidParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#88ff00';
    this.lifetime = 100;
    this.reactive = true;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      grid.setParticle(x, y, null);
      return;
    }

    // Add glowing effect
    const glow = Math.sin(Date.now() / 200) * 20;
    this.color = `rgb(${136 + glow}, ${255 + glow}, ${glow})`;

    // Move like water with some randomness
    if (this.canMoveTo(grid, x, y + 1)) {
      grid.moveParticle(x, y, x, y + 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + dir, y)) {
        grid.moveParticle(x, y, x + dir, y);
      } else if (this.canMoveTo(grid, x - dir, y)) {
        grid.moveParticle(x, y, x - dir, y);
      }
    }
  }
}