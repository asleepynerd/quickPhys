import { BaseParticle } from './baseParticle.js';
import { WaterParticle } from './waterParticle.js';

export class IceParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#a5f2f3';
        this.temperature = -10;
        this.mass = 1;
        this.meltingPoint = 0;
        this.conductive = true;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        // Melt into water
        if (this.temperature > this.meltingPoint) {
            grid.setParticle(x, y, new WaterParticle(x, y));
            return;
        }

        // Freeze nearby water
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const neighbor = grid.getParticle(x + dx, y + dy);
                if (neighbor instanceof WaterParticle && Math.random() < 0.1) {
                    neighbor.temperature -= 5;
                    if (neighbor.temperature < -5) {
                        grid.setParticle(x + dx, y + dy, new IceParticle(x + dx, y + dy));
                    }
                }
            }
        }

        // Add crystalline frost effect
        if (Math.random() < 0.05) {
            const frostColor = Math.random() < 0.5 ? '#ffffff' : '#e0ffff';
            this.color = frostColor;
        } else {
            this.color = '#a5f2f3';
        }

        // Fall if unsupported
        if (this.canMoveTo(grid, x, y + 1)) {
            grid.moveParticle(x, y, x, y + 1);
        } else {
            // Stack like a solid
            grid.moveParticle(x, y, x, y);
        }
    }

    render(ctx, cellSize) {
        // Draw base ice pixel
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);

        // Add crystalline highlights
        if (Math.random() < 0.3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            const size = cellSize * 0.3;
            const x = this.x * cellSize + Math.random() * (cellSize - size);
            const y = this.y * cellSize + Math.random() * (cellSize - size);
            ctx.fillRect(x, y, size, size);
        }
    }
} 