import { BaseParticle } from './baseParticle.js';

export class SmokeParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = 'rgba(100, 100, 100, 0.8)';
    this.lifetime = Math.random() * 60 + 40;
    this.velocity.y = -0.2 - Math.random() * 0.3; 
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.lifetime--;
    if (this.lifetime <= 0) {
      grid.setParticle(x, y, null);
      return;
    }

    
    const alpha = Math.max(0, this.lifetime / 100);
    this.color = `rgba(100, 100, 100, ${alpha})`;

    
    const dx = Math.random() * 2 - 1;
    if (this.canMoveTo(grid, Math.floor(x + dx), y - 1)) {
      grid.moveParticle(x, y, Math.floor(x + dx), y - 1);
    }
  }
}