import { Particle } from './particle.js';
import { BlackHole } from './blackHole.js';
import { Vector } from './vector.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.blackHoles = [];
    this.resizeCanvas();
    this.setupEventListeners();
    
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      ));
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth - 40;
    this.canvas.height = window.innerHeight - 40;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.blackHoles.push(new BlackHole(x, y));
    });
  }

  update() {
    this.particles.forEach(particle => {
      this.blackHoles.forEach(blackHole => {
        const force = blackHole.calculateGravitationalForce(particle);
        particle.applyForce(force);
      });
      
      particle.update();
      
      if (particle.position.x < 0) particle.position.x = this.canvas.width;
      if (particle.position.x > this.canvas.width) particle.position.x = 0;
      if (particle.position.y < 0) particle.position.y = this.canvas.height;
      if (particle.position.y > this.canvas.height) particle.position.y = 0;
    });
  }

  draw() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => particle.draw(this.ctx));
    this.blackHoles.forEach(blackHole => blackHole.draw(this.ctx));
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
  }
}