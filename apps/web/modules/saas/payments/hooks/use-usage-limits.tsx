'use client';

import { useActivePlan } from '@saas/payments/hooks/use-active-plan';
import { useMonthlyUsage } from '@shared/hooks/use-monthly-usage';
import { useState } from 'react';

export function useUsageLimits() {
  const { activePlan, creditData } = useActivePlan();
  const { 
    stats: monthlyUsage, 
    checkWordLimit, 
    isApproachingLimit: isApproachingWordLimit, 
    hasExceededLimit: hasExceededWordLimit 
  } = useMonthlyUsage();
  const [showPricingGate, setShowPricingGate] = useState(false);
  const [limitType, setLimitType] = useState<'words'>('words');

  const currentCredits = creditData || {
    creditBalance: 0,
    lastCreditReset: null,
    nextCreditReset: null
  };

  const checkLimit = (wordCount: number) => {
    if (!checkWordLimit(wordCount)) {
      setLimitType('words');
      setShowPricingGate(true);
      return false;
    }
    return true;
  };

  const canProcessText = (wordCount: number) => checkWordLimit(wordCount);

  const getRemainingUsage = (type: 'comments' | 'words') => {
    if (type === 'comments') {
      // For comments analysis, return remaining credits or word allowance
      if (activePlan?.id === 'credits') {
        return currentCredits.creditBalance;
      }
      return monthlyUsage.remainingWords;
    }
    return monthlyUsage.remainingWords;
  };

  const canAnalyzeComments = (commentCount: number) => {
    // Check if user can analyze the specified number of comments
    // This could be based on credits or word limits
    if (activePlan?.id === 'credits') {
      return currentCredits.creditBalance > 0;
    }
    // For word-based plans, assume each comment uses ~50 words on average
    const estimatedWords = commentCount * 50;
    return checkWordLimit(estimatedWords);
  };

  const currentUsage = monthlyUsage.currentUsage;

  return {
    activePlan,
    currentCredits,
    monthlyUsage,
    showPricingGate,
    setShowPricingGate,
    limitType,
    checkLimit,
    canProcessText,
    getRemainingUsage,
    canAnalyzeComments,
    currentUsage,
    // Helper functions for UI
    shouldShowWarning: isApproachingWordLimit,
    shouldBlockActions: hasExceededWordLimit,
    // Monthly word limit helpers
    isApproachingWordLimit,
    hasExceededWordLimit,
    checkWordLimit
  };
}
