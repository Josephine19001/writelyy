import type { Organization, Session } from '@repo/auth';
import { apiClient } from '@shared/lib/api-client';
import type { NextRequest } from 'next/server';

export const getSession = async (req: NextRequest): Promise<Session | null> => {
  // Use localhost for internal calls to avoid ngrok proxy issues
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000 '
      : req.nextUrl.origin;

  const response = await fetch(
    new URL('/api/auth/get-session?disableCookieCache=true', baseUrl),
    {
      headers: {
        cookie: req.headers.get('cookie') || '',
        // Add ngrok headers if present
        ...(req.headers.get('ngrok-skip-browser-warning') && {
          'ngrok-skip-browser-warning': 'true'
        })
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  try {
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error parsing session JSON:', error);
    return null;
  }
};

export const getOrganizationsForSession = async (
  req: NextRequest
): Promise<Organization[]> => {
  // Use localhost for internal calls to avoid ngrok proxy issues
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000 '
      : req.nextUrl.origin;

  const response = await fetch(
    new URL('/api/auth/organization/list', baseUrl),
    {
      headers: {
        cookie: req.headers.get('cookie') || '',
        // Add ngrok headers if present
        ...(req.headers.get('ngrok-skip-browser-warning') && {
          'ngrok-skip-browser-warning': 'true'
        })
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) ?? [];
};

export const getPurchasesForSession = async (
  req: NextRequest,
  organizationId?: string
) => {
  const response = await apiClient.payments.purchases.$get(
    {
      query: {
        organizationId
      }
    },
    {
      headers: {
        cookie: req.headers.get('cookie') || ''
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  const purchases = await response.json();

  return purchases;
};
