'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Progress } from '@ui/components/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ui/components/table';
import {
  TrendingUpIcon,
  MusicIcon,
  VideoIcon,
  HashIcon,
  ExternalLinkIcon,
  EyeIcon,
  HeartIcon,
  MessageCircleIcon,
  PlayIcon,
  BarChart3Icon
} from 'lucide-react';

interface TrendingContent {
  id: string;
  title: string;
  description: string;
  platform: string;
  author: string;
  url: string;
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

interface TrendsTableProps {
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
  onAnalyzeContent?: (content: TrendingContent) => void;
  onViewContent?: (url: string) => void;
  onSaveMusic?: (music: TrendingMusic) => void;
  onExploreHashtag?: (hashtag: TrendingHashtag) => void;
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function TrendsTable({
  data,
  onAnalyzeContent,
  onViewContent,
  onSaveMusic,
  onExploreHashtag
}: TrendsTableProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (!data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            Use the search above to discover trending content, music, and
            hashtags
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4" />
                Content ({data.trendingContent.length})
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <MusicIcon className="h-4 w-4" />
                Music ({data.trendingMusic.length})
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="flex items-center gap-2">
                <HashIcon className="h-4 w-4" />
                Hashtags ({data.trendingHashtags.length})
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="mt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Virality</TableHead>
                    <TableHead>Trending</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.trendingContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {content.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {content.author}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.slice(0, 2).map((tag) => (
                              <Badge key={tag} className="text-xs border">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border">{content.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-primary text-primary-foreground w-fit">
                            {content.viralityScore}%
                          </Badge>
                          <div className="w-16">
                            <Progress
                              value={content.viralityScore}
                              className="h-1"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {content.isRising && (
                          <Badge className="bg-red-500 text-white">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />
                            Rising
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onViewContent?.(content.url)}
                          >
                            <ExternalLinkIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onAnalyzeContent?.(content)}
                          >
                            Analyze
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Genres</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.trendingMusic.map((music) => (
                    <TableRow key={music.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-sm">
                            {music.trackName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {music.artist}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {music.duration}s
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border">{music.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatNumber(music.usageCount)} uses
                        </div>
                      </TableCell>
                      <TableCell>
                        {music.isRising && (
                          <Badge className="bg-green-500 text-white">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />+
                            {music.growthRate}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {music.genres.map((genre) => (
                            <Badge key={genre} className="text-xs border">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" className="h-7 text-xs">
                            <PlayIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onSaveMusic?.(music)}
                          >
                            Save
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hashtag</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Related Tags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.trendingHashtags.map((hashtag) => (
                    <TableRow key={hashtag.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-sm">
                            {hashtag.hashtag}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {hashtag.category}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border">{hashtag.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatNumber(hashtag.usageCount)} posts
                        </div>
                      </TableCell>
                      <TableCell>
                        {hashtag.isRising && (
                          <Badge className="bg-blue-500 text-white">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />+
                            {hashtag.growthRate}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hashtag.relatedTags.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="text-xs border">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onExploreHashtag?.(hashtag)}
                        >
                          <HashIcon className="h-3 w-3 mr-1" />
                          Explore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <div className="p-6 space-y-6">
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
