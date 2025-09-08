'use client';

import { useMonthlyUsage } from '@shared/hooks/use-monthly-usage';
import { Progress } from '@ui/components/progress';
import { Card } from '@ui/components/card';
import { AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@ui/lib';

interface MonthlyUsageDisplayProps {
  className?: string;
  showBreakdown?: boolean;
}

export function MonthlyUsageDisplay({
  className,
  showBreakdown = true
}: MonthlyUsageDisplayProps) {
  const {
    stats,
    isLoading,
    currentUsageFormatted,
    wordLimitFormatted,
    remainingWordsFormatted,
    usagePercentageRounded,
    isApproachingLimit,
    hasExceededLimit,
    getWarningMessage
  } = useMonthlyUsage();

  if (isLoading) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-2 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  const warningMessage = getWarningMessage();

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Monthly Usage</h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">
            {currentUsageFormatted} / {wordLimitFormatted}
          </div>
          <div className="text-xs text-muted-foreground">words used</div>
        </div>
      </div>

      <div className="space-y-2">
        <Progress
          value={usagePercentageRounded}
          className={cn(
            'h-2',
            hasExceededLimit && 'bg-red-100',
            isApproachingLimit && !hasExceededLimit && 'bg-orange-100'
          )}
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{usagePercentageRounded}% used</span>
          <span>{remainingWordsFormatted} remaining</span>
        </div>
      </div>

      {warningMessage && (
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-lg text-xs',
            hasExceededLimit
              ? 'bg-red-50 text-red-700'
              : 'bg-orange-50 text-orange-700'
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>{warningMessage}</span>
        </div>
      )}

      {showBreakdown && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Breakdown
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Humanizer:</span>
              <span>{stats.breakdown.humanizer.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Detector:</span>
              <span>{stats.breakdown.detector.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Summariser:</span>
              <span>{stats.breakdown.summariser.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Paraphraser:</span>
              <span>{stats.breakdown.paraphraser.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
