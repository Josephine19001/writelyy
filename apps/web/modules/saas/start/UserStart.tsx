'use client';
import { config } from '@repo/config';
import { useSession } from '@saas/auth/hooks/use-session';
import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import { useOrganizationListQuery } from '@saas/organizations/lib/api';
import { OrganizationsGrid } from '@saas/organizations/components/OrganizationsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Button } from '@ui/components/button';
import { useTranslations } from 'next-intl';
import {
  MessageSquareIcon,
  TrendingUpIcon,
  SparklesIcon,
  PlusIcon,
  ArrowRightIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react';
import Link from 'next/link';

export default function UserStart() {
  const t = useTranslations();
  const { user } = useSession();
  const { setActiveOrganization } = useActiveOrganization();
  const { data: allOrganizations, isLoading } = useOrganizationListQuery();

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If user has organizations, show the grid
  if (
    config.organizations.enable &&
    allOrganizations &&
    allOrganizations.length > 0
  ) {
    return (
      <div className="space-y-8">
        <OrganizationsGrid />

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold">
                    {allOrganizations.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active organizations
                  </p>
                </div>
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    AI Analysis
                  </p>
                  <p className="text-2xl font-bold">Ready</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by AI
                  </p>
                </div>
                <SparklesIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Automation
                  </p>
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Smart workflows
                  </p>
                </div>
                <ZapIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Get Started
                </h4>
                <div className="space-y-2">
                  {allOrganizations.slice(0, 3).map((org) => (
                    <Button
                      key={org.id}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setActiveOrganization(org.slug)}
                    >
                      <span>Open {org.name}</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Management
                </h4>
                <div className="space-y-2">
                  {config.organizations.enableUsersToCreateOrganizations && (
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      asChild
                    >
                      <Link href="/app/new-organization">
                        <span>Create New Product</span>
                        <PlusIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {!config.organizations.requireOrganization && (
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      asChild
                    >
                      <Link href="/app/settings/general">
                        <span>Account Settings</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for no organizations
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first product to start analyzing social media engagement
          with AI.
        </p>
        {config.organizations.enableUsersToCreateOrganizations && (
          <Button asChild>
            <Link href="/app/new-organization">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Product
            </Link>
          </Button>
        )}
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquareIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Comment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered sentiment analysis and smart categorization of social
              media comments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUpIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Engagement Insights</h3>
            <p className="text-sm text-muted-foreground">
              Track performance metrics and understand your audience engagement
              patterns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <SparklesIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Feature Extraction</h3>
            <p className="text-sm text-muted-foreground">
              Automatically extract requests and feedback from user comments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
