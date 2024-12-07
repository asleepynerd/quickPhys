import { BaseParticle } from './baseParticle.js';

export class ElectricityParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#ffff00';
        this.lifetime = Math.random() * 10 + 5;
        this.conductive = true;
        this.temperature = 200;
        this.branchChance = 0.3;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.lifetime--;
        if (this.lifetime <= 0) {
            grid.setParticle(x, y, null);
            return;
        }

        
        const directions = [
            { dx: 0, dy: 1 },  
            { dx: 1, dy: 1 },  
            { dx: -1, dy: 1 }, 
            { dx: 1, dy: 0 },  
            { dx: -1, dy: 0 }  
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            const neighbor = grid.getParticle(newX, newY);
            
            if (neighbor && neighbor.conductive && Math.random() < this.branchChance) {
                neighbor.temperature += 50;
                if (Math.random() < 0.5) {
                    grid.setParticle(newX, newY, new ElectricityParticle(newX, newY));
                }
            }
        }

        
        this.color = `rgb(255, 255, ${Math.random() * 100 + 155})`;
    }
} 