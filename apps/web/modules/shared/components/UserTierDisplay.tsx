'use client';

import { Card, CardContent } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Progress } from '@ui/components/progress';
import { CrownIcon, CreditCardIcon, ZapIcon } from 'lucide-react';
import { useActivePlan } from '@saas/payments/hooks/use-active-plan';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { cn } from '@ui/lib';
import Link from 'next/link';

interface UserTierDisplayProps {
  className?: string;
}

export function UserTierDisplay({ className }: UserTierDisplayProps) {
  const { activePlan, creditData } = useActivePlan();
  const { getRemainingUsage, currentUsage } = useUsageLimits();

  const getPlanDisplayName = () => {
    if (!activePlan) return 'Free';
    switch (activePlan.id) {
      case 'free':
        return 'Free Plan';
      case 'credits':
        return 'Credits Plan';
      case 'pro':
        return 'Pro Plan';
      case 'premium':
        return 'Premium Plan';
      default:
        return 'Free Plan';
    }
  };

  const getPlanIcon = () => {
    if (!activePlan || activePlan.id === 'free') {
      return <ZapIcon className="h-4 w-4" />;
    }
    if (activePlan.id === 'credits') {
      return <CreditCardIcon className="h-4 w-4" />;
    }
    return <CrownIcon className="h-4 w-4" />;
  };

  const getPlanBadgeStatus = () => {
    if (!activePlan || activePlan.id === 'free') return 'info';
    if (activePlan.id === 'credits') return 'warning';
    return 'success';
  };

  const getRemainingCredits = () => {
    if (!activePlan || activePlan.id === 'free') {
      const freeLimit = 100;
      const used = currentUsage.comments || 0;
      return Math.max(0, freeLimit - used);
    }
    if (activePlan.id === 'credits') {
      return creditData?.creditBalance || 0;
    }
    return 'Unlimited';
  };

  const getUsageProgress = () => {
    if (!activePlan || activePlan.id === 'free') {
      const freeLimit = 100;
      const used = currentUsage.comments || 0;
      return (used / freeLimit) * 100;
    }
    return 0; // Don't show progress for paid plans
  };

  const shouldShowProgress = !activePlan || activePlan.id === 'free';
  const remainingCredits = getRemainingCredits();
  const usageProgress = getUsageProgress();

  return (
    <div className={cn('space-y-2', className)}>
      {/* User Section Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {!activePlan || activePlan.id === 'free' ? 'F' : activePlan.id === 'credits' ? 'C' : 'P'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">
              {!activePlan || activePlan.id === 'free' ? 'Free Plan' : activePlan.id === 'credits' ? 'Credit Plan' : 'Pro Plan'}
            </p>
          </div>
        </div>
      </div>

      {/* Credits Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Credits</span>
          <span className="font-medium">
            {typeof remainingCredits === 'number' 
              ? remainingCredits.toLocaleString() 
              : remainingCredits}
          </span>
        </div>

        {/* Progress for Free Users */}
        {shouldShowProgress && (
          <div className="space-y-1">
            <Progress value={usageProgress} className="h-1.5" />
            <div className="text-xs text-muted-foreground">
              {currentUsage.comments || 0} of 100 used this month
            </div>
          </div>
        )}
        
        {/* Upgrade Button - Compact */}
        {(!activePlan || activePlan.id === 'free') && (
          <Button asChild size="sm" className="w-full h-7 text-xs mt-2" variant="outline">
            <Link href="/app/settings/billing">
              Upgrade Plan
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}