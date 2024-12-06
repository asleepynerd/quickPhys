import { BaseParticle } from './baseParticle.js';
import { WaterParticle } from './waterParticle.js';

export class SteamParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = 'rgba(200, 200, 255, 0.6)';
    this.temperature = 150;
    this.lifetime = Math.random() * 100 + 50;
    this.velocity.y = -0.3 - Math.random() * 0.2;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      grid.setParticle(x, y, null);
      return;
    }

    this.updateTemperature(grid, x, y);

    // Condense back to water if temperature drops
    if (this.temperature < 100) {
      grid.setParticle(x, y, new WaterParticle(x, y));
      return;
    }

    // Move upward with random drift
    const dx = Math.random() * 2 - 1;
    if (this.canMoveTo(grid, Math.floor(x + dx), y - 1)) {
      grid.moveParticle(x, y, Math.floor(x + dx), y - 1);
    }
  }
} 