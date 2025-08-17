// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Ultra-fast Intersection Observer for animations
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 200px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for instant scroll animations
const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-item, .contact-item, .merit-card');
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    // Ultra-fast animation with minimal delay
    const delay = Math.min(index * 0.01, 0.05); // Max 0.05s delay
    el.style.transition = `opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
    observer.observe(el);
});

// Optimized CSS animations
const animationStyles = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.98);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .animate-in {
        animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .scale-in {
        animation: fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Counter animation for hero stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('K+')) {
                    counter.textContent = Math.floor(current) + 'K+';
                } else if (counter.textContent.includes('+')) {
                    counter.textContent = Math.floor(current) + '+';
                } else {
                    counter.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.includes('K+') ? target + 'K+' : 
                                   counter.textContent.includes('+') ? target + '+' : target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Enhanced neural network animation
function enhanceNeuralNetwork() {
    const nodes = document.querySelectorAll('.node');
    const connections = document.querySelectorAll('.connection');
    
    // Add click interaction to nodes
    nodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'scale(1.2)';
            node.style.boxShadow = '0 0 30px rgba(234, 109, 0, 0.6)';
            
            // Pulse connected lines
            connections.forEach(conn => {
                conn.style.animation = 'flow 0.5s ease-in-out';
            });
        });
        
        node.addEventListener('mouseleave', () => {
            node.style.transform = 'scale(1)';
            node.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Enhanced interactive effects
function addEnhancedInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Enhanced card interactions
    const allCards = document.querySelectorAll('.project-card, .merit-card, .timeline-content');
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // Parallax effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const speed = (index + 1) * 0.05;
            section.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Add CSS for ripple effect
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .project-card, .merit-card, .timeline-content {
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .section-reveal {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .section-reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Add preloader
function addPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #fef7ed 0%, #fff7ed 50%, #ffedd5 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid #fed7aa;
        border-top: 3px solid #ea6d00;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    const spinKeyframes = document.createElement('style');
    spinKeyframes.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinKeyframes);
    
    preloader.appendChild(spinner);
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 500);
    });
}

// Initialize enhanced animations
document.addEventListener('DOMContentLoaded', () => {
    addPreloader();
    enhanceNeuralNetwork();
    addEnhancedInteractions();
    
    // Add staggered animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Instant section reveals
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-reveal');
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 300px 0px' });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Add typing effect to hero title
function typewriterEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const originalText = "Driving AI Innovation in Organizations Worldwide";
    titleElement.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < originalText.length) {
            titleElement.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 60);
}

// Initialize typewriter effect after a short delay
setTimeout(typewriterEffect, 800);

// Add floating animation to skill items
function addFloatingAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animation = `float 3s ease-in-out infinite`;
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// CSS for floating animation (added dynamically)
const floatingKeyframes = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;

const style = document.createElement('style');
style.textContent = floatingKeyframes;
document.head.appendChild(style);

// Initialize floating animation
setTimeout(addFloatingAnimation, 2000);

// Enhanced scroll progress indicator
function createScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ea6d00, #f97316);
        z-index: 1001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(234, 109, 0, 0.5);
    `;
    document.body.appendChild(scrollIndicator);
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                scrollIndicator.style.width = Math.min(scrollPercent, 100) + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
}

createScrollIndicator();

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

updateActiveNavLink();

// Add CSS for active nav link
const activeNavStyle = `
    .nav-link.active {
        color: #ea6d00 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;

const activeStyle = document.createElement('style');
activeStyle.textContent = activeNavStyle;
document.head.appendChild(activeStyle);

// Smooth reveal animations for sections
function addSectionRevealAnimations() {
    const sections = document.querySelectorAll('section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 200px 0px' });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
}

// CSS for revealed sections
const revealStyle = `
    section.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

const revealStyleElement = document.createElement('style');
revealStyleElement.textContent = revealStyle;
document.head.appendChild(revealStyleElement);

addSectionRevealAnimations();

// Add performance optimization
function optimizePerformance() {
    // Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Debounce scroll events for better performance
    let ticking = false;
    
    function updateScrollEvents() {
        // All scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEvents);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

optimizePerformance();