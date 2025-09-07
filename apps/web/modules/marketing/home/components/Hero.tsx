import { Button } from '@ui/components/button';
import { ArrowRightIcon, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import heroImageDark from '../../../../public/images/hero-image-dark.png';
import heroImage from '../../../../public/images/hero-image.png';

export function Hero() {
  const t = useTranslations('marketing.hero');
  return (
    <div className="relative max-w-full overflow-x-hidden">
      <div className="absolute left-1/2 top-0 z-10 ml-[-500px] h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-30 blur-[150px]" />

      <div className="container relative z-20 pt-32 pb-16 text-center lg:pt-40 lg:pb-20">
        {/* Social proof badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-foreground/80">{t('trustedBy')}</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="mx-auto max-w-4xl text-balance font-bold text-5xl lg:text-6xl xl:text-7xl">
          {t('title1')}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {' '}
            {t('title2')}
          </span>
          — {t('title3')}.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/60 lg:text-xl">
          {t('subtitle')}
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/auth/signup">
              {t('cta')}
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Product screenshot */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="relative rounded-2xl border bg-gradient-to-tr from-primary/5 to-purple-500/5 p-3 shadow-2xl">
            <Image
              src={heroImage}
              alt="Writelyy dashboard showing AI text humanization with natural writing transformation and AI detector bypass"
              className="block rounded-xl dark:hidden"
              priority
            />
            <Image
              src={heroImageDark}
              alt="Writelyy dashboard showing AI text humanization with natural writing transformation and AI detector bypass"
              className="hidden rounded-xl dark:block"
              priority
            />

            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -left-4 rounded-full bg-green-500 px-3 py-1 text-white text-xs font-medium shadow-lg flex items-center gap-1">
              <Users className="w-3 h-3" />
              AI Detection Bypassed
            </div>
            <div className="absolute -top-4 -right-4 rounded-full bg-blue-500 px-3 py-1 text-white text-xs font-medium shadow-lg flex items-center gap-1">
              <ArrowRightIcon className="w-3 h-3" />
              Human-like Writing
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-500 px-3 py-1 text-white text-xs font-medium shadow-lg flex items-center gap-1">
              <Users className="w-3 h-3" />
              Instant Transformation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
