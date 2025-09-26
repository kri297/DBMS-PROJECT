// DBMS Advantages Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize ROI calculator
    initROICalculator();
    
    // Initialize interactive features
    initInteractiveFeatures();
    
    // Initialize comparison table interactions
    initComparisonTable();
    
    // Initialize case study animations
    initCaseStudies();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.stat-item, .benefit-card, .case-study-card, .result-item'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ROI Calculator
function initROICalculator() {
    const companySize = document.getElementById('company-size');
    const dataVolume = document.getElementById('data-volume');
    const usersCount = document.getElementById('users-count');
    const complexity = document.getElementById('complexity');
    
    // Update range value displays
    dataVolume.addEventListener('input', function() {
        const value = this.value;
        const display = this.nextElementSibling;
        display.textContent = `${value} GB`;
    });
    
    usersCount.addEventListener('input', function() {
        const value = this.value;
        const display = this.nextElementSibling;
        display.textContent = `${value} users`;
    });
    
    // Auto-calculate on input changes
    [companySize, dataVolume, usersCount, complexity].forEach(input => {
        input.addEventListener('change', calculateROI);
    });
}

// Calculate ROI function
function calculateROI() {
    const companySize = document.getElementById('company-size').value;
    const dataVolume = parseInt(document.getElementById('data-volume').value);
    const usersCount = parseInt(document.getElementById('users-count').value);
    const complexity = document.getElementById('complexity').value;
    
    // Base costs calculation
    let baseCost = 10000;
    
    // Company size multiplier
    const sizeMultiplier = {
        'small': 1,
        'medium': 2.5,
        'large': 5
    };
    
    // Complexity multiplier
    const complexityMultiplier = {
        'simple': 1,
        'moderate': 1.5,
        'complex': 2.5
    };
    
    // Calculate costs
    const sizeFactor = sizeMultiplier[companySize] || 1;
    const complexityFactor = complexityMultiplier[complexity] || 1;
    const dataFactor = Math.max(1, dataVolume / 1000);
    const usersFactor = Math.max(1, usersCount / 50);
    
    // File System costs (higher maintenance, redundancy issues)
    const fileSystemCost = Math.round(baseCost * sizeFactor * complexityFactor * dataFactor * usersFactor * 1.8);
    
    // DBMS costs (more efficient, better optimization)
    const dbmsCost = Math.round(baseCost * sizeFactor * complexityFactor * Math.log(dataFactor + 1) * Math.log(usersFactor + 1));
    
    // Calculate savings and ROI
    const savings = fileSystemCost - dbmsCost;
    const roiPercent = Math.round((savings / dbmsCost) * 100);
    const paybackMonths = Math.max(1, Math.round(12 / (roiPercent / 100)));
    
    // Update display with animation
    updateResultWithAnimation('fs-cost', `$${fileSystemCost.toLocaleString()}`);
    updateResultWithAnimation('dbms-cost', `$${dbmsCost.toLocaleString()}`);
    updateResultWithAnimation('savings', `$${savings.toLocaleString()}`);
    updateResultWithAnimation('roi-percent', `${roiPercent}%`);
    updateResultWithAnimation('payback', `${paybackMonths} months`);
    
    // Show success message
    showToast('ROI calculated successfully!', 'success');
}

// Update result with animation
function updateResultWithAnimation(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#28a745';
        
        setTimeout(() => {
            element.textContent = value;
            element.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            element.style.color = '';
        }, 500);
    }
}

// Interactive Features
function initInteractiveFeatures() {
    // Add hover effects to stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('click', function() {
            const examples = this.querySelector('.benefit-examples');
            const isExpanded = examples.style.maxHeight && examples.style.maxHeight !== '0px';
            
            if (isExpanded) {
                examples.style.maxHeight = '0px';
                examples.style.opacity = '0';
            } else {
                examples.style.maxHeight = examples.scrollHeight + 'px';
                examples.style.opacity = '1';
            }
        });
    });
}

// Comparison Table Interactions
function initComparisonTable() {
    const tableRows = document.querySelectorAll('.professional-table tbody tr');
    
    tableRows.forEach((row, index) => {
        // Add progressive animation delay
        row.style.animationDelay = `${index * 0.1}s`;
        
        // Add click interaction
        row.addEventListener('click', function() {
            // Remove active class from all rows
            tableRows.forEach(r => r.classList.remove('active-row'));
            
            // Add active class to clicked row
            this.classList.add('active-row');
            
            // Highlight effect
            this.style.background = 'rgba(102, 126, 234, 0.1)';
            this.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Add hover sound effect (visual feedback)
        row.addEventListener('mouseenter', function() {
            this.style.borderLeft = '4px solid #667eea';
        });
        
        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active-row')) {
                this.style.borderLeft = '';
            }
        });
    });
}

// Case Studies Interactions
function initCaseStudies() {
    const caseCards = document.querySelectorAll('.case-study-card');
    
    caseCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Animate metrics
            const metrics = this.querySelectorAll('.metric');
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        metric.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
        });
        
        // Add floating animation
        let animationId;
        card.addEventListener('mouseenter', function() {
            let position = 0;
            const animate = () => {
                position += 0.5;
                this.style.transform = `translateY(${Math.sin(position) * 2 - 10}px)`;
                animationId = requestAnimationFrame(animate);
            };
            animate();
        });
        
        card.addEventListener('mouseleave', function() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            this.style.transform = 'translateY(0)';
        });
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#28a745' : '#667eea',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on type
        if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (element.textContent.includes('x')) {
            element.textContent = Math.floor(current) + 'x';
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

// Initialize counter animations when stats come into view
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-item h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                animateCounter(entry.target, number);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Add focus indicators for better accessibility
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid #667eea';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
});

// Performance optimization - Lazy load heavy content
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('.case-study-card, .benefit-card');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyElements.forEach(el => {
        lazyObserver.observe(el);
    });
}

// Initialize all features when page loads
window.addEventListener('load', function() {
    initCounterAnimations();
    initLazyLoading();
    
    // Add subtle parallax effect to header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.page-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});