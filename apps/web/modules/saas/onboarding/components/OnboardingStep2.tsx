'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
import { Button } from '@ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@ui/components/form';
import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  role: z.enum(['creator', 'product_team', 'social_media_strategist'])
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingStep2({
  onCompleted,
  onBack
}: {
  onCompleted: () => void;
  onBack: () => void;
}) {
  const t = useTranslations();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: undefined
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ role }) => {
    form.clearErrors('root');

    try {
      await authClient.updateUser({
        role
      });

      onCompleted();
    } catch (e) {
      form.setError('root', {
        type: 'server',
        message: t('onboarding.notifications.roleSaveFailed')
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col items-stretch gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t('onboarding.role.title')}
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <input
                        type="radio"
                        value="creator"
                        checked={field.value === 'creator'}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          🎬 {t('onboarding.role.creator.title')}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">
                          {t('onboarding.role.creator.description')}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <input
                        type="radio"
                        value="product_team"
                        checked={field.value === 'product_team'}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          🚀 {t('onboarding.role.productTeam.title')}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">
                          {t('onboarding.role.productTeam.description')}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <input
                        type="radio"
                        value="social_media_strategist"
                        checked={field.value === 'social_media_strategist'}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          📈 {t('onboarding.role.socialMediaStrategist.title')}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">
                          {t(
                            'onboarding.role.socialMediaStrategist.description'
                          )}
                        </p>
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              className="flex-1"
            >
              {t('onboarding.continue')}
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
