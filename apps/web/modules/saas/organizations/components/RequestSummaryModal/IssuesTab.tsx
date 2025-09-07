'use client';

import { useState } from 'react';
import { Badge } from '@ui/components/badge';
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from 'lucide-react';
import type { Post } from '../../lib/posts-utils';

interface IssuesTabProps {
  post: Post;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MODERATE' | 'LOW';
  mentions: number;
  topComment: string;
}

export function IssuesTab({ post }: IssuesTabProps) {
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);

  // Extract issues from the unified structure
  const extractIssues = (): Issue[] => {
    const issues: Issue[] = [];

    // Get issues from the analysis issues field
    if (post.analysis?.issues && Array.isArray(post.analysis.issues)) {
      post.analysis.issues.forEach((issue: any, index: number) => {
        issues.push({
          id: `issue-${index}`,
          title: issue.title || issue.name || 'Issue',
          description: issue.description || issue.topComment || '',
          priority: issue.priority || 'MODERATE',
          mentions: issue.mentions || issue.totalMentions || 1,
          topComment: issue.topComment || issue.description || ''
        });
      });
    }

    return issues;
  };

  const issues = extractIssues();
  const totalIssues = issues.length;
  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === 'HIGH'
  );

  const toggleIssue = (issueId: string) => {
    setExpandedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100';
      case 'LOW':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div>
      {totalIssues > 0 ? (
        <div className="space-y-4">
          {/* High Priority Issues Alert */}
          {highPriorityIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-950/20 dark:border-red-800/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-800 dark:text-red-100">
                  High Priority Issues ({highPriorityIssues.length})
                </h4>
              </div>
              <p className="text-sm text-red-700 dark:text-red-200 mb-3">
                These issues require immediate attention based on user feedback.
              </p>
              <div className="space-y-2">
                {highPriorityIssues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className="text-sm text-red-700 dark:text-red-200 flex items-start gap-2"
                  >
                    <span className="text-red-600 dark:text-red-400 mt-1">
                      •
                    </span>
                    <span>{issue.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Issues */}
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            >
              <button
                type="button"
                onClick={() => toggleIssue(issue.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {issue.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {issue.mentions} mention{issue.mentions !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs ${getPriorityColor(issue.priority)}`}
                  >
                    {issue.priority}
                  </Badge>
                  {expandedIssues.includes(issue.id) ? (
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedIssues.includes(issue.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Top Comment
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        "{issue.topComment}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertTriangleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            No issues found in this post. That's great news! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
