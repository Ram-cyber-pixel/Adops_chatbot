/**
 * Enhanced Document Response Generator
 * Combines existing knowledge base with document-based Q&A capabilities
 */

import { documentProcessor } from './documentProcessor';
import { findBestMatches, analyzeConversationContext } from './enhancedFuzzyMatching';
import { extractImageUrls, extractLinks, formatLink } from './enhancedImageUtils';
import { semanticSearch } from './semanticSearch';

/**
 * Enhanced response generator that combines static knowledge base with dynamic document content
 * @param {string} userInput - The user's input text
 * @param {Array} messages - Previous messages in the conversation
 * @param {Object} responseData - Available response data categories
 * @returns {Object} - Enhanced response object
 */
export const generateDocumentBasedResponse = async (userInput, messages, responseData) => {
  // Get all processed documents
  const allDocuments = documentProcessor.getAllDocuments();
  
  // Use semantic search to find relevant documents
  const searchResults = semanticSearch.search(userInput, allDocuments, {
    threshold: 0.1,
    maxResults: 5,
    includeChunks: true,
    includeMetadata: true
  });
  
  // Analyze conversation context
  const context = analyzeConversationContext(messages);
  
  // Check if we have relevant document content
  if (searchResults.length > 0) {
    const bestResult = searchResults[0];
    
    // If we have high confidence document results, use them
    if (bestResult.relevanceScore > 0.2) {
      return generateSemanticDocumentResponse(userInput, bestResult, context);
    }
  }
  
  // Fall back to existing knowledge base
  return generateKnowledgeBaseResponse(userInput, messages, responseData);
};

/**
 * Generate response based on semantic search results
 * @param {string} userInput - User's question
 * @param {Object} searchResult - Best matching search result
 * @param {Object} context - Conversation context
 * @returns {Object} - Response object
 */
const generateSemanticDocumentResponse = (userInput, searchResult, context) => {
  const { documentName, chunks, summary, relevanceScore, keywords } = searchResult;
  
  // Find the most relevant chunk
  const bestChunk = chunks && chunks.length > 0 
    ? chunks.reduce((best, current) => 
        current.similarity > best.similarity ? current : best
      )
    : null;
  
  // Generate response based on the chunk content or summary
  let responseText;
  if (bestChunk && bestChunk.text) {
    responseText = generateContextualAnswer(userInput, bestChunk.text, documentName);
  } else if (summary) {
    responseText = generateContextualAnswer(userInput, summary, documentName);
  } else {
    responseText = `I found relevant information in "${documentName}" but couldn't extract specific details. Please try rephrasing your question.`;
  }
  
  // Add source information
  responseText += `\n\n*Source: ${documentName}*`;
  
  // Add related chunks if available
  if (chunks && chunks.length > 1) {
    const relatedChunks = chunks.slice(1, 3); // Take up to 2 additional chunks
    if (relatedChunks.length > 0) {
      responseText += '\n\n*Related information:*\n';
      relatedChunks.forEach((chunk, index) => {
        responseText += `${index + 1}. ${chunk.text.substring(0, 200)}...\n`;
      });
    }
  }
  
  // Add relevant keywords if available
  if (keywords && keywords.length > 0) {
    responseText += `\n\n*Related topics: ${keywords.slice(0, 5).join(', ')}*`;
  }
  
  return {
    text: responseText,
    category: 'document',
    confidence: relevanceScore,
    source: {
      documentName,
      chunks: chunks ? chunks.length : 0,
      relevanceScore,
      keywords: keywords || []
    },
    isDocumentBased: true
  };
};

/**
 * Generate response based on document content (legacy function)
 * @param {string} userInput - User's question
 * @param {Object} documentResult - Best matching document
 * @param {Object} context - Conversation context
 * @returns {Object} - Response object
 */
const generateDocumentResponse = (userInput, documentResult, context) => {
  const { documentName, chunks, summary, relevanceScore } = documentResult;
  
  // Find the most relevant chunk
  const bestChunk = chunks.reduce((best, current) => 
    current.relevanceScore > best.relevanceScore ? current : best
  );
  
  // Generate response based on the chunk content
  let responseText = generateContextualAnswer(userInput, bestChunk.text, documentName);
  
  // Add source information
  responseText += `\n\n*Source: ${documentName}*`;
  
  // Add related chunks if available
  if (chunks.length > 1) {
    const relatedChunks = chunks.slice(1, 3); // Take up to 2 additional chunks
    if (relatedChunks.length > 0) {
      responseText += '\n\n*Related information:*\n';
      relatedChunks.forEach((chunk, index) => {
        responseText += `${index + 1}. ${chunk.text.substring(0, 200)}...\n`;
      });
    }
  }
  
  return {
    text: responseText,
    category: 'document',
    confidence: relevanceScore,
    source: {
      documentName,
      chunks: chunks.length,
      relevanceScore
    },
    isDocumentBased: true
  };
};

/**
 * Generate contextual answer based on document content
 * @param {string} question - User's question
 * @param {string} content - Document content
 * @param {string} documentName - Name of the document
 * @returns {string} - Generated answer
 */
const generateContextualAnswer = (question, content, documentName) => {
  // Simple answer generation - in production, use more sophisticated NLP
  const questionWords = question.toLowerCase().split(/\s+/);
  const contentSentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Find sentences that contain question words
  const relevantSentences = contentSentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return questionWords.some(word => lowerSentence.includes(word));
  });
  
  if (relevantSentences.length > 0) {
    // Use the most relevant sentence
    const bestSentence = relevantSentences[0].trim();
    return `Based on the document "${documentName}", ${bestSentence}.`;
  }
  
  // If no specific match, provide a general response
  const firstSentence = contentSentences[0]?.trim() || content.substring(0, 200);
  return `Based on the document "${documentName}", here's what I found: ${firstSentence}...`;
};

/**
 * Generate response from existing knowledge base
 * @param {string} userInput - User's input
 * @param {Array} messages - Previous messages
 * @param {Object} responseData - Knowledge base data
 * @returns {Object} - Response object
 */
const generateKnowledgeBaseResponse = (userInput, messages, responseData) => {
  // Use existing response generation logic
  const context = analyzeConversationContext(messages);
  
  // Combine all response categories
  const allCategories = {
    ...responseData.syscodeData,
    ...responseData.questionAndAnswerData,
    ...responseData.ticketData,
    ...responseData.generalResponses,
    ...responseData.roeData,
    ...responseData.fulfillmentData
  };
  
  // Find best match
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [category, data] of Object.entries(allCategories)) {
    if (category === 'default' || !data.keywords) continue;
    
    const matches = findBestMatches(userInput, data.keywords, 0.5);
    if (matches.length > 0) {
      const score = matches[0].similarity;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { category, data, matches };
      }
    }
  }
  
  if (bestMatch && bestScore > 0.6) {
    const responses = bestMatch.data.responses || [];
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: responseText,
      category: bestMatch.category,
      confidence: bestScore,
      isDocumentBased: false,
      matchedKeywords: bestMatch.matches
    };
  }
  
  // Fallback response
  return {
    text: "I don't have specific information about that in my knowledge base. If you have relevant documents, please upload them and I can help you find the information you need.",
    category: 'default',
    confidence: 0.3,
    isDocumentBased: false
  };
};

/**
 * Enhanced response generator that combines both approaches
 * @param {string} userInput - User's input
 * @param {Array} messages - Previous messages
 * @param {Object} responseData - Knowledge base data
 * @returns {Promise<Object>} - Enhanced response
 */
export const generateEnhancedDocumentResponse = async (userInput, messages, responseData) => {
  // Get document-based response
  const documentResponse = await generateDocumentBasedResponse(userInput, messages, responseData);
  
  // If we have a good document response, use it
  if (documentResponse.isDocumentBased && documentResponse.confidence > 0.4) {
    return documentResponse;
  }
  
  // Otherwise, use knowledge base response
  return documentResponse;
};

/**
 * Process uploaded document and add to knowledge base
 * @param {File} file - Document file
 * @returns {Promise<Object>} - Processing result
 */
export const processUploadedDocument = async (file) => {
  try {
    const documentData = await documentProcessor.processDocument(file);
    
    return {
      success: true,
      document: {
        id: documentData.id,
        name: documentData.metadata.name,
        summary: documentData.summary,
        keywords: documentData.keywords.slice(0, 10), // Show top 10 keywords
        chunks: documentData.chunks.length
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get document statistics
 * @returns {Object} - Document statistics
 */
export const getDocumentStats = () => {
  const documents = documentProcessor.getAllDocuments();
  
  return {
    totalDocuments: documents.length,
    totalChunks: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
    totalKeywords: new Set(documents.flatMap(doc => doc.keywords)).size,
    documents: documents.map(doc => ({
      id: doc.id,
      name: doc.metadata.name,
      type: doc.metadata.type,
      size: doc.metadata.size,
      processedAt: doc.metadata.processedAt,
      chunks: doc.chunks.length,
      keywords: doc.keywords.length
    }))
  };
};

/**
 * Search across all documents and knowledge base
 * @param {string} query - Search query
 * @returns {Object} - Search results
 */
export const searchAllSources = (query) => {
  const documentResults = documentProcessor.searchDocuments(query);
  
  return {
    query,
    documentResults,
    totalResults: documentResults.length,
    hasResults: documentResults.length > 0
  };
};

/**
 * Clear all documents
 */
export const clearAllDocuments = () => {
  documentProcessor.clearAllDocuments();
};

/**
 * Remove specific document
 * @param {string} docId - Document ID to remove
 */
export const removeDocument = (docId) => {
  documentProcessor.removeDocument(docId);
};