'use client';

import { useState, useEffect, type DragEvent } from 'react';
import { LightbulbIcon, AlertTriangleIcon, HelpCircleIcon } from 'lucide-react';
import { RequestColumn } from './RequestColumn';
import { TicketDetailsModal } from './TicketDetailsModal';
import type {
  RequestRequest,
  ContentType,
  ContentTypeConfig,
  Platform
} from '../lib/request-types';
import { toast } from 'sonner';
import type { Integration, IntegrationType } from '../lib/request-types';
import {
  useCreateNotionTicketMutation,
  useSyncColumnToNotionMutation,
  useDeleteRequestMutation,
  useBulkDeleteRequestsMutation,
  useUpdateRequestPriorityMutation
} from '../lib/requests-api';
import type { Post } from '../lib/posts-utils';
import { Button } from '@ui/components/button';

const contentTypeConfig: Record<ContentType, ContentTypeConfig> = {
  FEEDBACK: {
    label: 'Feedback',
    icon: LightbulbIcon,
    color: 'bg-blue-50 dark:bg-blue-950',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    syncColor: 'border-blue-200'
  },
  ISSUE: {
    label: 'Issues',
    icon: AlertTriangleIcon,
    color: 'bg-red-50 dark:bg-red-950',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    syncColor: 'border-red-200'
  },
  QUESTION: {
    label: 'Questions',
    icon: HelpCircleIcon,
    color: 'bg-yellow-50 dark:bg-yellow-950',
    badgeColor:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    syncColor: 'border-yellow-200'
  }
};

interface RequestsViewProps {
  organizationId: string;
  posts: Post[];
  searchTerm: string;
  selectedPlatform: Platform | 'all';
  selectedPostCaption?: string | 'all';
}

// Unified request extraction function that follows the agnostic AI analysis structure
const extractRequestsFromPosts = (posts: Post[]): RequestRequest[] => {
  const requests: RequestRequest[] = [];

  posts.forEach((post) => {
    // Extract feedback from the analysis structure
    if (post.analysis?.feedback && Array.isArray(post.analysis.feedback)) {
      post.analysis.feedback.forEach((feedback: any, index: number) => {
        requests.push({
          id: `${post.id}-feedback-${index}`, // Fixed ID format
          postId: post.id,
          post: {
            id: post.id,
            platform: post.platform,
            url: post.url,
            caption: post.caption,
            createdAt: new Date(post.createdAt)
          },
          name: feedback.title || feedback.name || 'Unnamed Feedback',
          totalMentions: feedback.mentions || feedback.totalMentions || 1,
          priority: feedback.priority || 'MODERATE',
          topComment: feedback.topComment || feedback.description || '',
          commentIds: feedback.commentIds || [],
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.createdAt),
          contentType: 'FEEDBACK',
          syncStatus: feedback.syncStatus || []
        });
      });
    }

    // Extract questions from the analysis structure
    if (post.analysis?.questions && Array.isArray(post.analysis.questions)) {
      post.analysis.questions.forEach((question: any, index: number) => {
        requests.push({
          id: `${post.id}-question-${index}`, // Fixed ID format
          postId: post.id,
          post: {
            id: post.id,
            platform: post.platform,
            url: post.url,
            caption: post.caption,
            createdAt: new Date(post.createdAt)
          },
          name: question.question || 'Unnamed Question',
          totalMentions: question.mentions || question.totalMentions || 1,
          priority: 'LOW',
          topComment:
            question.topComment ||
            question.description ||
            question.question ||
            '',
          commentIds: question.commentIds || [],
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.createdAt),
          contentType: 'QUESTION',
          syncStatus: question.syncStatus || []
        });
      });
    }

    // Extract issues from the analysis structure
    if (post.analysis?.issues && Array.isArray(post.analysis.issues)) {
      post.analysis.issues.forEach((issue: any, index: number) => {
        requests.push({
          id: `${post.id}-issue-${index}`, // Fixed ID format
          postId: post.id,
          post: {
            id: post.id,
            platform: post.platform,
            url: post.url,
            caption: post.caption,
            createdAt: new Date(post.createdAt)
          },
          name: issue.title || issue.name || 'Unnamed Issue',
          totalMentions: issue.mentions || issue.totalMentions || 1,
          priority: issue.priority || 'MODERATE',
          topComment: issue.topComment || issue.description || '',
          commentIds: issue.commentIds || [],
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.createdAt),
          contentType: 'ISSUE',
          syncStatus: issue.syncStatus || []
        });
      });
    }
  });

  return requests;
};

export function RequestsView({
  organizationId,
  posts,
  searchTerm,
  selectedPlatform,
  selectedPostCaption = 'all'
}: RequestsViewProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [availableIntegrations, setAvailableIntegrations] = useState<
    Integration[]
  >([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  // Modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestRequest | null>(
    null
  );

  // Loading state for ticket creation
  const [creatingTickets, setCreatingTickets] = useState<Set<string>>(
    new Set()
  );

  // Selection state for bulk operations - now per column
  const [selectedRequestIds, setSelectedRequestIds] = useState<{
    FEEDBACK: Set<string>;
    ISSUE: Set<string>;
    QUESTION: Set<string>;
  }>({
    FEEDBACK: new Set(),
    ISSUE: new Set(),
    QUESTION: new Set()
  });

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestsToDelete, setRequestsToDelete] = useState<string[]>([]);

  // React Query mutations
  const createTicketMutation = useCreateNotionTicketMutation(organizationId);
  const syncColumnMutation = useSyncColumnToNotionMutation(organizationId);
  const deleteRequestMutation = useDeleteRequestMutation(organizationId);
  const bulkDeleteRequestsMutation =
    useBulkDeleteRequestsMutation(organizationId);
  const updateRequestPriorityMutation =
    useUpdateRequestPriorityMutation(organizationId);

  // Filter posts by platform first, then extract requests
  const filteredPosts = posts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return post.platform === selectedPlatform;
  });

  // Extract requests from filtered posts
  const requests = extractRequestsFromPosts(filteredPosts);

  // Apply search and caption filters
  const filteredRequests = requests
    .filter((request) => {
      // Search filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
          request.name.toLowerCase().includes(lowerSearchTerm) ||
          request.topComment.toLowerCase().includes(lowerSearchTerm) ||
          request.post.caption?.toLowerCase().includes(lowerSearchTerm);
        if (!matchesSearch) return false;
      }

      // Post caption filter
      if (selectedPostCaption !== 'all') {
        const postCaption = request.post.caption || '';
        const truncatedCaption =
          postCaption.length > 50
            ? `${postCaption.substring(0, 47)}...`
            : postCaption;
        if (truncatedCaption !== selectedPostCaption) return false;
      }

      return true;
    })
    .sort((a: RequestRequest, b: RequestRequest) => {
      // Sort by priority first, then by mentions
      const priorityOrder = { HIGH: 3, MODERATE: 2, LOW: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0
        ? priorityDiff
        : b.totalMentions - a.totalMentions;
    });

  // Group requests by content type
  const groupedRequests = filteredRequests.reduce(
    (acc, request) => {
      const contentType = request.contentType;
      if (!acc[contentType]) {
        acc[contentType] = [];
      }
      acc[contentType].push(request);
      return acc;
    },
    {} as Record<ContentType, RequestRequest[]>
  );

  const handleContentTypeChange = async (
    requestId: string,
    newContentType: ContentType
  ) => {
    try {
      // Map content type to priority
      const priorityMap: Record<ContentType, 'HIGH' | 'MODERATE' | 'LOW'> = {
        FEEDBACK: 'MODERATE',
        ISSUE: 'HIGH',
        QUESTION: 'LOW'
      };

      const response = await updateRequestPriorityMutation.mutateAsync({
        requestId,
        priority: priorityMap[newContentType]
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success(
        `Content type updated to ${newContentType.toLowerCase().replace('_', ' ')}`
      );

      // Content type change handled by React Query mutation
    } catch (error) {
      console.error('❌ Failed to update request content type:', error);
      toast.error(
        `Failed to update content type: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, requestId: string) => {
    setDraggedItem(requestId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', requestId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetContentType: ContentType
  ) => {
    e.preventDefault();
    const requestId = e.dataTransfer.getData('text/plain');

    if (requestId && requestId !== draggedItem) {
      handleContentTypeChange(requestId, targetContentType);
    } else if (draggedItem) {
      handleContentTypeChange(draggedItem, targetContentType);
    }

    setDraggedItem(null);
  };

  const handleCreateTicket = async (
    requestId: string,
    ticketType: IntegrationType
  ) => {
    // Set loading state
    setCreatingTickets((prev) => new Set(prev).add(requestId));

    try {
      // Use React Query mutation for ticket creation
      await createTicketMutation.mutateAsync(requestId);

      // Ticket creation handled by React Query mutation
    } catch (error) {
      console.error('❌ Failed to create ticket:', error);
      // Error handling is done in the mutation
    } finally {
      // Clear loading state
      setCreatingTickets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleColumnSync = async (
    integrationType: IntegrationType,
    contentType: ContentType
  ) => {
    const requestsToSync = groupedRequests[contentType] || [];

    if (requestsToSync.length === 0) {
      toast.error('No requests to sync in this column');
      return;
    }

    try {
      // Use React Query mutation for column sync
      await syncColumnMutation.mutateAsync({
        columnType: contentType
      });

      // Column sync handled by React Query mutation
    } catch (error) {
      console.error('❌ Failed to sync column:', error);
      // Error handling is done in the mutation
    }
  };

  const handleViewDetails = (request: RequestRequest) => {
    setSelectedRequest(request);
    setIsTicketModalOpen(true);
  };

  // Load integrations
  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/integrations`
        );
        if (response.ok) {
          const data = await response.json();
          // Map backend response to frontend interface
          const mappedIntegrations = (data.data || []).map(
            (integration: any) => ({
              id: integration.id,
              organizationId: organizationId,
              type: integration.type,
              name: integration.name,
              enabled: integration.isActive,
              connected: integration.isActive && integration.hasConfig,
              config: integration.config || {},
              createdAt: new Date(integration.createdAt),
              updatedAt: new Date(integration.updatedAt)
            })
          );
          setAvailableIntegrations(mappedIntegrations);
        }
      } catch (error) {
        console.error('❌ Failed to load integrations:', error);
      } finally {
        setIntegrationsLoading(false);
      }
    };

    loadIntegrations();
  }, [organizationId]);

  // Select/deselect all requests in a specific column
  const handleSelectAll = (contentType: ContentType) => {
    const columnRequests = groupedRequests[contentType] || [];
    const allColumnIds = new Set(columnRequests.map((r) => r.id));
    const currentSelected = selectedRequestIds[contentType];

    setSelectedRequestIds((prev) => ({
      ...prev,
      [contentType]:
        currentSelected.size === columnRequests.length
          ? new Set()
          : allColumnIds
    }));
  };

  // Handle individual request selection
  const handleSelectRequest = (requestId: string, selected: boolean) => {
    // Find which column this request belongs to
    const contentType = Object.keys(groupedRequests).find((key) =>
      groupedRequests[key as ContentType]?.some((r) => r.id === requestId)
    ) as ContentType;

    if (!contentType) return;

    setSelectedRequestIds((prev) => {
      const newColumnSet = new Set(prev[contentType]);
      if (selected) {
        newColumnSet.add(requestId);
      } else {
        newColumnSet.delete(requestId);
      }
      return {
        ...prev,
        [contentType]: newColumnSet
      };
    });
  };

  // Handle individual request deletion
  const handleDeleteRequest = (requestId: string) => {
    setRequestsToDelete([requestId]);
    setShowDeleteConfirm(true);
  };

  // Handle bulk request deletion for a specific column
  const handleBulkDelete = (contentType: ContentType) => {
    const selectedIds = Array.from(selectedRequestIds[contentType]);
    if (selectedIds.length === 0) {
      toast.error('No requests selected for deletion');
      return;
    }

    setRequestsToDelete(selectedIds);
    setShowDeleteConfirm(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (requestsToDelete.length === 0) return;

    try {
      let deletedCount = 0;

      if (requestsToDelete.length === 1) {
        // Single delete
        await deleteRequestMutation.mutateAsync(requestsToDelete[0]);
        deletedCount = 1;
      }

      if (requestsToDelete.length > 1) {
        // Bulk delete
        await bulkDeleteRequestsMutation.mutateAsync(requestsToDelete);
        deletedCount = requestsToDelete.length;
      }

      // Clear selection - mutations handle toasts and cache invalidation
      setSelectedRequestIds({
        FEEDBACK: new Set(),
        ISSUE: new Set(),
        QUESTION: new Set()
      });
    } catch (error) {
      // Error toasts are handled by the mutations
      console.error('❌ Failed to delete requests:', error);
    } finally {
      setShowDeleteConfirm(false);
      setRequestsToDelete([]);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setRequestsToDelete([]);
  };

  // Get active integrations (enabled and connected)
  const activeIntegrations = availableIntegrations.filter(
    (integration) => integration.enabled && integration.connected
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {(Object.keys(contentTypeConfig) as ContentType[]).map(
          (contentType) => (
            <RequestColumn
              key={contentType}
              contentType={contentType}
              config={contentTypeConfig[contentType]}
              requests={groupedRequests[contentType] || []}
              onCreateTicket={handleCreateTicket}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggedItem={draggedItem}
              availableIntegrations={activeIntegrations}
              onColumnSync={handleColumnSync}
              onViewDetails={handleViewDetails}
              creatingTickets={creatingTickets}
              selectedRequestIds={selectedRequestIds[contentType]}
              onSelectRequest={handleSelectRequest}
              onDeleteRequest={handleDeleteRequest}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
            />
          )
        )}
      </div>

      {/* Modal */}
      <TicketDetailsModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        request={selectedRequest}
      />

      {/* Bulk Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete {requestsToDelete.length} request
              {requestsToDelete.length === 1 ? '' : 's'}? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="error" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
