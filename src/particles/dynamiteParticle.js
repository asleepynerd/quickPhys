import { BaseParticle } from './baseParticle.js';
import { FireParticle } from './fireParticle.js';
import { SmokeParticle } from './smokeParticle.js';
import { GunpowderParticle } from './gunpowderParticle.js';

export class DynamiteParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.color = '#ff3333';
        this.flammable = true;
        this.explosionPower = 15;
        this.mass = 3;
        this.fuseTime = 60; 
        this.isLit = false;
    }

    update(grid, x, y) {
        if (this.updated) return;
        this.updated = true;

        this.updateTemperature(grid, x, y);

        
        if (!this.isLit && this.temperature > 100) {
            this.isLit = true;
        }

        
        if (this.isLit) {
            this.fuseTime--;
            
            this.color = this.fuseTime % 2 === 0 ? '#ff3333' : '#ff6666';
            
            
            if (Math.random() < 0.3) {
                const sparkX = x + (Math.random() * 2 - 1);
                const sparkY = y - Math.random();
                if (grid.isInBounds(sparkX, sparkY) && !grid.getParticle(sparkX, sparkY)) {
                    grid.setParticle(sparkX, sparkY, new FireParticle(sparkX, sparkY));
                }
            }

            
            if (this.fuseTime <= 0) {
                this.explode(grid, x, y);
                return;
            }
        }

        
        if (this.canMoveTo(grid, x, y + 1)) {
            grid.moveParticle(x, y, x, y + 1);
        } else {
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (this.canMoveTo(grid, x + dir, y + 1)) {
                grid.moveParticle(x, y, x + dir, y + 1);
            }
        }
    }

    explode(grid, x, y) {
        
        let gunpowderCount = 0;
        for (let dy = -5; dy <= 5; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                const neighbor = grid.getParticle(x + dx, y + dy);
                if (neighbor instanceof GunpowderParticle) {
                    gunpowderCount++;
                    grid.setParticle(x + dx, y + dy, null);
                }
            }
        }

        
        const totalPower = this.explosionPower + (gunpowderCount * 4);

        
        for (let dy = -totalPower; dy <= totalPower; dy++) {
            for (let dx = -totalPower; dx <= totalPower; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= totalPower) {
                    const newX = x + dx;
                    const newY = y + dy;
                    
                    if (grid.isInBounds(newX, newY)) {
                        const particle = grid.getParticle(newX, newY);
                        if (particle) {
                            
                            particle.velocity.x += (dx / distance) * 5;
                            particle.velocity.y += (dy / distance) * 5;
                            particle.temperature += 200;

                            
                            if (particle instanceof DynamiteParticle && !particle.isLit) {
                                particle.isLit = true;
                                particle.fuseTime = Math.min(particle.fuseTime, 5);
                            } else if (particle instanceof GunpowderParticle) {
                                particle.temperature = 500;
                            }
                        }

                        
                        if (Math.random() < 0.6) {
                            grid.setParticle(newX, newY, new FireParticle(newX, newY));
                        } else if (Math.random() < 0.5) {
                            grid.setParticle(newX, newY, new SmokeParticle(newX, newY));
                        }
                    }
                }
            }
        }

        
        const shockwaveRadius = totalPower * 1.5;
        for (let dy = -shockwaveRadius; dy <= shockwaveRadius; dy++) {
            for (let dx = -shockwaveRadius; dx <= shockwaveRadius; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= shockwaveRadius && distance > totalPower) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (grid.isInBounds(newX, newY)) {
                        const particle = grid.getParticle(newX, newY);
                        if (particle) {
                            particle.velocity.x += (dx / distance) * 3;
                            particle.velocity.y += (dy / distance) * 3;
                            particle.temperature += 100;
                        }
                    }
                }
            }
        }

        
        grid.setParticle(x, y, null);
    }

    render(ctx, cellSize) {
        
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * cellSize + cellSize * 0.25,
            this.y * cellSize,
            cellSize * 0.5,
            cellSize
        );

        
        if (this.isLit) {
            ctx.beginPath();
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 2;
            ctx.moveTo(
                (this.x + 0.5) * cellSize,
                this.y * cellSize
            );
            ctx.lineTo(
                (this.x + 0.5) * cellSize,
                (this.y - 0.3) * cellSize
            );
            ctx.stroke();

            
            if (this.fuseTime % 2 === 0) {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(
                    (this.x + 0.5) * cellSize,
                    (this.y - 0.3) * cellSize,
                    cellSize * 0.2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
} 