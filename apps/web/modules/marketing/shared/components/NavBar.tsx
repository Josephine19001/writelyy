'use client';

import { LocaleLink, useLocalePathname } from '@i18n/routing';
import { config } from '@repo/config';
import { useSession } from '@saas/auth/hooks/use-session';
import { ColorModeToggle } from '@shared/components/ColorModeToggle';
import { LocaleSwitch } from '@shared/components/LocaleSwitch';
import { Logo } from '@shared/components/Logo';
import { Button } from '@ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@ui/components/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@ui/components/sheet';
import { cn } from '@ui/lib';
import {
  MenuIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  UserIcon,
  BrainIcon,
  SparklesIcon,
  ShieldCheckIcon,
  FileTextIcon,
  RepeatIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export function NavBar() {
  const t = useTranslations();
  const { user } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const localePathname = useLocalePathname();
  const [isTop, setIsTop] = useState(true);

  const debouncedScrollHandler = useDebounceCallback(
    () => {
      setIsTop(window.scrollY <= 10);
    },
    150,
    {
      maxWait: 150
    }
  );

  useEffect(() => {
    window.addEventListener('scroll', debouncedScrollHandler);
    debouncedScrollHandler();
    return () => {
      window.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [localePathname]);

  const isDocsPage = localePathname.startsWith('/docs');

  const productTools = [
    {
      label: t('tools.humanizer.name'),
      href: user ? '/app' : '/auth/login',
      icon: SparklesIcon,
      description: t('tools.humanizer.description')
    },
    {
      label: t('tools.detector.name'),
      href: user ? '/app/detector' : '/auth/login',
      icon: ShieldCheckIcon,
      description: t('tools.detector.description')
    },
    {
      label: t('tools.summariser.name'),
      href: user ? '/app/summariser' : '/auth/login',
      icon: FileTextIcon,
      description: t('tools.summariser.description')
    },
    {
      label: t('tools.paraphraser.name'),
      href: user ? '/app/paraphraser' : '/auth/login',
      icon: RepeatIcon,
      description: t('tools.paraphraser.description')
    }
  ];

  const useCases = [
    {
      label: 'Creators',
      href: '/use-cases/creators',
      icon: TrendingUpIcon,
      description: 'Research trends and understand your audience'
    },
    {
      label: 'Product Teams',
      href: '/use-cases/product-teams',
      icon: BrainIcon,
      description: 'Turn feedback into product decisions'
    },
    {
      label: 'Social Media Strategists',
      href: '/use-cases/social-media-strategists',
      icon: UserIcon,
      description: 'Monitor context sentiment and engagement'
    }
  ];

  const menuItems: {
    label: string;
    href: string;
  }[] = [
    {
      label: t('marketing.nav.pricing'),
      href: '/#pricing'
    },
    {
      label: t('marketing.nav.contact'),
      href: '/contact'
    }
  ];

  const isMenuItemActive = (href: string) => localePathname.startsWith(href);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-shadow duration-200',
        !isTop || isDocsPage
          ? 'bg-card/80 shadow-sm backdrop-blur-lg'
          : 'shadow-none'
      )}
      data-test="navigation"
    >
      <div className="container">
        <div
          className={cn(
            'flex items-center justify-stretch gap-6 transition-[padding] duration-200',
            !isTop || isDocsPage ? 'py-4' : 'py-6'
          )}
        >
          <div className="flex flex-1 justify-start">
            <LocaleLink
              href="/"
              className="block hover:no-underline active:no-underline"
            >
              <Logo />
            </LocaleLink>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="px-3 py-2 font-medium text-foreground/80 text-sm hover:text-foreground transition-colors h-auto gap-1"
                >
                  {t('marketing.nav.product')}
                  <ChevronDownIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-80">
                {productTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild className="p-0">
                    <NextLink
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
                      prefetch={!user}
                    >
                      <div className="flex-shrink-0">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{tool.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {tool.description}
                        </div>
                      </div>
                    </NextLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {menuItems.map((menuItem) => (
              <LocaleLink
                key={menuItem.href}
                href={menuItem.href}
                className={cn(
                  'block px-3 py-2 font-medium text-foreground/80 text-sm hover:text-foreground transition-colors',
                  isMenuItemActive(menuItem.href)
                    ? 'font-bold text-foreground'
                    : ''
                )}
                prefetch
              >
                {menuItem.label}
              </LocaleLink>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <ColorModeToggle />
            {config.i18n.enabled && (
              <Suspense>
                <LocaleSwitch />
              </Suspense>
            )}

            <Sheet
              open={mobileMenuOpen}
              onOpenChange={(open) => setMobileMenuOpen(open)}
            >
              <SheetTrigger asChild>
                <Button
                  className="lg:hidden"
                  size="icon"
                  variant="light"
                  aria-label="Menu"
                >
                  <MenuIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px]" side="right">
                <SheetTitle />
                <div className="flex flex-col items-start justify-center">
                  {/* Product Tools Section */}
                  <div className="w-full px-3 py-2">
                    <div className="text-sm font-medium text-foreground/60 mb-2">
                      {t('marketing.nav.product')}
                    </div>
                    {productTools.map((tool) => (
                      <NextLink
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-3 px-3 py-2 text-base text-foreground/80 hover:text-foreground"
                        prefetch={!user}
                      >
                        <tool.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{tool.label}</div>
                          <div className="text-sm text-foreground/60">
                            {tool.description}
                          </div>
                        </div>
                      </NextLink>
                    ))}
                  </div>

                  {/* Use Cases Section */}
                  <div className="w-full px-3 py-2">
                    <div className="text-sm font-medium text-foreground/60 mb-2">
                      Use Cases
                    </div>
                    {useCases.map((useCase) => (
                      <LocaleLink
                        key={useCase.href}
                        href={useCase.href}
                        className="flex items-center gap-3 px-3 py-2 text-base text-foreground/80 hover:text-foreground"
                        prefetch
                      >
                        <useCase.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{useCase.label}</div>
                          <div className="text-sm text-foreground/60">
                            {useCase.description}
                          </div>
                        </div>
                      </LocaleLink>
                    ))}
                  </div>

                  {menuItems.map((menuItem) => (
                    <LocaleLink
                      key={menuItem.href}
                      href={menuItem.href}
                      className={cn(
                        'block px-3 py-2 font-medium text-base text-foreground/80',
                        isMenuItemActive(menuItem.href)
                          ? 'font-bold text-foreground'
                          : ''
                      )}
                      prefetch
                    >
                      {menuItem.label}
                    </LocaleLink>
                  ))}

                  <NextLink
                    key={user ? 'start' : 'login'}
                    href={user ? '/app' : '/auth/login'}
                    className="block px-3 py-2 text-base"
                    prefetch={!user}
                  >
                    {user ? t('common.menu.dashboard') : t('common.menu.login')}
                  </NextLink>
                </div>
              </SheetContent>
            </Sheet>

            {config.ui.saas.enabled &&
              (user ? (
                <Button
                  key="dashboard"
                  className="hidden lg:flex"
                  asChild
                  variant="secondary"
                >
                  <NextLink href="/app">{t('common.menu.dashboard')}</NextLink>
                </Button>
              ) : (
                <Button
                  key="login"
                  className="hidden lg:flex"
                  asChild
                  variant="secondary"
                >
                  <NextLink href="/auth/login" prefetch>
                    {t('common.menu.login')}
                  </NextLink>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
