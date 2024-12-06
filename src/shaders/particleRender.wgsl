struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
    @location(1) type: f32,
    @location(2) uv: vec2f,
};

struct Uniforms {
    viewMatrix: mat4x4f,
    resolution: vec2f,
    time: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vertexMain(
    @location(0) position: vec2f,
    @location(1) color: vec4f,
    @location(2) type: f32,
    @location(3) size: f32,
) -> VertexOutput {
    var output: VertexOutput;
    
    // Calculate vertex position
    let pos = position * size;
    output.position = uniforms.viewMatrix * vec4f(pos, 0.0, 1.0);
    output.color = color;
    output.type = type;
    output.uv = position;
    
    return output;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
    var color = in.color;
    
    // Special rendering for black holes
    if (in.type > 0.5) {
        let dist = length(in.uv);
        let time = uniforms.time;
        
        // Core black hole
        if (dist < 0.3) {
            return vec4f(0.0, 0.0, 0.0, 1.0);
        }
        
        // Accretion disk
        let angle = atan2(in.uv.y, in.uv.x);
        let spiral = sin(angle * 6.0 + time * 2.0) * 0.5 + 0.5;
        let ring = smoothstep(0.3, 0.4, dist) * smoothstep(0.8, 0.7, dist);
        let pulse = sin(time * 3.0) * 0.3 + 0.7;
        
        // Purple glow
        color = vec4f(0.8, 0.0, 1.0, pulse) * ring * spiral;
        
        // Add outer glow
        let glow = smoothstep(1.0, 0.0, dist);
        color += vec4f(0.5, 0.0, 0.8, 0.3) * glow;
    }
    
    return color;
} 