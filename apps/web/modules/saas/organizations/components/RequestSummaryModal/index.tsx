'use client';

import type { Post } from '../../lib/posts-utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@ui/components/dialog';
import { useState } from 'react';
import { RequestsTab as FeedbackTab } from './RequestsTab';
import { QuestionsTab } from './QuestionsTab';
import { IssuesTab } from './IssuesTab';
import { SentimentTab } from './SentimentTab';
import { CommentsTab } from './CommentsTab';

interface RequestSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export type TabId =
  | 'feedback'
  | 'questions'
  | 'issues'
  | 'sentiment'
  | 'comments';

export function RequestSummaryModal({
  isOpen,
  onClose,
  post
}: RequestSummaryModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('feedback');

  if (!post) return null;

  // Get counts for each tab
  const getFeedbackCount = () => {
    return post.analysis?.feedback?.length || 0;
  };

  const getQuestionsCount = () => {
    return post.analysis?.questions?.length || 0;
  };

  const getIssuesCount = () => {
    // Count issues from various sources
    let count = 0;
    if (post.analysis?.topConcerns) count += post.analysis.topConcerns.length;
    if (post.analysis?.issues) count += post.analysis.issues.length;
    return count;
  };

  const getSentimentCount = () => {
    return post.analysis ? 1 : 0;
  };

  const getCommentsCount = () => {
    return post.comments?.length || 0;
  };

  const tabs = [
    {
      id: 'feedback' as const,
      label: 'Feedback',
      count: getFeedbackCount()
    },
    {
      id: 'questions' as const,
      label: 'Questions',
      count: getQuestionsCount()
    },
    {
      id: 'issues' as const,
      label: 'Issues',
      count: getIssuesCount()
    },
    {
      id: 'sentiment' as const,
      label: 'Sentiment',
      count: getSentimentCount()
    },
    {
      id: 'comments' as const,
      label: 'Comments',
      count: getCommentsCount()
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Analysis</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">
              {post.caption || 'Untitled Post'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {post.commentCount || 0} comments analyzed
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'feedback' && <FeedbackTab post={post} />}
            {activeTab === 'questions' && <QuestionsTab post={post} />}
            {activeTab === 'issues' && <IssuesTab post={post} />}
            {activeTab === 'sentiment' && <SentimentTab post={post} />}
            {activeTab === 'comments' && <CommentsTab post={post} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
