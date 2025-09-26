# Professional ER/EER Diagram Builder

A sophisticated, web-based Entity-Relationship diagram builder with advanced features for database design and automatic schema generation.

## 🌟 Features

### Core Functionality
- **Drag-and-Drop Interface**: Intuitive toolbox with visual elements
- **Multiple Entity Types**: Regular and weak entities with proper notation
- **Complete Attribute Support**: Simple, composite, derived, multivalued, and key attributes
- **Relationship Management**: Full relationship support with cardinality and participation constraints
- **Connection System**: Visual connection tool for linking diagram elements

### Advanced Features
- **Canvas Interactions**: Pan, zoom, selection, and smooth transformations
- **Professional UI**: Modern design with dark/light theme support
- **Schema Generation**: Automatic conversion from ER diagram to relational schema
- **SQL Export**: Generate complete SQL DDL statements
- **Save/Load**: Full diagram persistence with JSON format
- **Responsive Design**: Works on desktop and mobile devices

### User Experience
- **Context Menus**: Right-click functionality for quick actions
- **Keyboard Shortcuts**: Professional keyboard navigation
- **Undo/Redo**: Complete state management with history
- **Real-time Editing**: Live property panel updates
- **Visual Feedback**: Smooth animations and hover effects

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download all files to a directory
2. Open `index.html` in your web browser
3. Start creating your ER diagram!

### File Structure
```
Q2/
├── index.html          # Main application interface
├── styles.css          # Professional CSS styling
├── script.js           # Complete JavaScript functionality
└── README.md          # This documentation
```

## 📖 How to Use

### Basic Usage

1. **Creating Elements**:
   - Drag entities, relationships, or attributes from the toolbox
   - Drop them onto the canvas
   - Edit properties in the popup modal

2. **Making Connections**:
   - Click the "Connect" tool in the toolbox
   - Click on two elements to create a connection
   - Connections automatically show cardinality labels

3. **Editing Elements**:
   - Select any element to view properties
   - Right-click for context menu options
   - Use the properties panel for quick edits

4. **Canvas Navigation**:
   - Mouse wheel to zoom in/out
   - Click and drag empty space to pan
   - Use toolbar zoom controls

### Advanced Features

#### Schema Generation
1. Create your ER diagram with entities and attributes
2. Connect attributes to entities using the connection tool
3. Click "Generate Schema" in the toolbar
4. View the visual schema or export SQL DDL

#### Keyboard Shortcuts
- `Ctrl+N`: New diagram
- `Ctrl+S`: Save diagram
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Delete`: Delete selected element
- `+`/`-`: Zoom in/out
- `Escape`: Cancel current operation

#### Theme Support
- Toggle between light and dark themes
- Automatic theme persistence
- Professional color schemes

## 🎨 Element Types

### Entities
- **Regular Entity**: Standard database entity (rectangle)
- **Weak Entity**: Entity dependent on another (double rectangle outline)

### Attributes
- **Simple Attribute**: Basic attribute (circle)
- **Key Attribute**: Primary key (underlined circle)
- **Multivalued Attribute**: Multiple values allowed (double circle outline)
- **Composite Attribute**: Made up of sub-attributes (highlighted circle)
- **Derived Attribute**: Calculated from other attributes (dashed circle)

### Relationships
- **Regular Relationship**: Standard relationship (diamond)
- **Weak Relationship**: Identifying relationship (double diamond outline)

## 🔧 Technical Implementation

### Architecture
- **Object-Oriented Design**: Clean class-based structure
- **SVG Rendering**: Scalable vector graphics for crisp visuals
- **Event-Driven**: Responsive interaction handling
- **State Management**: Complete undo/redo system

### Key Classes
- `ERDiagramBuilder`: Main application class
- Element management system with Maps for performance
- Connection system with automatic routing
- Schema generation engine with relational conversion

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📊 Schema Generation Algorithm

The application implements a sophisticated algorithm to convert ER diagrams to relational schemas:

1. **Entity Processing**: Convert entities to tables
2. **Attribute Mapping**: Map attributes to table columns
3. **Primary Key Detection**: Identify key attributes or auto-generate IDs
4. **Relationship Analysis**: Process relationships for foreign key creation
5. **Normalization**: Apply basic normalization rules
6. **SQL Generation**: Create complete DDL statements

### Generated Schema Features
- Proper data types based on attribute properties
- Primary key constraints
- Foreign key relationships
- NULL/NOT NULL constraints
- Auto-increment support

## 🎯 Use Cases

### Educational
- Database design courses
- ER modeling tutorials
- SQL learning exercises
- Database theory demonstrations

### Professional
- System analysis and design
- Database architecture planning
- Documentation generation
- Team collaboration on database design

### Development
- Rapid prototyping of database schemas
- Visual database documentation
- Schema migration planning
- Database reverse engineering visualization

## 🛠️ Customization

### Adding New Element Types
1. Update the `createElement` method
2. Add rendering logic in `render*Shape` methods
3. Update the toolbox HTML
4. Add CSS styling for the new type

### Extending Schema Generation
1. Modify the `convertERToRelational` method
2. Add new data type mappings
3. Implement additional constraints
4. Update SQL generation templates

## 🔒 Security & Privacy

- **Client-Side Only**: No data transmitted to servers
- **Local Storage**: Preferences saved locally
- **File-Based**: Save/load using browser file APIs
- **No Dependencies**: Self-contained application

## 🐛 Troubleshooting

### Common Issues

**Drag and Drop Not Working**:
- Ensure you're using a modern browser
- Check if JavaScript is enabled
- Try refreshing the page

**Schema Generation Issues**:
- Verify entities have connected attributes
- Check that relationships connect valid elements
- Ensure proper element naming

**Performance Issues**:
- Large diagrams may slow down on older browsers
- Consider breaking complex diagrams into smaller parts
- Use the zoom feature to focus on specific areas

## 🚀 Future Enhancements

### Planned Features
- Export to various formats (PNG, PDF, SVG)
- Import from existing database schemas
- Collaborative editing capabilities
- Advanced relationship types (ISA, aggregation)
- Database-specific SQL dialects
- Integration with popular databases

### Technical Improvements
- WebGL rendering for better performance
- Progressive Web App (PWA) support
- Touch gesture support for tablets
- Voice commands for accessibility

## 📄 License

This project is open source and available for educational and commercial use. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional element types
- Enhanced schema generation
- Better mobile support
- Performance optimizations
- Accessibility features

## 📞 Support

For issues or questions:
- Check the built-in help system (? button)
- Review this documentation
- Test with the provided examples

---

**Built with ❤️ for the database design community**

*Professional ER Diagram Builder - Making database design visual, intuitive, and efficient.*