# Transaction Management Simulator

An interactive web-based simulator that demonstrates key database transaction management concepts including transaction states, ACID properties, concurrency issues, and privilege management.

## Features

### 1. Transaction States Visualization
- **Interactive State Transitions**: Visual representation of all five transaction states
  - Active (initial running state)
  - Partially Committed (execution completed, awaiting commit)
  - Committed (successfully completed)
  - Failed (error encountered)
  - Aborted (rolled back)
- **Animated Transitions**: Smooth animations showing successful and failed transaction paths
- **Controls**: Buttons to simulate both successful and failed transaction scenarios

### 2. ACID Properties Demonstration

#### Atomicity
- Bank account transfer simulation showing "all-or-nothing" principle
- Successful transfer: Both accounts updated together
- Failed transfer: All changes rolled back automatically
- Visual feedback with balance animations

#### Consistency
- Constraint validation demonstration (account balance ≥ $0)
- Interactive withdrawal testing with real-time constraint checking
- Clear success/error messaging for constraint violations

#### Isolation
- Concurrent transaction simulation
- Visual representation of two transactions running independently
- Step-by-step execution showing isolated processing

#### Durability
- System crash and recovery simulation
- Transaction log display showing committed transactions
- Demonstration of data persistence after system failures

### 3. Dirty Read Scenario Simulation
- **Two-Transaction Setup**: Writer and Reader transactions running concurrently
- **Step-by-Step Visualization**: Each transaction step highlighted in real-time
- **Problem Demonstration**: Shows how uncommitted data can be read by another transaction
- **Data State Tracking**: Real-time database state with committed/uncommitted indicators
- **Educational Flow**: Clear progression showing the dirty read problem

### 4. Privilege Management System
- **User Management**: Three sample users (Alice-Admin, Bob-Analyst, Charlie-Intern)
- **GRANT Operations**: Interactive privilege granting with immediate feedback
- **REVOKE Operations**: Privilege removal with validation
- **Operation Testing**: Test SELECT, INSERT, UPDATE, DELETE operations per user
- **Real-time Feedback**: Success/denial messages based on current privileges
- **Sample Database**: Employee table with realistic data for testing

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic structure with accessibility considerations
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: Interactive functionality without external dependencies

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and keyframe animations
- **Real-time Updates**: Dynamic DOM manipulation for state changes
- **Error Handling**: Comprehensive validation and user feedback
- **Modular Code**: Well-organized JavaScript functions

## Usage Instructions

### Running the Simulator
1. Open `index.html` in any modern web browser
2. No additional setup or dependencies required
3. All functionality works offline

### Interacting with Features

#### Transaction States
1. Click "Simulate Successful Transaction" to see: Active → Partially Committed → Committed
2. Click "Simulate Failed Transaction" to see: Active → Failed → Aborted
3. Use "Reset" to return to initial Active state

#### ACID Properties
- **Atomicity**: Test successful and failed bank transfers
- **Consistency**: Enter different withdrawal amounts to test constraints
- **Isolation**: Run concurrent transaction simulation
- **Durability**: Trigger system crash and recovery sequence

#### Dirty Read Simulation
1. Click "Start Dirty Read Demo" for automated demonstration
2. Watch both transactions execute step-by-step
3. Observe the database state changes throughout the process
4. Use "Reset" to restart the demonstration

#### Privilege Management
1. Select a user (Bob or Charlie) and privilege type
2. Use GRANT/REVOKE buttons to modify privileges
3. Test operations to see access control in action
4. Observe real-time privilege updates in user panels

## Educational Value

This simulator provides hands-on experience with:
- **Transaction Lifecycle**: Understanding state transitions
- **ACID Compliance**: Seeing principles in action
- **Concurrency Issues**: Witnessing dirty read problems
- **Security Concepts**: Learning privilege-based access control
- **Database Concepts**: Practical application of theoretical knowledge

## Browser Compatibility

- **Chrome/Edge**: Full compatibility
- **Firefox**: Full compatibility  
- **Safari**: Full compatibility
- **Mobile Browsers**: Responsive design adapts to smaller screens

## File Structure

```
Q4/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # Interactive functionality
└── README.md          # This documentation
```

## Development Notes

- **Performance**: Optimized animations and DOM updates
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Maintainability**: Clean, commented code with modular functions
- **Extensibility**: Easy to add new transaction scenarios or ACID examples

## Future Enhancements

Potential additions could include:
- More concurrency problems (phantom reads, non-repeatable reads)
- Advanced transaction isolation levels
- Deadlock detection and resolution
- More complex privilege hierarchies
- Database recovery algorithms visualization

---

*This simulator is designed for educational purposes to help understand database transaction management concepts through interactive visualization and hands-on experimentation.*