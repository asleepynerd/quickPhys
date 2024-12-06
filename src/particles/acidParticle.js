import { BaseParticle } from './baseParticle.js';
import { WallParticle } from './wallParticle.js';

export class AcidParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#88ff00';
    this.lifetime = 100;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      grid.setParticle(x, y, null);
      return;
    }

    // Try to dissolve adjacent particles
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor && !(neighbor instanceof AcidParticle)) {
          if (Math.random() < 0.1) {
            grid.setParticle(x + dx, y + dy, null);
            this.lifetime -= 10;
          }
        }
      }
    }

    // Move like water
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