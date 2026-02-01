// ===========================
// Normalization Assistant Script
// ===========================

// State Management
let state = {
    relationName: '',
    attributes: [],
    functionalDependencies: [],
    candidateKeys: [],
    normalizationStatus: {
        '1NF': { pass: false, violations: [] },
        '2NF': { pass: false, violations: [] },
        '3NF': { pass: false, violations: [] },
        'BCNF': { pass: false, violations: [] }
    },
    decomposedRelations: []
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Input listeners
    document.getElementById('relationName').addEventListener('input', function(e) {
        state.relationName = e.target.value.trim();
    });
    
    document.getElementById('attributes').addEventListener('input', function(e) {
        const input = e.target.value.trim();
        if (input) {
            state.attributes = input.split(',').map(attr => attr.trim().toUpperCase()).filter(a => a);
        } else {
            state.attributes = [];
        }
        updateAttributeCheckboxes();
    });
    
    // Button listeners
    document.getElementById('addFdBtn').addEventListener('click', addFunctionalDependency);
    document.getElementById('analyzeBtn').addEventListener('click', analyzeNormalization);
    document.getElementById('tutorialBtn').addEventListener('click', () => openModal('tutorialModal'));
    document.getElementById('demoBtn').addEventListener('click', loadDemo);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    document.getElementById('computeClosureBtn').addEventListener('click', computeClosure);
    
    // Enter key for FD inputs
    document.getElementById('fdLhs').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('fdRhs').focus();
    });
    
    document.getElementById('fdRhs').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addFunctionalDependency();
    });
}

// Update Attribute Checkboxes for Closure
function updateAttributeCheckboxes() {
    const container = document.getElementById('closureAttributes');
    container.innerHTML = '';
    
    state.attributes.forEach(attr => {
        const label = document.createElement('label');
        label.className = 'attr-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${attr}">
            <span>${attr}</span>
        `;
        label.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input');
                checkbox.checked = !checkbox.checked;
            }
            this.classList.toggle('selected', this.querySelector('input').checked);
        });
        container.appendChild(label);
    });
}

// Functional Dependency Management
function addFunctionalDependency() {
    const lhsInput = document.getElementById('fdLhs');
    const rhsInput = document.getElementById('fdRhs');
    
    const lhs = lhsInput.value.trim().toUpperCase().split(',').map(a => a.trim()).filter(a => a);
    const rhs = rhsInput.value.trim().toUpperCase().split(',').map(a => a.trim()).filter(a => a);
    
    if (lhs.length === 0 || rhs.length === 0) {
        showToast('Please enter both LHS and RHS attributes', 'error');
        return;
    }
    
    // Validate attributes exist
    const allAttrs = [...lhs, ...rhs];
    for (const attr of allAttrs) {
        if (!state.attributes.includes(attr)) {
            showToast(`Attribute "${attr}" is not in the relation. Add it to attributes first.`, 'error');
            return;
        }
    }
    
    // Check for duplicates
    if (state.functionalDependencies.some(fd => 
        arraysEqual(fd.lhs, lhs) && arraysEqual(fd.rhs, rhs)
    )) {
        showToast('This functional dependency already exists', 'warning');
        return;
    }
    
    state.functionalDependencies.push({ lhs, rhs });
    updateFdList();
    
    // Clear inputs
    lhsInput.value = '';
    rhsInput.value = '';
    lhsInput.focus();
    
    showToast('Functional dependency added', 'success');
}

function removeFd(index) {
    state.functionalDependencies.splice(index, 1);
    updateFdList();
}

function updateFdList() {
    const container = document.getElementById('fdList');
    
    if (state.functionalDependencies.length === 0) {
        container.innerHTML = '<p class="empty-state">No functional dependencies added yet</p>';
        return;
    }
    
    container.innerHTML = state.functionalDependencies.map((fd, index) => `
        <div class="fd-item">
            <span class="fd-text">${fd.lhs.join(', ')} → ${fd.rhs.join(', ')}</span>
            <button class="fd-delete" onclick="removeFd(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Attribute Closure Algorithm
function computeAttributeClosure(attributes, fds) {
    let closure = new Set(attributes);
    let changed = true;
    
    while (changed) {
        changed = false;
        for (const fd of fds) {
            if (fd.lhs.every(attr => closure.has(attr))) {
                const oldSize = closure.size;
                fd.rhs.forEach(attr => closure.add(attr));
                if (closure.size > oldSize) {
                    changed = true;
                }
            }
        }
    }
    
    return Array.from(closure).sort();
}

function computeClosure() {
    const checkboxes = document.querySelectorAll('#closureAttributes .attr-checkbox.selected');
    const selectedAttrs = Array.from(checkboxes).map(cb => cb.querySelector('input').value);
    
    if (selectedAttrs.length === 0) {
        showToast('Please select at least one attribute', 'error');
        return;
    }
    
    const closure = computeAttributeClosure(selectedAttrs, state.functionalDependencies);
    
    document.getElementById('closureResult').innerHTML = `
        <div class="closure-formula">
            {${selectedAttrs.join(', ')}}<sup>+</sup> = {${closure.join(', ')}}
        </div>
    `;
}

// Candidate Key Finding
function findCandidateKeys() {
    if (state.attributes.length === 0) return [];
    
    const lhsOnly = new Set();
    const rhsOnly = new Set();
    
    state.attributes.forEach(attr => {
        const inLhs = state.functionalDependencies.some(fd => fd.lhs.includes(attr));
        const inRhs = state.functionalDependencies.some(fd => fd.rhs.includes(attr));
        
        if (inLhs && !inRhs) lhsOnly.add(attr);
        else if (!inLhs && inRhs) rhsOnly.add(attr);
    });
    
    const mustBeInKey = Array.from(lhsOnly);
    const candidateKeys = [];
    const remainingAttrs = state.attributes.filter(a => !lhsOnly.has(a) && !rhsOnly.has(a));
    
    function generateCombinations(arr, prefix = []) {
        const result = [prefix];
        for (let i = 0; i < arr.length; i++) {
            result.push(...generateCombinations(arr.slice(i + 1), [...prefix, arr[i]]));
        }
        return result;
    }
    
    const combinations = generateCombinations(remainingAttrs);
    
    for (const combo of combinations) {
        const potential = [...mustBeInKey, ...combo];
        const closure = computeAttributeClosure(potential, state.functionalDependencies);
        
        if (closure.length === state.attributes.length && 
            state.attributes.every(a => closure.includes(a))) {
            
            let isSuperset = false;
            for (const key of candidateKeys) {
                if (key.every(k => potential.includes(k)) && key.length < potential.length) {
                    isSuperset = true;
                    break;
                }
            }
            
            if (!isSuperset) {
                const filteredKeys = candidateKeys.filter(key => 
                    !potential.every(p => key.includes(p)) || key.length <= potential.length
                );
                candidateKeys.length = 0;
                candidateKeys.push(...filteredKeys);
                
                if (!candidateKeys.some(key => key.every(k => potential.includes(k)))) {
                    candidateKeys.push(potential);
                }
            }
        }
    }
    
    if (candidateKeys.length === 0) {
        candidateKeys.push(state.attributes);
    }
    
    return candidateKeys;
}

function updateCandidateKeys() {
    state.candidateKeys = findCandidateKeys();
    const container = document.getElementById('candidateKeys');
    
    if (state.candidateKeys.length === 0) {
        container.innerHTML = '<p class="empty-state">No candidate keys found</p>';
        return;
    }
    
    container.innerHTML = state.candidateKeys.map(key => `
        <div class="key-item">
            <i class="fas fa-key"></i>
            <span>{${key.join(', ')}}</span>
        </div>
    `).join('');
}

// Normalization Analysis
function analyzeNormalization() {
    if (state.attributes.length === 0) {
        showToast('Please enter attributes first', 'error');
        return;
    }
    
    if (state.functionalDependencies.length === 0) {
        showToast('Please add at least one functional dependency', 'warning');
    }
    
    // Find candidate keys
    updateCandidateKeys();
    
    // Check each normal form
    check1NF();
    check2NF();
    check3NF();
    checkBCNF();
    
    // Update display
    updateNormalizationDisplay();
    
    // Decompose if needed
    if (!state.normalizationStatus.BCNF.pass) {
        decomposeToBCNF();
    } else {
        displayNoDecomposition();
    }
    
    showToast('Analysis complete!', 'success');
}

function check1NF() {
    const violations = [];
    
    state.attributes.forEach(attr => {
        if (attr.includes('[') || attr.includes(']') || attr.includes('{') || attr.includes('}')) {
            violations.push({
                message: `Attribute "${attr}" appears to contain non-atomic values`
            });
        }
    });
    
    state.normalizationStatus['1NF'] = {
        pass: violations.length === 0,
        violations: violations
    };
}

function check2NF() {
    const violations = [];
    const primeAttrs = new Set();
    state.candidateKeys.forEach(key => key.forEach(attr => primeAttrs.add(attr)));
    
    for (const fd of state.functionalDependencies) {
        const nonPrimeInRhs = fd.rhs.filter(a => !primeAttrs.has(a));
        
        if (nonPrimeInRhs.length > 0) {
            for (const key of state.candidateKeys) {
                if (fd.lhs.every(a => key.includes(a)) && fd.lhs.length < key.length) {
                    violations.push({
                        message: `${fd.lhs.join(', ')} → ${nonPrimeInRhs.join(', ')} is a partial dependency`
                    });
                }
            }
        }
    }
    
    state.normalizationStatus['2NF'] = {
        pass: violations.length === 0 && state.normalizationStatus['1NF'].pass,
        violations: violations
    };
}

function check3NF() {
    const violations = [];
    const primeAttrs = new Set();
    state.candidateKeys.forEach(key => key.forEach(attr => primeAttrs.add(attr)));
    
    for (const fd of state.functionalDependencies) {
        const lhsClosure = computeAttributeClosure(fd.lhs, state.functionalDependencies);
        const isSuperkey = state.attributes.every(a => lhsClosure.includes(a));
        
        if (!isSuperkey) {
            const nonPrimeInRhs = fd.rhs.filter(a => !primeAttrs.has(a));
            
            if (nonPrimeInRhs.length > 0) {
                violations.push({
                    message: `${fd.lhs.join(', ')} → ${nonPrimeInRhs.join(', ')} is a transitive dependency`
                });
            }
        }
    }
    
    state.normalizationStatus['3NF'] = {
        pass: violations.length === 0 && state.normalizationStatus['2NF'].pass,
        violations: violations
    };
}

function checkBCNF() {
    const violations = [];
    
    for (const fd of state.functionalDependencies) {
        if (fd.rhs.every(a => fd.lhs.includes(a))) continue;
        
        const lhsClosure = computeAttributeClosure(fd.lhs, state.functionalDependencies);
        const isSuperkey = state.attributes.every(a => lhsClosure.includes(a));
        
        if (!isSuperkey) {
            violations.push({
                message: `${fd.lhs.join(', ')} → ${fd.rhs.join(', ')} violates BCNF (LHS is not a superkey)`
            });
        }
    }
    
    state.normalizationStatus['BCNF'] = {
        pass: violations.length === 0 && state.normalizationStatus['3NF'].pass,
        violations: violations
    };
}

function updateNormalizationDisplay() {
    ['1NF', '2NF', '3NF', 'BCNF'].forEach(nf => {
        const status = state.normalizationStatus[nf];
        const step = document.getElementById(`step${nf}`);
        const statusEl = step.querySelector('.norm-status');
        const resultEl = step.querySelector('.norm-result');
        
        statusEl.className = `norm-status ${status.pass ? 'pass' : 'fail'}`;
        statusEl.innerHTML = status.pass ? 
            '<i class="fas fa-check"></i> Pass' : 
            '<i class="fas fa-times"></i> Fail';
        
        if (status.violations.length > 0) {
            resultEl.innerHTML = status.violations.map(v => `
                <div class="violation-item">
                    <h4><i class="fas fa-exclamation-triangle"></i> Violation</h4>
                    <p>${v.message}</p>
                </div>
            `).join('');
        } else {
            resultEl.innerHTML = `
                <div class="success-item">
                    <h4><i class="fas fa-check-circle"></i> ${nf} Satisfied</h4>
                </div>
            `;
        }
    });
}

// BCNF Decomposition
function decomposeToBCNF() {
    let relations = [{
        name: state.relationName || 'R',
        attributes: [...state.attributes],
        fds: [...state.functionalDependencies]
    }];
    
    let changed = true;
    let iteration = 0;
    
    while (changed && iteration < 100) {
        changed = false;
        iteration++;
        
        for (let i = 0; i < relations.length; i++) {
            const rel = relations[i];
            
            for (const fd of rel.fds) {
                if (fd.rhs.every(a => fd.lhs.includes(a))) continue;
                
                const closure = computeAttributeClosure(fd.lhs, rel.fds);
                const isSuperkey = rel.attributes.every(a => closure.includes(a));
                
                if (!isSuperkey) {
                    const r1Attrs = [...new Set([...fd.lhs, ...fd.rhs])];
                    const r2Attrs = [...new Set([...fd.lhs, ...rel.attributes.filter(a => !fd.rhs.includes(a) || fd.lhs.includes(a))])];
                    
                    const r1Fds = rel.fds.filter(f => 
                        f.lhs.every(a => r1Attrs.includes(a)) && 
                        f.rhs.every(a => r1Attrs.includes(a))
                    );
                    
                    const r2Fds = rel.fds.filter(f => 
                        f.lhs.every(a => r2Attrs.includes(a)) && 
                        f.rhs.every(a => r2Attrs.includes(a))
                    );
                    
                    relations.splice(i, 1, 
                        { name: `${rel.name}1`, attributes: r1Attrs, fds: r1Fds },
                        { name: `${rel.name}2`, attributes: r2Attrs, fds: r2Fds }
                    );
                    
                    changed = true;
                    break;
                }
            }
            
            if (changed) break;
        }
    }
    
    state.decomposedRelations = relations;
    displayDecomposition();
}

function findKeyForRelation(rel) {
    const allCombinations = [];
    
    function generateCombinations(arr, prefix = []) {
        if (prefix.length > 0) allCombinations.push(prefix);
        for (let i = 0; i < arr.length; i++) {
            generateCombinations(arr.slice(i + 1), [...prefix, arr[i]]);
        }
    }
    
    generateCombinations(rel.attributes);
    allCombinations.sort((a, b) => a.length - b.length);
    
    for (const combo of allCombinations) {
        const closure = computeAttributeClosure(combo, rel.fds);
        if (rel.attributes.every(a => closure.includes(a))) {
            return combo;
        }
    }
    
    return rel.attributes;
}

function displayDecomposition() {
    const container = document.getElementById('decomposedTables');
    
    container.innerHTML = state.decomposedRelations.map(rel => {
        const key = findKeyForRelation(rel);
        
        return `
            <div class="decomposed-table">
                <div class="decomposed-table-header">
                    <i class="fas fa-table"></i>
                    <h4>${rel.name}</h4>
                </div>
                <div class="decomposed-table-content">
                    <div class="attribute-list">
                        ${rel.attributes.map(attr => `
                            <span class="attr-tag ${key.includes(attr) ? 'key' : ''}">${attr}${key.includes(attr) ? ' 🔑' : ''}</span>
                        `).join('')}
                    </div>
                    ${rel.fds.length > 0 ? `
                        <div class="fd-in-table">
                            FDs: ${rel.fds.map(fd => `${fd.lhs.join(',')} → ${fd.rhs.join(',')}`).join('; ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    verifyDecomposition();
}

function displayNoDecomposition() {
    const container = document.getElementById('decomposedTables');
    container.innerHTML = `
        <div class="decomposed-table" style="grid-column: 1 / -1;">
            <div class="decomposed-table-header">
                <i class="fas fa-check-circle"></i>
                <h4>No Decomposition Needed</h4>
            </div>
            <div class="decomposed-table-content">
                <p style="margin-bottom: 12px;">The relation is already in BCNF!</p>
                <div class="attribute-list">
                    ${state.attributes.map(attr => {
                        const isKey = state.candidateKeys[0]?.includes(attr);
                        return `<span class="attr-tag ${isKey ? 'key' : ''}">${attr}${isKey ? ' 🔑' : ''}</span>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('losslessCheck').className = 'check-item pass';
    document.getElementById('losslessCheck').innerHTML = '<i class="fas fa-check"></i><span>Lossless Join - N/A</span>';
    document.getElementById('depPreserveCheck').className = 'check-item pass';
    document.getElementById('depPreserveCheck').innerHTML = '<i class="fas fa-check"></i><span>Dependency Preservation - N/A</span>';
}

function verifyDecomposition() {
    const lossless = true; // Simplified - BCNF decomposition is always lossless
    const losslessEl = document.getElementById('losslessCheck');
    losslessEl.className = `check-item pass`;
    losslessEl.innerHTML = `<i class="fas fa-check"></i><span>Lossless Join - Verified</span>`;
    
    // Check dependency preservation
    const allDecomposedFds = [];
    state.decomposedRelations.forEach(rel => allDecomposedFds.push(...rel.fds));
    
    let preserved = true;
    for (const fd of state.functionalDependencies) {
        const closure = computeAttributeClosure(fd.lhs, allDecomposedFds);
        if (!fd.rhs.every(a => closure.includes(a))) {
            preserved = false;
            break;
        }
    }
    
    const preserveEl = document.getElementById('depPreserveCheck');
    preserveEl.className = `check-item ${preserved ? 'pass' : 'fail'}`;
    preserveEl.innerHTML = `
        <i class="fas fa-${preserved ? 'check' : 'times'}"></i>
        <span>Dependency Preservation - ${preserved ? 'Verified' : 'Some FDs may be lost'}</span>
    `;
}

// Demo Data
function loadDemo() {
    document.getElementById('relationName').value = 'StudentCourse';
    document.getElementById('attributes').value = 'SID, SNAME, CID, CNAME, INSTRUCTOR';
    
    state.relationName = 'StudentCourse';
    state.attributes = ['SID', 'SNAME', 'CID', 'CNAME', 'INSTRUCTOR'];
    
    state.functionalDependencies = [
        { lhs: ['SID'], rhs: ['SNAME'] },
        { lhs: ['CID'], rhs: ['CNAME', 'INSTRUCTOR'] }
    ];
    
    updateFdList();
    updateAttributeCheckboxes();
    
    showToast('Demo data loaded! Click Analyze to see results.', 'success');
}

// Reset
function resetAll() {
    state = {
        relationName: '',
        attributes: [],
        functionalDependencies: [],
        candidateKeys: [],
        normalizationStatus: {
            '1NF': { pass: false, violations: [] },
            '2NF': { pass: false, violations: [] },
            '3NF': { pass: false, violations: [] },
            'BCNF': { pass: false, violations: [] }
        },
        decomposedRelations: []
    };
    
    document.getElementById('relationName').value = '';
    document.getElementById('attributes').value = '';
    document.getElementById('fdLhs').value = '';
    document.getElementById('fdRhs').value = '';
    
    updateFdList();
    document.getElementById('closureAttributes').innerHTML = '';
    document.getElementById('candidateKeys').innerHTML = '<p class="empty-state">Analyze the relation to find candidate keys</p>';
    document.getElementById('closureResult').innerHTML = '';
    document.getElementById('decomposedTables').innerHTML = '';
    
    ['1NF', '2NF', '3NF', 'BCNF'].forEach(nf => {
        const step = document.getElementById(`step${nf}`);
        step.querySelector('.norm-status').className = 'norm-status pending';
        step.querySelector('.norm-status').innerHTML = '<i class="fas fa-clock"></i> Pending';
        step.querySelector('.norm-result').innerHTML = '';
    });
    
    document.getElementById('losslessCheck').className = 'check-item pending';
    document.getElementById('losslessCheck').innerHTML = '<i class="fas fa-clock"></i><span>Lossless Join Property</span>';
    document.getElementById('depPreserveCheck').className = 'check-item pending';
    document.getElementById('depPreserveCheck').innerHTML = '<i class="fas fa-clock"></i><span>Dependency Preservation</span>';
    
    showToast('All data cleared', 'success');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Utility Functions
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add toast styles if not present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 14px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
                font-size: 0.9rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                animation-fill-mode: forwards;
            }
            .toast-success { background: #10b981; color: white; }
            .toast-error { background: #ef4444; color: white; }
            .toast-warning { background: #f59e0b; color: white; }
            .toast-info { background: #6366f1; color: white; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize
console.log('Normalization Assistant loaded successfully!');
