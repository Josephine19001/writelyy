import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { RequestRequest } from './request-types';

// Use RequestRequest from request-types.ts instead of defining duplicate
export interface RequestsQueryParams {
  organizationId: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'ADDRESSED' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RequestsResponse {
  requests: RequestRequest[];
  pagination: {
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
}

export const useRequestsQuery = (params: RequestsQueryParams) => {
  return useQuery({
    queryKey: [
      'requests',
      params.organizationId,
      params.status || 'all',
      params.search || '',
      params.limit || 50,
      params.offset || 0
    ],
    queryFn: async (): Promise<RequestsResponse> => {
      const queryParams = new URLSearchParams();
      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }
      if (params.search) {
        queryParams.set('search', params.search);
      }
      queryParams.set('limit', (params.limit || 50).toString());
      queryParams.set('offset', (params.offset || 0).toString());

      const response = await fetch(
        `/api/organizations/${params.organizationId}/feedback?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch requests: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

// Create Notion ticket mutation
export const useCreateNotionTicketMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(
        `/api/organizations/${organizationId}/sync/request-requests/${requestId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            providers: ['NOTION']
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Failed to create ticket: ${response.status}`
        );
      }

      return await response.json();
    },
    onMutate: async (requestId: string) => {
      // Show loading toast
      toast.loading('Syncing to Notion...', { id: `sync-${requestId}` });
    },
    onSuccess: (data, requestId) => {
      // Invalidate and refetch posts data to get updated sync status from database
      queryClient.invalidateQueries({ queryKey: ['posts', organizationId] });

      // Show success toast
      toast.success('Successfully synced to Notion!', {
        id: `sync-${requestId}`
      });
    },
    onError: (error, requestId) => {
      // Show error toast
      toast.error(`Failed to sync: ${error.message}`, {
        id: `sync-${requestId}`
      });
    }
  });
};

// Update request priority mutation
export const useUpdateRequestPriorityMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      priority
    }: {
      requestId: string;
      priority: 'HIGH' | 'MODERATE' | 'LOW';
    }) => {
      const response = await fetch(`/api/posts/feedback/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Failed to update priority: ${response.status}`
        );
      }

      return response.json();
    },
    onSuccess: (data, { requestId, priority }) => {
      // Invalidate requests cache to refresh the data
      queryClient.invalidateQueries({ queryKey: ['requests', organizationId] });

      // Show success toast
      toast.success(`Priority updated to ${priority.toLowerCase()}`);
    },
    onError: (error: Error) => {
      console.error('❌ Failed to update priority:', error);
      toast.error(`Failed to update priority: ${error.message}`);
    }
  });
};

// Sync column to Notion mutation
export const useSyncColumnToNotionMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { columnType: string; priority?: string }) => {
      const response = await fetch(
        `/api/organizations/${organizationId}/sync/bulk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            providers: ['NOTION'],
            ...data
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Failed to sync column: ${response.status}`
        );
      }

      return await response.json();
    },
    onMutate: async (data) => {
      // Show loading toast
      toast.loading(`Syncing ${data.columnType} to Notion...`, {
        id: `sync-column-${data.columnType}`
      });
    },
    onSuccess: (result, data) => {
      // Invalidate and refetch posts data to get updated sync status from database
      queryClient.invalidateQueries({ queryKey: ['posts', organizationId] });

      // Show success toast
      toast.success(`Successfully synced ${data.columnType} to Notion!`, {
        id: `sync-column-${data.columnType}`
      });
    },
    onError: (error, data) => {
      // Show error toast
      toast.error(`Failed to sync ${data.columnType}: ${error.message}`, {
        id: `sync-column-${data.columnType}`
      });
    }
  });
};

// Delete request mutation
export const useDeleteRequestMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/posts/feedback/${requestId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Failed to delete request: ${response.status}`
        );
      }

      return response.json();
    },
    onMutate: async (requestId: string) => {
      // Show loading toast
      toast.loading('Deleting request...', { id: `delete-${requestId}` });
    },
    onSuccess: (data, requestId) => {
      // Show success toast
      toast.success('Request deleted successfully', {
        id: `delete-${requestId}`
      });
    },
    onError: (error, requestId) => {
      // Show error toast
      toast.error(error.message, { id: `delete-${requestId}` });
    },
    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['requests', organizationId] });
      // Also invalidate posts queries since RequestsView uses posts data
      queryClient.invalidateQueries({ queryKey: ['posts', organizationId] });
    }
  });
};

// Bulk delete requests mutation
export const useBulkDeleteRequestsMutation = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestIds: string[]) => {
      // Process each request individually since we don't have a bulk endpoint
      const results = await Promise.allSettled(
        requestIds.map(async (requestId) => {
          const response = await fetch(`/api/posts/feedback/${requestId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              errorData?.error ||
                `Failed to delete request ${requestId}: ${response.status}`
            );
          }

          return response.json();
        })
      );

      // Count successful and failed results
      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length;
      const failed = results.length - successful;

      return {
        total: requestIds.length,
        successful,
        failed,
        results
      };
    },
    onMutate: async (requestIds: string[]) => {
      // Show loading toast
      toast.loading(`Deleting ${requestIds.length} requests...`, {
        id: 'bulk-delete'
      });
    },
    onSuccess: (data) => {
      const { total, successful, failed } = data;

      if (failed === 0) {
        toast.success(
          `Successfully deleted ${successful} request${successful === 1 ? '' : 's'}`,
          { id: 'bulk-delete' }
        );
      } else {
        toast.warning(`Deleted ${successful} requests, ${failed} failed`, {
          id: 'bulk-delete'
        });
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message, { id: 'bulk-delete' });
    },
    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['requests', organizationId] });
      // Also invalidate posts queries since RequestsView uses posts data
      queryClient.invalidateQueries({ queryKey: ['posts', organizationId] });
    }
  });
};
