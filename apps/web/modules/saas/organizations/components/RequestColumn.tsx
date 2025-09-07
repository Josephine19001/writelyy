'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import {
  SparklesIcon,
  ChevronDownIcon,
  PackageIcon,
  CheckSquareIcon,
  SquareIcon,
  Trash2Icon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@ui/components/dropdown-menu';
import type { DragEvent } from 'react';
import { RequestCard } from './RequestCard';
import type {
  RequestRequest,
  ContentType,
  ContentTypeConfig
} from '../lib/request-types';
import type { Integration, IntegrationType } from '../lib/request-types';

interface RequestColumnProps {
  contentType: ContentType;
  config: ContentTypeConfig;
  requests: RequestRequest[];
  onCreateTicket: (requestId: string, ticketType: IntegrationType) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, requestId: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (
    e: DragEvent<HTMLDivElement>,
    targetContentType: ContentType
  ) => void;
  draggedItem: string | null;
  availableIntegrations?: Integration[];
  onColumnSync?: (
    integrationType: IntegrationType,
    contentType: ContentType
  ) => void;
  onViewDetails?: (request: RequestRequest) => void;
  creatingTickets?: Set<string>;
  selectedRequestIds?: Set<string>;
  onSelectRequest?: (requestId: string, selected: boolean) => void;
  onDeleteRequest?: (requestId: string) => void;
  onSelectAll?: (contentType: ContentType) => void;
  onBulkDelete?: (contentType: ContentType) => void;
}

export function RequestColumn({
  contentType,
  config,
  requests,
  onCreateTicket,
  onDragStart,
  onDragOver,
  onDrop,
  draggedItem,
  availableIntegrations = [],
  onColumnSync,
  onViewDetails,
  creatingTickets = new Set(),
  selectedRequestIds = new Set(),
  onSelectRequest,
  onDeleteRequest,
  onSelectAll,
  onBulkDelete
}: RequestColumnProps) {
  const selectedCount = selectedRequestIds.size;
  const allSelected = selectedCount === requests.length && requests.length > 0;

  return (
    <Card
      className={`${config.color} transition-colors h-fit`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, contentType)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <config.icon className="h-5 w-5" />
            {config.label}
            <Badge className={config.badgeColor} status={null}>
              {requests.length}
            </Badge>
          </CardTitle>

          {/* Select All dropdown for each column */}
          {requests.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {allSelected ? (
                    <SquareIcon className="h-4 w-4" />
                  ) : (
                    <CheckSquareIcon className="h-4 w-4" />
                  )}
                  Select All
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectAll?.(contentType)}>
                  {allSelected ? 'Deselect All' : 'Select All'}
                </DropdownMenuItem>

                {/* Show sync option for Feedback column */}
                {contentType === 'FEEDBACK' &&
                  selectedCount > 0 &&
                  availableIntegrations.length > 0 && (
                    <DropdownMenuItem
                      onClick={() => onColumnSync?.('NOTION', contentType)}
                    >
                      <PackageIcon className="h-4 w-4 mr-2" />
                      Sync with Notion ({selectedCount})
                    </DropdownMenuItem>
                  )}

                {/* Show delete option if items are selected */}
                {selectedCount > 0 && (
                  <DropdownMenuItem
                    onClick={() => onBulkDelete?.(contentType)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedCount})
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <SparklesIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No feedback in this category</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-3 -mr-3 py-1">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCreateTicket={onCreateTicket}
                onDragStart={onDragStart}
                draggedItem={draggedItem}
                availableIntegrations={availableIntegrations}
                onViewDetails={onViewDetails}
                isCreatingTicket={creatingTickets.has(request.id)}
                isSelected={selectedRequestIds.has(request.id)}
                onSelectRequest={onSelectRequest}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
