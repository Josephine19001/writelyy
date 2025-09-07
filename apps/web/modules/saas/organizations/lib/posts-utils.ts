import type { Platform } from '@shared/lib/platforms';
export type { Platform };

export type PostStatus =
  | 'PENDING'
  | 'FETCHING_COMMENTS'
  | 'COMMENTS_FETCHED'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'NO_COMMENTS'
  | 'SCRAPING_FAILED'
  | 'ANALYSIS_FAILED'
  | 'ERROR';

export interface FeatureRequest {
  title?: string; // From AI analyzer
  name?: string; // Legacy field for backward compatibility
  mentions?: number; // From AI analyzer
  totalMentions?: number; // Legacy field for backward compatibility
  topComment?: string;
  description?: string; // From AI analyzer
  priority: 'HIGH' | 'MODERATE' | 'LOW';
  commentIds?: number[]; // Array of comment indices (1-based from AI)
  syncStatus?: string[]; // Array of connected platforms (e.g., ['Notion', 'Jira'])
  archived?: boolean; // Whether the feature request is archived
  archivedAt?: string | Date; // When it was archived
}

export interface Question {
  question: string;
  mentions?: number; // From AI analyzer
  totalMentions?: number; // Legacy field for backward compatibility
  topComment?: string;
  description?: string; // From AI analyzer
  category: 'PRICING' | 'FEATURES' | 'SUPPORT' | 'TECHNICAL' | 'GENERAL';
  commentIds?: number[]; // Array of comment indices (1-based from AI)
}

export interface Issue {
  title: string;
  description: string;
  priority: 'HIGH' | 'MODERATE' | 'LOW';
  mentions: number;
  topComment: string;
  commentIds?: number[]; // Array of comment indices (1-based from AI)
}

export interface SentimentSummary {
  positives: {
    theme: string;
    mentions: number;
    topComment: string;
  }[];
  negatives: {
    theme: string;
    mentions: number;
    topComment: string;
  }[];
}

export interface Comment {
  content: string;
  likes: number;
  author?: string;
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'COMPLIMENT';
}

export interface PostAnalysis {
  id: string;
  postId: string;
  analyzedAt: string | Date;
  overallSentiment?: string;
  userSatisfactionScore?: number;
  engagementQuality?: string;
  topConcerns?: string[];
  positiveHighlights?: string[];
  commonThemes?: string[];
  urgentIssues?: string[];
  feedback?: FeatureRequest[];
  questions?: Question[];
  issues?: Issue[]; // Now properly typed
  keyInsights?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Post {
  id: string;
  platform: Platform;
  url: string;
  caption: string | null;
  comments: Comment[];
  commentCount: number;
  tags: string[];
  status?: PostStatus;
  analysis?: PostAnalysis;
  autoSync?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Re-export platform utilities
export {
  detectPlatformFromUrl,
  getPlatformConfig,
  getPlatformIcon,
  getPlatformLabel,
  getPlatformDisplayName,
  getPlatformColors,
  PLATFORMS as platformConfig
} from '@shared/lib/platforms';

// Utility function to safely format dates from API responses
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  }
): string {
  if (!date) {
    return 'N/A';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (Number.isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'N/A';
  }
}
