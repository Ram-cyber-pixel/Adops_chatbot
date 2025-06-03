import { findBestMatches, analyzeConversationContext, determineResponseCategory } from './enhancedFuzzyMatching';
import { extractImageUrls, extractLinks, formatLink, enhanceTextWithImages } from './enhancedImageUtils';
import { processMathInput } from './mathCalculator';
import { isDateTimeQuery, extractDateTimeInfo, generateDateTimeResponse, marketDeadlineData, uploadScheduleData } from './dateTimeUtils';
import { isProcessQuery, generateProcessResponse } from './processSearchUtils';
import { isUrlResourceQuery, generateUrlResourceResponse } from './urlResourceUtils';
import { formatLineByLine, formatResponseLineByLine } from '../utils/lineFormatUtils';
/**
 * Generates an enhanced response to user input
 * Modified to ensure answers use data directly associated with relevant keywords
 * @param {string} userInput - The user's input text
 * @param {Array} messages - Previous messages in the conversation
 * @param {Object} responseData - Available response data categories
 * @returns {Object} - Response object with text and metadata
 */

// Removed duplicate declaration of formatResponseLineByLine
export const generateEnhancedResponse = (userInput, messages, responseData) => {
  // Add defensive checks at the beginning
  if (!userInput || !responseData) {
    return {
      text: "I'm not sure what you're asking about. Could you provide more details?",
      category: 'default',
      confidence: 0
    };
  }

  // Check if the input is a math expression and process it
  const mathResult = processMathInput(userInput);
  if (mathResult.isMathExpression) {
    return {
      text: mathResult.formattedResponse,
      category: 'math',
      confidence: 1.0
    };
  }

  // Ensure responseData has the expected structure
  const safeResponseData = {
    syscodeData: responseData.syscodeData || {},
    questionAndAnswerData: responseData.questionAndAnswerData || {},
    ticketData: responseData.ticketData || {},
    roeData: responseData.roeData || {},
    fulfillmentData: responseData.fulfillmentData || {},
    generalResponses: responseData.generalResponses || {
      default: {
        responses: ["I'm not sure about that. Could you provide more information?"]
      }
    } 
  };

  // Clean and normalize input
  const cleanedInput = userInput.trim();
  
  // Extract image URLs from user input
  const imageUrls = extractImageUrls(cleanedInput);
  
  // Extract non-image links from user input
  const links = extractLinks(cleanedInput);
  
  // Analyze conversation context
  const context = analyzeConversationContext(messages);
  
  // Combine all response categories from different data sources
  const allCategories = {
    ...safeResponseData.syscodeData,
    ...safeResponseData.questionAndAnswerData,
    ...safeResponseData.ticketData,
    ...safeResponseData.generalResponses,
    ...safeResponseData.roeData,
    ...safeResponseData.fulfillmentData
  };
  
  // Determine the most relevant response category
  // The updated determineResponseCategory now returns an object with category, matches, and score
  const categoryResult = determineResponseCategory(cleanedInput, context, allCategories);
  let category = typeof categoryResult === 'object' ? categoryResult.category : categoryResult;
  let matchedKeywords = typeof categoryResult === 'object' ? categoryResult.matches : [];
  
  // Get responses for the determined category
  let responses = [];
  let confidence = typeof categoryResult === 'object' ? categoryResult.score : 0;
  let matchedData = null;
  
  // Check for URL resource queries
  if (isUrlResourceQuery(cleanedInput)) {
    // Generate URL resource response
    const urlResourceResponse = generateUrlResourceResponse(cleanedInput);
    
    if (urlResourceResponse.confidence > 0.6) {
      return {
        text: urlResourceResponse.text,
        category: urlResourceResponse.category || 'urlResource',
        confidence: urlResourceResponse.confidence,
        sidebarContent: urlResourceResponse.sidebarContent,
        matchedKeywords: matchedKeywords // Include matched keywords
      };
    }
  }
  
  // Check for date/time search
  if (isDateTimeQuery(cleanedInput)) {
    // Create date/time data object
    const dateTimeData = {
      marketDeadlines: marketDeadlineData,
      uploadSchedule: uploadScheduleData
    };
    
    // Generate date/time response
    const dateTimeResponse = generateDateTimeResponse(cleanedInput, dateTimeData);
    
    if (dateTimeResponse.confidence > 0.6) {
      return {
        text: dateTimeResponse.text,
        category: dateTimeResponse.category || 'datetime',
        confidence: dateTimeResponse.confidence,
        matchedKeywords: matchedKeywords // Include matched keywords
      };
    }
  }
  
  // Check for process search
  if (isProcessQuery(cleanedInput)) {
    // Generate process response
    const processResponse = generateProcessResponse(cleanedInput);
    
    if (processResponse.confidence > 0.6) {
      return {
        text: processResponse.text,
        category: processResponse.category || 'process',
        confidence: processResponse.confidence,
        matchedKeywords: matchedKeywords // Include matched keywords
      };
    }
  }
  
  // Process keywords handling - preserve all instances
  let processKeywords = [];
  // Check each data source for the category with defensive programming
  for (const catKey in allCategories) {
    if (catKey.toLowerCase().includes('process') || 
        (allCategories[catKey].keywords && 
         allCategories[catKey].keywords.some(k => k.toLowerCase().includes('process')))) {
      // Add this category's keywords to our process keywords list
      if (allCategories[catKey].keywords) {
        processKeywords.push(...allCategories[catKey].keywords);
      }
    }
  }
    
  // Find best matches among process keywords - preserve all instances
  if (processKeywords.length > 0) {
    const matches = findBestMatches(cleanedInput, processKeywords, 0.5);
    if (matches.length > 0) {
      // Find which category contains the best match
      const bestMatch = matches[0].keyword;
      for (const catKey in allCategories) {
        if (allCategories[catKey].keywords && 
            allCategories[catKey].keywords.includes(bestMatch)) {
          responses = allCategories[catKey].responses || [];
          confidence = matches[0].similarity;
          matchedData = allCategories[catKey];
          break;
        }
      }
    }
  }
  
  // Check each data source for the category with defensive programming
  // Use the exact category name from the matched keywords
  if (safeResponseData.syscodeData && 
      safeResponseData.syscodeData[category] && 
      Array.isArray(safeResponseData.syscodeData[category].responses)) {
    responses = safeResponseData.syscodeData[category].responses;
    confidence = 0.9;
    matchedData = safeResponseData.syscodeData[category];
  } else if (safeResponseData.questionAndAnswerData && 
             safeResponseData.questionAndAnswerData[category] && 
             Array.isArray(safeResponseData.questionAndAnswerData[category].responses)) {
    responses = safeResponseData.questionAndAnswerData[category].responses;
    confidence = 0.9;
    matchedData = safeResponseData.questionAndAnswerData[category];
  } else if (safeResponseData.ticketData && 
             safeResponseData.ticketData[category] && 
             Array.isArray(safeResponseData.ticketData[category].responses)) {
    responses = safeResponseData.ticketData[category].responses;
    confidence = 0.9;
    matchedData = safeResponseData.ticketData[category];
    
    // Handle ticket data with images
    if (safeResponseData.ticketData[category] && safeResponseData.ticketData[category].image) {
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        category: category,
        confidence: confidence,
        localImages: [safeResponseData.ticketData[category].image],
        matchedKeywords: matchedKeywords, // Include matched keywords
        matchedData: matchedData // Include the full matched data
      };
    }
  } else if (safeResponseData.roeData && 
             safeResponseData.roeData[category] && 
             Array.isArray(safeResponseData.roeData[category].responses)) {
    responses = safeResponseData.roeData[category].responses;
    confidence = 0.9;
    matchedData = safeResponseData.roeData[category];
  }else if (safeResponseData.fulfillmentData && 
            safeResponseData.fulfillmentData[category] && 
            Array.isArray(safeResponseData.fulfillmentData[category].responses)) {
      responses = safeResponseData.fulfillmentData[category].responses;
      confidence = 0.9;
      matchedData = safeResponseData.fulfillmentData[category];
    } else if (safeResponseData.generalResponses && 
             safeResponseData.generalResponses[category] && 
             Array.isArray(safeResponseData.generalResponses[category].responses)) {
    responses = safeResponseData.generalResponses[category].responses;
    confidence = 0.8;
    matchedData = safeResponseData.generalResponses[category];
  }
  
  // If no specific category was found, use fuzzy matching to find the best match
  // But preserve all matched keywords and their data
  if (responses.length === 0 || category === 'default') {
    // Try to find matches in all data sources
    let bestMatches = [];
    let highestConfidence = 0;
    let bestCategory = '';
    let bestResponses = [];
    let bestMatchedData = null;
    
    // Function to check each data source
    const checkDataSource = (dataSource, sourceName) => {
      for (const key in dataSource) {
        if (key === 'default') continue;
        
        const keywords = dataSource[key].keywords || [];
        const matches = findBestMatches(cleanedInput, keywords, 0.6);
        
        if (matches.length > 0) {
          // Store all matches with their data source
          matches.forEach(match => {
            bestMatches.push({
              ...match,
              dataSource: sourceName,
              dataKey: key,
              data: dataSource[key]
            });
          });
          
          // Check if this is the highest confidence match
          const maxSimilarity = Math.max(...matches.map(m => m.similarity));
          if (maxSimilarity > highestConfidence) {
            highestConfidence = maxSimilarity;
            bestCategory = key;
            bestResponses = dataSource[key].responses || [];
            bestMatchedData = dataSource[key];
          }
        }
      }
    };
    
    // Check all data sources
    checkDataSource(safeResponseData.syscodeData, 'syscodeData');
    checkDataSource(safeResponseData.questionAndAnswerData, 'questionAndAnswerData');
    checkDataSource(safeResponseData.ticketData, 'ticketData');
    checkDataSource(safeResponseData.roeData, 'roeData');
    checkDataSource(safeResponseData.generalResponses, 'generalResponses');
    checkDataSource(safeResponseData.fulfillmentData, 'fulfillmentData');
    
    // Sort all matches by similarity
    bestMatches.sort((a, b) => b.similarity - a.similarity);
    
    // Use the best match if confidence is high enough
    if (highestConfidence > 0.7 && bestResponses.length > 0) {
      responses = bestResponses;
      category = bestCategory;
      confidence = highestConfidence;
      matchedData = bestMatchedData;
      matchedKeywords = bestMatches; // Include all matched keywords
    } else {
      // Fall back to default responses
      responses = safeResponseData.generalResponses.default?.responses || 
        ["I'm not sure I understand. Could you phrase that differently?"];
      confidence = 0.5;
    }
  }

  // Ensure responses is always an array before trying to select from it
  if (!Array.isArray(responses) || responses.length === 0) {
    responses = ["I'm not sure how to respond to that. Could you try asking differently?"];
  }
  
  // Select a response based on matched keywords instead of random selection
  // This ensures answers use data directly associated with relevant keywords
  let responseText;
  
  if (matchedKeywords && matchedKeywords.length > 0 && responses.length > 1) {
    // Use the highest matching keyword to select the most relevant response
    const keywordIndex = Math.min(matchedKeywords[0].originalIndex || 0, responses.length - 1);
    responseText = responses[keywordIndex % responses.length];
  } else {
    // Fall back to random selection if no matched keywords or only one response
    responseText = responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Extract image URLs from the response
  const responseImageUrls = extractImageUrls(responseText);
  
  // Clean the response text by removing image URLs
  const cleanedResponseText = responseText.replace(/(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|svg))/gi, '').trim();
  
  // Format any links in the response
  let formattedText = cleanedResponseText;
  const responseLinks = extractLinks(cleanedResponseText);
  
  responseLinks.forEach(link => {
    const formattedLink = formatLink(link);
    formattedText = formattedText.replace(link, formattedLink);
  });
  
  // Return the enhanced response with matched keywords and data
  return {
    text: formattedText,
    imageUrls: responseImageUrls,
    category,
    confidence,
    links: responseLinks,
    matchedKeywords: matchedKeywords, // Include all matched keywords
    matchedData: matchedData // Include the full matched data
  };
};

/**
 * Handles special commands in user input
 * @param {string} userInput - The user's input text
 * @returns {Object|null} - Special command response or null if no command detected
 */
export const handleSpecialCommands = (userInput) => {
  if (!userInput) return null;
  
  const lowerInput = userInput.toLowerCase().trim();
  
  // Help command
  if (/^help$|^\/help$|^what can you do\??$/i.test(lowerInput)) {
    return {
      text: "I'm your AI Assistant. I can help with organization processes, answer questions, provide information, and assist with various topics. I can also share images and links when relevant. Feel free to ask me anything!",
      category: 'help',
      confidence: 1.0
    };
  }
  
  // Clear or reset command
  if (/^clear$|^\/clear$|^reset$|^\/reset$/i.test(lowerInput)) {
    return {
      text: "I've cleared our conversation. How can I help you now?",
      category: 'system',
      confidence: 1.0,
      systemAction: 'clear'
    };
  }
  
  // Version or about command
  if (/^version$|^\/version$|^about$|^\/about$/i.test(lowerInput)) {
    return {
      text: "Enhanced AI Chatbox v2.0 - An advanced conversational assistant with improved image handling, link processing, and response accuracy.",
      category: 'system',
      confidence: 1.0
    };
  }
  
  return null;
};

/**
 * Enhances a response with contextual awareness
 * Modified to include matched keywords and data
 * @param {Object} response - The base response object
 * @param {Object} context - The conversation context
 * @returns {Object} - Enhanced response with contextual elements
 */
export const enhanceResponseWithContext = (response, context) => {
  if (!response || !context) return response || { 
    text: "I'm not sure how to respond to that.",
    confidence: 0.5,
    category: 'default'
  };
  
  let enhancedText = response.text || "I'm not sure how to respond to that.";
  
  // Add follow-up suggestions based on context
  if (context.isInquisitive && response.confidence < 0.8) {
    enhancedText += "\n\nWould you like more specific information about this topic?";
  }
  
  // Add contextual awareness phrases
  if (context.sentiment === 'negative' && response.confidence < 0.7) {
    enhancedText += "\n\nIf this doesn't address your concern, please let me know how I can better assist you.";
  }
  
  // Add related information based on matched keywords
  // if (response.matchedKeywords && response.matchedKeywords.length > 1) {
  //   // Get related keywords from other matches
  //   const relatedKeywords = response.matchedKeywords
  //     .slice(1, 3) // Take the next 2 best matches
  //     .map(match => match.keyword);
    
  //   if (relatedKeywords.length > 0) {
  //     enhancedText += `\n\nYou might also be interested in: ${relatedKeywords.join(', ')}`;
  //   }
  // }           
  
  // Return enhanced response
  return {
    ...response,
    text: enhancedText
  };
};
