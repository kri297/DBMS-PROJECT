# Q7 - Normalization Assistant

## Overview
An interactive tool for understanding and applying database normalization (1NF, 2NF, 3NF, BCNF). This module helps students learn how to normalize relations step-by-step.

## Features

### 1. Relation Definition
- Enter relation name
- Define attributes (comma-separated)
- Add functional dependencies (FDs)

### 2. Attribute Closure Calculator
- Select attributes
- Compute closure using defined FDs
- Visualize closure results

### 3. Candidate Key Finder
- Automatically finds all candidate keys
- Highlights key attributes

### 4. Normalization Analysis
- **1NF Check**: Verifies atomic values
- **2NF Check**: Detects partial dependencies
- **3NF Check**: Detects transitive dependencies  
- **BCNF Check**: Ensures every determinant is a superkey

### 5. Decomposition
- Automatic BCNF decomposition
- Lossless join verification
- Dependency preservation check

## How to Use

1. **Enter Relation Name** (e.g., "StudentCourse")

2. **Enter Attributes** (comma-separated):
   ```
   SID, SNAME, CID, CNAME, INSTRUCTOR
   ```

3. **Add Functional Dependencies**:
   - LHS: `SID`
   - RHS: `SNAME`
   - Click "Add FD"

4. **Click "Analyze Normalization"** to:
   - Find candidate keys
   - Check all normal forms
   - Generate decomposition if needed

## Example

**Relation**: StudentCourseInstructor

**Attributes**: SID, SNAME, CID, CNAME, INSTRUCTOR

**Functional Dependencies**:
- SID → SNAME
- CID → CNAME, INSTRUCTOR
- SID, CID → (all attributes)

**Analysis Results**:
- ❌ 2NF Violated (partial dependencies)
- ❌ 3NF Violated (transitive dependencies)
- ❌ BCNF Violated

**Decomposition**:
1. R1(SID, SNAME) with SID as key
2. R2(CID, CNAME, INSTRUCTOR) with CID as key
3. R3(SID, CID) with {SID, CID} as key

## Algorithms Implemented

### Attribute Closure
```
Input: Set of attributes X, Set of FDs F
Output: X+ (closure of X)

result = X
while (result changes) do
    for each FD (Y → Z) in F do
        if Y ⊆ result then
            result = result ∪ Z
return result
```

### BCNF Decomposition
```
Input: Relation R with FDs F
Output: Set of BCNF relations

result = {R}
while (some Ri in result is not in BCNF) do
    find FD X → Y violating BCNF in Ri
    decompose Ri into:
        - R1 = X ∪ Y
        - R2 = Ri - (Y - X)
    replace Ri with R1 and R2 in result
return result
```

## Learning Objectives

After using this module, students will understand:
- Definition of each normal form (1NF, 2NF, 3NF, BCNF)
- How to identify partial and transitive dependencies
- Why normalization reduces redundancy
- Trade-offs between BCNF and 3NF decomposition
- Importance of lossless join and dependency preservation

## Technical Details

- Pure JavaScript implementation
- No external dependencies
- Interactive UI with real-time feedback
- Educational visualizations

## Related Topics

- Functional Dependencies
- Candidate Keys and Superkeys
- Dependency Preservation
- Lossless Join Decomposition
- Denormalization for Performance
