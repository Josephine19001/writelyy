import { getActiveOrganization } from '@saas/auth/lib/server';
import { IntegrationsSettings } from '@saas/organizations/components/IntegrationsSettings';
import { SettingsList } from '@saas/shared/components/SettingsList';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('settings.menu.organization.integrations')
  };
}

export default async function IntegrationsSettingsPage({
  params
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const organization = await getActiveOrganization(organizationSlug);

  if (!organization) {
    return notFound();
  }

  return (
    <SettingsList>
      <IntegrationsSettings organizationId={organization.id} />
    </SettingsList>
  );
}
