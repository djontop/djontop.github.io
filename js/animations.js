// Advanced animations for the website
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initParticles();
    initScrollAnimations();
    initTypewriterEffect();
});

// Initialize animations
function initAnimations() {
    // Add hover effect to repository cards
    const repoCards = document.querySelectorAll('.repo-card');
    repoCards.forEach(card => {
        card.addEventListener('mouseenter', e => {
            const cardRect = card.getBoundingClientRect();
            const mouseX = e.clientX - cardRect.left;
            const mouseY = e.clientY - cardRect.top;
            
            card.style.setProperty('--mouse-x', `${mouseX}px`);
            card.style.setProperty('--mouse-y', `${mouseY}px`);
        });
    });

    // Profile image hover effect
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        profileImage.addEventListener('mousemove', e => {
            const bounds = profileImage.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const rotateY = ((mouseX / bounds.width) - 0.5) * 20;
            const rotateX = ((mouseY / bounds.height) - 0.5) * -20;
            
            profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        profileImage.addEventListener('mouseleave', () => {
            profileImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Code window hover effect
    const codeWindow = document.querySelector('.code-window');
    if (codeWindow) {
        codeWindow.addEventListener('mousemove', e => {
            const bounds = codeWindow.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const rotateY = ((mouseX / bounds.width) - 0.5) * 10;
            const rotateX = ((mouseY / bounds.height) - 0.5) * -10;
            
            codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        codeWindow.addEventListener('mouseleave', () => {
            codeWindow.style.transform = 'perspective(1000px) rotateY(-7deg) rotateX(5deg)';
        });
    }
}

// Particle system for hero section
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    hero.appendChild(canvas);
    
    // Style canvas
    Object.assign(canvas.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
    });
    
    // Setup canvas context
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = hero.offsetHeight;
    
    // Particle properties
    const particleCount = 60;
    const particles = [];
    
    // Particle colors for DJ On Top's theme
    const particleColors = [
        'rgba(255, 187, 0, 0.3)',    // Primary gold
        'rgba(55, 0, 179, 0.2)',     // Deep purple
        'rgba(0, 120, 212, 0.25)',   // Blue
        'rgba(0, 153, 153, 0.2)'     // Teal
    ];
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect nearby particles with lines
            connectParticles(particles[i], particles);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Connect nearby particles with lines
    function connectParticles(particle, particles) {
        const maxDistance = 120;
        
        for (let i = 0; i < particles.length; i++) {
            const dx = particle.x - particles[i].x;
            const dy = particle.y - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                // Get a gradient color between the two particles
                const gradientColor = `rgba(255, 187, 0, ${opacity * 0.15})`;
                ctx.strokeStyle = gradientColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[i].x, particles[i].y);
                ctx.stroke();
            }
        }
    }
    
    // Add mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y - window.scrollY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = hero.offsetHeight;
    });
    
    // Start animation
    animate();
}

// Scroll animations
function initScrollAnimations() {
    // Elements to animate on scroll
    const elements = document.querySelectorAll('.section-header, .repo-card, .about-content, .contact-method');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements
    elements.forEach(element => {
        element.classList.add('animate-hidden');
        observer.observe(element);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Typewriter effect for hero heading and code window
function initTypewriterEffect() {
    // Typewriter for main heading
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalTitle = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.classList.add('cursor-blink');
        
        let titleIndex = 0;
        
        function typeTitle() {
            if (titleIndex < originalTitle.length) {
                // Handle HTML tags in title
                if (originalTitle[titleIndex] === '<') {
                    // Find end of tag
                    const endTagIndex = originalTitle.indexOf('>', titleIndex);
                    if (endTagIndex !== -1) {
                        // Add the whole tag at once
                        heroTitle.innerHTML += originalTitle.substring(titleIndex, endTagIndex + 1);
                        titleIndex = endTagIndex + 1;
                    } else {
                        // Fallback if no closing bracket
                        heroTitle.innerHTML += originalTitle[titleIndex];
                        titleIndex++;
                    }
                } else {
                    heroTitle.innerHTML += originalTitle[titleIndex];
                    titleIndex++;
                }
                
                setTimeout(typeTitle, 50); // Adjust speed here
            } else {
                // Remove cursor after typing completes
                setTimeout(() => {
                    heroTitle.classList.remove('cursor-blink');
                }, 1500);
                
                // Start typing subtitle after title completes
                typeSubtitle();
            }
        }
        
        // Start typing title after a delay
        setTimeout(typeTitle, 500);
    }
    
    // Typewriter for subtitle
    function typeSubtitle() {
        const subtitle = document.querySelector('.animate-subtitle');
        if (subtitle) {
            const originalSubtitle = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.classList.add('cursor-blink');
            
            let subtitleIndex = 0;
            
            function type() {
                if (subtitleIndex < originalSubtitle.length) {
                    subtitle.textContent += originalSubtitle[subtitleIndex];
                    subtitleIndex++;
                    setTimeout(type, 30); // Slightly faster than title
                } else {
                    setTimeout(() => {
                        subtitle.classList.remove('cursor-blink');
                        
                        // Start code window typing after subtitle
                        typeCodeWindow();
                    }, 1000);
                }
            }
            
            type();
        } else {
            // If no subtitle, go to code window
            typeCodeWindow();
        }
    }
    
    // Typewriter for code window
    function typeCodeWindow() {
        const codeElement = document.querySelector('.language-javascript');
        if (codeElement) {
            const codeText = codeElement.textContent;
            codeElement.textContent = '';
            codeElement.classList.add('cursor-blink');
            
            let codeIndex = 0;
            
            function type() {
                if (codeIndex < codeText.length) {
                    codeElement.textContent += codeText[codeIndex];
                    codeIndex++;
                    setTimeout(type, 15); // Fastest typing for code
                } else {
                    setTimeout(() => {
                        codeElement.classList.remove('cursor-blink');
                    }, 1000);
                }
            }
            
            type();
        }
    }
} 