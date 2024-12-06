import { BaseParticle } from './baseParticle.js';

export class DustParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#8b7355';
    this.mass = 0.2;
    this.airResistance = 0.99;
    this.settled = false;
    const variation = Math.floor(Math.random() * 20) - 10;
    const r = Math.min(255, Math.max(0, 139 + variation));
    const g = Math.min(255, Math.max(0, 115 + variation));
    const b = Math.min(255, Math.max(0, 85 + variation));
    this.color = `rgb(${r}, ${g}, ${b})`;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    if (this.settled) {
      if (Math.random() < 0.1) { 
        this.settled = false;
      } else {
        grid.moveParticle(x, y, x, y);
        return;
      }
    }

    
    let upwardForce = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor && neighbor.temperature > 50) {
          upwardForce += (neighbor.temperature - 50) * 0.001;
        }
      }
    }
    this.velocity.y -= upwardForce;

    
    this.velocity.x *= this.airResistance;
    this.velocity.y *= this.airResistance;

    if (!this.applyPhysics(grid, x, y)) {
      if (Math.random() < 0.3) { 
        this.settled = true;
      }
    }
  }
} 