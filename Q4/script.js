// Transaction Management Simulator JavaScript

// Global state management
let transactionState = {
    currentState: 'active',
    accountA: 1000,
    accountB: 500,
    dirtyReadStep: 0,
    isRunning: false,
    tourStep: 0,
    userPrivileges: {
        alice: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP'],
        bob: [],
        charlie: []
    }
};

// Welcome Modal and Tour Functions
function showWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'block';
}

function closeWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

function startGuidedTour() {
    closeWelcomeModal();
    transactionState.tourStep = 0;
    nextTourStep();
}

function nextTourStep() {
    const steps = [
        {
            element: '#section-states',
            message: 'Start here! This shows how transactions move through different states. Try the buttons!',
            highlight: true
        },
        {
            element: '#section-acid',
            message: 'Learn about ACID properties - the foundation of reliable transactions. Each has interactive examples!',
            highlight: true
        },
        {
            element: '#section-dirty-read',
            message: 'This demonstrates a common concurrency problem. Watch how dirty reads can cause issues!',
            highlight: true
        },
        {
            element: '#section-privileges',
            message: 'Finally, explore database security with GRANT and REVOKE operations!',
            highlight: true
        }
    ];
    
    if (transactionState.tourStep < steps.length) {
        const step = steps[transactionState.tourStep];
        highlightElement(step.element, step.message);
        transactionState.tourStep++;
    } else {
        endTour();
    }
}

function highlightElement(selector, message) {
    // Remove previous highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
    
    // Add highlight to current element
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('tour-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show tour message
        showTourMessage(message);
    }
}

function showTourMessage(message) {
    let tourMessage = document.getElementById('tourMessage');
    if (!tourMessage) {
        tourMessage = document.createElement('div');
        tourMessage.id = 'tourMessage';
        tourMessage.className = 'tour-message';
        document.body.appendChild(tourMessage);
    }
    
    tourMessage.innerHTML = `
        <div class="tour-content">
            <p>${message}</p>
            <button onclick="nextTourStep()" class="btn-primary">Next</button>
            <button onclick="endTour()" class="btn-secondary">Skip Tour</button>
        </div>
    `;
    tourMessage.style.display = 'block';
}

function endTour() {
    const tourMessage = document.getElementById('tourMessage');
    if (tourMessage) {
        tourMessage.style.display = 'none';
    }
    
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
}

// Tooltip Functions
function showTooltip(event, text) {
    const tooltip = document.getElementById('helpTooltip');
    const tooltipText = tooltip.querySelector('.tooltip-text');
    
    tooltipText.textContent = text;
    tooltip.classList.add('show');
    
    // Position tooltip near the cursor
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
}

function hideTooltip() {
    const tooltip = document.getElementById('helpTooltip');
    tooltip.classList.remove('show');
}

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addLogEntry(message) {
    const log = document.getElementById('transaction-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function showSpinner(element) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    element.insertBefore(spinner, element.firstChild);
}

function hideSpinner(element) {
    const spinner = element.querySelector('.spinner');
    if (spinner) spinner.remove();
}

// ==========================
// TRANSACTION STATES SECTION
// ==========================

async function simulateTransaction(type) {
    if (transactionState.isRunning) return;
    
    transactionState.isRunning = true;
    disableTransactionButtons(true);
    showProgressIndicator('transaction-progress', 'Processing transaction...');
    
    resetStates();
    
    // Start with Active state
    await animateToState('active');
    updateProgress('transaction-progress', 25);
    await sleep(1000);
    
    if (type === 'success') {
        // Success path: Active -> Partially Committed -> Committed
        await animateToState('partially-committed');
        updateProgress('transaction-progress', 60);
        await sleep(1500);
        await animateToState('committed');
        updateProgress('transaction-progress', 100);
        showSuccessMessage('Transaction completed successfully! ✅');
    } else {
        // Failure path: Active -> Failed -> Aborted
        await animateToState('failed');
        updateProgress('transaction-progress', 60);
        await sleep(1500);
        await animateToState('aborted');
        updateProgress('transaction-progress', 100);
        showErrorMessage('Transaction failed and was rolled back! ❌');
    }
    
    await sleep(1000);
    hideProgressIndicator('transaction-progress');
    disableTransactionButtons(false);
    transactionState.isRunning = false;
}

async function animateToState(stateName) {
    // Remove all active states
    document.querySelectorAll('.state').forEach(state => {
        state.classList.remove('active', 'partially-committed', 'committed', 'failed', 'aborted');
    });
    
    // Add animation class
    const stateElement = document.getElementById(stateName);
    stateElement.classList.add('animating');
    stateElement.classList.add(stateName);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        stateElement.classList.remove('animating');
    }, 500);
    
    transactionState.currentState = stateName;
}

function resetStates() {
    document.querySelectorAll('.state').forEach(state => {
        state.classList.remove('active', 'partially-committed', 'committed', 'failed', 'aborted', 'animating');
    });
    document.getElementById('active').classList.add('active');
    transactionState.currentState = 'active';
}

// ========================
// ACID PROPERTIES SECTION
// ========================

// Atomicity Demonstration
async function demonstrateAtomicity(type) {
    const accountAElement = document.getElementById('account-a');
    const accountBElement = document.getElementById('account-b');
    
    // Reset to original values
    transactionState.accountA = 1000;
    transactionState.accountB = 500;
    updateBalanceDisplay();
    
    await sleep(500);
    
    if (type === 'success') {
        // Successful transfer - both operations succeed
        accountAElement.classList.add('updating');
        accountBElement.classList.add('updating');
        
        await sleep(1000);
        
        // Transfer $200 from A to B
        transactionState.accountA -= 200;
        transactionState.accountB += 200;
        updateBalanceDisplay();
        
        setTimeout(() => {
            accountAElement.classList.remove('updating');
            accountBElement.classList.remove('updating');
        }, 1000);
        
        showMessage('atomicity-demo', 'Transaction completed successfully! Both accounts updated.', 'success');
    } else {
        // Failed transfer - all operations rolled back
        accountAElement.classList.add('updating');
        
        await sleep(500);
        
        // Simulate failure after first operation
        showMessage('atomicity-demo', 'Error during transfer! Rolling back all changes...', 'error');
        
        await sleep(1500);
        
        // Rollback - balances remain unchanged
        accountAElement.classList.remove('updating');
        showMessage('atomicity-demo', 'Rollback complete. All operations undone.', 'success');
    }
}

function updateBalanceDisplay() {
    document.getElementById('account-a').textContent = `$${transactionState.accountA}`;
    document.getElementById('account-b').textContent = `$${transactionState.accountB}`;
}

// Consistency Demonstration
function demonstrateConsistency() {
    const withdrawAmount = parseInt(document.getElementById('withdraw-amount').value) || 0;
    const resultElement = document.getElementById('consistency-result');
    
    resultElement.className = '';
    
    if (withdrawAmount <= 0) {
        resultElement.textContent = 'Please enter a valid withdrawal amount.';
        resultElement.classList.add('error');
        return;
    }
    
    const currentBalance = 1000; // Simulated account balance
    
    if (withdrawAmount > currentBalance) {
        // Violates consistency constraint
        resultElement.textContent = `❌ Transaction rejected! Withdrawal of $${withdrawAmount} would violate constraint (balance ≥ $0)`;
        resultElement.classList.add('error');
    } else {
        // Maintains consistency
        const newBalance = currentBalance - withdrawAmount;
        resultElement.textContent = `✅ Transaction approved! New balance: $${newBalance} (constraint satisfied)`;
        resultElement.classList.add('success');
    }
}

// Isolation Demonstration
async function demonstrateIsolation() {
    const tx1Status = document.querySelector('#tx1 .tx-status');
    const tx2Status = document.querySelector('#tx2 .tx-status');
    
    // Reset states
    tx1Status.textContent = 'Starting...';
    tx2Status.textContent = 'Starting...';
    tx1Status.className = 'tx-status running';
    tx2Status.className = 'tx-status running';
    
    await sleep(1000);
    
    // Transaction 1 starts
    tx1Status.textContent = 'Reading data...';
    await sleep(1500);
    
    // Transaction 2 starts (concurrent)
    tx2Status.textContent = 'Reading data...';
    await sleep(1000);
    
    // Both transactions work with isolated data
    tx1Status.textContent = 'Processing (isolated)';
    tx2Status.textContent = 'Processing (isolated)';
    await sleep(2000);
    
    // Transactions complete
    tx1Status.textContent = 'Completed';
    tx2Status.textContent = 'Completed';
    tx1Status.className = 'tx-status completed';
    tx2Status.className = 'tx-status completed';
    
    setTimeout(() => {
        tx1Status.textContent = 'Idle';
        tx2Status.textContent = 'Idle';
        tx1Status.className = 'tx-status';
        tx2Status.className = 'tx-status';
    }, 3000);
}

// Durability Demonstration
async function demonstrateDurability() {
    const systemStatus = document.getElementById('system-status');
    const transactionLog = document.getElementById('transaction-log');
    
    // Clear log
    transactionLog.innerHTML = '';
    
    // Start transaction
    systemStatus.textContent = 'System Online';
    systemStatus.className = 'status-indicator online';
    
    addLogEntry('BEGIN TRANSACTION');
    await sleep(1000);
    
    addLogEntry('INSERT INTO accounts VALUES (123, 5000)');
    await sleep(1000);
    
    addLogEntry('UPDATE balances SET total = 15000');
    await sleep(1000);
    
    addLogEntry('COMMIT TRANSACTION');
    await sleep(1000);
    
    addLogEntry('Transaction committed to disk');
    await sleep(1500);
    
    // Simulate system crash
    systemStatus.textContent = 'System Crashed!';
    systemStatus.className = 'status-indicator crashed';
    
    addLogEntry('SYSTEM FAILURE DETECTED!');
    await sleep(2000);
    
    // System recovery
    systemStatus.textContent = 'System Recovered';
    systemStatus.className = 'status-indicator recovered';
    
    addLogEntry('Recovery process started...');
    await sleep(1000);
    
    addLogEntry('Reading transaction log...');
    await sleep(1000);
    
    addLogEntry('All committed transactions restored ✓');
    addLogEntry('Database integrity verified ✓');
    
    setTimeout(() => {
        systemStatus.textContent = 'System Online';
        systemStatus.className = 'status-indicator online';
    }, 3000);
}

function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    let messageDiv = container.querySelector('.message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        container.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// =====================
// DIRTY READ SCENARIO
// =====================

async function startDirtyReadDemo() {
    if (transactionState.isRunning) return;
    
    transactionState.isRunning = true;
    resetDirtyRead();
    transactionState.dirtyReadStep = 0;
    
    // Show demo status
    showProgressIndicator('dirty-read-status', 'Running dirty read demonstration...');
    disableDirtyReadButtons(true);
    
    const steps = [
        { tx: 1, step: 1, delay: 1000, progress: 12 },
        { tx: 1, step: 2, delay: 1500, progress: 25 },
        { tx: 2, step: 1, delay: 1000, progress: 37 },
        { tx: 2, step: 2, delay: 1500, progress: 50 },
        { tx: 2, step: 3, delay: 1500, progress: 62 },
        { tx: 1, step: 3, delay: 1000, progress: 75 },
        { tx: 1, step: 4, delay: 1500, progress: 87 },
        { tx: 2, step: 4, delay: 1000, progress: 100 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
        const { tx, step, delay, progress } = steps[i];
        await executeDirtyReadStep(tx, step);
        updateProgress('dirty-read-progress', progress);
        await sleep(delay);
    }
    
    showErrorMessage('Dirty read completed! Transaction 2 processed with incorrect data. 🚫');
    await sleep(2000);
    
    hideProgressIndicator('dirty-read-status');
    disableDirtyReadButtons(false);
    transactionState.isRunning = false;
}

async function executeDirtyReadStep(transactionNum, stepNum) {
    const txElement = document.getElementById(`transaction-${transactionNum}`);
    const steps = txElement.querySelectorAll('.step');
    const balanceValue = document.getElementById('balance-value');
    const balanceStatus = document.getElementById('balance-status');
    
    // Mark current step as active
    steps[stepNum - 1].classList.add('active');
    
    // Execute step logic
    if (transactionNum === 1 && stepNum === 2) {
        // Transaction 1 updates balance (uncommitted)
        balanceValue.textContent = '1500';
        balanceValue.classList.add('dirty');
        balanceStatus.textContent = 'Uncommitted';
        balanceStatus.className = 'uncommitted';
    } else if (transactionNum === 2 && stepNum === 2) {
        // Transaction 2 reads dirty data
        steps[stepNum - 1].classList.add('problem');
    } else if (transactionNum === 2 && stepNum === 3) {
        // Transaction 2 processes with dirty data
        steps[stepNum - 1].classList.add('problem');
    } else if (transactionNum === 1 && stepNum === 4) {
        // Transaction 1 rolls back
        balanceValue.textContent = '1000';
        balanceValue.classList.remove('dirty');
        balanceValue.classList.add('clean');
        balanceStatus.textContent = 'Committed';
        balanceStatus.className = 'committed';
    } else if (transactionNum === 2 && stepNum === 4) {
        // Transaction 2 commits with wrong data
        steps[stepNum - 1].classList.add('problem');
    }
    
    // Mark step as completed after a short delay
    setTimeout(() => {
        steps[stepNum - 1].classList.remove('active');
        steps[stepNum - 1].classList.add('completed');
    }, 800);
}

function resetDirtyRead() {
    // Reset all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed', 'problem');
    });
    
    // Reset data view
    document.getElementById('balance-value').textContent = '1000';
    document.getElementById('balance-value').className = '';
    document.getElementById('balance-status').textContent = 'Committed';
    document.getElementById('balance-status').className = 'committed';
    
    transactionState.dirtyReadStep = 0;
}

// ===============================
// PRIVILEGE MANAGEMENT SECTION
// ===============================

function grantPrivilege() {
    const user = document.getElementById('target-user').value;
    const privilege = document.getElementById('privilege-type').value;
    
    if (!transactionState.userPrivileges[user].includes(privilege)) {
        transactionState.userPrivileges[user].push(privilege);
        updatePrivilegeDisplay(user);
        showPrivilegeMessage(`GRANTED ${privilege} privilege to ${user}`, 'success');
    } else {
        showPrivilegeMessage(`${user} already has ${privilege} privilege`, 'error');
    }
}

function revokePrivilege() {
    const user = document.getElementById('target-user').value;
    const privilege = document.getElementById('privilege-type').value;
    
    const index = transactionState.userPrivileges[user].indexOf(privilege);
    if (index > -1) {
        transactionState.userPrivileges[user].splice(index, 1);
        updatePrivilegeDisplay(user);
        showPrivilegeMessage(`REVOKED ${privilege} privilege from ${user}`, 'success');
    } else {
        showPrivilegeMessage(`${user} doesn't have ${privilege} privilege`, 'error');
    }
}

function updatePrivilegeDisplay(user) {
    const privilegeElement = document.getElementById(`${user}-privileges`);
    const privileges = transactionState.userPrivileges[user];
    
    if (privileges.length === 0) {
        privilegeElement.textContent = 'No privileges';
    } else {
        privilegeElement.textContent = privileges.join(', ');
    }
    
    // Add animation
    privilegeElement.classList.add('fade-in');
    setTimeout(() => {
        privilegeElement.classList.remove('fade-in');
    }, 500);
}

function testOperation() {
    const user = document.getElementById('test-user').value;
    const operation = document.getElementById('test-operation').value;
    const resultElement = document.getElementById('operation-result');
    
    const hasPrivilege = transactionState.userPrivileges[user].includes(operation);
    
    resultElement.className = '';
    
    if (hasPrivilege) {
        resultElement.textContent = `✅ SUCCESS: ${user} executed ${operation} operation`;
        resultElement.classList.add('success');
    } else {
        resultElement.textContent = `❌ ACCESS DENIED: ${user} lacks ${operation} privilege`;
        resultElement.classList.add('denied');
    }
    
    resultElement.classList.add('slide-up');
    setTimeout(() => {
        resultElement.classList.remove('slide-up');
    }, 300);
}

function showPrivilegeMessage(message, type) {
    // Create or update message element
    let messageElement = document.querySelector('.privilege-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'privilege-message';
        document.querySelector('.privilege-controls').appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `privilege-message ${type}`;
    
    // Add styles for the message
    messageElement.style.cssText = `
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
        font-weight: 500;
        text-align: center;
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    }
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }
    }, 3000);
}

// =====================
// INITIALIZATION
// =====================

// Enhanced UI Helper Functions
function showProgressIndicator(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
        const statusText = element.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
}

function hideProgressIndicator(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function updateProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

function disableTransactionButtons(disabled) {
    const buttons = document.querySelectorAll('.transaction-states button');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
}

function disableDirtyReadButtons(disabled) {
    const buttons = document.querySelectorAll('.dirty-read .controls button');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        padding: '15px 20px',
        borderRadius: '8px',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '300px',
        fontSize: '0.9em',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Enhanced Consistency Demo with better feedback
function demonstrateConsistency() {
    const withdrawAmount = parseInt(document.getElementById('withdraw-amount').value) || 0;
    const resultElement = document.getElementById('consistency-result');
    
    resultElement.className = '';
    
    if (withdrawAmount <= 0) {
        resultElement.textContent = '⚠️ Please enter a valid withdrawal amount greater than 0.';
        resultElement.classList.add('error');
        return;
    }
    
    const currentBalance = 1000; // Simulated account balance
    
    // Add loading effect
    resultElement.textContent = '🔄 Checking constraints...';
    resultElement.className = 'checking';
    
    setTimeout(() => {
        if (withdrawAmount > currentBalance) {
            // Violates consistency constraint
            resultElement.textContent = `❌ Transaction REJECTED! Withdrawal of $${withdrawAmount.toLocaleString()} would result in negative balance ($${(currentBalance - withdrawAmount).toLocaleString()}), violating the constraint: balance ≥ $0`;
            resultElement.classList.add('error');
            showErrorMessage('Transaction violated consistency constraint!');
        } else {
            // Maintains consistency
            const newBalance = currentBalance - withdrawAmount;
            resultElement.textContent = `✅ Transaction APPROVED! Withdrawal of $${withdrawAmount.toLocaleString()} successful. New balance: $${newBalance.toLocaleString()} (constraint satisfied: balance ≥ $0)`;
            resultElement.classList.add('success');
            showSuccessMessage('Transaction maintains database consistency!');
        }
    }, 800);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize default states
    resetStates();
    resetDirtyRead();
    
    // Update initial privilege displays
    updatePrivilegeDisplay('alice');
    updatePrivilegeDisplay('bob');
    updatePrivilegeDisplay('charlie');
    
    // Add additional styling for enhanced UX
    const style = document.createElement('style');
    style.textContent = `
        .message {
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
            font-weight: 500;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .tour-highlight {
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.5) !important;
            position: relative;
            z-index: 100;
        }
        
        .tour-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1001;
            max-width: 400px;
            text-align: center;
        }
        
        .tour-content p {
            margin-bottom: 20px;
            font-size: 1.1em;
            color: #4a5568;
        }
        
        .tour-content button {
            margin: 0 5px;
        }
        
        #consistency-result.checking {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
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
    
    // Show welcome modal on first visit
    setTimeout(showWelcomeModal, 500);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('welcomeModal');
        if (event.target === modal) {
            closeWelcomeModal();
        }
    });
    
    console.log('Transaction Management Simulator initialized with enhanced UX');
});

// Export functions for global access (if needed)
window.transactionSimulator = {
    simulateTransaction,
    resetStates,
    demonstrateAtomicity,
    demonstrateConsistency,
    demonstrateIsolation,
    demonstrateDurability,
    startDirtyReadDemo,
    resetDirtyRead,
    grantPrivilege,
    revokePrivilege,
    testOperation
};