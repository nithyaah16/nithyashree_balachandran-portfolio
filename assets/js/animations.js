// ===== ADVANCED ANIMATIONS CONTROLLER =====

class AnimationController {
    constructor() {
        this.observers = [];
        this.animations = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initGlitchEffects();
        this.initPulsing();
        
        // Handle reduced motion preference
        if (this.isReducedMotion) {
            this.disableAnimations();
        }
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-up, .fade-left, .fade-right, .scale-up, .slide-in, .rotate-in'
        );
        
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
    
    triggerAnimation(element) {
        element.classList.add('animate');
        
        // Add stagger effect for grouped elements
        const siblings = element.parentElement.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up');
        if (siblings.length > 1) {
            siblings.forEach((sibling, index) => {
                setTimeout(() => {
                    sibling.classList.add('animate');
                }, index * 100);
            });
        }
    }
    
    initScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax backgrounds
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrollTop * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            // Floating elements
            const floatingElements = document.querySelectorAll('.floating');
            floatingElements.forEach((el, index) => {
                const speed = 0.001 + (index * 0.0005);
                const offset = Math.sin(scrollTop * speed + index) * 10;
                el.style.transform = `translateY(${offset}px)`;
            });
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    initHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.project-card, .blog-card, .skill-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addGlowEffect(e.target);
                this.createRippleEffect(e);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeGlowEffect(e.target);
            });
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.animateButton(e.target, 'enter');
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.animateButton(e.target, 'leave');
            });
            
            btn.addEventListener('click', (e) => {
                this.createClickEffect(e);
            });
        });
    }
    
    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3), 0 0 60px rgba(102, 126, 234, 0.1)';
        element.style.transform = 'translateY(-5px) scale(1.02)';
    }
    
    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }
    
    createRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        e.target.style.position = 'relative';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentElement) {
                ripple.remove();
            }
        }, 600);
    }
    
    animateButton(button, action) {
        if (action === 'enter') {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
        } else {
            button.style.transform = '';
            button.style.boxShadow = '';
        }
    }
    
    createClickEffect(e) {
        const button = e.target.closest('.btn');
        
        // Scale animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Particle burst effect
        this.createParticleBurst(e.clientX, e.clientY);
    }
    
    createParticleBurst(x, y) {
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 50;
            const size = 2 + Math.random() * 3;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: particleBurst 0.8s ease-out forwards;
            `;
            
            particle.style.setProperty('--angle', angle + 'rad');
            particle.style.setProperty('--velocity', velocity + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentElement) {
                    particle.remove();
                }
            }, 800);
        }
    }
    
    initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(el => {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    this.triggerGlitch(el);
                }
            }, 3000);
        });
    }
    
    triggerGlitch(element) {
        element.classList.add('glitching');
        
        setTimeout(() => {
            element.classList.remove('glitching');
        }, 200);
    }
    
    initPulsing() {
        const pulseElements = document.querySelectorAll('.pulse');
        
        pulseElements.forEach((el, index) => {
            const delay = index * 500;
            
            setTimeout(() => {
                el.style.animation = 'pulse 2s ease-in-out infinite';
            }, delay);
        });
    }
    
    // Matrix digital rain effect
    createMatrixRain() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F3';
            ctx.font = fontSize + 'px arial';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
        
        // Clean up on resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Cosmic cursor trail
    initCosmicCursor() {
        const trail = [];
        const trailLength = 20;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
            
            this.updateCursorTrail(trail);
        });
    }
    
    updateCursorTrail(trail) {
        // Remove old trail elements
        const oldTrails = document.querySelectorAll('.cursor-trail');
        oldTrails.forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const element = document.createElement('div');
            const age = Date.now() - point.time;
            const opacity = Math.max(0, 1 - age / 1000);
            const size = Math.max(2, 8 - index * 0.3);
            
            element.className = 'cursor-trail';
            element.style.cssText = `
                position: fixed;
                left: ${point.x - size/2}px;
                top: ${point.y - size/2}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(102, 126, 234, ${opacity}) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: opacity 0.1s ease-out;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                if (element.parentElement) {
                    element.remove();
                }
            }, 100);
        });
    }
    
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.animations.clear();
        
        // Remove all dynamic elements
        const dynamicElements = document.querySelectorAll('.cursor-trail, .particle-burst');
        dynamicElements.forEach(el => el.remove());
    }
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupElements();
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    setupElements() {
        // Section reveal animations
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            this.elements.push({
                element: section,
                offset: section.offsetTop,
                animated: false
            });
        });
        
        // Individual element animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            const animationType = el.dataset.animation || 'fadeUp';
            this.prepareElement(el, animationType);
            
            this.elements.push({
                element: el,
                offset: el.offsetTop,
                animated: false,
                animation: animationType
            });
        });
    }
    
    prepareElement(element, animation) {
        const animations = {
            fadeUp: { opacity: '0', transform: 'translateY(30px)' },
            fadeLeft: { opacity: '0', transform: 'translateX(-30px)' },
            fadeRight: { opacity: '0', transform: 'translateX(30px)' },
            scaleUp: { opacity: '0', transform: 'scale(0.8)' },
            rotateIn: { opacity: '0', transform: 'rotate(-10deg) scale(0.8)' }
        };
        
        const props = animations[animation] || animations.fadeUp;
        Object.assign(element.style, props);
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(item => {
            if (!item.animated && scrollTop + windowHeight > item.offset + 100) {
                this.animateElement(item);
                item.animated = true;
            }
        });
    }
    
    animateElement(item) {
        const { element, animation } = item;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0)';
        
        // Add extra effects based on animation type
        if (animation === 'scaleUp') {
            element.style.transform = 'scale(1)';
        } else if (animation === 'rotateIn') {
            element.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}

// ===== CSS ANIMATION UTILITIES =====
const AnimationUtils = {
    // Add bounce effect to element
    bounce(element, duration = 600) {
        element.style.animation = `bounce ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    
    // Add shake effect to element
    shake(element, duration = 500) {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    
    // Add pulse effect to element
    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    
    // Add glow effect to element
    glow(element, color = '#667eea', duration = 2000) {
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
        element.style.transition = 'box-shadow 0.3s ease';
        
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, duration);
    }
};

// Add required CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleBurst {
        to {
            transform: translate(
                calc(cos(var(--angle)) * var(--velocity)), 
                calc(sin(var(--angle)) * var(--velocity))
            );
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -20px, 0);
        }
        70% {
            transform: translate3d(0, -10px, 0);
        }
        90% {
            transform: translate3d(0, -4px, 0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .glitching {
        animation: glitch-main 0.3s ease-in-out;
    }
`;

document.head.appendChild(animationStyles);

// Initialize animations when DOM is loaded
let animationController = null;
let scrollAnimator = null;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
    scrollAnimator = new ScrollAnimator();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (animationController) {
        animationController.destroy();
    }
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AnimationController = AnimationController;
    window.ScrollAnimator = ScrollAnimator;
    window.AnimationUtils = AnimationUtils;
}