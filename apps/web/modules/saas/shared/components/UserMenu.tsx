'use client';

import { DropdownMenuSub } from '@radix-ui/react-dropdown-menu';
import { authClient } from '@repo/auth/client';
import { config } from '@repo/config';
import { useSession } from '@saas/auth/hooks/use-session';
import { UserAvatar } from '@shared/components/UserAvatar';
import { clearCache } from '@shared/lib/cache';
import { useActivePlan } from '@saas/payments/hooks/use-active-plan';
import { useMonthlyUsage } from '@shared/hooks/use-monthly-usage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@ui/components/dropdown-menu';
import {
  GlobeIcon,
  HardDriveIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  MoreVerticalIcon,
  SettingsIcon,
  SunIcon
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { updateLocale } from '@i18n/lib/update-locale';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Locale } from '@repo/i18n';

export function UserMenu({ showUserName }: { showUserName?: boolean }) {
  const t = useTranslations();
  const { user } = useSession();
  const locale = useLocale();
  const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState<string>(currentTheme ?? 'system');
  const { activePlan } = useActivePlan();
  const { currentUsageFormatted, wordLimitFormatted } = useMonthlyUsage();
  const router = useRouter();

  const updateLocaleMutation = useMutation({
    mutationFn: async (newLocale: Locale) => {
      await authClient.updateUser({
        locale: newLocale
      });
      await updateLocale(newLocale);
      router.refresh();
    }
  });

  const handleLocaleChange = async (newLocale: string) => {
    try {
      await updateLocaleMutation.mutateAsync(newLocale as Locale);
      toast.success(t('settings.account.language.notifications.success'));
    } catch {
      toast.error(t('settings.account.language.notifications.error'));
    }
  };

  const colorModeOptions = [
    {
      value: 'system',
      label: 'System',
      icon: HardDriveIcon
    },
    {
      value: 'light',
      label: 'Light',
      icon: SunIcon
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: MoonIcon
    }
  ];

  const localeOptions = Object.entries(config.i18n.locales).map(
    ([value, { label }]) => ({
      value,
      label
    })
  );

  const getPlanDisplayName = () => {
    if (!activePlan) {
      return 'Free Plan';
    }
    switch (activePlan.id) {
      case 'starter':
        return 'Starter Plan';
      case 'credits':
        return 'Credits Plan';
      case 'pro':
        return 'Pro Plan';
      case 'max':
        return 'Max Plan';
      default:
        return 'Free Plan';
    }
  };

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await clearCache();
          window.location.href = new URL(
            config.auth.redirectAfterLogout,
            window.location.origin
          ).toString();
        }
      }
    });
  };

  if (!user) {
    return null;
  }

  const { name, email, image } = user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex cursor-pointer w-full items-center justify-between gap-2 rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:w-[100%+1rem] md:px-2 md:py-1.5 md:hover:bg-primary/5"
          aria-label="User menu"
        >
          <span className="flex items-center gap-2">
            <UserAvatar name={name ?? ''} avatarUrl={image} />
            {showUserName && (
              <span className="text-left leading-tight">
                <span className="font-medium text-sm">{name}</span>
                <span className="block text-xs opacity-70">
                  {getPlanDisplayName()}
                </span>
              </span>
            )}
          </span>

          {showUserName && <MoreVerticalIcon className="size-4" />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {name}
          <span className="block font-normal text-xs opacity-70">{email}</span>
          <span className="block font-normal text-xs opacity-70 mt-1">
            {getPlanDisplayName()}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/app/settings/general">
            <SettingsIcon className="mr-2 size-4" />
            {t('app.userMenu.accountSettings')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Color mode selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunIcon className="mr-2 size-4" />
            {t('app.userMenu.colorMode')}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  setCurrentTheme(value);
                }}
              >
                {colorModeOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    <option.icon className="mr-2 size-4 opacity-50" />
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Language selection */}
        {config.i18n.enabled && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GlobeIcon className="mr-2 size-4" />
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={locale}
                  onValueChange={handleLocaleChange}
                >
                  {localeOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      disabled={updateLocaleMutation.isPending}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">
            <HomeIcon className="mr-2 size-4" />
            {t('app.userMenu.home')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon className="mr-2 size-4" />
          {t('app.userMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
