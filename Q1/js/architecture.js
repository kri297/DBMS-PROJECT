// Three-Schema Architecture Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Schema Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const schemaViews = document.querySelectorAll('.schema-view');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const schemaType = button.dataset.schema;
            
            // Remove active class from all buttons and views
            tabButtons.forEach(btn => btn.classList.remove('active'));
            schemaViews.forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked button and corresponding view
            button.classList.add('active');
            document.getElementById(`${schemaType}-view`).classList.add('active');
            
            // Analytics or tracking can be added here
            console.log(`Switched to ${schemaType} schema view`);
        });
    });
    
    // Enhanced hover effects for schema levels
    const schemaLevels = document.querySelectorAll('.schema-level');
    
    schemaLevels.forEach(level => {
        level.addEventListener('mouseenter', function() {
            // Add highlighting effect
            this.style.borderLeftWidth = '8px';
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        level.addEventListener('mouseleave', function() {
            // Reset to normal state
            this.style.borderLeftWidth = '6px';
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Independence cards interaction
    const independenceCards = document.querySelectorAll('.independence-card');
    
    independenceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Add some visual feedback
            if (this.classList.contains('expanded')) {
                this.style.borderTopWidth = '8px';
            } else {
                this.style.borderTopWidth = '4px';
            }
        });
    });
    
    // Smooth animations for benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animation to all benefit items
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Interactive demo enhancement
    const demoTables = document.querySelectorAll('.demo-table table');
    
    demoTables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e3f2fd';
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'all 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                this.style.transform = 'scale(1)';
            });
        });
    });
    
    // Entity relationship diagram interactions
    const entities = document.querySelectorAll('.entity');
    
    entities.forEach(entity => {
        entity.addEventListener('mouseenter', function() {
            this.style.borderColor = '#e74c3c';
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        entity.addEventListener('mouseleave', function() {
            this.style.borderColor = '#3498db';
            this.style.transform = 'scale(1)';
        });
    });
    
    // Storage items tooltip functionality
    const storageItems = document.querySelectorAll('.storage-item');
    
    storageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Create and show a tooltip with more details
            const tooltip = document.createElement('div');
            tooltip.className = 'storage-tooltip';
            tooltip.innerHTML = getStorageTooltipContent(this);
            document.body.appendChild(tooltip);
            
            // Position the tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                top: ${rect.top - 10}px;
                left: ${rect.right + 10}px;
                background: #2c3e50;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                max-width: 250px;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                opacity: 0;
                transform: translateX(-10px);
                transition: all 0.3s ease;
            `;
            
            // Animate in
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(0)';
            }, 10);
        });
        
        item.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.storage-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 300);
            }
        });
    });
    
    // Progress tracking
    let sectionsViewed = new Set();
    
    const sections = document.querySelectorAll('section[class*="section"]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionsViewed.add(entry.target.className);
                updateProgress();
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    function updateProgress() {
        const progress = (sectionsViewed.size / sections.length) * 100;
        // Could update a progress bar here
        console.log(`Page completion: ${progress.toFixed(0)}%`);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'n') {
            // Next tab
            const activeTab = document.querySelector('.tab-btn.active');
            const nextTab = activeTab.nextElementSibling;
            if (nextTab && nextTab.classList.contains('tab-btn')) {
                nextTab.click();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'p') {
            // Previous tab
            const activeTab = document.querySelector('.tab-btn.active');
            const prevTab = activeTab.previousElementSibling;
            if (prevTab && prevTab.classList.contains('tab-btn')) {
                prevTab.click();
            }
        }
    });
    
    console.log('Three-Schema Architecture page loaded successfully');
});

// Helper function for storage tooltips
function getStorageTooltipContent(element) {
    const title = element.querySelector('h4').textContent;
    
    const tooltipContent = {
        'File Organization': 'Heap files store records in insertion order. Clustered indexes physically order data by key values for faster range queries.',
        'Index Structures': 'B+ trees provide efficient range queries and point lookups. Hash indexes offer O(1) average case for equality searches.',
        'Buffer Management': 'LRU (Least Recently Used) replacement ensures frequently accessed pages stay in memory. Larger pages reduce I/O overhead.'
    };
    
    return tooltipContent[title.replace(/.*\s/, '')] || 'Additional technical details about this storage aspect.';
}

// Interactive functions for enhanced user experience
window.highlightRow = function(row) {
    // Remove highlight from all rows
    document.querySelectorAll('.table-row').forEach(r => r.classList.remove('highlighted'));
    
    // Add highlight to clicked row
    row.classList.add('highlighted');
    
    // Show student details popup
    const studentName = row.children[1].textContent;
    const major = row.children[2].textContent;
    const gpa = row.children[3].textContent;
    
    showStudentPopup(studentName, major, gpa);
};

window.highlightEntity = function(entity) {
    // Remove highlight from all entities
    document.querySelectorAll('.clickable-entity').forEach(e => e.classList.remove('entity-highlighted'));
    
    // Add highlight to clicked entity
    entity.classList.add('entity-highlighted');
    
    // Show entity details
    const entityName = entity.querySelector('h4').textContent;
    showEntityDetails(entityName);
};

window.highlightRelationship = function(relationship) {
    relationship.classList.toggle('relationship-active');
    
    // Show relationship details
    showRelationshipDetails();
};

function showStudentPopup(name, major, gpa) {
    // Create or update popup
    let popup = document.getElementById('student-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'student-popup';
        popup.className = 'student-popup';
        document.body.appendChild(popup);
    }
    
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
            <h3>🎓 ${name}</h3>
            <p><strong>Major:</strong> ${major}</p>
            <p><strong>CGPA:</strong> ${gpa}</p>
            <div class="student-details">
                <p><strong>Academic Year:</strong> ${getRandomYear()}</p>
                <p><strong>State:</strong> ${getRandomState()}</p>
                <p><strong>Languages:</strong> ${getRandomLanguages()}</p>
            </div>
        </div>
    `;
    
    popup.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

function showEntityDetails(entityName) {
    // Just visual feedback without notification
    console.log(`${entityName} entity selected`);
}

function showRelationshipDetails() {
    // Just visual feedback without notification
    console.log('Relationship interaction');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getRandomYear() {
    const years = ['2021', '2022', '2023', '2024'];
    return years[Math.floor(Math.random() * years.length)];
}

function getRandomState() {
    const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal'];
    return states[Math.floor(Math.random() * states.length)];
}

function getRandomLanguages() {
    const languages = ['Hindi, English', 'Telugu, English', 'Tamil, English', 'Gujarati, Hindi', 'Bengali, Hindi'];
    return languages[Math.floor(Math.random() * languages.length)];
}

window.showStorageDetails = function(storageType) {
    const details = {
        'file': {
            title: '📁 File Organization in Indian Universities',
            content: 'Heap files store student records in insertion order. With millions of students across India, clustered indexing on StudentID ensures efficient data retrieval for admission, examination, and certification processes.'
        },
        'index': {
            title: '🔍 Index Structure Benefits',
            content: 'B+ tree indexes enable efficient range queries for academic year searches and grade analysis. Hash indexes provide instant student lookup using email or ID, essential for online examination systems and result processing.'
        },
        'buffer': {
            title: '💾 Memory Management Strategy',
            content: 'LRU policy keeps frequently accessed student data (current semester enrollments, active courses) in memory. 64KB pages optimize I/O for batch operations like result generation and fee collection across multiple colleges.'
        },
        'backup': {
            title: '🔒 Security & Compliance',
            content: 'Encrypted storage protects sensitive student information including Aadhaar details, marks, and personal data. Daily backups ensure data availability during peak admission seasons and examination periods.'
        }
    };
    
    const detail = details[storageType];
    if (detail) {
        // Just highlight the clicked storage item without showing notification
        document.querySelectorAll('.clickable-storage').forEach(item => {
            item.classList.remove('storage-highlighted');
        });
        
        event.target.closest('.clickable-storage').classList.add('storage-highlighted');
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
            event.target.closest('.clickable-storage').classList.remove('storage-highlighted');
        }, 2000);
    }
};

// Export for use by other scripts
window.ArchitecturePage = {
    switchTab: function(schemaType) {
        const button = document.querySelector(`[data-schema="${schemaType}"]`);
        if (button) button.click();
    },
    
    getProgress: function() {
        return (sectionsViewed.size / document.querySelectorAll('section[class*="section"]').length) * 100;
    }
};