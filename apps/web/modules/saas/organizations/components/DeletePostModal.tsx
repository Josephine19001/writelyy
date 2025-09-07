'use client';

import { Button } from '@ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@ui/components/dialog';
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';
import type { Post } from '../lib/posts-utils';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  post: Post | null;
  isDeleting?: boolean;
}

export function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
  post,
  isDeleting = false
}: DeletePostModalProps) {
  if (!post) return null;

  const hasAnalysis = post.analysis;
  const hasComments = post.commentCount && post.commentCount > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangleIcon className="h-5 w-5" />
            Delete Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium">
              {post.caption || 'Post with no caption'}
            </p>
            <p className="text-xs text-muted-foreground">
              Platform: {post.platform} • Created:{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          {(hasComments || hasAnalysis) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    You will permanently lose:
                  </p>
                  <ul className="text-xs text-destructive/80 space-y-1">
                    {hasComments && (
                      <li>• {post.commentCount} scraped comments</li>
                    )}
                    {hasAnalysis && (
                      <>
                        <li>• AI sentiment analysis results</li>
                        <li>
                          • {post.analysis?.feedback?.length || 0} feedback
                          items
                        </li>
                        <li>
                          • {post.analysis?.questions?.length || 0} questions
                        </li>
                        <li>• All insights and analytics data</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="error"
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
