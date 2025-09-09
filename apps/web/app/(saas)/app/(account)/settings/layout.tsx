import { config } from '@repo/config';
import { getSession } from '@saas/auth/lib/server';
import { SettingsMenu } from '@saas/settings/components/SettingsMenu';
// import { PageHeader } from '@saas/shared/components/PageHeader';
import { UserAvatar } from '@shared/components/UserAvatar';
import { SettingsLayoutWrapper } from './SettingsLayoutWrapper';
import {
  CreditCardIcon,
  Settings2Icon,
  ShieldIcon,
  TriangleAlertIcon
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default async function AccountSettingsLayout({
  children
}: PropsWithChildren) {
  const t = await getTranslations();
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const accountSettingsBasePath = '/app/settings';

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
    ...(config.users.enableBilling
      ? [
          {
            title: t('settings.menu.account.billing'),
            href: `${accountSettingsBasePath}/billing`,
            icon: <CreditCardIcon className="size-4 opacity-50" />
          }
        ]
      : []),
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
    <SettingsLayoutWrapper>
      <div className="flex flex-col lg:flex-row min-h-full">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/50 bg-background lg:flex-shrink-0">
          {/* <div className="p-4 border-b border-border/50">
            <PageHeader
              title={t('settings.account.title')}
              subtitle={t('settings.account.subtitle')}
            />
          </div> */}
          <div className="p-4">
            <SettingsMenu menuItems={menuItems} />
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-background p-4">{children}</div>
      </div>
    </SettingsLayoutWrapper>
  );
}
