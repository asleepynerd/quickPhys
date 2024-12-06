export class BaseParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#ffffff';
    this.updated = false;
    
    // Physics properties
    this.velocity = { x: 0, y: 0 };
    this.temperature = 20; // Room temperature in Celsius
    this.mass = 1;
    this.flammable = false;
    this.conductive = false;
    this.reactive = false;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;
    
    this.updateTemperature(grid, x, y);
    this.applyPhysics(grid, x, y);
  }

  updateTemperature(grid, x, y) {
    // Temperature diffusion
    let avgTemp = this.temperature;
    let count = 1;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = grid.getParticle(x + dx, y + dy);
        if (neighbor) {
          avgTemp += neighbor.temperature;
          count++;
        }
      }
    }

    this.temperature = avgTemp / count;

    // Temperature affects color
    if (this.temperature > 100) {
      const intensity = Math.min(255, (this.temperature - 100) * 2);
      this.color = this.adjustColorForTemperature(this.color, intensity);
    }
  }

  adjustColorForTemperature(baseColor, intensity) {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Add red/orange tint based on temperature
    const newR = Math.min(255, r + intensity);
    const newG = Math.min(255, g + intensity / 2);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  applyPhysics(grid, x, y) {
    // Apply gravity
    this.velocity.y += 0.2;

    // Apply air resistance
    this.velocity.x *= 0.98;
    this.velocity.y *= 0.98;

    // Calculate new position
    const newX = Math.round(x + this.velocity.x);
    const newY = Math.round(y + this.velocity.y);

    // Check if we can move to the new position
    if (this.canMoveTo(grid, newX, newY)) {
      return grid.moveParticle(x, y, newX, newY);
    }

    // Handle collisions
    this.velocity.x *= -0.5;
    this.velocity.y *= -0.5;
    return false;
  }

  canMoveTo(grid, x, y) {
    if (!grid.isInBounds(x, y)) return false;
    const particle = grid.getParticle(x, y);
    return particle === null;
  }

  render(ctx, cellSize) {
    ctx.fillStyle = this.color;
    
    // Add temperature visualization
    if (this.temperature < 0) {
      ctx.fillStyle = this.adjustColorForTemperature(this.color, this.temperature, true);
    } else if (this.temperature > 100) {
      ctx.fillStyle = this.adjustColorForTemperature(this.color, this.temperature, false);
    }
    
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }

  adjustColorForTemperature(baseColor, temp, isCold) {
    try {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);

      if (isCold) {
        // Add blue tint for cold
        const intensity = Math.min(255, Math.abs(temp) / 2);
        return `#${Math.max(0, r - intensity).toString(16).padStart(2, '0')}${
          Math.max(0, g - intensity / 2).toString(16).padStart(2, '0')}${
          Math.min(255, b + intensity).toString(16).padStart(2, '0')}`;
      } else {
        // Add red tint for hot
        const intensity = Math.min(255, (temp - 100) / 2);
        return `#${Math.min(255, r + intensity).toString(16).padStart(2, '0')}${
          Math.max(0, g - intensity / 2).toString(16).padStart(2, '0')}${
          Math.max(0, b - intensity).toString(16).padStart(2, '0')}`;
      }
    } catch {
      return baseColor;
    }
  }
}