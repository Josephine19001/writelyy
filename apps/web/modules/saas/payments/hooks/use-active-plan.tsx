'use client';

import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { usePurchases } from '@saas/payments/hooks/purchases';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface CreditData {
  creditBalance: number;
  lastCreditReset: Date | null;
  nextCreditReset: Date | null;
}

export function useActivePlan() {
  const { activeOrganization } = useActiveOrganization();
  // For user-level billing, don't pass organization ID
  const { activePlan: purchaseBasedPlan, purchases } = usePurchases();

  // Since billing is at user level, we don't need organization-based credits
  // Credits system can be removed or moved to user level if needed
  const creditData = {
    creditBalance: 0,
    lastCreditReset: null,
    nextCreditReset: null
  };

  // Determine the actual active plan for user-level billing
  const activePlan = useMemo(() => {
    // Return the purchase-based plan (includes free plan fallback)
    return purchaseBasedPlan;
  }, [purchaseBasedPlan]);

  // Add refresh functionality for when user returns from payment
  const { refetch: refetchPurchases } = usePurchases();

  return {
    activePlan,
    purchases,
    creditData,
    // Add refresh function
    refresh: refetchPurchases,
    // Helper functions
    hasSubscription: (planIds?: string[] | string) => {
      return (
        !!activePlan &&
        (Array.isArray(planIds)
          ? planIds.includes(activePlan.id)
          : planIds === activePlan.id)
      );
    },
    hasPurchase: (planId: string) => {
      return !!purchases?.some((purchase) => {
        // This would need to be implemented properly based on your config
        return purchase.productId === planId;
      });
    }
  };
}
