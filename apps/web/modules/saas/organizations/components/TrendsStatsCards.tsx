'use client';

import { Card, CardContent } from '@ui/components/card';
import {
  TrendingUpIcon,
  MusicIcon,
  HashIcon,
  EyeIcon,
  FlameIcon
} from 'lucide-react';

interface TrendsStatsCardsProps {
  data?: {
    trendingContent: any[];
    trendingMusic: any[];
    trendingHashtags: any[];
    insights: {
      sentimentAnalysis: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function TrendsStatsCards({ data }: TrendsStatsCardsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mt-1" />
                </div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalViews = data.trendingContent.reduce(
    (sum, content) => sum + (content.metrics?.views || 0),
    0
  );

  const totalEngagement = data.trendingContent.reduce(
    (sum, content) =>
      sum + (content.metrics?.likes || 0) + (content.metrics?.comments || 0),
    0
  );

  const avgViralityScore =
    data.trendingContent.length > 0
      ? Math.round(
          data.trendingContent.reduce(
            (sum, content) => sum + (content.viralityScore || 0),
            0
          ) / data.trendingContent.length
        )
      : 0;

  const stats = [
    {
      title: 'Viral Content',
      value: data.trendingContent.length.toString(),
      icon: FlameIcon,
      color: 'text-orange-600'
    },
    {
      title: 'Trending Music',
      value: data.trendingMusic.length.toString(),
      icon: MusicIcon,
      color: 'text-green-600'
    },
    {
      title: 'Hot Hashtags',
      value: data.trendingHashtags.length.toString(),
      icon: HashIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Total Views',
      value: formatNumber(totalViews),
      icon: EyeIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Virality',
      value: `${avgViralityScore}%`,
      icon: TrendingUpIcon,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <IconComponent className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
