import { BaseParticle } from './baseParticle.js';
import { BlackHoleParticle } from './blackHoleParticle.js';
import { SteamParticle } from './steamParticle.js';

export class WaterParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#4444ff';
    this.pressure = 0;
    this.compressionThreshold = 10;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.updateTemperature(grid, x, y);
    this.updatePressure(grid, x, y);

    
    if (this.pressure > this.compressionThreshold && this.temperature < -50) {
      grid.setParticle(x, y, new BlackHoleParticle(x, y));
      return;
    }

    
    if (this.temperature >= 100) {
      grid.setParticle(x, y, new SteamParticle(x, y));
      return;
    }

    
    if (this.canMoveTo(grid, x, y + 1)) {
      grid.moveParticle(x, y, x, y + 1);
    } else {
      const direction = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + direction, y)) {
        grid.moveParticle(x, y, x + direction, y);
      } else if (this.canMoveTo(grid, x - direction, y)) {
        grid.moveParticle(x, y, x - direction, y);
      }
    }
  }

  updatePressure(grid, x, y) {
    
    let waterCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor instanceof WaterParticle) {
          waterCount++;
        }
      }
    }
    this.pressure = waterCount;
  }
}