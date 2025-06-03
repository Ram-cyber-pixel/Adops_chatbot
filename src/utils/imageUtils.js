// Utility functions for handling images in the chat

/**
 * Checks if a URL is an image URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is an image URL
 */
export const isImageUrl = (url) => {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
};

/**
 * Extracts image URLs from text
 * @param {string} text - The text to extract image URLs from
 * @returns {Array} - Array of image URLs found in the text
 */
export const extractImageUrls = (text) => {
  const urlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
  const urls = text.match(urlRegex) || [];
  return urls.map((url) => url.startsWith('http://') ? url.replace('http://', 'https://') : url);
};


/**
 * Removes image URLs from text
 * @param {string} text - The text containing image URLs
 * @returns {string} - Text with image URLs removed
 */
export const removeImageUrls = (text) => {
  if (!text) return '';
  
  // Regular expression to match image URLs
  const urlRegex = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|svg))/gi;
  
  return text.replace(urlRegex, '').trim();
};

/**
 * Creates an object URL for a file
 * @param {File} file - The file to create an object URL for
 * @returns {string} - The object URL
 */
export const createObjectURL = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to free up memory
 * @param {string} url - The object URL to revoke
 */
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
