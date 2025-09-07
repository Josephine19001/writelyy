'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Button } from '@ui/components/button';
import {
  TrendingUpIcon,
  MessageSquareIcon,
  SparklesIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  HelpCircleIcon,
  BarChart3Icon,
  CalendarIcon,
  ExternalLinkIcon,
  EyeIcon,
  ArrowRightIcon,
  AlertTriangleIcon
} from 'lucide-react';
import {
  getPlatformIcon,
  getPlatformConfig,
  PLATFORM_KEYS,
  type Platform
} from '@shared/lib/platforms';
import { RequestSummaryModal } from './RequestSummaryModal';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostsQuery } from '../lib/posts-api';
import { useActiveOrganization } from '../hooks/use-active-organization';
import type { Post } from '../lib/posts-utils';

export default function OrganizationStart() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeOrganization } = useActiveOrganization();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>(
    '30d'
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  // Get platform filter from URL
  const platformFilter = searchParams.get('platform') as Platform | null;

  // Apply platform filter to posts query
  useEffect(() => {
    if (platformFilter && !PLATFORM_KEYS.includes(platformFilter)) {
      // Invalid platform, remove from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('platform');
      router.replace(`?${newSearchParams.toString()}`);
    }
  }, [platformFilter, router, searchParams]);

  const periods = [
    { value: '7d' as const, label: '7 Days' },
    { value: '30d' as const, label: '30 Days' },
    { value: '90d' as const, label: '90 Days' }
  ];

  // Fetch posts data
  const { data: postsData, isLoading } = usePostsQuery({
    organizationId: activeOrganization?.id || '',
    platform: platformFilter || undefined,
    status: 'all',
    search: '',
    limit: 100,
    offset: 0
  });

  // Only process data if we have an organization
  const posts = activeOrganization?.id ? postsData?.posts || [] : [];

  // Filter posts by period
  const getFilteredPosts = (period: string): Post[] => {
    if (!posts.length) {
      return [];
    }

    const now = new Date();
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const filtered = posts.filter((post) => {
      const postDate = new Date(post.createdAt);
      const isInRange = postDate >= cutoff;

      return isInRange;
    });

    return filtered;
  };

  const filteredPosts = getFilteredPosts(selectedPeriod);
  const analyzedPosts = filteredPosts.filter((post) => post.analysis);

  // Calculate metrics
  const totalPosts = filteredPosts.length;
  const totalComments = filteredPosts.reduce(
    (sum, post) => sum + (post.commentCount || 0),
    0
  );

  // Calculate sentiment counts from individual comments
  const getSentimentCounts = (posts: Post[]) => {
    return posts.reduce(
      (totals, post) => {
        if (!post.comments) return totals;

        post.comments.forEach((comment) => {
          if (comment.sentiment === 'POSITIVE') totals.positive++;
          else if (comment.sentiment === 'NEGATIVE') totals.negative++;
          else if (comment.sentiment === 'NEUTRAL') totals.neutral++;
          else if (comment.sentiment === 'COMPLIMENT') totals.compliment++;
        });

        return totals;
      },
      { positive: 0, negative: 0, neutral: 0, compliment: 0 }
    );
  };

  const sentimentCounts = getSentimentCounts(analyzedPosts);
  const totalPositive = sentimentCounts.positive + sentimentCounts.compliment;
  const totalNegative = sentimentCounts.negative;

  const totalQuestions = analyzedPosts.reduce(
    (sum, post) => sum + (post.analysis?.questions?.length || 0),
    0
  );
  const totalFeatures = filteredPosts.reduce(
    (sum, post) => sum + (post.analysis?.feedback?.length || 0),
    0
  );

  // Calculate average satisfaction score
  const satisfactionScores = analyzedPosts
    .map((post) => post.analysis?.userSatisfactionScore)
    .filter((score) => score !== undefined && score !== null) as number[];
  const avgSatisfaction =
    satisfactionScores.length > 0
      ? Math.round(
          satisfactionScores.reduce((sum, score) => sum + score, 0) /
            satisfactionScores.length
        )
      : 0;

  // Platform breakdown - Using all supported platforms
  const platformStats = PLATFORM_KEYS.map((platform) => {
    const platformPosts = filteredPosts.filter(
      (post) => post.platform === platform
    );
    const platformComments = platformPosts.reduce(
      (sum, post) => sum + (post.commentCount || 0),
      0
    );
    return {
      platform,
      posts: platformPosts.length,
      comments: platformComments,
      config: getPlatformConfig(platform)
    };
  }).filter((stat) => stat.posts > 0);

  // Top performing posts
  const topPosts = filteredPosts
    .filter((post) => post.commentCount && post.commentCount > 0)
    .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
    .slice(0, 3);

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setIsFeatureModalOpen(true);
  };

  const handleCloseFeatureModal = () => {
    setIsFeatureModalOpen(false);
    setSelectedPost(null);
  };

  const handleViewMorePlatform = (platform: Platform) => {
    const basePath = activeOrganization
      ? `/app/${activeOrganization.slug}/posts`
      : '/posts';
    router.push(`${basePath}?platform=${platform}`);
  };

  if (isLoading || !activeOrganization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics overview for your social media posts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </p>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analyzedPosts.length} analyzed
                </p>
              </div>
              <BarChart3Icon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Comments
                </p>
                <p className="text-2xl font-bold">
                  {totalComments.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0}{' '}
                  avg per post
                </p>
              </div>
              <MessageSquareIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User Satisfaction
                </p>
                <p className="text-2xl font-bold">{avgSatisfaction}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPositive} positive, {totalNegative} negative
                </p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Requests
                </p>
                <p className="text-2xl font-bold">{totalFeatures}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalQuestions} questions asked
                </p>
              </div>
              <SparklesIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown & Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {platformStats.length > 0 ? (
              <div className="space-y-4">
                {platformStats.map((stat) => {
                  const IconComponent = getPlatformIcon(stat.platform);
                  return (
                    <div
                      key={stat.platform}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {IconComponent ? (
                            <IconComponent
                              size={32}
                              className="flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {stat.platform.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {stat.config.displayName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stat.posts} posts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-bold">
                            {stat.comments.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            comments
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMorePlatform(stat.platform)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts in this period</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {topPosts.length > 0 ? (
              <div className="space-y-4">
                {topPosts.map((post, index) => {
                  const platformConfig = getPlatformConfig(
                    post.platform as Platform
                  );
                  const IconComponent = getPlatformIcon(
                    post.platform as Platform
                  );
                  return (
                    <div key={post.id} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {post.caption || 'Untitled Post'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            {post.commentCount?.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            {IconComponent && (
                              <IconComponent
                                size={12}
                                className="flex-shrink-0"
                              />
                            )}
                            <span className="text-xs font-medium">
                              {platformConfig?.displayName || post.platform}
                            </span>
                          </div>
                          {post.analysis && (
                            <span className="flex items-center">
                              <ThumbsUpIcon className="h-3 w-3 mr-1 text-green-500" />
                              {post.comments?.filter(
                                (c) =>
                                  c.sentiment === 'POSITIVE' ||
                                  c.sentiment === 'COMPLIMENT'
                              ).length || 0}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(post.url, '_blank')}
                          className="text-muted-foreground hover:text-foreground"
                          title="Open post in new tab"
                        >
                          <ExternalLinkIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPost(post)}
                          className="text-muted-foreground hover:text-foreground"
                          title="View post analysis"
                        >
                          <EyeIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUpIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts with comments in this period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis Summary */}
      {analyzedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Sentiment Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Sentiment
                </h4>
                <div className="flex items-center space-x-3">
                  <ThumbsUpIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {totalPositive}
                    </p>
                    <p className="text-sm text-muted-foreground">Positive</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ThumbsDownIcon className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {totalNegative}
                    </p>
                    <p className="text-sm text-muted-foreground">Negative</p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Questions
                </h4>
                <div className="flex items-center space-x-3">
                  <HelpCircleIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalQuestions}
                    </p>
                    <p className="text-sm text-muted-foreground">Asked</p>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Feedback
                </h4>
                <div className="flex items-center space-x-3">
                  <MessageSquareIcon className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {analyzedPosts.reduce(
                        (sum, post) =>
                          sum + (post.analysis?.feedback?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Feature Requests
                    </p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Issues
                </h4>
                <div className="flex items-center space-x-3">
                  <AlertTriangleIcon className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {analyzedPosts.reduce(
                        (sum, post) =>
                          sum +
                          (post.analysis?.issues?.length || 0) +
                          (post.analysis?.topConcerns?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Problems & Concerns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Summary Modal */}
      <RequestSummaryModal
        isOpen={isFeatureModalOpen}
        onClose={handleCloseFeatureModal}
        post={selectedPost}
      />
    </div>
  );
}
