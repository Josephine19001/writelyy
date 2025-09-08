import { getSession } from '@saas/auth/lib/server';
import { ParaphraserPageWrapper } from '@shared/components/ParaphraserPageWrapper';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('paraphraser.title'),
  };
}

export default async function AppParaphraserPage() {
  const session = await getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return <ParaphraserPageWrapper />;
}