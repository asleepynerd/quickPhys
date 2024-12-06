export class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height).fill(null);
    this.updated = new Set();
  }

  getIndex(x, y) {
    return y * this.width + x;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getParticle(x, y) {
    if (!this.isInBounds(x, y)) return null;
    return this.cells[this.getIndex(x, y)];
  }

  setParticle(x, y, particle) {
    if (!this.isInBounds(x, y)) return;
    const index = this.getIndex(x, y);
    this.cells[index] = particle;
    if (particle) {
      particle.x = x;
      particle.y = y;
      this.updated.add(index);
    }
  }

  moveParticle(fromX, fromY, toX, toY) {
    if (!this.isInBounds(fromX, fromY) || !this.isInBounds(toX, toY)) return false;
    const particle = this.getParticle(fromX, fromY);
    if (!particle) return false;
    
    this.setParticle(fromX, fromY, null);
    this.setParticle(toX, toY, particle);
    return true;
  }

  update() {
    const updatedCopy = new Set(this.updated);
    this.updated.clear();

    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const index = this.getIndex(x, y);
        if (!updatedCopy.has(index)) {
          const particle = this.cells[index];
          if (particle) {
            particle.update(this, x, y);
          }
        }
      }
    }
  }

  render(ctx) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const particle = this.getParticle(x, y);
        if (particle) {
          particle.render(ctx);
        }
      }
    }
  }
}