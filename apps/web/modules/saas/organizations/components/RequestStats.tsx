'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import {
  TrendingUpIcon,
  MessageSquareIcon,
  AlertTriangleIcon
} from 'lucide-react';
import type { RequestRequest } from '../lib/request-types';

interface RequestStatsProps {
  requests: RequestRequest[];
}

export function RequestStats({ requests }: RequestStatsProps) {
  const totalMentions = requests.reduce(
    (sum, request) => sum + request.totalMentions,
    0
  );

  const highPriorityCount = requests.filter(
    (request) => request.priority === 'HIGH'
  ).length;

  const stats = [
    {
      title: 'Total Feedback',
      value: requests.length,
      icon: TrendingUpIcon,
      description: 'All feedback tracked'
    },
    {
      title: 'Total Mentions',
      value: totalMentions,
      icon: MessageSquareIcon,
      description: 'Across all feedback'
    },
    {
      title: 'High Priority',
      value: highPriorityCount,
      icon: AlertTriangleIcon,
      description: 'Requires attention'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
