/**
 * Document Processing System for Chatbot
 * Handles various document formats and extracts text content for Q&A
 */

import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Document processor class for handling various file formats
 */
export class DocumentProcessor {
  constructor() {
    this.processedDocuments = new Map();
    this.documentIndex = new Map(); // For quick lookup
  }

  /**
   * Process a document and extract text content
   * @param {File} file - The file to process
   * @returns {Promise<Object>} - Processed document data
   */
  async processDocument(file) {
    try {
      const fileType = this.getFileType(file);
      let content = '';
      let metadata = {
        name: file.name,
        size: file.size,
        type: fileType,
        lastModified: file.lastModified,
        processedAt: new Date().toISOString()
      };

      switch (fileType) {
        case 'pdf':
          content = await this.processPDF(file);
          break;
        case 'docx':
          content = await this.processDOCX(file);
          break;
        case 'doc':
          content = await this.processDOC(file);
          break;
        case 'txt':
          content = await this.processTXT(file);
          break;
        case 'xlsx':
        case 'xls':
          content = await this.processExcel(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      const documentData = {
        id: this.generateDocumentId(file),
        metadata,
        content: content.trim(),
        chunks: this.chunkText(content),
        keywords: this.extractKeywords(content),
        summary: this.generateSummary(content)
      };

      // Store the processed document
      this.processedDocuments.set(documentData.id, documentData);
      this.updateDocumentIndex(documentData);

      return documentData;
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  /**
   * Get file type from file extension
   * @param {File} file - The file to analyze
   * @returns {string} - File type
   */
  getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'pdf',
      'docx': 'docx',
      'doc': 'doc',
      'txt': 'txt',
      'xlsx': 'xlsx',
      'xls': 'xls'
    };
    return typeMap[extension] || 'unknown';
  }

  /**
   * Process PDF files
   * @param {File} file - PDF file
   * @returns {Promise<string>} - Extracted text content
   */
  async processPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  }

  /**
   * Process DOCX files
   * @param {File} file - DOCX file
   * @returns {Promise<string>} - Extracted text content
   */
  async processDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  /**
   * Process DOC files (basic implementation)
   * @param {File} file - DOC file
   * @returns {Promise<string>} - Extracted text content
   */
  async processDOC(file) {
    // For DOC files, we'll need a different library or conversion
    // This is a placeholder - in production, you might want to use a service
    throw new Error('DOC file processing not implemented. Please convert to DOCX format.');
  }

  /**
   * Process TXT files
   * @param {File} file - TXT file
   * @returns {Promise<string>} - Extracted text content
   */
  async processTXT(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  /**
   * Process Excel files
   * @param {File} file - Excel file
   * @returns {Promise<string>} - Extracted text content
   */
  async processExcel(file) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let content = '';

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      content += `\n--- Sheet: ${sheetName} ---\n`;
      sheetData.forEach(row => {
        if (Array.isArray(row)) {
          content += row.join('\t') + '\n';
        }
      });
    });

    return content;
  }

  /**
   * Chunk text into smaller pieces for better search
   * @param {string} text - Text to chunk
   * @returns {Array<string>} - Array of text chunks
   */
  chunkText(text, chunkSize = 500, overlap = 50) {
    const words = text.split(/\s+/);
    const chunks = [];
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push({
          text: chunk.trim(),
          startIndex: i,
          endIndex: Math.min(i + chunkSize, words.length)
        });
      }
    }
    
    return chunks;
  }

  /**
   * Extract keywords from text
   * @param {string} text - Text to analyze
   * @returns {Array<string>} - Extracted keywords
   */
  extractKeywords(text) {
    // Simple keyword extraction - in production, use NLP libraries
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Return most frequent words
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  /**
   * Generate a summary of the text
   * @param {string} text - Text to summarize
   * @returns {string} - Generated summary
   */
  generateSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = text.split(/\s+/);
    
    // Simple extractive summarization
    const summaryLength = Math.min(3, Math.max(1, Math.floor(sentences.length * 0.1)));
    return sentences.slice(0, summaryLength).join('. ') + '.';
  }

  /**
   * Generate a unique document ID
   * @param {File} file - The file
   * @returns {string} - Unique document ID
   */
  generateDocumentId(file) {
    return `doc_${file.name}_${file.lastModified}_${Date.now()}`;
  }

  /**
   * Update the document index for quick lookup
   * @param {Object} documentData - Processed document data
   */
  updateDocumentIndex(documentData) {
    // Index by keywords for quick lookup
    documentData.keywords.forEach(keyword => {
      if (!this.documentIndex.has(keyword)) {
        this.documentIndex.set(keyword, []);
      }
      this.documentIndex.get(keyword).push(documentData.id);
    });
  }

  /**
   * Search documents for relevant content
   * @param {string} query - Search query
   * @returns {Array<Object>} - Relevant document chunks
   */
  searchDocuments(query) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const results = [];
    
    // Search through all processed documents
    for (const [docId, docData] of this.processedDocuments) {
      const relevanceScore = this.calculateRelevance(query, docData);
      
      if (relevanceScore > 0.1) {
        // Find relevant chunks
        const relevantChunks = docData.chunks.filter(chunk => 
          this.calculateRelevance(query, { content: chunk.text }) > 0.1
        );
        
        results.push({
          documentId: docId,
          documentName: docData.metadata.name,
          relevanceScore,
          chunks: relevantChunks,
          summary: docData.summary
        });
      }
    }
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate relevance score between query and document
   * @param {string} query - Search query
   * @param {Object} document - Document data
   * @returns {number} - Relevance score (0-1)
   */
  calculateRelevance(query, document) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const content = document.content.toLowerCase();
    const keywords = document.keywords || [];
    
    let score = 0;
    
    // Exact phrase matching
    if (content.includes(query.toLowerCase())) {
      score += 0.5;
    }
    
    // Word matching
    queryWords.forEach(word => {
      if (content.includes(word)) {
        score += 0.1;
      }
      if (keywords.includes(word)) {
        score += 0.2;
      }
    });
    
    // Normalize score
    return Math.min(score, 1);
  }

  /**
   * Get all processed documents
   * @returns {Array<Object>} - All processed documents
   */
  getAllDocuments() {
    return Array.from(this.processedDocuments.values());
  }

  /**
   * Get a specific document by ID
   * @param {string} docId - Document ID
   * @returns {Object|null} - Document data or null
   */
  getDocument(docId) {
    return this.processedDocuments.get(docId) || null;
  }

  /**
   * Remove a document
   * @param {string} docId - Document ID to remove
   */
  removeDocument(docId) {
    const doc = this.processedDocuments.get(docId);
    if (doc) {
      // Remove from index
      doc.keywords.forEach(keyword => {
        const keywordDocs = this.documentIndex.get(keyword);
        if (keywordDocs) {
          const index = keywordDocs.indexOf(docId);
          if (index > -1) {
            keywordDocs.splice(index, 1);
          }
        }
      });
      
      // Remove from documents
      this.processedDocuments.delete(docId);
    }
  }

  /**
   * Clear all documents
   */
  clearAllDocuments() {
    this.processedDocuments.clear();
    this.documentIndex.clear();
  }
}

// Create a singleton instance
export const documentProcessor = new DocumentProcessor();