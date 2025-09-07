'use client';

import { config } from '@repo/config';
import { OrganizationLogo } from '@saas/organizations/components/OrganizationLogo';
import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { useOrganizationListQuery } from '@saas/organizations/lib/api';
import { Card } from '@ui/components/card';
import { Input } from '@ui/components/input';
import { ChevronRightIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export function OrganizationsGrid() {
  const t = useTranslations();
  const { setActiveOrganization } = useActiveOrganization();
  const { data: allOrganizations } = useOrganizationListQuery();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    if (!allOrganizations) return [];

    if (!searchQuery.trim()) {
      return allOrganizations;
    }

    return allOrganizations.filter((organization) =>
      organization.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOrganizations, searchQuery]);

  return (
    <div className="@container space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid @2xl:grid-cols-3 @lg:grid-cols-2 grid-cols-1 gap-4">
        {filteredOrganizations?.map((organization) => (
          <Card
            key={organization.id}
            className="flex cursor-pointer items-center gap-4 overflow-hidden p-4 transition-all hover:shadow-md"
            onClick={() => setActiveOrganization(organization.slug)}
          >
            <OrganizationLogo
              name={organization.name}
              logoUrl={organization.logo}
              className="size-12"
            />
            <span className="flex items-center gap-1 text-base leading-tight">
              <span className="block font-medium">{organization.name}</span>
              <ChevronRightIcon className="size-4" />
            </span>
          </Card>
        ))}

        {config.organizations.enableUsersToCreateOrganizations && (
          <Link
            href="/app/new-organization"
            data-tour="create-organization"
            className="flex h-full items-center justify-center gap-2 rounded-2xl bg-primary/5 p-4 text-primary transition-colors duration-150 hover:bg-primary/10"
          >
            <PlusCircleIcon />
            <span className="font-medium text-sm">
              {t('organizations.organizationsGrid.createNewOrganization')}
            </span>
          </Link>
        )}
      </div>

      {/* No results message */}
      {searchQuery.trim() && filteredOrganizations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
