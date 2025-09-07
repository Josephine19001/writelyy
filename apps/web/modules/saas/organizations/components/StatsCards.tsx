'use client';

import { Card, CardContent } from '@ui/components/card';
import { MessageSquareIcon, SparklesIcon } from 'lucide-react';
import type { Post } from '../lib/posts-utils';

interface StatsCardsProps {
  posts: Post[];
}

export function StatsCards({ posts }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Analyzed</p>
              <p className="text-2xl font-bold">
                {posts.filter((p) => p.analysis).length}
              </p>
            </div>
            <SparklesIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="text-2xl font-bold">
                {posts
                  .reduce((sum, post) => sum + post.commentCount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Requests</p>
              <p className="text-2xl font-bold">
                {posts.reduce(
                  (sum, post) => sum + (post.analysis?.feedback?.length || 0),
                  0
                )}
              </p>
            </div>
            <SparklesIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
