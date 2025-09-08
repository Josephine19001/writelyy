import { getSession } from '@saas/auth/lib/server';
import { SummariserPageWrapper } from '@shared/components/SummariserPageWrapper';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('summariser.title'),
  };
}

export default async function AppSummariserPage() {
  const session = await getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return <SummariserPageWrapper />;
}