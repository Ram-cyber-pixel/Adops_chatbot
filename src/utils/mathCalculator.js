import * as math from 'mathjs';

/**
 * Enhanced math calculation utilities
 * This module provides functions for parsing and evaluating mathematical expressions
 */

/**
 * Checks if the input is a mathematical expression
 * @param {string} input - User input to check
 * @returns {boolean} - True if input appears to be a math expression
 */
export const isMathExpression = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  // Remove spaces for easier pattern matching
  const cleanInput = input.trim().replace(/\s+/g, '');
  
  // Check for basic arithmetic patterns
  const basicMathPattern = /^[\d.]+[\+\-\*\/\^][\d.]+$/;
  if (basicMathPattern.test(cleanInput)) return true;
  
  // Check for more complex expressions with parentheses
  const complexMathPattern = /[\d.]+[\+\-\*\/\^][\d.]+|[\(\)]/;
  if (complexMathPattern.test(cleanInput)) {
    // Try to evaluate with mathjs to confirm it's a valid expression
    try {
      math.evaluate(cleanInput);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Check for common math keywords
  const mathKeywords = ['calculate', 'compute', 'solve', 'evaluate', 'what is', 'result of'];
  return mathKeywords.some(keyword => input.toLowerCase().includes(keyword));
};

/**
 * Extracts a mathematical expression from text
 * @param {string} text - Text that may contain a math expression
 * @returns {string|null} - Extracted math expression or null if none found
 */
export const extractMathExpression = (text) => {
  if (!text || typeof text !== 'string') return null;
  
  // Remove common math question prefixes
  const cleanedText = text.replace(/^(calculate|compute|solve|evaluate|what is|result of|math:|=)/i, '').trim();
  
  // Try to extract expression using regex
  const expressionMatch = cleanedText.match(/[\d\s\+\-\*\/\^\(\)\.]+/);
  if (expressionMatch) {
    return expressionMatch[0].trim();
  }
  
  return cleanedText;
};

/**
 * Evaluates a mathematical expression
 * @param {string} expression - Mathematical expression to evaluate
 * @returns {Object} - Result object with value and formatted expression
 */
export const evaluateMathExpression = (expression) => {
  if (!expression || typeof expression !== 'string') {
    return {
      success: false,
      error: 'Invalid expression',
      result: null,
      formattedExpression: null
    };
  }
  
  try {
    // Clean the expression
    const cleanedExpression = expression.trim();
    
    // Evaluate using mathjs
    const result = math.evaluate(cleanedExpression);
    
    // Format the result
    let formattedResult;
    if (typeof result === 'number') {
      // Format number to appropriate precision
      formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    } else {
      formattedResult = result.toString();
    }
    
    return {
      success: true,
      result: formattedResult,
      formattedExpression: cleanedExpression,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: `Error evaluating expression: ${error.message}`,
      result: null,
      formattedExpression: expression
    };
  }
};

/**
 * Processes a user input that might contain a math expression
 * @param {string} userInput - User input text
 * @returns {Object} - Result object with processed information
 */
export const processMathInput = (userInput) => {
  // Check if input is a math expression
  if (!isMathExpression(userInput)) {
    return {
      isMathExpression: false,
      result: null,
      formattedResponse: null
    };
  }
  
  // Extract the math expression
  const extractedExpression = extractMathExpression(userInput);
  
  // Evaluate the expression
  const evaluation = evaluateMathExpression(extractedExpression);
  
  if (!evaluation.success) {
    return {
      isMathExpression: true,
      result: null,
      formattedResponse: `I couldn't calculate that. ${evaluation.error}`
    };
  }
  
  // Format a nice response
  const formattedResponse = `${evaluation.formattedExpression} = ${evaluation.result}`;
  
  return {
    isMathExpression: true,
    result: evaluation.result,
    formattedResponse
  };
};
