// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initSkillsOrbital();
    initAchievementsAnimation();
    initContactForm();
    initParticles();
    initTypingEffect();
    
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar hide/show on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }

        // Reveal animations
        revealOnScroll();
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// ===== SKILLS ORBITAL CAROUSEL =====
function initSkillsOrbital() {
    const orbital = document.getElementById('skillsOrbital');
    const leftNav = document.getElementById('skillsNavLeft');
    const rightNav = document.getElementById('skillsNavRight');
    const indicators = document.querySelectorAll('.orbital-dot');
    const cards = document.querySelectorAll('.orbital-skill-card');
    
    console.log('Initializing orbital carousel:', {
        orbital: !!orbital,
        leftNav: !!leftNav,
        rightNav: !!rightNav,
        indicators: indicators.length,
        cards: cards.length
    });
    
    if (!orbital || !leftNav || !rightNav || cards.length === 0) {
        console.error('Missing orbital carousel elements');
        return;
    }
    
    let currentIndex = 0;
    const totalCards = cards.length;
    let isRotating = false;
    
    // Auto-rotation timer
    let autoRotateTimer;
    const autoRotateDelay = 4000; // 4 seconds
    
    function updateOrbitalPosition() {
        if (isRotating) return;
        isRotating = true;
        
        console.log('Updating orbital position to index:', currentIndex);
        
        // Update card positions and styling
        cards.forEach((card, index) => {
            card.classList.remove('active');
            
            // Calculate position relative to current active card
            let relativePosition = index - currentIndex;
            
            // Wrap around for circular effect
            if (relativePosition > totalCards / 2) {
                relativePosition -= totalCards;
            } else if (relativePosition < -totalCards / 2) {
                relativePosition += totalCards;
            }
            
            // Position the cards
            if (relativePosition === 0) {
                // Active card - center
                card.classList.add('active');
                card.style.left = '50%';
                card.style.transform = 'translateX(-50%) scale(1)';
                card.style.zIndex = '10';
                card.style.opacity = '1';
            } else if (relativePosition === 1) {
                // Next card - right
                card.style.left = 'calc(50% + 300px)';
                card.style.transform = 'translateX(-50%) scale(0.6) rotateY(-20deg)';
                card.style.zIndex = '0';
                card.style.opacity = '0.7';
            } else if (relativePosition === 2) {
                // Far right
                card.style.left = 'calc(50% + 600px)';
                card.style.transform = 'translateX(-50%) scale(0.5) rotateY(-40deg)';
                card.style.zIndex = '-1';
                card.style.opacity = '0.5';
            } else if (relativePosition === -1) {
                // Previous card - left
                card.style.left = 'calc(50% - 300px)';
                card.style.transform = 'translateX(-50%) scale(0.6) rotateY(20deg)';
                card.style.zIndex = '0';
                card.style.opacity = '0.7';
            } else if (relativePosition === -2) {
                // Far left
                card.style.left = 'calc(50% - 600px)';
                card.style.transform = 'translateX(-50%) scale(0.5) rotateY(40deg)';
                card.style.zIndex = '-1';
                card.style.opacity = '0.5';
            } else {
                // Hidden cards
                card.style.opacity = '0';
                card.style.zIndex = '-2';
            }
        });
        
        // Update indicators
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Reset rotation flag after animation
        setTimeout(() => {
            isRotating = false;
        }, 800);
    }
    
    function nextSkill() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateOrbitalPosition();
        resetAutoRotate();
    }
    
    function prevSkill() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateOrbitalPosition();
        resetAutoRotate();
    }
    
    function goToSkill(index) {
        if (index !== currentIndex && !isRotating && index >= 0 && index < totalCards) {
            currentIndex = index;
            updateOrbitalPosition();
            resetAutoRotate();
        }
    }
    
    function resetAutoRotate() {
        clearTimeout(autoRotateTimer);
        autoRotateTimer = setTimeout(nextSkill, autoRotateDelay);
    }
    
    function startAutoRotate() {
        autoRotateTimer = setTimeout(nextSkill, autoRotateDelay);
    }
    
    function stopAutoRotate() {
        clearTimeout(autoRotateTimer);
    }
    
    // Event listeners
    leftNav.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Left nav clicked');
        prevSkill();
    });
    
    rightNav.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Right nav clicked');
        nextSkill();
    });
    
    // Indicator click events
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Indicator clicked:', index);
            goToSkill(index);
        });
    });
    
    // Card click events for mobile/touch interaction
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (index !== currentIndex) {
                console.log('Card clicked:', index);
                goToSkill(index);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSkill();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSkill();
                }
            }
        }
    });
    
    // Pause auto-rotate on hover
    const skillsContainer = document.querySelector('.skills-orbital-container');
    if (skillsContainer) {
        skillsContainer.addEventListener('mouseenter', stopAutoRotate);
        skillsContainer.addEventListener('mouseleave', startAutoRotate);
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (orbital) {
        orbital.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoRotate();
        }, { passive: true });
        
        orbital.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoRotate();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSkill();
            } else {
                nextSkill();
            }
        }
    }
    
    // Initialize - set first card as active and start
    updateOrbitalPosition();
    startAutoRotate();
    
    console.log('Orbital carousel initialized successfully');
}

// ===== ACHIEVEMENTS ANIMATIONS =====
function initAchievementsAnimation() {
    const achievementsSection = document.querySelector('.achievements');
    if (!achievementsSection) return;

    // Create additional floating particles
    createAchievementParticles();
    
    // Ensure certification links work
    initCertificationLinks();
    
    // Intersection Observer for section visibility
    const achievementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-achievements');
                triggerAchievementAnimations();
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    achievementObserver.observe(achievementsSection);
}

function initCertificationLinks() {
    const certLinks = document.querySelectorAll('.cert-link');
    
    certLinks.forEach(link => {
        // Ensure the link is clickable
        link.style.cursor = 'pointer';
        link.style.pointerEvents = 'all';
        
        // Add click event listener as backup
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            const href = this.getAttribute('href');
            if (href && href.startsWith('http')) {
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        });
        
        // Add keyboard accessibility
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function createAchievementParticles() {
    const achievementsSection = document.querySelector('.achievements');
    if (!achievementsSection) return;

    // Create cosmic particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${getRandomColor()};
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: cosmic-float ${Math.random() * 10 + 8}s linear infinite;
            box-shadow: 0 0 ${Math.random() * 20 + 10}px currentColor;
        `;
        achievementsSection.appendChild(particle);
    }

    // Add cosmic float animation to CSS if not exists
    if (!document.querySelector('#cosmic-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'cosmic-animation-styles';
        style.textContent = `
            @keyframes cosmic-float {
                0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0; }
            }
            .cosmic-particle {
                animation-delay: ${Math.random() * 8}s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function getRandomColor() {
    const colors = [
        '#64ffda', '#00bcd4', '#ffd700', '#ff6b6b', 
        '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
        '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function triggerAchievementAnimations() {
    const achievementItems = document.querySelectorAll('.achievement-item');
    const certificationItems = document.querySelectorAll('.certification-item');
    
    // Stagger animation for achievement items
    achievementItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('animate-in');
        }, index * 100);
    });

    // Stagger animation for certification items
    certificationItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animationDelay = `${index * 0.15}s`;
            item.classList.add('animate-in');
        }, (index * 100) + 500);
    });

    // Create shooting stars effect
    setTimeout(() => {
        createShootingStars();
    }, 1000);
}

function createShootingStars() {
    const achievementsSection = document.querySelector('.achievements');
    if (!achievementsSection) return;

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: linear-gradient(45deg, #fff, #64ffda);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 50}%;
                box-shadow: 0 0 10px #64ffda, 0 0 20px #64ffda, 0 0 40px #64ffda;
            `;
            
            // Add shooting animation
            star.style.animation = `shooting-star ${Math.random() * 2 + 1}s linear forwards`;
            
            achievementsSection.appendChild(star);
            
            // Remove after animation
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 3000);
        }, i * 800);
    }

    // Add shooting star animation
    if (!document.querySelector('#shooting-star-styles')) {
        const style = document.createElement('style');
        style.id = 'shooting-star-styles';
        style.textContent = `
            @keyframes shooting-star {
                0% { 
                    transform: translateX(-100px) translateY(-100px) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                    transform: translateX(-50px) translateY(-50px) scale(1);
                }
                90% {
                    opacity: 1;
                    transform: translateX(200px) translateY(200px) scale(1);
                }
                100% { 
                    transform: translateX(300px) translateY(300px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Submit to Netlify
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encode({
                    'form-name': 'contact',
                    'name': name,
                    'email': email,
                    'subject': subject,
                    'message': message
                })
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    showFormStatus('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
                } else {
                    showFormStatus('There was an error sending your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showFormStatus('There was an error sending your message. Please try again later.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Encode form data for Netlify
function encode(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    // Hide all status messages first
    const successDiv = formStatus.querySelector('.status-success');
    const errorDiv = formStatus.querySelector('.status-error');
    
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    
    // Show appropriate message
    if (type === 'success') {
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successDiv.style.display = 'flex';
    } else {
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.display = 'flex';
    }
    
    formStatus.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 0, 0.9)' : type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(102, 126, 234, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typewriter');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid #667eea';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRightColor = element.style.borderRightColor === 'transparent' ? '#667eea' : 'transparent';
                }, 500);
            }
        };
        
        // Start typing when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 1000);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
    createFloatingParticles();
    createMouseTrailParticles();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(particleContainer);
        }, i * 200);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const startPositionX = Math.random() * window.innerWidth;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        left: ${startPositionX}px;
        top: 100vh;
        animation: floatUp ${duration}s linear ${delay}s infinite;
        box-shadow: 0 0 ${size * 2}px rgba(102, 126, 234, 0.5);
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentElement) {
            particle.remove();
            createParticle(container); // Create new particle
        }
    }, (duration + delay) * 1000);
}

function createMouseTrailParticles() {
    let mouseX = 0;
    let mouseY = 0;
    let particles = [];
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particle every few pixels moved
        if (Math.random() < 0.1) {
            createTrailParticle(mouseX, mouseY);
        }
    });
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: rgba(102, 126, 234, 0.6);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            animation: fadeOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentElement) {
                particle.remove();
            }
        }, 1000);
    }
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    
    scrollToTopBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Add CSS animations keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes floatUp {
        from { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0; 
        }
        10% { 
            opacity: 1; 
        }
        90% { 
            opacity: 1; 
        }
        to { 
            transform: translateY(-100vh) rotate(360deg); 
            opacity: 0; 
        }
    }
    
    @keyframes fadeOut {
        from { 
            opacity: 1; 
            transform: scale(1); 
        }
        to { 
            opacity: 0; 
            transform: scale(0); 
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Recalculate any position-dependent elements
    updateActiveNavLink();
}, 250));

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'assets/images/profile.jpg',
        'assets/images/ai-sql-copilot.jpg',
        'assets/images/etl-automation.jpg',
        'assets/images/attrition-dashboard.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);