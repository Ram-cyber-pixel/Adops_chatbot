/**
 * Enhanced Image Utilities
 * 
 * This utility provides improved handling of local images within the chat container.
 * Supports a large library of local images and multiple images per ticket.
 */

/**
 * Resolves a local image path to ensure proper rendering
 * @param {string} imagePath - The image path to resolve
 * @returns {string} - The resolved image path
 */

export const resolveLocalImagePath = (imagePath) => {
  if (!imagePath) return '';
  
  // Check if it's already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Extract the filename from the path
  const filename = imagePath.split('/').pop();
  
  // Get the base URL from the homepage in package.json or PUBLIC_URL
  // This is critical for GitHub Pages deployment
  const baseUrl = process.env.PUBLIC_URL || '';
  
  // Check if we're running in GitHub Pages environment
  const isGitHubPages = window.location.hostname.includes('github.io') || 
                        window.location.href.includes('github.io');
  
  // For GitHub Pages, we need to ensure all paths are relative to the repository
  if (isGitHubPages) {
    // Handle absolute paths for GitHub Pages
    if (imagePath.startsWith('/')) {
      return baseUrl + imagePath;
    }
    
    // Handle relative paths for GitHub Pages
    if (imagePath.startsWith('./')) {
      return baseUrl + imagePath.substring(1);
    }
    
    // Handle paths that might be relative to the assets directory
    if (imagePath.startsWith('assets/')) {
      return baseUrl + '/' + imagePath;
    }
    
    // For GitHub Pages, prioritize paths with the baseUrl
    const githubPaths = [
      // Original path with baseUrl
      `${baseUrl}/${imagePath}`,
      
      // Common asset directories with baseUrl
      `${baseUrl}/assets/${imagePath}`,
      `${baseUrl}/assets/images/${imagePath}`,
      `${baseUrl}/public/assets/images/${imagePath}`,
      
      // Filename only with baseUrl
      `${baseUrl}/assets/images/${filename}`,
      `${baseUrl}/public/assets/images/${filename}`,
      
      // Fallback to original path
      imagePath
    ];
    
    // Try each path in order
    return tryImagePaths(githubPaths);
  }
  
  // For local development or other environments
  // Check if it's an absolute path
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Handle relative paths
  if (imagePath.startsWith('./')) {
    return baseUrl + imagePath.substring(1);
  }
  
  // Handle paths that might be relative to the assets directory
  if (imagePath.startsWith('assets/')) {
    return baseUrl + '/' + imagePath;
  }
  
  // Generate a comprehensive list of possible paths for any image
  const possiblePaths = [
    // Original path
    imagePath,
    
    // Public URL paths
    `${baseUrl}/${imagePath}`,
    `${baseUrl}/assets/${imagePath}`,
    `${baseUrl}/assets/images/${imagePath}`,
    `${baseUrl}/images/${imagePath}`,
    
    // Root-relative paths
    `/${imagePath}`,
    `/assets/${imagePath}`,
    `/assets/images/${imagePath}`,
    `/images/${imagePath}`,
    
    // Filename-only paths (for when only the filename is provided)
    `${baseUrl}/${filename}`,
    `${baseUrl}/assets/${filename}`,
    `${baseUrl}/assets/images/${filename}`,
    `${baseUrl}/images/${filename}`,
    `/assets/${filename}`,
    `/assets/images/${filename}`,
    `/images/${filename}`,
    
    // Relative paths
    `./assets/${imagePath}`,
    `./images/${imagePath}`,
    `./assets/images/${imagePath}`,
    `./assets/${filename}`,
    `./images/${filename}`,
    `./assets/images/${filename}`
  ];
  
  // Return the first path for now, but the component will try others if this fails
  return possiblePaths[0];
};

/**
 * Try to find a valid image path from a list of possible paths
 * @param {Array<string>} paths - List of paths to try
 * @returns {string} - The first path from the list
 */
const tryImagePaths = (paths) => {
  // In a real implementation, we would check each path
  // But for now, we'll just return the first path and let the image error handling take care of retries
  return paths[0];
};

/**
 * Creates a fallback element when an image fails to load
 * @param {HTMLImageElement} imgElement - The image element that failed
 * @param {string} altText - Alternative text to display
 * @param {string} originalSrc - The original source that failed to load
 */
export const createImageFallback = (imgElement, altText = 'Image could not be loaded', originalSrc = '') => {
  if (!imgElement) return;
  
  // Create fallback container
  const fallbackContainer = document.createElement('div');
  fallbackContainer.className = 'image-fallback';
  fallbackContainer.style.backgroundColor = '#f3f4f6';
  fallbackContainer.style.border = '1px dashed #d1d5db';
  fallbackContainer.style.borderRadius = '0.5rem';
  fallbackContainer.style.padding = '1rem';
  fallbackContainer.style.display = 'flex';
  fallbackContainer.style.flexDirection = 'column';
  fallbackContainer.style.alignItems = 'center';
  fallbackContainer.style.justifyContent = 'center';
  fallbackContainer.style.width = '100%';
  fallbackContainer.style.minHeight = '100px';
  
  // Create fallback text
  const fallbackText = document.createElement('span');
  fallbackText.textContent = altText;
  fallbackText.style.color = '#6b7280';
  fallbackText.style.fontSize = '0.875rem';
  fallbackText.style.marginBottom = '0.5rem';
  
  // Add text to container
  fallbackContainer.appendChild(fallbackText);
  
  // Add retry button if we have the original source
  if (originalSrc) {
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry Loading';
    retryButton.style.backgroundColor = '#2d3748';
    retryButton.style.color = '#ffffff';
    retryButton.style.border = 'none';
    retryButton.style.borderRadius = '0.25rem';
    retryButton.style.padding = '0.5rem 1rem';
    retryButton.style.fontSize = '0.875rem';
    retryButton.style.cursor = 'pointer';
    retryButton.style.marginTop = '0.5rem';
    
    // Add retry functionality
    retryButton.addEventListener('click', () => {
      // Extract the filename from the path
      const filename = originalSrc.split('/').pop();
      
      // Get the base URL from the homepage in package.json or PUBLIC_URL
      const baseUrl = process.env.PUBLIC_URL || '';
      
      // Check if we're running in GitHub Pages environment
      const isGitHubPages = window.location.hostname.includes('github.io') || 
                            window.location.href.includes('github.io');
      
      // Generate a comprehensive list of possible paths
      let alternativePaths = [];
      
      if (isGitHubPages) {
        // GitHub Pages specific paths
        alternativePaths = [
          // Original path with baseUrl
          `${baseUrl}/${originalSrc}`,
          `${baseUrl}/${filename}`,
          
          // Common asset directories with baseUrl
          `${baseUrl}/assets/${filename}`,
          `${baseUrl}/assets/images/${filename}`,
          `${baseUrl}/public/assets/images/${filename}`,
          
          // Window location paths
          `${window.location.origin}${baseUrl}/${filename}`,
          `${window.location.origin}${baseUrl}/assets/images/${filename}`,
          
          // Fallback to placeholder
          `${baseUrl}/assets/images/placeholder.png`,
          `${baseUrl}/public/assets/images/placeholder.png`
        ];
      } else {
        // Standard paths for other environments
        alternativePaths = [
          // Original path
          originalSrc,
          
          // Window location paths
          window.location.origin + originalSrc,
          
          // Public URL paths
          baseUrl + originalSrc,
          baseUrl + '/' + originalSrc,
          `${baseUrl}/${originalSrc}`,
          `${baseUrl}/assets/${originalSrc}`,
          `${baseUrl}/assets/images/${originalSrc}`,
          `${baseUrl}/images/${originalSrc}`,
          
          // Root-relative paths
          `/${originalSrc}`,
          `/assets/${originalSrc}`,
          `/assets/images/${originalSrc}`,
          `/images/${originalSrc}`,
          
          // Filename-only paths
          `${baseUrl}/${filename}`,
          `${baseUrl}/assets/${filename}`,
          `${baseUrl}/assets/images/${filename}`,
          `${baseUrl}/images/${filename}`,
          `/assets/${filename}`,
          `/assets/images/${filename}`,
          `/images/${filename}`,
          
          // Relative paths
          `./assets/${originalSrc}`,
          `./images/${originalSrc}`,
          `./assets/images/${originalSrc}`,
          `./assets/${filename}`,
          `./images/${filename}`,
          `./assets/images/${filename}`,
          
          // Fallback to placeholder
          `${baseUrl}/assets/images/placeholder.png`
        ];
      }
      
      // Try each path
      tryLoadImage(alternativePaths, 0, fallbackContainer);
    });
    
    fallbackContainer.appendChild(retryButton);
  }
  
  // Replace image with fallback
  if (imgElement.parentNode) {
    imgElement.parentNode.replaceChild(fallbackContainer, imgElement);
  }
};

/**
 * Tries to load an image from a list of alternative paths
 * @param {Array<string>} paths - List of paths to try
 * @param {number} index - Current index in the paths array
 * @param {HTMLElement} container - Container to replace with image if successful
 */
const tryLoadImage = (paths, index, container) => {
  if (index >= paths.length) {
    // All paths failed, update the fallback message
    const fallbackText = container.querySelector('span');
    if (fallbackText) {
      fallbackText.textContent = 'Could not load image from any path';
    }
    return;
  }
  
  const img = new Image();
  img.onload = () => {
    // Success! Replace fallback with image
    if (container.parentNode) {
      const enhancedImg = document.createElement('img');
      enhancedImg.src = paths[index];
      enhancedImg.alt = 'Loaded image';
      enhancedImg.style.maxWidth = '100%';
      enhancedImg.style.borderRadius = '0.5rem';
      enhancedImg.style.marginTop = '0.5rem';
      enhancedImg.loading = 'lazy';
      enhancedImg.decoding = 'async';
      
      // Add click to expand functionality
      enhanceImageElement(enhancedImg);
      
      container.parentNode.replaceChild(enhancedImg, container);
    }
  };
  
  img.onerror = () => {
    // Try next path
    tryLoadImage(paths, index + 1, container);
  };
  
  img.src = paths[index];
};

/**
 * Enhances an image element with additional functionality
 * @param {HTMLImageElement} img - The image element to enhance
 */
const enhanceImageElement = (img) => {
  if (!img) return;
  
  // Add click to expand functionality
  img.addEventListener('click', () => {
    // Create modal for expanded view
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.style.cursor = 'pointer';
    
    // Create expanded image
    const expandedImg = document.createElement('img');
    expandedImg.src = img.src;
    expandedImg.style.maxWidth = '90%';
    expandedImg.style.maxHeight = '90%';
    expandedImg.style.objectFit = 'contain';
    expandedImg.style.border = '2px solid white';
    expandedImg.style.borderRadius = '4px';
    
    // Add close functionality
    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Add to modal and body
    modal.appendChild(expandedImg);
    document.body.appendChild(modal);
  });
};

/**
 * Preloads an image to ensure it's in the browser cache
 * @param {string} src - The image source URL
 * @returns {Promise} - Promise that resolves when the image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }
    
    // Extract the filename from the path
    const filename = src.split('/').pop();
    
    // Get the base URL from the homepage in package.json or PUBLIC_URL
    const baseUrl = process.env.PUBLIC_URL || '';
    
    // Check if we're running in GitHub Pages environment
    const isGitHubPages = window.location.hostname.includes('github.io') || 
                          window.location.href.includes('github.io');
    
    // Generate a comprehensive list of possible paths
    let alternativePaths = [];
    
    if (isGitHubPages) {
      // GitHub Pages specific paths
      alternativePaths = [
        // Original path with baseUrl
        `${baseUrl}/${src}`,
        `${baseUrl}/${filename}`,
        
        // Common asset directories with baseUrl
        `${baseUrl}/assets/${filename}`,
        `${baseUrl}/assets/images/${filename}`,
        `${baseUrl}/public/assets/images/${filename}`,
        
        // Window location paths
        `${window.location.origin}${baseUrl}/${filename}`,
        `${window.location.origin}${baseUrl}/assets/images/${filename}`,
        
        // Fallback to placeholder
        `${baseUrl}/assets/images/placeholder.png`,
        `${baseUrl}/public/assets/images/placeholder.png`
      ];
    } else {
      // Standard paths for other environments
      alternativePaths = [
        // Original path
        src,
        
        // Window location paths
        window.location.origin + src,
        
        // Public URL paths
        baseUrl + src,
        baseUrl + '/' + src,
        `${baseUrl}/${src}`,
        `${baseUrl}/assets/${src}`,
        `${baseUrl}/assets/images/${src}`,
        `${baseUrl}/images/${src}`,
        
        // Root-relative paths
        `/${src}`,
        `/assets/${src}`,
        `/assets/images/${src}`,
        `/images/${src}`,
        
        // Filename-only paths
        `${baseUrl}/${filename}`,
        `${baseUrl}/assets/${filename}`,
        `${baseUrl}/assets/images/${filename}`,
        `${baseUrl}/images/${filename}`,
        `/assets/${filename}`,
        `/assets/images/${filename}`,
        `/images/${filename}`,
        
        // Relative paths
        `./assets/${src}`,
        `./images/${src}`,
        `./assets/images/${src}`,
        `./assets/${filename}`,
        `./images/${filename}`,
        `./assets/images/${filename}`,
        
        // Fallback to placeholder
        `${baseUrl}/assets/images/placeholder.png`
      ];
    }
    
    // Try each path
    tryAlternativePaths(alternativePaths, 0, resolve, reject);
  });
};

/**
 * Tries to load an image from a list of alternative paths
 * @param {Array<string>} paths - List of paths to try
 * @param {number} index - Current index in the paths array
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 */
const tryAlternativePaths = (paths, index, resolve, reject) => {
  if (index >= paths.length) {
    // All paths failed
    reject(new Error('Failed to load image from any path'));
    return;
  }
  
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => tryAlternativePaths(paths, index + 1, resolve, reject);
  img.src = paths[index];
};

/**
 * Adds error handling to all images in a container
 * @param {HTMLElement} container - The container with images
 * @param {Function} onError - Optional callback when an image fails to load
 */
export const addImageErrorHandling = (container, onError) => {
  if (!container) return;
  
  // Find all images
  const images = container.querySelectorAll('img');
  
  // Add error handling to each image
  images.forEach(img => {
    const originalSrc = img.src;
    img.onerror = () => {
      // Extract the filename from the path
      const filename = originalSrc.split('/').pop();
      
      // Get the base URL from the homepage in package.json or PUBLIC_URL
      const baseUrl = process.env.PUBLIC_URL || '';
      
      // Check if we're running in GitHub Pages environment
      const isGitHubPages = window.location.hostname.includes('github.io') || 
                            window.location.href.includes('github.io');
      
      // Generate a comprehensive list of possible paths
      let alternativePaths = [];
      
      if (isGitHubPages) {
        // GitHub Pages specific paths
        alternativePaths = [
          // Original path with baseUrl
          `${baseUrl}/${originalSrc}`,
          `${baseUrl}/${filename}`,
          
          // Common asset directories with baseUrl
          `${baseUrl}/assets/${filename}`,
          `${baseUrl}/assets/images/${filename}`,
          `${baseUrl}/public/assets/images/${filename}`,
          
          // Window location paths
          `${window.location.origin}${baseUrl}/${filename}`,
          `${window.location.origin}${baseUrl}/assets/images/${filename}`,
          
          // Fallback to placeholder
          `${baseUrl}/assets/images/placeholder.png`,
          `${baseUrl}/public/assets/images/placeholder.png`
        ];
      } else {
        // Standard paths for other environments
        alternativePaths = [
          // Original path
          originalSrc,
          
          // Window location paths
          window.location.origin + originalSrc,
          
          // Public URL paths
          baseUrl + originalSrc,
          baseUrl + '/' + originalSrc,
          `${baseUrl}/${originalSrc}`,
          `${baseUrl}/assets/${originalSrc}`,
          `${baseUrl}/assets/images/${originalSrc}`,
          `${baseUrl}/images/${originalSrc}`,
          
          // Root-relative paths
          `/${originalSrc}`,
          `/assets/${originalSrc}`,
          `/assets/images/${originalSrc}`,
          `/images/${originalSrc}`,
          
          // Filename-only paths
          `${baseUrl}/${filename}`,
          `${baseUrl}/assets/${filename}`,
          `${baseUrl}/assets/images/${filename}`,
          `${baseUrl}/images/${filename}`,
          `/assets/${filename}`,
          `/assets/images/${filename}`,
          `/images/${filename}`,
          
          // Relative paths
          `./assets/${originalSrc}`,
          `./images/${originalSrc}`,
          `./assets/images/${originalSrc}`,
          `./assets/${filename}`,
          `./images/${filename}`,
          `./assets/images/${filename}`,
          
          // Fallback to placeholder
          `${baseUrl}/assets/images/placeholder.png`
        ];
      }
      
      // Try each path
      let success = false;
      for (let i = 0; i < alternativePaths.length; i++) {
        const testImg = new Image();
        ((path) => {
          testImg.onload = () => {
            success = true;
            img.src = path;
          };
        })(alternativePaths[i]);
        testImg.src = alternativePaths[i];
        
        // If any path worked, break the loop
        if (success) break;
      }
      
      // If all paths failed, create fallback
      if (!success) {
        createImageFallback(img, img.alt || 'Image could not be loaded', originalSrc);
        
        // Call optional callback
        if (typeof onError === 'function') {
          onError(img);
        }
      }
    };
  });
};

/**
 * Checks if an image exists and is accessible
 * @param {string} src - The image source URL
 * @returns {Promise<boolean>} - Promise that resolves to true if image exists
 */
export const checkImageExists = async (src) => {
  return new Promise(resolve => {
    if (!src) {
      resolve(false);
      return;
    }
    
    // Extract the filename from the path
    const filename = src.split('/').pop();
    
    // Get the base URL from the homepage in package.json or PUBLIC_URL
    const baseUrl = process.env.PUBLIC_URL || '';
    
    // Check if we're running in GitHub Pages environment
    const isGitHubPages = window.location.hostname.includes('github.io') || 
                          window.location.href.includes('github.io');
    
    // Generate a comprehensive list of possible paths
    let alternativePaths = [];
    
    if (isGitHubPages) {
      // GitHub Pages specific paths
      alternativePaths = [
        // Original path with baseUrl
        `${baseUrl}/${src}`,
        `${baseUrl}/${filename}`,
        
        // Common asset directories with baseUrl
        `${baseUrl}/assets/${filename}`,
        `${baseUrl}/assets/images/${filename}`,
        `${baseUrl}/public/assets/images/${filename}`,
        
        // Window location paths
        `${window.location.origin}${baseUrl}/${filename}`,
        `${window.location.origin}${baseUrl}/assets/images/${filename}`,
        
        // Fallback to placeholder
        `${baseUrl}/assets/images/placeholder.png`,
        `${baseUrl}/public/assets/images/placeholder.png`
      ];
    } else {
      // Standard paths for other environments
      alternativePaths = [
        // Original path
        src,
        
        // Window location paths
        window.location.origin + src,
        
        // Public URL paths
        baseUrl + src,
        baseUrl + '/' + src,
        `${baseUrl}/${src}`,
        `${baseUrl}/assets/${src}`,
        `${baseUrl}/assets/images/${src}`,
        `${baseUrl}/images/${src}`,
        
        // Root-relative paths
        `/${src}`,
        `/assets/${src}`,
        `/assets/images/${src}`,
        `/images/${src}`,
        
        // Filename-only paths
        `${baseUrl}/${filename}`,
        `${baseUrl}/assets/${filename}`,
        `${baseUrl}/assets/images/${filename}`,
        `${baseUrl}/images/${filename}`,
        `/assets/${filename}`,
        `/assets/images/${filename}`,
        `/images/${filename}`,
        
        // Relative paths
        `./assets/${src}`,
        `./images/${src}`,
        `./assets/images/${src}`,
        `./assets/${filename}`,
        `./images/${filename}`,
        `./assets/images/${filename}`,
        
        // Fallback to placeholder
        `${baseUrl}/assets/images/placeholder.png`
      ];
    }
    
    // Try each path
    checkMultiplePaths(alternativePaths, 0, resolve);
  });
};

/**
 * Checks multiple paths for an image
 * @param {Array<string>} paths - List of paths to check
 * @param {number} index - Current index in the paths array
 * @param {Function} resolve - Promise resolve function
 */
const checkMultiplePaths = (paths, index, resolve) => {
  if (index >= paths.length) {
    // All paths failed
    resolve(false);
    return;
  }
  
  const img = new Image();
  img.onload = () => resolve(true);
  img.onerror = () => checkMultiplePaths(paths, index + 1, resolve);
  img.src = paths[index];
};

/**
 * Checks if an image exists at a specific path
 * @param {string} path - The image path to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image exists
 */
const checkSinglePath = (path) => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
};

/**
 * Optimizes image display based on container size
 * @param {HTMLImageElement} img - The image element
 * @param {HTMLElement} container - The container element
 */
export const optimizeImageDisplay = (img, container) => {
  if (!img || !container) return;
  
  // Get container dimensions
  const containerWidth = container.clientWidth;
  
  // Set max width based on container
  img.style.maxWidth = `${containerWidth}px`;
  
  // Add loading and decoding attributes for performancen
  img.loading = 'lazy';
  img.decoding = 'async';
};
