// SQL Query Simulator - JavaScript Implementation
// Simulates SQL queries using JavaScript arrays as tables

// Database storage
let database = {};
let queryHistory = [];
let currentTab = 'basic';

// Query templates for each tab
const templates = {
    basic: [
        { label: 'SELECT *', query: 'SELECT * FROM employees' },
        { label: 'SELECT columns', query: 'SELECT name, salary FROM employees' },
        { label: 'WHERE clause', query: 'SELECT * FROM employees WHERE salary > 50000' },
        { label: 'ORDER BY', query: 'SELECT * FROM employees ORDER BY salary DESC' },
        { label: 'LIMIT', query: 'SELECT * FROM employees LIMIT 5' },
        { label: 'LIKE pattern', query: 'SELECT * FROM employees WHERE name LIKE "%John%"' }
    ],
    aggregate: [
        { label: 'COUNT', query: 'SELECT COUNT(*) FROM employees' },
        { label: 'SUM', query: 'SELECT SUM(salary) FROM employees' },
        { label: 'AVG', query: 'SELECT AVG(salary) FROM employees' },
        { label: 'MIN/MAX', query: 'SELECT MIN(salary), MAX(salary) FROM employees' },
        { label: 'GROUP BY', query: 'SELECT department, COUNT(*) FROM employees GROUP BY department' },
        { label: 'HAVING', query: 'SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000' }
    ],
    set: [
        { label: 'UNION', query: 'SELECT name FROM employees UNION SELECT name FROM managers' },
        { label: 'INTERSECT', query: 'SELECT name FROM employees INTERSECT SELECT name FROM managers' },
        { label: 'EXCEPT', query: 'SELECT name FROM employees EXCEPT SELECT name FROM managers' }
    ],
    nested: [
        { label: 'Subquery in WHERE', query: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)' },
        { label: 'IN Subquery', query: 'SELECT * FROM employees WHERE department IN (SELECT name FROM departments WHERE budget > 100000)' },
        { label: 'EXISTS', query: 'SELECT * FROM employees WHERE EXISTS (SELECT 1 FROM projects WHERE projects.manager_id = employees.id)' }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    updateTemplates();
    renderTables();
});

// Load data from localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('sqlSimulator_database');
    if (saved) {
        database = JSON.parse(saved);
    }
    const historyData = localStorage.getItem('sqlSimulator_history');
    if (historyData) {
        queryHistory = JSON.parse(historyData);
        renderHistory();
    }
}

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('sqlSimulator_database', JSON.stringify(database));
    localStorage.setItem('sqlSimulator_history', JSON.stringify(queryHistory));
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Show create table modal
function showCreateTableModal() {
    showModal('createTableModal');
}

// Show tutorial
function showTutorial() {
    showModal('tutorialModal');
}

// Create a new table
function createTable() {
    const name = document.getElementById('tableName').value.trim().toLowerCase();
    const columnsStr = document.getElementById('tableColumns').value.trim();
    const dataStr = document.getElementById('tableData').value.trim();

    if (!name) {
        alert('Please enter a table name');
        return;
    }

    if (!columnsStr) {
        alert('Please enter column names');
        return;
    }

    const columns = columnsStr.split(',').map(c => c.trim().toLowerCase());
    let data = [];

    if (dataStr) {
        try {
            data = JSON.parse(dataStr);
            if (!Array.isArray(data)) {
                data = [data];
            }
        } catch (e) {
            alert('Invalid JSON format for data');
            return;
        }
    }

    database[name] = {
        columns: columns,
        rows: data
    };

    saveToStorage();
    renderTables();
    closeModal('createTableModal');

    // Clear form
    document.getElementById('tableName').value = '';
    document.getElementById('tableColumns').value = '';
    document.getElementById('tableData').value = '';
}

// Render all tables
function renderTables() {
    const container = document.getElementById('tablesContainer');
    const tableNames = Object.keys(database);

    if (tableNames.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="emptyState">
                <i class="fas fa-database"></i>
                <p>No tables created yet. Click "Create Table" or "Load Sample Data" to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tableNames.map(tableName => {
        const table = database[tableName];
        return `
            <div class="table-card">
                <div class="table-card-header">
                    <h3><i class="fas fa-table"></i> ${tableName}</h3>
                    <div class="table-card-actions">
                        <button class="btn-add-row" onclick="showAddDataModal('${tableName}')">
                            <i class="fas fa-plus"></i> Add Row
                        </button>
                        <button class="btn-delete-table" onclick="deleteTable('${tableName}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                ${table.columns.map(col => `<th>${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.rows.map(row => `
                                <tr>
                                    ${table.columns.map(col => `<td>${row[col] !== undefined ? row[col] : ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="table-info">
                    ${table.rows.length} row(s) • ${table.columns.length} column(s)
                </div>
            </div>
        `;
    }).join('');
}

// Show add data modal
let currentTableForAdd = '';
function showAddDataModal(tableName) {
    currentTableForAdd = tableName;
    document.getElementById('addDataTableName').textContent = tableName;
    
    const table = database[tableName];
    const form = document.getElementById('addDataForm');
    
    form.innerHTML = table.columns.map(col => `
        <div class="form-group">
            <label for="add_${col}">${col}:</label>
            <input type="text" id="add_${col}" placeholder="Enter ${col}">
        </div>
    `).join('');
    
    showModal('addDataModal');
}

// Add row to table
function addRow() {
    const table = database[currentTableForAdd];
    const newRow = {};
    
    table.columns.forEach(col => {
        const input = document.getElementById(`add_${col}`);
        let value = input.value.trim();
        
        // Try to parse as number
        if (!isNaN(value) && value !== '') {
            value = parseFloat(value);
        }
        
        newRow[col] = value;
    });
    
    table.rows.push(newRow);
    saveToStorage();
    renderTables();
    closeModal('addDataModal');
}

// Delete table
function deleteTable(tableName) {
    if (confirm(`Are you sure you want to delete table "${tableName}"?`)) {
        delete database[tableName];
        saveToStorage();
        renderTables();
    }
}

// Load sample data
function loadSampleData() {
    database = {
        employees: {
            columns: ['id', 'name', 'department', 'salary', 'hire_date'],
            rows: [
                { id: 1, name: 'John Smith', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' },
                { id: 2, name: 'Jane Doe', department: 'Marketing', salary: 65000, hire_date: '2019-06-20' },
                { id: 3, name: 'Bob Wilson', department: 'Engineering', salary: 80000, hire_date: '2018-03-10' },
                { id: 4, name: 'Alice Brown', department: 'HR', salary: 55000, hire_date: '2021-02-28' },
                { id: 5, name: 'Charlie Davis', department: 'Marketing', salary: 70000, hire_date: '2020-09-05' },
                { id: 6, name: 'Diana Evans', department: 'Engineering', salary: 85000, hire_date: '2017-11-12' },
                { id: 7, name: 'Edward Miller', department: 'Sales', salary: 60000, hire_date: '2022-01-03' },
                { id: 8, name: 'Fiona Garcia', department: 'HR', salary: 52000, hire_date: '2021-07-18' }
            ]
        },
        departments: {
            columns: ['id', 'name', 'budget', 'location'],
            rows: [
                { id: 1, name: 'Engineering', budget: 500000, location: 'Building A' },
                { id: 2, name: 'Marketing', budget: 300000, location: 'Building B' },
                { id: 3, name: 'HR', budget: 150000, location: 'Building A' },
                { id: 4, name: 'Sales', budget: 250000, location: 'Building C' }
            ]
        },
        projects: {
            columns: ['id', 'name', 'manager_id', 'status'],
            rows: [
                { id: 1, name: 'Website Redesign', manager_id: 1, status: 'Active' },
                { id: 2, name: 'Mobile App', manager_id: 3, status: 'Active' },
                { id: 3, name: 'Marketing Campaign', manager_id: 2, status: 'Completed' },
                { id: 4, name: 'Data Analytics', manager_id: 6, status: 'Planning' }
            ]
        },
        managers: {
            columns: ['id', 'name', 'department'],
            rows: [
                { id: 1, name: 'John Smith', department: 'Engineering' },
                { id: 2, name: 'Jane Doe', department: 'Marketing' },
                { id: 3, name: 'Bob Wilson', department: 'Engineering' }
            ]
        }
    };
    
    saveToStorage();
    renderTables();
    showNotification('Sample data loaded successfully!', 'success');
}

// Clear all data
function clearAll() {
    if (confirm('Are you sure you want to delete all tables?')) {
        database = {};
        saveToStorage();
        renderTables();
    }
}

// Switch query tab
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    updateTemplates();
}

// Update query templates
function updateTemplates() {
    const grid = document.getElementById('templatesGrid');
    const tabTemplates = templates[currentTab] || [];
    
    grid.innerHTML = tabTemplates.map(t => `
        <button class="template-btn" onclick="useTemplate('${t.query.replace(/'/g, "\\'")}')">
            ${t.label}
        </button>
    `).join('');
}

// Use template
function useTemplate(query) {
    document.getElementById('queryInput').value = query;
}

// Format query
function formatQuery() {
    const input = document.getElementById('queryInput');
    let query = input.value;
    
    // Simple formatting
    const keywords = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'UNION', 'INTERSECT', 'EXCEPT', 'AND', 'OR'];
    
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        query = query.replace(regex, '\n' + kw);
    });
    
    input.value = query.trim();
}

// Clear query
function clearQuery() {
    document.getElementById('queryInput').value = '';
}

// Execute query
function executeQuery() {
    const query = document.getElementById('queryInput').value.trim();
    
    if (!query) {
        showResult({ error: 'Please enter a query' });
        return;
    }
    
    // Add to history
    addToHistory(query);
    
    try {
        const result = parseAndExecute(query);
        showResult(result);
    } catch (e) {
        showResult({ error: e.message });
    }
}

// Parse and execute SQL query
function parseAndExecute(query) {
    query = query.trim();
    const upperQuery = query.toUpperCase();
    
    // Check for set operations first
    if (upperQuery.includes(' UNION ')) {
        return executeSetOperation(query, 'UNION');
    }
    if (upperQuery.includes(' INTERSECT ')) {
        return executeSetOperation(query, 'INTERSECT');
    }
    if (upperQuery.includes(' EXCEPT ')) {
        return executeSetOperation(query, 'EXCEPT');
    }
    
    // Parse SELECT query
    if (upperQuery.startsWith('SELECT')) {
        return executeSelect(query);
    }
    
    throw new Error('Unsupported query type. Only SELECT queries are supported.');
}

// Execute SELECT query
function executeSelect(query) {
    const upperQuery = query.toUpperCase();
    
    // Check for nested query
    const hasSubquery = (query.match(/\(/g) || []).length > 0 && upperQuery.includes('SELECT', 7);
    
    if (hasSubquery) {
        return executeNestedQuery(query);
    }
    
    // Parse query components
    const parsed = parseSelectQuery(query);
    
    // Get base table
    if (!database[parsed.table]) {
        throw new Error(`Table "${parsed.table}" does not exist`);
    }
    
    let result = [...database[parsed.table].rows];
    const columns = database[parsed.table].columns;
    
    // Apply WHERE clause
    if (parsed.where) {
        result = applyWhere(result, parsed.where);
    }
    
    // Check for aggregate functions
    if (parsed.hasAggregate) {
        return executeAggregate(result, parsed, columns);
    }
    
    // Apply GROUP BY
    if (parsed.groupBy) {
        return executeGroupBy(result, parsed);
    }
    
    // Apply ORDER BY
    if (parsed.orderBy) {
        result = applyOrderBy(result, parsed.orderBy);
    }
    
    // Apply LIMIT
    if (parsed.limit) {
        result = result.slice(0, parsed.limit);
    }
    
    // Apply projection
    if (parsed.columns[0] !== '*') {
        result = result.map(row => {
            const newRow = {};
            parsed.columns.forEach(col => {
                newRow[col] = row[col];
            });
            return newRow;
        });
        return { data: result, columns: parsed.columns };
    }
    
    return { data: result, columns: columns };
}

// Parse SELECT query
function parseSelectQuery(query) {
    const parsed = {
        columns: [],
        table: '',
        where: null,
        orderBy: null,
        groupBy: null,
        having: null,
        limit: null,
        hasAggregate: false
    };
    
    const upperQuery = query.toUpperCase();
    
    // Extract LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
        parsed.limit = parseInt(limitMatch[1]);
        query = query.replace(/LIMIT\s+\d+/i, '');
    }
    
    // Extract ORDER BY
    const orderMatch = query.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
        parsed.orderBy = {
            column: orderMatch[1].toLowerCase(),
            direction: (orderMatch[2] || 'ASC').toUpperCase()
        };
        query = query.replace(/ORDER\s+BY\s+\w+(?:\s+(?:ASC|DESC))?/i, '');
    }
    
    // Extract HAVING
    const havingMatch = query.match(/HAVING\s+(.+?)(?:$)/i);
    if (havingMatch) {
        parsed.having = havingMatch[1].trim();
        query = query.replace(/HAVING\s+.+?$/i, '');
    }
    
    // Extract GROUP BY
    const groupMatch = query.match(/GROUP\s+BY\s+(\w+)/i);
    if (groupMatch) {
        parsed.groupBy = groupMatch[1].toLowerCase();
        query = query.replace(/GROUP\s+BY\s+\w+/i, '');
    }
    
    // Extract WHERE
    const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP|ORDER|LIMIT|$)/i);
    if (whereMatch) {
        parsed.where = whereMatch[1].trim();
        query = query.replace(/WHERE\s+.+?(?=GROUP|ORDER|LIMIT|$)/i, '');
    }
    
    // Extract FROM and table
    const fromMatch = query.match(/FROM\s+(\w+)/i);
    if (fromMatch) {
        parsed.table = fromMatch[1].toLowerCase();
    }
    
    // Extract columns
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
    if (selectMatch) {
        const colStr = selectMatch[1].trim();
        
        // Check for aggregate functions
        const aggFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
        parsed.hasAggregate = aggFunctions.some(f => colStr.toUpperCase().includes(f + '('));
        
        if (colStr === '*') {
            parsed.columns = ['*'];
        } else if (parsed.hasAggregate) {
            // Parse aggregate expressions
            parsed.aggregateExpr = colStr;
            parsed.columns = [colStr];
        } else {
            parsed.columns = colStr.split(',').map(c => c.trim().toLowerCase());
        }
    }
    
    return parsed;
}

// Apply WHERE clause
function applyWhere(rows, whereClause) {
    return rows.filter(row => evaluateCondition(row, whereClause));
}

// Evaluate WHERE condition
function evaluateCondition(row, condition) {
    // Handle AND/OR
    if (/\s+AND\s+/i.test(condition)) {
        const parts = condition.split(/\s+AND\s+/i);
        return parts.every(part => evaluateCondition(row, part.trim()));
    }
    if (/\s+OR\s+/i.test(condition)) {
        const parts = condition.split(/\s+OR\s+/i);
        return parts.some(part => evaluateCondition(row, part.trim()));
    }
    
    // Handle LIKE
    const likeMatch = condition.match(/(\w+)\s+LIKE\s+["'](.+?)["']/i);
    if (likeMatch) {
        const col = likeMatch[1].toLowerCase();
        const pattern = likeMatch[2].replace(/%/g, '.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(String(row[col] || ''));
    }
    
    // Handle IN
    const inMatch = condition.match(/(\w+)\s+IN\s*\((.+)\)/i);
    if (inMatch) {
        const col = inMatch[1].toLowerCase();
        const values = inMatch[2].split(',').map(v => {
            v = v.trim().replace(/["']/g, '');
            return isNaN(v) ? v : parseFloat(v);
        });
        return values.includes(row[col]);
    }
    
    // Handle comparison operators
    const compMatch = condition.match(/(\w+)\s*(>=|<=|!=|<>|=|>|<)\s*["']?(.+?)["']?$/i);
    if (compMatch) {
        const col = compMatch[1].toLowerCase();
        const op = compMatch[2];
        let val = compMatch[3].trim().replace(/["']/g, '');
        
        if (!isNaN(val)) val = parseFloat(val);
        
        const rowVal = row[col];
        
        switch (op) {
            case '=': return rowVal == val;
            case '!=':
            case '<>': return rowVal != val;
            case '>': return rowVal > val;
            case '<': return rowVal < val;
            case '>=': return rowVal >= val;
            case '<=': return rowVal <= val;
        }
    }
    
    return true;
}

// Apply ORDER BY
function applyOrderBy(rows, orderBy) {
    return [...rows].sort((a, b) => {
        const valA = a[orderBy.column];
        const valB = b[orderBy.column];
        
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else {
            comparison = String(valA).localeCompare(String(valB));
        }
        
        return orderBy.direction === 'DESC' ? -comparison : comparison;
    });
}

// Execute aggregate functions
function executeAggregate(rows, parsed, columns) {
    const expr = parsed.aggregateExpr || parsed.columns[0];
    const results = {};
    
    // Parse multiple aggregate functions
    const aggMatches = expr.matchAll(/(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)/gi);
    
    for (const match of aggMatches) {
        const func = match[1].toUpperCase();
        const col = match[2].toLowerCase();
        
        switch (func) {
            case 'COUNT':
                results[`${func}(${col})`] = rows.length;
                break;
            case 'SUM':
                results[`${func}(${col})`] = rows.reduce((sum, row) => sum + (parseFloat(row[col]) || 0), 0);
                break;
            case 'AVG':
                const sum = rows.reduce((s, row) => s + (parseFloat(row[col]) || 0), 0);
                results[`${func}(${col})`] = rows.length ? (sum / rows.length).toFixed(2) : 0;
                break;
            case 'MIN':
                results[`${func}(${col})`] = Math.min(...rows.map(row => parseFloat(row[col]) || 0));
                break;
            case 'MAX':
                results[`${func}(${col})`] = Math.max(...rows.map(row => parseFloat(row[col]) || 0));
                break;
        }
    }
    
    return { 
        aggregate: true, 
        data: results,
        columns: Object.keys(results)
    };
}

// Execute GROUP BY
function executeGroupBy(rows, parsed) {
    const groups = {};
    
    rows.forEach(row => {
        const key = row[parsed.groupBy];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(row);
    });
    
    const result = [];
    
    for (const [groupKey, groupRows] of Object.entries(groups)) {
        const row = { [parsed.groupBy]: groupKey };
        
        // Parse aggregate in columns
        const expr = parsed.aggregateExpr || parsed.columns.join(',');
        const aggMatches = expr.matchAll(/(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)/gi);
        
        for (const match of aggMatches) {
            const func = match[1].toUpperCase();
            const col = match[2].toLowerCase();
            const label = `${func}(${col})`;
            
            switch (func) {
                case 'COUNT':
                    row[label] = groupRows.length;
                    break;
                case 'SUM':
                    row[label] = groupRows.reduce((sum, r) => sum + (parseFloat(r[col]) || 0), 0);
                    break;
                case 'AVG':
                    const sum = groupRows.reduce((s, r) => s + (parseFloat(r[col]) || 0), 0);
                    row[label] = (sum / groupRows.length).toFixed(2);
                    break;
                case 'MIN':
                    row[label] = Math.min(...groupRows.map(r => parseFloat(r[col]) || 0));
                    break;
                case 'MAX':
                    row[label] = Math.max(...groupRows.map(r => parseFloat(r[col]) || 0));
                    break;
            }
        }
        
        // Apply HAVING if present
        if (parsed.having) {
            if (evaluateHaving(row, parsed.having)) {
                result.push(row);
            }
        } else {
            result.push(row);
        }
    }
    
    return {
        data: result,
        columns: Object.keys(result[0] || {})
    };
}

// Evaluate HAVING clause
function evaluateHaving(row, having) {
    // Replace aggregate function results with actual values
    let condition = having;
    
    for (const [key, value] of Object.entries(row)) {
        const escapedKey = key.replace(/[()]/g, '\\$&');
        condition = condition.replace(new RegExp(escapedKey, 'gi'), value);
    }
    
    // Evaluate simple comparison
    const match = condition.match(/([0-9.]+)\s*(>|<|>=|<=|=|!=)\s*([0-9.]+)/);
    if (match) {
        const left = parseFloat(match[1]);
        const op = match[2];
        const right = parseFloat(match[3]);
        
        switch (op) {
            case '>': return left > right;
            case '<': return left < right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '=': return left === right;
            case '!=': return left !== right;
        }
    }
    
    return true;
}

// Execute set operations
function executeSetOperation(query, operation) {
    const parts = query.split(new RegExp(`\\s+${operation}\\s+`, 'i'));
    
    if (parts.length !== 2) {
        throw new Error(`Invalid ${operation} syntax`);
    }
    
    const result1 = parseAndExecute(parts[0].trim());
    const result2 = parseAndExecute(parts[1].trim());
    
    const data1 = result1.data;
    const data2 = result2.data;
    
    let resultData;
    
    switch (operation) {
        case 'UNION':
            resultData = [...data1];
            data2.forEach(row => {
                if (!resultData.some(r => JSON.stringify(r) === JSON.stringify(row))) {
                    resultData.push(row);
                }
            });
            break;
            
        case 'INTERSECT':
            resultData = data1.filter(row1 => 
                data2.some(row2 => JSON.stringify(row1) === JSON.stringify(row2))
            );
            break;
            
        case 'EXCEPT':
            resultData = data1.filter(row1 => 
                !data2.some(row2 => JSON.stringify(row1) === JSON.stringify(row2))
            );
            break;
    }
    
    return {
        data: resultData,
        columns: result1.columns
    };
}

// Execute nested query
function executeNestedQuery(query) {
    // Find innermost subquery
    let result = query;
    
    while (result.includes('(SELECT')) {
        const subqueryMatch = result.match(/\(SELECT[^()]+\)/i);
        if (!subqueryMatch) break;
        
        const subquery = subqueryMatch[0].slice(1, -1); // Remove parentheses
        const subResult = executeSelect(subquery);
        
        // Convert subquery result to usable value
        let replacement;
        if (subResult.aggregate) {
            replacement = Object.values(subResult.data)[0];
        } else if (subResult.data.length === 1 && subResult.columns.length === 1) {
            replacement = subResult.data[0][subResult.columns[0]];
        } else {
            // Multiple values for IN clause
            replacement = subResult.data.map(row => {
                const val = row[subResult.columns[0]];
                return typeof val === 'string' ? `'${val}'` : val;
            }).join(', ');
        }
        
        result = result.replace(subqueryMatch[0], replacement);
    }
    
    return executeSelect(result);
}

// Show result
function showResult(result) {
    const container = document.getElementById('resultsContainer');
    const countEl = document.getElementById('resultCount');
    const exportBtn = document.getElementById('exportBtn');
    
    if (result.error) {
        container.innerHTML = `
            <div class="result-error">
                <i class="fas fa-exclamation-triangle"></i>
                Error: ${result.error}
            </div>
        `;
        countEl.textContent = '';
        exportBtn.style.display = 'none';
        return;
    }
    
    if (result.aggregate) {
        const values = Object.entries(result.data).map(([key, value]) => `
            <div class="aggregate-item">
                <div class="aggregate-label">${key}</div>
                <div class="aggregate-value">${value}</div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="aggregate-result">
                <h3>Aggregate Results</h3>
                <div class="aggregate-values">${values}</div>
            </div>
        `;
        countEl.textContent = 'Aggregate query executed';
        exportBtn.style.display = 'none';
        return;
    }
    
    if (result.data.length === 0) {
        container.innerHTML = `
            <div class="result-info">
                <i class="fas fa-info-circle"></i>
                Query executed successfully. No matching rows found.
            </div>
        `;
        countEl.textContent = '0 rows';
        exportBtn.style.display = 'none';
        return;
    }
    
    // Table result
    container.innerHTML = `
        <table class="result-table">
            <thead>
                <tr>
                    ${result.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${result.data.map(row => `
                    <tr>
                        ${result.columns.map(col => `<td>${row[col] !== undefined ? row[col] : ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    countEl.textContent = `${result.data.length} row(s) returned`;
    exportBtn.style.display = 'inline-flex';
    
    // Store current result for export
    window.currentResult = result;
}

// Export results as CSV
function exportResults() {
    if (!window.currentResult) return;
    
    const result = window.currentResult;
    let csv = result.columns.join(',') + '\n';
    
    result.data.forEach(row => {
        csv += result.columns.map(col => {
            let val = row[col];
            if (typeof val === 'string' && val.includes(',')) {
                val = `"${val}"`;
            }
            return val;
        }).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_result.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Add to history
function addToHistory(query) {
    queryHistory.unshift({
        query: query,
        time: new Date().toLocaleTimeString()
    });
    
    // Keep only last 20 queries
    if (queryHistory.length > 20) {
        queryHistory.pop();
    }
    
    saveToStorage();
    renderHistory();
}

// Render history
function renderHistory() {
    const container = document.getElementById('historyContainer');
    
    if (queryHistory.length === 0) {
        container.innerHTML = '<p class="empty-history">No queries executed yet</p>';
        return;
    }
    
    container.innerHTML = queryHistory.map((item, index) => `
        <div class="history-item" onclick="loadFromHistory(${index})">
            <span class="history-query">${item.query}</span>
            <span class="history-time">${item.time}</span>
        </div>
    `).join('');
}

// Load from history
function loadFromHistory(index) {
    document.getElementById('queryInput').value = queryHistory[index].query;
}

// Clear history
function clearHistory() {
    queryHistory = [];
    saveToStorage();
    renderHistory();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(79, 172, 254, 0.9)'};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
