'use client';

import { Button } from '@ui/components/button';
import { Badge } from '@ui/components/badge';
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  GripVerticalIcon,
  PlusIcon,
  LoaderIcon,
  TrashIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@ui/components/dropdown-menu';
import type { DragEvent } from 'react';
import { getPlatformIcon, type Platform } from '@shared/lib/platforms';
import type { RequestRequest } from '../lib/request-types';
import { getIntegrationIcon } from '@saas/shared/components/IntegrationIcons';
import type { Integration, IntegrationType } from '../lib/request-types';

interface RequestCardProps {
  request: RequestRequest;
  onCreateTicket: (requestId: string, ticketType: IntegrationType) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, requestId: string) => void;
  draggedItem: string | null;
  availableIntegrations?: Integration[];
  onViewDetails?: (request: RequestRequest) => void;
  isCreatingTicket?: boolean;
  isSelected?: boolean;
  onSelectRequest?: (requestId: string, selected: boolean) => void;
  onDeleteRequest?: (requestId: string) => void;
}

export function RequestCard({
  request,
  onCreateTicket,
  onDragStart,
  draggedItem,
  availableIntegrations = [],
  onViewDetails,
  isCreatingTicket = false,
  isSelected = false,
  onSelectRequest,
  onDeleteRequest
}: RequestCardProps) {
  const handleSelectionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectRequest) {
      onSelectRequest(request.id, !isSelected);
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={(e) => onDragStart(e, request.id)}
      className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:shadow-md dark:hover:shadow-lg transition-all ${
        draggedItem === request.id ? 'opacity-50' : ''
      } bg-white dark:bg-gray-900 ${
        isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Selection checkbox */}
          {onSelectRequest && (
            <button
              type="button"
              onClick={handleSelectionToggle}
              className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isSelected && <CheckIcon className="h-3 w-3" />}
            </button>
          )}

          <GripVerticalIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {request.name}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          {/* Delete button */}
          {onDeleteRequest && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(request.id);
              }}
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(request)}>
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {availableIntegrations.length > 0 ? (
                <>
                  <DropdownMenuLabel>Create Ticket</DropdownMenuLabel>
                  {availableIntegrations.map((integration) => (
                    <DropdownMenuItem
                      key={integration.id}
                      onClick={() =>
                        onCreateTicket(request.id, integration.type)
                      }
                      disabled={isCreatingTicket}
                    >
                      {isCreatingTicket ? (
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        getIntegrationIcon(integration.type.toLowerCase(), {
                          size: 16,
                          className: 'mr-2'
                        })
                      )}
                      {isCreatingTicket
                        ? 'Creating...'
                        : `Create in ${integration.name}`}
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <DropdownMenuItem disabled>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  No integrations available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sync Status Indicators */}
      {request.syncStatus?.provider && (
        <div className="flex flex-wrap gap-1 mb-3">
          {(() => {
            const sync = request.syncStatus;
            const getSyncIcon = () => {
              switch (sync.status) {
                case 'SYNCED':
                  return <CheckCircleIcon className="h-3 w-3" />;
                case 'PENDING':
                  return <ClockIcon className="h-3 w-3" />;
                case 'FAILED':
                  return <XCircleIcon className="h-3 w-3" />;
                default:
                  return <ClockIcon className="h-3 w-3" />;
              }
            };

            const getSyncColor = () => {
              switch (sync.status) {
                case 'SYNCED':
                  return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
                case 'PENDING':
                  return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
                case 'FAILED':
                  return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
                default:
                  return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
              }
            };

            return (
              <Badge
                key="sync-status"
                className={`text-xs flex items-center gap-1 px-2 py-1 border ${getSyncColor()}`}
                title={
                  sync.status === 'FAILED' && sync.errorMessage
                    ? `Failed: ${sync.errorMessage}`
                    : sync.syncedAt
                      ? `Synced at ${new Date(sync.syncedAt).toLocaleString()}`
                      : `Status: ${sync.status}`
                }
              >
                {getSyncIcon()}
                <span className="capitalize">
                  {sync.provider?.toLowerCase()}
                </span>
              </Badge>
            );
          })()}
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {request.topComment}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {request.totalMentions} mentions
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const PlatformIcon = getPlatformIcon(
              request.post.platform as Platform
            );
            return PlatformIcon ? (
              <PlatformIcon
                size={16}
                className="text-gray-400 dark:text-gray-500"
              />
            ) : null;
          })()}
          <a
            href={request.post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
