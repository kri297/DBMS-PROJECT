// Schema vs Instance Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Schema vs Instance page loaded');
    
    // Initialize instance form if not already initialized by main.js
    const form = document.getElementById('instanceForm');
    const resetBtn = document.getElementById('resetInstance');
    
    if (form && !form.dataset.initialized) {
        form.dataset.initialized = 'true';
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddEmployee();
        });
    }
    
    if (resetBtn && !resetBtn.dataset.initialized) {
        resetBtn.dataset.initialized = 'true';
        
        resetBtn.addEventListener('click', function() {
            // Reset to original data
            employeeData = [
                { id: 101, name: 'John Doe', salary: 50000, dept: 1 },
                { id: 102, name: 'Jane Smith', salary: 60000, dept: 2 },
                { id: 103, name: 'Bob Johnson', salary: 55000, dept: 1 }
            ];
            updateInstanceTable();
            showNotification('Instance reset to original data', 'info');
        });
    }
});
