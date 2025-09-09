/**
 * Enhanced Question Classification System
 * Provides intelligent question understanding and intent recognition
 */

import { semanticSearch } from './semanticSearch';

/**
 * Enhanced question classification class
 */
export class QuestionClassifier {
  constructor() {
    this.intentPatterns = {
      // Information seeking
      what: {
        keywords: ['what', 'which', 'who', 'when', 'where', 'why', 'how'],
        patterns: [
          /what (is|are|was|were|will|would|should|can|could)/i,
          /which (one|of|is|are)/i,
          /who (is|are|was|were|will|would|should|can|could)/i,
          /when (is|are|was|were|will|would|should|can|could)/i,
          /where (is|are|was|were|will|would|should|can|could)/i,
          /why (is|are|was|were|will|would|should|can|could)/i,
          /how (is|are|was|were|will|would|should|can|could)/i
        ],
        confidence: 0.9
      },
      
      // Process/Procedure questions
      process: {
        keywords: ['process', 'procedure', 'workflow', 'step', 'method', 'how to', 'how do'],
        patterns: [
          /how (to|do|can|should)/i,
          /what (is|are) the (process|procedure|workflow|steps)/i,
          /how (does|do) (this|it|the)/i,
          /what (are|is) the (steps|process|procedure)/i
        ],
        confidence: 0.8
      },
      
      // Definition questions
      definition: {
        keywords: ['define', 'definition', 'meaning', 'what is', 'what are'],
        patterns: [
          /what (is|are) (a|an|the)?/i,
          /define/i,
          /meaning (of|for)/i,
          /what does (.*) mean/i
        ],
        confidence: 0.8
      },
      
      // Comparison questions
      comparison: {
        keywords: ['compare', 'difference', 'versus', 'vs', 'better', 'best', 'worse', 'worst'],
        patterns: [
          /compare/i,
          /difference (between|in)/i,
          /versus|vs/i,
          /which (is|are) (better|best|worse|worst)/i
        ],
        confidence: 0.7
      },
      
      // Troubleshooting questions
      troubleshooting: {
        keywords: ['problem', 'issue', 'error', 'trouble', 'fix', 'solve', 'help', 'not working'],
        patterns: [
          /(problem|issue|error|trouble) (with|in)/i,
          /(fix|solve|help) (with|me)/i,
          /(not|doesn't|won't) (work|working)/i,
          /what's (wrong|the problem)/i
        ],
        confidence: 0.8
      },
      
      // Document questions
      document: {
        keywords: ['document', 'file', 'upload', 'pdf', 'content', 'search', 'find'],
        patterns: [
          /(search|find) (in|for)/i,
          /(document|file|pdf) (contains|has)/i,
          /upload (a|the)/i,
          /what (is|are) (in|the content of)/i
        ],
        confidence: 0.7
      },
      
      // Time/Deadline questions
      time: {
        keywords: ['time', 'deadline', 'schedule', 'when', 'timing', 'due'],
        patterns: [
          /(when|what time|what's the deadline)/i,
          /(schedule|timing|deadline) (for|of)/i,
          /(due|deadline) (date|time)/i
        ],
        confidence: 0.8
      },
      
      // Confirmation questions
      confirmation: {
        keywords: ['confirm', 'verify', 'check', 'is it', 'are you', 'can you'],
        patterns: [
          /(confirm|verify|check) (that|if)/i,
          /(is|are) (it|this|that)/i,
          /can you (confirm|verify|check)/i
        ],
        confidence: 0.7
      },
      
      // Request questions
      request: {
        keywords: ['please', 'can you', 'could you', 'would you', 'help me'],
        patterns: [
          /(please|can you|could you|would you) (help|do|show|tell)/i,
          /(help|assist) (me|with)/i,
          /(show|tell) (me|us)/i
        ],
        confidence: 0.6
      }
    };
    
    this.entityTypes = {
      ticket: {
        patterns: [/ticket\s*#?\s*\d+/i, /ticket\s+(number|id)/i],
        confidence: 0.9
      },
      client: {
        patterns: [/client\s+(name|id)/i, /customer\s+(name|id)/i],
        confidence: 0.8
      },
      process: {
        patterns: [/process\s+\d+/i, /workflow\s+\d+/i],
        confidence: 0.8
      },
      deadline: {
        patterns: [/deadline/i, /due\s+date/i, /timing/i],
        confidence: 0.7
      },
      document: {
        patterns: [/document/i, /file/i, /pdf/i, /upload/i],
        confidence: 0.7
      }
    };
  }

  /**
   * Classify a question and extract intent
   * @param {string} question - The question to classify
   * @param {Object} context - Optional conversation context
   * @returns {Object} - Classification result
   */
  classify(question, context = {}) {
    if (!question || typeof question !== 'string') {
      return this.getDefaultClassification();
    }

    const normalizedQuestion = question.trim().toLowerCase();
    
    // Extract entities
    const entities = this.extractEntities(question);
    
    // Classify intent
    const intent = this.classifyIntent(normalizedQuestion);
    
    // Determine question type
    const questionType = this.determineQuestionType(question);
    
    // Extract keywords
    const keywords = this.extractKeywords(question);
    
    // Determine urgency
    const urgency = this.determineUrgency(question, context);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(intent, entities, questionType);
    
    return {
      intent,
      entities,
      questionType,
      keywords,
      urgency,
      confidence,
      originalQuestion: question,
      isFollowUp: this.isFollowUpQuestion(question, context),
      requiresDocument: this.requiresDocument(question, entities),
      suggestedActions: this.generateSuggestedActions(intent, entities, questionType)
    };
  }

  /**
   * Extract entities from question
   * @param {string} question - The question
   * @returns {Array<Object>} - Array of entities
   */
  extractEntities(question) {
    const entities = [];
    
    Object.entries(this.entityTypes).forEach(([type, config]) => {
      config.patterns.forEach(pattern => {
        const matches = question.match(pattern);
        if (matches) {
          entities.push({
            type,
            value: matches[0],
            confidence: config.confidence,
            position: question.indexOf(matches[0])
          });
        }
      });
    });
    
    return entities;
  }

  /**
   * Classify intent from question
   * @param {string} normalizedQuestion - Normalized question
   * @returns {Object} - Intent classification
   */
  classifyIntent(normalizedQuestion) {
    let bestIntent = null;
    let bestScore = 0;
    
    Object.entries(this.intentPatterns).forEach(([intentName, config]) => {
      let score = 0;
      
      // Check keyword matches
      const keywordMatches = config.keywords.filter(keyword => 
        normalizedQuestion.includes(keyword)
      ).length;
      score += keywordMatches * 0.3;
      
      // Check pattern matches
      const patternMatches = config.patterns.filter(pattern => 
        pattern.test(normalizedQuestion)
      ).length;
      score += patternMatches * 0.7;
      
      // Apply confidence multiplier
      score *= config.confidence;
      
      if (score > bestScore) {
        bestScore = score;
        bestIntent = {
          name: intentName,
          score,
          confidence: config.confidence
        };
      }
    });
    
    return bestIntent || {
      name: 'unknown',
      score: 0,
      confidence: 0
    };
  }

  /**
   * Determine question type
   * @param {string} question - The question
   * @returns {string} - Question type
   */
  determineQuestionType(question) {
    if (question.includes('?')) {
      if (question.startsWith('what')) return 'what';
      if (question.startsWith('how')) return 'how';
      if (question.startsWith('why')) return 'why';
      if (question.startsWith('when')) return 'when';
      if (question.startsWith('where')) return 'where';
      if (question.startsWith('who')) return 'who';
      if (question.startsWith('which')) return 'which';
      return 'question';
    }
    
    if (question.toLowerCase().includes('please') || question.toLowerCase().includes('can you')) {
      return 'request';
    }
    
    if (question.toLowerCase().includes('help') || question.toLowerCase().includes('support')) {
      return 'help';
    }
    
    return 'statement';
  }

  /**
   * Extract keywords from question
   * @param {string} question - The question
   * @returns {Array<string>} - Array of keywords
   */
  extractKeywords(question) {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its',
      'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'would', 'you', 'your', 'i', 'me', 'my', 'we',
      'our', 'they', 'them', 'their', 'this', 'these', 'those', 'have', 'had', 'do', 'does', 'did', 'can',
      'could', 'should', 'would', 'may', 'might', 'must', 'shall', 'will', 'am', 'is', 'are', 'was', 'were',
      'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'shall', 'ought', 'need', 'dare', 'used', 'what', 'how', 'why',
      'when', 'where', 'who', 'which', 'please', 'help', 'show', 'tell', 'find', 'search'
    ]);
    
    return question.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter((word, index, array) => array.indexOf(word) === index); // Remove duplicates
  }

  /**
   * Determine urgency level
   * @param {string} question - The question
   * @param {Object} context - Conversation context
   * @returns {string} - Urgency level
   */
  determineUrgency(question, context) {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'deadline'];
    const urgentPatterns = [/asap/i, /urgent/i, /immediately/i, /emergency/i, /critical/i];
    
    const hasUrgentKeywords = urgentKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );
    
    const hasUrgentPatterns = urgentPatterns.some(pattern => 
      pattern.test(question)
    );
    
    if (hasUrgentKeywords || hasUrgentPatterns) {
      return 'high';
    }
    
    if (context.conversationState === 'clarification_needed') {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Calculate overall confidence
   * @param {Object} intent - Intent classification
   * @param {Array<Object>} entities - Extracted entities
   * @param {string} questionType - Question type
   * @returns {number} - Confidence score (0-1)
   */
  calculateConfidence(intent, entities, questionType) {
    let confidence = 0.5; // Base confidence
    
    // Add intent confidence
    confidence += intent.score * 0.4;
    
    // Add entity confidence
    if (entities.length > 0) {
      const avgEntityConfidence = entities.reduce((sum, entity) => 
        sum + entity.confidence, 0) / entities.length;
      confidence += avgEntityConfidence * 0.3;
    }
    
    // Add question type confidence
    if (questionType !== 'statement') {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1);
  }

  /**
   * Check if question is a follow-up
   * @param {string} question - The question
   * @param {Object} context - Conversation context
   * @returns {boolean} - True if follow-up
   */
  isFollowUpQuestion(question, context) {
    const followUpIndicators = [
      'what about', 'how about', 'what if', 'can you also', 'additionally',
      'furthermore', 'moreover', 'also', 'and', 'but', 'however', 'then',
      'next', 'after that', 'following', 'subsequent'
    ];
    
    return followUpIndicators.some(indicator => 
      question.toLowerCase().includes(indicator)
    );
  }

  /**
   * Check if question requires document search
   * @param {string} question - The question
   * @param {Array<Object>} entities - Extracted entities
   * @returns {boolean} - True if requires document
   */
  requiresDocument(question, entities) {
    const documentKeywords = ['document', 'file', 'pdf', 'upload', 'content', 'search', 'find'];
    const hasDocumentKeywords = documentKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );
    
    const hasDocumentEntities = entities.some(entity => 
      entity.type === 'document'
    );
    
    return hasDocumentKeywords || hasDocumentEntities;
  }

  /**
   * Generate suggested actions based on classification
   * @param {Object} intent - Intent classification
   * @param {Array<Object>} entities - Extracted entities
   * @param {string} questionType - Question type
   * @returns {Array<string>} - Array of suggested actions
   */
  generateSuggestedActions(intent, entities, questionType) {
    const actions = [];
    
    // Intent-based actions
    switch (intent.name) {
      case 'process':
        actions.push('Show process steps');
        actions.push('Provide workflow diagram');
        break;
      case 'definition':
        actions.push('Provide definition');
        actions.push('Show examples');
        break;
      case 'troubleshooting':
        actions.push('Diagnose problem');
        actions.push('Provide solution steps');
        break;
      case 'document':
        actions.push('Search documents');
        actions.push('Show relevant content');
        break;
      case 'time':
        actions.push('Show schedule');
        actions.push('Check deadlines');
        break;
    }
    
    // Entity-based actions
    entities.forEach(entity => {
      switch (entity.type) {
        case 'ticket':
          actions.push('Look up ticket details');
          break;
        case 'client':
          actions.push('Find client information');
          break;
        case 'process':
          actions.push('Show process details');
          break;
      }
    });
    
    return actions.slice(0, 3); // Limit to 3 actions
  }

  /**
   * Get default classification
   * @returns {Object} - Default classification
   */
  getDefaultClassification() {
    return {
      intent: { name: 'unknown', score: 0, confidence: 0 },
      entities: [],
      questionType: 'statement',
      keywords: [],
      urgency: 'low',
      confidence: 0.1,
      originalQuestion: '',
      isFollowUp: false,
      requiresDocument: false,
      suggestedActions: []
    };
  }
}

// Create a singleton instance
export const questionClassifier = new QuestionClassifier();