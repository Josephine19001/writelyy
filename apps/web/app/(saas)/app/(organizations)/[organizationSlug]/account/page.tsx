import { redirect } from 'next/navigation';

export default async function AccountPage({
  params
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  // Redirect to the general account settings page
  redirect(`/app/${organizationSlug}/account/general`);
}
