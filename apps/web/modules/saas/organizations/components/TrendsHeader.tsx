'use client';

import { Input } from '@ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import { SearchIcon, FilterIcon } from 'lucide-react';

interface TrendsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const PLATFORMS = [
  { value: 'all', label: 'All Platforms' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' }
];

const TIMEFRAMES = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' }
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'beauty', label: 'Beauty & Skincare' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'technology', label: 'Technology' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'travel', label: 'Travel' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'entertainment', label: 'Entertainment' }
];

export function TrendsHeader({
  searchTerm,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  selectedTimeframe,
  onTimeframeChange,
  selectedCategory,
  onCategoryChange
}: TrendsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trends, hashtags, keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          {/* Platform Filter */}
          <Select value={selectedPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger className="w-auto min-w-fit">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Platforms" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timeframe Filter */}
          <Select value={selectedTimeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-auto min-w-fit">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-auto min-w-fit">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
