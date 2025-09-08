import { AiDetectorShowcase } from '@marketing/home/components/AiDetectorShowcase';
import { FaqSection } from '@marketing/home/components/FaqSection';
// import { FeaturesSection } from '@marketing/home/components/FeaturesSection';
import { Hero } from '@marketing/home/components/Hero';
import { HowItWorks } from '@marketing/home/components/HowItWorksNew';
// import { IntegrationsShowcase } from '@marketing/home/components/IntegrationsShowcase';
// import { Newsletter } from '@marketing/home/components/Newsletter';
import { PricingTable } from '@saas/payments/components/PricingTable';
import { ReviewsSection } from '@marketing/home/components/ReviewsSection';
import { Testimonials } from '@marketing/home/components/Testimonials';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('marketing.pricingSection');

  return (
    <>
      <Hero />
      <AiDetectorShowcase />
      <HowItWorks />
      {/* <FeaturesSection /> */}
      {/* <IntegrationsShowcase /> */}
      <ReviewsSection />
      <section
        id="pricing"
        className="py-16 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
      >
        <div className="container max-w-6xl">
          <div className="mb-12 lg:text-center">
            <h1 className="font-bold text-4xl lg:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-foreground/60">{t('subtitle')}</p>
          </div>
          <PricingTable />
        </div>
      </section>
      <Testimonials />
      <FaqSection />
      {/* <Newsletter /> */}
    </>
  );
}
