import { BaseParticle } from './baseParticle.js';
import { SmokeParticle } from './smokeParticle.js';

export class FireParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#ff4400';
    this.temperature = 400;
    this.lifetime = Math.random() * 20 + 10;
    this.velocity.y = -0.5 * Math.random(); // Fire rises
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      if (Math.random() < 0.5) {
        grid.setParticle(x, y, new SmokeParticle(x, y));
      } else {
        grid.setParticle(x, y, null);
      }
      return;
    }

    // Spread fire to flammable neighbors
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor && neighbor.flammable && Math.random() < 0.1) {
          grid.setParticle(x + dx, y + dy, new FireParticle(x + dx, y + dy));
        }
      }
    }

    // Dynamic color based on lifetime
    const intensity = Math.min(255, Math.floor((this.lifetime / 30) * 255));
    this.color = `rgb(${intensity}, ${intensity / 4}, 0)`;

    // Move upward with some randomness
    const dx = Math.random() * 2 - 1;
    if (this.canMoveTo(grid, Math.floor(x + dx), y - 1)) {
      grid.moveParticle(x, y, Math.floor(x + dx), y - 1);
    }
  }
}