/**
 * Enhanced Context Awareness System
 * Provides intelligent conversation context understanding and follow-up question handling
 */

import { semanticSearch } from './semanticSearch';

/**
 * Enhanced context awareness class
 */
export class ContextAwareness {
  constructor() {
    this.conversationHistory = [];
    this.currentTopic = null;
    this.previousQuestions = [];
    this.documentContext = [];
    this.userPreferences = {};
  }

  /**
   * Analyze conversation context and extract meaningful information
   * @param {Array<Object>} messages - Array of conversation messages
   * @returns {Object} - Enhanced context information
   */
  analyzeContext(messages) {
    if (!messages || messages.length === 0) {
      return this.getDefaultContext();
    }

    // Extract user messages and bot responses
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const botMessages = messages.filter(msg => msg.sender === 'bot');

    // Analyze conversation flow
    const conversationFlow = this.analyzeConversationFlow(messages);
    
    // Extract topics and themes
    const topics = this.extractTopics(messages);
    
    // Identify follow-up patterns
    const followUpPatterns = this.identifyFollowUpPatterns(messages);
    
    // Analyze document usage
    const documentUsage = this.analyzeDocumentUsage(messages);
    
    // Determine conversation state
    const conversationState = this.determineConversationState(messages);
    
    // Extract user intent patterns
    const intentPatterns = this.extractIntentPatterns(userMessages);

    return {
      conversationFlow,
      topics,
      followUpPatterns,
      documentUsage,
      conversationState,
      intentPatterns,
      currentTopic: topics.length > 0 ? topics[0] : null,
      isFollowUp: followUpPatterns.length > 0,
      hasDocumentContext: documentUsage.documents.length > 0,
      confidence: this.calculateContextConfidence(messages)
    };
  }

  /**
   * Analyze conversation flow patterns
   * @param {Array<Object>} messages - Array of messages
   * @returns {Object} - Flow analysis
   */
  analyzeConversationFlow(messages) {
    const patterns = {
      questionAnswer: 0,
      clarification: 0,
      followUp: 0,
      topicSwitch: 0,
      documentQuery: 0
    };

    for (let i = 1; i < messages.length; i++) {
      const current = messages[i];
      const previous = messages[i - 1];

      // Check for question-answer pattern
      if (previous.sender === 'user' && current.sender === 'bot') {
        patterns.questionAnswer++;
      }

      // Check for clarification requests
      if (current.text.toLowerCase().includes('clarify') || 
          current.text.toLowerCase().includes('more specific')) {
        patterns.clarification++;
      }

      // Check for follow-up questions
      if (current.sender === 'user' && this.isFollowUpQuestion(current.text, previous.text)) {
        patterns.followUp++;
      }

      // Check for topic switches
      if (this.isTopicSwitch(current.text, previous.text)) {
        patterns.topicSwitch++;
      }

      // Check for document queries
      if (current.isDocumentBased || current.source) {
        patterns.documentQuery++;
      }
    }

    return patterns;
  }

  /**
   * Extract topics from conversation
   * @param {Array<Object>} messages - Array of messages
   * @returns {Array<string>} - Array of topics
   */
  extractTopics(messages) {
    const topicKeywords = new Map();
    const allText = messages.map(msg => msg.text).join(' ').toLowerCase();

    // Common topic keywords
    const topicMappings = {
      'processes': ['process', 'procedure', 'workflow', 'step', 'method'],
      'tickets': ['ticket', 'client', 'order', 'request', 'issue'],
      'deadlines': ['deadline', 'timing', 'schedule', 'time', 'due'],
      'bookends': ['bookend', 'pairing', 'rotation', 'pattern'],
      'instructions': ['instruction', 'rule', 'guideline', 'policy'],
      'roe': ['roe', 'order type', 'linear', 'digital', 'trade'],
      'qc': ['qc', 'quality', 'check', 'review', 'approval'],
      'documents': ['document', 'file', 'upload', 'pdf', 'content']
    };

    Object.entries(topicMappings).forEach(([topic, keywords]) => {
      const count = keywords.reduce((sum, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        return sum + (allText.match(regex) || []).length;
      }, 0);

      if (count > 0) {
        topicKeywords.set(topic, count);
      }
    });

    return Array.from(topicKeywords.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic);
  }

  /**
   * Identify follow-up question patterns
   * @param {Array<Object>} messages - Array of messages
   * @returns {Array<Object>} - Follow-up patterns
   */
  identifyFollowUpPatterns(messages) {
    const patterns = [];

    for (let i = 1; i < messages.length; i++) {
      const current = messages[i];
      const previous = messages[i - 1];

      if (current.sender === 'user' && previous.sender === 'bot') {
        const followUpType = this.classifyFollowUp(current.text, previous.text);
        if (followUpType) {
          patterns.push({
            type: followUpType,
            question: current.text,
            context: previous.text,
            position: i
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Classify follow-up question type
   * @param {string} question - Current question
   * @param {string} context - Previous response
   * @returns {string|null} - Follow-up type or null
   */
  classifyFollowUp(question, context) {
    const questionLower = question.toLowerCase();
    const contextLower = context.toLowerCase();

    // Clarification follow-up
    if (questionLower.includes('what do you mean') || 
        questionLower.includes('can you explain') ||
        questionLower.includes('clarify')) {
      return 'clarification';
    }

    // Detail follow-up
    if (questionLower.includes('more details') || 
        questionLower.includes('tell me more') ||
        questionLower.includes('elaborate')) {
      return 'detail';
    }

    // Example follow-up
    if (questionLower.includes('example') || 
        questionLower.includes('show me') ||
        questionLower.includes('demonstrate')) {
      return 'example';
    }

    // Related topic follow-up
    if (this.isRelatedTopic(questionLower, contextLower)) {
      return 'related_topic';
    }

    return null;
  }

  /**
   * Check if question is related to previous context
   * @param {string} question - Current question
   * @param {string} context - Previous context
   * @returns {boolean} - True if related
   */
  isRelatedTopic(question, context) {
    const questionTerms = question.split(/\s+/).filter(term => term.length > 3);
    const contextTerms = context.split(/\s+/).filter(term => term.length > 3);
    
    const commonTerms = questionTerms.filter(term => 
      contextTerms.some(contextTerm => 
        contextTerm.includes(term) || term.includes(contextTerm)
      )
    );

    return commonTerms.length > 0;
  }

  /**
   * Analyze document usage in conversation
   * @param {Array<Object>} messages - Array of messages
   * @returns {Object} - Document usage analysis
   */
  analyzeDocumentUsage(messages) {
    const documentMessages = messages.filter(msg => msg.isDocumentBased || msg.source);
    const documents = new Set();
    const documentTopics = new Map();

    documentMessages.forEach(msg => {
      if (msg.source && msg.source.documentName) {
        documents.add(msg.source.documentName);
        
        // Extract topics from document-based responses
        const topics = this.extractTopics([msg]);
        topics.forEach(topic => {
          documentTopics.set(topic, (documentTopics.get(topic) || 0) + 1);
        });
      }
    });

    return {
      documents: Array.from(documents),
      documentCount: documents.size,
      topics: Array.from(documentTopics.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([topic]) => topic)
    };
  }

  /**
   * Determine conversation state
   * @param {Array<Object>} messages - Array of messages
   * @returns {string} - Conversation state
   */
  determineConversationState(messages) {
    if (messages.length === 0) return 'initial';
    
    const lastMessage = messages[messages.length - 1];
    const userMessages = messages.filter(msg => msg.sender === 'user');
    
    // Check for greeting
    if (userMessages.length === 1 && this.isGreeting(lastMessage.text)) {
      return 'greeting';
    }
    
    // Check for clarification needed
    if (lastMessage.sender === 'bot' && 
        (lastMessage.text.includes('clarify') || lastMessage.text.includes('more specific'))) {
      return 'clarification_needed';
    }
    
    // Check for document processing
    if (lastMessage.text.includes('document') && lastMessage.text.includes('processed')) {
      return 'document_processed';
    }
    
    // Check for follow-up
    if (userMessages.length > 1) {
      const lastUserMessage = userMessages[userMessages.length - 1];
      const previousBotMessage = messages[messages.length - 2];
      
      if (this.isFollowUpQuestion(lastUserMessage.text, previousBotMessage.text)) {
        return 'follow_up';
      }
    }
    
    return 'active';
  }

  /**
   * Check if text is a greeting
   * @param {string} text - Text to check
   * @returns {boolean} - True if greeting
   */
  isGreeting(text) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => text.toLowerCase().includes(greeting));
  }

  /**
   * Check if current question is a follow-up
   * @param {string} current - Current question
   * @param {string} previous - Previous response
   * @returns {boolean} - True if follow-up
   */
  isFollowUpQuestion(current, previous) {
    const followUpIndicators = [
      'what about', 'how about', 'what if', 'can you also', 'additionally',
      'furthermore', 'moreover', 'also', 'and', 'but', 'however'
    ];
    
    return followUpIndicators.some(indicator => 
      current.toLowerCase().includes(indicator)
    );
  }

  /**
   * Check if there's a topic switch
   * @param {string} current - Current message
   * @param {string} previous - Previous message
   * @returns {boolean} - True if topic switch
   */
  isTopicSwitch(current, previous) {
    const currentTopics = this.extractTopics([{ text: current }]);
    const previousTopics = this.extractTopics([{ text: previous }]);
    
    if (currentTopics.length === 0 || previousTopics.length === 0) return false;
    
    return !currentTopics.some(topic => previousTopics.includes(topic));
  }

  /**
   * Extract intent patterns from user messages
   * @param {Array<Object>} userMessages - Array of user messages
   * @returns {Object} - Intent patterns
   */
  extractIntentPatterns(userMessages) {
    const intents = {
      question: 0,
      request: 0,
      clarification: 0,
      document_upload: 0,
      help: 0
    };

    userMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      
      if (text.includes('?') || text.startsWith('what') || text.startsWith('how') || text.startsWith('why')) {
        intents.question++;
      }
      
      if (text.includes('please') || text.includes('can you') || text.includes('could you')) {
        intents.request++;
      }
      
      if (text.includes('clarify') || text.includes('explain') || text.includes('what do you mean')) {
        intents.clarification++;
      }
      
      if (text.includes('upload') || text.includes('document') || text.includes('file')) {
        intents.document_upload++;
      }
      
      if (text.includes('help') || text.includes('assist') || text.includes('support')) {
        intents.help++;
      }
    });

    return intents;
  }

  /**
   * Calculate context confidence score
   * @param {Array<Object>} messages - Array of messages
   * @returns {number} - Confidence score (0-1)
   */
  calculateContextConfidence(messages) {
    if (messages.length === 0) return 0;
    
    let confidence = 0.5; // Base confidence
    
    // Increase confidence with more messages
    confidence += Math.min(messages.length * 0.1, 0.3);
    
    // Increase confidence with document usage
    const documentMessages = messages.filter(msg => msg.isDocumentBased);
    confidence += Math.min(documentMessages.length * 0.1, 0.2);
    
    // Increase confidence with follow-up patterns
    const followUpPatterns = this.identifyFollowUpPatterns(messages);
    confidence += Math.min(followUpPatterns.length * 0.05, 0.1);
    
    return Math.min(confidence, 1);
  }

  /**
   * Generate contextual suggestions based on conversation
   * @param {Object} context - Conversation context
   * @returns {Array<string>} - Array of suggestions
   */
  generateContextualSuggestions(context) {
    const suggestions = [];
    
    if (context.currentTopic) {
      suggestions.push(`Tell me more about ${context.currentTopic}`);
      suggestions.push(`What are the requirements for ${context.currentTopic}?`);
    }
    
    if (context.hasDocumentContext) {
      suggestions.push('Search in uploaded documents');
      suggestions.push('What documents do you have?');
    }
    
    if (context.isFollowUp) {
      suggestions.push('Can you provide an example?');
      suggestions.push('What are the next steps?');
    }
    
    if (context.conversationState === 'clarification_needed') {
      suggestions.push('Please provide more details');
      suggestions.push('Can you be more specific?');
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Get default context when no messages exist
   * @returns {Object} - Default context
   */
  getDefaultContext() {
    return {
      conversationFlow: {},
      topics: [],
      followUpPatterns: [],
      documentUsage: { documents: [], documentCount: 0, topics: [] },
      conversationState: 'initial',
      intentPatterns: {},
      currentTopic: null,
      isFollowUp: false,
      hasDocumentContext: false,
      confidence: 0
    };
  }
}

// Create a singleton instance
export const contextAwareness = new ContextAwareness();