import { Badge } from '@ui/components/badge';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import type { Post } from '../../lib/posts-utils';

interface RequestsTabProps {
  post: Post;
}

export function RequestsTab({ post }: RequestsTabProps) {
  return (
    <div>
      {post.analysis?.feedback && post.analysis.feedback.length > 0 ? (
        <div className="space-y-3">
          {post.analysis.feedback
            .sort(
              (a, b) =>
                (b.mentions || b.totalMentions || 0) -
                (a.mentions || a.totalMentions || 0)
            )
            .map((request, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {request.title || request.name || 'Unnamed Feedback'}
                    </h4>
                    <Badge
                      status={
                        request.priority === 'HIGH'
                          ? 'error'
                          : request.priority === 'MODERATE'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {request.priority}
                    </Badge>
                    {/* Sync Status Indicators */}
                    {(request as any).syncStatus &&
                      (request as any).syncStatus.length > 0 && (
                        <Badge status="success" className="text-xs">
                          Synced to {(request as any).syncStatus.join(', ')}
                        </Badge>
                      )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {request.mentions || request.totalMentions || 0} mentions
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      #{index + 1}
                      {index === 0 && (
                        <ArrowUpIcon className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" />
                      )}
                      {index === (post.analysis?.feedback?.length || 0) - 1 &&
                        (post.analysis?.feedback?.length || 0) > 1 && (
                          <ArrowDownIcon className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 break-words">
                    "
                    {request.topComment ||
                      request.description ||
                      'No description available'}
                    "
                  </p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No feedback found in this post.
          </p>
        </div>
      )}
    </div>
  );
}
