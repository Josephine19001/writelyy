'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { PostsHeader } from './PostsHeader';
import { PostsHeaderSkeleton } from './PostsHeaderSkeleton';
import { PostsContent } from './PostsContent';
import { PostsContentSkeleton } from './PostsSkeleton';
import { ErrorSection } from '@saas/shared/components/ErrorSection';
import type { Platform, Post } from '../lib/posts-utils';
import {
  usePostsQuery,
  useCreatePostMutation,
  useFetchCommentsMutation,
  useRefetchCommentsMutation,
  useAnalyzePostMutation,
  useDeletePostMutation
} from '../lib/posts-api';
import { useDebounceValue } from 'usehooks-ts';
import { toast } from 'sonner';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';

interface AllPostsViewProps {
  organizationId: string;
}

export interface AllPostsViewRef {
  openAddModal: () => void;
}

export const AllPostsView = forwardRef<AllPostsViewRef, AllPostsViewProps>(
  ({ organizationId }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>(
      'all'
    );
    const [selectedStatus, setSelectedStatus] = useState<
      'all' | 'analyzed' | 'pending'
    >('all');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

    const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
    const { canAddPost } = useUsageLimits();

    const queryParams = {
      organizationId,
      platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      search: debouncedSearchTerm || undefined,
      limit: 50
    };

    const {
      data: postsResponse,
      isLoading,
      error,
      refetch
    } = usePostsQuery(queryParams);

    const createPostMutation = useCreatePostMutation(organizationId);
    const fetchCommentsMutation = useFetchCommentsMutation();
    const refetchCommentsMutation = useRefetchCommentsMutation();
    const analyzePostMutation = useAnalyzePostMutation();
    const deletePostMutation = useDeletePostMutation();

    const posts = postsResponse?.posts || [];

    const handleAddPost = () => {
      if (!canAddPost()) {
        return; // Usage limits hook will show the pricing gate
      }
      setIsAddPostModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
      openAddModal: handleAddPost
    }));

    const handleFetchComments = async (postId: string) => {
      try {
        await fetchCommentsMutation.mutateAsync(postId);
      } catch (error) {
        console.error('❌ Fetch comments mutation failed:', error);
      }
    };

    const handleRefetchComments = async (postId: string) => {
      try {
        await refetchCommentsMutation.mutateAsync(postId);
      } catch (error) {
        console.error('❌ Refetch comments mutation failed:', error);
      }
    };

    const handleAnalyzePost = async (postId: string) => {
      try {
        await analyzePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('❌ Analysis mutation failed:', error);
        // The error is already handled by the mutation's onError callback
        // which will refetch the posts to get the correct server state
      }
    };

    const handleToggleAutoSync = async (postId: string, enabled: boolean) => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ autoSync: enabled })
        });

        if (!response.ok) {
          throw new Error('Failed to update auto sync setting');
        }

        // Refetch posts to get updated data
        refetch();

        toast.success(`Auto sync ${enabled ? 'enabled' : 'disabled'} for post`);
      } catch (error) {
        console.error('❌ Failed to toggle auto sync:', error);
        toast.error('Failed to update auto sync setting');
      }
    };

    const handleUpdateCaption = async (postId: string, caption: string) => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ caption })
        });

        if (!response.ok) {
          throw new Error('Failed to update caption');
        }

        // Refetch posts to get updated data
        refetch();

        toast.success('Caption updated successfully');
      } catch (error) {
        console.error('❌ Failed to update caption:', error);
        toast.error('Failed to update caption');
      }
    };

    const handleSubmitNewPost = async (
      url: string,
      platform: Platform,
      commentLimit?: number,
      caption?: string
    ) => {
      try {
        await createPostMutation.mutateAsync({
          url,
          platform,
          commentLimit,
          caption
        });
        setIsAddPostModalOpen(false);
      } catch (error) {
        console.error('❌ Create post mutation failed:', error);
      }
    };

    const handleDeletePost = async (postId: string) => {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('❌ Delete mutation failed:', error);
      }
    };

    const handleViewPost = (post: Post) => {
      setSelectedPost(post);
      setIsFeatureModalOpen(true);
    };

    const handleCheckPost = (url: string) => {
      window.open(url, '_blank');
    };

    const handleRetry = () => {
      refetch();
    };

    if (isLoading) {
      return (
        <div className="space-y-4 lg:space-y-6">
          <PostsHeaderSkeleton />
          <PostsContentSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-4 lg:space-y-6">
          <PostsHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          <ErrorSection
            title="Failed to load posts"
            message={`Unable to fetch posts: ${error.message}`}
            onRetry={handleRetry}
            variant="card"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4 lg:space-y-6">
        <PostsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <PostsContent
          posts={posts}
          selectedPost={selectedPost}
          isAddPostModalOpen={isAddPostModalOpen}
          isFeatureModalOpen={isFeatureModalOpen}
          onViewPost={handleViewPost}
          onFetchComments={handleFetchComments}
          onRefetchComments={handleRefetchComments}
          onAnalyzePost={handleAnalyzePost}
          onDeletePost={handleDeletePost}
          onCheckPost={handleCheckPost}
          onAddPost={handleAddPost}
          onSubmitNewPost={handleSubmitNewPost}
          onCloseAddModal={() => setIsAddPostModalOpen(false)}
          onCloseFeatureModal={() => {
            setIsFeatureModalOpen(false);
            setSelectedPost(null);
          }}
          onToggleAutoSync={handleToggleAutoSync}
          onUpdateCaption={handleUpdateCaption}
          isCreatingPost={createPostMutation.isPending}
          organizationId={organizationId}
        />

        {/* Modals are now handled by PostsContent */}
      </div>
    );
  }
);

AllPostsView.displayName = 'AllPostsView';
