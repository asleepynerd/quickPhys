import { BaseParticle } from './baseParticle.js';
import { FireParticle } from './fireParticle.js';

export class OilParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#4a4a00';
        this.flammable = true;
        this.mass = 0.8;
        this.viscosity = 0.5;
        this.ignitionTemp = 80;
        this.burnTime = 100;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        
        if (this.temperature >= this.ignitionTemp) {
            grid.setParticle(x, y, new FireParticle(x, y));
            this.burnTime = Math.random() * 50 + 50;
            return;
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
    }
} 