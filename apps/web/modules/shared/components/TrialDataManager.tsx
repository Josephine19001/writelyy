'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTrialData } from '../../marketing/hooks/useTrialData';
import { toast } from 'sonner';

interface TrialDataManagerProps {
  currentPage: 'humanizer' | 'detector' | 'summariser' | 'paraphraser';
  onTrialDataFound?: (content: string) => void;
}

export function TrialDataManager({ currentPage, onTrialDataFound }: TrialDataManagerProps) {
  const searchParams = useSearchParams();
  const { trialData, clearTrialData } = useTrialData();
  const isTrial = searchParams.get('trial') === 'true';

  useEffect(() => {
    // If this is a trial redirect and we have trial data for this product
    if (isTrial && trialData && trialData.product === currentPage) {
      // Restore the content
      onTrialDataFound?.(trialData.content);
      
      // Show welcome message
      toast.success(
        `Welcome! Your text has been restored. You have 1,000 free words to get started!`,
        {
          duration: 5000,
        }
      );
      
      // Clear the trial data since we've used it
      clearTrialData();
      
      // Clean up URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('trial');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [isTrial, trialData, currentPage, onTrialDataFound, clearTrialData]);

  // This component doesn't render anything
  return null;
}