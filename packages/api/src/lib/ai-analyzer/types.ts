import type { SentimentType } from '@repo/database/prisma/zod';

export type Sentiment = SentimentType;

/**
 * Simplified analysis result matching the new schema structure
 */
export interface AnalysisResult {
  // Analyzed comments with sentiment and type
  commentAnalysis: Array<{
    content: string;
    likes: number;
    author?: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'COMPLIMENT';
    type?: 'FEEDBACK' | 'QUESTION' | 'ISSUE'; // Optional - determined from structured arrays
  }>;

  // Structured arrays for PostAnalysis
  feedback: Array<{
    title: string;
    description: string;
    priority: 'HIGH' | 'MODERATE' | 'LOW';
    mentions: number;
    topComment: string;
    commentIds?: number[]; // Array of comment indices (1-based)
  }>;

  questions: Array<{
    question: string;
    description: string;
    category: 'PRICING' | 'FEATURES' | 'SUPPORT' | 'TECHNICAL' | 'GENERAL';
    mentions: number;
    topComment: string;
    commentIds?: number[]; // Array of comment indices (1-based)
  }>;

  issues: Array<{
    title: string;
    description: string;
    priority: 'HIGH' | 'MODERATE' | 'LOW';
    mentions: number;
    topComment: string;
    commentIds?: number[]; // Array of comment indices (1-based)
  }>;

  // Simple insights
  insights: {
    overallSentiment: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
    userSatisfactionScore: number;
    keyInsights: string[];
    topConcerns: string[];
  };
}

export interface Comment {
  content: string;
  likes: number;
  author?: string;
}

export type ProgressCallback = (progress: {
  current: number;
  total: number;
  stage: string;
}) => void;
