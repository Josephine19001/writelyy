'use client';

import { useEffect, useState } from 'react';
import Tour from 'reactour';
import { authClient } from '@repo/auth/client';
import { useSession } from '@saas/auth/hooks/use-session';

interface AppTourProps {
  tourKey: string;
  steps: TourStep[];
  onComplete?: () => void;
}

interface TourStep {
  selector: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

export function AppTour({ tourKey, steps, onComplete }: AppTourProps) {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const hasCompletedTour = user?.completedTours?.includes(tourKey);

  useEffect(() => {
    if (!hasCompletedTour && user && steps.length > 0) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, user, steps.length]);

  const closeTour = async () => {
    setIsOpen(false);

    if (user && !hasCompletedTour) {
      try {
        const updatedCompletedTours = [...(user.completedTours || []), tourKey];
        await authClient.updateUser({
          completedTours: updatedCompletedTours
        });
        onComplete?.();
      } catch (error) {
        console.error('❌ Failed to save tour completion:', error);
      }
    }
  };

  const handleRequestClose = () => {
    closeTour();
  };

  // Don't render if user has already completed this tour
  if (hasCompletedTour || !user) {
    return null;
  }

  return (
    <Tour
      steps={steps}
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      rounded={12}
      accentColor="#007aff"
      showNumber={true}
      showButtons={true}
      showCloseButton={true}
      showNavigation={true}
      closeWithMask={false}
      disableInteraction={false}
      nextButton={
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Next
        </button>
      }
      prevButton={
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Previous
        </button>
      }
      lastStepNextButton={
        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Complete Tour
        </button>
      }
    />
  );
}

// Restart tour functionality
export async function restartTour(tourKey: string) {
  try {
    const { data: user } = await authClient.getSession();
    if (user) {
      const updatedCompletedTours = (user.user?.completedTours || []).filter(
        (tour: string) => tour !== tourKey
      );
      await authClient.updateUser({
        completedTours: updatedCompletedTours
      });
      // Refresh the page to restart the tour
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Failed to restart tour:', error);
  }
}

// Predefined tour steps
export const dashboardTourSteps: TourStep[] = [
  {
    selector: '[data-tour="welcome"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">🎉 Welcome to Writelyy!</h3>
        <p class="text-sm text-gray-600 mb-3">
          Let's take a quick tour to get you started with collecting and analyzing feedback from your social media content.
        </p>
        <p class="text-xs text-gray-500">
          This tour will show you the key features in just a few steps.
        </p>
      </div>
    `,
    position: 'center'
  },
  {
    selector: '[data-tour="organizations-grid"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">📊 Organizations Dashboard</h3>
        <p class="text-sm text-gray-600 mb-3">
          This is where you'll see all your organizations (projects). Each organization can have multiple social media posts and feedback data.
        </p>
        <p class="text-xs text-gray-500">
          Think of organizations as separate workspaces for different brands or projects.
        </p>
      </div>
    `,
    position: 'top'
  },
  {
    selector: '[data-tour="create-organization"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">➕ Create Organization</h3>
        <p class="text-sm text-gray-600 mb-3">
          Click here to create a new organization. You'll be able to add social media posts, collect comments, and analyze feedback for each organization.
        </p>
        <p class="text-xs text-gray-500">
          Start by creating your first organization to begin collecting feedback!
        </p>
      </div>
    `,
    position: 'left'
  },
  {
    selector: '[data-tour="sidebar"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">🧭 Navigation Menu</h3>
        <p class="text-sm text-gray-600 mb-3">
          Use this sidebar to navigate between different sections of your organization: Posts, Comments, Analytics, and Settings.
        </p>
        <p class="text-xs text-gray-500">
          The sidebar will be available once you create or select an organization.
        </p>
      </div>
    `,
    position: 'right'
  }
];

export { AppTour as default };
