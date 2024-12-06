export class WebGPURenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.device = null;
        this.context = null;
        this.particleBindGroup = null;
        this.computePipeline = null;
        this.renderPipeline = null;
        this.particleBuffer = null;
        this.blackHoleBuffer = null;
        this.uniformBuffer = null;
        this.maxParticles = 100000;
        this.vertexBuffer = null;
    }

    async initialize() {
        if (!navigator.gpu) {
            throw new Error('WebGPU not supported');
        }

        const adapter = await navigator.gpu.requestAdapter();
        this.device = await adapter.requestDevice();
        this.context = this.canvas.getContext('webgpu');

        const format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format,
            alphaMode: 'premultiplied',
        });

        await this.createBuffers();
        await this.createPipelines(format);
    }

    async createBuffers() {
        
        this.particleBuffer = this.device.createBuffer({
            size: this.maxParticles * 32, 
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        
        this.blackHoleBuffer = this.device.createBuffer({
            size: 100 * 24, 
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        
        this.uniformBuffer = this.device.createBuffer({
            size: 32, 
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        
        const vertices = new Float32Array([
            -1, -1,  
             1, -1,
             1,  1,
            -1, -1,  
             1,  1,
            -1,  1,
        ]);

        this.vertexBuffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(this.vertexBuffer.getMappedRange()).set(vertices);
        this.vertexBuffer.unmap();
    }

    async createPipelines(format) {
        
        const computeShaderModule = this.device.createShaderModule({
            label: 'Particle compute shader',
            code: await fetch('/src/shaders/particleCompute.wgsl').then(r => r.text())
        });

        const renderShaderModule = this.device.createShaderModule({
            label: 'Particle render shader',
            code: await fetch('/src/shaders/particleRender.wgsl').then(r => r.text())
        });

        
        const vertexBufferLayout = {
            arrayStride: 8, 
            attributes: [{
                format: 'float32x2',
                offset: 0,
                shaderLocation: 0,
            }],
        };

        
        this.computePipeline = this.device.createComputePipeline({
            layout: 'auto',
            compute: {
                module: computeShaderModule,
                entryPoint: 'main',
            }
        });

        
        this.renderPipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: renderShaderModule,
                entryPoint: 'vertexMain',
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: renderShaderModule,
                entryPoint: 'fragmentMain',
                targets: [{
                    format,
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                        },
                        alpha: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                        }
                    }
                }]
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        
        this.bindGroup = this.device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.particleBuffer }
                },
                {
                    binding: 1,
                    resource: { buffer: this.blackHoleBuffer }
                },
                {
                    binding: 2,
                    resource: { buffer: this.uniformBuffer }
                }
            ]
        });
    }

    updateParticles(particles, blackHoles) {
        
        const particleData = new Float32Array(particles.length * 8);
        particles.forEach((p, i) => {
            const idx = i * 8;
            particleData[idx] = p.position.x;
            particleData[idx + 1] = p.position.y;
            particleData[idx + 2] = p.velocity.x;
            particleData[idx + 3] = p.velocity.y;
            particleData[idx + 4] = p.color.r;
            particleData[idx + 5] = p.color.g;
            particleData[idx + 6] = p.color.b;
            particleData[idx + 7] = p.color.a;
        });
        this.device.queue.writeBuffer(this.particleBuffer, 0, particleData);

        
        const blackHoleData = new Float32Array(blackHoles.length * 6);
        blackHoles.forEach((bh, i) => {
            const idx = i * 6;
            blackHoleData[idx] = bh.position.x;
            blackHoleData[idx + 1] = bh.position.y;
            blackHoleData[idx + 2] = bh.mass;
            blackHoleData[idx + 3] = bh.radius;
            blackHoleData[idx + 4] = bh.pullStrength;
            blackHoleData[idx + 5] = bh.rotationAngle;
        });
        this.device.queue.writeBuffer(this.blackHoleBuffer, 0, blackHoleData);
    }

    render(time) {
        
        const uniformData = new Float32Array([
            this.canvas.width, this.canvas.height,
            time,
            0, 
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

        
        const commandEncoder = this.device.createCommandEncoder();

        
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.computePipeline);
        computePass.setBindGroup(0, this.bindGroup);
        computePass.dispatchWorkgroups(Math.ceil(this.maxParticles / 256));
        computePass.end();

        
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }]
        });

        renderPass.setPipeline(this.renderPipeline);
        renderPass.setBindGroup(0, this.bindGroup);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(6, this.maxParticles); 
        renderPass.end();

        
        this.device.queue.submit([commandEncoder.finish()]);
    }
}