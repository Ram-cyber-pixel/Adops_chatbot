import stringSimilarity from 'string-similarity';

/**
 * Enhanced fuzzy matching utility for improved response accuracy
 * Modified to preserve identical keywords without deduplication
 * and to process both keywords and full sentences
 */

/**
 * Finds the best matches for a user input from a list of keywords with improved accuracy.
 * Preserves all instances of identical keywords without deduplication.
 * @param {string} userInput - The user's input text.
 * @param {Array<string>} keywords - The list of keywords to match against.
 * @param {number} threshold - The similarity threshold (default: 0.5).
 * @returns {Array<{keyword: string, similarity: number, originalIndex: number}>} - A list of matching keywords with similarity scores and original indices.
 */
export const findBestMatches = (userInput, keywords, threshold = 0.5) => {
  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Invalid userInput: Must be a non-empty string.');
  }

  if (!Array.isArray(keywords) || keywords.length === 0) {
    throw new Error('Invalid keywords: Must be a non-empty array of strings.');
  }

  // Normalize input by removing extra spaces and converting to lowercase
  const normalizedInput = userInput.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Break input into words for partial matching
  const inputWords = normalizedInput.split(' ').filter(word => word.length > 2);
  
  // Map each keyword with its original index to preserve order and duplicates
  const matches = keywords.map((keyword, index) => {
    // Normalize keyword
    const normalizedKeyword = keyword.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // Calculate full string similarity for sentence matching
    const fullStringSimilarity = stringSimilarity.compareTwoStrings(normalizedInput, normalizedKeyword);
    
    // Calculate word-level similarities for keyword matching
    let wordSimilarities = 0;
    let matchedWords = 0;
    
    // Check if any input words are contained in the keyword
    inputWords.forEach(word => {
      if (normalizedKeyword.includes(word)) {
        wordSimilarities += 1;
        matchedWords += 1;
      } else {
        // Check for similar words
        const keywordWords = normalizedKeyword.split(' ');
        const bestWordMatch = Math.max(...keywordWords.map(kw => 
          stringSimilarity.compareTwoStrings(word, kw)
        ));
        
        if (bestWordMatch > 0.8) {
          wordSimilarities += bestWordMatch;
          matchedWords += 1;
        }
      }
    });
    
    // Calculate word similarity score (normalized by input word count)
    const wordSimilarityScore = inputWords.length > 0 
      ? wordSimilarities / inputWords.length 
      : 0;
    
    // Calculate exact match bonus
    const exactMatchBonus = normalizedKeyword === normalizedInput ? 0.3 : 0;
    
    // Calculate contains bonus (if keyword is fully contained in input)
    const containsBonus = normalizedInput.includes(normalizedKeyword) ? 0.2 : 0;
    
    // Calculate sentence similarity bonus (if input is similar to keyword as a full sentence)
    const sentenceSimilarityBonus = fullStringSimilarity > 0.7 ? 0.25 : 0;
    
    // Calculate final similarity score with weighted components
    // Give more weight to full sentence matching as requested by user
    let finalSimilarity = Math.min(
      1,
      (fullStringSimilarity * 0.7) + // Increased weight for full sentence matching
      (wordSimilarityScore * 0.3) + // Decreased weight for individual word matching
      exactMatchBonus + 
      containsBonus +
      sentenceSimilarityBonus
    );
    
    // Add a special case for common important keywords
    const importantKeywords = ['process', 'processes','qc', 'upload', 'ticket', 'deadline'];
    importantKeywords.forEach(importantWord => {
      if (normalizedInput.includes(importantWord) && normalizedKeyword.includes(importantWord)) {
        finalSimilarity += 0.2; // Boost similarity score
        finalSimilarity = Math.min(finalSimilarity, 1); // Cap at 1.0
      }
    });
    
    return {
      keyword,
      similarity: finalSimilarity,
      matchedWords,
      originalIndex: index, // Store the original index to preserve order and duplicates
      isFullSentenceMatch: fullStringSimilarity > 0.7 // Flag if this is a full sentence match
    };
  });

  // Filter matches by similarity threshold but preserve original order
  // Do not deduplicate identical keywords - keep all instances
  const bestMatches = matches
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => {
      // First prioritize full sentence matches
      if (a.isFullSentenceMatch !== b.isFullSentenceMatch) {
        return a.isFullSentenceMatch ? -1 : 1;
      }
      
      // Then sort by similarity score (descending)
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
      }
      
      // If similarity scores are equal, preserve original order
      return a.originalIndex - b.originalIndex;
    });

  return bestMatches;
};

/**
 * Extracts key phrases from user input for better context understanding
 * Modified to preserve all instances of phrases without deduplication
 * @param {string} userInput - The user's input text
 * @returns {Array<string>} - Array of extracted key phrases
 */
export const extractKeyPhrases = (userInput) => {
  if (!userInput || typeof userInput !== 'string') {
    return [];
  }
  
  // Store the original input for full sentence matching
  const originalInput = userInput.trim();
  
  // Normalize input
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Common stop words to filter out
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should',
    'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
    'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
    'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who',
    'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do',
    'does', 'did', 'doing', 'would', 'should', 'could', 'ought', 'i\'m',
    'you\'re', 'he\'s', 'she\'s', 'it\'s', 'we\'re', 'they\'re', 'i\'ve',
    'you\'ve', 'we\'ve', 'they\'ve', 'i\'d', 'you\'d', 'he\'d', 'she\'d',
    'we\'d', 'they\'d', 'i\'ll', 'you\'ll', 'he\'ll', 'she\'ll', 'we\'ll',
    'they\'ll', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'hasn\'t',
    'haven\'t', 'hadn\'t', 'doesn\'t', 'don\'t', 'didn\'t', 'won\'t',
    'wouldn\'t', 'shan\'t', 'shouldn\'t', 'can\'t', 'cannot', 'couldn\'t',
    'mustn\'t', 'let\'s', 'that\'s', 'who\'s', 'what\'s', 'here\'s',
    'there\'s', 'when\'s', 'where\'s', 'why\'s', 'how\'s', 'a', 'an', 'the',
    'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
    'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very','gimme', 'gimmi', 'gimme', 'gimme', 'gimme',
  ]);
  
  // Split input into words and filter out stop words and short words
  const words = normalizedInput
    .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => !stopWords.has(word) && word.length > 2);
  
  // Extract single words (important nouns, verbs, etc.)
  // Do not deduplicate words - preserve all instances
  const singleWords = words;
  
  // Extract bigrams (two consecutive words)
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  
  // Extract trigrams (three consecutive words)
  const trigrams = [];
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  
  // Include the full original input as a phrase for full sentence matching
  const fullSentence = [originalInput];
  
  // Combine all phrases, prioritizing full sentence, then longer phrases
  // Do not deduplicate - preserve all instances
  return [...fullSentence, ...trigrams, ...bigrams, ...singleWords];
};

/**
 * Analyzes the context of a conversation based on previous messages
 * Modified to preserve keyword frequency and placement and handle full sentences
 * @param {Array<{text: string, sender: string}>} messages - Previous messages in the conversation
 * @returns {Object} - Context information extracted from the conversation
 */
export const analyzeConversationContext = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { topics: [], fullSentences: [], sentiment: 'neutral', questionCount: 0 };
  }
  
  // Extract user messages only
  const userMessages = messages.filter(msg => msg.sender === 'user').map(msg => msg.text);
  
  // Extract all key phrases from user messages
  const allPhrases = userMessages.flatMap(msg => extractKeyPhrases(msg));
  
  // Store full sentences separately
  const fullSentences = userMessages.map(msg => msg.trim());
  
  // Count phrase occurrences to identify main topics
  // Preserve exact frequency of each phrase
  const phraseCounts = {};
  allPhrases.forEach(phrase => {
    phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
  });
  
  // Sort phrases by occurrence count to identify main topics
  // Include all instances of each phrase with its count
  const topics = Object.entries(phraseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Increase from 5 to 10 to include more topics
    .map(entry => ({ phrase: entry[0], count: entry[1] }));
  
  // Count questions to determine if user is in question-asking mode
  const questionCount = userMessages.filter(msg => /\?/.test(msg)).length;
  
  // Simple sentiment analysis
  let positiveCount = 0;
  let negativeCount = 0;
  
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'helpful', 'thanks', 'thank', 'appreciate'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'useless', 'not working', 'problem', 'issue', 'error', 'wrong'];
  
  userMessages.forEach(msg => {
    const lowerMsg = msg.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerMsg.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (lowerMsg.includes(word)) negativeCount++;
    });
  });
  
  let sentiment = 'neutral';
  if (positiveCount > negativeCount + 1) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount + 1) {
    sentiment = 'negative';
  }
  
  return {
    topics: topics.map(t => t.phrase), // For backward compatibility
    topicsWithCounts: topics, // New property with counts
    fullSentences, // Include full sentences for sentence-level matching
    sentiment,
    questionCount,
    isInquisitive: questionCount > userMessages.length / 3,
    allPhrases // Include all phrases with their original order
  };
};

/**
 * Determines the most relevant response category based on user input and conversation context
 * Modified to preserve keyword frequency and placement and handle full sentences
 * @param {string} userInput - The user's input text
 * @param {Object} context - The conversation context
 * @param {Object} responseCategories - Available response categories with their keywords
 * @returns {Object} - Object containing category, matches, and score
 */
export const determineResponseCategory = (userInput, context, responseCategories) => {
  if (!userInput || !responseCategories) {
    return {
      category: 'default',
      matches: [],
      score: 0
    };
  }
  
  // Add special handling for common queries
  const lowerInput = userInput.toLowerCase();
  
  // Enhanced process detection
  if (lowerInput.includes('process') || lowerInput.includes('processes')) {
    // Collect all process-related categories
    const processCategories = [];
    
    for (const category in responseCategories) {
      if (category === 'default') continue;
      
      if (category.toLowerCase().includes('process') || 
          (responseCategories[category].keywords && 
           responseCategories[category].keywords.some(k => k.toLowerCase().includes('process')))) {
        processCategories.push(category);
      }
    }
    
    // If found process categories, look for the best match
    if (processCategories.length > 0) {
      let bestProcessCategory = '';
      let highestScore = 0;
      let bestMatches = [];
      
      for (const category of processCategories) {
        const keywords = responseCategories[category].keywords || [];
        const matches = findBestMatches(userInput, keywords, 0.4); // Lower threshold for processes
        
        if (matches.length > 0) {
          // Calculate score based on all matches, preserving duplicates
          const score = matches.reduce((sum, match) => sum + match.similarity, 0);
          if (score > highestScore) {
            highestScore = score;
            bestProcessCategory = category;
            bestMatches = matches;
          }
        }
      }
      
      if (bestProcessCategory && highestScore > 0.4) {
        return {
          category: bestProcessCategory,
          matches: bestMatches,
          score: highestScore
        };
      }
    }
  }
  
  // Extract key phrases from user input - preserving all instances and including full sentence
  const keyPhrases = extractKeyPhrases(userInput);
  
  // Calculate relevance scores for each category
  const categoryScores = {};
  const categoryMatches = {}; // Store all matches for each category
  
  for (const category in responseCategories) {
    if (category === 'default') continue;
    
    const keywords = responseCategories[category].keywords || [];
    if (keywords.length === 0) continue;
    
    // Find matches between keywords and key phrases - preserving all instances
    // Include the full user input as a potential match for full sentence matching
    const augmentedKeywords = [...keywords, userInput.trim()];
    const matches = findBestMatches(userInput, keywords, 0.5);
    
    // Store all matches for this category
    categoryMatches[category] = matches;
    
    // Calculate base score from all matches
    const matchScore = matches.reduce((sum, match) => sum + match.similarity, 0);
    
    // Full sentence matching bonus
    const fullSentenceMatches = matches.filter(match => match.isFullSentenceMatch);
    const fullSentenceBonus = fullSentenceMatches.length > 0 ? 0.3 : 0;
    
    // Context boost: if category relates to conversation topics
    let contextBoost = 0;
    if (context && context.topics) {
      context.topics.forEach(topic => {
        keywords.forEach(keyword => {
          if (keyword.includes(topic) || topic.includes(keyword)) {
            contextBoost += 0.2;
          }
        });
      });
    }
    
    // Additional context boost for full sentence matches in conversation history
    if (context && context.fullSentences) {
      context.fullSentences.forEach(sentence => {
        keywords.forEach(keyword => {
          const similarity = stringSimilarity.compareTwoStrings(sentence.toLowerCase(), keyword.toLowerCase());
          if (similarity > 0.7) {
            contextBoost += 0.3;
          }
        });
      });
    }
    
    // Calculate final score
    categoryScores[category] = matchScore + contextBoost + fullSentenceBonus;
  }
  
  // Find category with highest score
  let bestCategory = 'default';
  let highestScore = 0;
  
  for (const category in categoryScores) {
    if (categoryScores[category] > highestScore) {
      highestScore = categoryScores[category];
      bestCategory = category;
    }
  }
  
  // Store the matched keywords for the best category
  const bestMatches = categoryMatches[bestCategory] || [];
  
  // Only use best category if score is significant
  return {
    category: highestScore > 0.6 ? bestCategory : 'default',
    matches: bestMatches, // Include all matched keywords with their original indices
    score: highestScore
  };
};

/**
 * Checks if the input is a mathematical expression
 * @param {string} input - User input to check
 * @returns {boolean} - True if input appears to be a math expression
 */
export const isMathExpression = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  // Remove spaces for easier pattern matching
  const cleanInput = input.trim();
  
  // Basic pattern for math expressions: number operator number
  // Supports decimal numbers and basic operators +, -, *, /
  return /^[\d.]+\s*[\+\-\*\/]\s*[\d.]+$/.test(cleanInput);
};
