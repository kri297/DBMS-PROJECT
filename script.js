// ===========================
// Global Variables & Configuration
// ===========================
let currentTheme = localStorage.getItem('dbms-theme') || 'light';
let userProgress = JSON.parse(localStorage.getItem('dbms-progress')) || {};
let isNavMenuOpen = false;
let loadingComplete = false;

// Module configuration
const modules = {
    fundamentals: {
        id: 'fundamentals',
        name: 'DBMS Fundamentals',
        path: 'Q1/home.html',
        description: 'Core concepts and architecture',
        progress: 0
    },
    'er-builder': {
        id: 'er-builder',
        name: 'ER Diagram Builder',
        path: 'Q2/advanced-er-builder.html',
        description: 'Visual database design tool',
        progress: 0
    },
    relational: {
        id: 'relational',
        name: 'Relational Algebra Visualizer',
        path: 'Q3/index.html',
        description: 'Query operations simulator',
        progress: 0
    },
    transactions: {
        id: 'transactions',
        name: 'Transaction Management Simulator',
        path: 'Q4/index.html',
        description: 'ACID properties and concurrency',
        progress: 0
    },
    'dbms-visualizer': {
        id: 'dbms-visualizer',
        name: 'DBMS Fundamentals Visualizer',
        path: 'Q5/home.html',
        description: 'Interactive DBMS concepts exploration',
        progress: 0
    }
};

// ===========================
// DOM Content Loaded
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Force mobile responsive loading screen immediately
    forceMobileResponsiveLoadingScreen();
    initializeApp();
});

// ===========================
// App Initialization
// ===========================
function initializeApp() {
    // Simulate loading
    simulateLoading();
    
    // Initialize theme
    initializeTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize navigation
    initializeNavigation();
    
    // Load user progress
    loadUserProgress();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup intersection observer for animations
    setupIntersectionObserver();
    
    // Initialize module cards
    initializeModuleCards();
    
    // Setup touch gestures for mobile
    setupTouchGestures();
    
    // Initialize responsive classes
    updateResponsiveClasses();
    
    console.log('🚀 DBMS Learning Platform initialized successfully!');
}

// ===========================
// Loading Screen
// ===========================
function simulateLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.progress-bar');
    const percentageDisplay = document.querySelector('.progress-percentage');
    
    // Add loading class to html and body to prevent scrolling and force background
    document.documentElement.classList.add('loading');
    document.body.classList.add('loading');
    
    // Force background via inline styles as backup
    document.documentElement.style.background = 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #252d42 100%)';
    document.body.style.background = 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #252d42 100%)';
    
    // Initialize particles - optional for new design
    // initializeParticles();
    
    // Simulate loading progress - 10 seconds total
    let progress = 0;
    const totalTime = 10000; // 10 seconds
    const intervalTime = 50; // Update every 50ms
    const incrementPerInterval = (100 / (totalTime / intervalTime)) + (Math.random() * 0.5); // Small random variation
    
    const interval = setInterval(() => {
        progress += incrementPerInterval;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingComplete = true;
                document.documentElement.classList.remove('loading');
                document.body.classList.remove('loading');
                
                // Reset background styles
                document.documentElement.style.background = '';
                document.body.style.background = '';
                // Clean up particles if they exist
                if (window.pJSDom && window.pJSDom[0]) {
                    window.pJSDom[0].pJS.fn.vendors.destroypJS();
                }
            }, 500);
        }
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (percentageDisplay) {
            percentageDisplay.textContent = Math.round(progress) + '%';
        }
    }, intervalTime);
}

// Initialize Subtle Professional Particles.js
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-canvas', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#667eea", "#764ba2", "#7c3aed", "#ffffff"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 2,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.5,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#667eea",
                    "opacity": 0.3,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 200,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
        
        // Add interactive effects
        addMouseGlowEffect();
        addCursorTrail();
        addClickRipples();
        addKeyboardEffects();
        addAudioVisualization();
    }
}

// Enhanced Mouse Effects for Loading Screen
function addMouseGlowEffect() {
    const loadingScreen = document.getElementById('loadingScreen');
    const glow = document.createElement('div');
    glow.className = 'mouse-glow enhanced';
    loadingScreen.appendChild(glow);
    
    loadingScreen.addEventListener('mousemove', (e) => {
        const rect = loadingScreen.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.style.opacity = '1';
        
        // Dynamic color based on position
        const hue = (x / rect.width) * 360;
        glow.style.background = `radial-gradient(circle, hsla(${hue}, 70%, 70%, 0.3) 0%, transparent 70%)`;
    });
    
    loadingScreen.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}

// Cursor Trail Effect
function addCursorTrail() {
    const loadingScreen = document.getElementById('loadingScreen');
    const trail = [];
    const maxTrailLength = 8;
    
    loadingScreen.addEventListener('mousemove', (e) => {
        const rect = loadingScreen.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add new trail point
        trail.push({ x, y, life: 1 });
        
        // Limit trail length
        if (trail.length > maxTrailLength) {
            trail.shift();
        }
        
        // Update existing trail points
        trail.forEach((point, index) => {
            point.life -= 0.1;
            if (point.life <= 0) {
                trail.splice(index, 1);
            }
        });
        
        // Create trail elements
        const existingTrail = loadingScreen.querySelectorAll('.cursor-trail-point');
        existingTrail.forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const trailPoint = document.createElement('div');
            trailPoint.className = 'cursor-trail-point';
            trailPoint.style.left = point.x + 'px';
            trailPoint.style.top = point.y + 'px';
            trailPoint.style.opacity = point.life;
            trailPoint.style.transform = `scale(${point.life})`;
            loadingScreen.appendChild(trailPoint);
        });
    });
}

// Click Ripple Effect
function addClickRipples() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    loadingScreen.addEventListener('click', (e) => {
        const rect = loadingScreen.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        loadingScreen.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
}

// Keyboard Interactive Effects
function addKeyboardEffects() {
    document.addEventListener('keydown', (e) => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen.classList.contains('hidden')) {
            createKeyboardBurst(e.key);
        }
    });
}

function createKeyboardBurst(key) {
    const loadingScreen = document.getElementById('loadingScreen');
    const burst = document.createElement('div');
    burst.className = 'keyboard-burst';
    burst.textContent = key.toUpperCase();
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    
    loadingScreen.appendChild(burst);
    
    setTimeout(() => {
        burst.remove();
    }, 2000);
}

// Audio Visualization Effect
function addAudioVisualization() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Create audio visualizer bars
    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        bar.style.left = `${(i / 32) * 100}%`;
        bar.style.animationDelay = `${i * 0.1}s`;
        loadingScreen.appendChild(bar);
    }
}

// ===========================
// Theme Management
// ===========================
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('dbms-theme', currentTheme);
    updateThemeIcon();
    
    // Add visual feedback
    showToast(`Switched to ${currentTheme} theme`, 'success');
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===========================
// Event Listeners Setup
// ===========================
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => toggleNavMenu());
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
                closeNavMenu();
            }
        });
    });
    
    // Close nav menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isNavMenuOpen && !e.target.closest('.navbar')) {
            closeNavMenu();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window scroll for navbar
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Hero card interactions
    const heroCards = document.querySelectorAll('.hero-card');
    console.log('Found hero cards:', heroCards.length);
    
    heroCards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            console.log('Hero card clicked:', module);
            
            if (module && modules[module]) {
                const modulePath = modules[module].path;
                console.log('Opening module path:', modulePath);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Navigate to module
                openModule(modulePath);
            } else {
                console.error('Module not found:', module, 'Available modules:', Object.keys(modules));
            }
        });
        
        // Add visual feedback on hover
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// ===========================
// Navigation Management
// ===========================
function initializeNavigation() {
    updateActiveNavLink();
}

function toggleNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    isNavMenuOpen = !isNavMenuOpen;
    navMenu.classList.toggle('active', isNavMenuOpen);
    navToggle.classList.toggle('active', isNavMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isNavMenuOpen ? 'hidden' : 'auto';
}

function closeNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    isNavMenuOpen = false;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Initial call
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===========================
// Smooth Scrolling
// ===========================
function setupSmoothScrolling() {
    // Already handled by CSS scroll-behavior: smooth
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===========================
// Intersection Observer for Animations
// ===========================
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.module-card, .feature-card, .hero-card');
    animatedElements.forEach(el => observer.observe(el));
}

// ===========================
// Module Management
// ===========================
function initializeModuleCards() {
    updateModuleProgress();
    setupModuleInteractions();
}

function setupModuleInteractions() {
    // Setup module cards to be clickable
    const moduleCards = document.querySelectorAll('.module-card[data-module-path]');
    console.log('Found module cards:', moduleCards.length);
    
    moduleCards.forEach(card => {
        const modulePath = card.getAttribute('data-module-path');
        console.log('Setting up card for module:', modulePath);
        
        // Make entire card clickable
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button inside the card
            if (e.target.closest('button')) {
                return;
            }
            
            console.log('Module card clicked:', modulePath);
            
            // Simple click feedback without transform conflicts
            this.classList.add('card-clicked');
            
            setTimeout(() => {
                this.classList.remove('card-clicked');
                openModule(modulePath);
            }, 150);
        });
    });
    
    // Setup module buttons for those who still want to click buttons
    const moduleButtons = document.querySelectorAll('.btn-module');
    console.log('Found module buttons:', moduleButtons.length);
    
    moduleButtons.forEach(button => {
        // Add visual feedback effects
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function openModule(modulePath) {
    console.log('Opening module in new tab:', modulePath);
    
    // Open module in new tab
    try {
        window.open(modulePath, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Error opening module:', error);
        alert('Error opening module. Please check if the file exists.');
    }
}

// Make openModule globally accessible
window.openModule = openModule;

function playIntroVideo() {
    // Create a simple modal or toast instead of alert
    const existingModal = document.querySelector('.video-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        text-align: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; color: black; padding: 30px; border-radius: 10px; max-width: 400px;">
            <h3>🎥 Demo Video</h3>
            <p>Interactive demo video feature is coming soon!</p>
            <button onclick="this.closest('.video-modal').remove()" 
                    style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 3000);
}

// Make playIntroVideo globally accessible  
window.playIntroVideo = playIntroVideo;

function trackModuleAccess(modulePath) {
    const moduleId = getModuleIdFromPath(modulePath);
    if (moduleId && userProgress[moduleId] !== undefined) {
        userProgress[moduleId].lastAccessed = new Date().toISOString();
        saveUserProgress();
    }
}

function getModuleIdFromPath(path) {
    const pathMap = {
        'Q1/home.html': 'fundamentals',
        'Q2/advanced-er-builder.html': 'er-builder',
        'Q3/index.html': 'relational',
        'Q4/index.html': 'transactions'
    };
    return pathMap[path];
}

// ===========================
// Progress Management
// ===========================
function loadUserProgress() {
    // Initialize progress if not exists
    Object.keys(modules).forEach(moduleId => {
        if (!userProgress[moduleId]) {
            userProgress[moduleId] = {
                progress: 0,
                completed: false,
                lastAccessed: null,
                timeSpent: 0
            };
        }
    });
    
    updateModuleProgress();
    saveUserProgress();
}

function updateModuleProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressTexts = document.querySelectorAll('.progress-text');
    
    progressBars.forEach((bar, index) => {
        const moduleId = Object.keys(modules)[index];
        if (moduleId && userProgress[moduleId]) {
            const progress = userProgress[moduleId].progress;
            bar.style.width = `${progress}%`;
            
            if (progressTexts[index]) {
                if (progress === 0) {
                    progressTexts[index].textContent = 'Start Learning';
                } else if (progress < 100) {
                    progressTexts[index].textContent = `${Math.round(progress)}% Complete`;
                } else {
                    progressTexts[index].textContent = 'Completed ✓';
                    progressTexts[index].style.color = 'var(--success)';
                }
            }
        }
    });
}

function saveUserProgress() {
    localStorage.setItem('dbms-progress', JSON.stringify(userProgress));
}

function resetAllProgress() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        userProgress = {};
        localStorage.removeItem('dbms-progress');
        loadUserProgress();
        showToast('All progress has been reset', 'success');
    }
}

// ===========================
// Data Export/Import
// ===========================
function exportAllData() {
    const exportData = {
        progress: userProgress,
        theme: currentTheme,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dbms-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data exported successfully', 'success');
}

// ===========================
// Keyboard Shortcuts
// ===========================
function handleKeyboardShortcuts(e) {
    // Only handle shortcuts when no input is focused
    if (document.activeElement.tagName.toLowerCase() === 'input' || 
        document.activeElement.tagName.toLowerCase() === 'textarea') {
        return;
    }
    
    switch (e.key) {
        case 't':
        case 'T':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleTheme();
            }
            break;
        case 'Escape':
            closeModal();
            closeNavMenu();
            break;
        case 'h':
        case 'H':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                showKeyboardShortcuts();
            }
            break;
        case '1':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                openModule(modules.fundamentals.path);
            }
            break;
        case '2':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                openModule(modules['er-builder'].path);
            }
            break;
        case '3':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                openModule(modules.relational.path);
            }
            break;
        case '4':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                openModule(modules.transactions.path);
            }
            break;
    }
}

// ===========================
// Modal Management
// ===========================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal(modalId) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    } else {
        // Close all modals
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    document.body.style.overflow = 'auto';
}

function showHelp() {
    showModal('helpModal');
}

function showKeyboardShortcuts() {
    const shortcutsHTML = `
        <div class="modal" id="shortcutsModal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('shortcutsModal')">&times;</span>
                <h2>Keyboard Shortcuts</h2>
                <div class="shortcuts-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <div>
                        <h3>Navigation</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><kbd>Ctrl+T</kbd> - Toggle Theme</li>
                            <li><kbd>Ctrl+H</kbd> - Show Help</li>
                            <li><kbd>Esc</kbd> - Close Modal/Menu</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Quick Access</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><kbd>Ctrl+1</kbd> - DBMS Fundamentals</li>
                            <li><kbd>Ctrl+2</kbd> - ER Builder</li>
                            <li><kbd>Ctrl+3</kbd> - Relational Algebra</li>
                            <li><kbd>Ctrl+4</kbd> - Transactions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing shortcuts modal
    const existingModal = document.getElementById('shortcutsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', shortcutsHTML);
    showModal('shortcutsModal');
}

// ===========================
// Toast Notifications
// ===========================
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Toast styles
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--white);
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-lg);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        toast.style.borderLeftColor = 'var(--success)';
        toast.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        toast.style.borderLeftColor = 'var(--error)';
        toast.style.borderLeftWidth = '4px';
    } else if (type === 'warning') {
        toast.style.borderLeftColor = 'var(--warning)';
        toast.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===========================
// Touch Gestures for Mobile
// ===========================
function setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Swipe to close mobile menu
    const navMenu = document.getElementById('navMenu');
    
    if (navMenu && 'ontouchstart' in window) {
        navMenu.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        navMenu.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;
        
        // Swipe left to close menu (when menu is open)
        if (swipeDistance > swipeThreshold && isNavMenuOpen) {
            closeNavMenu();
        }
    }
    
    // Prevent zoom on double tap for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            setTimeout(() => {
                button.click();
            }, 10);
        });
    });
}

// ===========================
// Responsive Layout Management
// ===========================
function adjustLayoutForDevice() {
    const isMobile = window.innerWidth <= 768;
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        if (isMobile) {
            // Ensure touch-friendly spacing on mobile
            card.style.marginBottom = '1.5rem';
        } else {
            card.style.marginBottom = '';
        }
    });
}

// ===========================
// Utility Functions
// ===========================
function handleWindowResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && isNavMenuOpen) {
        closeNavMenu();
    }
    
    // Update responsive classes based on screen size
    updateResponsiveClasses();
    
    // Adjust hero cards layout on mobile
    adjustMobileLayout();
}

function updateResponsiveClasses() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('tablet-view', isTablet);
    document.body.classList.toggle('desktop-view', !isMobile && !isTablet);
}

function adjustMobileLayout() {
    const heroCards = document.querySelectorAll('.hero-card');
    const isMobile = window.innerWidth <= 480;
    
    heroCards.forEach(card => {
        if (isMobile) {
            card.style.minHeight = 'auto';
        } else {
            card.style.minHeight = '';
        }
    });
}

function playIntroVideo() {
    // Placeholder for intro video functionality
    showToast('Demo video coming soon!', 'info');
}

function showPrivacyPolicy() {
    const privacyHTML = `
        <div class="modal" id="privacyModal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('privacyModal')">&times;</span>
                <h2>Privacy Policy</h2>
                <div style="margin-top: 1rem;">
                    <p>This DBMS Learning Platform respects your privacy:</p>
                    <ul>
                        <li>All data is stored locally in your browser</li>
                        <li>No personal information is collected or transmitted</li>
                        <li>Progress tracking is handled client-side only</li>
                        <li>No cookies or tracking scripts are used</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', privacyHTML);
    showModal('privacyModal');
}

function showTerms() {
    const termsHTML = `
        <div class="modal" id="termsModal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('termsModal')">&times;</span>
                <h2>Terms of Use</h2>
                <div style="margin-top: 1rem;">
                    <p>By using this DBMS Learning Platform, you agree to:</p>
                    <ul>
                        <li>Use the platform for educational purposes only</li>
                        <li>Not attempt to reverse engineer or modify the code</li>
                        <li>Respect intellectual property rights</li>
                        <li>Use the platform responsibly and ethically</li>
                    </ul>
                    <p>This platform is provided "as is" for educational use.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', termsHTML);
    showModal('termsModal');
}

function showLicense() {
    const licenseHTML = `
        <div class="modal" id="licenseModal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('licenseModal')">&times;</span>
                <h2>License Information</h2>
                <div style="margin-top: 1rem;">
                    <p><strong>DBMS Learning Platform</strong></p>
                    <p>Educational Use License</p>
                    <p>This software is provided for educational purposes. You may use, study, and learn from this code, but commercial redistribution is not permitted without explicit permission.</p>
                    <p>Built with open-source technologies:</p>
                    <ul>
                        <li>Font Awesome (SIL OFL 1.1)</li>
                        <li>Google Fonts (Open Font License)</li>
                        <li>AOS Library (MIT License)</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', licenseHTML);
    showModal('licenseModal');
}

// ===========================
// Performance Optimization
// ===========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Apply debouncing to resize handler
const debouncedResize = debounce(handleWindowResize, 250);
window.addEventListener('resize', debouncedResize);

// Apply throttling to scroll handler
const throttledScroll = throttle(handleNavbarScroll, 100);
window.addEventListener('scroll', throttledScroll);

// ===========================
// Analytics & Tracking
// ===========================
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics
    console.log('📊 Event tracked:', eventName, eventData);
    
    // Could integrate with analytics services here
    // Example: gtag('event', eventName, eventData);
}

function trackModuleCompletion(moduleId) {
    trackEvent('module_completed', {
        module_id: moduleId,
        completion_time: new Date().toISOString()
    });
}

// ===========================
// Error Handling
// ===========================
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    showToast('An error occurred. Please try again.', 'error');
});

// ===========================
// Service Worker Registration (for PWA capabilities)
// ===========================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        // Service worker registration would go here for PWA functionality
        console.log('🔧 Service worker support detected');
    });
}

// ===========================
// Add dynamic CSS animations
// ===========================
function addDynamicStyles() {
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
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .toast-content i {
            font-size: 1.2em;
        }
        
        .toast-success .toast-content i { color: var(--success); }
        .toast-error .toast-content i { color: var(--error); }
        .toast-warning .toast-content i { color: var(--warning); }
        .toast-info .toast-content i { color: var(--info); }
        
        kbd {
            background: var(--gray-100);
            border: 1px solid var(--gray-300);
            border-radius: 4px;
            padding: 2px 6px;
            font-family: monospace;
            font-size: 0.875em;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// ===========================
// Export global functions for HTML onclick handlers
// ===========================
window.openModule = openModule;
window.showHelp = showHelp;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTerms = showTerms;
window.showLicense = showLicense;
window.closeModal = closeModal;
window.resetAllProgress = resetAllProgress;
window.exportAllData = exportAllData;
window.playIntroVideo = playIntroVideo;

// ===========================
// Development helpers
// ===========================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected');
    
    // Add development helpers
    window.dbmsDebug = {
        modules,
        userProgress,
        currentTheme,
        resetProgress: () => resetAllProgress(),
        showAllModals: () => {
            showHelp();
            setTimeout(() => showKeyboardShortcuts(), 500);
        }
    };
    
    console.log('🛠️ Debug tools available in window.dbmsDebug');
}

// ===========================
// Premium Micro-Interactions
// ===========================
function initializeMicroInteractions() {
    // Add card tilt effect for student card
    const studentCard = document.querySelector('.student-card-premium');
    const avatar = document.querySelector('.student-avatar-premium');
    const metaItems = document.querySelectorAll('.meta-item');

    // Enhanced 3D tilt effect for student card
    if (studentCard) {
        studentCard.addEventListener('mousemove', (e) => {
            const rect = studentCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            studentCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
        });

        studentCard.addEventListener('mouseleave', () => {
            studentCard.style.transform = '';
        });

        // Add click ripple effect
        studentCard.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = studentCard.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: rippleEffect 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10;
            `;

            studentCard.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Enhanced avatar interactions
    if (avatar) {
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.15) rotate(5deg)';
            avatar.style.filter = 'brightness(1.1) saturate(1.2)';
        });

        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = '';
            avatar.style.filter = '';
        });

        avatar.addEventListener('click', () => {
            avatar.style.animation = 'none';
            setTimeout(() => {
                avatar.style.animation = '';
                avatar.classList.add('avatar-pulse');
                setTimeout(() => avatar.classList.remove('avatar-pulse'), 1000);
            }, 10);
        });
    }

    // Staggered hover effects for meta items
    metaItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(8px) scale(1.02)';
            item.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.25)';
            
            // Add subtle glow to icon
            const icon = item.querySelector('.meta-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.4)';
                icon.style.transform = 'scale(1.1)';
            }
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.boxShadow = '';
            
            const icon = item.querySelector('.meta-icon');
            if (icon) {
                icon.style.boxShadow = '';
                icon.style.transform = '';
            }
        });

        // Add click effect
        item.addEventListener('click', () => {
            item.style.transform = 'translateX(8px) scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'translateX(8px) scale(1.02)';
            }, 150);
        });
    });
}

// Add ripple effect keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }

    .avatar-pulse {
        animation: avatarPulseEffect 1s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    @keyframes avatarPulseEffect {
        0% { transform: scale(1); }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize micro-interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeMicroInteractions, 1000); // Delay to ensure card is rendered
});

// Enhanced Mobile Responsiveness Functions
function handleMobileViewport() {
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure viewport has updated
        setTimeout(function() {
            // Force recalculation of viewport units
            document.body.style.height = '100vh';
            setTimeout(() => {
                document.body.style.height = 'auto';
            }, 100);
            
            // Close mobile menu if open during orientation change
            if (isNavMenuOpen) {
                closeNavMenu();
            }
        }, 500);
    });
    
    // Improve touch scrolling
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Handle mobile keyboard appearance
    let initialViewportHeight = window.innerHeight;
    window.addEventListener('resize', function() {
        const currentViewportHeight = window.innerHeight;
        const viewportHeightDiff = initialViewportHeight - currentViewportHeight;
        
        // If viewport shrunk significantly (keyboard appeared)
        if (viewportHeightDiff > 150) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });
}

// Enhanced touch gestures for mobile navigation
function addMobileTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        const swipeThreshold = 100;
        const swipeAngleThreshold = 30;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Check if it's a horizontal swipe
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
            const swipeAngle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
            
            if (swipeAngle < swipeAngleThreshold || swipeAngle > (180 - swipeAngleThreshold)) {
                if (deltaX > 0 && isNavMenuOpen) {
                    // Swipe right - close menu if open
                    closeNavMenu();
                } else if (deltaX < 0 && !isNavMenuOpen && touchStartX < 50) {
                    // Swipe left from edge - open menu
                    toggleNavMenu();
                }
            }
        }
    }
}

// Optimize animations for mobile performance
function optimizeMobileAnimations() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce or disable heavy animations on mobile
        const style = document.createElement('style');
        style.textContent = `
            .floating-particles,
            .wave-animation,
            .hero-particles {
                display: none !important;
            }
            
            .loading-screen * {
                animation-duration: 0.3s !important;
            }
            
            .module-card:hover {
                transform: translateY(-2px) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize mobile enhancements
if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    handleMobileViewport();
    addMobileTouchGestures();
    optimizeMobileAnimations();
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isNavMenuOpen) {
        closeNavMenu();
    }
});

// Force mobile responsive layout for loading screen
function forceMobileResponsiveLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const isMobile = window.innerWidth <= 768;
    
    if (loadingScreen && isMobile) {
        // Add responsive class for mobile-specific styles
        loadingScreen.classList.add('mobile-responsive');
        console.log('📱 Mobile responsive layout class applied');
    }
}

console.log('✅ DBMS Learning Platform JavaScript loaded successfully!');