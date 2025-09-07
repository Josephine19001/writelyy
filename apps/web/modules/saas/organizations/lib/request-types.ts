import type { Platform } from '@shared/lib/platforms';
export type { Platform };
export type Priority = 'HIGH' | 'MODERATE' | 'LOW';

export type ContentType = 'FEEDBACK' | 'ISSUE' | 'QUESTION';

export interface RequestRequest {
  id: string;
  postId: string;
  post: {
    id: string;
    platform: string;
    url: string;
    caption: string | null;
    createdAt: Date;
  };
  name: string;
  totalMentions: number;
  priority: Priority;
  topComment: string;
  commentIds: string[];
  createdAt: Date;
  updatedAt: Date;
  contentType: ContentType;
  syncStatus?: {
    provider: IntegrationType;
    status: 'SYNCED' | 'PENDING' | 'FAILED';
    syncedAt?: Date;
    lastSyncedAt?: Date;
    errorMessage?: string;
  };
}

export interface PriorityConfig {
  label: string;
  icon: any;
  color: string;
  badgeColor: string;
}

export interface ContentTypeConfig {
  label: string;
  icon: any;
  color: string;
  badgeColor: string;
  syncColor: string;
}

export type IntegrationType = 'NOTION' | 'JIRA' | 'AIRTABLE';

export interface Integration {
  id: string;
  organizationId: string;
  type: IntegrationType;
  name: string;
  enabled: boolean;
  connected: boolean;
  config: any;
  createdAt: Date;
  updatedAt: Date;
}
