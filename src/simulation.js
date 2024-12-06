import { World } from './world.js';
import { CELL_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from './constants.js';
import { ParticleFactory } from './particles/particleFactory.js';

export class Simulation {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.world = new World();
    this.isDrawing = false;
    this.isPaused = false;
    this.brushSize = 1;
    this.particleFactory = new ParticleFactory();
    
    this.setupCanvas();
    this.setupControls();
    this.setupEvents();
  }

  setupCanvas() {
    this.canvas.width = WORLD_WIDTH * CELL_SIZE;
    this.canvas.height = WORLD_HEIGHT * CELL_SIZE;
    this.ctx.imageSmoothingEnabled = false;
  }

  setupControls() {
    const controls = document.getElementById('controls');
    
    controls.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' && e.target.dataset.type) {
        document.querySelectorAll('button[data-type]').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });

    const brushSlider = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    
    brushSlider.addEventListener('input', (e) => {
      this.brushSize = parseInt(e.target.value);
      brushSizeValue.textContent = this.brushSize;
    });

    document.getElementById('clear-all').addEventListener('click', () => {
      this.world.clear();
    });

    document.getElementById('pause-button').addEventListener('click', (e) => {
      this.isPaused = !this.isPaused;
      e.target.textContent = this.isPaused ? 'Resume' : 'Pause';
    });
  }

  setupEvents() {
    const getGridPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      return { x, y };
    };

    const drawAtPosition = (pos) => {
      const type = document.querySelector('button[data-type].active').dataset.type;
      const halfBrush = Math.floor(this.brushSize / 2);
      
      for (let dy = -halfBrush; dy <= halfBrush; dy++) {
        for (let dx = -halfBrush; dx <= halfBrush; dx++) {
          if (dx * dx + dy * dy <= halfBrush * halfBrush) {
            this.world.setCell(pos.x + dx, pos.y + dy, type);
          }
        }
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      drawAtPosition(getGridPos(e));
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isDrawing) return;
      drawAtPosition(getGridPos(e));
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDrawing = false;
    });
  }

  render() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const cell = this.world.getCell(x, y);
        if (cell) {
          this.ctx.fillStyle = cell.color;
          this.ctx.fillRect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      }
    }
  }

  update() {
    if (!this.isPaused) {
      this.world.update();
    }
  }

  start() {
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}