struct Particle {
    position: vec2f,
    velocity: vec2f,
    color: vec4f,
    mass: f32,
    type: u32, // 0: normal, 1: black hole
    lifetime: f32,
};

struct BlackHole {
    position: vec2f,
    mass: f32,
    radius: f32,
    pullStrength: f32,
    rotationAngle: f32,
};

struct SimParams {
    deltaTime: f32,
    time: f32,
    numParticles: u32,
    numBlackHoles: u32,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read> blackHoles: array<BlackHole>;
@group(0) @binding(2) var<uniform> params: SimParams;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID: vec3<u32>) {
    let index = GlobalInvocationID.x;
    if (index >= params.numParticles) {
        return;
    }

    var particle = particles[index];
    
    // Skip black holes in physics computation
    if (particle.type == 1u) {
        return;
    }

    // Apply black hole effects
    for (var i = 0u; i < params.numBlackHoles; i++) {
        let blackHole = blackHoles[i];
        let toBlackHole = blackHole.position - particle.position;
        let distance = length(toBlackHole);
        
        // Event horizon check
        if (distance < blackHole.radius) {
            // Particle is consumed
            particle.lifetime = 0.0;
            continue;
        }

        // Gravitational force
        let force = blackHole.pullStrength * blackHole.mass * particle.mass / (distance * distance);
        
        // Add spiral effect
        let angle = atan2(toBlackHole.y, toBlackHole.x);
        let spiralAngle = angle + blackHole.rotationAngle * (1.0 - distance / (blackHole.radius * 8.0));
        let spiralDir = vec2f(cos(spiralAngle), sin(spiralAngle));
        
        particle.velocity += spiralDir * force * params.deltaTime;
    }

    // Update position
    particle.position += particle.velocity * params.deltaTime;
    
    // Apply drag
    particle.velocity *= 0.99;

    // Update particle
    particles[index] = particle;
} 