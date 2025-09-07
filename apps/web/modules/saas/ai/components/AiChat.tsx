'use client';

// import {
//   aiChatListQueryKey,
//   useAiChatListQuery,
//   useAiChatQuery,
//   useCreateAiChatMutation
// } from '@saas/ai/lib/api';
// import { SidebarContentLayout } from '@saas/shared/components/SidebarContentLayout';
// import { useQueryClient } from '@tanstack/react-query';
// import { Button } from '@ui/components/button';
// import { Textarea } from '@ui/components/textarea';
// import { cn } from '@ui/lib';
// import { type Message, useChat } from 'ai/react';
// import { EllipsisIcon, PlusIcon, SendIcon } from 'lucide-react';
// import { useFormatter } from 'next-intl';
// import { useQueryState } from 'nuqs';
// import { useCallback, useEffect, useMemo } from 'react';

export function AiChat({ organizationId }: { organizationId?: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">🚀</div>
        <h2 className="text-2xl font-bold text-foreground">
          AI-Powered Content Insights
        </h2>
        <p className="text-muted-foreground">
          Get intelligent analysis of your social media content, identify
          trending topics, and discover what your audience really wants. Perfect
          for creators, product teams, and social media strategists.
        </p>
        <button
          type="button"
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Get the inside scoop
        </button>
      </div>
    </div>
  );
}
