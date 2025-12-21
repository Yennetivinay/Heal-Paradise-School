/**
 * Native smooth scrolling utilities
 * Provides helper functions for smooth scrolling throughout the application
 */

/**
 * Scroll to a specific position or element using native smooth scrolling
 * @param {number|HTMLElement|string} target - Target position (number), element, or selector
 * @param {Object} options - Scroll options (offset for element scrolling)
 * @returns {Promise} Promise that resolves when scroll completes
 */
export const scrollTo = (target, options = {}) => {
  return new Promise((resolve) => {
    const offset = options.offset || 0;
    
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
        setTimeout(resolve, 500);
      } else {
        const element = typeof target === 'string' 
          ? document.querySelector(target) 
          : target;
        if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition + offset, behavior: 'smooth' });
          setTimeout(resolve, 500);
        } else {
          resolve();
        }
    }
  });
};

/**
 * Scroll to top of page
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  return scrollTo(0, {
    duration: 1.2,
    ...options
  });
};

/**
 * Scroll to bottom of page
 * @param {Object} options - Scroll options
 */
export const scrollToBottom = (options = {}) => {
  return scrollTo(document.body.scrollHeight, {
    duration: 1.5,
    ...options
  });
};

/**
 * Scroll to element by ID
 * @param {string} id - Element ID
 * @param {Object} options - Scroll options
 */
export const scrollToId = (id, options = {}) => {
  return scrollTo(`#${id}`, {
    duration: 1.5,
    offset: -80, // Account for fixed navbar
    ...options
  });
};

/**
 * Initialize smooth scrolling for anchor links
 */
export const initAnchorScroll = () => {
  // Handle all anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || href === '#!') {
      e.preventDefault();
      scrollToTop();
      return;
    }

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      e.preventDefault();
      scrollTo(targetElement, {
        offset: -80 // Account for fixed navbar
      });
    }
  });
};

