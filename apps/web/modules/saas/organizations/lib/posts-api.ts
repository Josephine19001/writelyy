import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Platform } from './posts-utils';
import type {
  PostsQueryParams,
  CreatePostData,
  PostsResponse
} from './post-types';
import { postQueryKey } from './queries';

export const usePostsQuery = (params: PostsQueryParams) => {
  return useQuery({
    queryKey: [
      'posts',
      params.organizationId,
      params.platform || 'all',
      params.status || 'all',
      params.search || '',
      params.limit || 20,
      params.offset || 0
    ],
    queryFn: async (): Promise<PostsResponse> => {
      const queryParams = new URLSearchParams();
      if (params.platform) {
        queryParams.set('platform', params.platform);
      }
      if (params.status) {
        queryParams.set('status', params.status);
      }
      if (params.search) {
        queryParams.set('search', params.search);
      }
      queryParams.set('limit', (params.limit || 20).toString());
      queryParams.set('offset', (params.offset || 0).toString());

      const response = await fetch(
        `/api/organizations/${params.organizationId}/posts?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch posts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data;
    },
    staleTime: 10 * 1000, // 10 seconds for debugging
    placeholderData: keepPreviousData, // Keep previous data while loading new data
    retry: 1,
    refetchOnWindowFocus: false,
    // Auto-refetch every 10 seconds if there are posts in processing states
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || !data.posts) return false;

      const hasProcessingPosts = data.posts.some((post: any) =>
        ['FETCHING_COMMENTS', 'ANALYZING'].includes(post.status)
      );
      return hasProcessingPosts ? 10 * 1000 : false; // 10 seconds if processing, otherwise no auto-refetch
    },
    refetchIntervalInBackground: true // Continue polling even when tab is not focused
  });
};

export const useInfinitePostsQuery = (
  organizationId: string,
  filters: {
    platform?: Platform;
    status?: 'analyzed' | 'pending' | 'all';
    search?: string;
  } = {}
) => {
  return useInfiniteQuery({
    queryKey: [
      'posts-infinite',
      organizationId,
      filters.platform || 'all',
      filters.status || 'all',
      filters.search || ''
    ],
    queryFn: async ({
      pageParam
    }: {
      pageParam: number;
    }): Promise<PostsResponse> => {
      const queryParams = new URLSearchParams();
      if (filters.platform) {
        queryParams.set('platform', filters.platform);
      }
      if (filters.status) {
        queryParams.set('status', filters.status);
      }
      if (filters.search) {
        queryParams.set('search', filters.search);
      }
      queryParams.set('limit', '20');
      queryParams.set('offset', pageParam.toString());

      const response = await fetch(
        `/api/organizations/${organizationId}/posts?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostsResponse) => {
      const { pagination } = lastPage;
      if (pagination.hasMore) {
        return pagination.offset + pagination.limit;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: postQueryKey(postId),
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const useCreatePostMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await fetch(
        `/api/organizations/${organizationId}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // Handle specific error cases
        if (
          response.status === 409 &&
          errorData?.error === 'Post already exists'
        ) {
          throw new Error('DUPLICATE_POST');
        }

        throw new Error(
          errorData?.details ||
            errorData?.error ||
            `Post creation failed: ${response.status}`
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts', organizationId] });
      queryClient.invalidateQueries({
        queryKey: ['posts-infinite', organizationId]
      });

      toast.success(
        'Post created successfully! Processing comments and analysis in the background.'
      );
    },
    onError: (error) => {
      console.error('❌ Error creating post:', error);

      if (error.message === 'DUPLICATE_POST') {
        toast.warning('This post already exists in your organization.');
      } else {
        toast.error(`Failed to create post: ${error.message}`);
      }
    }
  });
};

export const useFetchCommentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);

      try {
        const response = await fetch(`/api/posts/${postId}/fetch-comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = `Failed to fetch comments: ${response.status}`;
          try {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || errorDetails;
          } catch {
            // If we can't parse error response, use default message
          }
          throw new Error(errorDetails);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(
            'Comment fetching timed out after 10 minutes. Please try again or contact support.'
          );
        }
        throw error;
      }
    },
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Optimistically update to show "FETCHING_COMMENTS" status
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId ? { ...post, status: 'FETCHING_COMMENTS' } : post
          )
        };
      });

      // Show loading toast
      toast.loading('Fetching comments...', { id: `fetch-${postId}` });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onSuccess: (data, postId) => {
      toast.success(`Successfully fetched ${data.commentCount} comments!`, {
        id: `fetch-${postId}`
      });
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(`Failed to fetch comments: ${err.message}`, {
        id: `fetch-${postId}`
      });
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: postQueryKey(postId) });
    }
  });
};

export const useRefetchCommentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);

      try {
        const response = await fetch(`/api/posts/${postId}/refetch-comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = `Failed to re-fetch comments: ${response.status}`;
          try {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || errorDetails;
          } catch {
            // If we can't parse error response, use default message
          }
          throw new Error(errorDetails);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(
            'Comment re-fetching timed out after 10 minutes. Please try again or contact support.'
          );
        }
        throw error;
      }
    },
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Optimistically update to show "FETCHING_COMMENTS" status
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId ? { ...post, status: 'FETCHING_COMMENTS' } : post
          )
        };
      });

      // Show loading toast
      toast.loading('Re-fetching comments...', { id: `refetch-${postId}` });

      return { previousPosts };
    },
    onSuccess: (data, postId) => {
      const changeInfo = data.isSignificantChange
        ? ` (${data.percentChange}% change, merged ${data.commentCount} total)`
        : ` (${data.commentCount} comments, minor update)`;

      toast.success(`Comments updated successfully${changeInfo}`, {
        id: `refetch-${postId}`
      });
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(`Failed to re-fetch comments: ${err.message}`, {
        id: `refetch-${postId}`
      });
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: postQueryKey(postId) });
    }
  });
};

export const useAnalyzePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorDetails = `Analysis failed: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetails = errorData.details || errorData.error || errorDetails;
        } catch {
          // If we can't parse error response, use default message
        }
        throw new Error(errorDetails);
      }

      return response.json();
    },
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Optimistically update to show "ANALYZING" status
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId ? { ...post, status: 'ANALYZING' } : post
          )
        };
      });

      // Show loading toast
      toast.loading('Running AI analysis...', { id: `analyze-${postId}` });

      return { previousPosts };
    },
    onSuccess: (data, postId) => {
      // Optimistically update to show "ANALYZED" status
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId ? { ...post, status: 'ANALYZED' } : post
          )
        };
      });

      toast.success(
        `Analysis completed! Analyzed ${data.commentsAnalyzed} comments.`,
        { id: `analyze-${postId}` }
      );
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(`AI analysis failed: ${err.message}`, {
        id: `analyze-${postId}`
      });
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: postQueryKey(postId) });
    }
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorDetails = `Delete failed: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetails = errorData.details || errorData.error || errorDetails;
        } catch {
          // If we can't parse error response, use default message
        }
        throw new Error(errorDetails);
      }

      return response.json();
    },
    onMutate: async (postId: string) => {
      // Show loading toast
      toast.loading('Deleting post...', { id: `delete-${postId}` });
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'posts' ||
          query.queryKey[0] === 'posts-infinite'
      });

      toast.success('Post deleted successfully', { id: `delete-${postId}` });
    },
    onError: (error, postId) => {
      console.error('❌ Error deleting post:', { postId, error });
      toast.error(`Failed to delete post: ${error.message}`, {
        id: `delete-${postId}`
      });
    }
  });
};

export const usePostPreviewMutation = (organizationId?: string) => {
  return useMutation({
    mutationFn: async (data: { url: string; platform: Platform }) => {
      const response = await fetch('/api/posts/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          ...(organizationId && { organizationId })
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to preview post');
      }

      return result;
    },
    onError: (error) => {
      console.error('❌ Post preview failed:', error);
      // Don't show toast here - let the component handle it
    }
  });
};
