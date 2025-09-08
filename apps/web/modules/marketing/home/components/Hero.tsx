// import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HeroTryComponent } from './HeroTryComponent';

export function Hero() {
  const t = useTranslations('marketing.hero');
  return (
    <div className="relative max-w-full overflow-x-hidden">
      <div className="absolute left-1/2 top-0 z-10 ml-[-500px] h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-30 blur-[150px]" />

      <div className="container relative z-20 pt-20 pb-2 text-center lg:pt-24 lg:pb-4">
        {/* Social proof badge */}
        {/* <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-foreground/80">{t('trustedBy')}</span>
          </div>
        </div> */}

        {/* Main headline */}
        <h1 className="mx-auto max-w-4xl text-balance font-bold text-4xl lg:text-5xl xl:text-6xl">
          {t('title1')}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {' '}
            {t('title2')}
          </span>
          — {t('title3')}.
        </h1>

        {/* Try Before Signup Component */}
        <HeroTryComponent />
      </div>
    </div>
  );
}
