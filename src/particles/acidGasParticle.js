import { BaseParticle } from './baseParticle.js';
import { AcidParticle } from './acidParticle.js';

export class AcidGasParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = 'rgba(144, 238, 144, 0.6)';
        this.lifetime = Math.random() * 100 + 50;
        this.reactive = true;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.lifetime--;
        if (this.lifetime <= 0) {
            grid.setParticle(x, y, null);
            return;
        }

        
        const above = grid.getParticle(x, y - 1);
        if (above && !(above instanceof AcidGasParticle) && Math.random() < 0.1) {
            grid.setParticle(x, y - 1, null);
        }

        
        if (this.temperature < 20) {
            grid.setParticle(x, y, new AcidParticle(x, y));
            return;
        }

        
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.random() < 0.8 ? -1 : 0;
        if (this.canMoveTo(grid, x + dx, y + dy)) {
            grid.moveParticle(x, y, x + dx, y + dy);
        }
    }
} 