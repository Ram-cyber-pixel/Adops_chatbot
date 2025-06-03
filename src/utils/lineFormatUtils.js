/**
 * Utility function to format responses in a line-by-line style
 * @param {string} text - The text to format
 * @returns {string} - Formatted text with line breaks
 */
export const formatLineByLine = (text) => {
  if (!text) return '';
  
  // If text already has line breaks, preserve them
  if (text.includes('\n')) return text;
  
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Join sentences with line breaks
  return sentences.map(sentence => sentence.trim()).join('\n');
};

/**
 * Formats a response object to use line-by-line style
 * @param {Object} response - Response object
 * @returns {Object} - Formatted response object
 */
export const formatResponseLineByLine = (response) => {
  if (!response) return response;
  
  // Create a new response object to avoid modifying the original
  const formattedResponse = { ...response };
  
  // Format the main text if it exists
  if (formattedResponse.text) {
    formattedResponse.text = formatLineByLine(formattedResponse.text);
  }
  
  return formattedResponse;
};
