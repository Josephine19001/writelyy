import { getSession } from '@saas/auth/lib/server';
import { DetectorPage } from '@shared/components/DetectorPage';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

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

  return <DetectorPage />;
}