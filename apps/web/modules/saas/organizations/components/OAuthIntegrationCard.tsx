'use client';

import { useState } from 'react';
import { Button } from '@ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { getIntegrationIcon } from '@saas/shared/components/IntegrationIcons';
import {
  ExternalLinkIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  BookOpenIcon,
  Settings2Icon
} from 'lucide-react';
import { Alert, AlertDescription } from '@ui/components/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@ui/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/tabs';
import demo1 from '../../../../public/images/notion-demo/demo-1.png';
import demo2 from '../../../../public/images/notion-demo/demo-2.png';
import jiraDemo1 from '../../../../public/images/jira-demo/demo-1.png';
import jiraDemo2 from '../../../../public/images/jira-demo/demo-2.png';
import { NotionFieldMappingConfig } from './NotionFieldMappingConfig';
import { toast } from 'sonner';

interface OAuthIntegrationCardProps {
  organizationId: string;
  integration: {
    id: string;
    name: string;
    description: string;
    benefits: string[];
    provider: 'jira' | 'notion' | 'airtable';
    comingSoon?: boolean;
  };
  isConnected?: boolean;
  connectionInfo?: {
    workspace_name?: string;
    site_name?: string;
    lastUsedAt?: string;
  };
  onConnectionChange?: () => void;
}

export function OAuthIntegrationCard({
  organizationId,
  integration,
  isConnected = false,
  connectionInfo,
  onConnectionChange
}: OAuthIntegrationCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showFieldMapping, setShowFieldMapping] = useState(false);

  const handleConnect = async () => {
    // Don't allow connection for coming soon integrations
    if (integration.comingSoon) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Get OAuth authorization URL
      const response = await fetch(
        `/api/organizations/${organizationId}/integrations/oauth/${integration.provider}/authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Redirect to OAuth provider
        window.location.href = data.data.authUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate OAuth');
      }
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      // First, get the list of integrations to find the actual integration ID
      const integrationsResponse = await fetch(
        `/api/organizations/${organizationId}/integrations`
      );

      if (!integrationsResponse.ok) {
        throw new Error('Failed to fetch integrations');
      }

      const integrationsData = await integrationsResponse.json();
      const storedIntegration = integrationsData.data.find(
        (int: any) => int.type.toLowerCase() === integration.provider
      );

      if (!storedIntegration) {
        throw new Error('Integration not found');
      }

      // Delete the integration
      const deleteResponse = await fetch(
        `/api/organizations/${organizationId}/integrations/${storedIntegration.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.error || 'Failed to disconnect integration');
      }

      // Notify parent component to refresh the connection status
      onConnectionChange?.();

      // Show success toast
      toast.success(
        `${integration.name} integration disconnected successfully`
      );
    } catch (error) {
      console.error('Disconnect failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect');

      // Show error toast
      toast.error(
        `Failed to disconnect ${integration.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getActionButton = () => {
    // Show Coming Soon button for integrations marked as coming soon
    if (integration.comingSoon) {
      return (
        <Button
          disabled
          className="w-full bg-orange-500 hover:bg-orange-500 text-white cursor-not-allowed opacity-75"
        >
          Coming Soon
        </Button>
      );
    }

    if (isConnecting) {
      return (
        <Button disabled className="w-full">
          <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </Button>
      );
    }

    if (isDisconnecting) {
      return (
        <Button disabled className="w-full">
          <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
          Disconnecting...
        </Button>
      );
    }

    if (isConnected) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="flex-1"
            disabled={isDisconnecting}
          >
            Disconnect
          </Button>
          <Button onClick={handleConnect} className="flex-1">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        </div>
      );
    }

    return (
      <Button onClick={handleConnect} className="w-full">
        <ExternalLinkIcon className="h-4 w-4 mr-2" />
        Connect with {integration.name}
      </Button>
    );
  };

  return (
    <Card className="relative flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIntegrationIcon(integration.provider, { size: 48 })}
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="text-sm">
                {integration.description}
              </CardDescription>
            </div>
          </div>
          <Badge
            className={`px-3 py-1 whitespace-nowrap ${
              integration.comingSoon
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : isConnected
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}
          >
            {integration.comingSoon
              ? 'Coming Soon'
              : isConnected
                ? 'Connected'
                : 'Not Connected'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end space-y-4">
        {/* Error Display */}
        {error && (
          <Alert variant="error">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Setup Guide for Notion */}
        {integration.provider === 'notion' && isConnected && (
          <div className="mb-4 space-y-2">
            <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
              {/* <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  View Database Setup Guide
                </Button>
              </DialogTrigger> */}
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Notion Database Setup Guide</DialogTitle>
                  <DialogDescription>
                    Follow these steps to set up your Notion database for
                    request management.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Required Structure */}
                  <div>
                    <h3 className="font-semibold text-base mb-3">
                      Required Database Structure
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="font-medium mb-3 text-sm">
                        Your Notion database must include these properties:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Title
                            </strong>{' '}
                            - Text field for request name
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Priority
                            </strong>{' '}
                            - Select field with options: High, Medium, Low
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Status
                            </strong>{' '}
                            - Select field with options: Backlog, Not Started
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Examples with Tabs */}
                  <div>
                    <h3 className="font-semibold text-base mb-3">
                      Setup Examples
                    </h3>
                    <Tabs defaultValue="example1" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="example1">
                          Example 1: Basic Setup
                        </TabsTrigger>
                        <TabsTrigger value="example2">
                          Example 2: Detailed View
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="example1" className="mt-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Create a new database with the required properties
                            in Kanban view
                          </p>
                          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                            <img
                              src={demo1.src}
                              alt="Notion database setup showing Title, Priority, and Status columns in Kanban view"
                              className="w-full h-auto max-w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="example2" className="mt-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Configure Priority and Status select options in
                            table view with all properties visible
                          </p>
                          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                            <img
                              src={demo2.src}
                              alt="Notion database with configured Priority (High/Medium/Low) and Status (Backlog/Not Started) options in table view"
                              className="w-full h-auto max-w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Note */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Once your database is set up
                      correctly, you can manually sync requests to your Notion
                      workspace using the integration features.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Field Mapping Configuration */}
            <Dialog open={showFieldMapping} onOpenChange={setShowFieldMapping}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings2Icon className="h-4 w-4 mr-2" />
                  Configure Field Mappings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl  max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configure Notion Field Mappings</DialogTitle>
                  <DialogDescription>
                    Map your Notion database fields to different content types
                    (features, issues, questions).
                  </DialogDescription>
                </DialogHeader>

                <NotionFieldMappingConfig />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Setup Guide for Jira */}
        {integration.provider === 'jira' && isConnected && (
          <div className="mb-4">
            <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  View Project Setup Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Jira Project Setup Guide</DialogTitle>
                  <DialogDescription>
                    Follow these steps to set up your Jira project for feature
                    request management.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Required Structure */}
                  <div>
                    <h3 className="font-semibold text-base mb-3">
                      Required Project Setup
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="font-medium mb-3 text-sm">
                        Create or configure a project with these settings:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Project Name
                            </strong>{' '}
                            - "Writelyy Feature Discoveries" or similar
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Project Key
                            </strong>{' '}
                            - "LFD" (or custom key of your choice)
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Project Type
                            </strong>{' '}
                            - "Product Discovery" or "Software Development"
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">
                              Issue Types
                            </strong>{' '}
                            - Include "Story" or "Feature" issue types
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Examples with Tabs */}
                  <div>
                    <h3 className="font-semibold text-base mb-3">
                      Setup Examples
                    </h3>
                    <Tabs defaultValue="example1" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="example1">
                          Example 1: Project Overview
                        </TabsTrigger>
                        <TabsTrigger value="example2">
                          Example 2: Project Settings
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="example1" className="mt-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Create a new project with "Writelyy Feature
                            Discoveries" name and "LFD" key
                          </p>
                          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                            <img
                              src={jiraDemo1.src}
                              alt="Jira project setup showing Writelyy Feature Discoveries project with LFD key"
                              className="w-full h-auto max-w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="example2" className="mt-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Configure your project settings and ensure it
                            supports Story or Feature issue types
                          </p>
                          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                            <img
                              src={jiraDemo2.src}
                              alt="Jira project configuration showing issue types and project details"
                              className="w-full h-auto max-w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Note */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Once your project is set up
                      correctly, you can manually sync requests to create
                      tickets in your Jira project using the integration
                      features.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">{getActionButton()}</div>
      </CardContent>
    </Card>
  );
}
