import { BaseParticle } from './baseParticle.js';
import { FireParticle } from './fireParticle.js';

export class PlasmaParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#ff00ff';
        this.temperature = 2000;
        this.lifetime = Math.random() * 30 + 20;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.lifetime--;
        if (this.lifetime <= 0) {
            grid.setParticle(x, y, new FireParticle(x, y));
            return;
        }

        
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const neighbor = grid.getParticle(x + dx, y + dy);
                if (neighbor && !(neighbor instanceof PlasmaParticle)) {
                    neighbor.temperature += 100;
                    if (Math.random() < 0.2) {
                        grid.setParticle(x + dx, y + dy, null);
                    }
                }
            }
        }

        
        const newX = Math.round(x + this.velocity.x);
        const newY = Math.round(y + this.velocity.y);
        
        if (grid.isInBounds(newX, newY)) {
            grid.moveParticle(x, y, newX, newY);
        }

        
        const intensity = Math.sin(Date.now() / 100) * 50;
        this.color = `rgb(${255 + intensity}, ${intensity}, ${255 + intensity})`;
    }
} 