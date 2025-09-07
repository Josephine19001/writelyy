'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActiveOrganization } from '@saas/organizations/hooks/use-active-organization';
import {
  organizationListQueryKey,
  useUpdateOrganizationMutation
} from '@saas/organizations/lib/api';
import { SettingsItem } from '@saas/shared/components/SettingsItem';
import { useRouter } from '@shared/hooks/router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@ui/components/button';
import { Input } from '@ui/components/input';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(3)
});

type FormSchema = z.infer<typeof formSchema>;

export function ChangeOrganizationNameForm() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeOrganization } = useActiveOrganization();
  const updateOrganizationMutation = useUpdateOrganizationMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activeOrganization?.name ?? ''
    }
  });

  const onSubmit = form.handleSubmit(async ({ name }) => {
    if (!activeOrganization) {
      return;
    }

    try {
      // Always update slug when name changes to ensure consistency
      const shouldUpdateSlug = activeOrganization.name !== name;

      const updatedOrganization = await updateOrganizationMutation.mutateAsync({
        id: activeOrganization.id,
        name,
        updateSlug: shouldUpdateSlug
      });

      toast.success(
        t('organizations.settings.notifications.organizationNameUpdated')
      );

      queryClient.invalidateQueries({
        queryKey: organizationListQueryKey
      });

      // If slug was updated, redirect to new URL
      if (
        updatedOrganization &&
        shouldUpdateSlug &&
        updatedOrganization.slug !== activeOrganization.slug
      ) {
        // Use replace instead of push to avoid back button issues
        router.replace(`/app/${updatedOrganization.slug}/settings/general`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update organization name:', error);
      toast.error(
        t('organizations.settings.notifications.organizationNameNotUpdated')
      );
    }
  });

  return (
    <SettingsItem title={t('organizations.settings.changeName.title')}>
      <form onSubmit={onSubmit}>
        <Input {...form.register('name')} />

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            disabled={
              !(form.formState.isValid && form.formState.dirtyFields.name)
            }
            loading={
              form.formState.isSubmitting ||
              updateOrganizationMutation.isPending
            }
          >
            {t('settings.save')}
          </Button>
        </div>
      </form>
    </SettingsItem>
  );
}
