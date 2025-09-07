'use client';

import { usePurchases } from '@saas/payments/hooks/purchases';
import { useOrganizationListQuery } from '@saas/organizations/lib/api';
import { SettingsItem } from '@saas/shared/components/SettingsItem';
import { Badge } from '@ui/components/badge';
import { UsersIcon, BuildingIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UsageOverview({ organizationId }: { organizationId?: string }) {
  const t = useTranslations();
  const { activePlan } = usePurchases(organizationId);
  const { data: organizations } = useOrganizationListQuery();

  if (!activePlan) {
    return null;
  }

  const totalBrands = organizations?.length || 0;
  const totalMembers = totalBrands; // Each organization has 1 member (owner)

  // Calculate additional counts (beyond base plan)
  const additionalBrands = Math.max(0, totalBrands - 1);
  const basePlanMembers = 1; // Base plan includes 1 member
  const brandMembers = additionalBrands * 1; // Each additional product includes 1 member
  const additionalMembers = Math.max(
    0,
    totalMembers - basePlanMembers - brandMembers
  );

  return (
    <SettingsItem title={t('settings.billing.usage.title')}>
      <div className="space-y-3">
        {/* Current Setup Overview */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <h4 className="font-medium mb-2 text-sm">
            {t('settings.billing.addOns.currentSetup.title')}
          </h4>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('settings.billing.addOns.currentSetup.basePlan')}
              </span>
              <Badge className="h-5 text-xs">Included</Badge>
            </div>

            {additionalBrands > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('settings.billing.addOns.currentSetup.additionalBrands', {
                    count: additionalBrands,
                    amount: additionalBrands * 25
                  })}
                </span>
                <Badge className="h-5 text-xs">Add-on</Badge>
              </div>
            )}

            {additionalMembers > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('settings.billing.addOns.currentSetup.additionalMembers', {
                    count: additionalMembers,
                    amount: additionalMembers * 15
                  })}
                </span>
                <Badge className="h-5 text-xs">Add-on</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Products and Members Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BuildingIcon className="size-3 text-blue-600" />
              <span className="font-medium text-sm">Products</span>
            </div>
            <p className="text-xl font-bold">{totalBrands}</p>
            <p className="text-muted-foreground text-xs">
              {totalBrands === 1
                ? 'Base plan'
                : `1 base + ${additionalBrands} additional`}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-3 text-green-600" />
              <span className="font-medium text-sm">Team Members</span>
            </div>
            <p className="text-xl font-bold">{totalMembers}</p>
            <p className="text-muted-foreground text-xs">
              {totalMembers === 1
                ? 'Base plan'
                : `${basePlanMembers + brandMembers} included + ${additionalMembers} additional`}
            </p>
          </div>
        </div>
      </div>
    </SettingsItem>
  );
}
