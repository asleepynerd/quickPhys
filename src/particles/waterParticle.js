import { BaseParticle } from './baseParticle.js';

export class WaterParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#4444ff';
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    // Try to move down
    if (this.canMoveTo(grid, x, y + 1)) {
      grid.moveParticle(x, y, x, y + 1);
    } else {
      // Try to move sideways
      const direction = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + direction, y)) {
        grid.moveParticle(x, y, x + direction, y);
      } else if (this.canMoveTo(grid, x - direction, y)) {
        grid.moveParticle(x, y, x - direction, y);
      }
    }
  }
}