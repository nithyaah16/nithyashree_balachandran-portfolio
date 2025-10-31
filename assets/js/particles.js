// ===== ADVANCED PARTICLE EFFECTS =====

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
    
    createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.2;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
            
            // Connect to mouse
            const dx = this.particles[i].x - this.mouse.x;
            const dy = this.particles[i].y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const opacity = (100 - distance) / 100 * 0.3;
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.remove();
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.originalRadius = this.radius;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.hue = Math.random() * 60 + 200; // Blue to purple range
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
    }
    
    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.01;
            this.vy -= Math.sin(angle) * force * 0.01;
            this.radius = this.originalRadius * (1 + force * 2);
        } else {
            this.radius = this.originalRadius;
        }
        
        // Position update
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary wrapping
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.y < 0) this.y = this.canvasHeight;
        if (this.y > this.canvasHeight) this.y = 0;
        
        // Lifecycle
        this.life -= this.decay;
        if (this.life <= 0) {
            this.respawn();
        }
    }
    
    respawn() {
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.hue = Math.random() * 60 + 200;
    }
    
    draw(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 2
        );
        
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${this.life * 0.8})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 70%, 60%, ${this.life * 0.5})`;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue}, 70%, 80%, ${this.life * 0.3})`;
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===== SHOOTING STARS EFFECT =====
class ShootingStars {
    constructor() {
        this.stars = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.animate();
        
        // Create shooting stars periodically
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createShootingStar();
            }
        }, 3000);
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createShootingStar() {
        const star = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height * 0.5,
            vx: (Math.random() * 3 + 2) * (Math.random() < 0.5 ? 1 : -1),
            vy: Math.random() * 2 + 1,
            life: 1,
            decay: 0.02,
            size: Math.random() * 2 + 1,
            trail: []
        };
        
        this.stars.push(star);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach((star, index) => {
            // Update position
            star.x += star.vx;
            star.y += star.vy;
            star.life -= star.decay;
            
            // Add to trail
            star.trail.push({ x: star.x, y: star.y, life: star.life });
            if (star.trail.length > 20) {
                star.trail.shift();
            }
            
            // Draw trail
            star.trail.forEach((point, i) => {
                const alpha = (point.life * (i + 1)) / star.trail.length * 0.8;
                const size = star.size * (i + 1) / star.trail.length;
                
                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Glow effect
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = `rgba(102, 126, 234, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(102, 126, 234, ${alpha * 0.5})`;
                this.ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });
            
            // Remove dead stars
            if (star.life <= 0 || star.x < -100 || star.x > this.canvas.width + 100 || star.y > this.canvas.height + 100) {
                this.stars.splice(index, 1);
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.remove();
        }
    }
}

// ===== COSMIC DUST EFFECT =====
class CosmicDust {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createDustParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -3;
            opacity: 0.3;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createDustParticles() {
        const particleCount = Math.floor(window.innerWidth * window.innerHeight / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                size: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.twinkle += 0.02;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle with twinkling effect
            const alpha = particle.opacity * (0.5 + 0.5 * Math.sin(particle.twinkle));
            
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.remove();
        }
    }
}

// ===== INITIALIZATION =====
let particleSystem = null;
let shootingStars = null;
let cosmicDust = null;

function initializeParticleEffects() {
    // Only initialize on devices with good performance
    const isHighPerformance = window.innerWidth > 768 && 
                             !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    if (isHighPerformance) {
        particleSystem = new ParticleSystem();
        shootingStars = new ShootingStars();
        cosmicDust = new CosmicDust();
    } else {
        // Lightweight version for mobile devices
        cosmicDust = new CosmicDust();
    }
}

function destroyParticleEffects() {
    if (particleSystem) {
        particleSystem.destroy();
        particleSystem = null;
    }
    if (shootingStars) {
        shootingStars.destroy();
        shootingStars = null;
    }
    if (cosmicDust) {
        cosmicDust.destroy();
        cosmicDust = null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeParticleEffects);

// Clean up when page is unloaded
window.addEventListener('beforeunload', destroyParticleEffects);

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        destroyParticleEffects();
    } else {
        setTimeout(initializeParticleEffects, 1000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        ShootingStars,
        CosmicDust,
        initializeParticleEffects,
        destroyParticleEffects
    };
}