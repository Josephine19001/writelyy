'use client';

import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { useActivePlan } from '@saas/payments/hooks/use-active-plan';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UsageData {
  posts: number;
  comments: number;
}

export function useUsageLimits() {
  const { activeOrganization } = useActiveOrganization();
  const { activePlan, creditData } = useActivePlan();
  const [showPricingGate, setShowPricingGate] = useState(false);
  const [limitType, setLimitType] = useState<'posts' | 'comments'>('posts');

  // Fetch actual usage data from API (monthly usage)
  const { data: usageData } = useQuery({
    queryKey: ['usage', activeOrganization?.id, 'current-month'],
    queryFn: async (): Promise<UsageData> => {
      if (!activeOrganization?.id) {
        return { posts: 0, comments: 0 };
      }

      try {
        const response = await fetch(
          `/api/organizations/${activeOrganization.id}/usage?period=current-month`
        );

        if (!response.ok) {
          // If API endpoint doesn't exist yet, calculate from posts (current month only)
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const postsResponse = await fetch(
            `/api/organizations/${activeOrganization.id}/posts?limit=1000`
          );

          if (!postsResponse.ok) {
            return { posts: 0, comments: 0 };
          }

          const postsData = await postsResponse.json();
          const posts = postsData.posts || [];

          // Filter posts to current month only
          const currentMonthPosts = posts.filter((post: any) => {
            const postDate = new Date(post.createdAt);
            return postDate >= startOfMonth;
          });

          return {
            posts: currentMonthPosts.length,
            comments: currentMonthPosts.reduce(
              (sum: number, post: any) => sum + (post.commentCount || 0),
              0
            )
          };
        }

        return response.json();
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
        return { posts: 0, comments: 0 };
      }
    },
    enabled: !!activeOrganization?.id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000 // Refetch every minute
  });

  const currentUsage = usageData || { posts: 0, comments: 0 };
  const currentCredits = creditData || {
    creditBalance: 0,
    lastCreditReset: null,
    nextCreditReset: null
  };

  const checkLimit = (type: 'posts' | 'comments', increment = 1) => {
    // Check if user has enough remaining comments
    if (type === 'comments') {
      const remaining = getRemainingUsage('comments');
      if (remaining < increment) {
        setLimitType('comments');
        setShowPricingGate(true);
        return false;
      }
    }

    // Posts are unlimited
    return true;
  };

  const canAddPost = () => checkLimit('posts', 1);
  const canAnalyzeComments = (commentCount: number) =>
    checkLimit('comments', commentCount);

  const getUsagePercentage = (type: 'posts' | 'comments') => {
    // Posts are unlimited
    if (type === 'posts') return 0;

    // For free plan, calculate percentage based on usage
    if (!activePlan || activePlan?.id === 'free') {
      const freeLimit = 100;
      const used = currentUsage.comments || 0;
      return Math.min((used / freeLimit) * 100, 100);
    }

    // Credit usage doesn't have a percentage since it's a balance
    return 0;
  };

  // Check if user is approaching limits (less than 50 comments remaining)
  const isApproachingLimit = (type: 'posts' | 'comments') => {
    if (type === 'posts') return false; // Posts are unlimited
    return getRemainingUsage('comments') < 50;
  };

  // Check if user has exceeded limits
  const hasExceededLimit = (type: 'posts' | 'comments') => {
    if (type === 'posts') return false; // Posts are unlimited
    return getRemainingUsage('comments') <= 0;
  };

  // Get remaining usage
  const getRemainingUsage = (type: 'posts' | 'comments') => {
    if (type === 'posts') return Number.POSITIVE_INFINITY; // Posts are unlimited

    // For comments, calculate remaining based on plan
    if (!activePlan || activePlan?.id === 'free') {
      const freeLimit = 100;
      const used = currentUsage.comments || 0;
      return Math.max(0, freeLimit - used);
    }

    if (activePlan?.id === 'credits') {
      const creditBalance = currentCredits.creditBalance || 0;
      const freeMonthlyAllowance = 100;
      const used = currentUsage.comments || 0;

      // If they haven't used their free 100 this month, add it to credit balance
      const freeRemaining = Math.max(0, freeMonthlyAllowance - used);
      return creditBalance + freeRemaining;
    }

    return 0;
  };

  return {
    activePlan,
    currentUsage,
    currentCredits,
    showPricingGate,
    setShowPricingGate,
    limitType,
    checkLimit,
    canAddPost,
    canAnalyzeComments,
    getUsagePercentage,
    isApproachingLimit,
    hasExceededLimit,
    getRemainingUsage,
    // Helper functions for UI
    shouldShowWarning: isApproachingLimit('comments'),
    shouldBlockActions: hasExceededLimit('comments')
  };
}
