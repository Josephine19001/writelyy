import type { Platform } from './posts-utils';

export interface PostsQueryParams {
  organizationId: string;
  platform?: Platform;
  status?: 'analyzed' | 'pending' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreatePostData {
  url: string;
  platform: Platform;
  commentLimit?: number;
  caption?: string;
}

export interface PostsResponse {
  posts: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
