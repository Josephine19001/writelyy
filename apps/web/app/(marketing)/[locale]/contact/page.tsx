import { config } from '@repo/config';
import { Button } from '@ui/components/button';
import { MailIcon, MessageCircleIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  const t = await getTranslations('contact');
  return {
    title: t('title')
  };
}

export default async function ContactPage() {
  if (!config.contactForm.enabled) {
    redirect('/');
  }

  const t = await getTranslations('contact');

  const emailSubject = encodeURIComponent(t('email.subject'));
  const emailBody = encodeURIComponent(t('email.body'));

  const mailtoLink = `mailto:team@writelyy.app?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="container max-w-2xl pt-32 pb-16">
      <div className="mb-12 pt-8 text-center">
        <h1 className="mb-2 font-bold text-5xl">{t('title')}</h1>
        <p className="text-balance text-lg opacity-50">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Email Contact */}
        <div className="rounded-2xl border bg-card/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MailIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-xl">{t('email.title')}</h3>
          <p className="mb-4 text-foreground/60">
            {t('email.description')}
          </p>
          <div className="mb-6">
            <a
              href="mailto:team@writelyy.app"
              className="text-primary hover:underline font-medium"
            >
              team@writelyy.app
            </a>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <a href={mailtoLink}>
              <MailIcon className="mr-2 h-4 w-4" />
              {t('email.composeButton')}
            </a>
          </Button>
        </div>

        {/* Additional Contact Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card/30 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <MessageCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="mb-2 font-medium">{t('quickQuestions.title')}</h4>
            <p className="text-sm text-foreground/60">
              {t('quickQuestions.description')}
            </p>
          </div>

          <div className="rounded-xl border bg-card/30 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <MailIcon className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="mb-2 font-medium">{t('businessInquiries.title')}</h4>
            <p className="text-sm text-foreground/60">
              {t('businessInquiries.description')}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 text-center">
          <p className="text-foreground/70">
            <strong>{t('responseTime.title')}</strong> {t('responseTime.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
