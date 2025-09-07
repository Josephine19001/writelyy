'use client';

import { Input } from '@ui/components/input';
import { SearchIcon, FilterIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import { getPlatformSelectOptions, type Platform } from '@shared/lib/platforms';

interface PostsHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedPlatform: Platform | 'all';
  onPlatformChange: (platform: Platform | 'all') => void;
  selectedStatus: 'all' | 'analyzed' | 'pending';
  onStatusChange: (status: 'all' | 'analyzed' | 'pending') => void;
}

export function PostsHeader({
  searchTerm,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange
}: PostsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts, tags, captions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          {/* Platform Filter */}
          <Select
            value={selectedPlatform}
            onValueChange={(value) =>
              onPlatformChange(value as Platform | 'all')
            }
          >
            <SelectTrigger className="w-auto min-w-fit">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Platforms" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {getPlatformSelectOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              onStatusChange(value as 'all' | 'analyzed' | 'pending')
            }
          >
            <SelectTrigger className="w-auto min-w-fit">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="analyzed">Analyzed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
