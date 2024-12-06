import { BaseParticle } from './baseParticle.js';
import { WaterParticle } from './waterParticle.js';

export class SaltParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#ffffff';
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    // Check for water to create salt water
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor instanceof WaterParticle) {
          neighbor.color = '#a0c8ff'; // Change water color to indicate salt water
          grid.setParticle(x, y, null);
          return;
        }
      }
    }

    // Move like sand
    if (this.canMoveTo(grid, x, y + 1)) {
      grid.moveParticle(x, y, x, y + 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + dir, y + 1)) {
        grid.moveParticle(x, y, x + dir, y + 1);
      }
    }
  }
}