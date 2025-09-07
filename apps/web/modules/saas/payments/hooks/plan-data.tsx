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
          t('starter.features.6'),
          t('starter.features.7'),
          t('starter.features.8')
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
          t('pro.features.6'),
          t('pro.features.7'),
          t('pro.features.8'),
          t('pro.features.9'),
          t('pro.features.10'),
          t('pro.features.11')
        ]
      },
      unlimited: {
        title: t('unlimited.title'),
        description: t('unlimited.description'),
        features: [
          t('unlimited.features.0'),
          t('unlimited.features.1'),
          t('unlimited.features.2'),
          t('unlimited.features.3'),
          t('unlimited.features.4'),
          t('unlimited.features.5'),
          t('unlimited.features.6'),
          t('unlimited.features.7'),
          t('unlimited.features.8'),
          t('unlimited.features.9'),
          t('unlimited.features.10'),
          t('unlimited.features.11')
        ]
      }
    };
    return data;
  }, [t]);

  return { planData };
}
