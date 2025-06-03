/**
 * Enhanced Interactivity Utilities
 * 
 * This utility provides micro-interactions and subtle animations to elevate user engagement
 * while preserving the existing UI/UX design.
 */

import { keyframes, css } from 'styled-components';

/**
 * Animation keyframes for various micro-interactions
 */
export const animations = {
  // Typing indicator animation
  typingBounce: keyframes`
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
  `,
  
  // Message fade-in animation
  fadeIn: keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `,
  
  // User message slide-in animation
  slideInRight: keyframes`
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  `,
  
  // Bot message slide-in animation
  slideInLeft: keyframes`
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  `,
  
  // Success checkmark animation
  checkmark: keyframes`
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  `,
  
  // Subtle pulse animation for new content
  pulse: keyframes`
    0% { box-shadow: 0 0 0 0 rgba(45, 55, 72, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(45, 55, 72, 0); }
    100% { box-shadow: 0 0 0 0 rgba(45, 55, 72, 0); }
  `,
  
  // Subtle glow effect for highlighting
  glow: keyframes`
    0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
    100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
  `
};

/**
 * Animation styles for different elements
 */
export const animationStyles = {
  // Message animation based on sender
  message: (isUser) => css`
    animation: ${isUser ? animations.slideInRight : animations.slideInLeft} 0.3s ease-out;
  `,
  
  // Typing indicator animation
  typingIndicator: css`
    .typing-dot {
      animation: ${animations.typingBounce} 1.4s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  `,
  
  // File upload success animation
  uploadSuccess: css`
    .checkmark-path {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: ${animations.checkmark} 0.8s ease-in-out forwards;
    }
  `,
  
  // New message highlight animation
  newMessage: css`
    animation: ${animations.glow} 2s ease-in-out;
  `,
  
  // Button hover effect
  buttonHover: css`
    transition: all 0.2s ease-in-out;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  `,
  
  // Focus indicator for accessibility
  focusIndicator: css`
    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `
};

/**
 * Component to display a typing indicator
 * @returns {JSX.Element} Typing indicator component
 */
export const TypingIndicatorComponent = () => (
  <div className="typing-indicator" css={animationStyles.typingIndicator}>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

/**
 * Component to display a success checkmark animation
 * @returns {JSX.Element} Success checkmark component
 */
export const SuccessCheckmark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" css={animationStyles.uploadSuccess}>
    <circle cx="10" cy="10" r="9" fill="none" stroke="#4ade80" strokeWidth="2" />
    <path 
      className="checkmark-path"
      d="M5 10 L8 13 L15 6" 
      fill="none" 
      stroke="#4ade80" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Utility function to add hover effects to buttons
 * @param {HTMLElement} element - The button element
 */
export const addButtonHoverEffect = (element) => {
  if (!element) return;
  
  element.style.transition = 'all 0.2s ease-in-out';
  
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'translateY(-1px)';
    element.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translateY(0)';
    element.style.boxShadow = 'none';
  });
  
  element.addEventListener('mousedown', () => {
    element.style.transform = 'translateY(0)';
    element.style.boxShadow = 'none';
  });
  
  element.addEventListener('mouseup', () => {
    element.style.transform = 'translateY(-1px)';
    element.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
  });
};

/**
 * Utility function to highlight new messages
 * @param {HTMLElement} element - The message element
 */
export const highlightNewMessage = (element) => {
  if (!element) return;
  
  // Store original box-shadow
  const originalBoxShadow = element.style.boxShadow;
  
  // Add glow animation
  element.style.animation = 'glow 2s ease-in-out';
  
  // Define the keyframes
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
      50% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
      100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove animation after it completes
  setTimeout(() => {
    element.style.animation = '';
    element.style.boxShadow = originalBoxShadow;
    document.head.removeChild(style);
  }, 2000);
};

/**
 * Utility function to show file upload success animation
 * @param {HTMLElement} container - The container element for the animation
 */
export const showUploadSuccessAnimation = (container) => {
  if (!container) return;
  
  // Create success checkmark element
  const checkmark = document.createElement('div');
  checkmark.className = 'upload-success-animation';
  checkmark.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#4ade80" strokeWidth="2" />
      <path 
        class="checkmark-path"
        d="M5 10 L8 13 L15 6" 
        fill="none" 
        stroke="#4ade80" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  `;
  
  // Add styles
  checkmark.style.position = 'absolute';
  checkmark.style.top = '50%';
  checkmark.style.left = '50%';
  checkmark.style.transform = 'translate(-50%, -50%)';
  checkmark.style.zIndex = '10';
  
  // Add animation styles
  const style = document.createElement('style');
  style.innerHTML = `
    .checkmark-path {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: checkmark 0.8s ease-in-out forwards;
    }
    
    @keyframes checkmark {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Add to container
  container.appendChild(checkmark);
  
  // Remove after animation completes
  setTimeout(() => {
    container.removeChild(checkmark);
    document.head.removeChild(style);
  }, 2000);
};

/**
 * Utility function to add smooth scrolling to message container
 * @param {HTMLElement} container - The message container element
 */
export const addSmoothScrolling = (container) => {
  if (!container) return;
  
  container.style.scrollBehavior = 'smooth';
  container.style.WebkitOverflowScrolling = 'touch';
};

/**
 * Utility function to lazy load images
 * @param {HTMLElement} container - The container with images
 */
export const setupLazyLoading = (container) => {
  if (!container) return;
  
  // Find all images in the container
  const images = container.querySelectorAll('img');
  
  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.1
  });
  
  // Observe each image
  images.forEach(img => {
    const src = img.src;
    img.src = '';
    img.setAttribute('data-src', src);
    observer.observe(img);
  });
};

/**
 * Utility function to properly resolve local image paths
 * @param {string} imagePath - The image path to resolve
 * @returns {string} - The resolved image path
 */
export const resolveLocalImagePath = (imagePath) => {
  if (!imagePath) return '';
  
  // Check if it's already a full URL or absolute path
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Check if it's a relative path in the public folder
  if (imagePath.startsWith('./') || !imagePath.startsWith('/')) {
    // For Create React App, public assets are available at the root
    return `/${imagePath.replace('./', '')}`;
  }
  
  return imagePath;
};

/**
 * Utility function to handle image loading errors
 * @param {HTMLImageElement} img - The image element
 * @param {string} fallbackText - Text to display if image fails to load
 */
export const handleImageError = (img, fallbackText = 'Image could not be loaded') => {
  if (!img) return;
  
  img.onerror = () => {
    // Create a placeholder div
    const placeholder = document.createElement('div');
    placeholder.className = 'image-error-placeholder';
    placeholder.textContent = fallbackText;
    
    // Style the placeholder
    placeholder.style.backgroundColor = '#f3f4f6';
    placeholder.style.border = '1px dashed #d1d5db';
    placeholder.style.borderRadius = '0.5rem';
    placeholder.style.padding = '1rem';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.color = '#6b7280';
    placeholder.style.fontSize = '0.875rem';
    placeholder.style.width = '100%';
    placeholder.style.minHeight = '100px';
    
    // Replace the image with the placeholder
    img.parentNode.replaceChild(placeholder, img);
  };
};
