'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@ui/components/dialog';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  CalendarIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  HelpCircleIcon
} from 'lucide-react';
import { getPlatformIcon, type Platform } from '@shared/lib/platforms';
import type { RequestRequest } from '../lib/request-types';
import { formatDate } from '../lib/posts-utils';

const contentTypeConfig = {
  FEEDBACK: {
    label: 'Feedback',
    icon: LightbulbIcon,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  },
  ISSUE: {
    label: 'Issue',
    icon: AlertTriangleIcon,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  },
  QUESTION: {
    label: 'Question',
    icon: HelpCircleIcon,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  }
};

const priorityConfig = {
  LOW: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
  },
  MODERATE: {
    label: 'Moderate',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  },
  HIGH: {
    label: 'High',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }
};

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestRequest | null;
}

export function TicketDetailsModal({
  isOpen,
  onClose,
  request
}: TicketDetailsModalProps) {
  if (!request) {
    return null;
  }

  const ContentTypeIcon = contentTypeConfig[request.contentType].icon;
  const PlatformIcon = getPlatformIcon(request.post.platform as Platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ContentTypeIcon className="h-5 w-5" />
            Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {request.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={contentTypeConfig[request.contentType].color}
                    status={null}
                  >
                    {contentTypeConfig[request.contentType].label}
                  </Badge>
                  <Badge
                    className={
                      priorityConfig[
                        request.priority as keyof typeof priorityConfig
                      ]?.color || priorityConfig.MODERATE.color
                    }
                    status={null}
                  >
                    {request.priority} Priority
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {request.topComment}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquareIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Mentions
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {request.totalMentions}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Created
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>

            {/* Source Post */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Source Post
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {PlatformIcon && (
                    <PlatformIcon
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {request.post.platform.toLowerCase()}
                  </span>
                </div>
                {request.post.caption && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {request.post.caption}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(request.post.url, '_blank')}
                  className="gap-2"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  View Original Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
