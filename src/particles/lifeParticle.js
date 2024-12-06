import { BaseParticle } from './baseParticle.js';

export class LifeParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#00ff00';
    this.nextState = null;
  }

  countNeighbors(grid, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor instanceof LifeParticle) count++;
      }
    }
    return count;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    const neighbors = this.countNeighbors(grid, x, y);
    
    // Conway's Game of Life rules
    if (neighbors < 2 || neighbors > 3) {
      this.nextState = false; // Die
    } else {
      this.nextState = true; // Stay alive
    }

    // Empty cells with exactly 3 neighbors become alive
    if (neighbors === 3) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const pos = { x: x + dx, y: y + dy };
          if (grid.isInBounds(pos.x, pos.y) && !grid.getParticle(pos.x, pos.y)) {
            grid.setParticle(pos.x, pos.y, new LifeParticle(pos.x, pos.y));
          }
        }
      }
    }
  }

  postUpdate(grid, x, y) {
    if (this.nextState === false) {
      grid.setParticle(x, y, null);
    }
  }
}