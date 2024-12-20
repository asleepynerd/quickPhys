import { BaseParticle } from './baseParticle.js';
import { RadiationParticle } from './radiationParticle.js';
import { FireParticle } from './fireParticle.js';
import { BlackHoleParticle } from './blackHoleParticle.js';

export class UraniumParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#44ff44';
    this.mass = 8;
    this.temperature = 40;
    this.meltingPoint = 500;
    this.evaporationPoint = 1000;
    this.decayChance = 0.001;
    this.criticalMass = 4;
    this.reactive = true;
    this.hasReacted = false;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    if (this.hasReacted) return;

    this.updateTemperature(grid, x, y);

    if (this.temperature > 100) {
      this.color = `rgb(${Math.min(255, 68 + (this.temperature - 100))}, 255, 68)`;
    }

    if (this.temperature >= this.evaporationPoint) {
      console.log("Converting to black hole at temperature:", this.temperature);
      grid.setParticle(x, y, new BlackHoleParticle(x, y));
      return;
    } else if (this.temperature >= this.meltingPoint) {
      this.color = '#ff8888';
      this.applyPhysics(grid, x, y);
      return;
    }

    let uraniumCount = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor instanceof UraniumParticle && !neighbor.hasReacted) {
          uraniumCount++;
        }
      }
    }

    if (uraniumCount >= this.criticalMass || Math.random() < this.decayChance) {
      this.nuclearReaction(grid, x, y);
      return;
    }

    if (Math.random() < 0.05) {
      const angle = Math.random() * Math.PI * 2;
      const rx = Math.round(Math.cos(angle));
      const ry = Math.round(Math.sin(angle));
      if (grid.isInBounds(x + rx, y + ry) && !grid.getParticle(x + rx, y + ry)) {
        grid.setParticle(x + rx, y + ry, new RadiationParticle(x + rx, y + ry));
      }
    }

    if (this.temperature < this.meltingPoint) {
      if (this.canMoveTo(grid, x, y + 1)) {
        grid.moveParticle(x, y, x, y + 1);
      } else {
        const direction = Math.random() < 0.5 ? -1 : 1;
        if (this.canMoveTo(grid, x + direction, y + 1)) {
          grid.moveParticle(x, y, x + direction, y + 1);
        } else {
          grid.moveParticle(x, y, x, y);
        }
      }
    } else {
      this.applyPhysics(grid, x, y);
    }
  }

  nuclearReaction(grid, x, y) {
    this.hasReacted = true;

    const radius = 3;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          const newX = x + dx;
          const newY = y + dy;
          if (grid.isInBounds(newX, newY)) {
            const particle = grid.getParticle(newX, newY);
            if (particle) {
              particle.temperature += 500;
              if (particle instanceof UraniumParticle && !particle.hasReacted) {
                particle.nuclearReaction(grid, newX, newY);
              }
            }
            if (Math.random() < 0.5) {
              grid.setParticle(newX, newY, new FireParticle(newX, newY));
            }
          }
        }
      }
    }
    grid.setParticle(x, y, new RadiationParticle(x, y));
  }

  render(ctx, cellSize) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    
    const glow = Math.sin(Date.now() / 200) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(68, 255, 68, ${glow * 0.3})`;
    ctx.fillRect(
      this.x * cellSize - cellSize/2,
      this.y * cellSize - cellSize/2,
      cellSize * 2,
      cellSize * 2
    );
  }

  updateTemperature(grid, x, y) {
    let avgTemp = this.temperature;
    let count = 1;
    let maxTemp = this.temperature;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor) {
          avgTemp += neighbor.temperature;
          count++;
          maxTemp = Math.max(maxTemp, neighbor.temperature);
        }
      }
    }

    this.temperature = (avgTemp / count + maxTemp) / 2;
  }
} 