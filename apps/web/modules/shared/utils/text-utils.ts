/**
 * Count words in a text string
 * @param text - The text to count words in
 * @returns The number of words
 */
export const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

/**
 * Truncate text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength = 50): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Get per-request word limits based on plan tiers
 * @param planId - The user's plan ID
 * @returns The word limit for a single request
 */
export function getPerRequestWordLimit(planId?: string): number {
  switch (planId) {
    case 'starter':
      return 500;
    case 'pro':
      return 1500;
    case 'max':
    case 'premium': // fallback for premium plans
      return 3000; // Same as pro for credit users
    default:
      return 500; // Free plan / default
  }
}
