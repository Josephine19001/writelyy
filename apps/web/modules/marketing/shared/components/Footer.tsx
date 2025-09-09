import { LocaleLink } from '@i18n/routing';
// import { config } from '@repo/config';
import { Logo } from '@shared/components/Logo';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('marketing');

  return (
    <footer className="border-t py-8 text-foreground/60 text-sm">
      <div className="flex container items-center justify-between flex-wrap">
        <div className="flex gap-2 items-center">
          <Logo className="opacity-70 grayscale" />

          <p className="text-sm opacity-70">
            © {new Date().getFullYear()}. {t('footer.allRightsReserved')}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <a
            href="https://x.com/loplyyai"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <title>X (Twitter)</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          </a>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <a href="/#pricing" className="block">
            {t('nav.pricing')}
          </a>
          <LocaleLink href="contact" className="block">
            {t('nav.contact')}
          </LocaleLink>
          <LocaleLink href="/legal/terms" className="block">
            {t('footer.terms')}
          </LocaleLink>
          <LocaleLink href="/legal/privacy-policy" className="block">
            {t('footer.privacy')}
          </LocaleLink>
        </div>
      </div>
    </footer>
  );
}
