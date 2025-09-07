import { getActiveOrganization, getSession } from '@saas/auth/lib/server';
import { SettingsMenu } from '@saas/settings/components/SettingsMenu';
import { PageHeader } from '@saas/shared/components/PageHeader';
import { SidebarContentLayout } from '@saas/shared/components/SidebarContentLayout';
import { UserAvatar } from '@shared/components/UserAvatar';
import { Settings2Icon, ShieldIcon, TriangleAlertIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default async function AccountSettingsLayout({
  children,
  params
}: PropsWithChildren<{
  params: Promise<{ organizationSlug: string }>;
}>) {
  const t = await getTranslations();
  const session = await getSession();
  const { organizationSlug } = await params;
  const organization = await getActiveOrganization(organizationSlug);

  if (!session) {
    redirect('/auth/login');
  }

  if (!organization) {
    redirect('/app');
  }

  const accountSettingsBasePath = `/app/${organizationSlug}/account`;

  const accountItems = [
    {
      title: t('settings.menu.account.general'),
      href: `${accountSettingsBasePath}/general`,
      icon: <Settings2Icon className="size-4 opacity-50" />
    },
    {
      title: t('settings.menu.account.security'),
      href: `${accountSettingsBasePath}/security`,
      icon: <ShieldIcon className="size-4 opacity-50" />
    },
    {
      title: t('settings.menu.account.dangerZone'),
      href: `${accountSettingsBasePath}/danger-zone`,
      icon: <TriangleAlertIcon className="size-4 opacity-50" />
    }
  ];

  const menuItems = [
    {
      title: t('settings.menu.account.title'),
      avatar: (
        <UserAvatar
          name={session.user?.name ?? ''}
          avatarUrl={session.user?.image}
        />
      ),
      items: accountItems
    }
  ];

  return (
    <>
      <PageHeader
        title={t('settings.account.title')}
        subtitle={t('settings.account.subtitle')}
      />
      <SidebarContentLayout sidebar={<SettingsMenu menuItems={menuItems} />}>
        {children}
      </SidebarContentLayout>
    </>
  );
}
