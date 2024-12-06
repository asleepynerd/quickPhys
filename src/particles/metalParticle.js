import { BaseParticle } from './baseParticle.js';
import { BlackHoleParticle } from './blackHoleParticle.js';
import { AcidParticle } from './acidParticle.js';

export class MetalParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#808080';
    this.conductive = true;
    this.mass = 3;
    this.meltingPoint = 800;
    this.acidContacts = 0;  
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.updateTemperature(grid, x, y);

    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor instanceof AcidParticle) {
          this.acidContacts++;
          
          grid.setParticle(x + dx, y + dy, null);
          
          
          const intensity = Math.min(this.acidContacts * 30, 255);
          this.color = `rgb(${128 + intensity}, ${Math.max(0, 128 - intensity)}, ${128 + intensity})`;
          
          
          if (this.acidContacts >= 5) {
            grid.setParticle(x, y, new BlackHoleParticle(x, y));
            return;
          }
        }
      }
    }

    
    if (this.temperature > this.meltingPoint) {
      this.color = '#c0c0c0';
      this.applyPhysics(grid, x, y);
    } else {
      
      grid.moveParticle(x, y, x, y);
    }
  }
} 