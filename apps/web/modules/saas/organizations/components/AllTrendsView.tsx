'use client';

import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { TrendsHeader } from './TrendsHeader';
import { TrendsStatsCards } from './TrendsStatsCards';
import { TrendsTable } from './TrendsTable';
import { ErrorSection } from '@saas/shared/components/ErrorSection';
import { useTrendsSearch, type TrendSearchParams } from '../lib/trends-api';
import { useDebounceValue } from 'usehooks-ts';
import { toast } from 'sonner';

interface AllTrendsViewProps {
  organizationId: string;
}

export interface AllTrendsViewRef {
  triggerSearch: (query: string) => void;
}

export const AllTrendsView = forwardRef<AllTrendsViewRef, AllTrendsViewProps>(
  ({ organizationId: _organizationId }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [trendsData, setTrendsData] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
    const trendsMutation = useTrendsSearch();

    const performSearch = async (searchQuery?: string) => {
      const query = searchQuery || debouncedSearchTerm;
      if (!query.trim()) return;

      const searchParams: TrendSearchParams = {
        topic: query,
        keywords: [],
        niche: selectedCategory !== 'all' ? selectedCategory : '',
        demographic: '',
        industry: '',
        location: '',
        socialMedia:
          selectedPlatform !== 'all'
            ? [selectedPlatform]
            : ['tiktok', 'instagram', 'youtube'],
        contentType: '',
        timeframe: selectedTimeframe,
        language: 'en'
      };

      try {
        setHasSearched(true);
        const data = await trendsMutation.mutateAsync(searchParams);
        setTrendsData(data);
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Failed to search trends. Please try again.');
      }
    };

    // Auto-search when filters change (if there's a search term)
    useEffect(() => {
      if (debouncedSearchTerm.trim()) {
        performSearch();
      }
    }, [
      debouncedSearchTerm,
      selectedPlatform,
      selectedTimeframe,
      selectedCategory,
      performSearch
    ]);

    useImperativeHandle(ref, () => ({
      triggerSearch: (query: string) => {
        setSearchTerm(query);
        performSearch(query);
      }
    }));

    const handleAnalyzeContent = (content: any) => {
      toast.success(`Analyzing "${content.title}"`);
      // TODO: Implement content analysis
    };

    const handleViewContent = (url: string) => {
      window.open(url, '_blank');
    };

    const handleSaveMusic = (music: any) => {
      toast.success(`Saved "${music.trackName}" to your collection`);
      // TODO: Implement music saving
    };

    const handleExploreHashtag = (hashtag: any) => {
      setSearchTerm(hashtag.hashtag);
      performSearch(hashtag.hashtag);
    };

    const handleRetry = () => {
      if (searchTerm.trim()) {
        performSearch();
      }
    };

    if (trendsMutation.isError) {
      return (
        <div className="space-y-4 lg:space-y-6">
          <TrendsHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <ErrorSection
            title="Failed to search trends"
            message="Unable to fetch trending data. Please try again."
            onRetry={handleRetry}
            variant="card"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4 lg:space-y-6">
        <TrendsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {trendsMutation.isPending && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <div className="text-muted-foreground">
                Searching trending content...
              </div>
            </div>
          </div>
        )}

        {!trendsMutation.isPending && trendsData && (
          <>
            <TrendsStatsCards data={trendsData} />
            <TrendsTable
              data={trendsData}
              onAnalyzeContent={handleAnalyzeContent}
              onViewContent={handleViewContent}
              onSaveMusic={handleSaveMusic}
              onExploreHashtag={handleExploreHashtag}
            />
          </>
        )}

        {!trendsMutation.isPending && !trendsData && hasSearched && (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">
              No trending content found. Try a different search term or adjust
              filters.
            </div>
          </div>
        )}

        {!hasSearched && !trendsMutation.isPending && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Search for trending content, music, and hashtags
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching for topics like "vegan recipes", "fitness", or
                "tech reviews"
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AllTrendsView.displayName = 'AllTrendsView';
