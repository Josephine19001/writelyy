'use client';

import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { useActivePlan } from '@saas/payments/hooks/use-active-plan';
import { MessageCircleIcon, CreditCardIcon, ZapIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@ui/components/button';
import Link from 'next/link';

export function CommentCounter() {
  const { activeOrganization } = useActiveOrganization();
  const { activePlan, creditData } = useActivePlan();
  const { currentUsage } = useUsageLimits();

  // Calculate remaining comments based on plan
  const remainingComments = useMemo(() => {
    if (!activeOrganization) return 0;

    const currentCredits = creditData || {
      creditBalance: 0,
      lastCreditReset: null,
      nextCreditReset: null
    };

    // No plan or free plan: 100 comments per month
    if (!activePlan || activePlan?.id === 'free') {
      const freeLimit = 100;
      const used = currentUsage.comments || 0;
      return Math.max(0, freeLimit - used);
    }

    // Credits plan: their credit balance + remaining free allowance
    if (activePlan?.id === 'credits') {
      const creditBalance = currentCredits.creditBalance || 0;
      const freeMonthlyAllowance = 100;
      const used = currentUsage.comments || 0;

      // If they haven't used their free 100 this month, add it to credit balance
      const freeRemaining = Math.max(0, freeMonthlyAllowance - used);
      return creditBalance + freeRemaining;
    }

    return 0;
  }, [activeOrganization, activePlan, currentUsage, creditData]);

  // Don't render if no organization
  if (!activeOrganization) {
    return null;
  }

  // Check if user is on free plan
  const isFreeUser = !activePlan || activePlan?.id === 'free';

  // Show urgent upgrade CTA when no comments left
  if (remainingComments === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-3 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <MessageCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">No comments left</span>
        </div>
        <Link href={`/app/${activeOrganization.slug}/billing`}>
          <Button
            size="sm"
            className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white border-0"
          >
            <CreditCardIcon className="size-3 mr-1.5" />
            Get More Comments
          </Button>
        </Link>
      </div>
    );
  }

  // Show upgrade suggestion for free users when running low (less than 50 comments)
  if (isFreeUser && remainingComments < 50 && remainingComments > 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-3 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
          <MessageCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">
            Only {remainingComments} comments left
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/app/${activeOrganization.slug}/billing`}>
            <Button
              size="sm"
              className="h-7 px-3 bg-amber-600 hover:bg-amber-700 text-white border-0"
            >
              <ZapIcon className="size-3 mr-1.5" />
              Upgrade Now
            </Button>
          </Link>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            From $2.50
          </div>
        </div>
      </div>
    );
  }

  // Normal display when comments are available
  return (
    <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
      <MessageCircleIcon className="size-4 shrink-0" />
      <span className="font-medium">
        {remainingComments.toLocaleString()} comments left
      </span>
      {/* Show subtle upgrade hint for free users with decent comments remaining */}
      {isFreeUser && remainingComments >= 50 && (
        <Link href={`/app/${activeOrganization.slug}/settings/billing`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
          >
            <ZapIcon className="size-3 mr-1" />
            Upgrade
          </Button>
        </Link>
      )}
    </div>
  );
}
