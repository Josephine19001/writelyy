/**
 * Shared utility functions for mapping AI analysis results to database enums
 */

export type QuestionCategory =
  | 'PRICING'
  | 'FEATURES'
  | 'SUPPORT'
  | 'TECHNICAL'
  | 'GENERAL';
export type Priority = 'HIGH' | 'MODERATE' | 'LOW';

/**
 * Maps AI-returned category values to standardized QuestionCategory enum
 */
export function mapQuestionCategory(
  category: string | undefined | null
): QuestionCategory {
  if (!category) return 'GENERAL';

  switch (category.toUpperCase()) {
    case 'PRICING':
      return 'PRICING';
    case 'FEATURES':
    case 'FEATURE':
      return 'FEATURES';
    case 'SUPPORT':
    case 'CUSTOMER_SUPPORT':
      return 'SUPPORT';
    case 'TECHNICAL':
    case 'TECH':
    case 'TECHNICAL_SUPPORT':
      return 'TECHNICAL';
    default:
      return 'GENERAL';
  }
}

/**
 * Maps AI-returned priority values to standardized Priority enum
 */
export function mapPriority(priority: string | undefined | null): Priority {
  if (!priority) return 'MODERATE';

  switch (priority.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
    case 'URGENT':
      return 'HIGH';
    case 'MEDIUM':
    case 'MODERATE':
    case 'NORMAL':
      return 'MODERATE';
    case 'LOW':
    case 'MINOR':
      return 'LOW';
    default:
      return 'MODERATE';
  }
}

/**
 * Maps priority level to a numeric score for sorting
 */
export function getPriorityScore(priority: Priority): number {
  switch (priority) {
    case 'HIGH':
      return 3;
    case 'MODERATE':
      return 2;
    case 'LOW':
      return 1;
    default:
      return 2;
  }
}

/**
 * Maps category to a display-friendly name
 */
export function getCategoryDisplayName(category: QuestionCategory): string {
  switch (category) {
    case 'PRICING':
      return 'Pricing';
    case 'FEATURES':
      return 'Features';
    case 'SUPPORT':
      return 'Support';
    case 'TECHNICAL':
      return 'Technical';
    case 'GENERAL':
      return 'General';
    default:
      return 'General';
  }
}

/**
 * Maps priority to a display-friendly name
 */
export function getPriorityDisplayName(priority: Priority): string {
  switch (priority) {
    case 'HIGH':
      return 'High';
    case 'MODERATE':
      return 'Moderate';
    case 'LOW':
      return 'Low';
    default:
      return 'Moderate';
  }
}
