'use client';

import { useQuery } from '@tanstack/react-query';

interface MonthlyUsageStats {
  currentUsage: number;
  wordLimit: number;
  remainingWords: number;
  usagePercentage: number;
  breakdown: {
    humanizer: number;
    detector: number;
    summariser: number;
    paraphraser: number;
  };
  month: number;
  year: number;
}

export function useMonthlyUsage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['monthly-usage'],
    queryFn: async (): Promise<MonthlyUsageStats> => {
      const response = await fetch('/api/tools/usage/monthly', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch monthly usage');
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  const stats = data || {
    currentUsage: 0,
    wordLimit: 1000,
    remainingWords: 1000,
    usagePercentage: 0,
    breakdown: {
      humanizer: 0,
      detector: 0,
      summariser: 0,
      paraphraser: 0,
    },
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  const isApproachingLimit = stats.usagePercentage >= 80;
  const hasExceededLimit = stats.remainingWords <= 0;
  const isOverLimit = stats.usagePercentage >= 100;

  const checkWordLimit = (requestedWords: number) => {
    return stats.remainingWords >= requestedWords;
  };

  const getWarningMessage = () => {
    if (hasExceededLimit) {
      return `You've reached your monthly word limit of ${stats.wordLimit.toLocaleString()} words.`;
    }
    if (isApproachingLimit) {
      return `You're approaching your monthly limit. ${stats.remainingWords.toLocaleString()} words remaining.`;
    }
    return null;
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
    
    // Helper functions
    checkWordLimit,
    isApproachingLimit,
    hasExceededLimit,
    isOverLimit,
    getWarningMessage,
    
    // Formatted values for display
    currentUsageFormatted: stats.currentUsage.toLocaleString(),
    wordLimitFormatted: stats.wordLimit.toLocaleString(),
    remainingWordsFormatted: stats.remainingWords.toLocaleString(),
    usagePercentageRounded: Math.round(stats.usagePercentage),
  };
}