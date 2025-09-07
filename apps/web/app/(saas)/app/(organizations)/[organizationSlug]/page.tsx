import { getActiveOrganization } from '@saas/auth/lib/server';
import OrganizationStart from '@saas/organizations/components/OrganizationStart';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const activeOrganization = await getActiveOrganization(
    organizationSlug as string
  );

  return {
    title: activeOrganization?.name
  };
}

export default async function OrganizationPage({
  params
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const t = await getTranslations();

  const activeOrganization = await getActiveOrganization(
    organizationSlug as string
  );

  if (!activeOrganization) {
    return notFound();
  }

  return (
    <div>
      <OrganizationStart />
    </div>
  );
}
