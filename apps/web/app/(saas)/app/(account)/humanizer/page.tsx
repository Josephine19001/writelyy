import { getSession } from '@saas/auth/lib/server';
import { HumanizerPage } from '@shared/components/HumanizerPage';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

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

  return <HumanizerPage />;
}