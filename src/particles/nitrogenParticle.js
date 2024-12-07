import { BaseParticle } from './baseParticle.js';
import { IceParticle } from './iceParticle.js';

export class NitrogenParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#add8e6';
        this.temperature = -200;
        this.mass = 0.5;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        // Freeze nearby particles
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const neighbor = grid.getParticle(x + dx, y + dy);
                if (neighbor) {
                    neighbor.temperature -= 20;
                    if (neighbor.temperature < 0 && Math.random() < 0.1) {
                        grid.setParticle(x + dx, y + dy, new IceParticle(x + dx, y + dy));
                    }
                }
            }
        }

        // Rise and spread
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.random() < 0.8 ? -1 : 0;
        if (this.canMoveTo(grid, x + dx, y + dy)) {
            grid.moveParticle(x, y, x + dx, y + dy);
        }
    }
} 