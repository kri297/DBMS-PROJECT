# Relational Algebra Visualizer

## Overview
This is a complete in-browser relational algebra simulator that allows users to:
- Create small in-memory relations (tables)
- Apply relational algebra operations: SELECT (σ), PROJECT (π), JOIN (⋈), UNION (∪), DIFFERENCE (−)
- Display result tables dynamically after each operation

## Features

### 1. Table Management
- Create custom tables with user-defined columns
- Add rows dynamically through an intuitive modal interface
- Delete tables when no longer needed
- Pre-loaded sample tables (Students, Grades, Courses) for immediate testing

### 2. Relational Algebra Operations

#### SELECT (σ) - Filter Rows
- Apply conditions to filter table rows
- Supports comparison operators: `>`, `<`, `>=`, `<=`, `=`, `!=`
- Example conditions: `Age > 20`, `Major = "CS"`, `Grade = "A"`

#### PROJECT (π) - Select Columns  
- Select specific columns from a relation
- Automatically removes duplicate rows
- Example: Select `Name, Age` from Students table

#### JOIN (⋈) - Join Tables
- Natural join based on specified conditions
- Format: `Table1.Column1 = Table2.Column2`
- Example: `Students.ID = Grades.StudentID`

#### UNION (∪) - Combine Tables
- Combines two compatible relations
- Automatically removes duplicate rows
- Relations must have same number of columns

#### DIFFERENCE (−) - Subtract Tables
- Returns rows in first relation but not in second
- Relations must have compatible schemas

### 3. User Interface
- Modern, responsive design with gradient backgrounds
- Real-time table updates and result display
- Animated feedback for operations
- Modal dialogs for row addition
- Clear error messages and validation

## How to Use

1. **Creating Tables**
   - Enter table name and comma-separated column names
   - Click "Create Table" to add to workspace

2. **Adding Data**
   - Click "Add Row" button on any table
   - Fill in values in the modal dialog
   - Rows are added instantly to the table

3. **Applying Operations**
   - Select operation type (SELECT, PROJECT, JOIN, UNION, DIFFERENCE)
   - Choose appropriate tables from dropdown menus
   - Enter conditions or column specifications
   - Click the operation button to execute
   - Results appear in the right panel with operation description

4. **Managing Results**
   - All operation results are displayed chronologically
   - Use "Clear Results" to reset the results panel
   - Results include operation type and description for reference

## Sample Data
The application comes with three pre-loaded tables:

**Students**: ID, Name, Age, Major
- Sample data includes CS, Math, and Physics students

**Grades**: StudentID, Course, Grade  
- Contains grades for Database, Calculus, and Algorithms courses

**Courses**: CourseID, CourseName, Credits
- Course information with credit hours

## Technical Implementation
- Pure JavaScript with ES6 classes
- No external dependencies
- Object-oriented design with Relation class
- Robust error handling and input validation
- Dynamic DOM manipulation for real-time updates
- CSS animations for enhanced user experience

## File Structure
```
Q3/
├── index.html          # Main application interface
├── styles.css          # Modern CSS styling with animations
├── script.js           # Core JavaScript functionality
└── README.md           # This documentation file
```

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser
- Responsive design works on desktop and tablet devices

Open `index.html` in your web browser to start using the Relational Algebra Visualizer!