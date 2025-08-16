// Advanced Three.js AI Visualization with Transformer Architecture
class AIVisualization {
    constructor() {
        this.container = document.getElementById('ai-canvas-container');
        this.canvas = document.getElementById('ai-canvas');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        });
        
        // Animation properties
        this.time = 0;
        this.nodes = [];
        this.connections = [];
        this.attentionLayers = [];
        this.particles = [];
        
        // Color scheme - Light Orange
        this.colors = {
            primary: 0xea6d00,
            secondary: 0xf97316,
            accent: 0xfb923c,
            light: 0xfdba74,
            white: 0xffffff,
            glow: 0xffedd5
        };
        
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createTransformerArchitecture();
        this.createParticleSystem();
        this.setupEventListeners();
        this.animate();
    }
    
    setupRenderer() {
        this.renderer.setSize(500, 500);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    setupCamera() {
        this.camera.position.set(0, 0, 15);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Point lights for dramatic effect
        const light1 = new THREE.PointLight(this.colors.primary, 1, 100);
        light1.position.set(10, 10, 10);
        light1.castShadow = true;
        this.scene.add(light1);
        
        const light2 = new THREE.PointLight(this.colors.secondary, 0.8, 100);
        light2.position.set(-10, -10, 5);
        this.scene.add(light2);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }
    
    createTransformerArchitecture() {
        // Create encoder layers (left side)
        this.createEncoderStack(-4, 'Encoder');
        
        // Create decoder layers (right side)
        this.createDecoderStack(4, 'Decoder');
        
        // Create attention mechanism in the center
        this.createAttentionMechanism();
        
        // Create data flow connections
        this.createDataFlowConnections();
    }
    
    createEncoderStack(xOffset, label) {
        const layerCount = 6;
        const layerSpacing = 1.5;
        
        for (let i = 0; i < layerCount; i++) {
            const y = (i - layerCount/2) * layerSpacing;
            
            // Multi-head attention layer
            const attentionGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.3);
            const attentionMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.primary,
                transparent: true,
                opacity: 0.8
            });
            const attentionMesh = new THREE.Mesh(attentionGeometry, attentionMaterial);
            attentionMesh.position.set(xOffset, y + 0.4, 0);
            attentionMesh.userData = { type: 'attention', layer: i };
            this.scene.add(attentionMesh);
            this.nodes.push(attentionMesh);
            
            // Feed forward layer
            const ffGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.3);
            const ffMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.8
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.4, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.scene.add(ffMesh);
            this.nodes.push(ffMesh);
            
            // Add residual connections
            this.createResidualConnection(attentionMesh, ffMesh);
        }
    }
    
    createDecoderStack(xOffset, label) {
        const layerCount = 6;
        const layerSpacing = 1.5;
        
        for (let i = 0; i < layerCount; i++) {
            const y = (i - layerCount/2) * layerSpacing;
            
            // Masked multi-head attention
            const maskedAttentionGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.3);
            const maskedAttentionMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.accent,
                transparent: true,
                opacity: 0.8
            });
            const maskedAttentionMesh = new THREE.Mesh(maskedAttentionGeometry, maskedAttentionMaterial);
            maskedAttentionMesh.position.set(xOffset, y + 0.5, 0);
            maskedAttentionMesh.userData = { type: 'masked_attention', layer: i };
            this.scene.add(maskedAttentionMesh);
            this.nodes.push(maskedAttentionMesh);
            
            // Cross attention
            const crossAttentionGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.3);
            const crossAttentionMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.primary,
                transparent: true,
                opacity: 0.9
            });
            const crossAttentionMesh = new THREE.Mesh(crossAttentionGeometry, crossAttentionMaterial);
            crossAttentionMesh.position.set(xOffset, y, 0);
            crossAttentionMesh.userData = { type: 'cross_attention', layer: i };
            this.scene.add(crossAttentionMesh);
            this.nodes.push(crossAttentionMesh);
            
            // Feed forward
            const ffGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.3);
            const ffMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.8
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.5, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.scene.add(ffMesh);
            this.nodes.push(ffMesh);
        }
    }
    
    createAttentionMechanism() {
        // Central attention visualization
        const attentionSphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const attentionSphereMaterial = new THREE.MeshPhongMaterial({ 
            color: this.colors.light,
            transparent: true,
            opacity: 0.6,
            emissive: this.colors.primary,
            emissiveIntensity: 0.1
        });
        const attentionSphere = new THREE.Mesh(attentionSphereGeometry, attentionSphereMaterial);
        attentionSphere.position.set(0, 0, 0);
        attentionSphere.userData = { type: 'attention_center' };
        this.scene.add(attentionSphere);
        this.attentionLayers.push(attentionSphere);
        
        // Create attention heads around the center
        const headCount = 8;
        for (let i = 0; i < headCount; i++) {
            const angle = (i / headCount) * Math.PI * 2;
            const radius = 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const headMaterial = new THREE.MeshPhongMaterial({ 
                color: this.colors.accent,
                transparent: true,
                opacity: 0.8
            });
            const headMesh = new THREE.Mesh(headGeometry, headMaterial);
            headMesh.position.set(x, 0, z);
            headMesh.userData = { type: 'attention_head', index: i };
            this.scene.add(headMesh);
            this.attentionLayers.push(headMesh);
            
            // Create connection lines to center
            this.createAttentionLine(headMesh.position, attentionSphere.position);
        }
    }
    
    createAttentionLine(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ 
            color: this.colors.accent,
            transparent: true,
            opacity: 0.4
        });
        const line = new THREE.Line(geometry, material);
        line.userData = { type: 'attention_line' };
        this.scene.add(line);
        this.connections.push(line);
    }
    
    createResidualConnection(node1, node2) {
        const start = node1.position.clone();
        const end = node2.position.clone();
        
        // Create curved line for residual connection
        const curve = new THREE.QuadraticBezierCurve3(
            start,
            new THREE.Vector3(start.x + 0.5, (start.y + end.y) / 2, start.z),
            end
        );
        
        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: this.colors.light,
            transparent: true,
            opacity: 0.6
        });
        const line = new THREE.Line(geometry, material);
        line.userData = { type: 'residual_connection' };
        this.scene.add(line);
        this.connections.push(line);
    }
    
    createDataFlowConnections() {
        // Create flowing data connections between encoder and decoder
        for (let i = 0; i < 6; i++) {
            const start = new THREE.Vector3(-2.5, (i - 3) * 1.5, 0);
            const end = new THREE.Vector3(2.5, (i - 3) * 1.5, 0);
            
            const curve = new THREE.QuadraticBezierCurve3(
                start,
                new THREE.Vector3(0, (i - 3) * 1.5 + Math.sin(i) * 0.5, 2),
                end
            );
            
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(geometry, material);
            line.userData = { type: 'data_flow', layer: i };
            this.scene.add(line);
            this.connections.push(line);
        }
    }
    
    createParticleSystem() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorArray = [
            new THREE.Color(this.colors.primary),
            new THREE.Color(this.colors.secondary),
            new THREE.Color(this.colors.accent),
            new THREE.Color(this.colors.light)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            
            const color = colorArray[Math.floor(Math.random() * colorArray.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 0.1 + 0.05;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'particles' };
        this.scene.add(particles);
        this.particles.push(particles);
    }
    
    setupEventListeners() {
        // Mouse interaction
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Rotate scene based on mouse position
            this.scene.rotation.y = x * 0.3;
            this.scene.rotation.x = y * 0.2;
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        const container = this.container;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Animate nodes
        this.nodes.forEach((node, index) => {
            const baseY = node.userData.originalY || node.position.y;
            node.userData.originalY = baseY;
            node.position.y = baseY + Math.sin(this.time * 2 + index * 0.5) * 0.1;
            
            // Pulse effect for attention layers
            if (node.userData.type === 'attention' || node.userData.type === 'cross_attention') {
                const scale = 1 + Math.sin(this.time * 3 + index) * 0.1;
                node.scale.setScalar(scale);
                node.material.opacity = 0.6 + Math.sin(this.time * 2 + index) * 0.2;
            }
        });
        
        // Animate attention center
        this.attentionLayers.forEach((layer, index) => {
            if (layer.userData.type === 'attention_center') {
                layer.rotation.y += 0.01;
                layer.rotation.z += 0.005;
                const scale = 1 + Math.sin(this.time * 2) * 0.1;
                layer.scale.setScalar(scale);
                layer.material.emissiveIntensity = 0.1 + Math.sin(this.time * 3) * 0.05;
            } else if (layer.userData.type === 'attention_head') {
                const angle = (layer.userData.index / 8) * Math.PI * 2 + this.time;
                const radius = 2 + Math.sin(this.time * 2) * 0.3;
                layer.position.x = Math.cos(angle) * radius;
                layer.position.z = Math.sin(angle) * radius;
                layer.position.y = Math.sin(this.time * 3 + layer.userData.index) * 0.5;
            }
        });
        
        // Animate connections
        this.connections.forEach((connection, index) => {
            if (connection.material) {
                connection.material.opacity = 0.3 + Math.sin(this.time * 4 + index) * 0.2;
            }
        });
        
        // Animate particles
        this.particles.forEach(particleSystem => {
            particleSystem.rotation.y += 0.002;
            const positions = particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time * 2 + i) * 0.01;
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
        });
        
        // Smooth camera rotation
        this.camera.position.x = Math.sin(this.time * 0.5) * 2;
        this.camera.position.z = 15 + Math.cos(this.time * 0.3) * 2;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the AI visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const aiViz = new AIVisualization();
});