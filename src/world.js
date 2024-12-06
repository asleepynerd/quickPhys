import { WORLD_WIDTH, WORLD_HEIGHT } from './constants.js';
import { ParticleFactory } from './particles/particleFactory.js';
import { LifeParticle } from './particles/lifeParticle.js';
import { TemperatureTools } from './tools/temperatureTools.js';

export class World {
  constructor() {
    this.grid = new Array(WORLD_WIDTH * WORLD_HEIGHT).fill(null);
    this.nextGrid = new Array(WORLD_WIDTH * WORLD_HEIGHT).fill(null);
    this.particleFactory = new ParticleFactory();
  }

  getIndex(x, y) {
    return y * WORLD_WIDTH + x;
  }

  isInBounds(x, y) {
    return x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT;
  }

  getCell(x, y) {
    if (!this.isInBounds(x, y)) return null;
    return this.grid[this.getIndex(x, y)];
  }

  getParticle(x, y) {
    return this.getCell(x, y);
  }

  setCell(x, y, type) {
    if (!this.isInBounds(x, y)) return;
    const index = this.getIndex(x, y);
    if (type === 'cool' || type === 'heat') {
      const brushSize = document.getElementById('brush-size').value;
      if (type === 'cool') {
        TemperatureTools.cool(this, x, y, parseInt(brushSize));
      } else {
        TemperatureTools.heat(this, x, y, parseInt(brushSize));
      }
      return;
    }
    const particle = type === 'erase' ? null : this.particleFactory.create(x, y, type);
    this.grid[index] = particle;
    this.nextGrid[index] = particle; 
  }

  setParticle(x, y, particle) {
    if (!this.isInBounds(x, y)) return;
    const index = this.getIndex(x, y);
    this.grid[index] = particle;
    this.nextGrid[index] = particle;
  }

  moveParticle(fromX, fromY, toX, toY) {
    if (!this.isInBounds(fromX, fromY) || !this.isInBounds(toX, toY)) return false;
    const particle = this.getParticle(fromX, fromY);
    if (!particle) return false;
    
    const fromIndex = this.getIndex(fromX, fromY);
    const toIndex = this.getIndex(toX, toY);
    
    this.nextGrid[fromIndex] = null;
    this.nextGrid[toIndex] = particle;
    
    return true;
  }

  clear() {
    this.grid.fill(null);
    this.nextGrid.fill(null);
  }

  update() {
    
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i]) {
        this.grid[i].updated = false;
      }
      
      this.nextGrid[i] = this.grid[i];
    }

    
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const cell = this.getCell(x, y);
        if (cell) {
          cell.update(this, x, y);
        }
      }
    }

    
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const cell = this.getCell(x, y);
        if (cell instanceof LifeParticle) {
          cell.postUpdate(this, x, y);
        }
      }
    }

    
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }
}