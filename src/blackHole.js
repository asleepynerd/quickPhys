import { Vector } from './vector.js';

export class BlackHole {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.mass = 1000;
    this.radius = 20;
  }

  calculateGravitationalForce(particle) {
    const direction = this.position.subtract(particle.position);
    const distance = Math.max(direction.magnitude(), 100);
    const strength = (this.mass * particle.mass) / (distance * distance);
    return direction.normalize().multiply(strength);
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(
      this.position.x, this.position.y, 0,
      this.position.x, this.position.y, this.radius
    );
    
    gradient.addColorStop(0, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}