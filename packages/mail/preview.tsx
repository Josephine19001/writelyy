import { render } from '@react-email/render';
import { EmailVerification } from './emails/EmailVerification';
import { ForgotPassword } from './emails/ForgotPassword';
import { MagicLink } from './emails/MagicLink';
import { NewUser } from './emails/NewUser';
import { OrganizationInvitation } from './emails/OrganizationInvitation';
import { defaultLocale, defaultTranslations } from './src/util/translations';

// Preview all email templates with sample data
const previewData = {
  locale: defaultLocale,
  translations: defaultTranslations,
  url: 'https://loplyy.app/verify?token=sample-token',
  name: 'Sarah Johnson',
  brandName: 'Writelyy AI Team'
};

export async function previewEmails() {
  // Email Verification
  const emailVerification = render(<EmailVerification {...previewData} />);

  // Forgot Password
  const forgotPassword = render(<ForgotPassword {...previewData} />);

  // Magic Link
  const magicLink = render(<MagicLink {...previewData} />);

  // New User
  const newUser = render(<NewUser {...previewData} />);

  // Organization Invitation
  const orgInvitation = render(<OrganizationInvitation {...previewData} />);

  return {
    emailVerification,
    forgotPassword,
    magicLink,
    newUser,
    orgInvitation
  };
}

// Run preview if this file is executed directly
if (require.main === module) {
  previewEmails().catch(console.error);
}
