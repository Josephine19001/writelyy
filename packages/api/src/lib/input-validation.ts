import { z } from 'zod';

// Centralized validation constants
export const VALIDATION_LIMITS = {
  MIN_WORDS: 30,
  MAX_WORDS: 2500,
  MIN_CHARACTERS: 50,
  MAX_CHARACTERS: 25000,
} as const;

// Utility functions
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function countCharacters(text: string): number {
  return text.trim().length;
}

export function validateTextInput(text: string): { isValid: boolean; error?: string } {
  const trimmedText = text.trim();
  
  if (!trimmedText) {
    return { isValid: false, error: 'Text input is required' };
  }
  
  const wordCount = countWords(trimmedText);
  const charCount = countCharacters(trimmedText);
  
  if (wordCount < VALIDATION_LIMITS.MIN_WORDS) {
    return { 
      isValid: false, 
      error: `Text must contain at least ${VALIDATION_LIMITS.MIN_WORDS} words. Current: ${wordCount} words.` 
    };
  }
  
  if (wordCount > VALIDATION_LIMITS.MAX_WORDS) {
    return { 
      isValid: false, 
      error: `Text must not exceed ${VALIDATION_LIMITS.MAX_WORDS} words. Current: ${wordCount} words.` 
    };
  }
  
  if (charCount < VALIDATION_LIMITS.MIN_CHARACTERS) {
    return { 
      isValid: false, 
      error: `Text must contain at least ${VALIDATION_LIMITS.MIN_CHARACTERS} characters. Current: ${charCount} characters.` 
    };
  }
  
  if (charCount > VALIDATION_LIMITS.MAX_CHARACTERS) {
    return { 
      isValid: false, 
      error: `Text must not exceed ${VALIDATION_LIMITS.MAX_CHARACTERS} characters. Current: ${charCount} characters.` 
    };
  }
  
  return { isValid: true };
}

// Zod schema for consistent validation across all tools
export const BaseTextInputSchema = z.string()
  .min(1, 'Text input is required')
  .refine((text) => {
    const validation = validateTextInput(text);
    return validation.isValid;
  }, (text) => ({
    message: validateTextInput(text).error || 'Invalid text input'
  }));

// Tool-specific schemas
export const HumanizerInputSchema = z.object({
  inputText: BaseTextInputSchema,
  tone: z.enum(['default', 'professional', 'friendly', 'academic']).optional().default('default')
});

export const DetectorInputSchema = z.object({
  inputText: BaseTextInputSchema
});

export const SummariserInputSchema = z.object({
  inputText: BaseTextInputSchema,
  summaryType: z.enum(['brief', 'detailed', 'key-points']).optional().default('brief')
});

export const ParaphraserInputSchema = z.object({
  inputText: BaseTextInputSchema,
  style: z.enum(['formal', 'casual', 'academic', 'creative']).optional().default('formal')
});

// Credit calculation utility
export function calculateCredits(wordCount: number, baseRate: number = 100): number {
  return Math.ceil(wordCount / baseRate);
}

// Input preprocessing utility
export function preprocessInput(text: string): {
  cleanText: string;
  wordCount: number;
  characterCount: number;
  creditsRequired: number;
} {
  const cleanText = text.trim();
  const wordCount = countWords(cleanText);
  const characterCount = countCharacters(cleanText);
  const creditsRequired = calculateCredits(wordCount);
  
  return {
    cleanText,
    wordCount,
    characterCount,
    creditsRequired
  };
}