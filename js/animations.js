// Advanced animations for the website
document.addEventListener('DOMContentLoaded', () => {
    // Add initial styles to hide text content that will be typed
    const style = document.createElement('style');
    style.textContent = `
        .hero-content h1, 
        .hero-content p, 
        .code-window pre code {
            visibility: hidden;
        }
    `;
    document.head.appendChild(style);
    
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
        // Get the original content with HTML
        const originalContent = heroTitle.innerHTML;
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        
        // Create a document fragment to build the content
        const fragment = document.createDocumentFragment();
        const textNodes = [];
        const spanNodes = [];
        
        // Extract text nodes and span elements
        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node.textContent);
                spanNodes.push(null);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                textNodes.push(node.textContent);
                spanNodes.push(node.className);
            }
        });
        
        // Clear the title and make it visible
        heroTitle.innerHTML = '';
        heroTitle.classList.add('cursor-blink');
        heroTitle.style.visibility = 'visible';
        
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        
        function typeTitle() {
            if (currentTextIndex < textNodes.length) {
                const currentText = textNodes[currentTextIndex];
                const isSpan = spanNodes[currentTextIndex] !== null;
                
                if (currentCharIndex === 0 && isSpan) {
                    // If we're starting a span, create it
                    const span = document.createElement('span');
                    span.className = spanNodes[currentTextIndex];
                    heroTitle.appendChild(span);
                }
                
                if (currentCharIndex < currentText.length) {
                    // Add the next character
                    const char = currentText[currentCharIndex];
                    
                    if (isSpan) {
                        // Add to the last child (the span we created)
                        heroTitle.lastChild.textContent += char;
                    } else {
                        // Add directly to the title or create a text node
                        if (heroTitle.lastChild && heroTitle.lastChild.nodeType === Node.TEXT_NODE) {
                            heroTitle.lastChild.textContent += char;
                        } else {
                            heroTitle.appendChild(document.createTextNode(char));
                        }
                    }
                    
                    currentCharIndex++;
                    setTimeout(typeTitle, 70);
                } else {
                    // Move to the next text node
                    currentTextIndex++;
                    currentCharIndex = 0;
                    setTimeout(typeTitle, 70);
                }
            } else {
                // Done typing
                    heroTitle.classList.remove('cursor-blink');
                typeSubtitle();
            }
        }
        
        // Start typing after a delay
        setTimeout(typeTitle, 500);
    }
    
    // Typewriter for subtitle
    function typeSubtitle() {
        const subtitle = document.querySelector('.animate-subtitle');
        if (subtitle) {
            const originalSubtitle = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.classList.add('cursor-blink');
            subtitle.style.visibility = 'visible';
            
            let subtitleIndex = 0;
            
            function type() {
                if (subtitleIndex < originalSubtitle.length) {
                    subtitle.textContent += originalSubtitle[subtitleIndex];
                    subtitleIndex++;
                    setTimeout(type, 50);
                } else {
                        subtitle.classList.remove('cursor-blink');
                    // Call the code window typing function after subtitle is done
                        typeCodeWindow();
                }
            }
            
            // Start typing subtitle after a small delay
            setTimeout(type, 500);
        } else {
            // If subtitle element not found, skip to code window
            typeCodeWindow();
        }
    }
    
    // Typewriter for code window
    function typeCodeWindow() {
        const codeElement = document.querySelector('.language-python');
        const codeWindow = document.querySelector('.code-window');
        const preElement = codeWindow ? codeWindow.querySelector('pre') : null;
        
        if (codeElement && codeWindow && preElement) {
            // Store original content
            const codeText = codeElement.textContent;
            
            // Preserve code window dimensions
            const windowHeight = codeWindow.offsetHeight;
            const windowWidth = codeWindow.offsetWidth;
            codeWindow.style.minHeight = windowHeight + 'px';
            codeWindow.style.minWidth = windowWidth + 'px';
            
            // Add CSS for syntax highlighting
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .code-window pre code {
                    white-space: pre;
                    display: block;
                    min-height: ${codeElement.offsetHeight}px;
                    color: #f8f8f2;
                }
                .py-keyword { color: #ff79c6; }
                .py-string { color: #f1fa8c; }
                .py-comment { color: #6272a4; }
                .py-function { color: #50fa7b; }
                .py-class { color: #8be9fd; }
                .py-self { color: #bd93f9; }
                .py-number { color: #bd93f9; }
            `;
            document.head.appendChild(styleElement);
            
            // Clear content and prepare for typing
            codeElement.textContent = '';
            codeElement.classList.add('cursor-blink');
            codeElement.style.visibility = 'visible';
            
            // Split code into lines for easier manipulation
            const codeLines = codeText.split('\n');
            let currentLine = 0;
            let currentCharInLine = 0;
            
            // Track the full text we've typed so far
            let typedText = '';
            
            function typeLine() {
                // Check if we've typed all lines
                if (currentLine >= codeLines.length) {
                    // We're done, apply syntax highlighting
                    syntaxHighlight(codeElement);
                    codeElement.classList.remove('cursor-blink');
                    return;
                }
                
                const line = codeLines[currentLine];
                
                // If we're starting a new line, add a newline character
                if (currentCharInLine === 0 && typedText !== '') {
                    typedText += '\n';
                    codeElement.textContent = typedText;
                }
                
                // If we've reached the end of the line
                if (currentCharInLine >= line.length) {
                    // Move to the next line
                    currentLine++;
                    currentCharInLine = 0;
                    // Add a pause between lines
                    setTimeout(typeLine, 100 + Math.random() * 100);
                    return;
                }
                
                // Type the next character
                const char = line[currentCharInLine];
                typedText += char;
                codeElement.textContent = typedText;
                currentCharInLine++;
                
                // Randomize typing speed - occasional pauses
                let typingSpeed = 15;
                if (char === ' ' && Math.random() < 0.1) {
                    typingSpeed = 100 + Math.random() * 200; // Longer pause after some words
                } else if ([',', '.', ':', ';'].includes(char)) {
                    typingSpeed = 70 + Math.random() * 50; // Pause after punctuation
                } else {
                    typingSpeed = 15 + Math.random() * 10; // Normal typing speed
                }
                
                // Continue typing
                setTimeout(typeLine, typingSpeed);
            }
            
            // Syntax highlighting function that uses safer DOM manipulation
            function syntaxHighlight(element) {
                // Create a temporary div to hold the formatted code
                const tempDiv = document.createElement('div');
                
                // Python keywords and special items to highlight
                const keywords = ['class', 'def', 'self', 'return', 'import', 'from', 'if', 'else', 'elif', 
                                 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None'];
                
                // Process each line
                const lines = element.textContent.split('\n');
                
                lines.forEach(line => {
                    // Create a new div for this line
                    const lineDiv = document.createElement('div');
                    
                    // Handle comments first (they override everything else)
                    if (line.trim().startsWith('#')) {
                        const commentSpan = document.createElement('span');
                        commentSpan.className = 'py-comment';
                        commentSpan.textContent = line;
                        lineDiv.appendChild(commentSpan);
                        tempDiv.appendChild(lineDiv);
                        return;
                    }
                    
                    // Split the line into tokens (words, symbols, spaces)
                    let tokens = [];
                    let currentToken = '';
                    let inString = false;
                    let stringChar = '';
                    
                    // Simple tokenizer that respects string boundaries
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        
                        // Handle strings
                        if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
                            if (!inString) {
                                // Starting a string
                                if (currentToken) {
                                    tokens.push(currentToken);
                                    currentToken = '';
                                }
                                inString = true;
                                stringChar = char;
                                currentToken = char;
                            } else if (char === stringChar) {
                                // Ending a string
                                currentToken += char;
                                tokens.push(currentToken);
                                currentToken = '';
                                inString = false;
                            } else {
                                // A different quote character inside a string
                                currentToken += char;
                            }
                        } else if (inString) {
                            // Inside a string, just add the character
                            currentToken += char;
                        } else if (/\s/.test(char)) {
                            // Whitespace outside a string
                            if (currentToken) {
                                tokens.push(currentToken);
                                currentToken = '';
                            }
                            tokens.push(char); // Keep whitespace as a token
                        } else if (/[^\w]/.test(char)) {
                            // Non-word character outside a string
                            if (currentToken) {
                                tokens.push(currentToken);
                                currentToken = '';
                            }
                            tokens.push(char);
                        } else {
                            // Word character outside a string
                            currentToken += char;
                        }
                    }
                    
                    // Add any remaining token
                    if (currentToken) {
                        tokens.push(currentToken);
                    }
                    
                    // Process tokens and add them to the line
                    tokens.forEach(token => {
                        const span = document.createElement('span');
                        
                        // Check what kind of token this is
                        if (keywords.includes(token)) {
                            span.className = 'py-keyword';
                        } else if (token === 'self') {
                            span.className = 'py-self';
                        } else if (token.startsWith('"') || token.startsWith("'")) {
                            span.className = 'py-string';
                        } else if (/^\d+$/.test(token)) {
                            span.className = 'py-number';
                        } else if (token === 'Developer') {
                            span.className = 'py-class';
                        } else if (token === 'connect') {
                            span.className = 'py-function';
                        }
                        
                        span.textContent = token;
                        lineDiv.appendChild(span);
                    });
                    
                    tempDiv.appendChild(lineDiv);
                });
                
                // Clear the code element and add the highlighted code
                element.innerHTML = '';
                tempDiv.childNodes.forEach(node => {
                    element.appendChild(node.cloneNode(true));
                });
            }
            
            // Start typing after a delay
            setTimeout(typeLine, 800);
        }
    }
}

// Syntax highlighting function that uses safer DOM manipulation
function syntaxHighlight(element) {
    // Create a temporary div to hold the formatted code
    const tempDiv = document.createElement('div');
    
    // Python keywords and special items to highlight
    const keywords = ['class', 'def', 'self', 'return', 'import', 'from', 'if', 'else', 'elif', 
                     'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None'];
    
    // Process each line
    const lines = element.textContent.split('\n');
    
    lines.forEach(line => {
        // Create a new div for this line
        const lineDiv = document.createElement('div');
        
        // Handle comments first (they override everything else)
        if (line.trim().startsWith('#')) {
            const commentSpan = document.createElement('span');
            commentSpan.className = 'py-comment';
            commentSpan.textContent = line;
            lineDiv.appendChild(commentSpan);
            tempDiv.appendChild(lineDiv);
            return;
        }
        
        // Split the line into tokens (words, symbols, spaces)
        let tokens = [];
        let currentToken = '';
        let inString = false;
        let stringChar = '';
        
        // Simple tokenizer that respects string boundaries
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            // Handle strings
            if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
                if (!inString) {
                    // Starting a string
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    inString = true;
                    stringChar = char;
                    currentToken = char;
                } else if (char === stringChar) {
                    // Ending a string
                    currentToken += char;
                    tokens.push(currentToken);
                    currentToken = '';
                    inString = false;
                } else {
                    // A different quote character inside a string
                    currentToken += char;
                }
            } else if (inString) {
                // Inside a string, just add the character
                currentToken += char;
            } else if (/\s/.test(char)) {
                // Whitespace outside a string
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                tokens.push(char); // Keep whitespace as a token
            } else if (/[^\w]/.test(char)) {
                // Non-word character outside a string
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                tokens.push(char);
            } else {
                // Word character outside a string
                currentToken += char;
            }
        }
        
        // Add any remaining token
        if (currentToken) {
            tokens.push(currentToken);
        }
        
        // Process tokens and add them to the line
        tokens.forEach(token => {
            const span = document.createElement('span');
            
            // Check what kind of token this is
            if (keywords.includes(token)) {
                span.className = 'py-keyword';
            } else if (token === 'self') {
                span.className = 'py-self';
            } else if (token.startsWith('"') || token.startsWith("'")) {
                span.className = 'py-string';
            } else if (/^\d+$/.test(token)) {
                span.className = 'py-number';
            } else if (token === 'Developer') {
                span.className = 'py-class';
            } else if (token === 'connect') {
                span.className = 'py-function';
            }
            
            span.textContent = token;
            lineDiv.appendChild(span);
        });
        
        tempDiv.appendChild(lineDiv);
    });
    
    // Clear the code element and add the highlighted code
    element.innerHTML = '';
    tempDiv.childNodes.forEach(node => {
        element.appendChild(node.cloneNode(true));
    });
}

// Make the syntax highlighting function available globally
window.syntaxHighlight = syntaxHighlight; 