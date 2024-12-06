import { SandParticle } from './sandParticle.js';
import { WaterParticle } from './waterParticle.js';
import { WallParticle } from './wallParticle.js';
import { AcidParticle } from './acidParticle.js';
import { LifeParticle } from './lifeParticle.js';
import { SaltParticle } from './saltParticle.js';
import { GunpowderParticle } from './gunpowderParticle.js';
import { FireParticle } from './fireParticle.js';
import { SmokeParticle } from './smokeParticle.js';
import { MetalParticle } from './metalParticle.js';
import { SteamParticle } from './steamParticle.js';
import { BlackHoleParticle } from './blackHoleParticle.js';
import { UraniumParticle } from './uraniumParticle.js';
import { RadiationParticle } from './radiationParticle.js';
import { DustParticle } from './dustParticle.js';

export class ParticleFactory {
  create(x, y, type) {
    switch (type) {
      case 'sand':
        return new SandParticle(x, y);
      case 'water':
        return new WaterParticle(x, y);
      case 'wall':
        return new WallParticle(x, y);
      case 'acid':
        return new AcidParticle(x, y);
      case 'life':
        return new LifeParticle(x, y);
      case 'salt':
        return new SaltParticle(x, y);
      case 'gunpowder':
        return new GunpowderParticle(x, y);
      case 'fire':
        return new FireParticle(x, y);
      case 'smoke':
        return new SmokeParticle(x, y);
      case 'metal':
        return new MetalParticle(x, y);
      case 'steam':
        return new SteamParticle(x, y);
      case 'blackhole':
        return new BlackHoleParticle(x, y);
      case 'uranium':
        return new UraniumParticle(x, y);
      case 'radiation':
        return new RadiationParticle(x, y);
      case 'dust':
        return new DustParticle(x, y);
      default:
        return null;
    }
  }
}