/**
 * Enhanced Accessibility Utilities
 * 
 * This utility provides accessibility improvements to make the chatbox accessible
 * to all users, including those using assistive technologies.
 */

/**
 * Adds ARIA roles and labels to chat elements
 * @param {HTMLElement} container - The chat container element
 */
export const addAriaAttributes = (container) => {
  if (!container) return;
  
  // Set main container role
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Chat conversation');
  
  // Set chat messages container
  const messagesContainer = container.querySelector('.messages-container');
  if (messagesContainer) {
    messagesContainer.setAttribute('role', 'log');
    messagesContainer.setAttribute('aria-live', 'polite');
    messagesContainer.setAttribute('aria-relevant', 'additions');
  }
  
  // Set input form
  const inputForm = container.querySelector('form');
  if (inputForm) {
    inputForm.setAttribute('role', 'form');
    inputForm.setAttribute('aria-label', 'Chat message form');
  }
  
  // Set input field
  const inputField = container.querySelector('input[type="text"], textarea');
  if (inputField) {
    inputField.setAttribute('aria-label', 'Type your message');
    inputField.setAttribute('role', 'textbox');
  }
  
  // Set send button
  const sendButton = container.querySelector('button[type="submit"]');
  if (sendButton) {
    sendButton.setAttribute('aria-label', 'Send message');
  }
  
  // Set attach button
  const attachButton = container.querySelector('.attach-button');
  if (attachButton) {
    attachButton.setAttribute('aria-label', 'Attach file');
  }
  
  // Set pre-made questions
  const preMadeQuestions = container.querySelectorAll('.pre-made-question');
  preMadeQuestions.forEach((question, index) => {
    question.setAttribute('role', 'button');
    question.setAttribute('aria-label', `Suggested question: ${question.textContent}`);
  });
};

/**
 * Adds keyboard navigation to chat elements
 * @param {HTMLElement} container - The chat container element
 */
export const addKeyboardNavigation = (container) => {
  if (!container) return;
  
  // Find all interactive elements
  const interactiveElements = container.querySelectorAll('button, a, input, textarea, [role="button"]');
  
  // Add tabindex if missing
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
  
  // Add keyboard event listeners for elements with role="button"
  const buttonElements = container.querySelectorAll('[role="button"]');
  buttonElements.forEach(button => {
    button.addEventListener('keydown', (event) => {
      // Trigger click on Enter or Space
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    });
  });
};

/**
 * Adds visible focus indicators to interactive elements
 * @param {HTMLElement} container - The chat container element
 */
export const addVisibleFocusIndicators = () => {
  // Add global CSS for focus indicators
  const style = document.createElement('style');
  style.innerHTML = `
    :focus-visible {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Adds screen reader announcements for dynamic content
 * @param {string} message - The message to announce
 * @param {string} priority - The announcement priority (polite or assertive)
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  // Create or get the announcement element
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('role', 'status');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }
  
  // Set the priority
  announcer.setAttribute('aria-live', priority);
  
  // Clear the announcer (necessary for repeated announcements)
  announcer.textContent = '';
  
  // Set the announcement text after a brief delay
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
};

/**
 * Adds alternative text to images
 * @param {HTMLElement} container - The container with images
 */
export const addImageAltText = (container) => {
  if (!container) return;
  
  // Find all images without alt text
  const images = container.querySelectorAll('img:not([alt])');
  
  images.forEach(img => {
    // Try to generate alt text from context
    let altText = 'Image';
    
    // Check for parent element with text content
    const parent = img.parentElement;
    if (parent && parent.textContent.trim()) {
      const parentText = parent.textContent.trim();
      if (parentText.length < 100) {
        altText = `Image related to: ${parentText}`;
      }
    }
    
    // Check for filename hints
    const src = img.src;
    if (src) {
      const filename = src.split('/').pop().split('?')[0];
      const nameWithoutExtension = filename.split('.')[0];
      
      // Convert camelCase or snake_case to spaces
      const readableName = nameWithoutExtension
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .trim();
      
      if (readableName) {
        altText = readableName;
      }
    }
    
    // Set the alt text
    img.setAttribute('alt', altText);
  });
};

/**
 * Adds high contrast mode support
 * @param {boolean} enabled - Whether high contrast mode is enabled
 */
export const setHighContrastMode = (enabled) => {
  // Remove existing high contrast styles
  const existingStyle = document.getElementById('high-contrast-styles');
  if (existingStyle) {
    document.head.removeChild(existingStyle);
  }
  
  if (enabled) {
    // Add high contrast styles
    const style = document.createElement('style');
    style.id = 'high-contrast-styles';
    style.innerHTML = `
      body {
        --high-contrast-bg: #000000;
        --high-contrast-text: #ffffff;
        --high-contrast-border: #ffffff;
        --high-contrast-focus: #ffff00;
        --high-contrast-button: #1a1aff;
        --high-contrast-button-text: #ffffff;
      }
      
      .chat-container {
        background-color: var(--high-contrast-bg) !important;
        color: var(--high-contrast-text) !important;
        border-color: var(--high-contrast-border) !important;
      }
      
      .message-bubble {
        border: 1px solid var(--high-contrast-border) !important;
      }
      
      .user-message {
        background-color: #1a1aff !important;
        color: #ffffff !important;
      }
      
      .bot-message {
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 1px solid #ffffff !important;
      }
      
      button, .button {
        background-color: var(--high-contrast-button) !important;
        color: var(--high-contrast-button-text) !important;
        border: 1px solid var(--high-contrast-border) !important;
      }
      
      input, textarea {
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 1px solid #ffffff !important;
      }
      
      a {
        color: #00ffff !important;
        text-decoration: underline !important;
      }
      
      :focus-visible {
        outline: 2px solid var(--high-contrast-focus) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Adds text size adjustment controls
 * @param {HTMLElement} container - The chat container element
 */
export const addTextSizeControls = (container) => {
  if (!container) return;
  
  // Create text size control elements
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'text-size-controls';
  controlsContainer.setAttribute('role', 'group');
  controlsContainer.setAttribute('aria-label', 'Text size controls');
  controlsContainer.style.position = 'absolute';
  controlsContainer.style.top = '10px';
  controlsContainer.style.right = '10px';
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap = '5px';
  controlsContainer.style.zIndex = '100';
  
  // Create decrease button
  const decreaseButton = document.createElement('button');
  decreaseButton.textContent = 'A-';
  decreaseButton.setAttribute('aria-label', 'Decrease text size');
  decreaseButton.style.padding = '5px 10px';
  decreaseButton.style.backgroundColor = '#f3f4f6';
  decreaseButton.style.border = '1px solid #d1d5db';
  decreaseButton.style.borderRadius = '4px';
  decreaseButton.style.cursor = 'pointer';
  
  // Create reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'A';
  resetButton.setAttribute('aria-label', 'Reset text size');
  resetButton.style.padding = '5px 10px';
  resetButton.style.backgroundColor = '#f3f4f6';
  resetButton.style.border = '1px solid #d1d5db';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';
  
  // Create increase button
  const increaseButton = document.createElement('button');
  increaseButton.textContent = 'A+';
  increaseButton.setAttribute('aria-label', 'Increase text size');
  increaseButton.style.padding = '5px 10px';
  increaseButton.style.backgroundColor = '#f3f4f6';
  increaseButton.style.border = '1px solid #d1d5db';
  increaseButton.style.borderRadius = '4px';
  increaseButton.style.cursor = 'pointer';
  
  // Add event listeners
  decreaseButton.addEventListener('click', () => {
    adjustTextSize(-1);
  });
  
  resetButton.addEventListener('click', () => {
    resetTextSize();
  });
  
  increaseButton.addEventListener('click', () => {
    adjustTextSize(1);
  });
  
  // Add buttons to container
  controlsContainer.appendChild(decreaseButton);
  controlsContainer.appendChild(resetButton);
  controlsContainer.appendChild(increaseButton);
  
  // Add container to chat container
  container.appendChild(controlsContainer);
};

/**
 * Adjusts text size throughout the application
 * @param {number} step - The adjustment step (positive to increase, negative to decrease)
 */
const adjustTextSize = (step) => {
  // Get current font size
  const html = document.documentElement;
  const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
  
  // Calculate new size (min 12px, max 24px)
  const newSize = Math.min(Math.max(currentSize + step, 12), 24);
  
  // Set new size
  html.style.fontSize = `${newSize}px`;
  
  // Announce to screen readers
  const action = step > 0 ? 'increased' : 'decreased';
  announceToScreenReader(`Text size ${action} to ${newSize} pixels`);
};

/**
 * Resets text size to default
 */
const resetTextSize = () => {
  // Reset to default
  document.documentElement.style.fontSize = '';
  
  // Announce to screen readers
  announceToScreenReader('Text size reset to default');
};

/**
 * Initializes all accessibility features
 * @param {HTMLElement} container - The chat container element
 */
export const initializeAccessibility = (container) => {
  if (!container) return;
  
  // Add ARIA attributes
  addAriaAttributes(container);
  
  // Add keyboard navigation
  addKeyboardNavigation(container);
  
  // Add visible focus indicators
  addVisibleFocusIndicators();
  
  // Add alt text to images
  addImageAltText(container);
};
