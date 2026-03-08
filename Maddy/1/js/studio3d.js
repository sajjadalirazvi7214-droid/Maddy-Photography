/* ============================================
   3D Studio Environment — Three.js
   ============================================ */

class Studio3D {
    constructor() {
        this.canvas = document.getElementById('studio-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.floatingFrames = [];
        this.particles = [];
        this.clock = new THREE.Clock();
        this.isMobile = window.innerWidth < 768;
        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 1.5, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;

        this.createStudio();
        this.createLighting();
        this.createFloatingFrames();
        this.createParticles();
        this.setupEvents();
        this.animate();
    }

    createStudio() {
        // Floor
        const floorGeo = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0f,
            metalness: 0.8,
            roughness: 0.3,
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        this.scene.add(floor);

        // Back Wall
        const wallGeo = new THREE.PlaneGeometry(30, 15);
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x12121a,
            metalness: 0.3,
            roughness: 0.8,
        });
        const backWall = new THREE.Mesh(wallGeo, wallMat);
        backWall.position.set(0, 5, -8);
        this.scene.add(backWall);

        // Side walls
        const leftWall = new THREE.Mesh(wallGeo, wallMat);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-10, 5, 0);
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeo, wallMat);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(10, 5, 0);
        this.scene.add(rightWall);

        // Reflective floor grid lines
        const gridHelper = new THREE.GridHelper(30, 30, 0x1a1a2e, 0x1a1a2e);
        gridHelper.position.y = -0.99;
        gridHelper.material.opacity = 0.15;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    createLighting() {
        // Ambient
        const ambient = new THREE.AmbientLight(0x1a1a2e, 0.3);
        this.scene.add(ambient);

        // Main spotlight (warm gold)
        const spotMain = new THREE.SpotLight(0xc9a96e, 3, 30, Math.PI / 4, 0.6, 1.5);
        spotMain.position.set(0, 8, 2);
        spotMain.target.position.set(0, 0, 0);
        this.scene.add(spotMain);
        this.scene.add(spotMain.target);

        // Rim light (cool blue)
        const spotRim = new THREE.SpotLight(0x4a6fa5, 1.5, 25, Math.PI / 5, 0.5, 1.5);
        spotRim.position.set(-5, 6, 3);
        this.scene.add(spotRim);

        // Accent light (warm)
        const spotAccent = new THREE.SpotLight(0xe8a87c, 1, 20, Math.PI / 6, 0.7, 2);
        spotAccent.position.set(5, 5, 1);
        this.scene.add(spotAccent);

        // Subtle fill from below
        const fillLight = new THREE.PointLight(0xc9a96e, 0.2, 15);
        fillLight.position.set(0, -0.5, 3);
        this.scene.add(fillLight);
    }

    createFloatingFrames() {
        const framePositions = [
            { x: -4, y: 2.5, z: -5, rotY: 0.15 },
            { x: 4.5, y: 3, z: -6, rotY: -0.1 },
            { x: -6, y: 1.5, z: -3, rotY: 0.3 },
            { x: 6, y: 2, z: -4, rotY: -0.25 },
            { x: -2, y: 4, z: -7, rotY: 0.05 },
            { x: 3, y: 4.5, z: -7, rotY: -0.08 },
        ];

        framePositions.forEach((pos, i) => {
            // Frame border
            const frameGeo = new THREE.BoxGeometry(1.2, 0.9, 0.04);
            const frameMat = new THREE.MeshStandardMaterial({
                color: 0x2a2a35,
                metalness: 0.9,
                roughness: 0.2,
            });
            const frame = new THREE.Mesh(frameGeo, frameMat);

            // Inner photo surface
            const photoGeo = new THREE.PlaneGeometry(1.05, 0.75);
            const photoMat = new THREE.MeshStandardMaterial({
                color: 0x15151f,
                emissive: 0x1a1a2e,
                emissiveIntensity: 0.1,
                metalness: 0.1,
                roughness: 0.9,
            });
            const photo = new THREE.Mesh(photoGeo, photoMat);
            photo.position.z = 0.025;
            frame.add(photo);

            frame.position.set(pos.x, pos.y, pos.z);
            frame.rotation.y = pos.rotY;

            this.scene.add(frame);
            this.floatingFrames.push({
                mesh: frame,
                baseY: pos.y,
                speed: 0.3 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2,
            });
        });
    }

    createParticles() {
        const count = this.isMobile ? 40 : 80;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            sizes[i] = Math.random() * 0.03 + 0.01;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xc9a96e,
            size: 0.04,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
        this.particles = { points, positions };
    }

    setupEvents() {
        // Mouse parallax
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Touch parallax
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetMouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
                this.targetMouse.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
            }
        }, { passive: true });

        // Resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const elapsed = this.clock.getElapsedTime();

        // Smooth parallax camera
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = 1.5 + this.mouse.y * -0.3;
        this.camera.lookAt(0, 1.5, 0);

        // Floating frames
        this.floatingFrames.forEach((frame) => {
            frame.mesh.position.y = frame.baseY + Math.sin(elapsed * frame.speed + frame.phase) * 0.15;
            frame.mesh.rotation.z = Math.sin(elapsed * frame.speed * 0.5 + frame.phase) * 0.02;
        });

        // Dust particles float
        if (this.particles.points) {
            const pos = this.particles.points.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += Math.sin(elapsed + i) * 0.001;
                if (pos[i + 1] > 10) pos[i + 1] = 0;
            }
            this.particles.points.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Export for use in main.js
window.Studio3D = Studio3D;
