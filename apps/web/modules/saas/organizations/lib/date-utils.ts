/**
 * Safely formats a date from API response (which could be string or Date)
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }
): string {
  if (!date) {
    return 'N/A';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (Number.isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a date for display in tables (short format)
 */
export function formatTableDate(
  date: string | Date | null | undefined
): string {
  return formatDate(date, {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a date with time for detailed views
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Gets relative time (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(
  date: string | Date | null | undefined
): string {
  if (!date) {
    return 'N/A';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (Number.isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return formatTableDate(dateObj);
  } catch (error) {
    console.warn('Error calculating relative time:', error);
    return 'Invalid date';
  }
}
