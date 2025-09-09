import { checkMonthlyWordLimit } from '@repo/database/prisma/queries/tools';

export interface WordLimitResult {
  allowed: boolean;
  currentUsage: number;
  wordLimit: number;
  remainingWords: number;
  message?: string;
}

export interface PerRequestLimitResult {
  allowed: boolean;
  requestLimit: number;
  requestedWords: number;
  message?: string;
}

// Monthly word limits based on plan tiers
export function getMonthlyWordLimit(planId?: string): number {
  switch (planId) {
    case 'starter':
      return 15000; // 15k words per month
    case 'pro': 
      return 60000; // 60k words per month
    case 'max':
    case 'premium': // fallback for premium plans
      return 150000; // 150k words per month
    case 'credits':
      return 60000; // Same as pro for credit users
    default:
      return 1000; // Free plan - 1k words per month
  }
}

// Per-request word limits based on plan tiers
export function getPerRequestWordLimit(planId?: string): number {
  switch (planId) {
    case 'starter':
      return 500;
    case 'pro': 
      return 1500;
    case 'max':
    case 'premium': // fallback for premium plans
      return 3000;
    case 'credits':
      return 1500; // Same as pro for credit users
    default:
      return 500; // Free plan / default
  }
}

export async function enforceWordLimit(
  userId: string,
  requestedWords: number
): Promise<WordLimitResult> {
  return await checkMonthlyWordLimit(userId, requestedWords);
}

export function createWordLimitError(result: WordLimitResult) {
  return {
    error: 'WORD_LIMIT_EXCEEDED',
    message: result.message || 'Monthly word limit exceeded',
    details: {
      currentUsage: result.currentUsage,
      wordLimit: result.wordLimit,
      remainingWords: result.remainingWords,
      requestedWords: result.wordLimit - result.currentUsage,
    },
  };
}

// Helper to count words in text
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Split by whitespace and filter out empty strings
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Validate input and enforce limits
export async function validateAndEnforceLimit(
  userId: string,
  inputText: string,
  toolType: string
) {
  const wordCount = countWords(inputText);
  
  if (wordCount === 0) {
    return {
      success: false,
      error: 'INVALID_INPUT',
      message: 'Input text is empty or invalid',
    };
  }

  // Check word limit
  const limitCheck = await enforceWordLimit(userId, wordCount);
  
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: 'WORD_LIMIT_EXCEEDED',
      message: limitCheck.message,
      details: createWordLimitError(limitCheck).details,
    };
  }

  return {
    success: true,
    wordCount,
    limitCheck,
  };
}