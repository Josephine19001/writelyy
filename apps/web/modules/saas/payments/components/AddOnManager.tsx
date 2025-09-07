'use client';

// import { config } from '@repo/config';
import { usePurchases } from '@saas/payments/hooks/purchases';
import { useOrganizationListQuery } from '@saas/organizations/lib/api';
import { SettingsItem } from '@saas/shared/components/SettingsItem';
import { Button } from '@ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@ui/components/card';
import { PlusIcon, UsersIcon, BuildingIcon, CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function AddOnManager({ organizationId }: { organizationId?: string }) {
  const t = useTranslations();
  const { activePlan } = usePurchases(organizationId);
  const { data: organizations } = useOrganizationListQuery();
  const [loading, setLoading] = useState(false);

  if (!activePlan) {
    return null;
  }

  const totalBrands = organizations?.length || 0;
  const totalMembers = organizations?.reduce((sum, org) => sum + 1, 0) || 0; // Each org has at least 1 member (owner)

  const handleAddMember = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would open an invite modal or redirect to member management
    } catch (error) {}
  };

  const handleCreateOrganization = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would redirect to organization creation
      console.log('Create organization functionality');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsItem
      title={t('settings.billing.addOns.title')}
      description={t('settings.billing.addOns.description')}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {/* Add Organization Card */}
        <Card className="p-3">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center gap-2">
              <BuildingIcon className="size-4 text-blue-600" />
              <div>
                <CardTitle className="text-sm">Additional products</CardTitle>
                <CardDescription className="text-xs">
                  Create more products for different projects
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 py-2">
            <div className="space-y-2">
              <div className="text-center">
                <p className="font-semibold text-lg">{totalBrands} products</p>
                <p className="text-muted-foreground text-xs">
                  currently active
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-xs">Each product includes:</p>
                <ul className="space-y-0.5 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>Separate analytics</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>Independent settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 pt-2">
            <Button
              onClick={handleCreateOrganization}
              loading={loading}
              className="w-full"
              size="sm"
            >
              <PlusIcon className="mr-1.5 size-3" />
              Create product
            </Button>
          </CardFooter>
        </Card>

        {/* Add Team Member Card */}
        <Card className="p-3">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-green-600" />
              <div>
                <CardTitle className="text-sm">Team Members</CardTitle>
                <CardDescription className="text-xs">
                  Invite team members to collaborate
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 py-2">
            <div className="space-y-2">
              <div className="text-center">
                <p className="font-semibold text-lg">{totalMembers} Members</p>
                <p className="text-muted-foreground text-xs">
                  across all products
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-xs">Members get:</p>
                <ul className="space-y-0.5 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>Full platform access</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>Comment management</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="mt-0.5 size-3 text-green-600 flex-shrink-0" />
                    <span>AI features access</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 pt-2">
            <Button
              onClick={handleAddMember}
              loading={loading}
              className="w-full"
              size="sm"
            >
              <PlusIcon className="mr-1.5 size-3" />
              Invite Member
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Current Setup Summary */}
      <div className="mt-6 rounded-lg border bg-muted/30 p-4">
        <h4 className="font-medium mb-3">Your Current Setup</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BuildingIcon className="size-4 text-blue-600" />
              <span className="text-sm">Products</span>
            </div>
            <div className="text-right">
              <p className="font-medium">{totalBrands}</p>
              <p className="text-muted-foreground text-xs">active</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-green-600" />
              <span className="text-sm">Team Members</span>
            </div>
            <div className="text-right">
              <p className="font-medium">{totalMembers}</p>
              <p className="text-muted-foreground text-xs">total</p>
            </div>
          </div>
        </div>
      </div>
    </SettingsItem>
  );
}
