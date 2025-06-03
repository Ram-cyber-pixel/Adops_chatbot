// Enhanced utility functions for handling images in the chat

/**
 * Checks if a URL is an image URL with improved format detection
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is an image URL
 */
export const isImageUrl = (url) => {
  if (!url) return false;
  
  // Check for common image file extensions
  if (/\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif)$/i.test(url)) {
    return true;
  }
  
  // Check for image hosting services and CDNs
  const imageHostingPatterns = [
    /imgur\.com/i,
    /cloudinary\.com/i,
    /unsplash\.com/i,
    /giphy\.com/i,
    /flickr\.com/i,
    /images\.pexels\.com/i,
    /img\.youtube\.com/i,
    /i\.redd\.it/i,
    /media\.tenor\.com/i,
    /\.googleusercontent\.com.*=s\d+/i, // Google Photos pattern
    /fbcdn\.net/i,
    /twimg\.com/i,
    /\.cdninstagram\.com/i,
    /instagram\.com/i,
    /time-zones-map\.com/i,
    /comcastcorp-my\.sharepoint\.com(\/.*|\?.*)?/i,
    /drive\.usercontent\.google\.com(\/.*|\?.*)?/i,
  ];
  
  const matchedPattern = imageHostingPatterns.find(pattern => pattern.test(url));
  console.log("Matched pattern:", matchedPattern, "for URL:", url);
  
  return !!matchedPattern;
};

/**
 * Extracts image URLs from text with improved detection
 * @param {string} text - The text to extract image URLs from
 * @returns {Array} - Array of image URLs found in the text
 */
export const extractImageUrls = (text) => {
  if (!text) return [];
  
  // Match URLs that end with image extensions
  const fileExtensionRegex = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif))/gi;
  
  // Match URLs from common image hosting services
  const imageHostingRegex = /(https?:\/\/(?:[^\s]+\.)?(?:imgur\.com|cloudinary\.com|unsplash\.com|giphy\.com|flickr\.com|pexels\.com|i\.redd\.it|media\.tenor\.com|fbcdn\.net|twimg\.com|cdninstagram\.com)[^\s]+)/gi;
  
  // Match Google Photos and similar URLs with query parameters
  const parameterizedImageRegex = /(https?:\/\/[^\s]+\.(googleusercontent\.com|fbcdn\.net)[^\s]*)/gi;
  
  // Combine all matches and remove duplicates
  const fileExtensionMatches = text.match(fileExtensionRegex) || [];
  const imageHostingMatches = text.match(imageHostingRegex) || [];
  const parameterizedMatches = text.match(parameterizedImageRegex) || [];
  
  // Combine all matches
  const allMatches = [...fileExtensionMatches, ...imageHostingMatches, ...parameterizedMatches];
  
  // Remove duplicates and ensure HTTPS
  const uniqueUrls = [...new Set(allMatches)];
  return uniqueUrls.map(url => url.startsWith('http://') ? url.replace('http://', 'https://') : url);
};

/**
 * Removes image URLs from text with improved detection
 * @param {string} text - The text containing image URLs
 * @returns {string} - Text with image URLs removed
 */
export const removeImageUrls = (text) => {
  if (!text) return '';
  
  // Regular expressions to match various image URL patterns
  const patterns = [
    /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif))/gi,
    /(https?:\/\/(?:[^\s]+\.)?(?:imgur\.com|cloudinary\.com|unsplash\.com|giphy\.com|flickr\.com|pexels\.com|i\.redd\.it|media\.tenor\.com)[^\s]+)/gi,
    /(https?:\/\/[^\s]+\.(googleusercontent\.com|fbcdn\.net)[^\s]*)/gi
  ];
  
  // Apply each pattern to remove matching URLs
  let cleanedText = text;
  patterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '');
  });
  
  // Remove any double spaces and trim
  return cleanedText.replace(/\s+/g, ' ').trim();
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

/**
 * Validates an image URL by attempting to load it
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - Promise resolving to true if the URL is a valid image
 */
export const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Set a timeout to prevent hanging on slow connections
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * Extracts links from text that are not image URLs
 * @param {string} text - The text to extract links from
 * @returns {Array} - Array of non-image links found in the text
 */
export const extractLinks = (text) => {
  if (!text) return [];
  
  // Match URLs that don't end with image extensions
  const urlRegex = /(https?:\/\/[^\s]+)(?!\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif))/gi;
  
  const urls = text.match(urlRegex) || [];
  const imageUrls = extractImageUrls(text);
  
  // Filter out any URLs that were also matched as image URLs
  return urls.filter(url => !imageUrls.includes(url));
};

/**
 * Formats a link for display in the chat
 * @param {string} url - The URL to format
 * @returns {string} - Formatted link with appropriate text
 */
export const formatLink = (url) => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Format based on common domains
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return `YouTube Video: ${url}`;
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return `Twitter Post: ${url}`;
    } else if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return `Facebook Link: ${url}`;
    } else if (hostname.includes('instagram.com')) {
      return `Instagram Post: ${url}`;
    } else if (hostname.includes('linkedin.com')) {
      return `LinkedIn Post: ${url}`;
    } else if (hostname.includes('github.com')) {
      return `GitHub Repository: ${url}`;
    } else {
      // Generic formatting
      return `Link: ${url}`;
    }
  } catch (e) {
    // If URL parsing fails, return the original URL
    return `Link: ${url}`;
  }
};

/**
 * Enhances text by converting image URLs to markdown image syntax
 * @param {string} text - The text to enhance
 * @param {Array} imageUrls - Array of image URLs to add to the text
 * @returns {string} - Enhanced text with markdown image syntax
 */
export const enhanceTextWithImages = (text, imageUrls) => {
  if (!text) return '';
  if (!imageUrls || imageUrls.length === 0) return text;
  
  let enhancedText = text;
  
  // Add images at the end of the text
  imageUrls.forEach(url => {
    enhancedText += `\n\n![Image](${url})`;
  });
  
  return enhancedText;
};

/**
 * Gets image dimensions from a URL
 * @param {string} url - The image URL
 * @returns {Promise<{width: number, height: number}>} - Promise resolving to image dimensions
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
    
    // Set a timeout to prevent hanging on slow connections
    setTimeout(() => reject(new Error('Timeout loading image')), 5000);
  });
};

/**
 * Detects if a string is a local image path
 * @param {string} path - The path to check
 * @returns {boolean} - True if the path appears to be a local image
 */
export const isLocalImagePath = (path) => {
  if (!path || typeof path !== 'string') return false;
  
  // Check if it's not a URL (doesn't start with http)
  if (path.startsWith('http')) return false;
  
  // Check if it has an image extension
  return /\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif)$/i.test(path);
};

/**
 * Constructs a proper path for local images
 * @param {string} imageName - The image name or relative path
 * @returns {string} - The properly constructed path for the image
 */
export const getLocalImagePath = (imageName) => {
  if (!imageName) {
    const placeholderPath = `${process.env.PUBLIC_URL}/assets/images/placeholder.png`;
    console.log('Generated Path:', placeholderPath);
    return placeholderPath;
  }
  // Clean up the path if needed
  const cleanName = imageName.replace(/^\/+/, '');
  
  // If it already includes 'images/' in the path, don't add it again
  if (cleanName.startsWith('assets/images/')) {
    const fullPath = `${process.env.PUBLIC_URL}/${cleanName}`;
    console.log('Generated Path:', fullPath);
    return fullPath;
  }
  
  const defaultPath = `${process.env.PUBLIC_URL}/assets/images/${cleanName}`;
  console.log('Generated Path:', defaultPath);
  return defaultPath;
};
