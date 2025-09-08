import type { PlanId } from '@saas/payments/types';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export function usePlanData() {
  const t = useTranslations('marketing.pricing.planFeatures');

  const planData = useMemo(() => {
    const data: Record<
      PlanId,
      {
        title: string;
        description: ReactNode;
        features: ReactNode[];
      }
    > = {
      starter: {
        title: t('starter.title'),
        description: t('starter.description'),
        features: [
          t('starter.features.0'),
          t('starter.features.1'),
          t('starter.features.2'),
          t('starter.features.3'),
          t('starter.features.4'),
          t('starter.features.5'),
          t('starter.features.7')
        ]
      },
      pro: {
        title: t('pro.title'),
        description: t('pro.description'),
        features: [
          t('pro.features.0'),
          t('pro.features.1'),
          t('pro.features.2'),
          t('pro.features.3'),
          t('pro.features.4'),
          t('pro.features.5'),
          t('pro.features.8'),
          t('pro.features.9')
        ]
      },
      max: {
        title: t('max.title'),
        description: t('max.description'),
        features: [
          t('max.features.0'),
          t('max.features.1'),
          t('max.features.2'),
          t('max.features.3'),
          t('max.features.4'),
          t('max.features.5'),
          t('max.features.6'),
          t('max.features.8'),
          t('max.features.9')
        ]
      }
    };
    return data;
  }, [t]);

  return { planData };
}
