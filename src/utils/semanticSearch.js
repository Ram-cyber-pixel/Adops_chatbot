/**
 * Semantic Search System for Document-Based Q&A
 * Provides intelligent search capabilities without requiring external AI services
 */

import stringSimilarity from 'string-similarity';

/**
 * Semantic search class for intelligent document searching
 */
export class SemanticSearch {
  constructor() {
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its',
      'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'would', 'you', 'your', 'i', 'me', 'my', 'we',
      'our', 'they', 'them', 'their', 'this', 'these', 'those', 'have', 'had', 'do', 'does', 'did', 'can',
      'could', 'should', 'would', 'may', 'might', 'must', 'shall', 'will', 'am', 'is', 'are', 'was', 'were',
      'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'shall', 'ought', 'need', 'dare', 'used'
    ]);
  }

  /**
   * Extract meaningful terms from text
   * @param {string} text - Input text
   * @returns {Array<string>} - Array of meaningful terms
   */
  extractTerms(text) {
    if (!text || typeof text !== 'string') return [];
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2 && !this.stopWords.has(term))
      .filter((term, index, array) => array.indexOf(term) === index); // Remove duplicates
  }

  /**
   * Calculate semantic similarity between two texts
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} - Similarity score (0-1)
   */
  calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const terms1 = this.extractTerms(text1);
    const terms2 = this.extractTerms(text2);
    
    if (terms1.length === 0 || terms2.length === 0) return 0;
    
    // Calculate Jaccard similarity
    const set1 = new Set(terms1);
    const set2 = new Set(terms2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const jaccardSimilarity = intersection.size / union.size;
    
    // Calculate string similarity
    const stringSimilarityScore = stringSimilarity.compareTwoStrings(text1, text2);
    
    // Calculate phrase similarity
    const phraseSimilarity = this.calculatePhraseSimilarity(text1, text2);
    
    // Weighted combination
    return (jaccardSimilarity * 0.4) + (stringSimilarityScore * 0.4) + (phraseSimilarity * 0.2);
  }

  /**
   * Calculate phrase similarity
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} - Phrase similarity score
   */
  calculatePhraseSimilarity(text1, text2) {
    const phrases1 = this.extractPhrases(text1);
    const phrases2 = this.extractPhrases(text2);
    
    if (phrases1.length === 0 || phrases2.length === 0) return 0;
    
    let totalSimilarity = 0;
    let matches = 0;
    
    phrases1.forEach(phrase1 => {
      phrases2.forEach(phrase2 => {
        const similarity = stringSimilarity.compareTwoStrings(phrase1, phrase2);
        if (similarity > 0.5) {
          totalSimilarity += similarity;
          matches++;
        }
      });
    });
    
    return matches > 0 ? totalSimilarity / matches : 0;
  }

  /**
   * Extract phrases from text
   * @param {string} text - Input text
   * @returns {Array<string>} - Array of phrases
   */
  extractPhrases(text) {
    if (!text || typeof text !== 'string') return [];
    
    const words = text.toLowerCase().split(/\s+/);
    const phrases = [];
    
    // Extract bigrams and trigrams
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1])) {
        phrases.push(bigram);
      }
    }
    
    for (let i = 0; i < words.length - 2; i++) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1]) && !this.stopWords.has(words[i + 2])) {
        phrases.push(trigram);
      }
    }
    
    return phrases;
  }

  /**
   * Search for relevant content in documents
   * @param {string} query - Search query
   * @param {Array<Object>} documents - Array of document objects
   * @param {Object} options - Search options
   * @returns {Array<Object>} - Array of search results
   */
  search(query, documents, options = {}) {
    const {
      threshold = 0.1,
      maxResults = 10,
      includeChunks = true,
      includeMetadata = true
    } = options;
    
    if (!query || !documents || documents.length === 0) return [];
    
    const results = [];
    
    documents.forEach(doc => {
      // Search in document content
      const contentSimilarity = this.calculateSimilarity(query, doc.content || '');
      
      // Search in document summary
      const summarySimilarity = this.calculateSimilarity(query, doc.summary || '');
      
      // Search in keywords
      const keywordSimilarity = this.calculateKeywordSimilarity(query, doc.keywords || []);
      
      // Calculate overall relevance score
      const relevanceScore = Math.max(contentSimilarity, summarySimilarity, keywordSimilarity);
      
      if (relevanceScore >= threshold) {
        const result = {
          documentId: doc.id,
          documentName: doc.metadata?.name || 'Unknown',
          relevanceScore,
          contentSimilarity,
          summarySimilarity,
          keywordSimilarity,
          summary: doc.summary,
          keywords: doc.keywords?.slice(0, 10) || []
        };
        
        if (includeChunks && doc.chunks) {
          // Find relevant chunks
          const relevantChunks = doc.chunks
            .map(chunk => ({
              ...chunk,
              similarity: this.calculateSimilarity(query, chunk.text)
            }))
            .filter(chunk => chunk.similarity > threshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3); // Top 3 chunks
          
          result.chunks = relevantChunks;
        }
        
        if (includeMetadata) {
          result.metadata = doc.metadata;
        }
        
        results.push(result);
      }
    });
    
    // Sort by relevance score
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Calculate similarity between query and keywords
   * @param {string} query - Search query
   * @param {Array<string>} keywords - Array of keywords
   * @returns {number} - Similarity score
   */
  calculateKeywordSimilarity(query, keywords) {
    if (!keywords || keywords.length === 0) return 0;
    
    const queryTerms = this.extractTerms(query);
    let totalSimilarity = 0;
    let matches = 0;
    
    queryTerms.forEach(term => {
      keywords.forEach(keyword => {
        const similarity = stringSimilarity.compareTwoStrings(term, keyword);
        if (similarity > 0.6) {
          totalSimilarity += similarity;
          matches++;
        }
      });
    });
    
    return matches > 0 ? totalSimilarity / matches : 0;
  }

  /**
   * Generate search suggestions based on query
   * @param {string} query - Search query
   * @param {Array<Object>} documents - Array of document objects
   * @returns {Array<string>} - Array of search suggestions
   */
  generateSuggestions(query, documents) {
    if (!query || !documents || documents.length === 0) return [];
    
    const suggestions = new Set();
    const queryTerms = this.extractTerms(query);
    
    documents.forEach(doc => {
      // Extract terms from document content
      const docTerms = this.extractTerms(doc.content || '');
      
      // Find related terms
      queryTerms.forEach(queryTerm => {
        docTerms.forEach(docTerm => {
          const similarity = stringSimilarity.compareTwoStrings(queryTerm, docTerm);
          if (similarity > 0.7 && docTerm !== queryTerm) {
            suggestions.add(docTerm);
          }
        });
      });
      
      // Add keywords that are similar to query terms
      if (doc.keywords) {
        doc.keywords.forEach(keyword => {
          queryTerms.forEach(queryTerm => {
            const similarity = stringSimilarity.compareTwoStrings(queryTerm, keyword);
            if (similarity > 0.6) {
              suggestions.add(keyword);
            }
          });
        });
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Find similar documents based on a reference document
   * @param {string} referenceDocId - Reference document ID
   * @param {Array<Object>} documents - Array of document objects
   * @param {Object} options - Search options
   * @returns {Array<Object>} - Array of similar documents
   */
  findSimilarDocuments(referenceDocId, documents, options = {}) {
    const {
      threshold = 0.3,
      maxResults = 5
    } = options;
    
    const referenceDoc = documents.find(doc => doc.id === referenceDocId);
    if (!referenceDoc) return [];
    
    const results = [];
    
    documents.forEach(doc => {
      if (doc.id === referenceDocId) return; // Skip the reference document
      
      const similarity = this.calculateSimilarity(referenceDoc.content || '', doc.content || '');
      
      if (similarity >= threshold) {
        results.push({
          documentId: doc.id,
          documentName: doc.metadata?.name || 'Unknown',
          similarity,
          summary: doc.summary
        });
      }
    });
    
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }
}

// Create a singleton instance
export const semanticSearch = new SemanticSearch();