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
  const { activePlan: purchaseBasedPlan, purchases } = usePurchases(
    activeOrganization?.id
  );

  // Fetch credit balance
  const { data: creditData } = useQuery({
    queryKey: ['credits', activeOrganization?.id],
    queryFn: async (): Promise<CreditData> => {
      if (!activeOrganization?.id) {
        return {
          creditBalance: 0,
          lastCreditReset: null,
          nextCreditReset: null
        };
      }

      try {
        const response = await fetch(
          `/api/organizations/${activeOrganization.id}/credits`
        );

        if (!response.ok) {
          return {
            creditBalance: 0,
            lastCreditReset: null,
            nextCreditReset: null
          };
        }

        return response.json();
      } catch (error) {
        console.error('Failed to fetch credit data:', error);
        return {
          creditBalance: 0,
          lastCreditReset: null,
          nextCreditReset: null
        };
      }
    },
    enabled: !!activeOrganization?.id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000 // Refetch every minute
  });

  // Determine the actual active plan considering both purchases and credits
  const activePlan = useMemo(() => {
    // If we have a valid purchase-based plan, use it
    if (purchaseBasedPlan) {
      return purchaseBasedPlan;
    }

    // If we have credit balance > 0, user has credits plan
    if (creditData && creditData.creditBalance > 0) {
      return {
        id: 'credits' as const,
        status: 'active' as const
      };
    }

    // Otherwise, use the purchase-based plan (which will be free plan or null)
    return purchaseBasedPlan;
  }, [purchaseBasedPlan, creditData]);

  return {
    activePlan,
    purchases,
    creditData,
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
