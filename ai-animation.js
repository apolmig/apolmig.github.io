// Responsive Three.js visualization inspired by Transformer architectures
class AIVisualization {
    constructor() {
        this.container = document.getElementById('ai-canvas-container');
        this.canvas = document.getElementById('ai-canvas');

        if (!this.container || !this.canvas || typeof THREE === 'undefined') {
            console.warn('AI visualization could not initialize: missing canvas or THREE.js.');
            return;
        }

        this.scene = new THREE.Scene();
        this.orbitGroup = new THREE.Group();
        this.scene.add(this.orbitGroup);

        this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
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
        this.tokenStreams = [];

        this.shared = {
            tokenGeometry: new THREE.SphereGeometry(0.1, 16, 16)
        };

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

        this.tokenMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.colors.accent),
            emissive: new THREE.Color(this.colors.accent),
            emissiveIntensity: 0.7,
            metalness: 0.25,
            roughness: 0.4,
            transparent: true,
            opacity: 0.95
        });

        this.init();
    }

    getConfig(isMobile) {
        return {
            isMobile,
            layerCount: isMobile ? 5 : 7,
            layerSpacing: isMobile ? 1.1 : 1.35,
            sideOffset: isMobile ? 3.1 : 4.4,
            headCount: isMobile ? 6 : 10,
            particleCount: isMobile ? 140 : 220,
            particleRange: isMobile ? 12 : 18,
            cameraZ: isMobile ? 16 : 14.8,
            cameraY: isMobile ? 0.6 : 0.9,
            cameraFov: isMobile ? 64 : 58,
            cameraOrbit: {
                x: isMobile ? 1.1 : 1.7,
                y: isMobile ? 0.35 : 0.55,
                z: isMobile ? 1.3 : 2
            },
            rotationMultiplier: isMobile ? 0.22 : 0.32,
            rotationVertical: isMobile ? 0.16 : 0.24,
            maxDpr: isMobile ? 1.5 : 2,
            labelScale: isMobile ? 3.6 : 4.8,
            labelDistance: isMobile ? 2.4 : 3.2,
            curveDepth: isMobile ? 1.8 : 2.6,
            tokensPerLayer: isMobile ? 2 : 3
        };
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createStage();
        this.createTransformerArchitecture();
        this.createDataFlowConnections();
        this.createParticleSystem();
        this.createStrategicLabels();
        this.setupEventListeners();
        this.handleResize();
        this.animate();
    }

    setupRenderer() {
        const { width, height } = this.getRendererSize();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.maxDpr));
        this.renderer.setSize(width, height, false);
        this.renderer.setClearColor(0x000000, 0);
        if ('outputEncoding' in this.renderer) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        }
        if ('toneMapping' in this.renderer) {
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.05;
        }
        this.renderer.shadowMap.enabled = false;
    }

    getRendererSize() {
        const width = Math.max(this.container.clientWidth || 0, 320);
        const fallbackHeight = width * (5 / 4);
        const height = Math.max(this.container.clientHeight || fallbackHeight, 280);
        return { width, height };
    }

    setupCamera() {
        this.camera.position.set(0, this.config.cameraY, this.config.cameraZ);
        this.camera.fov = this.config.cameraFov;
        this.camera.updateProjectionMatrix();
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.45);
        this.scene.add(ambient);

        const keyLight = new THREE.PointLight(this.colors.primary, 1.1, 120);
        keyLight.position.set(8, 10, 10);
        this.scene.add(keyLight);

        const fillLight = new THREE.PointLight(this.colors.secondary, 0.8, 120);
        fillLight.position.set(-10, -6, 8);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
        rimLight.position.set(-6, 8, -8);
        this.scene.add(rimLight);
    }

    createStage() {
        const radius = this.config.isMobile ? 4.8 : 6.6;
        const ringGeometry = new THREE.RingGeometry(radius * 0.6, radius, 64, 1);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -this.layerSpacing * (this.layerCount / 2 + 0.8);
        this.orbitGroup.add(ring);

        const baseGeometry = new THREE.CircleGeometry(radius * 0.58, 64);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1f1b16,
            metalness: 0.2,
            roughness: 0.7,
            emissive: new THREE.Color(this.colors.primary),
            emissiveIntensity: 0.06,
            transparent: true,
            opacity: 0.55
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = -Math.PI / 2;
        base.position.y = ring.position.y + 0.02;
        this.orbitGroup.add(base);

        this.attentionLayers.push(ring);
    }

    createTransformerArchitecture() {
        this.createEncoderStack(-this.sideOffset);
        this.createDecoderStack(this.sideOffset);
        this.createAttentionMechanism();
    }

    createEncoderStack(xOffset) {
        const layerOffset = (this.layerCount - 1) / 2;

        for (let i = 0; i < this.layerCount; i++) {
            const y = (i - layerOffset) * this.layerSpacing;
            const sharedProps = {
                width: 1.6,
                height: 0.36,
                depth: 0.6,
                opacity: 0.88
            };

            const attentionGeometry = new THREE.BoxGeometry(sharedProps.width, sharedProps.height, sharedProps.depth);
            const attentionMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.primary,
                transparent: true,
                opacity: sharedProps.opacity,
                metalness: 0.35,
                roughness: 0.45,
                emissive: new THREE.Color(this.colors.primary),
                emissiveIntensity: 0.08
            });
            const attentionMesh = new THREE.Mesh(attentionGeometry, attentionMaterial);
            attentionMesh.position.set(xOffset, y + 0.42, 0);
            attentionMesh.userData = { type: 'attention', layer: i };
            this.orbitGroup.add(attentionMesh);
            this.nodes.push(attentionMesh);

            const ffGeometry = new THREE.BoxGeometry(sharedProps.width, sharedProps.height, sharedProps.depth);
            const ffMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: sharedProps.opacity,
                metalness: 0.3,
                roughness: 0.5
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.42, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.orbitGroup.add(ffMesh);
            this.nodes.push(ffMesh);

            this.createResidualConnection(attentionMesh, ffMesh);
        }
    }

    createDecoderStack(xOffset) {
        const layerOffset = (this.layerCount - 1) / 2;

        for (let i = 0; i < this.layerCount; i++) {
            const y = (i - layerOffset) * this.layerSpacing;

            const maskedGeometry = new THREE.BoxGeometry(1.6, 0.28, 0.6);
            const maskedMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.accent,
                transparent: true,
                opacity: 0.85,
                metalness: 0.32,
                roughness: 0.48
            });
            const maskedMesh = new THREE.Mesh(maskedGeometry, maskedMaterial);
            maskedMesh.position.set(xOffset, y + 0.56, 0);
            maskedMesh.userData = { type: 'masked_attention', layer: i };
            this.orbitGroup.add(maskedMesh);
            this.nodes.push(maskedMesh);

            const crossGeometry = new THREE.BoxGeometry(1.6, 0.28, 0.6);
            const crossMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.primary,
                transparent: true,
                opacity: 0.92,
                metalness: 0.35,
                roughness: 0.42,
                emissive: new THREE.Color(this.colors.primary),
                emissiveIntensity: 0.1
            });
            const crossMesh = new THREE.Mesh(crossGeometry, crossMaterial);
            crossMesh.position.set(xOffset, y, 0);
            crossMesh.userData = { type: 'cross_attention', layer: i };
            this.orbitGroup.add(crossMesh);
            this.nodes.push(crossMesh);

            const ffGeometry = new THREE.BoxGeometry(1.6, 0.28, 0.6);
            const ffMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.85,
                metalness: 0.3,
                roughness: 0.5
            });
            const ffMesh = new THREE.Mesh(ffGeometry, ffMaterial);
            ffMesh.position.set(xOffset, y - 0.56, 0);
            ffMesh.userData = { type: 'feedforward', layer: i };
            this.orbitGroup.add(ffMesh);
            this.nodes.push(ffMesh);

            this.createResidualConnection(maskedMesh, crossMesh);
            this.createResidualConnection(crossMesh, ffMesh);
        }
    }

    createAttentionMechanism() {
        const coreGeometry = new THREE.SphereGeometry(0.95, 40, 40);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.light,
            transparent: true,
            opacity: 0.7,
            emissive: new THREE.Color(this.colors.primary),
            emissiveIntensity: 0.12,
            metalness: 0.2,
            roughness: 0.4
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.set(0, 0.2, 0);
        core.userData = { type: 'attention_center' };
        this.orbitGroup.add(core);
        this.attentionLayers.push(core);

        const torusGeometry = new THREE.TorusGeometry(this.config.isMobile ? 2 : 2.5, 0.06, 32, 128);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.light,
            transparent: true,
            opacity: 0.25
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.rotation.x = Math.PI / 2;
        torus.userData = { type: 'attention_ring' };
        this.orbitGroup.add(torus);
        this.attentionLayers.push(torus);

        for (let i = 0; i < this.headCount; i++) {
            const angle = (i / this.headCount) * Math.PI * 2;
            const radius = this.config.isMobile ? 1.9 : 2.4;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const headGeometry = new THREE.SphereGeometry(0.18, 24, 24);
            const headMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.accent,
                transparent: true,
                opacity: 0.9,
                emissive: new THREE.Color(this.colors.accent),
                emissiveIntensity: 0.1
            });
            const headMesh = new THREE.Mesh(headGeometry, headMaterial);
            headMesh.position.set(x, 0.2, z);
            headMesh.userData = { type: 'attention_head', index: i };
            this.orbitGroup.add(headMesh);
            this.attentionLayers.push(headMesh);

            this.createAttentionLine(headMesh.position, core.position);
        }
    }

    createAttentionLine(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start.clone(), end.clone()]);
        const material = new THREE.LineBasicMaterial({
            color: this.colors.accent,
            transparent: true,
            opacity: 0.4
        });
        const line = new THREE.Line(geometry, material);
        line.userData = { type: 'attention_line' };
        this.orbitGroup.add(line);
        this.connections.push(line);
    }

    createResidualConnection(node1, node2) {
        const start = node1.position.clone();
        const end = node2.position.clone();
        const control = new THREE.Vector3(
            start.x + (start.x < 0 ? 0.5 : -0.5),
            (start.y + end.y) / 2,
            start.z + 0.4
        );

        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const points = curve.getPoints(28);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: this.colors.light,
            transparent: true,
            opacity: 0.55
        });

        const line = new THREE.Line(geometry, material);
        line.userData = { type: 'residual_connection' };
        this.orbitGroup.add(line);
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
            const control = new THREE.Vector3(0, y + Math.sin(i * 0.6) * 0.6, this.config.curveDepth);

            const curve = new THREE.QuadraticBezierCurve3(start, control, end);
            const points = curve.getPoints(60);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.32
            });
            const line = new THREE.Line(geometry, material);
            line.userData = { type: 'data_flow', layer: i };
            this.orbitGroup.add(line);
            this.connections.push(line);

            for (let j = 0; j < this.config.tokensPerLayer; j++) {
                const token = new THREE.Mesh(this.shared.tokenGeometry, this.tokenMaterial);
                token.scale.setScalar(this.config.isMobile ? 0.7 : 1);
                token.userData = {
                    curve,
                    speed: 0.18 + Math.random() * 0.08,
                    offset: Math.random()
                };
                this.orbitGroup.add(token);
                this.tokenStreams.push(token);
            }
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
            opacity: 0.55,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'particles' };
        this.orbitGroup.add(particles);
        this.particles.push(particles);
    }

    createStrategicLabels() {
        const verticalOffset = this.layerSpacing * (this.layerCount / 2 + 0.6);
        const labelDistance = this.sideOffset + this.config.labelDistance;

        const themes = [
            {
                text: 'AI Strategy',
                color: this.colors.primary,
                position: new THREE.Vector3(-labelDistance, verticalOffset, -0.6)
            },
            {
                text: 'Enterprise Delivery',
                color: this.colors.secondary,
                position: new THREE.Vector3(labelDistance, -verticalOffset * 0.6, 0.4)
            },
            {
                text: 'Talent & Upskilling',
                color: this.colors.accent,
                position: new THREE.Vector3(0, verticalOffset + 1.4, -2.2)
            }
        ];

        themes.forEach((theme, index) => {
            const sprite = this.createTextSprite(theme.text, theme.color, this.config.labelScale);
            sprite.position.copy(theme.position);
            sprite.userData = {
                basePosition: theme.position.clone(),
                floatOffset: index * Math.PI * 0.75
            };
            this.orbitGroup.add(sprite);
            this.labelSprites.push(sprite);
        });
    }

    createTextSprite(text, color, scale) {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return new THREE.Sprite();
        }

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.shadowColor = 'rgba(20, 14, 10, 0.35)';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        const padding = 60;
        const radius = 48;
        const w = size - padding * 2;
        const h = size - padding * 2;
        ctx.moveTo(padding + radius, padding);
        ctx.lineTo(padding + w - radius, padding);
        ctx.quadraticCurveTo(padding + w, padding, padding + w, padding + radius);
        ctx.lineTo(padding + w, padding + h - radius);
        ctx.quadraticCurveTo(padding + w, padding + h, padding + w - radius, padding + h);
        ctx.lineTo(padding + radius, padding + h);
        ctx.quadraticCurveTo(padding, padding + h, padding, padding + h - radius);
        ctx.lineTo(padding, padding + radius);
        ctx.quadraticCurveTo(padding, padding, padding + radius, padding);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '700 68px Inter, Segoe UI, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const hex = '#' + color.toString(16).padStart(6, '0');
        ctx.fillStyle = hex;
        ctx.fillText(text, size / 2, size / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = (this.renderer.capabilities.getMaxAnisotropy ? this.renderer.capabilities.getMaxAnisotropy() : 1) || 1;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            depthTest: false
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
        this.config = { ...this.config, ...next };
        this.layerCount = this.config.layerCount;
        this.layerSpacing = this.config.layerSpacing;
        this.sideOffset = this.config.sideOffset;
        this.particleCount = this.config.particleCount;

        this.camera.fov = this.config.cameraFov;
        this.camera.position.z = this.config.cameraZ;
        this.camera.position.y = this.config.cameraY;
        this.camera.updateProjectionMatrix();

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
        const baseOrbit = this.time * 0.2;
        const targetY = this.rotationTarget.y + baseOrbit;
        const targetX = this.rotationTarget.x * 0.7 + Math.sin(this.time * 0.4) * 0.08;

        this.orbitGroup.rotation.y = THREE.MathUtils.lerp(this.orbitGroup.rotation.y, targetY, lerpFactor);
        this.orbitGroup.rotation.x = THREE.MathUtils.lerp(this.orbitGroup.rotation.x, targetX, lerpFactor * 0.8);

        this.nodes.forEach((node, index) => {
            const baseY = node.userData.originalY !== undefined ? node.userData.originalY : node.position.y;
            node.userData.originalY = baseY;
            node.position.y = baseY + Math.sin(this.time * 2 + index * 0.5) * 0.12;

            if (node.userData.type === 'attention' || node.userData.type === 'cross_attention') {
                const scale = 1 + Math.sin(this.time * 3 + index) * 0.08;
                node.scale.setScalar(scale);
                if (node.material) {
                    node.material.opacity = 0.7 + Math.sin(this.time * 2 + index) * 0.18;
                }
            }
        });

        this.attentionLayers.forEach((layer) => {
            if (layer.userData && layer.userData.type === 'attention_center') {
                layer.rotation.y += 0.012;
                layer.rotation.z += 0.006;
                const scale = 1 + Math.sin(this.time * 2.2) * 0.1;
                layer.scale.setScalar(scale);
                if (layer.material && layer.material.emissiveIntensity !== undefined) {
                    layer.material.emissiveIntensity = 0.1 + Math.sin(this.time * 3) * 0.06;
                }
            } else if (layer.userData && layer.userData.type === 'attention_ring') {
                layer.rotation.z += 0.01;
            } else if (layer.userData && layer.userData.type === 'attention_head') {
                const radius = (this.config.isMobile ? 1.9 : 2.4) + Math.sin(this.time * 2) * 0.22;
                const angle = (layer.userData.index / this.headCount) * Math.PI * 2 + this.time * 0.9;
                layer.position.x = Math.cos(angle) * radius;
                layer.position.z = Math.sin(angle) * radius;
                layer.position.y = 0.2 + Math.sin(this.time * 3 + layer.userData.index) * 0.25;
            }
        });

        this.labelSprites.forEach((sprite) => {
            const base = sprite.userData.basePosition;
            const offset = sprite.userData.floatOffset;
            sprite.position.y = base.y + Math.sin(this.time * 1.4 + offset) * 0.25;
            sprite.material.opacity = this.config.isMobile ? 0.85 : 0.95;
        });

        this.connections.forEach((connection, index) => {
            if (connection.material) {
                connection.material.opacity = 0.26 + Math.sin(this.time * 4 + index) * 0.16;
            }
        });

        this.particles.forEach((particleSystem) => {
            particleSystem.rotation.y += 0.002;
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time * 1.5 + i) * 0.008;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        });

        this.tokenStreams.forEach((token) => {
            const { curve, speed, offset } = token.userData;
            const t = (this.time * speed + offset) % 1;
            const point = curve.getPoint(t);
            token.position.copy(point);
            token.position.z += Math.sin((t + offset) * Math.PI * 2) * 0.2;
        });

        const orbit = this.config.cameraOrbit;
        this.camera.position.x = Math.sin(this.time * 0.45) * orbit.x;
        this.camera.position.y = this.config.cameraY + Math.sin(this.time * 0.3) * orbit.y;
        this.camera.position.z = this.config.cameraZ + Math.cos(this.time * 0.32) * orbit.z;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the AI visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIVisualization();
});
