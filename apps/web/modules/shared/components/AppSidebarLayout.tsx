'use client';

import { SearchBar } from '@shared/components/SearchBar';
import { TextHistoryItem } from '@shared/components/TextHistoryItem';
import { ToolSelector } from '@shared/components/ToolSelector';
import { Button } from '@ui/components/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@ui/lib';
import { UserMenu } from '@saas/shared/components/UserMenu';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { Progress } from '@ui/components/progress';
import { useTranslations } from 'next-intl';

interface TextHistoryEntry {
  id: string;
  originalText: string;
  processedText?: string;
  type: 'humanized' | 'detected' | 'summarised' | 'paraphrased';
  status?: 'processing' | 'completed' | 'failed';
  timestamp: Date;
  aiScore?: number;
}

interface AppSidebarLayoutProps {
  children: React.ReactNode;
  historyEntries: TextHistoryEntry[];
  onHistoryItemClick?: (id: string) => void;
  onHistoryItemCopy?: (text: string) => void;
  onHistoryItemDelete?: (id: string) => void;
  currentPage: 'humanizer' | 'detector' | 'paraphraser' | 'summariser';
  className?: string;
}

export function AppSidebarLayout({
  children,
  historyEntries,
  onHistoryItemClick,
  onHistoryItemCopy,
  onHistoryItemDelete,
  currentPage,
  className
}: AppSidebarLayoutProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { monthlyUsage } = useUsageLimits();

  console.log('--monthlyUsage', monthlyUsage);

  const filteredEntries = historyEntries.filter(
    (entry) =>
      entry.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.processedText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onHistoryItemCopy?.(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className={cn('flex h-screen relative', className)}>
      {/* Mobile Menu Button - positioned in top bar */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9 p-0 bg-background/90 backdrop-blur-sm border-border/50"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-4 w-4" />
          ) : (
            <MenuIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label={t('sidebar.closeMenu')}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={cn(
          'bg-background border-r border-border/50 flex flex-col transition-all duration-200',
          // Desktop behavior
          'lg:relative',
          isCollapsed ? 'lg:w-12' : 'lg:w-72',
          // Mobile behavior
          'fixed lg:static inset-y-0 left-0 z-40 w-72',
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Section - Tool Selector & Toggle */}
        <div
          className={cn(
            'flex-shrink-0 p-3 pb-2 flex items-center gap-2 border-b border-border/30',
            // Mobile: always show full layout, Desktop: respect collapse state
            'lg:justify-between justify-between',
            isCollapsed && 'lg:justify-center'
          )}
        >
          {/* Show ToolSelector on mobile or when desktop is not collapsed */}
          {(!isCollapsed || isMobileMenuOpen) && (
            <ToolSelector currentTool={currentPage} className="flex-1" />
          )}

          {/* Desktop collapse toggle - hidden on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 p-0 hover:bg-muted/50"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Show content on mobile when menu is open, or on desktop when not collapsed */}
        {(isMobileMenuOpen || !isCollapsed) && (
          <>
            {/* Search */}
            <div className="px-3 py-3">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder={t('sidebar.searchPlaceholder')}
                className="h-7 text-sm bg-background border border-slate-200 dark:border-slate-700 focus-within:border-slate-300 dark:focus-within:border-slate-600 rounded-md"
              />
            </div>

            {/* History List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {filteredEntries.length > 0 ? (
                <div className="space-y-1">
                  {filteredEntries.map((entry) => (
                    <TextHistoryItem
                      key={entry.id}
                      {...entry}
                      onCopy={handleCopy}
                      onDelete={onHistoryItemDelete}
                      onClick={onHistoryItemClick}
                      className="text-xs"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? t('sidebar.noMatches')
                      : t('sidebar.noHistory')}
                  </p>
                </div>
              )}
            </div>

            {/* User Section at Bottom with Credits */}
            <div className="border-t border-border/30 p-3 space-y-3">
              {/* Words Usage Display with Progress */}
              <div className="px-1">
                {/* Progress bar for word usage */}
                <div className="space-y-2">
                  <Progress
                    value={monthlyUsage.usagePercentage}
                    className="h-1.5"
                  />
                  <div className="text-xs text-muted-foreground">
                    {monthlyUsage.currentUsage.toLocaleString()} of{' '}
                    {monthlyUsage.wordLimit.toLocaleString()} words used this
                    month
                  </div>
                </div>
              </div>

              <UserMenu showUserName={true} />
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-background lg:ml-0">
        {/* Mobile top bar spacer */}
        <div className="lg:hidden h-14 flex-shrink-0" />
        {children}
      </div>
    </div>
  );
}
