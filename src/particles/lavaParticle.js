import { BaseParticle } from './baseParticle.js';
import { ObsidianParticle } from './obsidianParticle.js';
import { SmokeParticle } from './smokeParticle.js';

export class LavaParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#ff4400';
        this.temperature = 1200;
        this.mass = 2;
        this.viscosity = 0.7;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        
        if (this.temperature < 700) {
            grid.setParticle(x, y, new ObsidianParticle(x, y));
            return;
        }

        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const neighbor = grid.getParticle(x + dx, y + dy);
                if (neighbor && neighbor.meltingPoint && neighbor.temperature < this.temperature) {
                    neighbor.temperature += 50;
                }
            }
        }

        
        if (Math.random() < 0.1) {
            const above = grid.getParticle(x, y - 1);
            if (!above) {
                grid.setParticle(x, y - 1, new SmokeParticle(x, y - 1));
            }
        }

        
        if (Math.random() > this.viscosity) {
            if (this.canMoveTo(grid, x, y + 1)) {
                grid.moveParticle(x, y, x, y + 1);
            } else {
                const dir = Math.random() < 0.5 ? -1 : 1;
                if (this.canMoveTo(grid, x + dir, y)) {
                    grid.moveParticle(x, y, x + dir, y);
                }
            }
        }

        
        const intensity = Math.sin(Date.now() / 200) * 20;
        this.color = `rgb(${255 + intensity}, ${68 + intensity/2}, 0)`;
    }
} 