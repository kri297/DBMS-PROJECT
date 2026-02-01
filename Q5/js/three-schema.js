// Three-Schema Architecture Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Architecture layer highlighting is handled in main.js
    // Additional page-specific functionality can be added here
    
    console.log('Three-Schema Architecture page loaded');
    
    // Add keyboard navigation for layer switching
    document.addEventListener('keydown', function(e) {
        const layers = ['external', 'conceptual', 'internal'];
        let currentIndex = layers.indexOf(currentLayer);
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    highlightLayer(layers[currentIndex - 1]);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < layers.length - 1) {
                    highlightLayer(layers[currentIndex + 1]);
                }
                break;
        }
    });
});
