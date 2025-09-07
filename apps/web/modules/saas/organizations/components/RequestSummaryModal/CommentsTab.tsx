import { useState } from 'react';
import { Button } from '@ui/components/button';
import { Badge } from '@ui/components/badge';
import { Input } from '@ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import {
  ThumbsUpIcon,
  SearchIcon,
  HelpCircleIcon,
  LightbulbIcon,
  AlertTriangleIcon
} from 'lucide-react';
import type { Post } from '../../lib/posts-utils';

interface CommentsTabProps {
  post: Post;
}

export function CommentsTab({ post }: CommentsTabProps) {
  const [commentSearch, setCommentSearch] = useState('');
  const [commentSort, setCommentSort] = useState<'newest' | 'oldest' | 'likes'>(
    'newest'
  );
  const [sentimentFilter, setSentimentFilter] = useState<
    'all' | 'positive' | 'negative' | 'neutral' | 'compliment'
  >('all');
  const [commentTypeFilter, setCommentTypeFilter] = useState<
    'all' | 'feedback' | 'issue' | 'question'
  >('all');

  // Helper function to determine comment type from structured arrays
  const getCommentType = (
    commentIndex: number
  ): 'FEEDBACK' | 'QUESTION' | 'ISSUE' | undefined => {
    if (!post.analysis) return undefined;

    const oneBasedIndex = commentIndex + 1; // Convert to 1-based index for AI data

    // Check if comment is in feedback arrays
    if (
      post.analysis.feedback?.some((f) => f.commentIds?.includes(oneBasedIndex))
    ) {
      return 'FEEDBACK';
    }

    // Check if comment is in questions arrays
    if (
      post.analysis.questions?.some((q) =>
        q.commentIds?.includes(oneBasedIndex)
      )
    ) {
      return 'QUESTION';
    }

    // Check if comment is in issues arrays
    if (
      post.analysis.issues?.some((i) => i.commentIds?.includes(oneBasedIndex))
    ) {
      return 'ISSUE';
    }

    return undefined;
  };

  // Function to get filtered comments count
  const getFilteredCommentsCount = () => {
    if (!post.comments) return 0;

    return post.comments.filter((comment, index) => {
      const commentType = getCommentType(index);

      const matchesSearch =
        commentSearch === '' ||
        comment.content.toLowerCase().includes(commentSearch.toLowerCase()) ||
        comment.author?.toLowerCase().includes(commentSearch.toLowerCase());

      const matchesType =
        commentTypeFilter === 'all' ||
        (commentTypeFilter === 'feedback' && commentType === 'FEEDBACK') ||
        (commentTypeFilter === 'issue' && commentType === 'ISSUE') ||
        (commentTypeFilter === 'question' && commentType === 'QUESTION');

      const matchesSentiment =
        sentimentFilter === 'all' ||
        (sentimentFilter === 'positive' && comment.sentiment === 'POSITIVE') ||
        (sentimentFilter === 'negative' && comment.sentiment === 'NEGATIVE') ||
        (sentimentFilter === 'neutral' && comment.sentiment === 'NEUTRAL') ||
        (sentimentFilter === 'compliment' &&
          comment.sentiment === 'COMPLIMENT');

      return matchesSearch && matchesType && matchesSentiment;
    }).length;
  };

  const filteredComments =
    post.comments
      ?.filter((comment, index) => {
        const commentType = getCommentType(index);

        const matchesSearch =
          commentSearch === '' ||
          comment.content.toLowerCase().includes(commentSearch.toLowerCase()) ||
          comment.author?.toLowerCase().includes(commentSearch.toLowerCase());

        const matchesType =
          commentTypeFilter === 'all' ||
          (commentTypeFilter === 'feedback' && commentType === 'FEEDBACK') ||
          (commentTypeFilter === 'issue' && commentType === 'ISSUE') ||
          (commentTypeFilter === 'question' && commentType === 'QUESTION');

        const matchesSentiment =
          sentimentFilter === 'all' ||
          (sentimentFilter === 'positive' &&
            comment.sentiment === 'POSITIVE') ||
          (sentimentFilter === 'negative' &&
            comment.sentiment === 'NEGATIVE') ||
          (sentimentFilter === 'neutral' && comment.sentiment === 'NEUTRAL') ||
          (sentimentFilter === 'compliment' &&
            comment.sentiment === 'COMPLIMENT');

        return matchesSearch && matchesType && matchesSentiment;
      })
      ?.map((comment, originalIndex) => {
        // Find the original index in the full comments array
        const fullIndex =
          post.comments?.findIndex((c) => c === comment) ?? originalIndex;
        return { ...comment, originalIndex: fullIndex };
      }) || [];

  const sortedComments = filteredComments.sort((a, b) => {
    if (commentSort === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1 mr-4">
          {(commentSearch !== '' ||
            commentTypeFilter !== 'all' ||
            sentimentFilter !== 'all') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCommentSearch('');
                setCommentTypeFilter('all');
                setSentimentFilter('all');
              }}
              className="text-xs flex-shrink-0"
            >
              Clear Filters
            </Button>
          )}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search comments..."
              value={commentSearch}
              onChange={(e) => setCommentSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          <Select
            value={commentTypeFilter}
            onValueChange={(value: typeof commentTypeFilter) =>
              setCommentTypeFilter(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Comment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="feedback">
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="h-4 w-4" />
                  Feedback
                </div>
              </SelectItem>
              <SelectItem value="issue">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  Issue
                </div>
              </SelectItem>
              <SelectItem value="question">
                <div className="flex items-center gap-2">
                  <HelpCircleIcon className="h-4 w-4" />
                  Question
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sentimentFilter}
            onValueChange={(value: typeof sentimentFilter) =>
              setSentimentFilter(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="compliment">Compliment</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={commentSort}
            onValueChange={(value: typeof commentSort) => setCommentSort(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {post.comments && post.comments.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedComments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {commentSearch !== '' ||
                commentTypeFilter !== 'all' ||
                sentimentFilter !== 'all'
                  ? 'No comments match your current filters. Try adjusting your search or filters.'
                  : 'No comments available.'}
              </p>
            </div>
          ) : (
            sortedComments.map((comment, index) => {
              const commentType = getCommentType(comment.originalIndex);
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {comment.author && (
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {comment.author}
                        </span>
                      )}
                      {comment.sentiment && (
                        <Badge
                          className={`text-xs ${
                            comment.sentiment === 'POSITIVE'
                              ? 'bg-green-100 text-green-700'
                              : comment.sentiment === 'NEGATIVE'
                                ? 'bg-red-100 text-red-700'
                                : comment.sentiment === 'NEUTRAL'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {comment.sentiment}
                        </Badge>
                      )}
                      {commentType && (
                        <Badge
                          className={`text-xs ${
                            commentType === 'FEEDBACK'
                              ? 'bg-blue-100 text-blue-700'
                              : commentType === 'ISSUE'
                                ? 'bg-red-100 text-red-700'
                                : commentType === 'QUESTION'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {commentType}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {comment.likes && comment.likes > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {comment.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No comments available for this post.
          </p>
        </div>
      )}
    </div>
  );
}
