import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS
 * Allows only safe tags and attributes
 */
export function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text (strip HTML, limit length)
 */
export function sanitizeText(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') return '';
  // Strip HTML tags
  const stripped = input.replace(/<[^>]*>/g, '');
  // Trim and limit length
  return stripped.trim().slice(0, maxLength);
}

/**
 * Sanitize product description (allows basic formatting)
 */
export function sanitizeProductDescription(input) {
  return sanitizeHtml(input);
}

/**
 * Sanitize chat message content
 */
export function sanitizeChatMessage(input) {
  return sanitizeText(input, 2000);
}

/**
 * Sanitize review comment
 */
export function sanitizeReviewComment(input) {
  return sanitizeText(input, 500);
}

/**
 * Sanitize address/notes fields
 */
export function sanitizeAddressField(input) {
  return sanitizeText(input, 500);
}

/**
 * Sanitize university/city names
 */
export function sanitizeLocationField(input) {
  return sanitizeText(input, 100);
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeProductDescription,
  sanitizeChatMessage,
  sanitizeReviewComment,
  sanitizeAddressField,
  sanitizeLocationField,
};