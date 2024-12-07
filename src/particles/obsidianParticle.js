import { BaseParticle } from './baseParticle.js';
import { LavaParticle } from './lavaParticle.js';

export class ObsidianParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#1a1a1a';
        this.mass = 4;
        this.meltingPoint = 800;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        
        if (this.temperature >= this.meltingPoint) {
            grid.setParticle(x, y, new LavaParticle(x, y));
            return;
        }

        
        if (this.canMoveTo(grid, x, y + 1)) {
            grid.moveParticle(x, y, x, y + 1);
        }
    }
} 