'use client';
import { type Config, config } from '@repo/config';
import { useCreateCheckoutLinkMutation } from '@saas/payments/lib/api';
import { usePlanData } from '@saas/payments/hooks/plan-data';
import { useLocaleCurrency } from '@shared/hooks/locale-currency';
import { useRouter } from '@shared/hooks/router';
import { Button } from '@ui/components/button';
import { Tabs, TabsList, TabsTrigger } from '@ui/components/tabs';
import { cn } from '@ui/lib';
import { ArrowRightIcon, CheckIcon, StarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const plans = config.payments.plans as Config['payments']['plans'];

export function PricingTable({
  className,
  userId,
  organizationId,
  variant = 'default',
  activePlanId
}: {
  className?: string;
  userId?: string;
  organizationId?: string;
  variant?: 'default' | 'compact';
  activePlanId?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const localeCurrency = useLocaleCurrency();
  const [loading, setLoading] = useState<string | false>(false);
  const { planData } = usePlanData();

  const createCheckoutLinkMutation = useCreateCheckoutLinkMutation();

  // Tab state - default to monthly recurring
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  // Reset selected index when tab changes
  const handleTabChange = (value: string) => {
    const tab = value as 'monthly' | 'yearly';
    setActiveTab(tab);
  };

  const onSelectPlan = async (productId: string) => {
    if (!(userId || organizationId) || !productId) {
      router.push('/auth/signup');
      return;
    }

    setLoading(productId);

    const mutationParams = {
      type: 'subscription' as const,
      productId,
      organizationId,
      redirectUrl: window.location.href
    };

    try {
      const result =
        await createCheckoutLinkMutation.mutateAsync(mutationParams);

      if (result.checkoutLink) {
        window.location.href = result.checkoutLink;
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={cn('@container', className)}>
      <div className={cn(isCompact ? 'w-full' : 'max-w-6xl mx-auto')}>
        {/* Tabs */}
        <div className={cn('flex justify-center', isCompact ? 'mb-6' : 'mb-8')}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="border-foreground/10">
              <TabsTrigger value="monthly">
                {t('marketing.pricing.monthly')}
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex items-center gap-2">
                {t('marketing.pricing.yearly')}
                {/* Calculate average savings percentage across all plans */}
                {(() => {
                  const allSavings = Object.entries(planData)
                    .map(([planId, plan]) => {
                      const configPlan = plans[planId as keyof typeof plans];
                      const monthlyPrice = configPlan?.prices?.find(
                        (p) =>
                          p.type === 'recurring' &&
                          p.interval === 'month' &&
                          p.currency === localeCurrency
                      );
                      const yearlyPrice = configPlan?.prices?.find(
                        (p) =>
                          p.type === 'recurring' &&
                          p.interval === 'year' &&
                          p.currency === localeCurrency
                      );

                      if (monthlyPrice && yearlyPrice) {
                        const savings =
                          monthlyPrice.amount * 12 - yearlyPrice.amount;
                        return savings > 0
                          ? Math.round(
                              (savings / (monthlyPrice.amount * 12)) * 100
                            )
                          : 0;
                      }
                      return 0;
                    })
                    .filter((s) => s > 0);

                  const avgSavings =
                    allSavings.length > 0
                      ? Math.round(
                          allSavings.reduce((a, b) => a + b, 0) /
                            allSavings.length
                        )
                      : 0;

                  return (
                    avgSavings > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Save {avgSavings}%
                      </span>
                    )
                  );
                })()}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Grid */}
        <div
          className={cn(
            'grid gap-4',
            isCompact
              ? 'grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3'
              : 'md:grid-cols-3 gap-6'
          )}
        >
          {Object.entries(planData).map(([planId, plan]) => {
            const configPlan = plans[planId as keyof typeof plans];
            const price = configPlan?.prices?.find(
              (p) =>
                p.type === 'recurring' &&
                p.interval === (activeTab === 'monthly' ? 'month' : 'year') &&
                p.currency === localeCurrency
            );

            if (!price) {
              return null;
            }

            // Find both monthly and yearly prices for savings calculation
            const monthlyPrice = configPlan?.prices?.find(
              (p) =>
                p.type === 'recurring' &&
                p.interval === 'month' &&
                p.currency === localeCurrency
            );
            const yearlyPrice = configPlan?.prices?.find(
              (p) =>
                p.type === 'recurring' &&
                p.interval === 'year' &&
                p.currency === localeCurrency
            );

            // Calculate savings
            const monthlySavings =
              monthlyPrice && yearlyPrice
                ? monthlyPrice.amount * 12 - yearlyPrice.amount
                : 0;
            const yearlySavingsPercentage =
              monthlyPrice && monthlySavings > 0
                ? Math.round(
                    (monthlySavings / (monthlyPrice.amount * 12)) * 100
                  )
                : 0;

            const isRecommended = planId === 'pro';
            const isActivePlan =
              activePlanId && price.productId === activePlanId;

            return (
              <div
                key={planId}
                className={cn(
                  'rounded-2xl border-2 relative flex flex-col h-full',
                  isCompact ? 'p-4' : 'p-6',
                  isActivePlan
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    : isRecommended
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white dark:bg-gray-800'
                )}
              >
                {/* Active Plan Badge */}
                {isActivePlan && (
                  <div
                    className={cn(
                      'flex justify-center',
                      isCompact ? '-mt-7' : '-mt-9'
                    )}
                  >
                    <div
                      className={cn(
                        'mb-4 flex h-6 w-auto items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 font-semibold text-white text-xs',
                        isCompact && 'mb-3'
                      )}
                    >
                      <CheckIcon className="size-3" />
                      Current Plan
                    </div>
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && !isActivePlan && (
                  <div
                    className={cn(
                      'flex justify-center',
                      isCompact ? '-mt-7' : '-mt-9'
                    )}
                  >
                    <div
                      className={cn(
                        'mb-4 flex h-6 w-auto items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs',
                        isCompact && 'mb-3'
                      )}
                    >
                      <StarIcon className="size-3" />
                      {t('marketing.pricing.recommended')}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={cn('text-center', isCompact ? 'mb-4' : 'mb-6')}>
                  <h3
                    className={cn(
                      'font-bold mb-2',
                      isCompact ? 'text-lg' : 'text-2xl'
                    )}
                  >
                    {plan.title}
                  </h3>
                  {/* <p
                    className={cn(
                      'text-foreground/60 text-sm',
                      isCompact ? 'mb-3' : 'mb-4'
                    )}
                  >
                    {plan.description}
                  </p> */}

                  {/* Price */}
                  <div className={cn(isCompact ? 'mb-3' : 'mb-4')}>
                    <div className="flex items-start justify-center gap-2">
                      {/* Left side: Current price */}
                      <strong
                        className={cn(
                          'font-bold text-primary',
                          isCompact ? 'text-2xl' : 'text-3xl'
                        )}
                      >
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: price.currency,
                          minimumFractionDigits: 0
                        }).format(price.amount)}
                      </strong>

                      {/* Right side: Period and crossed out price */}
                      <div className="flex flex-col items-start">
                        {/* Top: Period */}
                        <span className="font-normal text-sm opacity-60">
                          /
                          {activeTab === 'monthly'
                            ? t('marketing.pricing.month')
                            : t('marketing.pricing.year')}
                        </span>

                        {/* Bottom: Crossed out price (only for yearly with savings) */}
                        {activeTab === 'yearly' &&
                          monthlyPrice &&
                          yearlySavingsPercentage > 0 && (
                            <span className="text-foreground/50 line-through text-xs">
                              {Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: price.currency,
                                minimumFractionDigits: 0
                              }).format(monthlyPrice.amount * 12)}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <ul
                  className={cn(
                    'flex-grow',
                    isCompact ? 'space-y-2 mb-6' : 'space-y-3 mb-8'
                  )}
                >
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="mr-3 size-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Purchase Button */}
                <Button
                  className={cn(
                    'w-full',
                    isActivePlan
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : isRecommended
                        ? 'bg-primary hover:bg-primary/90'
                        : 'border border-border hover:border-primary/50 bg-transparent hover:bg-primary/5'
                  )}
                  size={isCompact ? 'md' : 'lg'}
                  onClick={() => !isActivePlan && onSelectPlan(price.productId)}
                  loading={loading === price.productId}
                  variant={
                    isActivePlan
                      ? 'secondary'
                      : isRecommended
                        ? 'primary'
                        : 'outline'
                  }
                  disabled={!!isActivePlan}
                >
                  {isActivePlan
                    ? 'Current Plan'
                    : isCompact
                      ? t('marketing.pricing.subscribe')
                      : t('marketing.pricing.subscribeToTitle', {
                          title: plan.title
                        })}
                  {!isActivePlan && <ArrowRightIcon className="ml-2 size-4" />}
                  {isActivePlan && <CheckIcon className="ml-2 size-4" />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
