'use client';

import { Input } from '@ui/components/input';
import { Button } from '@ui/components/button';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@ui/lib';

interface SearchBarProps {
  value?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value = '',
  onSearch,
  onClear,
  placeholder = 'Search your text history...',
  className
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleSearch = (query: string) => {
    setSearchValue(query);
    onSearch?.(query);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchValue);
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 text-sm"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted-foreground/20"
          >
            <XIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
