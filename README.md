# Enhanced AdOps Chatbot with Document-Based Q&A

A sophisticated React-based chatbot system that combines traditional knowledge base responses with intelligent document processing and semantic search capabilities, similar to ChatGPT functionality.

## 🚀 Features

### Core Capabilities
- **Document Processing**: Upload and process PDF, DOCX, TXT, and Excel files
- **Semantic Search**: Intelligent search across document content using advanced text similarity algorithms
- **Context Awareness**: Maintains conversation context and provides relevant follow-up suggestions
- **Question Classification**: Advanced intent recognition and entity extraction
- **Dynamic Knowledge Base**: Combines static knowledge with dynamic document content
- **Real-time Processing**: Instant document analysis and indexing

### Document Support
- **PDF Files**: Full text extraction with page-by-page processing
- **DOCX Files**: Rich text content extraction
- **TXT Files**: Plain text processing
- **Excel Files**: Spreadsheet data extraction with sheet support
- **Image Files**: Display and preview capabilities

### AI-Powered Features
- **Semantic Understanding**: Goes beyond keyword matching to understand meaning
- **Contextual Responses**: Maintains conversation flow and provides relevant suggestions
- **Intent Recognition**: Identifies question types (process, definition, troubleshooting, etc.)
- **Entity Extraction**: Recognizes tickets, clients, processes, and other important entities
- **Follow-up Detection**: Identifies and handles follow-up questions intelligently

## 🏗️ Architecture

### Core Components

1. **Document Processor** (`src/utils/documentProcessor.js`)
   - Handles multiple file formats
   - Extracts and chunks text content
   - Generates keywords and summaries
   - Maintains document index

2. **Semantic Search** (`src/utils/semanticSearch.js`)
   - Advanced text similarity algorithms
   - Jaccard similarity for term matching
   - Phrase similarity detection
   - Contextual search suggestions

3. **Enhanced Response Generator** (`src/utils/enhancedDocumentResponseGenerator.js`)
   - Combines static knowledge base with document content
   - Intelligent response selection
   - Source attribution and citation

4. **Context Awareness** (`src/utils/enhancedContextAwareness.js`)
   - Conversation flow analysis
   - Topic extraction and tracking
   - Follow-up pattern recognition
   - Contextual suggestion generation

5. **Question Classification** (`src/utils/enhancedQuestionClassification.js`)
   - Intent recognition (process, definition, troubleshooting, etc.)
   - Entity extraction (tickets, clients, processes)
   - Urgency detection
   - Suggested action generation

### Data Flow

```
User Input → Question Classification → Context Analysis → Document Search → Response Generation → UI Display
     ↓              ↓                      ↓                ↓                ↓
Intent/Entities → Conversation State → Semantic Search → Knowledge Base → Enhanced Response
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd enhanced-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Dependencies

The system uses several key libraries:

- **React 19.1.0**: UI framework
- **React Bootstrap 2.10.9**: UI components
- **Mammoth 1.9.0**: DOCX file processing
- **PDF.js 5.2.133**: PDF file processing
- **XLSX 0.18.5**: Excel file processing
- **String Similarity 4.0.4**: Text similarity algorithms
- **React Markdown 10.1.0**: Markdown rendering

## 📖 Usage

### Basic Usage

1. **Start a conversation**: Type your question in the input field
2. **Upload documents**: Click the attachment button to upload PDF, DOCX, TXT, or Excel files
3. **Ask questions**: The system will search both the knowledge base and uploaded documents
4. **Follow-up questions**: Ask follow-up questions - the system maintains context

### Document Management

- **Upload**: Drag and drop or click to upload documents
- **View**: Check the Documents button in the header to see uploaded files
- **Remove**: Click the remove button next to any document
- **Clear All**: Remove all documents at once

### Advanced Features

- **Context Suggestions**: The system provides intelligent follow-up suggestions
- **Source Attribution**: All document-based responses show source information
- **Classification Info**: In development mode, see intent and entity classification
- **Document Statistics**: View processing statistics and keyword extraction

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
REACT_APP_DEBUG_CLASSIFICATION=true
```

### Customization

#### Adding New Document Types

1. Update `documentProcessor.js`:
   ```javascript
   getFileType(file) {
     const extension = file.name.split('.').pop().toLowerCase();
     const typeMap = {
       'pdf': 'pdf',
       'docx': 'docx',
       'txt': 'txt',
       'xlsx': 'xlsx',
       'your_type': 'your_type' // Add new type
     };
     return typeMap[extension] || 'unknown';
   }
   ```

2. Add processing method:
   ```javascript
   async processYourType(file) {
     // Implementation for new file type
   }
   ```

#### Extending Question Classification

Update `enhancedQuestionClassification.js`:

```javascript
this.intentPatterns = {
  // ... existing patterns
  your_intent: {
    keywords: ['keyword1', 'keyword2'],
    patterns: [/pattern1/i, /pattern2/i],
    confidence: 0.8
  }
};
```

## 📊 Performance

### Optimization Features

- **Lazy Loading**: Images and content load on demand
- **Chunking**: Large documents are split into manageable chunks
- **Caching**: Document processing results are cached
- **Debouncing**: Search queries are debounced to prevent excessive processing

### Memory Management

- **Document Cleanup**: Old documents can be removed to free memory
- **Chunk Optimization**: Text is chunked efficiently for search
- **Index Management**: Document index is maintained for fast lookups

## 🧪 Testing

### Manual Testing

1. **Upload various document types** and verify processing
2. **Ask questions** about uploaded content
3. **Test follow-up questions** to verify context awareness
4. **Verify source attribution** in responses
5. **Test document management** features

### Test Cases

- **Document Processing**: Upload PDF, DOCX, TXT, Excel files
- **Search Functionality**: Search for specific content in documents
- **Context Awareness**: Ask follow-up questions
- **Error Handling**: Test with invalid files and edge cases
- **Performance**: Test with large documents

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Configuration

For production, ensure:
- `NODE_ENV=production`
- Remove debug classification display
- Optimize bundle size
- Configure proper error handling

### Hosting

The application can be deployed to:
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Use the included deployment script
- **AWS S3**: Upload build files to S3 bucket

## 🔍 Troubleshooting

### Common Issues

1. **Document Processing Fails**
   - Check file format support
   - Verify file size limits
   - Check browser console for errors

2. **Search Not Working**
   - Ensure documents are properly processed
   - Check semantic search configuration
   - Verify text extraction

3. **Context Not Maintained**
   - Check context awareness configuration
   - Verify message history
   - Ensure proper state management

### Debug Mode

Enable debug mode to see:
- Question classification details
- Entity extraction results
- Search confidence scores
- Context analysis information

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ features
- Follow React best practices
- Add JSDoc comments for functions
- Maintain consistent formatting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team**: For the excellent framework
- **PDF.js Team**: For PDF processing capabilities
- **Mammoth Team**: For DOCX processing
- **String Similarity Library**: For text similarity algorithms

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Note**: This chatbot system is designed to work without external AI services, using advanced text processing and similarity algorithms to provide intelligent responses based on your organization's documents and knowledge base.