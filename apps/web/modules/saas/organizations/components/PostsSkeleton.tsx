'use client';

import { Card, CardContent } from '@ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ui/components/table';
import { Skeleton } from '@ui/components/skeleton';

// Skeleton for stats cards
export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="mt-1">
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton for posts table
export function PostsTableSkeleton() {
  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Platform</TableHead>
                {/* <TableHead className="min-w-[200px]">Caption</TableHead> */}
                <TableHead className="w-24 text-center hidden sm:table-cell">
                  Date
                </TableHead>
                <TableHead className="w-20 text-center">Comments</TableHead>
                <TableHead className="w-16 text-center hidden md:table-cell">
                  Pos
                </TableHead>
                <TableHead className="w-16 text-center hidden md:table-cell">
                  Qs
                </TableHead>
                <TableHead className="w-16 text-center hidden md:table-cell">
                  Neg
                </TableHead>
                <TableHead className="w-16 text-center">Reqs</TableHead>
                <TableHead className="w-20 hidden sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="w-16 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full max-w-xs" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Combined skeleton for the entire posts section
export function PostsContentSkeleton() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <StatsCardsSkeleton />
      <PostsTableSkeleton />
    </div>
  );
}
