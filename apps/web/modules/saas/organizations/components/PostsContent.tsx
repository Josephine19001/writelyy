'use client';

import { StatsCards } from './StatsCards';
import { PostsTable } from './PostsTable';
import { AddPostModal } from './AddPostModal';
import { RequestSummaryModal } from './RequestSummaryModal';
import type { Post, Platform } from '../lib/posts-utils';

interface PostsContentProps {
  posts: Post[];
  selectedPost: Post | null;
  isAddPostModalOpen: boolean;
  isFeatureModalOpen: boolean;
  onViewPost: (post: Post) => void;
  onFetchComments: (postId: string) => Promise<void>;
  onRefetchComments: (postId: string) => Promise<void>;
  onAnalyzePost: (postId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onCheckPost: (url: string) => void;
  onAddPost: () => void;
  onSubmitNewPost: (
    url: string,
    platform: Platform,
    commentLimit?: number,
    caption?: string
  ) => Promise<void>;
  onCloseAddModal: () => void;
  onCloseFeatureModal: () => void;
  onToggleAutoSync?: (postId: string, enabled: boolean) => Promise<void>;
  onUpdateCaption?: (postId: string, caption: string) => Promise<void>;
  isCreatingPost?: boolean;
  organizationId?: string;
}

export function PostsContent({
  posts,
  selectedPost,
  isAddPostModalOpen,
  isFeatureModalOpen,
  onViewPost,
  onFetchComments,
  onRefetchComments,
  onAnalyzePost,
  onDeletePost,
  onCheckPost,
  onAddPost,
  onSubmitNewPost,
  onCloseAddModal,
  onCloseFeatureModal,
  onToggleAutoSync,
  onUpdateCaption,
  isCreatingPost = false,
  organizationId
}: PostsContentProps) {
  return (
    <>
      <StatsCards posts={posts} />

      <PostsTable
        posts={posts}
        onViewPost={onViewPost}
        onFetchComments={onFetchComments}
        onRefetchComments={onRefetchComments}
        onAnalyzePost={onAnalyzePost}
        onDeletePost={onDeletePost}
        onCheckPost={onCheckPost}
        onAddPost={onAddPost}
        onToggleAutoSync={onToggleAutoSync}
        onUpdateCaption={onUpdateCaption}
      />

      <AddPostModal
        isOpen={isAddPostModalOpen}
        onClose={onCloseAddModal}
        onSubmit={onSubmitNewPost}
        isSubmitting={isCreatingPost}
        organizationId={organizationId}
      />

      <RequestSummaryModal
        isOpen={isFeatureModalOpen}
        onClose={onCloseFeatureModal}
        post={selectedPost}
      />
    </>
  );
}
