'use client';

import { useState, useEffect } from 'react';
import { Button } from '@ui/components/button';
import { Input } from '@ui/components/input';
import { Textarea } from '@ui/components/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import { Label } from '@ui/components/label';
import { AlertTriangleIcon, InfoIcon } from 'lucide-react';
import {
  getPlatformSelectOptions,
  type Platform,
  detectPlatformFromUrl
} from '@shared/lib/platforms';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { toast } from 'sonner';

// Comment limit options - simple list starting from 100
const getCommentLimitOptions = (availableComments: number) => {
  const baseOptions = [
    {
      value: 100,
      label: '100 comments'
    },
    {
      value: 500,
      label: '500 comments'
    },
    {
      value: 1000,
      label: '1,000 comments'
    },
    {
      value: 2000,
      label: '2,000 comments'
    },
    {
      value: 3500,
      label: '3,500 comments'
    },
    {
      value: 5000,
      label: '5,000 comments'
    }
  ];

  // Add user's available comments as an option if it's useful
  if (availableComments > 10) {
    const exactOption = {
      value: availableComments,
      label: `${availableComments.toLocaleString()} comments (all available)`
    };

    // Check if this value already exists in base options
    const existsInBase = baseOptions.some(
      (option) => option.value === availableComments
    );

    if (!existsInBase) {
      // Insert the exact option in the right position (sorted by value)
      const insertIndex = baseOptions.findIndex(
        (option) => option.value > availableComments
      );
      if (insertIndex === -1) {
        // Larger than all existing options, add at the end
        baseOptions.push(exactOption);
      } else {
        // Insert at the correct position
        baseOptions.splice(insertIndex, 0, exactOption);
      }
    }
  }

  return baseOptions;
};

// Platform-specific recommendations
const PLATFORM_RECOMMENDATIONS = {
  TIKTOK: 2000,
  YOUTUBE: 3500,
  INSTAGRAM: 1000,
  X: 1000,
  REDDIT: 3500
};

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    url: string,
    platform: Platform,
    commentLimit?: number,
    caption?: string
  ) => Promise<void>;
  isSubmitting?: boolean;
  organizationId?: string;
}

export function AddPostModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting: externalIsSubmitting
}: AddPostModalProps) {
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostPlatform, setNewPostPlatform] = useState<Platform | ''>('');
  const [commentLimit, setCommentLimit] = useState<number>(1500); // Optimized default for performance
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRemainingUsage, canAnalyzeComments } = useUsageLimits();

  // Get available credits
  const availableCredits = getRemainingUsage('comments');

  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalIsSubmitting || isSubmitting;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewPostUrl('');
      setNewPostPlatform('');
      setCommentLimit(1000);
      setCaption('');
    }
  }, [isOpen]);

  const handleUrlChange = (url: string) => {
    setNewPostUrl(url);
    const detectedPlatform = detectPlatformFromUrl(url);
    setNewPostPlatform(detectedPlatform);

    // Set recommended comment limit based on platform
    if (detectedPlatform) {
      const recommendedLimit =
        PLATFORM_RECOMMENDATIONS[
          detectedPlatform as keyof typeof PLATFORM_RECOMMENDATIONS
        ];
      if (recommendedLimit) {
        setCommentLimit(recommendedLimit);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newPostUrl || !newPostPlatform) {
      return;
    }

    // Check if user has enough credits
    if (!canAnalyzeComments(commentLimit)) {
      toast.error(
        `You need ${commentLimit} comments available to analyze this many comments. You have ${availableCredits} comments available.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(newPostUrl, newPostPlatform, commentLimit, caption);
      onClose();
      setNewPostUrl('');
      setNewPostPlatform('');
      setCommentLimit(1000);
      setCaption('');
    } catch (error) {
      // Error handling is done in the parent component
      onClose();
      setNewPostUrl('');
      setNewPostPlatform('');
      setCommentLimit(1000);
      setCaption('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can afford a comment limit option
  const canAffordOption = (comments: number) => {
    return availableCredits >= comments;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] p-0 flex flex-col sm:w-full">
        {/* Fixed Header */}
        <DialogHeader className="px-4 sm:px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            Add New Post
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {availableCredits.toLocaleString()} comments available
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="post-url"
                className="text-sm font-medium mb-2 block"
              >
                Post URL
              </label>
              <Input
                id="post-url"
                placeholder="Paste TikTok, Instagram, YouTube, or X URL"
                value={newPostUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Platform will be auto-detected from the URL.
              </p>
            </div>

            <div>
              <label
                htmlFor="post-platform"
                className="text-sm font-medium mb-2 block"
              >
                Platform{' '}
                {newPostPlatform && (
                  <span className="text-xs text-green-600">
                    (Auto-detected)
                  </span>
                )}
              </label>
              <Select
                value={newPostPlatform}
                onValueChange={(value) => setNewPostPlatform(value as Platform)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Paste URL above to auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {getPlatformSelectOptions(false).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!newPostPlatform && newPostUrl && (
                <p className="text-xs text-amber-600 mt-1">
                  Platform not recognized. Please select manually.
                </p>
              )}
            </div>

            {/* Caption Field */}
            <div>
              <Label
                htmlFor="caption"
                className="text-sm font-medium mb-2 block"
              >
                Caption (Optional)
              </Label>
              <Textarea
                id="caption"
                placeholder="Enter the post caption or description..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Helps you identify post.
              </p>
            </div>

            {/* Comment Limit Selector */}
            <div>
              <Label
                htmlFor="comment-limit"
                className="text-sm font-medium mb-2 block"
              >
                Comment Limit
              </Label>
              <Input
                id="comment-limit"
                type="number"
                min="50"
                max={availableCredits}
                value={commentLimit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  // Allow any value to be typed, validation happens on submit
                  if (!Number.isNaN(value) && value >= 0) {
                    setCommentLimit(value);
                  }
                }}
                disabled={isLoading}
                className="w-full"
                placeholder="Enter number of comments"
              />

              {/* Validation and information */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1">
                  <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Maximum: {availableCredits.toLocaleString()} comments (your
                    available balance)
                  </p>
                </div>

                {commentLimit > availableCredits && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangleIcon className="h-3 w-3" />
                    <p className="text-xs">
                      You don't have enough credits for{' '}
                      {commentLimit.toLocaleString()} comments
                    </p>
                  </div>
                )}

                {commentLimit < 50 && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangleIcon className="h-3 w-3" />
                    <p className="text-xs">
                      Minimum 50 comments required for meaningful analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="px-4 sm:px-6 py-4 border-t bg-background shrink-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !newPostUrl ||
                !newPostPlatform ||
                commentLimit < 50 ||
                !canAffordOption(commentLimit)
              }
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
