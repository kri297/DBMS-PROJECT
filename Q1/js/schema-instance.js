// Schema vs Instance Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all interactive features
    initScrollAnimations();
    initViewToggle();
    initDataTableFeatures();
    initInteractiveFeatures();
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
        '.concept-card, .difference-item, .analogy-item, .practice-card'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// View Toggle Functionality
function initViewToggle() {
    const toggleButtons = document.querySelectorAll('.view-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding view with animation
            showView(viewType);
        });
    });
}

// Show specific view with animation
function showView(viewType) {
    const schemaView = document.getElementById('schema-view');
    const instanceView = document.getElementById('instance-view');
    
    if (viewType === 'schema') {
        // Animate schema view
        schemaView.style.transform = 'scale(1.02)';
        schemaView.style.boxShadow = '0 15px 40px rgba(67, 206, 162, 0.3)';
        
        // Reset instance view
        instanceView.style.transform = 'scale(1)';
        instanceView.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        
        // Highlight schema elements
        const columnDefs = document.querySelectorAll('.column-def');
        columnDefs.forEach((def, index) => {
            setTimeout(() => {
                def.style.background = 'linear-gradient(90deg, rgba(67, 206, 162, 0.1), transparent)';
                def.style.transform = 'translateX(5px)';
                
                setTimeout(() => {
                    def.style.background = '';
                    def.style.transform = '';
                }, 500);
            }, index * 100);
        });
        
    } else if (viewType === 'instance') {
        // Animate instance view
        instanceView.style.transform = 'scale(1.02)';
        instanceView.style.boxShadow = '0 15px 40px rgba(250, 112, 154, 0.3)';
        
        // Reset schema view
        schemaView.style.transform = 'scale(1)';
        schemaView.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        
        // Animate table rows
        const tableRows = document.querySelectorAll('.data-table tbody tr');
        tableRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.background = 'rgba(250, 112, 154, 0.1)';
                row.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    row.style.background = '';
                    row.style.transform = '';
                }, 500);
            }, index * 100);
        });
    }
}

// Data Table Interactive Features
function initDataTableFeatures() {
    // Sample data with Indian names
    const sampleData = [
        ['1004', 'Ananya', 'Gupta', 'ananya.gupta@university.edu', '2023-10-01', '3.68'],
        ['1005', 'Rajesh', 'Kumar', 'rajesh.kumar@university.edu', '2023-09-25', '3.89'],
        ['1006', 'Meera', 'Nair', 'meera.nair@university.edu', '2023-10-15', '3.23'],
        ['1007', 'Aditya', 'Jain', 'aditya.jain@university.edu', '2023-10-20', '3.97'],
        ['1008', 'Kavya', 'Reddy', 'kavya.reddy@university.edu', '2023-11-01', '3.55'],
        ['1009', 'Suresh', 'Bhat', 'suresh.bhat@university.edu', '2023-11-10', '3.78'],
        ['1010', 'Deepika', 'Agarwal', 'deepika.agarwal@university.edu', '2023-11-15', '3.41']
    ];
    
    let sampleIndex = 0;
    
    // Global functions for buttons (defined in global scope)
    window.addSampleRecord = function() {
        const tbody = document.getElementById('data-tbody');
        
        if (sampleIndex < sampleData.length) {
            const newRow = document.createElement('tr');
            newRow.classList.add('new-record');
            
            const rowData = sampleData[sampleIndex];
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                newRow.appendChild(cell);
            });
            
            tbody.appendChild(newRow);
            sampleIndex++;
            
            // Add click interaction to new row
            addRowInteraction(newRow);
            
            // Show success message
            showToast(`New student record added: ${rowData[1]} ${rowData[2]}`, 'success');
            
            // Scroll into view
            newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } else {
            showToast('No more sample records available', 'info');
        }
    };
    
    window.clearAllData = function() {
        const tbody = document.getElementById('data-tbody');
        const rows = tbody.querySelectorAll('tr');
        
        // Animate rows out
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (row.parentNode) {
                        row.parentNode.removeChild(row);
                    }
                }, 300);
            }, index * 50);
        });
        
        // Reset sample index
        sampleIndex = 0;
        
        showToast('All records cleared', 'info');
    };
    
    // Add interaction to existing rows
    const existingRows = document.querySelectorAll('.data-table tbody tr');
    existingRows.forEach(addRowInteraction);
}

// Add interaction to a table row
function addRowInteraction(row) {
    row.addEventListener('click', function() {
        // Remove active class from all rows
        const allRows = document.querySelectorAll('.data-table tbody tr');
        allRows.forEach(r => r.classList.remove('active-row'));
        
        // Add active class to clicked row
        this.classList.add('active-row');
        this.style.background = 'rgba(67, 206, 162, 0.2)';
        
        // Show record details in toast
        const cells = this.querySelectorAll('td');
        const studentInfo = `${cells[1].textContent} ${cells[2].textContent} (ID: ${cells[0].textContent})`;
        showToast(`Selected student: ${studentInfo}`, 'info');
    });
    
    row.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active-row')) {
            this.style.background = '';
        }
    });
}

// Interactive Features
function initInteractiveFeatures() {
    // Concept card interactions
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add pulse effect to icon
            const icon = this.querySelector('.concept-icon');
            icon.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const icon = this.querySelector('.concept-icon');
            icon.style.animation = '';
        });
        
        card.addEventListener('click', function() {
            // Toggle expanded view
            this.classList.toggle('expanded');
            
            const features = this.querySelector('.concept-features');
            const isExpanded = this.classList.contains('expanded');
            
            if (isExpanded) {
                features.style.maxHeight = features.scrollHeight + 'px';
                features.style.opacity = '1';
                this.style.background = 'linear-gradient(135deg, rgba(67, 206, 162, 0.05), transparent)';
            } else {
                features.style.maxHeight = '200px';
                features.style.opacity = '0.8';
                this.style.background = 'white';
            }
        });
    });
    
    // Difference item hover effects
    const differenceItems = document.querySelectorAll('.difference-item');
    differenceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const schemaPoint = this.querySelector('.schema-point');
            const instancePoint = this.querySelector('.instance-point');
            
            // Animate comparison points
            if (schemaPoint) {
                schemaPoint.style.transform = 'translateX(5px)';
                schemaPoint.style.borderLeftWidth = '6px';
            }
            
            if (instancePoint) {
                instancePoint.style.transform = 'translateX(5px)';
                instancePoint.style.borderLeftWidth = '6px';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const schemaPoint = this.querySelector('.schema-point');
            const instancePoint = this.querySelector('.instance-point');
            
            if (schemaPoint) {
                schemaPoint.style.transform = 'translateX(0)';
                schemaPoint.style.borderLeftWidth = '4px';
            }
            
            if (instancePoint) {
                instancePoint.style.transform = 'translateX(0)';
                instancePoint.style.borderLeftWidth = '4px';
            }
        });
    });
    
    // Practice card animations
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Animate practice items
            const listItems = this.querySelectorAll('.practice-list li');
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.background = 'rgba(67, 206, 162, 0.1)';
                    item.style.paddingLeft = '1.5rem';
                    item.style.transform = 'scale(1.02)';
                    
                    setTimeout(() => {
                        item.style.background = '';
                        item.style.paddingLeft = '0';
                        item.style.transform = 'scale(1)';
                    }, 300);
                }, index * 100);
            });
        });
    });
}

// CSS Animation keyframes (added dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
    
    .active-row {
        background: rgba(67, 206, 162, 0.2) !important;
        border-left: 4px solid #43cea2 !important;
    }
`;
document.head.appendChild(style);

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
    
    const colors = {
        'success': '#28a745',
        'info': '#43cea2',
        'warning': '#ffc107',
        'error': '#dc3545'
    };
    
    const icons = {
        'success': 'check-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colors[type],
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        fontSize: '0.9rem'
    });
    
    // Style toast content
    const toastContent = toast.querySelector('.toast-content');
    Object.assign(toastContent.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
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

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Add keyboard shortcuts
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        showView('schema');
        showToast('Switched to Schema view', 'info');
    }
    
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        showView('instance');
        showToast('Switched to Instance view', 'info');
    }
    
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        window.addSampleRecord();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        window.clearAllData();
    }
});

// Performance optimizations
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('.concept-card, .difference-item, .analogy-item');
    
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

// Add smooth scrolling and parallax effects
window.addEventListener('load', function() {
    initLazyLoading();
    
    // Add subtle parallax effect to header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.page-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    // Show keyboard shortcuts hint
    setTimeout(() => {
        showToast('Tip: Use Ctrl+1 for Schema view, Ctrl+2 for Instance view, or try editing the schema and data!', 'info');
    }, 2000);
});

// Schema Editing Functions
let schemaEditMode = false;
let currentEditingRow = -1;

window.toggleSchemaEdit = function() {
    schemaEditMode = !schemaEditMode;
    const editableElements = document.querySelectorAll('.editable');
    const schemaActions = document.getElementById('schema-actions');
    const deleteButtons = document.querySelectorAll('.delete-column-btn');
    const editButton = document.querySelector('.edit-schema-btn');
    
    if (schemaEditMode) {
        // Enable editing mode
        editableElements.forEach(el => {
            el.contentEditable = 'true';
            el.style.background = '#fff3cd';
        });
        
        schemaActions.style.display = 'flex';
        
        deleteButtons.forEach(btn => {
            btn.style.display = 'block';
        });
        
        editButton.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
        editButton.style.background = '#dc3545';
        
        showToast('Schema editing enabled! Click on fields to edit them.', 'info');
        
    } else {
        // Disable editing mode
        editableElements.forEach(el => {
            el.contentEditable = 'false';
            el.style.background = '';
        });
        
        schemaActions.style.display = 'none';
        
        deleteButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit Schema';
        editButton.style.background = 'rgba(255,255,255,0.2)';
        
        showToast('Schema editing disabled', 'info');
    }
};

window.addNewColumn = function() {
    const schemaStructure = document.getElementById('schema-structure');
    const columnCount = schemaStructure.querySelectorAll('.column-def').length;
    
    const newColumn = document.createElement('div');
    newColumn.className = 'column-def';
    newColumn.setAttribute('data-column', columnCount);
    
    newColumn.innerHTML = `
        <span class="column-name editable" contenteditable="true">new_column</span>
        <span class="column-type editable" contenteditable="true">VARCHAR(255)</span>
        <span class="column-constraint editable" contenteditable="true">NULL</span>
        <button class="delete-column-btn" onclick="deleteColumn(${columnCount})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    schemaStructure.appendChild(newColumn);
    
    // Focus on the column name
    newColumn.querySelector('.column-name').focus();
    
    // Add new header to table
    const tableHeader = document.querySelector('.data-table thead tr');
    const newHeader = document.createElement('th');
    newHeader.textContent = 'new_column';
    tableHeader.insertBefore(newHeader, tableHeader.lastElementChild); // Insert before Actions column
    
    // Add new cell to each data row
    const dataRows = document.querySelectorAll('.data-table tbody tr');
    dataRows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.className = 'editable-cell';
        newCell.contentEditable = 'false';
        newCell.textContent = 'NULL';
        row.insertBefore(newCell, row.lastElementChild); // Insert before Actions cell
    });
    
    showToast('New column added! Edit the column properties.', 'success');
};

window.deleteColumn = function(columnIndex) {
    if (confirm('Are you sure you want to delete this column? This will remove all data in this column.')) {
        // Remove from schema structure
        const columnDef = document.querySelector(`[data-column="${columnIndex}"]`);
        if (columnDef) {
            columnDef.remove();
        }
        
        // Remove from table header (add 1 to skip the action column)
        const headers = document.querySelectorAll('.data-table th');
        if (headers[columnIndex]) {
            headers[columnIndex].remove();
        }
        
        // Remove from all data rows
        const dataRows = document.querySelectorAll('.data-table tbody tr');
        dataRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[columnIndex]) {
                cells[columnIndex].remove();
            }
        });
        
        // Reindex remaining columns
        const remainingColumns = document.querySelectorAll('.column-def');
        remainingColumns.forEach((col, index) => {
            col.setAttribute('data-column', index);
            const deleteBtn = col.querySelector('.delete-column-btn');
            if (deleteBtn) {
                deleteBtn.setAttribute('onclick', `deleteColumn(${index})`);
            }
        });
        
        showToast('Column deleted successfully!', 'success');
    }
};

window.saveSchemaChanges = function() {
    // Update table headers based on schema changes
    const columnNames = document.querySelectorAll('.column-name');
    const tableHeaders = document.querySelectorAll('.data-table th');
    
    columnNames.forEach((nameSpan, index) => {
        if (tableHeaders[index]) {
            tableHeaders[index].textContent = nameSpan.textContent;
        }
    });
    
    showToast('Schema changes saved successfully!', 'success');
    
    // Exit edit mode
    toggleSchemaEdit();
};

window.cancelSchemaEdit = function() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        // Reload the page to revert changes
        location.reload();
    }
};

// Data Editing Functions
window.editRow = function(rowIndex) {
    if (currentEditingRow !== -1 && currentEditingRow !== rowIndex) {
        showToast('Please finish editing the current row first.', 'warning');
        return;
    }
    
    const row = document.querySelector(`[data-row="${rowIndex}"]`);
    const editableCells = row.querySelectorAll('.editable-cell');
    const editButton = row.querySelector('.edit-row-btn');
    
    if (currentEditingRow === rowIndex) {
        // Save changes
        editableCells.forEach(cell => {
            cell.contentEditable = 'false';
        });
        
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.style.background = '';
        currentEditingRow = -1;
        
        showToast('Row changes saved!', 'success');
        
    } else {
        // Enable editing
        editableCells.forEach(cell => {
            cell.contentEditable = 'true';
        });
        
        editButton.innerHTML = '<i class="fas fa-save"></i>';
        editButton.style.background = '#28a745';
        editButton.style.color = 'white';
        currentEditingRow = rowIndex;
        
        showToast('Row editing enabled. Click save when done.', 'info');
    }
};

window.deleteRow = function(rowIndex) {
    if (confirm('Are you sure you want to delete this student record?')) {
        const row = document.querySelector(`[data-row="${rowIndex}"]`);
        if (row) {
            row.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                row.remove();
                // Reindex remaining rows
                const remainingRows = document.querySelectorAll('.data-table tbody tr');
                remainingRows.forEach((r, index) => {
                    r.setAttribute('data-row', index);
                    const editBtn = r.querySelector('.edit-row-btn');
                    const deleteBtn = r.querySelector('.delete-row-btn');
                    if (editBtn) editBtn.setAttribute('onclick', `editRow(${index})`);
                    if (deleteBtn) deleteBtn.setAttribute('onclick', `deleteRow(${index})`);
                });
                showToast('Student record deleted successfully!', 'success');
            }, 300);
        }
    }
};

window.showAddForm = function() {
    const form = document.getElementById('add-record-form');
    form.style.display = 'block';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('new-enrollment-date').value = today;
    
    // Focus on first input
    document.getElementById('new-student-id').focus();
    
    showToast('Fill in the student details below', 'info');
};

window.hideAddForm = function() {
    const form = document.getElementById('add-record-form');
    form.style.display = 'none';
    
    // Clear form
    document.getElementById('new-student-id').value = '';
    document.getElementById('new-first-name').value = '';
    document.getElementById('new-last-name').value = '';
    document.getElementById('new-email').value = '';
    document.getElementById('new-enrollment-date').value = '';
    document.getElementById('new-gpa').value = '';
};

window.saveNewRecord = function() {
    // Get form values
    const studentId = document.getElementById('new-student-id').value;
    const firstName = document.getElementById('new-first-name').value;
    const lastName = document.getElementById('new-last-name').value;
    const email = document.getElementById('new-email').value;
    const enrollmentDate = document.getElementById('new-enrollment-date').value;
    const gpa = document.getElementById('new-gpa').value;
    
    // Validate required fields
    if (!studentId || !firstName || !lastName || !email || !enrollmentDate || !gpa) {
        showToast('Please fill in all required fields!', 'error');
        return;
    }
    
    // Validate GPA range
    if (parseFloat(gpa) < 0 || parseFloat(gpa) > 4) {
        showToast('GPA must be between 0.0 and 4.0!', 'error');
        return;
    }
    
    // Check for duplicate student ID
    const existingIds = Array.from(document.querySelectorAll('.data-table tbody tr td:first-child'))
        .map(cell => cell.textContent);
    
    if (existingIds.includes(studentId)) {
        showToast('Student ID already exists! Please use a different ID.', 'error');
        return;
    }
    
    // Add new row to table
    const tbody = document.getElementById('data-tbody');
    const rowCount = tbody.querySelectorAll('tr').length;
    
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row', rowCount);
    newRow.classList.add('new-record');
    
    newRow.innerHTML = `
        <td class="editable-cell" contenteditable="false">${studentId}</td>
        <td class="editable-cell" contenteditable="false">${firstName}</td>
        <td class="editable-cell" contenteditable="false">${lastName}</td>
        <td class="editable-cell" contenteditable="false">${email}</td>
        <td class="editable-cell" contenteditable="false">${enrollmentDate}</td>
        <td class="editable-cell" contenteditable="false">${parseFloat(gpa).toFixed(2)}</td>
        <td class="action-cell">
            <button class="edit-row-btn" onclick="editRow(${rowCount})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-row-btn" onclick="deleteRow(${rowCount})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    
    // Add row interaction
    addRowInteraction(newRow);
    
    // Hide form and show success message
    hideAddForm();
    showToast(`New student ${firstName} ${lastName} added successfully!`, 'success');
    
    // Scroll new row into view
    newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Interactive Analogy Functions
window.highlightAnalogy = function(element, type) {
    // Remove highlight from all analogies
    document.querySelectorAll('.analogy-item').forEach(item => {
        item.classList.remove('highlighted');
    });
    
    // Add highlight to clicked analogy
    element.classList.add('highlighted');
    
    // Add special effects based on type
    if (type === 'construction') {
        triggerConstructionAnimation(element);
    } else if (type === 'publishing') {
        triggerPublishingAnimation(element);
    } else if (type === 'app') {
        triggerAppAnimation(element);
    }
    
    // Log interaction for analytics
    console.log(`Analogy interaction: ${type}`);
};

function triggerConstructionAnimation(element) {
    const header = element.querySelector('.analogy-header');
    header.style.animation = 'constructionPulse 0.6s ease-in-out';
    
    setTimeout(() => {
        header.style.animation = '';
    }, 600);
}

function triggerPublishingAnimation(element) {
    const header = element.querySelector('.analogy-header');
    header.style.animation = 'publishingWave 0.8s ease-in-out';
    
    setTimeout(() => {
        header.style.animation = '';
    }, 800);
}

function triggerAppAnimation(element) {
    const header = element.querySelector('.analogy-header');
    header.style.animation = 'appGlow 1s ease-in-out';
    
    setTimeout(() => {
        header.style.animation = '';
    }, 1000);
}