class Particle {
  constructor(color) {
    this.color = color;
  }
}

class Sand extends Particle {
  constructor() {
    super('#e6c34c');
  }

  update(world, x, y) {
    if (world.moveCell(x, y, x, y + 1)) return;
    
    const dir = Math.random() < 0.5 ? -1 : 1;
    if (world.moveCell(x, y, x + dir, y + 1)) return;
    if (world.moveCell(x, y, x - dir, y + 1)) return;
    
    world.moveCell(x, y, x, y);
  }
}

class Water extends Particle {
  constructor() {
    super('#4286f4');
  }

  update(world, x, y) {
    if (world.moveCell(x, y, x, y + 1)) return;
    
    const dir = Math.random() < 0.5 ? -1 : 1;
    if (world.moveCell(x, y, x + dir, y)) return;
    if (world.moveCell(x, y, x - dir, y)) return;
    
    world.moveCell(x, y, x, y);
  }
}

class Wall extends Particle {
  constructor() {
    super('#808080');
  }

  update(world, x, y) {
    world.moveCell(x, y, x, y);
  }
}

export function createParticle(type) {
  switch (type) {
    case 'sand': return new Sand();
    case 'water': return new Water();
    case 'wall': return new Wall();
    default: return null;
  }
}