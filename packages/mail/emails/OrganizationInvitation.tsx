import { Link, Text, Hr, Section } from '@react-email/components';
import React from 'react';
import { createTranslator } from 'use-intl/core';
import PrimaryButton from '../src/components/PrimaryButton';
import Wrapper from '../src/components/Wrapper';
import { defaultLocale, defaultTranslations } from '../src/util/translations';
import type { BaseMailProps } from '../types';

export function OrganizationInvitation({
  url,
  name,
  brandName,
  locale,
  translations
}: {
  url: string;
  name: string;
  brandName: string;
} & BaseMailProps) {
  const t = createTranslator({
    locale,
    messages: translations
  });

  return (
    <Wrapper>
      {/* Welcome Message */}
      <Section className="text-center mb-6">
        <Text className="text-2xl font-bold text-foreground mb-2">
          🎉 Team Invitation
        </Text>
        <Text className="text-lg text-foreground/70">
          {name ? `Hey ${name},` : 'Hey,'}
        </Text>
      </Section>

      {/* Main Content */}
      <Section className="mb-6">
        <Text className="text-foreground text-base leading-relaxed mb-4">
          {t('mail.organizationInvitation.body', { brandName })}
        </Text>

        <Text className="text-foreground/70 text-sm mb-6">
          Join <strong>{brandName}</strong> and start collaborating on analyzing
          social media comments with AI-powered insights.
        </Text>
      </Section>

      {/* CTA Button */}
      <PrimaryButton href={url}>
        {t('mail.organizationInvitation.join')} →
      </PrimaryButton>

      {/* Divider */}
      <Hr className="border-border my-6" />

      {/* Alternative Link */}
      <Section className="text-center">
        <Text className="text-foreground/60 text-sm mb-2">
          {t('mail.common.openLinkInBrowser')}
        </Text>
        <Link
          href={url}
          className="text-primary hover:text-primary/80 text-sm break-all"
        >
          {url}
        </Link>
      </Section>

      {/* Footer */}
      <Section className="mt-8 pt-6 border-t border-border">
        <Text className="text-foreground/50 text-xs text-center">
          This invitation will expire in 7 days. If you don't want to join this
          team, you can safely ignore this email.
        </Text>
      </Section>
    </Wrapper>
  );
}

OrganizationInvitation.PreviewProps = {
  locale: defaultLocale,
  translations: defaultTranslations,
  url: '#',
  name: 'John Doe',
  brandName: 'Acme Corp'
};

export default OrganizationInvitation;
