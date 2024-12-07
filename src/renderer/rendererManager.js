import { WebGPURenderer } from "./webgpumanager.js";
import { WORLD_WIDTH, WORLD_HEIGHT } from "../constants.js";

export class RendererManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.webGPURenderer = null;
    this.isWebGPU = false;
    this.cellSize = Math.min(
      canvas.width / WORLD_WIDTH,
      canvas.height / WORLD_HEIGHT
    );
    if (navigator.gpu) {
      this.initWebGPU();
    } else {
      console.log("WebGPU not available, using Canvas2D");
    }
  }

  async initWebGPU() {
    try {
      this.webGPURenderer = new WebGPURenderer(this.canvas);
      await this.webGPURenderer.initialize();
      this.isWebGPU = true;
      console.log("WebGPU initialized successfully");
    } catch (error) {
      console.log("WebGPU initialization failed, using Canvas2D:", error);
      this.isWebGPU = false;
      this.webGPURenderer = null;
    }
  }

  render(world, time) {
    if (!this.isWebGPU || !this.webGPURenderer) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < world.grid.length; i++) {
        const particle = world.grid[i];
        if (!particle) continue;

        particle.x = i % WORLD_WIDTH;
        particle.y = Math.floor(i / WORLD_WIDTH);
        particle.render(this.ctx, this.cellSize);
      }
      return;
    }

    const particles = [];
    const blackHoles = [];

    for (let i = 0; i < world.grid.length; i++) {
      const particle = world.grid[i];
      if (!particle) continue;

      const x = i % WORLD_WIDTH;
      const y = Math.floor(i / WORLD_WIDTH);

      if (particle.constructor.name === "BlackHoleParticle") {
        blackHoles.push({
          position: { x, y },
          mass: particle.mass,
          radius: particle.radius,
          pullStrength: particle.pullStrength,
          rotationAngle: particle.rotationAngle,
        });
      } else {
        particles.push({
          position: { x, y },
          velocity: particle.velocity,
          color: this.parseColor(particle.color),
          mass: particle.mass || 1,
          type: 0,
        });
      }
    }

    this.webGPURenderer.updateParticles(particles, blackHoles);
    this.webGPURenderer.render(time);
  }

  parseColor(color) {
    if (color.startsWith("rgba")) {
      const values = color.match(/[\d.]+/g);
      return {
        r: parseInt(values[0]) / 255,
        g: parseInt(values[1]) / 255,
        b: parseInt(values[2]) / 255,
        a: parseFloat(values[3]),
      };
    }

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      return {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0,
      };
    }

    return { r: 1, g: 1, b: 1, a: 1 };
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.cellSize = Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT);
    if (this.isWebGPU && this.webGPURenderer && this.webGPURenderer.resize) {
      this.webGPURenderer.resize(width, height);
    }
  }
}
