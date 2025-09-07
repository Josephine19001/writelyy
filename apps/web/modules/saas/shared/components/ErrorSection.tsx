'use client';

import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@ui/components/button';
import { Card, CardContent } from '@ui/components/card';

interface ErrorSectionProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
}

export function ErrorSection({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
  variant = 'default'
}: ErrorSectionProps) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      <AlertCircleIcon className="h-12 w-12 text-destructive mb-4" />
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCwIcon className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="py-8">{content}</CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`py-4 ${className}`}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <span className="text-sm">{message}</span>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="ghost"
              size="sm"
              className="h-auto p-1"
            >
              <RefreshCwIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <div className="py-8">{content}</div>;
}
