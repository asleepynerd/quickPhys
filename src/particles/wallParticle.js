import { BaseParticle } from './baseParticle.js';

export class WallParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#888888';
  }

  update(grid, x, y) {
    
  }
}