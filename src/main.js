import { World } from './world.js';
import { RendererManager } from './renderer/rendererManager.js';
import { WORLD_WIDTH, WORLD_HEIGHT } from './constants.js';

const canvas = document.getElementById('canvas');
const renderer = new RendererManager(canvas);
const world = new World(renderer);

// Handle window resize
function resize() {
    // Calculate size while maintaining aspect ratio
    const aspectRatio = WORLD_WIDTH / WORLD_HEIGHT;
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 40;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    renderer.resize(width, height);
}

window.addEventListener('resize', resize);
resize();

// Handle mouse input
let isMouseDown = false;
let currentType = 'sand';
let isPaused = false;
let mouseX = 0;
let mouseY = 0;
const tempDisplay = document.getElementById('temperature-display');

// Setup brush size display
const brushSlider = document.getElementById('brush-size');
const brushSizeDisplay = document.getElementById('brush-size-value');
brushSlider.addEventListener('input', () => {
    brushSizeDisplay.textContent = brushSlider.value;
});

// Convert mouse coordinates to world coordinates
function getWorldCoordinates(mouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = mouseEvent.clientX - rect.left;
    const mouseY = mouseEvent.clientY - rect.top;
    
    // Convert to world coordinates
    const worldX = Math.floor((mouseX / canvas.width) * WORLD_WIDTH);
    const worldY = Math.floor((mouseY / canvas.height) * WORLD_HEIGHT);
    
    return { x: worldX, y: worldY };
}

document.querySelectorAll('#controls button[data-type]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('button.active')?.classList.remove('active');
        button.classList.add('active');
        currentType = button.dataset.type;
    });
});

document.getElementById('clear-all').addEventListener('click', () => world.clear());
document.getElementById('pause-button').addEventListener('click', (e) => {
    isPaused = !isPaused;
    e.target.textContent = isPaused ? 'Resume' : 'Pause';
});

canvas.addEventListener('mousedown', () => isMouseDown = true);
canvas.addEventListener('mouseup', () => isMouseDown = false);
canvas.addEventListener('mouseleave', () => isMouseDown = false);

canvas.addEventListener('mousemove', (e) => {
    const worldPos = getWorldCoordinates(e);
    mouseX = worldPos.x;
    mouseY = worldPos.y;
    
    // Update temperature display
    const particle = world.getCell(mouseX, mouseY);
    if (particle) {
        const temp = Math.round(particle.temperature);
        const color = getTemperatureColor(temp);
        tempDisplay.style.color = color;
        tempDisplay.textContent = `Temperature: ${temp}°C`;
    } else {
        tempDisplay.style.color = 'white';
        tempDisplay.textContent = 'Temperature: --°C';
    }

    if (isMouseDown) {
        handleMouseInput(e);
    }
});

canvas.addEventListener('mousedown', handleMouseInput);

function handleMouseInput(e) {
    const worldPos = getWorldCoordinates(e);
    const brushSize = parseInt(document.getElementById('brush-size').value);
    
    for (let dy = -brushSize/2; dy < brushSize/2; dy++) {
        for (let dx = -brushSize/2; dx < brushSize/2; dx++) {
            world.setCell(
                Math.floor(worldPos.x + dx),
                Math.floor(worldPos.y + dy),
                currentType
            );
        }
    }
}

// Game loop
function gameLoop() {
    if (!isPaused) {
        world.update();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Helper function to get temperature color
function getTemperatureColor(temp) {
    if (temp < 0) {
        return '#00ffff'; // Cyan for cold
    } else if (temp > 100) {
        const intensity = Math.min(255, Math.floor((temp - 100) * 2));
        return `rgb(255, ${255 - intensity}, 0)`; // Yellow to red for hot
    }
    return 'white'; // Normal temperature
}