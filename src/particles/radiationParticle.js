import { BaseParticle } from './baseParticle.js';

export class RadiationParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = 'rgba(0, 255, 0, 0.5)';
    this.lifetime = Math.random() * 20 + 10;
    this.temperature = 200;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      grid.setParticle(x, y, null);
      return;
    }

    // Affect nearby particles
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor) {
          neighbor.temperature += 5;
          if (Math.random() < 0.1) {
            neighbor.mass = Math.max(0.1, neighbor.mass - 0.1);
          }
        }
      }
    }

    // Random movement
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    if (this.canMoveTo(grid, x + dx, y + dy)) {
      grid.moveParticle(x, y, x + dx, y + dy);
    }
  }

  render(ctx, cellSize) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.lifetime / 30;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    ctx.globalAlpha = 1;
  }
} 