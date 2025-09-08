'use client';

import { Card, CardContent } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { MoreVerticalIcon, CopyIcon, TrashIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@ui/components/dropdown-menu';
import { cn } from '@ui/lib';
import { useTranslations } from 'next-intl';

interface TextHistoryItemProps {
  id: string;
  originalText: string;
  processedText?: string;
  type: 'humanized' | 'detected' | 'summarised' | 'paraphrased';
  status?: 'processing' | 'completed' | 'failed';
  timestamp: Date;
  aiScore?: number;
  onCopy?: (text: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function TextHistoryItem({
  id,
  originalText,
  processedText,
  type,
  status = 'completed',
  timestamp,
  aiScore,
  onCopy,
  onDelete,
  onClick,
  className
}: TextHistoryItemProps) {
  const t = useTranslations();
  const truncateText = (text: string, maxLength = 50) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getStatusBadge = () => {
    if (type === 'detected' && typeof aiScore === 'number') {
      const badgeStatus =
        aiScore > 70 ? 'error' : aiScore > 30 ? 'warning' : 'success';
      return <Badge status={badgeStatus}>{aiScore}% AI</Badge>;
    }
    return null;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) {
      return hours === 0
        ? t('history.justNow')
        : t('history.hoursAgo', { hours });
    }
    if (days < 7) {
      return t('history.daysAgo', { days });
    }
    return date.toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow duration-200 border border-slate-200 dark:border-slate-700',
        className
      )}
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge() && getStatusBadge()}
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(timestamp)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground leading-relaxed">
                {truncateText(originalText)}
              </p>

              {processedText && status === 'completed' && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t('history.result')}
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {truncateText(processedText, 40)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy?.(processedText || originalText);
                }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                {t('history.copy')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                }}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                {t('history.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
