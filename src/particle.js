import { Vector } from './vector.js';

export class Particle {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );
    this.acceleration = new Vector(0, 0);
    this.mass = 1;
  }

  applyForce(force) {
    const f = force.divide(this.mass);
    this.acceleration = this.acceleration.add(f);
  }

  update() {
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(0.99);
    this.position = this.position.add(this.velocity);
    this.acceleration = this.acceleration.multiply(0);
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}