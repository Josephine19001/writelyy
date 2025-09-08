// Shared validation constants - keep in sync with backend
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

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  wordCount: number;
  characterCount: number;
}

export function validateTextInput(text: string): ValidationResult {
  const trimmedText = text.trim();
  const wordCount = countWords(trimmedText);
  const characterCount = countCharacters(trimmedText);
  
  if (!trimmedText) {
    return { 
      isValid: false, 
      error: 'Text input is required',
      wordCount: 0,
      characterCount: 0
    };
  }
  
  if (wordCount < VALIDATION_LIMITS.MIN_WORDS) {
    return { 
      isValid: false, 
      error: `Text must contain at least ${VALIDATION_LIMITS.MIN_WORDS} words. Current: ${wordCount} words.`,
      wordCount,
      characterCount
    };
  }
  
  if (wordCount > VALIDATION_LIMITS.MAX_WORDS) {
    return { 
      isValid: false, 
      error: `Text must not exceed ${VALIDATION_LIMITS.MAX_WORDS} words. Current: ${wordCount} words.`,
      wordCount,
      characterCount
    };
  }
  
  if (characterCount < VALIDATION_LIMITS.MIN_CHARACTERS) {
    return { 
      isValid: false, 
      error: `Text must contain at least ${VALIDATION_LIMITS.MIN_CHARACTERS} characters. Current: ${characterCount} characters.`,
      wordCount,
      characterCount
    };
  }
  
  if (characterCount > VALIDATION_LIMITS.MAX_CHARACTERS) {
    return { 
      isValid: false, 
      error: `Text must not exceed ${VALIDATION_LIMITS.MAX_CHARACTERS} characters. Current: ${characterCount} characters.`,
      wordCount,
      characterCount
    };
  }
  
  return { 
    isValid: true,
    wordCount,
    characterCount
  };
}

export function calculateCredits(wordCount: number, baseRate: number = 100): number {
  return Math.ceil(wordCount / baseRate);
}