// Advanced Three.js AI Visualization with Transformer Architecture
class AIVisualization {
    constructor() {
        this.container = document.getElementById('ai-canvas-container');
        this.canvas = document.getElementById('ai-canvas');

        if (!this.container || !this.canvas || typeof THREE === 'undefined') {
            console.warn('AI visualization could not initialize: missing canvas or THREE.js.');
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.rotationTarget = { x: 0, y: 0 };
        this.nodes = [];
        this.connections = [];
        this.attentionLayers = [];
        this.particles = [];
        this.labelSprites = [];

        this.mediaQuery = window.matchMedia('(max-width: 768px)');
        this.config = this.getConfig(this.mediaQuery.matches);

        this.layerCount = this.config.layerCount;
        this.layerSpacing = this.config.layerSpacing;
        this.sideOffset = this.config.sideOffset;
        this.headCount = this.config.headCount;
        this.particleCount = this.config.particleCount;

        this.colors = {
            primary: 0xea6d00,
            secondary: 0xf97316,
            accent: 0xfb923c,
            light: 0xfdba74,
            white: 0xffffff,
            glow: 0xffedd5
        };

        this.time = 0;
        this.resizeObserver = null;

        this.handleResize = this.handleResize.bind(this);
        this.updateMediaConfig = this.updateMediaConfig.bind(this);
        this.resetRotationTarget = this.resetRotationTarget.bind(this);

        this.init();
    }

    getConfig(isMobile) {
        return {
            isMobile,
            layerCount: isMobile ? 4 : 6,
            layerSpacing: isMobile ? 1.2 : 1.5,
            sideOffset: isMobile ? 3.2 : 4,
            headCount: isMobile ? 5 : 8,
            particleCount: isMobile ? 160 : 240,
            particleRange: isMobile ? 14 : 20,
            cameraZ: isMobile ? 18 : 15,
            cameraFov: isMobile ? 80 : 70,
            cameraOrbit: {
                x: isMobile ? 1.2 : 2,
                z: isMobile ? 1.4 : 2
            },
            rotationMultiplier: isMobile ? 0.22 : 0.32,
            rotationVertical: isMobile ? 0.14 : 0.22,
            maxDpr: isMobile ? 1.5 : 2,
            labelScale: isMobile ? 2.4 : 3.4,
            curveDepth: isMobile ? 1.6 : 2.4
        };
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createTransformerArchitecture();
        this.createParticleSystem();
        this.createStrategicLabels();
        this.setupEventListeners();
        this.handleResize();
        this.animate();
    }

    setupRenderer() {
        const { width, height } = this.getRendererSize();
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.maxDpr));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    getRendererSize() {
        const width = Math.max(this.container.clientWidth || 0, 240);
        const height = Math.max(this.container.clientHeight || width, 240);
        return { width, height };
    }

    setupCamera() {
        this.camera.position.set(0, 0, this.config.cameraZ);
        this.camera.fov = this.config.cameraFov;
        this.camera.updateProjectionMatrix();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        this.scene.add(ambientLight);

        const light1 = new THREE.PointLight(this.colors.primary, 1, 100);
        light1.position.set(10, 10, 10);
        light1.castShadow = true;
        this.scene.add(light1);

        const light2 = new THREE.PointLight(this.colors.secondary, 0.8, 100);
        light2.position.set(-10, -10, 5);
        this.scene.add(light2);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createTransformerArchitecture() {
        this.createEncoderStack(-this.sideOffset);
        this.createDecoderStack(this.sideOffset);
        this.createAttentionMechanism();
        this.createDataFlowConnections();
    }

    createEncoderStack(xOffset) {
        const layerOffset = (this.layerCount - 1) / 2;

        for (let i = 0; i < this.layerCount; i++) {
            const y = (i - layerOffset) * this.layerSpacing;

            const attentionGeometry = new THREE.BoxGeometry(1.4, 0.3, 0.3);
            const attentionMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.primary,
                transparent: true,
                opacity: 0.8
            });
            const attentionMesh = new THREE.Mesh(attentionGeometry, attentionMaterial);
            attentionMesh.position.set(xOffset, y + 0.38, 0);
            attentionMesh.userData = { type: 'attention', layer: i };
            this.scene.add(attentionMesh);
            this.nodes.push(attentionMesh);

            const ffGeometry = new THREE.BoxGeometry(1.4, 0.3, 0.3);
            const ffMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.8
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.38, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.scene.add(ffMesh);
            this.nodes.push(ffMesh);

            this.createResidualConnection(attentionMesh, ffMesh);
        }
    }

    createDecoderStack(xOffset) {
        const layerOffset = (this.layerCount - 1) / 2;

        for (let i = 0; i < this.layerCount; i++) {
            const y = (i - layerOffset) * this.layerSpacing;

            const maskedAttentionGeometry = new THREE.BoxGeometry(1.4, 0.22, 0.3);
            const maskedAttentionMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.accent,
                transparent: true,
                opacity: 0.8
            });
            const maskedAttentionMesh = new THREE.Mesh(maskedAttentionGeometry, maskedAttentionMaterial);
            maskedAttentionMesh.position.set(xOffset, y + 0.52, 0);
            maskedAttentionMesh.userData = { type: 'masked_attention', layer: i };
            this.scene.add(maskedAttentionMesh);
            this.nodes.push(maskedAttentionMesh);

            const crossAttentionGeometry = new THREE.BoxGeometry(1.4, 0.22, 0.3);
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

            const ffGeometry = new THREE.BoxGeometry(1.4, 0.22, 0.3);
            const ffMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.8
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.52, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.scene.add(ffMesh);
            this.nodes.push(ffMesh);

            this.createResidualConnection(maskedAttentionMesh, crossAttentionMesh);
            this.createResidualConnection(crossAttentionMesh, ffMesh);
        }
    }

    createAttentionMechanism() {
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

        for (let i = 0; i < this.headCount; i++) {
            const angle = (i / this.headCount) * Math.PI * 2;
            const radius = this.config.isMobile ? 1.7 : 2.1;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const headMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.accent,
                transparent: true,
                opacity: 0.85
            });
            const headMesh = new THREE.Mesh(headGeometry, headMaterial);
            headMesh.position.set(x, 0, z);
            headMesh.userData = { type: 'attention_head', index: i };
            this.scene.add(headMesh);
            this.attentionLayers.push(headMesh);

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

        const midY = (start.y + end.y) / 2;
        const curve = new THREE.QuadraticBezierCurve3(
            start,
            new THREE.Vector3(start.x + (start.x < 0 ? 0.4 : -0.4), midY, start.z),
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
        const layerOffset = (this.layerCount - 1) / 2;
        const startX = -this.sideOffset + 1.2;
        const endX = this.sideOffset - 1.2;

        for (let i = 0; i < this.layerCount; i++) {
            const y = (i - layerOffset) * this.layerSpacing;
            const start = new THREE.Vector3(startX, y, 0);
            const end = new THREE.Vector3(endX, y, 0);

            const control = new THREE.Vector3(0, y + Math.sin(i) * 0.4, this.config.curveDepth);
            const curve = new THREE.QuadraticBezierCurve3(start, control, end);

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
        const particleCount = this.particleCount;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const palette = [
            new THREE.Color(this.colors.primary),
            new THREE.Color(this.colors.secondary),
            new THREE.Color(this.colors.accent),
            new THREE.Color(this.colors.light)
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * this.config.particleRange;
            positions[i * 3 + 1] = (Math.random() - 0.5) * (this.config.particleRange * 0.9);
            positions[i * 3 + 2] = (Math.random() - 0.5) * (this.config.isMobile ? 8 : 12);

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.config.isMobile ? 0.08 : 0.1,
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

    createStrategicLabels() {
        const verticalOffset = this.layerSpacing * (this.layerCount / 2 + 0.5);
        const labelDistance = this.sideOffset - 0.6;

        const themes = [
            {
                text: 'AI Strategy',
                color: this.colors.primary,
                position: new THREE.Vector3(-labelDistance, verticalOffset, 0)
            },
            {
                text: 'Enterprise Delivery',
                color: this.colors.secondary,
                position: new THREE.Vector3(labelDistance, -verticalOffset, 0)
            },
            {
                text: 'Talent & Upskilling',
                color: this.colors.accent,
                position: new THREE.Vector3(0, verticalOffset + 1.4, 0)
            }
        ];

        themes.forEach((theme, index) => {
            const sprite = this.createTextSprite(theme.text, theme.color, this.config.labelScale);
            sprite.position.copy(theme.position);
            sprite.userData = {
                basePosition: theme.position.clone(),
                floatOffset: index * Math.PI * 0.75
            };
            this.scene.add(sprite);
            this.labelSprites.push(sprite);
        });
    }

    createTextSprite(text, color, scale) {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return new THREE.Sprite();
        }

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, size, size);

        ctx.font = '600 48px "Inter", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const hex = '#' + color.toString(16).padStart(6, '0');
        ctx.fillStyle = hex;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 6;
        ctx.strokeText(text, size / 2, size / 2);
        ctx.fillText(text, size / 2, size / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, 1);
        sprite.renderOrder = 5;
        return sprite;
    }

    setupEventListeners() {
        const handlePointerMove = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.rotationTarget.y = x * this.config.rotationMultiplier;
            this.rotationTarget.x = y * this.config.rotationVertical;
        };

        this.canvas.addEventListener('pointermove', handlePointerMove);
        this.canvas.addEventListener('pointerleave', this.resetRotationTarget);
        this.canvas.addEventListener('pointerup', this.resetRotationTarget);
        this.canvas.addEventListener('pointercancel', this.resetRotationTarget);

        window.addEventListener('resize', this.handleResize);

        if (this.mediaQuery.addEventListener) {
            this.mediaQuery.addEventListener('change', this.updateMediaConfig);
        } else if (this.mediaQuery.addListener) {
            this.mediaQuery.addListener(this.updateMediaConfig);
        }

        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.handleResize());
            this.resizeObserver.observe(this.container);
        }
    }

    resetRotationTarget() {
        this.rotationTarget.x = 0;
        this.rotationTarget.y = 0;
    }

    updateMediaConfig(event) {
        this.applyDeviceConfig(event.matches);
        this.handleResize();
    }

    applyDeviceConfig(isMobile) {
        if (this.config.isMobile === isMobile) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.maxDpr));
            return;
        }

        const next = this.getConfig(isMobile);
        this.config.isMobile = next.isMobile;
        this.config.cameraZ = next.cameraZ;
        this.config.cameraFov = next.cameraFov;
        this.config.cameraOrbit = next.cameraOrbit;
        this.config.rotationMultiplier = next.rotationMultiplier;
        this.config.rotationVertical = next.rotationVertical;
        this.config.maxDpr = next.maxDpr;
        this.config.labelScale = next.labelScale;
        this.config.particleRange = next.particleRange;
        this.config.curveDepth = next.curveDepth;

        this.camera.fov = this.config.cameraFov;
        this.camera.position.z = this.config.cameraZ;
        this.camera.updateProjectionMatrix();

        this.labelSprites.forEach(sprite => {
            sprite.scale.set(this.config.labelScale, this.config.labelScale, 1);
        });

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.maxDpr));
    }

    handleResize() {
        const { width, height } = this.getRendererSize();
        if (!width || !height) {
            return;
        }

        this.applyDeviceConfig(this.mediaQuery.matches);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height, false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        const lerpFactor = this.config.isMobile ? 0.12 : 0.08;
        this.scene.rotation.y = THREE.MathUtils.lerp(this.scene.rotation.y, this.rotationTarget.y, lerpFactor);
        this.scene.rotation.x = THREE.MathUtils.lerp(this.scene.rotation.x, this.rotationTarget.x, lerpFactor);

        this.nodes.forEach((node, index) => {
            const baseY = node.userData.originalY !== undefined ? node.userData.originalY : node.position.y;
            node.userData.originalY = baseY;
            node.position.y = baseY + Math.sin(this.time * 2 + index * 0.5) * 0.1;

            if (node.userData.type === 'attention' || node.userData.type === 'cross_attention') {
                const scale = 1 + Math.sin(this.time * 3 + index) * 0.08;
                node.scale.setScalar(scale);
                node.material.opacity = 0.6 + Math.sin(this.time * 2 + index) * 0.2;
            }
        });

        this.attentionLayers.forEach((layer) => {
            if (layer.userData.type === 'attention_center') {
                layer.rotation.y += 0.01;
                layer.rotation.z += 0.005;
                const scale = 1 + Math.sin(this.time * 2) * 0.1;
                layer.scale.setScalar(scale);
                layer.material.emissiveIntensity = 0.1 + Math.sin(this.time * 3) * 0.05;
            } else if (layer.userData.type === 'attention_head') {
                const angle = (layer.userData.index / this.headCount) * Math.PI * 2 + this.time;
                const radius = (this.config.isMobile ? 1.7 : 2.1) + Math.sin(this.time * 2) * 0.25;
                layer.position.x = Math.cos(angle) * radius;
                layer.position.z = Math.sin(angle) * radius;
                layer.position.y = Math.sin(this.time * 3 + layer.userData.index) * 0.45;
            }
        });

        this.labelSprites.forEach((sprite) => {
            const base = sprite.userData.basePosition;
            const offset = sprite.userData.floatOffset;
            sprite.position.y = base.y + Math.sin(this.time * 1.4 + offset) * 0.25;
            sprite.material.opacity = this.config.isMobile ? 0.85 : 1;
        });

        this.connections.forEach((connection, index) => {
            if (connection.material) {
                connection.material.opacity = 0.28 + Math.sin(this.time * 4 + index) * 0.18;
            }
        });

        this.particles.forEach((particleSystem) => {
            particleSystem.rotation.y += 0.002;
            const positions = particleSystem.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time * 1.6 + i) * 0.008;
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
        });

        const orbit = this.config.cameraOrbit;
        this.camera.position.x = Math.sin(this.time * 0.5) * orbit.x;
        this.camera.position.z = this.config.cameraZ + Math.cos(this.time * 0.3) * orbit.z;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the AI visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIVisualization();
});
