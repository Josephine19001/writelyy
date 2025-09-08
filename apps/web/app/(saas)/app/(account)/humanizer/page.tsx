import { getSession } from '@saas/auth/lib/server';
import { HumanizerPage } from '@shared/components/HumanizerPage';
import { getServerApiClient, getServerQueryClient } from '@shared/lib/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('humanizer.title'),
  };
}

export default async function AppHumanizerPage() {
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
      // Prefetch humanizer history
      queryClient.prefetchQuery({
        queryKey: ['humanizer-history', 10],
        queryFn: async () => {
          const response = await apiClient.tools.humanizer.history.$get({
            query: { limit: '10' }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch humanizer history');
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
      <HumanizerPage />
    </HydrationBoundary>
  );
}