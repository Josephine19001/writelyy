'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '../hooks/use-active-organization';

// Types
interface TrendSearchParams {
  topic: string;
  keywords: string[];
  niche: string;
  demographic: string;
  industry: string;
  location: string;
  socialMedia: string[];
  contentType: string;
  timeframe: string;
  language: string;
}

interface TrendingContent {
  id: string;
  title: string;
  description: string;
  platform: string;
  author: string;
  authorAvatar?: string;
  url: string;
  thumbnail?: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  viralityScore: number;
  hashtags: string[];
  musicTrack?: {
    name: string;
    artist: string;
    url: string;
  };
  contentType: string;
  postedAt: string;
  isRising: boolean;
}

interface TrendingMusic {
  id: string;
  trackName: string;
  artist: string;
  platform: string;
  usageCount: number;
  growthRate: number;
  sampleUrl?: string;
  genres: string[];
  duration: number;
  isRising: boolean;
}

interface TrendingHashtag {
  id: string;
  hashtag: string;
  platform: string;
  usageCount: number;
  growthRate: number;
  category: string;
  relatedTags: string[];
  isRising: boolean;
}

interface TrendsSearchResponse {
  trendingContent: TrendingContent[];
  trendingMusic: TrendingMusic[];
  trendingHashtags: TrendingHashtag[];
  insights: {
    topCategories: string[];
    peakTimes: string[];
    demographics: { ageGroup: string; percentage: number }[];
    sentimentAnalysis: { positive: number; negative: number; neutral: number };
  };
}

interface ViralityAnalysis {
  viralityScore: number;
  factors: {
    engagementVelocity: number;
    trendingAlignment: number;
    contentQuality: number;
    creatorAuthority: number;
    timingOptimization: number;
  };
  recommendations: string[];
  predictedReach: {
    conservative: number;
    optimistic: number;
    viral: number;
  };
}

// API Functions
async function searchTrends(
  params: TrendSearchParams
): Promise<TrendsSearchResponse> {
  const response = await fetch('/api/trends/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search trends');
  }

  const result = await response.json();
  return result.data;
}

async function getTrendingMusic(platform: string): Promise<TrendingMusic[]> {
  const response = await fetch(`/api/trends/music/${platform}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch trending music');
  }

  const result = await response.json();
  return result.data;
}

async function getTrendingHashtags(params: {
  platform?: string;
  category?: string;
  timeframe?: string;
}): Promise<TrendingHashtag[]> {
  const searchParams = new URLSearchParams();
  if (params.platform) {
    searchParams.append('platform', params.platform);
  }
  if (params.category) {
    searchParams.append('category', params.category);
  }
  if (params.timeframe) {
    searchParams.append('timeframe', params.timeframe);
  }

  const response = await fetch(`/api/trends/hashtags?${searchParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch trending hashtags');
  }

  const result = await response.json();
  return result.data;
}

async function checkViralPotential(
  url: string,
  platform: string
): Promise<ViralityAnalysis> {
  const response = await fetch('/api/trends/virality-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, platform })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze viral potential');
  }

  const result = await response.json();
  return result.data;
}

// React Query Hooks
export function useTrendsSearch() {
  return useMutation({
    mutationFn: searchTrends,
    onError: (error) => {
      console.error('Trends search error:', error);
    }
  });
}

export function useTrendingMusic(platform: string, enabled = true) {
  return useQuery({
    queryKey: ['trending-music', platform],
    queryFn: () => getTrendingMusic(platform),
    enabled,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useTrendingHashtags(
  params: {
    platform?: string;
    category?: string;
    timeframe?: string;
  },
  enabled = true
) {
  return useQuery({
    queryKey: ['trending-hashtags', params],
    queryFn: () => getTrendingHashtags(params),
    enabled,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useViralityCheck() {
  return useMutation({
    mutationFn: ({ url, platform }: { url: string; platform: string }) =>
      checkViralPotential(url, platform),
    onError: (error) => {
      console.error('Virality check error:', error);
    }
  });
}

// Search history management
export function useTrendsSearchHistory() {
  const queryClient = useQueryClient();
  const { activeOrganization } = useActiveOrganization();

  const historyKey = ['trends-search-history', activeOrganization?.id];

  const getHistory = (): string[] => {
    return queryClient.getQueryData(historyKey) || [];
  };

  const addToHistory = (query: string) => {
    const currentHistory = getHistory();
    const newHistory = [
      query,
      ...currentHistory.filter((q) => q !== query)
    ].slice(0, 5);
    queryClient.setQueryData(historyKey, newHistory);
  };

  const clearHistory = () => {
    queryClient.setQueryData(historyKey, []);
  };

  return {
    history: getHistory(),
    addToHistory,
    clearHistory
  };
}

// Export types
export type {
  TrendSearchParams,
  TrendingContent,
  TrendingMusic,
  TrendingHashtag,
  TrendsSearchResponse,
  ViralityAnalysis
};
