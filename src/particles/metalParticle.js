import { BaseParticle } from './baseParticle.js';

export class MetalParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#808080';
    this.conductive = true;
    this.mass = 3;
    this.meltingPoint = 800;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.updateTemperature(grid, x, y);

    // Melt if temperature is too high
    if (this.temperature > this.meltingPoint) {
      this.color = '#c0c0c0';
      this.applyPhysics(grid, x, y);
    } else {
      // Metal stays in place unless melted
      grid.moveParticle(x, y, x, y);
    }
  }
} 