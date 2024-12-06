import { BaseParticle } from './baseParticle.js';
import { FireParticle } from './fireParticle.js';
import { SmokeParticle } from './smokeParticle.js';

export class GunpowderParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#444444';
    this.flammable = true;
    this.explosionPower = 5;
    this.mass = 2;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.updateTemperature(grid, x, y);

    
    if (this.temperature > 100) {
      this.explode(grid, x, y);
      return;
    }

    
    if (!this.applyPhysics(grid, x, y)) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.canMoveTo(grid, x + dir, y + 1)) {
        grid.moveParticle(x, y, x + dir, y + 1);
      }
    }
  }

  explode(grid, x, y) {
    
    for (let dy = -this.explosionPower; dy <= this.explosionPower; dy++) {
      for (let dx = -this.explosionPower; dx <= this.explosionPower; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.explosionPower) {
          const newX = x + dx;
          const newY = y + dy;
          
          if (grid.isInBounds(newX, newY)) {
            const particle = grid.getParticle(newX, newY);
            if (particle) {
              
              particle.velocity.x += dx * 0.5;
              particle.velocity.y += dy * 0.5;
              particle.temperature += 100;
            }
            
            
            if (Math.random() < 0.3) {
              grid.setParticle(newX, newY, new FireParticle(newX, newY));
            } else if (Math.random() < 0.5) {
              grid.setParticle(newX, newY, new SmokeParticle(newX, newY));
            }
          }
        }
      }
    }
    
    
    grid.setParticle(x, y, null);
  }
}