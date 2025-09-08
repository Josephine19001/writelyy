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

  return {
    activePlan,
    currentCredits,
    monthlyUsage,
    showPricingGate,
    setShowPricingGate,
    limitType,
    checkLimit,
    canProcessText,
    // Helper functions for UI
    shouldShowWarning: isApproachingWordLimit,
    shouldBlockActions: hasExceededWordLimit,
    // Monthly word limit helpers
    isApproachingWordLimit,
    hasExceededWordLimit,
    checkWordLimit
  };
}
