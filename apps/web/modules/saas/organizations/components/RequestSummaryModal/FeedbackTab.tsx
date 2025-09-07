import { Badge } from '@ui/components/badge';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import type { Post } from '../../lib/posts-utils';

interface FeedbackTabProps {
  post: Post;
}

export function FeedbackTab({ post }: FeedbackTabProps) {
  // Use feedback data from analysis structure
  const feedback = post.analysis?.feedback || [];

  return (
    <div>
      {feedback.length > 0 ? (
        <div className="space-y-3">
          {feedback
            .sort(
              (a, b) =>
                (b.mentions || b.totalMentions || 0) -
                (a.mentions || a.totalMentions || 0)
            )
            .map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.title || item.name || 'Unnamed Feedback'}
                    </h4>
                    <Badge
                      status={
                        item.priority === 'HIGH'
                          ? 'error'
                          : item.priority === 'MODERATE'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {item.priority}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.mentions || item.totalMentions || 0} mention
                      {(item.mentions || item.totalMentions || 0) !== 1
                        ? 's'
                        : ''}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      #{index + 1}
                      {index === 0 && (
                        <ArrowUpIcon className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" />
                      )}
                      {index === feedback.length - 1 && feedback.length > 1 && (
                        <ArrowDownIcon className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 break-words">
                    "
                    {item.topComment ||
                      item.description ||
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
