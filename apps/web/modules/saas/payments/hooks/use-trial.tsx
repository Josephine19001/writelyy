'use client';

import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { usePurchases } from '@saas/payments/hooks/purchases';
import { config } from '@repo/config';
import { useMemo } from 'react';

export function useTrial() {
  const { activeOrganization } = useActiveOrganization();
  const { activePlan, purchases } = usePurchases(activeOrganization?.id);

  const trialPlan = Object.entries(config.payments.plans).find(
    ([_, plan]) => 'isFree' in plan && plan.isFree
  );
  const trialConfig = trialPlan?.[1];
  const trialDays =
    trialConfig &&
    'trialDays' in trialConfig &&
    typeof trialConfig.trialDays === 'number'
      ? trialConfig.trialDays
      : 7;

  // Find if there's a trial purchase (free plan purchase)
  const trialPurchase = useMemo(() => {
    if (!purchases) {
      return null;
    }

    return purchases.find((purchase) => {
      // Check if this purchase is for the trial plan
      const planEntry = Object.entries(config.payments.plans).find(
        ([planId, plan]) => {
          if ('isFree' in plan && plan.isFree) {
            // For free plans, we create a special purchase with productId = planId
            return purchase.productId === planId;
          }
          return false;
        }
      );
      return !!planEntry;
    });
  }, [purchases]);

  const isOnTrial = useMemo(() => {
    if (!trialPurchase) {
      return false;
    }

    // Check if trial period hasn't expired
    const trialStart = new Date(trialPurchase.createdAt);
    const trialEnd = new Date(
      trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000
    );
    const now = new Date();

    return now < trialEnd;
  }, [trialPurchase, activePlan, trialDays]);

  const trialDaysLeft = useMemo(() => {
    if (!trialPurchase) {
      return 0;
    }

    const trialStart = new Date(trialPurchase.createdAt);
    const trialEnd = new Date(
      trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000
    );
    const now = new Date();

    return Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
  }, [trialPurchase, trialDays]);

  const trialLimits = useMemo(() => {
    // Credit card required trial - no usage limits
    // Users have full access during trial period
    return null;
  }, []);

  const hasTrialExpired = useMemo(() => {
    if (!trialPurchase) {
      return false;
    }

    const trialStart = new Date(trialPurchase.createdAt);
    const trialEnd = new Date(
      trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000
    );
    const now = new Date();

    return now >= trialEnd;
  }, [trialPurchase, trialDays]);

  const canStartTrial = useMemo(() => {
    // Can start trial if no purchases exist yet
    return !purchases || purchases.length === 0;
  }, [purchases]);

  const trialStartedAt = useMemo(() => {
    return trialPurchase ? new Date(trialPurchase.createdAt) : null;
  }, [trialPurchase]);

  const trialEndsAt = useMemo(() => {
    if (!trialPurchase) {
      return null;
    }
    const trialStart = new Date(trialPurchase.createdAt);
    return new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
  }, [trialPurchase, trialDays]);

  return {
    isOnTrial,
    trialDaysLeft,
    trialLimits,
    hasTrialExpired,
    canStartTrial,
    trialStartedAt,
    trialEndsAt,
    trialPlan: trialPurchase ? 'trial' : null
  };
}
