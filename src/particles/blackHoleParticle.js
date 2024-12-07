import { BaseParticle } from './baseParticle.js';

export class BlackHoleParticle extends BaseParticle {
  constructor(x, y) {
    super(x, y);
    this.color = '#000000';
    this.mass = 100;
    this.radius = 6;
    this.pullStrength = 12;
    this.eventHorizonRadius = 4;
    this.maxRadius = 20;
    this.x = x;
    this.y = y;
    
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.particleTrails = [];
    this.maxTrails = 50;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    this.rotationAngle += 0.15;
    this.pulsePhase += 0.2;

    this.particleTrails = this.particleTrails
      .map(trail => ({
        ...trail,
        progress: trail.progress + 0.1
      }))
      .filter(trail => trail.progress < 1);

    const pullRadius = this.radius * 12;
    for (let dy = -pullRadius; dy <= pullRadius; dy++) {
      for (let dx = -pullRadius; dx <= pullRadius; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const targetX = x + dx;
        const targetY = y + dy;
        
        if (!grid.isInBounds(targetX, targetY)) continue;
        
        const particle = grid.getParticle(targetX, targetY);
        if (particle && !(particle instanceof BlackHoleParticle)) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance <= this.eventHorizonRadius * 1.5) {
            if (this.particleTrails.length < this.maxTrails) {
              this.particleTrails.push({
                startX: targetX,
                startY: targetY,
                endX: x,
                endY: y,
                color: particle.color,
                progress: 0
              });
            }
            
            grid.setParticle(targetX, targetY, null);
            this.mass += particle.mass;
            this.radius = Math.min(this.maxRadius, 6 + Math.log(this.mass) * 0.5);
            this.eventHorizonRadius = this.radius * 0.6;
            this.pullStrength = Math.min(20, 12 + Math.log(this.mass) * 0.4);
          } else if (distance <= this.eventHorizonRadius * 3) {
            if (Math.random() < 0.3) { 
              if (this.particleTrails.length < this.maxTrails) {
                this.particleTrails.push({
                  startX: targetX,
                  startY: targetY,
                  endX: x,
                  endY: y,
                  color: particle.color,
                  progress: 0
                });
              }
              grid.setParticle(targetX, targetY, null);
              this.mass += particle.mass * 0.5;
            }
          } else if (distance <= pullRadius) {
            const forceFalloff = Math.pow(1 - distance / pullRadius, 2);
            const force = (this.pullStrength * forceFalloff);
            
            const angle = Math.atan2(dy, dx);
            const spiralFactor = 1 - (distance / pullRadius);
            const spiralAngle = angle + this.rotationAngle * spiralFactor * 2;
            
            const moveX = Math.cos(spiralAngle) * force;
            const moveY = Math.sin(spiralAngle) * force;
            
            const positions = [
              { x: Math.round(targetX - moveX), y: Math.round(targetY - moveY) },
              { x: Math.round(targetX - moveX * 0.5), y: Math.round(targetY - moveY * 0.5) },
              { x: targetX + (x > targetX ? 1 : -1), y: targetY + (y > targetY ? 1 : -1) }
            ];

            let moved = false;
            for (const pos of positions) {
              if (grid.isInBounds(pos.x, pos.y) && grid.getParticle(pos.x, pos.y) === null) {
                grid.moveParticle(targetX, targetY, pos.x, pos.y);
                moved = true;
                break;
              }
            }

            if (!moved && distance < pullRadius * 0.3 && Math.random() < 0.1) {
              if (this.particleTrails.length < this.maxTrails) {
                this.particleTrails.push({
                  startX: targetX,
                  startY: targetY,
                  endX: x,
                  endY: y,
                  color: particle.color,
                  progress: 0
                });
              }
              grid.setParticle(targetX, targetY, null);
              this.mass += particle.mass * 0.25;
            }
            
            if (particle.velocity) {
              particle.velocity.x -= moveX;
              particle.velocity.y -= moveY;
            }
          }
        }
      }
    }

    grid.moveParticle(x, y, x, y);
  }

  render(ctx, cellSize) {
    ctx.save();
    this.particleTrails.forEach(trail => {
      const progress = trail.progress;
      const x = trail.startX + (trail.endX - trail.startX) * progress;
      const y = trail.startY + (trail.endY - trail.startY) * progress;
      
      ctx.fillStyle = `rgba(147, 0, 211, ${1 - progress})`;
      ctx.fillRect(
        (x + 0.5) * cellSize - cellSize/2,
        (y + 0.5) * cellSize - cellSize/2,
        cellSize,
        cellSize
      );
    });

    const pulseIntensity = 0.5 + Math.sin(this.pulsePhase) * 0.3;
    const currentRadius = Math.ceil(this.radius * pulseIntensity);

    for (let dy = -currentRadius; dy <= currentRadius; dy++) {
      for (let dx = -currentRadius; dx <= currentRadius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= currentRadius) {
          const px = this.x * cellSize + dx * cellSize;
          const py = this.y * cellSize + dy * cellSize;
          
          if (distance < this.eventHorizonRadius) {
            ctx.fillStyle = '#000000';
          } else {
            const alpha = (1 - distance/currentRadius) * pulseIntensity;
            ctx.fillStyle = `rgba(147, 0, 211, ${alpha})`;
          }
          
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }

    ctx.restore();
  }
} 