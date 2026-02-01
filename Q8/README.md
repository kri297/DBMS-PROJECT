# Q8: Deadlock & Recovery Visualizer

## Description
An interactive visualization tool for understanding deadlock concepts, resource allocation graphs, and recovery strategies in database management systems.

## Features

### Resource Allocation Graph (RAG)
- Add processes (P1, P2, ...) and resources (R1, R2, ...)
- Create request edges (Process → Resource) and allocation edges (Resource → Process)
- Visual drag-and-drop node positioning
- Automatic edge rendering with arrows

### Deadlock Detection
- Cycle detection algorithm implementation
- Visual highlighting of deadlocked nodes and edges
- Clear reporting of detected cycles

### Banker's Algorithm
- Configurable number of processes and resources
- Interactive matrix input:
  - Available resources
  - Maximum need matrix
  - Allocation matrix
  - Automatically calculated Need matrix
- Safe state detection with sequence display
- Resource request simulation

### Recovery Strategies Demo
- **Abort All Processes** - Terminate all deadlocked processes
- **Abort One at a Time** - Selectively terminate processes
- **Resource Preemption** - Forcibly take resources
- **Rollback to Checkpoint** - Restore to safe state

### Deadlock Prevention Info
- Mutual Exclusion concepts
- Hold and Wait prevention
- No Preemption strategies
- Circular Wait elimination

## How to Use

1. **Resource Allocation Graph**:
   - Click "Add Process" or "Add Resource" to add nodes
   - Use the edge form to create request/allocation edges
   - Click "Detect Deadlock" to check for cycles

2. **Banker's Algorithm**:
   - Set number of processes and resources
   - Click "Initialize" to create matrices
   - Fill in the values or click "Load Demo"
   - Click "Check Safe State" to run the algorithm

3. **Recovery Demo**:
   - Click on any recovery strategy card to see animation

## Technical Implementation

- Pure JavaScript with SVG for graph visualization
- DFS-based cycle detection algorithm
- Banker's Algorithm implementation with step-by-step output
- Animated recovery demonstrations

## Files
- `index.html` - Main HTML structure
- `styles.css` - Styling with dark theme
- `script.js` - Graph logic, Banker's algorithm, animations

## Unit/CO Mapping
- **Unit III** - Concurrency Control & Recovery
- **CO3** - Deadlock Handling & Recovery
