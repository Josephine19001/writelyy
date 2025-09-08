import { checkMonthlyWordLimit } from '@repo/database/prisma/queries/tools';

export interface WordLimitResult {
  allowed: boolean;
  currentUsage: number;
  wordLimit: number;
  remainingWords: number;
  message?: string;
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