# Q6: SQL Query Simulator

## Description
This is an interactive SQL Query Simulator that allows users to execute SQL-like queries on in-memory JavaScript array tables. It's designed for learning and practicing SQL concepts without needing a real database connection.

## Features

### Basic Queries
- **SELECT** - Query all or specific columns
- **WHERE** - Filter rows with conditions
- **ORDER BY** - Sort results ascending/descending
- **LIMIT** - Limit number of results
- **LIKE** - Pattern matching

### Aggregate Functions
- **COUNT(*)** - Count rows
- **SUM(column)** - Sum numeric values
- **AVG(column)** - Calculate average
- **MIN/MAX(column)** - Find minimum/maximum
- **GROUP BY** - Group results
- **HAVING** - Filter grouped results

### Set Operations
- **UNION** - Combine results (removes duplicates)
- **INTERSECT** - Find common rows
- **EXCEPT** - Find difference between tables

### Nested Queries
- Subqueries in WHERE clause
- IN subqueries
- Comparison with aggregate subqueries

## How to Use

1. **Create Tables**: Click "Create Table" or "Load Sample Data"
2. **Write Query**: Enter SQL in the query editor
3. **Execute**: Click "Execute Query" to see results
4. **Use Templates**: Quick-access query templates are available

## Technical Implementation

- Pure JavaScript (no external libraries for SQL parsing)
- Custom SQL parser supporting common operations
- LocalStorage for persisting tables and history
- CSV export functionality

## Files
- `index.html` - Main HTML structure
- `styles.css` - Styling
- `script.js` - SQL parsing and execution logic

## Unit/CO Mapping
- **Unit III** - SQL Queries
- **CO4** - Query Language Concepts
