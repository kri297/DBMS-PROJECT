// Relation class to represent tables
class Relation {
    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
        this.rows = [];
        this.id = 'table_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addRow(rowData) {
        if (rowData.length !== this.columns.length) {
            throw new Error(`Row must have ${this.columns.length} values`);
        }
        this.rows.push([...rowData]);
    }

    removeRow(index) {
        if (index >= 0 && index < this.rows.length) {
            this.rows.splice(index, 1);
        }
    }

    clone() {
        const newRelation = new Relation(this.name + '_copy', [...this.columns]);
        newRelation.rows = this.rows.map(row => [...row]);
        return newRelation;
    }

    // SELECT operation (σ)
    select(condition) {
        const result = new Relation(`σ(${condition})(${this.name})`, [...this.columns]);
        
        for (const row of this.rows) {
            if (this.evaluateCondition(row, condition)) {
                result.addRow(row);
            }
        }
        
        return result;
    }

    // PROJECT operation (π)
    project(selectedColumns) {
        const columnNames = selectedColumns.map(col => col.trim());
        const columnIndices = columnNames.map(colName => {
            const index = this.columns.findIndex(col => 
                col.toLowerCase() === colName.toLowerCase()
            );
            if (index === -1) {
                throw new Error(`Column '${colName}' not found in table '${this.name}'`);
            }
            return index;
        });

        const result = new Relation(`π(${columnNames.join(', ')})(${this.name})`, columnNames);
        
        // Use Set to remove duplicates
        const uniqueRows = new Set();
        
        for (const row of this.rows) {
            const projectedRow = columnIndices.map(index => row[index]);
            const rowKey = JSON.stringify(projectedRow);
            
            if (!uniqueRows.has(rowKey)) {
                uniqueRows.add(rowKey);
                result.addRow(projectedRow);
            }
        }
        
        return result;
    }

    // JOIN operation (⋈)
    static join(relation1, relation2, condition) {
        // Parse join condition (e.g., "Table1.Col1 = Table2.Col2")
        const joinParts = condition.split('=').map(part => part.trim());
        if (joinParts.length !== 2) {
            throw new Error('Invalid join condition format. Use: Table1.Column1 = Table2.Column2');
        }

        const [left, right] = joinParts.map(part => {
            const [tableName, columnName] = part.split('.').map(s => s.trim());
            return { tableName, columnName };
        });

        // Find column indices
        const leftColIndex = relation1.columns.findIndex(col => 
            col.toLowerCase() === left.columnName.toLowerCase()
        );
        const rightColIndex = relation2.columns.findIndex(col => 
            col.toLowerCase() === right.columnName.toLowerCase()
        );

        if (leftColIndex === -1) {
            throw new Error(`Column '${left.columnName}' not found in table '${relation1.name}'`);
        }
        if (rightColIndex === -1) {
            throw new Error(`Column '${right.columnName}' not found in table '${relation2.name}'`);
        }

        // Create result relation with combined columns
        const resultColumns = [
            ...relation1.columns.map(col => `${relation1.name}.${col}`),
            ...relation2.columns.map(col => `${relation2.name}.${col}`)
        ];
        
        const result = new Relation(`${relation1.name} ⋈ ${relation2.name}`, resultColumns);

        // Perform join
        for (const row1 of relation1.rows) {
            for (const row2 of relation2.rows) {
                if (row1[leftColIndex] === row2[rightColIndex]) {
                    result.addRow([...row1, ...row2]);
                }
            }
        }

        return result;
    }

    // UNION operation (∪)
    static union(relation1, relation2) {
        if (relation1.columns.length !== relation2.columns.length) {
            throw new Error('Relations must have the same number of columns for union');
        }

        // Check if columns are compatible (same names or can be aligned)
        const result = new Relation(`${relation1.name} ∪ ${relation2.name}`, [...relation1.columns]);
        
        const uniqueRows = new Set();

        // Add rows from first relation
        for (const row of relation1.rows) {
            const rowKey = JSON.stringify(row);
            if (!uniqueRows.has(rowKey)) {
                uniqueRows.add(rowKey);
                result.addRow(row);
            }
        }

        // Add rows from second relation (avoiding duplicates)
        for (const row of relation2.rows) {
            const rowKey = JSON.stringify(row);
            if (!uniqueRows.has(rowKey)) {
                uniqueRows.add(rowKey);
                result.addRow(row);
            }
        }

        return result;
    }

    // DIFFERENCE operation (−)
    static difference(relation1, relation2) {
        if (relation1.columns.length !== relation2.columns.length) {
            throw new Error('Relations must have the same number of columns for difference');
        }

        const result = new Relation(`${relation1.name} − ${relation2.name}`, [...relation1.columns]);
        
        // Create set of rows in relation2 for quick lookup
        const relation2Rows = new Set(relation2.rows.map(row => JSON.stringify(row)));

        // Add rows from relation1 that are not in relation2
        for (const row of relation1.rows) {
            const rowKey = JSON.stringify(row);
            if (!relation2Rows.has(rowKey)) {
                result.addRow(row);
            }
        }

        return result;
    }

    // Helper method to evaluate conditions for SELECT
    evaluateCondition(row, condition) {
        try {
            // Simple condition parser - supports basic comparisons
            // Replace column names with actual values
            let expression = condition;
            
            for (let i = 0; i < this.columns.length; i++) {
                const columnName = this.columns[i];
                const value = row[i];
                
                // Handle string values (wrap in quotes if not already)
                const isString = isNaN(value) && !['true', 'false'].includes(value.toLowerCase());
                const valueStr = isString ? `"${value}"` : value;
                
                // Replace column name with value (case-insensitive)
                const regex = new RegExp(`\\b${columnName}\\b`, 'gi');
                expression = expression.replace(regex, valueStr);
            }

            // Convert common operators to JavaScript equivalents
            expression = expression.replace(/\s*=\s*/g, ' === ')
                                  .replace(/\s*!=\s*/g, ' !== ')
                                  .replace(/\s*<>\s*/g, ' !== ');

            // Basic security: only allow safe operations
            const safeExpression = expression.replace(/[^a-zA-Z0-9\s\+\-\*\/\(\)\>\<\=\!\"\'\.\,]/g, '');
            
            // Evaluate the expression
            return Function(`"use strict"; return (${safeExpression})`)();
        } catch (error) {
            console.warn('Error evaluating condition:', condition, error);
            return false;
        }
    }
}

// Global variables
let relations = [];
let operationCounter = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Create sample tables for demonstration
    createSampleTables();
    updateUI();
    
    // Show welcome message
    setTimeout(() => {
        showSuccessMessage('🎉 Welcome to Relational Algebra Visualizer! Click "Start Tutorial" for a guided tour.');
    }, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to run demo
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runQuickDemo();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            closeRowModal();
            closeHelpModal();
        }
        
        // F1 for help
        if (e.key === 'F1') {
            e.preventDefault();
            document.getElementById('helpModal').style.display = 'block';
        }
        
        // Ctrl/Cmd + H for help mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            toggleHelpMode();
        }
    });
    
    // Add hints for better UX
    setTimeout(() => {
        if (!localStorage.getItem('tutorialCompleted')) {
            showInfoMessage('💡 New here? Try the tutorial! Press Ctrl+H for help mode anytime.');
        }
    }, 5000);
});

// Create sample tables
function createSampleTables() {
    // Students table
    const students = new Relation('Students', ['ID', 'Name', 'Age', 'Major']);
    students.addRow(['1', 'Arjun Sharma', '20', 'CS']);
    students.addRow(['2', 'Priya Patel', '22', 'Math']);
    students.addRow(['3', 'Rahul Kumar', '19', 'CS']);
    students.addRow(['4', 'Sneha Gupta', '21', 'Physics']);
    students.addRow(['5', 'Vikram Singh', '23', 'CS']);
    students.addRow(['6', 'Ananya Iyer', '20', 'Math']);
    relations.push(students);

    // Grades table
    const grades = new Relation('Grades', ['StudentID', 'Course', 'Grade']);
    grades.addRow(['1', 'Database Systems', 'A']);
    grades.addRow(['2', 'Calculus', 'B+']);
    grades.addRow(['1', 'Data Structures', 'A+']);
    grades.addRow(['3', 'Database Systems', 'B']);
    grades.addRow(['4', 'Physics Lab', 'A']);
    grades.addRow(['5', 'Operating Systems', 'B+']);
    grades.addRow(['6', 'Statistics', 'A']);
    relations.push(grades);

    // Courses table
    const courses = new Relation('Courses', ['CourseID', 'CourseName', 'Credits']);
    courses.addRow(['CSE301', 'Database Systems', '4']);
    courses.addRow(['MAT201', 'Calculus', '3']);
    courses.addRow(['CSE202', 'Data Structures', '4']);
    courses.addRow(['CSE401', 'Operating Systems', '4']);
    courses.addRow(['PHY301', 'Physics Lab', '2']);
    courses.addRow(['MAT301', 'Statistics', '3']);
    relations.push(courses);
}

// Create a new table
function createTable() {
    const tableName = document.getElementById('tableName').value.trim();
    const columnsInput = document.getElementById('columns').value.trim();

    if (!tableName || !columnsInput) {
        showErrorMessage('Please provide both table name and columns');
        return;
    }

    const columns = columnsInput.split(',').map(col => col.trim()).filter(col => col);
    
    if (columns.length === 0) {
        showErrorMessage('Please provide at least one column');
        return;
    }

    // Check if table name already exists
    if (relations.find(rel => rel.name.toLowerCase() === tableName.toLowerCase())) {
        showErrorMessage('Table with this name already exists');
        return;
    }

    showLoadingIndicator('Creating new table...');
    
    setTimeout(() => {
        const newRelation = new Relation(tableName, columns);
        relations.push(newRelation);

        // Clear form
        document.getElementById('tableName').value = '';
        document.getElementById('columns').value = '';

        updateUI();
        hideLoadingIndicator();
        showSuccessMessage(`Table "${tableName}" created successfully with ${columns.length} columns!`);
        
        // Show helpful message for next steps
        setTimeout(() => {
            showInfoMessage(`💡 Tip: Click "Add Row" on your new table to start adding data!`);
        }, 2000);
    }, 600);
}

// Update the user interface
function updateUI() {
    updateTablesDisplay();
    updateTableSelects();
}

// Update tables display
function updateTablesDisplay() {
    const container = document.getElementById('tablesDisplay');
    container.innerHTML = '';

    relations.forEach((relation, index) => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table-container';
        
        tableDiv.innerHTML = `
            <div class="table-header">
                <span class="table-name">${relation.name}</span>
                <div class="table-actions">
                    <button class="btn-small btn-add" onclick="showAddRowModal('${relation.id}')">Add Row</button>
                    <button class="btn-small btn-delete" onclick="deleteTable(${index})">Delete</button>
                </div>
            </div>
            ${generateTableHTML(relation)}
        `;

        container.appendChild(tableDiv);
    });
}

// Generate HTML for a table
function generateTableHTML(relation) {
    if (relation.rows.length === 0) {
        return '<p style="text-align: center; color: #7f8c8d; font-style: italic;">No data available</p>';
    }

    let html = '<table class="data-table"><thead><tr>';
    
    // Add headers
    relation.columns.forEach(column => {
        html += `<th>${column}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Add rows
    relation.rows.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

// Update table select dropdowns
function updateTableSelects() {
    const selects = document.querySelectorAll('.table-select');
    
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Table</option>';
        
        relations.forEach(relation => {
            const option = document.createElement('option');
            option.value = relation.name;
            option.textContent = relation.name;
            if (relation.name === currentValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
}

// Show add row modal
function showAddRowModal(tableId) {
    const relation = relations.find(rel => rel.id === tableId);
    if (!relation) return;

    const modal = document.getElementById('rowModal');
    const modalTitle = document.getElementById('modalTitle');
    const rowForm = document.getElementById('rowForm');

    modalTitle.textContent = `Add Row to ${relation.name}`;
    rowForm.innerHTML = '';

    relation.columns.forEach((column, index) => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.innerHTML = `
            <label for="field_${index}">${column}:</label>
            <input type="text" id="field_${index}" name="${column}" required>
        `;
        rowForm.appendChild(formGroup);
    });

    modal.style.display = 'block';
    modal.dataset.tableId = tableId;
}

// Close row modal
function closeRowModal() {
    document.getElementById('rowModal').style.display = 'none';
}

// Add row to table
function addRowToTable() {
    const modal = document.getElementById('rowModal');
    const tableId = modal.dataset.tableId;
    const relation = relations.find(rel => rel.id === tableId);
    
    if (!relation) return;

    const inputs = modal.querySelectorAll('input[type="text"]');
    const rowData = Array.from(inputs).map(input => input.value.trim());

    if (rowData.some(value => value === '')) {
        alert('Please fill all fields');
        return;
    }

    relation.addRow(rowData);
    closeRowModal();
    updateUI();
    showSuccessMessage(`Row added to ${relation.name}!`);
}

// Delete table
function deleteTable(index) {
    if (confirm(`Are you sure you want to delete the table "${relations[index].name}"?`)) {
        relations.splice(index, 1);
        updateUI();
        showSuccessMessage('Table deleted successfully!');
    }
}

// Perform SELECT operation
function performSelect() {
    const tableName = document.getElementById('selectTable').value;
    const condition = document.getElementById('selectCondition').value.trim();

    if (!tableName || !condition) {
        showErrorMessage('Please select a table and provide a condition');
        return;
    }

    const relation = relations.find(rel => rel.name === tableName);
    if (!relation) {
        showErrorMessage('Table not found');
        return;
    }

    showLoadingIndicator('Applying SELECT operation...');
    
    setTimeout(() => {
        try {
            const result = relation.select(condition);
            displayResult(result, `SELECT (σ)`, `Applied condition: ${condition} on table ${tableName}`, 'select');
            document.getElementById('selectCondition').value = '';
            hideLoadingIndicator();
            showSuccessMessage(`SELECT operation completed! Found ${result.rows.length} matching rows.`);
        } catch (error) {
            hideLoadingIndicator();
            showErrorMessage(`Error in SELECT operation: ${error.message}`);
        }
    }, 800);
}

// Perform PROJECT operation
function performProject() {
    const tableName = document.getElementById('projectTable').value;
    const columnsInput = document.getElementById('projectColumns').value.trim();

    if (!tableName || !columnsInput) {
        showErrorMessage('Please select a table and provide columns');
        return;
    }

    const relation = relations.find(rel => rel.name === tableName);
    if (!relation) {
        showErrorMessage('Table not found');
        return;
    }

    showLoadingIndicator('Applying PROJECT operation...');
    
    setTimeout(() => {
        try {
            const columns = columnsInput.split(',').map(col => col.trim()).filter(col => col);
            const result = relation.project(columns);
            displayResult(result, `PROJECT (π)`, `Selected columns: ${columns.join(', ')} from table ${tableName}`, 'project');
            document.getElementById('projectColumns').value = '';
            document.getElementById('columnSelector').style.display = 'none';
            hideLoadingIndicator();
            showSuccessMessage(`PROJECT operation completed! Result has ${result.rows.length} unique rows.`);
        } catch (error) {
            hideLoadingIndicator();
            showErrorMessage(`Error in PROJECT operation: ${error.message}`);
        }
    }, 800);
}

// Perform JOIN operation
function performJoin() {
    const table1Name = document.getElementById('joinTable1').value;
    const table2Name = document.getElementById('joinTable2').value;
    const condition = document.getElementById('joinCondition').value.trim();

    if (!table1Name || !table2Name || !condition) {
        showErrorMessage('Please select both tables and provide a join condition');
        return;
    }

    const relation1 = relations.find(rel => rel.name === table1Name);
    const relation2 = relations.find(rel => rel.name === table2Name);

    if (!relation1 || !relation2) {
        showErrorMessage('One or both tables not found');
        return;
    }

    showLoadingIndicator('Performing JOIN operation...');
    
    setTimeout(() => {
        try {
            const result = Relation.join(relation1, relation2, condition);
            displayResult(result, `JOIN (⋈)`, `Joined ${table1Name} and ${table2Name} on condition: ${condition}`, 'join');
            document.getElementById('joinCondition').value = '';
            hideLoadingIndicator();
            showSuccessMessage(`JOIN operation completed! Result has ${result.rows.length} rows.`);
        } catch (error) {
            hideLoadingIndicator();
            showErrorMessage(`Error in JOIN operation: ${error.message}`);
        }
    }, 1000);
}

// Perform UNION operation
function performUnion() {
    const table1Name = document.getElementById('unionTable1').value;
    const table2Name = document.getElementById('unionTable2').value;

    if (!table1Name || !table2Name) {
        showErrorMessage('Please select both tables');
        return;
    }

    const relation1 = relations.find(rel => rel.name === table1Name);
    const relation2 = relations.find(rel => rel.name === table2Name);

    if (!relation1 || !relation2) {
        showErrorMessage('One or both tables not found');
        return;
    }

    showLoadingIndicator('Performing UNION operation...');
    
    setTimeout(() => {
        try {
            const result = Relation.union(relation1, relation2);
            displayResult(result, `UNION (∪)`, `Union of ${table1Name} and ${table2Name}`, 'union');
            hideLoadingIndicator();
            showSuccessMessage(`UNION operation completed! Combined ${relation1.rows.length} + ${relation2.rows.length} rows into ${result.rows.length} unique rows.`);
        } catch (error) {
            hideLoadingIndicator();
            showErrorMessage(`Error in UNION operation: ${error.message}`);
        }
    }, 800);
}

// Perform DIFFERENCE operation
function performDifference() {
    const table1Name = document.getElementById('diffTable1').value;
    const table2Name = document.getElementById('diffTable2').value;

    if (!table1Name || !table2Name) {
        showErrorMessage('Please select both tables');
        return;
    }

    const relation1 = relations.find(rel => rel.name === table1Name);
    const relation2 = relations.find(rel => rel.name === table2Name);

    if (!relation1 || !relation2) {
        showErrorMessage('One or both tables not found');
        return;
    }

    showLoadingIndicator('Performing DIFFERENCE operation...');
    
    setTimeout(() => {
        try {
            const result = Relation.difference(relation1, relation2);
            displayResult(result, `DIFFERENCE (−)`, `${table1Name} minus ${table2Name}`, 'difference');
            hideLoadingIndicator();
            showSuccessMessage(`DIFFERENCE operation completed! Found ${result.rows.length} rows unique to ${table1Name}.`);
        } catch (error) {
            hideLoadingIndicator();
            showErrorMessage(`Error in DIFFERENCE operation: ${error.message}`);
        }
    }, 800);
}

// Display operation result
function displayResult(result, operationType, description, operationClass = '') {
    const resultsContainer = document.getElementById('resultsDisplay');
    
    // Remove placeholder if it exists
    const placeholder = resultsContainer.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = `result-item result-highlight ${operationClass}-result`;
    
    const timestamp = new Date().toLocaleTimeString();
    const rowCount = result.rows.length;
    const columnCount = result.columns.length;
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <span class="operation-badge">${operationType}</span>
            <span class="result-title">${result.name}</span>
            <span class="result-stats">${rowCount} rows × ${columnCount} columns</span>
        </div>
        <div class="operation-description">
            <div class="description-text">${description}</div>
            <div class="operation-time">Executed at ${timestamp}</div>
        </div>
        <div class="result-actions">
            <button onclick="saveResultAsTable(this)" class="btn-small btn-save">💾 Save as Table</button>
            <button onclick="exportResult(this)" class="btn-small btn-export">📄 Export</button>
            <button onclick="removeResult(this)" class="btn-small btn-delete">🗑️ Remove</button>
        </div>
        ${generateTableHTML(result)}
    `;

    resultsContainer.appendChild(resultDiv);
    
    // Animate the appearance
    setTimeout(() => {
        resultDiv.classList.add('slide-in-animation');
    }, 50);
    
    // Scroll to the new result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    operationCounter++;
}

// Enhanced messaging functions
function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

function showInfoMessage(message) {
    showToast(message, 'info');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 1.2em;">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 4000);
}

// Result management functions
function saveResultAsTable(button) {
    const resultDiv = button.closest('.result-item');
    const resultTitle = resultDiv.querySelector('.result-title').textContent;
    const tableData = extractTableData(resultDiv);
    
    // Create new relation from result
    const newRelation = new Relation(resultTitle, tableData.columns);
    tableData.rows.forEach(row => newRelation.addRow(row));
    
    relations.push(newRelation);
    updateUI();
    showSuccessMessage(`Result saved as new table: ${resultTitle}`);
}

function exportResult(button) {
    const resultDiv = button.closest('.result-item');
    const tableData = extractTableData(resultDiv);
    
    // Convert to CSV format
    let csv = tableData.columns.join(',') + '\n';
    csv += tableData.rows.map(row => row.join(',')).join('\n');
    
    // Download CSV file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccessMessage('Result exported as CSV file!');
}

function removeResult(button) {
    const resultDiv = button.closest('.result-item');
    resultDiv.style.animation = 'slideOutUp 0.3s ease';
    setTimeout(() => {
        resultDiv.remove();
        
        // Check if results area is empty
        const resultsContainer = document.getElementById('resultsDisplay');
        if (resultsContainer.children.length === 0) {
            resultsContainer.innerHTML = '<p class="placeholder">Results will appear here after performing operations</p>';
        }
    }, 300);
}

function extractTableData(resultDiv) {
    const table = resultDiv.querySelector('.data-table');
    if (!table) return { columns: [], rows: [] };
    
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    );
    
    return { columns: headers, rows: rows };
}

// Clear results
function clearResults() {
    const resultsContainer = document.getElementById('resultsDisplay');
    resultsContainer.innerHTML = '<p class="placeholder">Results will appear here after performing operations</p>';
    operationCounter = 0;
}

// Show success message
function showSuccessMessage(message) {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('rowModal');
    if (event.target === modal) {
        closeRowModal();
    }
}

// Global variables for user-friendly features
let helpMode = false;
let tutorialStep = 0;
let tutorialSteps = [
    {
        title: "Welcome to Relational Algebra Visualizer!",
        text: "This tool helps you learn relational algebra operations interactively. Let's start with a tour!",
        highlight: null
    },
    {
        title: "Sample Tables",
        text: "We've pre-loaded some sample tables for you. You can see Students, Grades, and Courses tables on the left.",
        highlight: ".tables-section"
    },
    {
        title: "Creating New Tables",
        text: "Use this panel to create your own tables. Try the quick templates for common table types!",
        highlight: ".table-creation-panel"
    },
    {
        title: "Relational Operations",
        text: "These panels let you apply different relational algebra operations. Each has helpful examples and explanations!",
        highlight: ".operation-panel"
    },
    {
        title: "Results Panel",
        text: "All operation results appear here with detailed explanations. You can see the step-by-step transformations!",
        highlight: ".results-section"
    },
    {
        title: "Help Features",
        text: "Click the Help Mode button to see tooltips everywhere, or use the question mark icons for specific help!",
        highlight: ".header-buttons"
    }
];

// Quick demo function
function runQuickDemo() {
    showLoadingIndicator('Running demonstration...');
    clearResults();
    
    setTimeout(() => {
        document.getElementById('selectTable').value = 'Students';
        document.getElementById('selectCondition').value = 'Age > 20';
        performSelect();
        
        setTimeout(() => {
            document.getElementById('projectTable').value = 'Students';
            document.getElementById('projectColumns').value = 'Name, Major';
            performProject();
            
            setTimeout(() => {
                document.getElementById('joinTable1').value = 'Students';
                document.getElementById('joinTable2').value = 'Grades';
                document.getElementById('joinCondition').value = 'Students.ID = Grades.StudentID';
                performJoin();
                hideLoadingIndicator();
                
                setTimeout(() => {
                    showInfoMessage('🎉 Demo complete! Notice how Arjun Sharma and other students appear in the results.');
                }, 1000);
            }, 2000);
        }, 2000);
    }, 1000);

    showSuccessMessage('Running quick demo... Watch the results panel!');
}

// Tutorial functions
function startTutorial() {
    tutorialStep = 0;
    document.getElementById('tutorialOverlay').style.display = 'flex';
    updateTutorialStep();
}

function nextTutorialStep() {
    if (tutorialStep < tutorialSteps.length - 1) {
        tutorialStep++;
        updateTutorialStep();
    } else {
        skipTutorial();
    }
}

function previousTutorialStep() {
    if (tutorialStep > 0) {
        tutorialStep--;
        updateTutorialStep();
    }
}

function updateTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    // Add new highlight
    if (step.highlight) {
        const element = document.querySelector(step.highlight);
        if (element) {
            element.classList.add('tutorial-highlight');
        }
    }
    
    // Update button states
    document.getElementById('prevBtn').style.display = tutorialStep === 0 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').textContent = tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next';
}

function skipTutorial() {
    document.getElementById('tutorialOverlay').style.display = 'none';
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    showSuccessMessage('Tutorial completed! Click Help Mode for more assistance.');
}

// Help system functions
function toggleHelpMode() {
    helpMode = !helpMode;
    const button = document.getElementById('helpToggle');
    const body = document.body;
    
    if (helpMode) {
        button.textContent = '💡 Help Mode: ON';
        button.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        body.classList.add('help-mode-active');
        showSuccessMessage('Help mode activated! Hover over elements with ? icons for help.');
    } else {
        button.textContent = '💡 Help Mode: OFF';
        button.style.background = 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)';
        body.classList.remove('help-mode-active');
    }
}

function showHelp(element) {
    const helpText = element.closest('[data-help]').dataset.help;
    if (helpText) {
        showTooltip(element, helpText);
    }
}

function showTooltip(element, text) {
    // Remove existing tooltips
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #2c3e50;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        max-width: 300px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    setTimeout(() => tooltip.remove(), 3000);
}

function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
}

// Loading indicator functions
function showLoadingIndicator(message = 'Processing...') {
    const indicator = document.getElementById('loadingIndicator');
    indicator.querySelector('p').textContent = message;
    indicator.style.display = 'flex';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Template functions
function useTemplate(type) {
    const templates = {
        employees: {
            name: 'Employees',
            columns: 'EmpID, Name, Department, Salary, City',
            sampleData: [
                ['E001', 'Rajesh Mehta', 'IT', '75000', 'Mumbai'],
                ['E002', 'Sunita Agarwal', 'HR', '65000', 'Delhi'],
                ['E003', 'Karan Malhotra', 'Finance', '70000', 'Bangalore'],
                ['E004', 'Deepika Nair', 'IT', '80000', 'Chennai']
            ]
        },
        products: {
            name: 'Products',
            columns: 'ProductID, ProductName, Category, Price, Stock',
            sampleData: [
                ['P001', 'Basmati Rice', 'Groceries', '120', '500'],
                ['P002', 'Masala Chai', 'Beverages', '150', '200'],
                ['P003', 'Cotton Kurta', 'Clothing', '999', '50'],
                ['P004', 'Smartphone', 'Electronics', '25000', '25']
            ]
        },
        orders: {
            name: 'Orders',
            columns: 'OrderID, CustomerName, ProductID, Quantity, City',
            sampleData: [
                ['O001', 'Amit Patel', 'P001', '2', 'Ahmedabad'],
                ['O002', 'Meera Shah', 'P003', '1', 'Pune'],
                ['O003', 'Rohit Jain', 'P002', '5', 'Jaipur'],
                ['O004', 'Kavya Reddy', 'P004', '1', 'Hyderabad']
            ]
        }
    };
    
    const template = templates[type];
    if (template) {
        document.getElementById('tableName').value = template.name;
        document.getElementById('columns').value = template.columns;
        
        // Create the table with sample data
        setTimeout(() => {
            createTable();
            
            // Add sample data after table is created
            setTimeout(() => {
                const relation = relations.find(rel => rel.name === template.name);
                if (relation && template.sampleData) {
                    template.sampleData.forEach(row => relation.addRow(row));
                    updateUI();
                    showSuccessMessage(`Template "${template.name}" loaded with sample Indian data!`);
                }
            }, 500);
        }, 100);
    }
}

// Smart suggestions functions
function updateConditionSuggestions(operationType) {
    const tableSelect = document.getElementById(operationType + 'Table');
    const tableName = tableSelect.value;
    
    if (!tableName) return;
    
    const relation = relations.find(rel => rel.name === tableName);
    if (!relation) return;
    
    // Generate suggestions based on columns and data types
    const suggestions = [];
    relation.columns.forEach(column => {
        // Check if column contains numeric data
        const hasNumeric = relation.rows.some(row => {
            const value = row[relation.columns.indexOf(column)];
            return !isNaN(value) && value !== '';
        });
        
        if (hasNumeric) {
            suggestions.push(`${column} > 0`, `${column} < 100`, `${column} = 1`);
        } else {
            // String suggestions
            const uniqueValues = [...new Set(relation.rows.map(row => row[relation.columns.indexOf(column)]))];
            uniqueValues.slice(0, 3).forEach(value => {
                suggestions.push(`${column} = "${value}"`);
            });
        }
    });
    
    // Store suggestions for later use
    window[operationType + 'Suggestions'] = suggestions;
}

function showConditionSuggestions(operationType) {
    const input = document.getElementById(operationType + 'Condition');
    const suggestionsContainer = document.getElementById(operationType + 'ConditionSuggestions');
    const suggestions = window[operationType + 'Suggestions'] || [];
    
    if (input.value.length > 0 || suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        item.onclick = () => {
            input.value = suggestion;
            suggestionsContainer.style.display = 'none';
        };
        suggestionsContainer.appendChild(item);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Column selection functions
function updateColumnCheckboxes() {
    const tableSelect = document.getElementById('projectTable');
    const tableName = tableSelect.value;
    const selector = document.getElementById('columnSelector');
    const checkboxContainer = document.getElementById('columnCheckboxes');
    
    if (!tableName) {
        selector.style.display = 'none';
        return;
    }
    
    const relation = relations.find(rel => rel.name === tableName);
    if (!relation) return;
    
    checkboxContainer.innerHTML = '';
    relation.columns.forEach(column => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'column-checkbox';
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="col_${column}" value="${column}" onchange="updateSelectedColumns()">
            <label for="col_${column}">${column}</label>
        `;
        checkboxContainer.appendChild(checkboxDiv);
    });
    
    selector.style.display = 'block';
}

function updateSelectedColumns() {
    const checkboxes = document.querySelectorAll('#columnCheckboxes input[type="checkbox"]:checked');
    const selectedColumns = Array.from(checkboxes).map(cb => cb.value);
    document.getElementById('projectColumns').value = selectedColumns.join(', ');
}

function selectAllColumns() {
    document.querySelectorAll('#columnCheckboxes input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });
    updateSelectedColumns();
}

function clearAllColumns() {
    document.querySelectorAll('#columnCheckboxes input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    updateSelectedColumns();
}

function showColumnSelector() {
    const tableSelect = document.getElementById('projectTable');
    if (!tableSelect.value) {
        showTooltip(tableSelect, 'Please select a table first');
        return;
    }
    updateColumnCheckboxes();
}

// Explanation functions
function explainOperation(operationType) {
    const explanations = {
        select: {
            title: "SELECT Operation (σ)",
            content: `
                <p><strong>Purpose:</strong> Filter rows that meet specific conditions</p>
                <p><strong>Syntax:</strong> σ(condition)(table)</p>
                <p><strong>Example:</strong> σ(Age > 20)(Students) - Shows only students older than 20</p>
                <p><strong>Operators you can use:</strong></p>
                <ul>
                    <li><code>=</code> - Equal to</li>
                    <li><code>!=</code> - Not equal to</li>
                    <li><code>&gt;</code> - Greater than</li>
                    <li><code>&lt;</code> - Less than</li>
                    <li><code>&gt;=</code> - Greater than or equal</li>
                    <li><code>&lt;=</code> - Less than or equal</li>
                </ul>
            `
        },
        project: {
            title: "PROJECT Operation (π)",
            content: `
                <p><strong>Purpose:</strong> Select specific columns and remove duplicates</p>
                <p><strong>Syntax:</strong> π(column1, column2, ...)(table)</p>
                <p><strong>Example:</strong> π(Name, Age)(Students) - Shows only Name and Age columns</p>
                <p><strong>Note:</strong> Duplicate rows are automatically removed from the result</p>
            `
        }
    };
    
    const explanation = explanations[operationType];
    if (explanation) {
        showExplanationModal(explanation.title, explanation.content);
    }
}

function showExplanationModal(title, content) {
    // Create and show explanation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3>${title}</h3>
            <div>${content}</div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    setTimeout(() => modal.remove(), 10000); // Auto-remove after 10 seconds
}

// Add CSS animations for toast notifications
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
`;
document.head.appendChild(style);