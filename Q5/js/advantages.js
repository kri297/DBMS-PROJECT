// DBMS Advantages Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('DBMS Advantages page loaded');
    
    // Initialize toggle buttons for advantages view
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const advantagesView = document.getElementById('advantagesView');
    const comparisonView = document.getElementById('comparisonView');
    
    if (toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                
                // Update active state
                toggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle views
                if (view === 'advantages') {
                    advantagesView.classList.remove('hidden');
                    comparisonView.classList.add('hidden');
                } else {
                    advantagesView.classList.add('hidden');
                    comparisonView.classList.remove('hidden');
                }
            });
        });
    }
    
    // Add hover effects to advantage cards
    const advantageCards = document.querySelectorAll('.advantage-card');
    advantageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
