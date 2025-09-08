import { getSession } from '@saas/auth/lib/server';
import { DetectorPage } from '@shared/components/DetectorPage';
import { getServerApiClient, getServerQueryClient } from '@shared/lib/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('detector.title'),
  };
}

export default async function AIDetectorPage() {
  const session = await getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  const queryClient = getServerQueryClient();
  const apiClient = await getServerApiClient();

  // Prefetch user usage data and history for better performance
  try {
    await Promise.all([
      // Prefetch monthly usage
      queryClient.prefetchQuery({
        queryKey: ['monthly-usage'],
        queryFn: async () => {
          const response = await apiClient.tools.usage.monthly.$get();
          if (!response.ok) {
            throw new Error('Failed to fetch monthly usage');
          }
          return response.json();
        },
      }),
      // Prefetch detector history
      queryClient.prefetchQuery({
        queryKey: ['detector-history', 10],
        queryFn: async () => {
          const response = await apiClient.tools.detector.history.$get({
            query: { limit: '10' }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch detector history');
          }
          return response.json();
        },
      }),
    ]);
  } catch (error) {
    // If prefetch fails, the client will still fetch the data
    console.error('Failed to prefetch data:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetectorPage />
    </HydrationBoundary>
  );
}