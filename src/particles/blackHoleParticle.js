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
    
    // Visual effects
    this.rotationAngle = 0;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.particleTrails = [];
    this.maxTrails = 50;
    this.glowSize = 1;
  }

  update(grid, x, y) {
    if (this.updated) return;
    this.updated = true;

    // Update visual effects
    this.rotationAngle += 0.15;
    this.pulsePhase += 0.2;
    this.glowSize = 1 + Math.sin(this.pulsePhase) * 0.4;

    // Update particle trails
    this.particleTrails = this.particleTrails
      .map(trail => ({
        ...trail,
        progress: trail.progress + 0.1
      }))
      .filter(trail => trail.progress < 1);

    // Pull in nearby particles with stronger effect
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
          
          // Consume particles that get too close
          if (distance <= this.eventHorizonRadius * 1.5) {
            // Add particle trail effect before consuming
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
            
            // Consume the particle
            grid.setParticle(targetX, targetY, null);
            this.mass += particle.mass;
            this.radius = Math.min(this.maxRadius, 6 + Math.log(this.mass) * 0.5);
            this.eventHorizonRadius = this.radius * 0.6;
            this.pullStrength = Math.min(20, 12 + Math.log(this.mass) * 0.4);
          } else if (distance <= this.eventHorizonRadius * 3) {
            // Strong pull zone - particles get consumed quickly
            if (Math.random() < 0.3) { // 30% chance to be consumed per frame
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
            // Normal gravitational pull zone
            const forceFalloff = Math.pow(1 - distance / pullRadius, 2);
            const force = (this.pullStrength * forceFalloff);
            
            const angle = Math.atan2(dy, dx);
            const spiralFactor = 1 - (distance / pullRadius);
            const spiralAngle = angle + this.rotationAngle * spiralFactor * 2;
            
            const moveX = Math.cos(spiralAngle) * force;
            const moveY = Math.sin(spiralAngle) * force;
            
            // Try multiple positions to prevent sticking
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

            // If particle couldn't move and is close enough, consider consuming it
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
    const centerX = (this.x + 0.5) * cellSize;
    const centerY = (this.y + 0.5) * cellSize;

    // Draw particle trails
    ctx.save();
    this.particleTrails.forEach(trail => {
      const progress = trail.progress;
      const x = trail.startX + (trail.endX - trail.startX) * progress;
      const y = trail.startY + (trail.endY - trail.startY) * progress;
      
      ctx.fillStyle = trail.color;
      ctx.globalAlpha = (1 - progress) * 2;
      ctx.beginPath();
      ctx.arc(
        (x + 0.5) * cellSize,
        (y + 0.5) * cellSize,
        cellSize * 0.7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    ctx.restore();

    // Draw intense outer glow
    ctx.save();
    const glowRadius = this.radius * cellSize * this.glowSize;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    
    const pulseIntensity = 0.9 + Math.sin(this.pulsePhase * 2) * 0.1;
    gradient.addColorStop(0, `rgba(255, 100, 255, ${pulseIntensity})`);     // Bright pink core
    gradient.addColorStop(0.2, `rgba(200, 0, 255, ${0.9 * pulseIntensity})`); // Bright purple
    gradient.addColorStop(0.4, `rgba(180, 0, 255, ${0.7 * pulseIntensity})`);
    gradient.addColorStop(0.7, `rgba(147, 0, 211, ${0.5 * pulseIntensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw event horizon
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(centerX, centerY, this.eventHorizonRadius * cellSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw dynamic accretion disk
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 150, 255, ${pulseIntensity})`; // Brighter pink
    ctx.lineWidth = 3;
    
    const numSpirals = 8;
    for (let i = 0; i < numSpirals; i++) {
      const angle = this.rotationAngle + (Math.PI * 2 / numSpirals) * i;
      const waveOffset = Math.sin(this.pulsePhase + i) * 2;
      const spiralStart = cellSize * (1.5 + waveOffset);
      const spiralEnd = glowRadius * (0.8 + Math.cos(this.pulsePhase + i) * 0.2);
      
      ctx.moveTo(
        centerX + Math.cos(angle) * spiralStart,
        centerY + Math.sin(angle) * spiralStart
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * spiralEnd,
        centerY + Math.sin(angle) * spiralEnd
      );
    }
    ctx.stroke();

    // Add extra outer glow rings
    const numRings = 2;
    for (let i = 0; i < numRings; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 200, 255, ${0.3 * pulseIntensity * (1 - i/numRings)})`;
      ctx.lineWidth = 2 - i;
      ctx.arc(centerX, centerY, glowRadius * (1.1 + i * 0.1), 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
} 