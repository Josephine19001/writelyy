'use client';

import { useState, useEffect } from 'react';
import { OAuthIntegrationCard } from './OAuthIntegrationCard';

interface IntegrationsSettingsProps {
  organizationId: string;
}

interface StoredIntegration {
  id: string;
  type: 'JIRA' | 'NOTION';
  name: string;
  isActive: boolean;
  lastUsedAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  hasConfig: boolean;
}

const oauthIntegrations = [
  // {
  //   id: 'jira',
  //   provider: 'jira' as const,
  //   name: 'Jira',
  //   description:
  //     'Connect your Jira workspace to automatically create issues from requests.',
  //   benefits: [
  //     'Create issues directly from requests',
  //     'Auto-populate issue descriptions with user feedback',
  //     'Link back to original social media posts',
  //     'Track request priority and sentiment'
  //   ],
  //   comingSoon: true
  // },
  {
    id: 'notion',
    provider: 'notion' as const,
    name: 'Notion',
    description:
      'Connect your Notion workspace to create and organize feedback as database entries.',
    benefits: [
      'Create database entries from feedback',
      'Organize feedback with tags and properties',
      'Build comprehensive product roadmaps',
      'Collaborate with your team on priorities'
    ]
  }
  // {
  //   id: 'airtable',
  //   provider: 'airtable' as const,
  //   name: 'Airtable',
  //   description:
  //     'Connect your Airtable base to automatically create records from requests.',
  //   benefits: [
  //     'Create records directly from requests',
  //     'Organize feedback with custom fields and views',
  //     'Build comprehensive product databases',
  //     "Collaborate with your team using Airtable's interface"
  //   ],
  //   comingSoon: true
  // }
];

export function IntegrationsSettings({
  organizationId
}: IntegrationsSettingsProps) {
  const [storedIntegrations, setStoredIntegrations] = useState<
    StoredIntegration[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/integrations`
        );

        if (response.ok) {
          const data = await response.json();
          setStoredIntegrations(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, [organizationId]);

  const handleConnectionChange = () => {
    // Refresh integrations list when a connection changes
    setLoading(true);
    const fetchIntegrations = async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/integrations`
        );

        if (response.ok) {
          const data = await response.json();
          setStoredIntegrations(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  };

  const getIntegrationInfo = (provider: 'jira' | 'notion' | 'airtable') => {
    // For coming soon integrations, return not connected
    if (provider === 'airtable' || provider === 'jira') {
      return {
        isConnected: false,
        connectionInfo: undefined
      };
    }

    const stored = storedIntegrations.find(
      (integration) => integration.type.toLowerCase() === provider
    );

    return {
      isConnected: stored?.isActive || false,
      connectionInfo: stored
        ? {
            lastUsedAt: stored.lastUsedAt || undefined,
            workspace_name: stored.name,
            site_name: stored.name
          }
        : undefined
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Integrations</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect your favorite tools to automatically export feedback and
          insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {oauthIntegrations.map((integration) => {
          const { isConnected, connectionInfo } = getIntegrationInfo(
            integration.provider
          );

          return (
            <OAuthIntegrationCard
              key={integration.id}
              organizationId={organizationId}
              integration={integration}
              isConnected={isConnected}
              connectionInfo={connectionInfo}
              onConnectionChange={handleConnectionChange}
            />
          );
        })}
      </div>
    </div>
  );
}
