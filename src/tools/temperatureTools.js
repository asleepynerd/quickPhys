export class TemperatureTools {
  static cool(grid, x, y, radius) {
    this.applyTemperatureChange(grid, x, y, radius, -20);
  }

  static heat(grid, x, y, radius) {
    this.applyTemperatureChange(grid, x, y, radius, 20);
  }

  static applyTemperatureChange(grid, centerX, centerY, radius, amount) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        
        // Check if within circular brush
        if (dx * dx + dy * dy > radius * radius) continue;
        
        const particle = grid.getParticle(x, y);
        if (particle) {
          // Apply temperature change with falloff based on distance
          const distance = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 - (distance / radius);
          particle.temperature += amount * falloff;
          
          // Add visual feedback
          if (amount < 0) {
            particle.color = this.adjustColorForCooling(particle.color);
          }
        }
      }
    }
  }

  static adjustColorForCooling(baseColor) {
    // Add a slight blue tint to show cooling effect
    try {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);

      const newR = Math.max(0, r - 10);
      const newG = Math.max(0, g - 5);
      const newB = Math.min(255, b + 10);

      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch {
      // If color parsing fails, return original color
      return baseColor;
    }
  }
} 