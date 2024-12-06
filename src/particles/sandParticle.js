import { BaseParticle } from './baseParticle.js';

export class SandParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#e3c078';
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    // Try to move down
    if (this.canMoveTo(grid, x, y + 1)) {
      grid.moveParticle(x, y, x, y + 1);
    } else {
      // Try to move diagonally
      const direction = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + direction, y + 1)) {
        grid.moveParticle(x, y, x + direction, y + 1);
      }
    }
  }
}