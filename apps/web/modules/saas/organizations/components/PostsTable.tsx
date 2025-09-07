'use client';

import { useState } from 'react';
import { DeletePostModal } from './DeletePostModal';
import { Button } from '@ui/components/button';
import { Input } from '@ui/components/input';
import { Card, CardContent } from '@ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ui/components/table';
import { Badge } from '@ui/components/badge';
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  HelpCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  DownloadIcon,
  EditIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';
import { getPlatformIcon, type Platform } from '@shared/lib/platforms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@ui/components/dropdown-menu';
import type { Post, PostStatus } from '../lib/posts-utils';
import { formatDate } from '../lib/posts-utils';

// Use shared platform configuration

const getStatusBadge = (status: PostStatus) => {
  // Handle null, undefined, or unknown status as PENDING
  if (!status || status === ('UNKNOWN' as any)) {
    return <Badge status="info">Pending</Badge>;
  }

  switch (status) {
    case 'PENDING':
      return <Badge status="info">Pending</Badge>;
    case 'FETCHING_COMMENTS':
      return <Badge status="info">Fetching Comments</Badge>;
    case 'COMMENTS_FETCHED':
      return <Badge status="warning">Comments Ready</Badge>;
    case 'ANALYZING':
      return <Badge status="info">Analyzing</Badge>;
    case 'ANALYZED':
      return <Badge status="success">Analyzed</Badge>;
    case 'NO_COMMENTS':
      return <Badge status="warning">No Comments</Badge>;
    case 'SCRAPING_FAILED':
      return <Badge status="error">Scraping Failed</Badge>;
    case 'ANALYSIS_FAILED':
      return <Badge status="error">Analysis Failed</Badge>;
    case 'ERROR':
      return <Badge status="error">Error</Badge>;
    default:
      return <Badge status="info">Pending</Badge>;
  }
};

interface PostsTableProps {
  posts: Post[];
  onViewPost: (post: Post) => void;
  onFetchComments: (postId: string) => Promise<void>;
  onRefetchComments: (postId: string) => Promise<void>;
  onAnalyzePost: (postId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onCheckPost: (url: string) => void;
  onAddPost: () => void;
  onToggleAutoSync?: (postId: string, enabled: boolean) => Promise<void>;
  onUpdateCaption?: (postId: string, caption: string) => Promise<void>;
}

export function PostsTable({
  posts,
  onViewPost,
  onFetchComments,
  onRefetchComments,
  onAnalyzePost,
  onDeletePost,
  onCheckPost,
  onAddPost,
  onToggleAutoSync,
  onUpdateCaption
}: PostsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [editCaptionValue, setEditCaptionValue] = useState('');
  const [isUpdatingCaption, setIsUpdatingCaption] = useState(false);
  const postsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await onDeletePost(postToDelete.id);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('❌ Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleEditCaption = (post: Post) => {
    setEditingCaption(post.id);
    setEditCaptionValue(post.caption || '');
  };

  const handleSaveCaption = async (postId: string) => {
    if (!onUpdateCaption) return;

    setIsUpdatingCaption(true);
    try {
      await onUpdateCaption(postId, editCaptionValue);
      setEditingCaption(null);
      setEditCaptionValue('');
    } catch (error) {
      console.error('❌ Failed to update caption:', error);
    } finally {
      setIsUpdatingCaption(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCaption(null);
    setEditCaptionValue('');
  };

  return (
    <>
      <Card>
        {/* <CardHeader>
        <CardTitle>
          Posts
          {totalPages > 1 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              - Page {currentPage} of {totalPages}
            </span>
          )}
        </CardTitle>
      </CardHeader> */}
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Platform</TableHead>
                  <TableHead className="w-auto">Caption</TableHead>
                  <TableHead className="w-24 text-center hidden sm:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="w-20 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquareIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Comments</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-16 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <ThumbsUpIcon className="h-4 w-4" />
                      <span className="hidden lg:inline">Pos</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-16 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 text-blue-600">
                      <HelpCircleIcon className="h-4 w-4" />
                      <span className="hidden lg:inline">Qs</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-16 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 text-orange-600">
                      <AlertCircleIcon className="h-4 w-4" />
                      <span className="hidden lg:inline">Issues</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-16 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600">
                      <SparklesIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Reqs</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-20 hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="w-16 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPosts.map((post) => (
                  <TableRow key={post.id} className="group">
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {(() => {
                          const IconComponent = getPlatformIcon(
                            post.platform as Platform
                          );
                          return IconComponent ? (
                            <IconComponent
                              size={20}
                              className="flex-shrink-0"
                            />
                          ) : null;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {editingCaption === post.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editCaptionValue}
                              onChange={(e) =>
                                setEditCaptionValue(e.target.value)
                              }
                              className="text-sm"
                              placeholder="Enter caption..."
                              disabled={isUpdatingCaption}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveCaption(post.id)}
                              disabled={isUpdatingCaption}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingCaption}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <p className="line-clamp-2 text-sm font-medium">
                                {post.caption || 'No caption'}
                              </p>
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{post.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {onUpdateCaption && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditCaption(post)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <EditIcon className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm hidden sm:table-cell">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {post.commentCount || 0}
                    </TableCell>
                    <TableCell className="text-center text-green-600 font-medium hidden md:table-cell">
                      {post.comments?.filter(
                        (c) =>
                          c.sentiment === 'POSITIVE' ||
                          c.sentiment === 'COMPLIMENT'
                      ).length || 0}
                    </TableCell>
                    <TableCell className="text-center text-blue-600 font-medium hidden md:table-cell">
                      {post.analysis?.questions?.length || 0}
                    </TableCell>
                    <TableCell className="text-center text-orange-600 font-medium hidden md:table-cell">
                      {(post.analysis?.issues?.length || 0) +
                        (post.analysis?.topConcerns?.length || 0)}
                    </TableCell>
                    <TableCell className="text-center text-purple-600 font-medium">
                      {post.analysis?.feedback?.length || 0}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(post.status || 'PENDING')}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewPost(post)}>
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          {/* Fetch Comments - Only show if no comments exist */}
                          {(!post.commentCount || post.commentCount === 0) && (
                            <DropdownMenuItem
                              onClick={() => onFetchComments(post.id)}
                              disabled={
                                post.status === 'FETCHING_COMMENTS' ||
                                post.status === 'ANALYZING'
                              }
                            >
                              <DownloadIcon className="h-4 w-4 mr-2" />
                              Fetch Comments
                              {post.status === 'FETCHING_COMMENTS' && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Fetching...)
                                </span>
                              )}
                            </DropdownMenuItem>
                          )}

                          {/* Re-fetch Comments - Only show if comments already exist */}
                          {post.commentCount && post.commentCount > 0 && (
                            <DropdownMenuItem
                              onClick={() => onRefetchComments(post.id)}
                              disabled={
                                post.status === 'FETCHING_COMMENTS' ||
                                post.status === 'ANALYZING'
                              }
                            >
                              <DownloadIcon className="h-4 w-4 mr-2" />
                              Re-fetch Comments
                              {post.status === 'FETCHING_COMMENTS' && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Fetching...)
                                </span>
                              )}
                            </DropdownMenuItem>
                          )}

                          {/* Analyze - Only show if comments exist but no analysis */}
                          {post.commentCount &&
                            post.commentCount > 0 &&
                            !post.analysis && (
                              <DropdownMenuItem
                                onClick={() => onAnalyzePost(post.id)}
                                disabled={
                                  post.status === 'ANALYZING' ||
                                  post.status === 'FETCHING_COMMENTS'
                                }
                              >
                                <SparklesIcon className="h-4 w-4 mr-2" />
                                Analyze
                                {post.status === 'ANALYZING' && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    (Analyzing...)
                                  </span>
                                )}
                              </DropdownMenuItem>
                            )}

                          {/* Re-analyze - Only show if analysis already exists */}
                          {post.analysis && (
                            <DropdownMenuItem
                              onClick={() => onAnalyzePost(post.id)}
                              disabled={
                                post.status === 'ANALYZING' ||
                                post.status === 'FETCHING_COMMENTS'
                              }
                            >
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              Re-analyze
                              {post.status === 'ANALYZING' && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Analyzing...)
                                </span>
                              )}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(post)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4 mr-2 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onCheckPost(post.url)}
                          >
                            <ExternalLinkIcon className="h-4 w-4 mr-2" />
                            Check Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {posts.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t flex-col gap-4 sm:flex-row sm:gap-0">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, posts.length)}{' '}
                of {posts.length} posts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'primary' : 'outline'
                        }
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No posts found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search terms or filters, or add your first
                post.
              </p>
              <Button onClick={onAddPost}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DeletePostModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        post={postToDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
