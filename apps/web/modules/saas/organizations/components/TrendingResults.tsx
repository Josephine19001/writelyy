'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Progress } from '@ui/components/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/tabs';
import {
  TrendingUpIcon,
  MusicIcon,
  VideoIcon,
  HashIcon,
  ExternalLinkIcon,
  FlameIcon,
  EyeIcon,
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  ClockIcon,
  BarChart3Icon,
  PlayIcon,
  BookmarkIcon
} from 'lucide-react';

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

interface TrendingResultsProps {
  searchQuery: string;
  isLoading: boolean;
  data?: {
    trendingContent: TrendingContent[];
    trendingMusic: TrendingMusic[];
    trendingHashtags: TrendingHashtag[];
    insights: {
      topCategories: string[];
      peakTimes: string[];
      demographics: { ageGroup: string; percentage: number }[];
      sentimentAnalysis: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
}

// Mock data for demonstration
const mockData = {
  trendingContent: [
    {
      id: '1',
      title: 'Easy 5-Minute Vegan Breakfast',
      description:
        'Quick and healthy vegan breakfast ideas that will change your morning routine!',
      platform: 'TikTok',
      author: '@healthyeats',
      url: 'https://tiktok.com/@healthyeats/video/123',
      thumbnail: '/images/product-features/analysis-light.png',
      metrics: {
        views: 2400000,
        likes: 340000,
        comments: 12000,
        shares: 45000,
        engagementRate: 16.5
      },
      viralityScore: 94,
      hashtags: [
        '#veganbreakfast',
        '#healthyeating',
        '#quickmeals',
        '#plantbased'
      ],
      musicTrack: {
        name: 'Cooking Vibes',
        artist: 'Kitchen Beats',
        url: '#'
      },
      contentType: 'Video',
      postedAt: '2024-01-15T10:00:00Z',
      isRising: true
    },
    {
      id: '2',
      title: 'Vegan Protein Bowl Recipe',
      description: 'Complete guide to building the perfect vegan protein bowl',
      platform: 'Instagram',
      author: '@veganfoodie',
      url: 'https://instagram.com/p/abc123',
      metrics: {
        views: 890000,
        likes: 67000,
        comments: 3400,
        shares: 12000,
        engagementRate: 9.2
      },
      viralityScore: 78,
      hashtags: ['#veganprotein', '#healthybowl', '#mealprep'],
      contentType: 'Carousel',
      postedAt: '2024-01-14T14:30:00Z',
      isRising: false
    }
  ],
  trendingMusic: [
    {
      id: '1',
      trackName: 'Cooking Time',
      artist: 'Kitchen Sounds',
      platform: 'TikTok',
      usageCount: 45000,
      growthRate: 234,
      genres: ['Lo-fi', 'Cooking'],
      duration: 30,
      isRising: true
    },
    {
      id: '2',
      trackName: 'Healthy Vibes',
      artist: 'Wellness Beats',
      platform: 'TikTok',
      usageCount: 23000,
      growthRate: 156,
      genres: ['Upbeat', 'Health'],
      duration: 15,
      isRising: true
    }
  ],
  trendingHashtags: [
    {
      id: '1',
      hashtag: '#veganrecipes',
      platform: 'TikTok',
      usageCount: 1200000,
      growthRate: 45,
      category: 'Food',
      relatedTags: ['#plantbased', '#healthy', '#cooking'],
      isRising: true
    },
    {
      id: '2',
      hashtag: '#quickmeals',
      platform: 'Instagram',
      usageCount: 890000,
      growthRate: 32,
      category: 'Lifestyle',
      relatedTags: ['#mealprep', '#busy', '#cooking'],
      isRising: false
    }
  ],
  insights: {
    topCategories: ['Food & Cooking', 'Health & Wellness', 'Lifestyle'],
    peakTimes: ['7:00 AM', '12:00 PM', '6:00 PM'],
    demographics: [
      { ageGroup: '18-24', percentage: 35 },
      { ageGroup: '25-34', percentage: 42 },
      { ageGroup: '35-44', percentage: 18 },
      { ageGroup: '45+', percentage: 5 }
    ],
    sentimentAnalysis: { positive: 78, negative: 12, neutral: 10 }
  }
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function ContentCard({ content }: { content: TrendingContent }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {content.thumbnail && (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <PlayIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {content.isRising && (
            <Badge className="bg-red-500 text-white">
              <TrendingUpIcon className="h-3 w-3 mr-1" />
              Rising
            </Badge>
          )}
          <Badge className="bg-primary text-primary-foreground">
            {content.viralityScore}% viral
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2">
              {content.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {content.author} • {content.platform}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {content.description}
        </p>

        <div className="grid grid-cols-4 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            {formatNumber(content.metrics.views)}
          </div>
          <div className="flex items-center gap-1">
            <HeartIcon className="h-3 w-3" />
            {formatNumber(content.metrics.likes)}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="h-3 w-3" />
            {formatNumber(content.metrics.comments)}
          </div>
          <div className="flex items-center gap-1">
            <ShareIcon className="h-3 w-3" />
            {formatNumber(content.metrics.shares)}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Engagement Rate</span>
            <span>{content.metrics.engagementRate}%</span>
          </div>
          <Progress value={content.metrics.engagementRate} className="h-1" />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {content.hashtags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="text-xs border">
              {tag}
            </Badge>
          ))}
          {content.hashtags.length > 3 && (
            <Badge className="text-xs border">
              +{content.hashtags.length - 3}
            </Badge>
          )}
        </div>

        {content.musicTrack && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs mb-3">
            <MusicIcon className="h-3 w-3" />
            <span className="flex-1">
              {content.musicTrack.name} - {content.musicTrack.artist}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <ExternalLinkIcon className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" className="flex-1">
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MusicCard({ music }: { music: TrendingMusic }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{music.trackName}</h3>
            <p className="text-xs text-muted-foreground">{music.artist}</p>
          </div>
          {music.isRising && (
            <Badge className="bg-red-500 text-white">
              <TrendingUpIcon className="h-3 w-3 mr-1" />+{music.growthRate}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{formatNumber(music.usageCount)} uses</span>
          <span>•</span>
          <span>{music.duration}s</span>
          <span>•</span>
          <span>{music.platform}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {music.genres.map((genre) => (
            <Badge key={genre} className="text-xs border">
              {genre}
            </Badge>
          ))}
        </div>

        <Button size="sm" className="w-full">
          <PlayIcon className="h-3 w-3 mr-1" />
          Preview Sound
        </Button>
      </CardContent>
    </Card>
  );
}

function HashtagCard({ hashtag }: { hashtag: TrendingHashtag }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{hashtag.hashtag}</h3>
            <p className="text-xs text-muted-foreground">{hashtag.category}</p>
          </div>
          {hashtag.isRising && (
            <Badge className="bg-red-500 text-white">
              <TrendingUpIcon className="h-3 w-3 mr-1" />+{hashtag.growthRate}%
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {formatNumber(hashtag.usageCount)} posts • {hashtag.platform}
        </div>

        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Related tags:</p>
          <div className="flex flex-wrap gap-1">
            {hashtag.relatedTags.map((tag) => (
              <Badge key={tag} className="text-xs border">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button size="sm" className="w-full">
          <HashIcon className="h-3 w-3 mr-1" />
          Explore Tag
        </Button>
      </CardContent>
    </Card>
  );
}

export function TrendingResults({
  searchQuery,
  isLoading,
  data = mockData
}: TrendingResultsProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Searching for trending content...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!searchQuery) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlameIcon className="h-5 w-5 text-orange-500" />
            Trending Results for "{searchQuery}"
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.trendingContent.length}
              </div>
              <div className="text-muted-foreground">Viral Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.trendingMusic.length}
              </div>
              <div className="text-muted-foreground">Trending Sounds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.trendingHashtags.length}
              </div>
              <div className="text-muted-foreground">Hot Hashtags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.insights.sentimentAnalysis.positive}%
              </div>
              <div className="text-muted-foreground">Positive Sentiment</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Trending Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <VideoIcon className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <MusicIcon className="h-4 w-4" />
            Music
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="flex items-center gap-2">
            <HashIcon className="h-4 w-4" />
            Hashtags
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.trendingContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="music" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.trendingMusic.map((music) => (
              <MusicCard key={music.id} music={music} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.trendingHashtags.map((hashtag) => (
              <HashtagCard key={hashtag.id} hashtag={hashtag} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.insights.topCategories.map((category, index) => (
                    <div key={category} className="flex items-center gap-2">
                      <Badge className="border">{index + 1}</Badge>
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peak Posting Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.insights.peakTimes.map((time) => (
                    <div key={time} className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.insights.demographics.map((demo) => (
                    <div key={demo.ageGroup}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{demo.ageGroup}</span>
                        <span>{demo.percentage}%</span>
                      </div>
                      <Progress value={demo.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600">Positive</span>
                      <span>{data.insights.sentimentAnalysis.positive}%</span>
                    </div>
                    <Progress
                      value={data.insights.sentimentAnalysis.positive}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-yellow-600">Neutral</span>
                      <span>{data.insights.sentimentAnalysis.neutral}%</span>
                    </div>
                    <Progress
                      value={data.insights.sentimentAnalysis.neutral}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600">Negative</span>
                      <span>{data.insights.sentimentAnalysis.negative}%</span>
                    </div>
                    <Progress
                      value={data.insights.sentimentAnalysis.negative}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
