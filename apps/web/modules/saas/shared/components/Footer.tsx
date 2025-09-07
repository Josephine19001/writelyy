import { LocaleLink } from '@i18n/routing';
import { cn } from '@ui/lib';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('marketing');
  return (
    <footer
      className={cn(
        'container max-w-6xl py-6 text-center text-foreground/60 text-xs'
      )}
    >
      <LocaleLink href="/legal/terms" className="mr-4">
        {t('footer.terms')}
      </LocaleLink>
      <LocaleLink href="/legal/privacy-policy">
        {t('footer.privacy')}
      </LocaleLink>
    </footer>
  );
}
