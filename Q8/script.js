// Deadlock & Recovery Visualizer - JavaScript Implementation

// Graph state
let processes = [];
let resources = [];
let edges = [];
let nodePositions = {};
let draggedNode = null;
let dragOffset = { x: 0, y: 0 };

// Banker's algorithm state
let bankersState = {
    numProcesses: 5,
    numResources: 3,
    available: [],
    max: [],
    allocation: [],
    need: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initGraph();
    updateEdgeSelects();
});

// ================== Resource Allocation Graph ==================

function initGraph() {
    const canvas = document.getElementById('graphCanvas');
    canvas.addEventListener('mousemove', handleDrag);
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mouseleave', stopDrag);
}

function addProcess() {
    const id = `P${processes.length + 1}`;
    processes.push(id);
    
    // Random position
    const canvas = document.getElementById('graphCanvas');
    const x = 50 + Math.random() * (canvas.offsetWidth - 150);
    const y = 50 + Math.random() * (canvas.offsetHeight - 150);
    nodePositions[id] = { x, y };
    
    renderGraph();
    updateEdgeSelects();
}

function addResource() {
    const id = `R${resources.length + 1}`;
    resources.push(id);
    
    // Random position
    const canvas = document.getElementById('graphCanvas');
    const x = 50 + Math.random() * (canvas.offsetWidth - 150);
    const y = 50 + Math.random() * (canvas.offsetHeight - 150);
    nodePositions[id] = { x, y };
    
    renderGraph();
    updateEdgeSelects();
}

function updateEdgeSelects() {
    const fromSelect = document.getElementById('edgeFrom');
    const toSelect = document.getElementById('edgeTo');
    
    fromSelect.innerHTML = '<option value="">From...</option>' +
        processes.map(p => `<option value="${p}">${p} (Process)</option>`).join('') +
        resources.map(r => `<option value="${r}">${r} (Resource)</option>`).join('');
    
    toSelect.innerHTML = '<option value="">To...</option>' +
        processes.map(p => `<option value="${p}">${p} (Process)</option>`).join('') +
        resources.map(r => `<option value="${r}">${r} (Resource)</option>`).join('');
}

function addEdge() {
    const from = document.getElementById('edgeFrom').value;
    const to = document.getElementById('edgeTo').value;
    const type = document.getElementById('edgeType').value;
    
    if (!from || !to) {
        alert('Please select both From and To nodes');
        return;
    }
    
    if (from === to) {
        alert('Cannot create edge to same node');
        return;
    }
    
    // Validate edge type
    const fromIsProcess = from.startsWith('P');
    const toIsProcess = to.startsWith('P');
    
    if (type === 'request') {
        if (!fromIsProcess || toIsProcess) {
            alert('Request edge must be from Process to Resource');
            return;
        }
    } else {
        if (fromIsProcess || !toIsProcess) {
            alert('Allocation edge must be from Resource to Process');
            return;
        }
    }
    
    // Check for duplicate
    const exists = edges.some(e => e.from === from && e.to === to);
    if (exists) {
        alert('Edge already exists');
        return;
    }
    
    edges.push({ from, to, type });
    renderGraph();
    
    // Clear detection result
    document.getElementById('detectionSection').style.display = 'none';
}

function renderGraph() {
    const nodesContainer = document.getElementById('graphNodes');
    const svg = document.getElementById('graphSvg');
    
    // Render nodes
    nodesContainer.innerHTML = '';
    
    [...processes, ...resources].forEach(id => {
        const pos = nodePositions[id];
        const isProcess = id.startsWith('P');
        
        const node = document.createElement('div');
        node.className = `graph-node ${isProcess ? 'process-node' : 'resource-node'}`;
        node.id = `node-${id}`;
        node.textContent = id;
        node.style.left = pos.x + 'px';
        node.style.top = pos.y + 'px';
        
        node.addEventListener('mousedown', (e) => startDrag(e, id));
        
        nodesContainer.appendChild(node);
    });
    
    // Render edges
    renderEdges();
}

function renderEdges() {
    const svg = document.getElementById('graphSvg');
    
    // Create arrow markers
    svg.innerHTML = `
        <defs>
            <marker id="arrowRequest" markerWidth="10" markerHeight="10" refX="35" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#fbbf24"/>
            </marker>
            <marker id="arrowAllocation" markerWidth="10" markerHeight="10" refX="35" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#a78bfa"/>
            </marker>
            <marker id="arrowDeadlock" markerWidth="10" markerHeight="10" refX="35" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444"/>
            </marker>
        </defs>
    `;
    
    edges.forEach(edge => {
        const fromPos = nodePositions[edge.from];
        const toPos = nodePositions[edge.to];
        
        if (!fromPos || !toPos) return;
        
        // Calculate center of nodes
        const x1 = fromPos.x + 30;
        const y1 = fromPos.y + 30;
        const x2 = toPos.x + 30;
        const y2 = toPos.y + 30;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', edge.type === 'request' ? '#fbbf24' : '#a78bfa');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('marker-end', `url(#arrow${edge.inDeadlock ? 'Deadlock' : (edge.type === 'request' ? 'Request' : 'Allocation')})`);
        
        if (edge.inDeadlock) {
            line.setAttribute('stroke', '#ef4444');
            line.setAttribute('stroke-width', '4');
        }
        
        svg.appendChild(line);
    });
}

function startDrag(e, nodeId) {
    draggedNode = nodeId;
    const pos = nodePositions[nodeId];
    dragOffset = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y
    };
}

function handleDrag(e) {
    if (!draggedNode) return;
    
    const canvas = document.getElementById('graphCanvas');
    const rect = canvas.getBoundingClientRect();
    
    let x = e.clientX - rect.left - 30;
    let y = e.clientY - rect.top - 30;
    
    // Bounds checking
    x = Math.max(0, Math.min(x, canvas.offsetWidth - 60));
    y = Math.max(0, Math.min(y, canvas.offsetHeight - 60));
    
    nodePositions[draggedNode] = { x, y };
    
    const node = document.getElementById(`node-${draggedNode}`);
    if (node) {
        node.style.left = x + 'px';
        node.style.top = y + 'px';
    }
    
    renderEdges();
}

function stopDrag() {
    draggedNode = null;
}

// ================== Deadlock Detection ==================

function detectDeadlock() {
    // Reset deadlock flags
    edges.forEach(e => e.inDeadlock = false);
    
    const cycle = findCycle();
    const section = document.getElementById('detectionSection');
    const result = document.getElementById('detectionResult');
    
    section.style.display = 'block';
    
    if (cycle) {
        // Mark edges in cycle
        for (let i = 0; i < cycle.length; i++) {
            const from = cycle[i];
            const to = cycle[(i + 1) % cycle.length];
            const edge = edges.find(e => 
                (e.from === from && e.to === to) || 
                (e.from === to && e.to === from)
            );
            if (edge) edge.inDeadlock = true;
        }
        
        // Mark nodes
        cycle.forEach(id => {
            const node = document.getElementById(`node-${id}`);
            if (node) node.classList.add('node-deadlock');
        });
        
        result.innerHTML = `
            <div class="detection-result deadlock">
                <h3><i class="fas fa-exclamation-triangle"></i> Deadlock Detected!</h3>
                <p>A cycle has been found in the resource allocation graph:</p>
                <div class="cycle-display">${cycle.join(' → ')} → ${cycle[0]}</div>
                <p style="margin-top: 15px; color: #ef4444;">
                    <strong>Impact:</strong> Processes ${cycle.filter(c => c.startsWith('P')).join(', ')} 
                    are in deadlock over resources ${cycle.filter(c => c.startsWith('R')).join(', ')}.
                </p>
            </div>
        `;
    } else {
        // Clear deadlock markers
        document.querySelectorAll('.node-deadlock').forEach(n => n.classList.remove('node-deadlock'));
        
        result.innerHTML = `
            <div class="detection-result safe">
                <h3><i class="fas fa-check-circle"></i> No Deadlock</h3>
                <p>The system is in a safe state. No cycles detected in the resource allocation graph.</p>
            </div>
        `;
    }
    
    renderGraph();
}

function findCycle() {
    // Build adjacency list
    const adj = {};
    [...processes, ...resources].forEach(id => adj[id] = []);
    
    edges.forEach(edge => {
        adj[edge.from].push(edge.to);
    });
    
    // DFS for cycle detection
    const visited = new Set();
    const recStack = new Set();
    const path = [];
    
    function dfs(node) {
        visited.add(node);
        recStack.add(node);
        path.push(node);
        
        for (const neighbor of adj[node]) {
            if (!visited.has(neighbor)) {
                const cycle = dfs(neighbor);
                if (cycle) return cycle;
            } else if (recStack.has(neighbor)) {
                // Found cycle
                const cycleStart = path.indexOf(neighbor);
                return path.slice(cycleStart);
            }
        }
        
        path.pop();
        recStack.delete(node);
        return null;
    }
    
    for (const node of [...processes, ...resources]) {
        if (!visited.has(node)) {
            const cycle = dfs(node);
            if (cycle) return cycle;
        }
    }
    
    return null;
}

// ================== Preset Scenarios ==================

function loadPresetScenario(type) {
    resetAll();
    
    if (type === 'simple') {
        // Classic deadlock: P1 holds R1, wants R2; P2 holds R2, wants R1
        processes = ['P1', 'P2'];
        resources = ['R1', 'R2'];
        
        nodePositions = {
            'P1': { x: 50, y: 150 },
            'P2': { x: 350, y: 150 },
            'R1': { x: 200, y: 50 },
            'R2': { x: 200, y: 250 }
        };
        
        edges = [
            { from: 'R1', to: 'P1', type: 'allocation' }, // P1 holds R1
            { from: 'P1', to: 'R2', type: 'request' },    // P1 wants R2
            { from: 'R2', to: 'P2', type: 'allocation' }, // P2 holds R2
            { from: 'P2', to: 'R1', type: 'request' }     // P2 wants R1
        ];
        
        renderGraph();
        updateEdgeSelects();
        
        setTimeout(() => detectDeadlock(), 500);
    }
}

function resetAll() {
    processes = [];
    resources = [];
    edges = [];
    nodePositions = {};
    
    document.getElementById('graphNodes').innerHTML = '';
    document.getElementById('graphSvg').innerHTML = '';
    document.getElementById('detectionSection').style.display = 'none';
    
    updateEdgeSelects();
}

// ================== Banker's Algorithm ==================

function initBankers() {
    bankersState.numProcesses = parseInt(document.getElementById('numProcesses').value);
    bankersState.numResources = parseInt(document.getElementById('numResources').value);
    
    // Initialize arrays
    bankersState.available = new Array(bankersState.numResources).fill(0);
    bankersState.max = [];
    bankersState.allocation = [];
    bankersState.need = [];
    
    for (let i = 0; i < bankersState.numProcesses; i++) {
        bankersState.max.push(new Array(bankersState.numResources).fill(0));
        bankersState.allocation.push(new Array(bankersState.numResources).fill(0));
        bankersState.need.push(new Array(bankersState.numResources).fill(0));
    }
    
    // Render matrices
    renderBankersMatrices();
    
    document.getElementById('matricesContainer').style.display = 'grid';
    document.getElementById('bankersActions').style.display = 'flex';
}

function renderBankersMatrices() {
    const resourceLabels = Array.from({ length: bankersState.numResources }, (_, i) => `R${i + 1}`);
    const processLabels = Array.from({ length: bankersState.numProcesses }, (_, i) => `P${i}`);
    
    // Available
    document.getElementById('availableMatrix').innerHTML = `
        <div class="matrix-header">
            ${resourceLabels.map(r => `<span>${r}</span>`).join('')}
        </div>
        <div class="matrix-row">
            ${bankersState.available.map((v, i) => 
                `<input type="number" id="avail_${i}" value="${v}" min="0" onchange="updateAvailable(${i})">`
            ).join('')}
        </div>
    `;
    
    // Max Matrix
    document.getElementById('maxMatrix').innerHTML = `
        <div class="matrix-header">
            ${resourceLabels.map(r => `<span>${r}</span>`).join('')}
        </div>
        ${processLabels.map((p, i) => `
            <div class="matrix-row">
                <span class="row-label">${p}</span>
                ${bankersState.max[i].map((v, j) => 
                    `<input type="number" id="max_${i}_${j}" value="${v}" min="0" onchange="updateMax(${i}, ${j})">`
                ).join('')}
            </div>
        `).join('')}
    `;
    
    // Allocation Matrix
    document.getElementById('allocationMatrix').innerHTML = `
        <div class="matrix-header">
            ${resourceLabels.map(r => `<span>${r}</span>`).join('')}
        </div>
        ${processLabels.map((p, i) => `
            <div class="matrix-row">
                <span class="row-label">${p}</span>
                ${bankersState.allocation[i].map((v, j) => 
                    `<input type="number" id="alloc_${i}_${j}" value="${v}" min="0" onchange="updateAllocation(${i}, ${j})">`
                ).join('')}
            </div>
        `).join('')}
    `;
    
    // Need Matrix (read-only)
    updateNeedMatrix();
}

function updateAvailable(j) {
    bankersState.available[j] = parseInt(document.getElementById(`avail_${j}`).value) || 0;
}

function updateMax(i, j) {
    bankersState.max[i][j] = parseInt(document.getElementById(`max_${i}_${j}`).value) || 0;
    updateNeedMatrix();
}

function updateAllocation(i, j) {
    bankersState.allocation[i][j] = parseInt(document.getElementById(`alloc_${i}_${j}`).value) || 0;
    updateNeedMatrix();
}

function updateNeedMatrix() {
    for (let i = 0; i < bankersState.numProcesses; i++) {
        for (let j = 0; j < bankersState.numResources; j++) {
            bankersState.need[i][j] = bankersState.max[i][j] - bankersState.allocation[i][j];
        }
    }
    
    const resourceLabels = Array.from({ length: bankersState.numResources }, (_, i) => `R${i + 1}`);
    const processLabels = Array.from({ length: bankersState.numProcesses }, (_, i) => `P${i}`);
    
    document.getElementById('needMatrix').innerHTML = `
        <div class="matrix-header">
            ${resourceLabels.map(r => `<span>${r}</span>`).join('')}
        </div>
        ${processLabels.map((p, i) => `
            <div class="matrix-row">
                <span class="row-label">${p}</span>
                ${bankersState.need[i].map(v => 
                    `<input type="number" value="${v}" readonly>`
                ).join('')}
            </div>
        `).join('')}
    `;
}

function checkSafeState() {
    const result = runBankersAlgorithm();
    const resultDiv = document.getElementById('bankersResult');
    
    resultDiv.classList.add('show');
    resultDiv.classList.remove('safe', 'unsafe');
    
    if (result.safe) {
        resultDiv.classList.add('safe');
        resultDiv.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> System is in SAFE State</h3>
            <p>A safe sequence exists where all processes can complete:</p>
            <div class="safe-sequence">
                ${result.sequence.map((p, i) => `
                    <span class="sequence-item">P${p}</span>
                    ${i < result.sequence.length - 1 ? '<span class="sequence-arrow">→</span>' : ''}
                `).join('')}
            </div>
            <div style="margin-top: 20px;">
                <h4>Execution Steps:</h4>
                ${result.steps.map(step => `<p style="margin: 5px 0; color: #a0a0a0;">• ${step}</p>`).join('')}
            </div>
        `;
    } else {
        resultDiv.classList.add('unsafe');
        resultDiv.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> System is in UNSAFE State</h3>
            <p style="color: #ef4444;">No safe sequence exists. The system may lead to deadlock!</p>
            <p style="margin-top: 10px; color: #a0a0a0;">
                Processes that cannot complete: ${result.blocked.map(p => `P${p}`).join(', ')}
            </p>
        `;
    }
}

function runBankersAlgorithm() {
    const n = bankersState.numProcesses;
    const m = bankersState.numResources;
    
    const work = [...bankersState.available];
    const finish = new Array(n).fill(false);
    const sequence = [];
    const steps = [];
    
    let found = true;
    while (found) {
        found = false;
        
        for (let i = 0; i < n; i++) {
            if (!finish[i]) {
                // Check if need[i] <= work
                let canProceed = true;
                for (let j = 0; j < m; j++) {
                    if (bankersState.need[i][j] > work[j]) {
                        canProceed = false;
                        break;
                    }
                }
                
                if (canProceed) {
                    // Process can complete
                    steps.push(`P${i} can proceed (Need: [${bankersState.need[i].join(', ')}] ≤ Work: [${work.join(', ')}])`);
                    
                    for (let j = 0; j < m; j++) {
                        work[j] += bankersState.allocation[i][j];
                    }
                    
                    steps.push(`P${i} releases resources. New Work: [${work.join(', ')}]`);
                    
                    finish[i] = true;
                    sequence.push(i);
                    found = true;
                }
            }
        }
    }
    
    const allFinished = finish.every(f => f);
    const blocked = finish.map((f, i) => f ? -1 : i).filter(i => i >= 0);
    
    return {
        safe: allFinished,
        sequence: sequence,
        steps: steps,
        blocked: blocked
    };
}

function loadBankersDemo() {
    document.getElementById('numProcesses').value = 5;
    document.getElementById('numResources').value = 3;
    initBankers();
    
    // Set demo values
    bankersState.available = [3, 3, 2];
    bankersState.max = [
        [7, 5, 3],
        [3, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3]
    ];
    bankersState.allocation = [
        [0, 1, 0],
        [2, 0, 0],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2]
    ];
    
    // Update UI
    for (let j = 0; j < 3; j++) {
        document.getElementById(`avail_${j}`).value = bankersState.available[j];
    }
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`max_${i}_${j}`).value = bankersState.max[i][j];
            document.getElementById(`alloc_${i}_${j}`).value = bankersState.allocation[i][j];
        }
    }
    
    updateNeedMatrix();
}

function requestResource() {
    const modal = document.getElementById('requestModal');
    const processSelect = document.getElementById('requestProcess');
    const vectorDiv = document.getElementById('requestVector');
    
    // Populate process select
    processSelect.innerHTML = Array.from({ length: bankersState.numProcesses }, (_, i) => 
        `<option value="${i}">P${i}</option>`
    ).join('');
    
    // Create request vector inputs
    vectorDiv.innerHTML = Array.from({ length: bankersState.numResources }, (_, i) => 
        `<input type="number" id="req_${i}" value="0" min="0" style="width: 50px;">`
    ).join('');
    
    showModal('requestModal');
}

function processRequest() {
    const processId = parseInt(document.getElementById('requestProcess').value);
    const request = Array.from({ length: bankersState.numResources }, (_, i) => 
        parseInt(document.getElementById(`req_${i}`).value) || 0
    );
    
    // Check if request <= need
    for (let j = 0; j < bankersState.numResources; j++) {
        if (request[j] > bankersState.need[processId][j]) {
            alert(`Error: Process has exceeded its maximum claim for resource R${j + 1}`);
            return;
        }
    }
    
    // Check if request <= available
    for (let j = 0; j < bankersState.numResources; j++) {
        if (request[j] > bankersState.available[j]) {
            alert(`Process P${processId} must wait. Request exceeds available resources.`);
            return;
        }
    }
    
    // Try to allocate (pretend)
    const tempAvailable = [...bankersState.available];
    const tempAllocation = bankersState.allocation.map(row => [...row]);
    const tempNeed = bankersState.need.map(row => [...row]);
    
    for (let j = 0; j < bankersState.numResources; j++) {
        tempAvailable[j] -= request[j];
        tempAllocation[processId][j] += request[j];
        tempNeed[processId][j] -= request[j];
    }
    
    // Check if resulting state is safe
    const originalAvail = bankersState.available;
    const originalAlloc = bankersState.allocation;
    const originalNeed = bankersState.need;
    
    bankersState.available = tempAvailable;
    bankersState.allocation = tempAllocation;
    bankersState.need = tempNeed;
    
    const result = runBankersAlgorithm();
    
    if (result.safe) {
        // Accept the request
        renderBankersMatrices();
        closeModal('requestModal');
        alert(`Request granted! System remains in safe state.\nSafe sequence: ${result.sequence.map(p => `P${p}`).join(' → ')}`);
    } else {
        // Reject the request
        bankersState.available = originalAvail;
        bankersState.allocation = originalAlloc;
        bankersState.need = originalNeed;
        alert(`Request denied! Granting this request would put the system in an unsafe state.`);
    }
}

// ================== Recovery Demonstrations ==================

function demonstrateRecovery(strategy) {
    const demo = document.getElementById('recoveryDemo');
    const animation = document.getElementById('recoveryAnimation');
    const log = document.getElementById('recoveryLog');
    
    demo.style.display = 'block';
    
    // Create sample deadlocked processes
    const deadlockedProcesses = ['P1', 'P2', 'P3'];
    const resources = ['R1', 'R2'];
    
    animation.innerHTML = deadlockedProcesses.map(p => `
        <div class="process-node" id="demo-${p}" style="position: relative;">${p}</div>
    `).join('') + resources.map(r => `
        <div class="resource-node" id="demo-${r}" style="position: relative;">${r}</div>
    `).join('');
    
    log.innerHTML = '';
    
    function addLog(message, type = 'info') {
        log.innerHTML += `<div class="log-entry ${type}">[${new Date().toLocaleTimeString()}] ${message}</div>`;
        log.scrollTop = log.scrollHeight;
    }
    
    addLog('Deadlock detected among P1, P2, P3', 'error');
    addLog(`Initiating recovery strategy: ${strategy.replace('-', ' ').toUpperCase()}`);
    
    switch (strategy) {
        case 'abort-all':
            setTimeout(() => {
                addLog('Aborting all deadlocked processes...', 'warning');
            }, 500);
            setTimeout(() => {
                document.getElementById('demo-P1').style.opacity = '0.3';
                addLog('P1 aborted', 'error');
            }, 1000);
            setTimeout(() => {
                document.getElementById('demo-P2').style.opacity = '0.3';
                addLog('P2 aborted', 'error');
            }, 1500);
            setTimeout(() => {
                document.getElementById('demo-P3').style.opacity = '0.3';
                addLog('P3 aborted', 'error');
            }, 2000);
            setTimeout(() => {
                addLog('All resources freed. Deadlock resolved.', 'success');
                addLog('Warning: All work lost for aborted processes', 'warning');
            }, 2500);
            break;
            
        case 'abort-one':
            setTimeout(() => {
                addLog('Calculating victim based on priority...', 'info');
            }, 500);
            setTimeout(() => {
                addLog('P3 selected as victim (lowest priority)', 'warning');
            }, 1000);
            setTimeout(() => {
                document.getElementById('demo-P3').style.opacity = '0.3';
                addLog('P3 aborted, resources released', 'error');
            }, 1500);
            setTimeout(() => {
                addLog('Checking for deadlock...', 'info');
            }, 2000);
            setTimeout(() => {
                addLog('Deadlock still exists, selecting next victim: P2', 'warning');
            }, 2500);
            setTimeout(() => {
                document.getElementById('demo-P2').style.opacity = '0.3';
                addLog('P2 aborted, resources released', 'error');
            }, 3000);
            setTimeout(() => {
                addLog('Deadlock resolved! P1 can now proceed.', 'success');
            }, 3500);
            break;
            
        case 'preempt':
            setTimeout(() => {
                addLog('Initiating resource preemption...', 'info');
            }, 500);
            setTimeout(() => {
                addLog('Preempting R1 from P1', 'warning');
                document.getElementById('demo-R1').style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            }, 1000);
            setTimeout(() => {
                addLog('R1 assigned to P2', 'info');
                document.getElementById('demo-R1').style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            }, 1500);
            setTimeout(() => {
                addLog('P2 can now complete execution', 'success');
                document.getElementById('demo-P2').style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            }, 2000);
            setTimeout(() => {
                addLog('P2 releases all resources', 'info');
            }, 2500);
            setTimeout(() => {
                addLog('P1 and P3 can now proceed. Deadlock resolved!', 'success');
            }, 3000);
            break;
            
        case 'rollback':
            setTimeout(() => {
                addLog('Identifying checkpoints...', 'info');
            }, 500);
            setTimeout(() => {
                addLog('P1 checkpoint found at T-5 minutes', 'info');
                addLog('P2 checkpoint found at T-3 minutes', 'info');
            }, 1000);
            setTimeout(() => {
                addLog('Rolling back P2 to checkpoint...', 'warning');
                document.getElementById('demo-P2').style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            }, 1500);
            setTimeout(() => {
                addLog('P2 state restored, resources released', 'info');
                document.getElementById('demo-P2').style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
            }, 2000);
            setTimeout(() => {
                addLog('P1 and P3 can acquire needed resources', 'success');
            }, 2500);
            setTimeout(() => {
                addLog('P2 will restart from checkpoint', 'info');
            }, 3000);
            setTimeout(() => {
                addLog('Deadlock resolved with minimal work loss!', 'success');
            }, 3500);
            break;
    }
}

// ================== Modals ==================

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showTutorial() {
    showModal('tutorialModal');
}
