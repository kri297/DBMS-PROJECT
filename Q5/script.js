// ===========================
// Global Variables & Configuration
// ===========================
let currentTheme = localStorage.getItem('dbms-theme') || 'light';
let currentLayer = 'external';
let employeeData = [
    { id: 101, name: 'John Doe', salary: 50000, dept: 1 },
    { id: 102, name: 'Jane Smith', salary: 60000, dept: 2 },
    { id: 103, name: 'Bob Johnson', salary: 55000, dept: 1 }
];

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeTheme();
    initializeArchitecture();
    initializeSchemaInstance();
    initializeAdvantages();
    initializeScrollEffects();
    initializeAOS();
    updateInstanceTime();
    
    console.log('🚀 DBMS Fundamentals Visualizer Pro initialized successfully!');
});

// ===========================
// Particle Background
// ===========================
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: '#667eea' },
                shape: { type: 'circle' },
                opacity: { value: 0.4, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#667eea',
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// ===========================
// AOS Animation Library
// ===========================
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

// ===========================
// Theme Management
// ===========================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    updateThemeIcon();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('dbms-theme', currentTheme);
    updateThemeIcon();
    document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===========================
// Scroll Effects
// ===========================
function initializeScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    const progressIndicator = document.getElementById('progressIndicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (progressIndicator) {
            progressIndicator.style.width = scrollPercentage + '%';
        }
        
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < window.innerHeight) {
            hero.style.transform = `translateY(${scrollTop * 0.3}px)`;
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            document.getElementById('architecture-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ===========================
// Three-Schema Architecture
// ===========================
function initializeArchitecture() {
    const controlButtons = document.querySelectorAll('.control-btn');
    const layers = document.querySelectorAll('.schema-layer');
    
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const layer = this.getAttribute('data-layer');
            highlightLayer(layer);
            
            controlButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    layers.forEach(layer => {
        layer.addEventListener('click', function() {
            const layerType = this.id.replace('Layer', '');
            const btn = document.querySelector(`[data-layer="${layerType}"]`);
            if (btn) btn.click();
        });
    });
    
    highlightLayer('external');
    animateDataFlow();
}

function highlightLayer(layer) {
    currentLayer = layer;
    const layers = document.querySelectorAll('.schema-layer');
    const flowLines = document.querySelectorAll('.data-flow-line');
    
    layers.forEach(l => {
        l.classList.remove('highlighted', 'dimmed');
    });
    
    if (layer === 'all') {
        layers.forEach(l => {
            l.classList.add('highlighted');
            l.style.transform = 'scale(1)';
        });
        flowLines.forEach(line => line.classList.add('active'));
    } else {
        layers.forEach(l => {
            if (l.classList.contains(`${layer}-layer`)) {
                l.classList.add('highlighted');
                l.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    l.style.transform = 'scale(1)';
                }, 300);
            } else {
                l.classList.add('dimmed');
                l.style.transform = 'scale(0.98)';
            }
        });
        
        flowLines.forEach(line => line.classList.remove('active'));
        if (layer === 'external' || layer === 'conceptual') {
            document.getElementById('flow1')?.classList.add('active');
        }
        if (layer === 'conceptual' || layer === 'internal') {
            document.getElementById('flow2')?.classList.add('active');
        }
    }
    
    updateLayerInfo(layer);
}

function updateLayerInfo(layer) {
    const layerInfo = document.getElementById('layerInfo');
    const infoContent = {
        external: {
            title: 'External Level (View Level)',
            icon: 'fa-users',
            points: [
                'User-specific views of the database',
                'Data abstraction and security',
                'Different perspectives for different users',
                'Hides complexity from end users',
                'Customized data presentation'
            ]
        },
        conceptual: {
            title: 'Conceptual Level (Logical Level)',
            icon: 'fa-sitemap',
            points: [
                'Complete view of the entire database',
                'Defines what data is stored and relationships',
                'Entity-Relationship model',
                'Independent of physical storage',
                'Used by database administrators',
                'Enforces data integrity constraints'
            ]
        },
        internal: {
            title: 'Internal Level (Physical Level)',
            icon: 'fa-hard-drive',
            points: [
                'How data is physically stored',
                'Storage structures and file organization',
                'Indexing methods (B+ Tree, Hash)',
                'Data compression and encryption',
                'Optimization for performance',
                'Buffer management and caching'
            ]
        },
        all: {
            title: 'Three-Schema Architecture',
            icon: 'fa-layer-group',
            points: [
                'Provides data abstraction at multiple levels',
                'Enables data independence',
                'Separates user views from physical storage',
                'Allows changes at one level without affecting others',
                'Core principle of modern DBMS design',
                'Supports multiple simultaneous user views'
            ]
        }
    };
    
    const info = infoContent[layer];
    if (info && layerInfo) {
        layerInfo.innerHTML = `
            <div class="info-header">
                <i class="fas ${info.icon}"></i>
                <h5>${info.title}</h5>
            </div>
            <div class="info-content">
                <ul>
                    ${info.points.map(point => `<li><i class="fas fa-check-circle"></i> ${point}</li>`).join('')}
                </ul>
            </div>
        `;
        layerInfo.style.animation = 'fadeInUp 0.5s ease-out';
    }
}

function animateDataFlow() {
    setInterval(() => {
        const activeFlows = document.querySelectorAll('.data-flow-line.active');
        activeFlows.forEach(flow => {
            flow.style.animation = 'none';
            setTimeout(() => {
                flow.style.animation = 'flowPulse 2s ease-in-out infinite';
            }, 10);
        });
    }, 2000);
}

// ===========================
// Schema vs Instance
// ===========================
function initializeSchemaInstance() {
    const instanceForm = document.getElementById('instanceForm');
    const resetButton = document.getElementById('resetInstance');
    
    if (instanceForm) {
        instanceForm.addEventListener('submit', handleAddEmployee);
        
        const inputs = instanceForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input);
            });
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetInstance);
    }
    
    renderInstanceTable();
}

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

function handleAddEmployee(e) {
    e.preventDefault();
    
    const empId = parseInt(document.getElementById('empId').value);
    const empName = document.getElementById('empName').value.trim();
    const empSalary = parseInt(document.getElementById('empSalary').value);
    const empDept = parseInt(document.getElementById('empDept').value);
    
    if (employeeData.some(emp => emp.id === empId)) {
        showNotification('❌ Employee ID already exists!', 'error');
        return;
    }
    
    if (!empName || empName.length < 2) {
        showNotification('❌ Please enter a valid name!', 'error');
        return;
    }
    
    if (empSalary < 0) {
        showNotification('❌ Salary cannot be negative!', 'error');
        return;
    }
    
    employeeData.push({
        id: empId,
        name: empName,
        salary: empSalary,
        dept: empDept
    });
    
    renderInstanceTable(true);
    e.target.reset();
    updateInstanceTime();
    
    e.target.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    showNotification('✅ Employee added successfully! Instance updated.', 'success');
    createConfetti();
}

function renderInstanceTable(animate = false) {
    const tableBody = document.getElementById('instanceTableBody');
    if (!tableBody) return;
    
    const sortedData = [...employeeData].sort((a, b) => a.id - b.id);
    
    tableBody.innerHTML = sortedData.map((emp, index) => `
        <tr class="${animate && index === sortedData.length - 1 ? 'new-row' : ''}" 
            style="animation-delay: ${index * 0.1}s">
            <td><strong>${emp.id}</strong></td>
            <td>
                <div class="employee-name">
                    <i class="fas fa-user-circle"></i>
                    ${emp.name}
                </div>
            </td>
            <td><span class="salary-badge">$${emp.salary.toLocaleString()}</span></td>
            <td><span class="dept-badge">Dept ${emp.dept}</span></td>
        </tr>
    `).join('');
    
    if (animate) {
        setTimeout(() => {
            const newRow = tableBody.querySelector('.new-row');
            if (newRow) newRow.classList.remove('new-row');
        }, 1000);
    }
}

function resetInstance() {
    employeeData = [
        { id: 101, name: 'John Doe', salary: 50000, dept: 1 },
        { id: 102, name: 'Jane Smith', salary: 60000, dept: 2 },
        { id: 103, name: 'Bob Johnson', salary: 55000, dept: 1 }
    ];
    
    renderInstanceTable();
    updateInstanceTime();
    showNotification('🔄 Instance reset to original state', 'info');
}

function updateInstanceTime() {
    const timestampElement = document.getElementById('instanceTime');
    if (timestampElement) {
        const now = new Date();
        timestampElement.textContent = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// ===========================
// DBMS Advantages
// ===========================
function initializeAdvantages() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const advantageCards = document.querySelectorAll('.advantage-card');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
            
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    advantageCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            const icon = this.querySelector('.advantage-icon');
            if (this.classList.contains('expanded')) {
                icon.style.transform = 'rotateY(360deg)';
            } else {
                icon.style.transform = 'rotateY(0deg)';
            }
        });
        
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function switchView(view) {
    const advantagesView = document.getElementById('advantagesView');
    const comparisonView = document.getElementById('comparisonView');
    
    if (view === 'advantages') {
        advantagesView.classList.remove('hidden');
        comparisonView.classList.add('hidden');
    } else {
        advantagesView.classList.add('hidden');
        comparisonView.classList.remove('hidden');
    }
    
    const activeView = view === 'advantages' ? advantagesView : comparisonView;
    activeView.style.animation = 'fadeIn 0.6s ease-in-out';
}

// ===========================
// Notification System
// ===========================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    }[type] || 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===========================
// Confetti Effect
// ===========================
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const layers = ['external', 'conceptual', 'internal'];
        const currentIndex = layers.indexOf(currentLayer);
        let newIndex;
        
        if (e.key === 'ArrowUp') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : layers.length - 1;
        } else {
            newIndex = currentIndex < layers.length - 1 ? currentIndex + 1 : 0;
        }
        
        const btn = document.querySelector(`[data-layer="${layers[newIndex]}"]`);
        if (btn) btn.click();
    }
});

// ===========================
// Responsive Handling
// ===========================
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile-view', isMobile);
}

window.addEventListener('resize', handleResize);
handleResize();

setInterval(updateInstanceTime, 1000);

console.log('✅ DBMS Fundamentals Visualizer Pro loaded!');
console.log('💡 Tip: Press Ctrl+T to toggle theme');
console.log('⌨️ Tip: Use Arrow Keys to navigate architecture layers');
